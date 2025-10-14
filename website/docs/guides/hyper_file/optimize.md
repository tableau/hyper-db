# Optimize Hyper File Storage

Hyper files (`.hyper`) store data in a proprietary, optimized database format.
Like any file system or database that supports write, update, and delete operations, with heavy active use, the data can become fragmented over time resulting in larger files and increased query latencies.
To improve the performance of your `.hyper` extract files, you can follow these guidelines.

## Use the latest Hyper file format

By default, Hyper will always use the database file format version 0 for maximum compatibility. Version 0 is guaranteed to be always supported by every version of Hyper, and you should be able to open these files in very old versions of Hyper or Tableau if you need to.

However, if you know that you'll only be using currently supported versions of Hyper or Tableau to open your Hyper files, it is recommended to use the latest database file format version.
New file format versions often include relevant performance improvements (for example, later versions improve compression drastically on files with deleted rows).
You can find a list of database file format versions and improvements introduced in these versions [here](../../hyper-api/hyper_process#default_database_version).

To use a specific database file format version, you'll need to use the `default_database_version` setting. For example, to use format version 2, set `default_database_version=2`.

Using the latest available database file format version should lessen the need to manually defragment or otherwise optimize your file for size or performance.
However, for extremely fragmented files you might still benefit from manually optimizing your file.

## Rewrite your Hyper file in an optimized format

If you have a Hyper file that has become fragmented or is still using an older file version where you want to take advantage of new version features, you can
update your existing Hyper databases by checking the version and updating the version prior to performing other operations on them. For instance the Python script
below does this while maintaining a backup of the old Hyper file.

```python
import os
from tableauhyperapi import HyperProcess, Connection, Telemetry, CreateMode

TARGET_DATABASE_VERSION = "2"

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU,
            parameters = {"default_database_version": TARGET_DATABASE_VERSION}) as hyper:
    should_update_version = False
    with Connection(hyper.endpoint, 'existing.hyper', CreateMode.CREATE_IF_NOT_EXISTS) as connection:
        # check the current version of the extract

        version = connection.execute_scalar_query("SELECT database_version from pg_catalog.hyper_database")
        if version < TARGET_DATABASE_VERSION:
            print(f'found version {version}, upgrading to version {TARGET_DATABASE_VERSION}')
            should_update_version = True

    if should_update_version:
        with Connection(hyper.endpoint) as connection:
            connection.execute_command(f"""
                CREATE DATABASE "updatedversion.hyper" WITH VERSION {TARGET_DATABASE_VERSION} FROM "existing.hyper"
            """)
        # make a backup of the existing hyper file - will overwrite any existing file
        os.replace("existing.hyper", "existing.bak.hyper")

        # rename the new file to match old database name
        os.replace("updatedversion.hyper", "existing.hyper")
    with Connection(hyper.endpoint, 'existing.hyper', CreateMode.CREATE_IF_NOT_EXISTS) as connection:
        # perform normal operations on connection
        ...
```

## Guidelines for avoid fragmentation

The level of file compression in a `.hyper` file depends both on the characteristics of the contained data but also on the insertion/deletion patterns that you use. If you expect to repeatedly delete, insert, or update rows of data, there are patterns that are more likely to achieve optimal file compression, and others that are more likely to result in file fragmentation.

You can optimally compress a `.hyper` file if:

* The deletion precedes the insertion and the file is closed or unloaded in between operations.

* The deletion affects a continuous section of data.

The `.hyper` file can become fragmented if you delete noncontinuous ranges of rows. Fragmentation can make it harder to re-use the space where the data was deleted, and can complicate how the `.hyper` file is compressed when it is written to disk. Fragmentation really only becomes an issue when you have large amounts of data.

In general, it is better to order your data in such a way that deletion and insertion patterns cover the largest possible continuous ranges. If you feel that your `.hyper` file is too fragmented, you can use a Python script that is available on the Hyper API Samples project on GitHub to defragment your file. See [Rewrite your Hyper file in an optimized format](#rewrite-your-hyper-file-in-an-optimized-format).
