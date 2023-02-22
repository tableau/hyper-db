---
title: Optimize Hyper File Storage
---

Tableau extract files (`.hyper`) store data in a proprietary, optimized database format. Like any file system or database that supports write, update, and delete operations, with heavy active use, the data can become fragmented over time resulting in inefficient use of space and increased latency in access. To improve the performance of your `.hyper` extract files, you can follow these guidelines.

**In this section**

* TOC
{:toc}

---

## Guidelines for improving file compression

The level of file compression in a `.hyper` file depends both on the characteristics of the contained data but also on the insertion/deletion patterns that you use. If you expect to repeatedly delete, insert, or update rows of data, there are patterns that are more likely to achieve optimal file compression, and others that are more likely to result in file fragmentation.

---

You can optimally compress a `.hyper` file if:

* The deletion precedes the insertion and the file is closed or unloaded in between operations.

* The deletion affects a continuous section of data.

For example:

* You have a table that has one integer column with the values 10,11,12,13,14,15,16 (inserted in this order).

* You delete values 10,11,12

* You insert values 2,3,4

---

The `.hyper` file can become fragmented if you delete noncontinuous ranges of rows. Fragmentation can make it harder to re-use the space where the data was deleted, and can complicate how the `.hyper` file is compressed when it is written to disk. Fragmentation really only becomes an issue when you have large amounts of data.

For example, the following illustrates a simple case of deleting an noncontinuous range:

* You have a table that contains the integer values 10,11,12,13,14,15,16

* You delete values 10,14,16

* You insert values 2,3,4

---

In general, it is better to order your data in such a way that deletion and insertion patterns cover the largest possible continuous ranges. If you feel that your `.hyper` file is too fragmented, you can use a Python script that is available on the Hyper API Samples project on GitHub to defragment your file. See [Rewrite your Hyper file in an optimized format](#rewrite-your-hyper-file-in-an-optimized-format).

## Use the latest Hyper file format

By default, Hyper will always use the database file format version 0 for maximum compatibility. Version 0 is guaranteed to be always supported by every version of Hyper, and you should be able to open these files in very old versions of Hyper or Tableau if you need to.

However, if you know that you'll only be using currently supported versions of Hyper or Tableau to open your extracts, it might be beneficial to use the latest database file format version. New file format versions often include relevant performance improvements (for example, later versions improve compression drastically on files with deleted rows). You can find a list of database file format versions and improvements introduced in these versions [here](https://help.tableau.com/current/api/hyper_api/en-us/reference/sql/databasesettings.html#DEFAULT_DATABASE_VERSION).

To use a specific database file format version, you'll need to use the `default_database_version` setting. For example, to use format version 2, set `default_database_version=2`.

Using the latest available database file format version should lessen the need to manually defragment or otherwise optimize your file for size or performance. However, for extremely fragmented files you might still benefit from manually optimizing your file. Continue on to the next section to learn how to [rewrite your Hyper file in an optimized format](#rewrite-your-hyper-file-in-an-optimized-format).

## Rewrite your Hyper file in an optimized format

If you have a Hyper file that has become fragmented, one simple solution is to create a new file and copy all the data into it. There is a sample tool that does just that in the [Hyper API Samples](https://github.com/tableau/hyper-api-samples) on GitHub.

* Get the code [`defragment_data_of_existing_hyper_file.py`](https://github.com/tableau/hyper-api-samples/tree/main/Community-Supported/defragment-hyper-file/defragment_data_of_existing_hyper_file.py)
* See the [README](https://github.com/tableau/hyper-api-samples/tree/main/Community-Supported/defragment-hyper-file) on GitHub

The Python script uses the Hyper API to copy all the schemas and tables in an existing `.hyper` file and writes them into a new file in a continuous sequence, eliminating any fragmentation that might have occurred.
