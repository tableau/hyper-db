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

## Rewrite your Hyper file in an optimized format {#rewrite-your-hyper-file-in-an-optimized-format}

If you have a Hyper file that has become fragmented or is still using an older file version, one simple solution is to create a new file and copy all the data into it.
There is a [script that does just that](https://github.com/tableau/hyper-api-samples/tree/main/Community-Supported/convert-hyper-file) available on Github.

The Python script uses the Hyper API to copy all the schemas and tables in an existing `.hyper` file and writes them into a new file in a continuous sequence, eliminating any fragmentation that might have occurred.
By creating the new `.hyper` file with the intended new file format version, you can upgrade / downgrade between the various Hyper file versions.

## Guidelines for avoid fragmentation

The level of file compression in a `.hyper` file depends both on the characteristics of the contained data but also on the insertion/deletion patterns that you use. If you expect to repeatedly delete, insert, or update rows of data, there are patterns that are more likely to achieve optimal file compression, and others that are more likely to result in file fragmentation.

You can optimally compress a `.hyper` file if:

* The deletion precedes the insertion and the file is closed or unloaded in between operations.

* The deletion affects a continuous section of data.

The `.hyper` file can become fragmented if you delete noncontinuous ranges of rows. Fragmentation can make it harder to re-use the space where the data was deleted, and can complicate how the `.hyper` file is compressed when it is written to disk. Fragmentation really only becomes an issue when you have large amounts of data.

In general, it is better to order your data in such a way that deletion and insertion patterns cover the largest possible continuous ranges. If you feel that your `.hyper` file is too fragmented, you can use a Python script that is available on the Hyper API Samples project on GitHub to defragment your file. See [Rewrite your Hyper file in an optimized format](#rewrite-your-hyper-file-in-an-optimized-format).
