# Releases

New versions of Hyper API are released roughly once per month.
Below you can find the latest downloads and the new functionalities and bug fixes which shipped with each version.

## Download {#download}

<p>The latest available version is <b>v{config.version_short}</b>.</p>

```mdx-code-block
import {DownloadPicker} from '@site/src/components/DownloadPicker'
import {config} from '@site/src/config';

<DownloadPicker />
```

## Release Notes

:::note

In case you are wondering why all our functions start with `0.0`, read [this FAQ entry](/docs/faq#why-does-hyperapi-only-have-00-versions).

:::

### v0.0.16868 [April 5, 2023]

* Introduced `approx_count_distinct` aggregate
  * It can be used to compute an approximation to exact count distinct with configurable relative error.
  * E.g., the query `select approx_count_distinct(x) from generate_series(1,pow(10,6)) s(x)` returns `960712`.
  * A relative error argument is supported as well, e.g., `select approx_count_distinct(x, 0.002) from generate_series(1,pow(10,6)) s(x)` returns `998192`, a much better estimate with relative error under `0.2%` (the default value if omitted is `2.3%` relative error accuracy).
  * In general, `approx_count_distinct(c, e)` uses less memory than `count(distinct c)` and is faster. This makes it a good option when exact distinct count is not required.

### v0.0.16638 [March 1, 2023]

* Updated OpenSSL version from 1.1.1q to 1.1.1t.
* IANA released version 2022g of the Time Zone Database. Hyper’s time zone information is updated accordingly. Noteworthy changes:
  * Jordan and Syria switched from +02/+03 with DST to year-round +03
  * Mexico no longer observes DST except near the US border
  * Chihuahua moved to year-round -06 on 2022-10-30
  * Fiji no longer observes DST
  * Simplified four Ontario zones
  * The northern edge of Chihuahua changed to US timekeeping
  * Much of Greenland stops changing clocks after March 2023
  * Fixed some pre-1996 timestamps in northern Canada

### v0.0.16491 [February 8, 2023]

* Added support for the [`GROUPING SETS` SQL feature](/docs/sql/command/select#grouping-sets), including `ROLLUP` and `CUBE`.


### v0.0.16377 [January 18, 2023]

* Minor improvements and bug fixes.

### v0.0.16123 [December 7, 2022]

* Added support for 128-bit numerics. This allows a precision of up to 38 for the `NUMERIC` SQL type.
* Added support to read 128-bit `DECIMAL` values from parquet files.
* Overhauled the [SQL type propagation rules for the `NUMERIC` data type](/docs/sql/datatype/numeric).
* Improved partition pruning support when querying Apache Iceberg. This should speed up queries with
  equality predicates on Iceberg columns partitioned with bucket partitioning.
* New `ANY_VALUE` aggregate function: The `ANY_VALUE` aggregate function returns an arbitrary, implementation-defined value from the set of input values within a group.

### v0.0.15888 [November 9, 2022]
* IANA released version `2022d` of the Time Zone Database. Hyper's time zone information is updated accordingly. Noteworthy changes:
    * Palestine daylight savings time (DST) transitions are now Saturdays at 02:00 (24-hour clock).
    * Simplified three Ukrainian zones into one.

### v0.0.15735 [October 5, 2022]

* New support for Apache Iceberg as an [external format](docs/sql/external/).
* Support for reading external files from S3 is now enabled by default. (The experimental_external_s3 setting has been removed. Specifying it now causes an unknown setting error.)
* "New convenience functions to extract date and time units:
  * New [YEAR](/docs/sql/scalar_func/datetime#functions) function: extracts the year of a timestamp or interval.
  * New [QUARTER](/docs/sql/scalar_func/datetime#functions) function: extracts the quarter of a timestamp.
  * New [MONTH](/docs/sql/scalar_func/datetime#functions) function: extracts the month of a timestamp or interval.
  * New [WEEK](/docs/sql/scalar_func/datetime#functions) function: extracts the week of a timestamp.
  * New [DAY](/docs/sql/scalar_func/datetime#functions) function: extracts the day of a timestamp or interval.
  * New [HOUR](/docs/sql/scalar_func/datetime#functions) function: extracts the hour of a timestamp or interval.
  * New [MINUTE](/docs/sql/scalar_func/datetime#functions) function: extracts the minute of a timestamp or interval.
  * New [SECOND](/docs/sql/scalar_func/datetime#functions) function: extracts the second of a timestamp or interval.
* IANA released version `2022c` of the Time Zone Database. Hyper's time zone information is updated accordingly. Noteworthy changes:
    * Chile's DST is delayed by a week in September 2022.
    * Iran no longer observes DST after 2022.
    * Renamed Europe/Kiev to Europe/Kyiv.
    * Fixes to support timestamps prior to 1970.

### v0.0.15530 [September 7, 2022]

* To read external data from Amazon S3, you must now provide credentials when using the extended syntax `s3_location(...)`. Omitting credentials now causes an error. For anonymous access to S3 provide empty credentials (`""`) instead.

### v0.0.15305 [August 3, 2022]

* Minor improvements and bug fixes.

### v0.0.15145 [July 13, 2022]

* Added ZSTD and LZ4_RAW compression support for Parquet files.
* Updated OpenSSL version from 1.1.1n to 1.1.1q.
* IANA released version `2022a` of the Time Zone Database. Hyper's time zone information is updated accordingly. Noteworthy changes:
    * Palestine will spring forward on `2022-03-27`, not `2022-03-26`.
    * From 1992 through spring 1996, Ukraine's DST transitions were at `02:00 standard time`, not at `01:00 UTC`.
    * Chile's Santiago Mean Time and its LMT precursor have been adjusted eastward by 1 second to align with past and present law.
* Updated Hyper's collation tables from CLDR 38.1 to CLDR 41. Besides corrections this also adds new collations to Hyper.
* Updated Unicode support from Unicode 13.0.0 to 14.0.0.

### v0.0.14946 [June 1, 2022]

* Updated OpenSSL version from 1.1.1l to 1.1.1n.
* New [TRY_CAST](/docs/sql/scalar_func/conversion) function: converts a value to a target type, returns NULL on failure.

### v0.0.14751 [May 4, 2022]

* Restriction pushdown for Parquet files: Hyper now exploits min/max values in Parquet RowGroups to skip groups based on the predicates present in SQL queries.
* Besides many corrections, this update also adds a significant number of new collations to Hyper. Previously, the collations Hyper used were based on CLDR 1.8 from March 2010.
* C++: Fixed inserting and querying columns of type CHAR(1).
* Fixed empty strings of type CHAR(1) being returned as a space instead of '\0'.
* Fixed a defect which could lead to Hyper crashing when using outer joins with Parquet files.
* Fixed a defect which prevented Hyper from opening external files from Amazon S3 if the S3 URL contained a whitespace character, e.g. "s3://bucket/filename with whitespace.csv"

### v0.0.14567 [March 23, 2022]

* Result fetching of large results is up to 5x faster.
* Fix a potential crash when reading multiple Parquet files with string columns.

### v0.0.14401 [March 2, 2022]

* Introduced the new and improved database file format version 2 that can be used via [Hyper Process Settings](/docs/hyper-api/hyper_process). The new format stores data independent of collation versions. File format 1 is deprecated in favor of the new file format 2. Refer to [Hyper Database Settings](/docs/hyper-api/hyper_process#default_database_version) for more information.
* Added support for S3 keys containing special characters (such as "=")
* Implemented support for [external(source_location(...))](/docs/sql/setreturning#srf-external) syntax.

### v0.0.14265 [February 2, 2022]

Improved external file format support (CSV & Apache Parquet): Now you can use Hyper as a SQL
query engine directly on top of open formats and data lakes.
  * Hyper now has experimental support for reading external data directly from Amazon S3. You need to enable the
    [experimental_external_s3](/docs/hyper-api/hyper_process#experimentalsettings)
    setting to use this feature and be aware that it can **change or be removed at any time without prior notice**.

    Hyper's S3 capabilities are highly optimized
    (using techniques such as concurrent requests, request hedging and prefetching). For maximum performance,
    ensure a high network bandwidth to Amazon S3, e.g., by running HyperAPI directly on an AWS EC2 instance.
  * Temporary external tables: The new
    [CREATE TEMPORARY EXTERNAL TABLE](/docs/sql/command/create_external_table)
    command exposes external data to SQL as if it was a Hyper table, but the data is read directly
    from the external file whenever the external table is referenced in a query.
  * The new function [external](/docs/sql/setreturning#srf-external),
    enables reading external data directly in a SQL query without creating an external table.
  * Aligned the syntax of the [COPY](/docs/sql/command/copy_from)
    statement with the syntax for external tables and the `external` function.
    The old syntax is still supported for PostgreSQL compatibility but its use is discouraged.
  * The new `ARRAY[...]` syntax enables reading from multiple files when using the `external` function, external tables,
    or the `COPY` command.
  * Graceful handling of invalid UTF-8 sequences:
    The new [SANITIZE](/docs/sql/external/formats#format-options)
    option instructs Hyper to replace invalid UTF-8 sequence with the replacement character (�) instead of failing the query with an error.
  * Improved support for reading CSV files:
    * GZip-compressed CSV files: CSV files ending in `.gz` will automatically be assumed to be GZip-compressed.
    * UTF-16 encoded CSV files: UTF-16 reading can be enabled using the new
      [ENCODING](/docs/sql/external/formats#format-options)
      option.
    * Graceful cast failure handling: When a value in the file cannot be cast
      to the target type, the new
      [ON_CAST_FAILURE](/docs/sql/external/formats#format-options)
      option instructs Hyper to read the value as NULL instead of raising an error.

### v0.0.14109 [January 5, 2022]

* Minor improvements and bug fixes.

### v0.0.13980 [December 8, 2021]
* Smaller packages: Thanks to the removal of unused collation data from the Hyper binary, the package size was reduced. For example, the size of an unpacked Windows Python installation went from 157 MB to 145 MB. The download size of a packed Windows Python package was reduced from 47 MB to 42 MB.
* Java: Improved the read performance of text and geography columns.
* Fixed a defect that could lead to crashes when reading Parquet files with text columns that contain null values.
* Fixed a defect that could lead to Hyper sorting and comparing text with the "ro" locale incorrectly.
* IANA released new versions of the Time Zone Database. This commit updates Hyper's Time Zone Database to release 2021e.

Noteworthy changes in the Time Zone Database:

    * Palestine will fall back 10-29 (not 10-30) at 01:00.
    * Fiji suspends DST for the 2021/2022 season.
    * Jordan now starts DST on February's last Thursday.
    * Samoa no longer observes DST.
    * Merge more location-based Zones whose timestamps agree since 1970.
    * Rename Pacific/Enderbury to Pacific/Kanton.

### v0.0.13821 [November 3rd, 2021]
* Reading Apache Parquet files is now officially supported and no longer has to be enabled through the use of the process setting ‘experimental_external_format_parquet’.
* Improved performance for window functions for large data sets on multi-core machines:
    * calls without `PARTITION BY` clause improved by 5% - 20%
    * calls without `PARTITION BY` and `ORDER BY` clauses, e.g. `ROW_NUMBER() OVER()`, by 10% - 25%
* Fixed a defect that could cause crashes when you deleted a tuple multiple times, or could cause wrong query results after single deletion.
* Updated OpenSSL version from 1.1.1k to 1.1.1l

### v0.0.13617 [October 6, 2021]

* Fix a query compilation defect that led to reproducible crashes for a very small number of queries.
* Upgraded Unicode support from Unicode 9.0.0 to 13.0.0

### v0.0.13394 [September 1, 2021]

* Hyper API now runs on AWS lambda.
* Parquet files with dots in their column names can now be read.
* Column references can now be qualified with database alias (e.g., `SELECT db.schema.table.column ...`)
* More actionable error messages for a wide range of invalid SQL queries.
* Going forward, the Hyper API will only support the three most recent versions of Python. Currently, those versions are 3.7, 3.8, and 3.9. However, the Hyper API will continue to support Python 3.6 for a transition period of three months.

### v0.0.13287 [August 4, 2021]

* Java: Dependencies are updated to newer versions. In particular, JNA was updated to 5.6.0.

### v0.0.13129 [July 7, 2021]

* Minor improvements and bug fixes.

### v0.0.12982 [June 9, 2021]

* Fixed a problem that could corrupt databases in rare cases when the [new file format](/docs/hyper-api/hyper_process#default_database_version) has explicitly been enabled by the user. This problem did not affect the default file format.
* Updated OpenSSL dependency from 1.1.1g to 1.1.1k.

### v0.0.12805 [May 19, 2021]

* Hyper now has experimental support for reading Apache Parquet files. See [Hyper API SQL documentation](/docs/sql/command/copy_from#sql-copy-examples) for details.
* Hyper now adjusts the resulting interval from a timestamp subtraction so that 24-hour time periods are represented as days.
* Hyper now supports +/-13 and +/-14 as timezone offsets.
* Python: The most commonly used Hyper API types now have `__repr__()` methods and will return a string representation of the object when printed, making interactive exploring of the Hyper API more fun.
* Improved handling of spatial types:
    * Parsing GEOGRAPHY values from well-known text (WKT) format automatically adjusts the order of vertices in polygons.
    * During WKT parsing, additional vertices may be added to more closely resemble the original shape specified in the WKT.

### v0.0.12514 [April 7, 2021]

* Fixed a rare defect where queries could return incorrect results after tuples at the end of a table were deleted.

### v0.0.12366 [March 10, 2021]

* Improved performance for complex queries thanks to improved join ordering.
* Fixed a defect where Hyper would use too much memory when executing string expressions in certain contexts.

### v0.0.12249 [February 17, 2021]

* IANA released version `2021a` of the Time Zone Database. Hyper's time zone information is updated accordingly. Noteworthy changes:
    * Revised predictions for Morocco's changes starting in 2023.
    * Canada's Yukon changes to `-07` on `2020-11-01`, not `2020-03-08`.
    * Macquarie Island has stayed in sync with Tasmania since 2011.
    * Casey, Antarctica is at `+08` in winter and `+11` in summer.
    * Fiji starts DST later than usual, on `2020-12-20`.
    * Palestine ends DST earlier than predicted, on `2020-10-24`.
    * Volgograd switches to Moscow time on `2020-12-27` at `02:00`.
    * South Sudan changes from `+03` to `+02` on `2021-02-01` at `00:00`.
* Added additional information to certain Hyper API exceptions that previously contained only their context id.

### v0.0.12005 [January 20, 2021]

* Introduced a new and improved database file format that can be used via [Hyper Process Settings](/docs/hyper-api/hyper_process). Refer to [Hyper Database Settings](/docs/hyper-api/hyper_process#default_database_version) for more information.
* Clarified the `Create hyper file from csv` example: We highlight the usage of the `HEADER` COPY option which ignores the first line in a csv file.
* Java: Fixed the `getShort()` method to return a `short` instead of an `int`.

### v0.0.11952 [December 16, 2020]

* When Hyper is running inside a container, such as Docker, Hyper now respects the memory limits that are set for the container.

### v0.0.11889 [December 2, 2020]

* Fixed a parsing error that could lead to a failure to connect to a Hyper database. This error could occur with certain operating system configurations if you were using special UTF-8 characters as the database name.

### v0.0.11691 [November 9, 2020]

* Faster initialization of `HyperProcess`: Starting Hyper is now 4x faster. For example, on our internal Linux computers, we measured 11 milliseconds startup time instead of previously 44 milliseconds.
* Python: `TableDefinition.Column.collation` represents the default collation with `None` now. Previously, the results of `catalog.get_table_definition` used `''` for the default collation. This is a breaking change.

### v0.0.11556 [September 30, 2020]

* C++: Fixed a bug that could have lead to wrong or missing results when multiple `ResultIterator` or `ChunkIterator` iterators are constructed over the same `hyperapi::Result` object.
* C++: Interface fix: Removed an incorrect `noexcept` specification from the `ResultIterator()` and `ChunkedIterator()` constructors for begin iterators. These functions may fail by throwing `std::bad_alloc` or `hyperapi::HyperException`. Those were previously flagged as `noexcept` even though they could have thrown.
* Removed support for the PostgreSQL legacy end-of-data marker `\.`. The marker could be used to mark the end of CSV and TEXT input. Hyper now solely relies on the end-of-file condition to determine the end.

### v0.0.11355 [August 26, 2020]

* Removed the following settings for the `HyperProcess` class that were deprecated since version 0.0.10309:
    * `log-dir`: Use `log_dir` instead.
    * `:restrict_database_directory`: Not required since Hyper no longer creates database files in the working directory.
    * `:database_directory`: Not required since Hyper no longer creates database files in the working directory.
    * `:log_file_size_limit`: Use `log_file_size_limit` instead.
    * `:log_file_max_count`: Use `log_file_max_count` instead.

### v0.0.11249 [July 30, 2020]

* Hyper now correctly checks for NOT NULL constraints when creating a table from a CSV file with the COPY statement.

### v0.0.11074 [June 24, 2020]

* Adds several SQL functions for managing spatial data:
    * For creating geography objects (`geo_make_point` and `geo_make_line`).
    * For performing calculations on geography objects (`geo_distance` and `geo_buffer`).
    * For manipulating the vertex order of polygons in geography objects (`geo_auto_vertex_order` and `geo_invert_vertex_order`). These functions can be used to address problems (for example, with spatial joins or to automatically zoom) where data comes from a source that uses a different winding order for polygons than the one used by Tableau. In Tableau, the interior of the polygon is considered to be on the left of the path drawn by points of the polygon ring.
    * See [Geographic Functions](/docs/sql/scalar_func/geography) for more information.
* Prepared queries gained support for parallelized execution. See [PREPARE](/docs/sql/command/prepare) and [EXECUTE](/docs/sql/command/execute) for more information on prepared queries in Hyper.
* Java: Fixed crashes that could occur when inserting more than 16 MB of data into a table.
* Python: Fixed crashes of Python interpreter on shutdown by fixing reference counting.
* .NET: Fixed broken Nuget packages.
* Fixed a hanging query result fetch operation in the Hyper API when rows are consistently larger than 1 MB.
* New Python sample file that shows how you can use the Hyper API to reduce the fragmentation of `.hyper` files. See [Optimize Hyper File Storage](/docs/guides/hyper_file/optimize) and the [defragment-data-of-existing-hyper-file](https://github.com/tableau/hyper-api-samples/tree/main/Community-Supported/defragment-hyper-file) sample on GitHub.

### v0.0.10899 [May 27, 2020]

* Hyper now fully supports the options `FORCE_NULL` and `FORCE_NOT_NULL` for CSV parsing. By default, only unquoted values are compared to the null string to determine whether they represent a `NULL` value. `FORCE_NULL` toggles the same for quoted values. `FORCE_NOT_NULL` disables comparison of non-quoted values with the null string. See [COPY command](/docs/sql/command/copy_from).

* Updated the target framework of the Hyper API for .NET example from .NET Core 2.2 to .NET Core 3.1. .NET Core 2.2 has already reached its end of life at 2019-12-23 and increasingly surfaced stability problems. We continue to target the .NET Standard 2.0 in the Hyper API for .NET.

* IANA released version `2020a` of the Time Zone Database. Hyper's time zone information is updated accordingly. Noteworthy changes:
    * Morocco springs forward on `2020-05-31`, not `2020-05-24`.
    * Canada's Yukon advanced to `-07` year-round on `2020-03-08`.
    * `America/Nuuk` was renamed from `America/Godthab`.

### v0.0.10622 [April 22, 2020]

* If you use the Hyper API and accidentally open a file that is not a Hyper file, you now see a more informative error message.

* C++: Fixed a memory leak in the constructor of `hyperapi::HyperProcess` when an invalid parameter was supplied.

* The Python Hyper API now exposes a `__version__` attribute and thus supports PEP 396.

### v0.0.10309 [March 25, 2020]

* The Hyper API `Inserter` class now allows SQL expressions to compute or transform data on the fly during insertion.

* The Hyper API `Inserter` class now allows inserting Well-Known-Text (WKT) into `Geography` columns. You can use the `CAST` expression to transform WKT data to the `Geography` type and provide WKT data as a string to the `Inserter` class. For more information, see [Add Spatial Data to a Hyper File](/docs/guides/hyper_file/geodata).

* Documented the available settings that can be passed to the `HyperProcess` and `Connection` constructors. See  [Settings](/docs/hyper-api/hyper_process#passingprocesssettings).

* Exposed settings for the `HyperProcess` class that give control over the way Hyper communicates with its clients. See [Connectivity Settings](/docs/hyper-api/hyper_process#connectivitysettings).

* Exposed settings for the `HyperProcess` class that give control over its logging behavior. See  [Logging Settings](/docs/hyper-api/hyper_process#loggingsettings).

* Exposed settings for the `Connection` class that give control over date and time parsing. See [Date and Time Settings](/docs/hyper-api/connection#datetimesettings).

* The Hyper API no longer creates database files in the working directory. Instead, they are placed in a temporary directory. This makes it easier to use the Hyper API in write-protected working directories.

* Deprecated the following settings for the `HyperProcess` class:
    * `log-dir`: Now called `log_dir`.
    * `:restrict_database_directory`: Not required since Hyper no longer creates database files in the working directory.
    * `:database_directory`: Not required since Hyper no longer creates database files in the working directory.
    * `:log_file_size_limit`: Now called `log_file_size_limit`.
    * `:log_file_max_count`: Now called `log_file_max_count`.

    The deprecated settings will continue to work for at least three releases. Afterwards, the deprecated settings will be removed.

* The C++ HAPI now expects all settings (i.e., the keys and values of the `parameters` map passed to the constructor of `HyperProcess` and `Connection`) to be passed in UTF-8 encoding.

* Improved loading time for Python: `import tableauhyperapi` now takes 100 milliseconds instead of 250 milliseconds.

* Added the `to_date` function. See [Data Type Formatting Functions](/docs/sql/scalar_func/formatting).

---

### v0.0.10002 [February 26, 2020]

* Reduced memory consumption for `INSERT`: When inserting a large number of tuples using INSERT, Hyper API now uses less RAM. This is particularly important when copying large tables using `INSERT INTO newtable SELECT * FROM oldtable`.

* Simplified installation requirements on Windows: The Hyper API no longer requires that you install the Microsoft Visual C++ Runtime Library separately.

* Smaller packages: Thanks to improvements to our build processes and packaging, the package size was reduced. For example, the size of an unpacked Python installation went from 186 MB to 174 MB. The download size of a packed Python package was reduced from 49 MB to 46 MB.

* Bug fix for `VALUES` clauses: In rare cases, Hyper evaluated a join against a `LATERAL VALUES` clause incorrectly, leading to crashes or incorrect results. With this release, Hyper now evaluates such `VALUES` clauses correctly.

* Deprecations around the `HyperExpection` class: The following changes were done to simplify the interface of the `HyperException` class across languages. All of the deprecated functions can be replaced by their newly introduced alternatives. In general, these changes should only impact power users. For most use cases, we recommend using `str(<exception>)` (Python), `getMessage()` (Java), `ToString()` (C#) or `what()` (C++).
   * Python: `message` was deprecated in favor of `main_message` and `hint_message` was deprecated in favor of `hint`. Furthermore, `context_id` is now an instance of the `ContextId` class and no longer a plain integer.
   * Java: `getErrorMessage` was deprecated in favor of `getMainMessage`.
   * C#/.Net: The `PrimaryMessage` property was deprecated in favor of `MainMessage`.
   * C++: `getHintMessage` was deprecated in favor of `getHint`. `getMessage` was deprecated in favor of `getMainMessage`. Furthermore, `HyperException::getCause` now returns a `optional<HyperException>` instead of a `HyperException`. The method `hasCause` was deprecated.

    The old method names will stay unchanged and continue working for at least the next three releases of Hyper API. They will be removed at some point in future after that.

---

### v0.0.9746 [January 29, 2020]

* Improved time zone support. In particular, the `TIMESTAMP WITH TIME ZONE` (or `TIMESTAMPTZ`) type is now properly supported.

* This release includes documentation for several SQL features, including:
  * Manipulation and formatting of date/time values and intervals, also with full time zone support. See [Data Type Formatting Functions](/docs/sql/scalar_func/formatting) and [Date/Time Functions and Operators](/docs/sql/scalar_func/datetime).
  * Sub-query expressions (for example, `EXISTS`, `IN`, `ALL`). See [Subquery Expressions](/docs/sql/scalar_func/subquery_comparison).
  * Window aggregate functions (for example, `RANK()`). See [Window Functions and Queries](/docs/sql/window).
  * `generate_series` - See [Set Returning Functions](/docs/sql/setreturning).
  * Data Types: boolean, binary, numeric types, character, date/time. See [Data Types](/docs/sql/datatype).

* The Tableau Hyper API no longer requires write access in the working directory.

* Improved error handling and messages.

* The Tableau Hyper API is available on the Python Package Index (PyPI). You can now install the Tableau Hyper API using the package installer, `pip`.

    ```
    pip install tableauhyperapi
    ```

    Or, if you previously installed the package.

    ```
    pip install --upgrade tableauhyperapi
    ```

    Linux installations require `pip` version 19.3 or newer. Note that `pip` versions 20.0 and 20.1 are not working because of issues with `pip` and not the Tableau Hyper API package.

* Support for macOS 10.15 (Catalina). You can now install the Hyper API on computers running macOS 10.13 and later.

* The `HyperProcess` (hyperd.exe) on Windows no longer opens a terminal window (Issue 1039998).

* Hyper is now reusing space freed by DELETE (Issue 1056751). In a rolling-window scenario (where old data is deleted in bulk before appending new data), previous versions of the Tableau Hyper API would not re-use the deleted space, causing the `.hyper` file to grow. This problem is fixed with this release. In addition to the simple rolling window scenario, the fix also applies to other bulk deletion patterns.

* UPDATE now supports multi-column subqueries in SET clauses. See [UPDATE](/docs/sql/command/update).

* Standard-compliant natural join.

---

### v0.0.9273 [December 4, 2019]

* NuGet package for the Tableau Hyper API for .NET. You can now reference the Tableau Hyper API library from your project file as you would for other NuGet packages. See [Install the Hyper API for .NET](http://localhost:3000/docs/installation?client-language=dotnet#instructions).

* The Hyper API for Python now allows you to use `pathlib.Path` to specify the `hyper_path` when you start the HyperProcess. This is the path to the directory that contains the `hyperd` executable file.

* Support added for the asterisk (`*`) in namespace-qualified column references. For example, you can select the columns from a table in a specified namespace using three-part names (`schema_name.table_name.*`).

    ```sql
    SELECT schema_name.table_name.*, schema_name2.table_name.* FROM schema_name.table_name, schema_name2.table_name ...
    ```

* Support for quoted strings in CSV headers.

* When Hyper is launched inside a container (for example, Docker), Hyper now respects the memory limits that are set for the container. Previously, Hyper would assume that full system memory was available.

* Updated requirements. The Hyper API requires Microsoft Visual C++ Runtime Library version 19.15.26726 or later. You can download the library from Microsoft: [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads)



---

### v0.0.8953 [October 30, 2019]

* Various bug fixes. See the **Resolved Issues** on the [Hyper API Product Release and Download](https://tableau.com/support/releases/hyper-api/latest) page.

* Documentation updates to correct C++ installation instructions, platform support (macOS 10.15 not yet supported).

**Changed in this release**

* In the Hyper API (Python), the `name` parameter in the `TableDefinition` method changed to `table_name`.
  If you use keyword arguments to define tables in the previous release of the Hyper API, you need to modify your code.

  For example, if you were creating a table called `airports` in the `public` namespace (schema), you would need to make the following change.

    Change:

    ```python
    airports_table = TableDefinition(name=TableName( "public", "airports"), ...)
    ```

    To the following:

    ```python
    airports_table = TableDefinition(table_name=TableName("public", "airports"), ... )
    ```

    Note, if you are using positional arguments, you can avoid this issue.

     ```python
    airports_table = TableDefinition(TableName("public", "airports"), ...)
    ```

---

### v0.0.8707 [October 2019]

The Hyper API replaces the Extract API 2.0 for building applications that create and update Tableau extract files (`.hyper`) for Tableau 10.5 and later. The Hyper API provides more capabilities and improved performance when compared to the previous API.

* Use SQL statements to insert, read, update, and delete data in extract files

* Copy data directly from CSV files

* Create applications in Python, Java, C++, or .NET (C#)

* Read data from `.hyper` files

* Update data in existing `.hyper` files

* Delete data from existing `.hyper` files

* Drastic performance improvements for extract creation

---
