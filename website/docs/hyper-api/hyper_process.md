# The `HyperProcess`

Hyper itself is a full-fledged, standalone database server (`hyperd`).
Hyper API comes bundled with `hyperd` together with a utility class (`HyperProcess`) which allows you to spawn the Hyper database server locally on your machine.

To spawn a Hyper process, use:

```python
from tableauhyperapi import HyperProcess, Telemetry

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    print(hyper.endpoint)
```

This starts up a local Hyper database server, and then prints the connection string (`endpoint`).
This connection string describes the used protocol (TCP, domain sockets, ...) and the corresponding information like port numbers.
The `Connection` class can then be used to connect against this endpoint.
While the `HyperProcess` is running, you can create and connect to as many `.hyper` files as you want.

After you no longer need a Hyper database server, you should shutdown the `HyperProcess`.
If you call the `HyperProcess` in a `with` statement (Python), `using` statement (C#), scope (C++), or `try-with-resources` statement (Java), the `hyperd` process will safely shutdown automatically at the end of the `with` statement.

## Performance best practices {#performance}

Compared to other database systems, Hyper starts up very fast (in the order of 100 milliseconds).
Still, starting up and shutting down the server takes time.
Hence, you should keep the process running and only close or shutdown the `HyperProcess` when your application is finished.
E.g., when updating multiple tables inside a `.hyper` file, do not restart the `HyperProcess` for every table, but instead use the same process for updating all of your tables.

Furthermore, you should only have one instance of Hyper running at any given time.
Hyper internally monitors its memory assumption, and makes sure that it only uses up to 80% of your system's RAM memory, such that your overall system stays responsive.
If multiple Hyper processes are running at the same time, they might overload the system, and Hyper's internal resource management mechanisms will not be able to counteract this.

## Telemetry Data {#telemetry}

The `HyperProcess` can be instructed to send telemetry on Hyper API usage to Tableau.
To send usage data, set `telemetry` to `Telemetry.SEND_USAGE_DATA_TO_TABLEAU` when you start the process.
To opt out, set `telemetry` to `Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU`.

To help us improve Hyper and justify further investments into Hyper API, you can share usage data with us.
Tableau collects data that helps us learn how our products are being used so we can improve existing features and develop new ones.
All usage data is collected and handled according to the [Tableau Privacy Policy](https://tableau.com/privacy).

## Locating the `hyperd` binary

To spawn the `hyperd` executable, `HyperProcess` must be able to locate this binary, first.
By default, `HyperProcess` is able to automatically find the `hyperd` executable bundled inside Hyper API.
However, if you are rebundling Hyper API, this logic might fail.
In those cases, you can use the `hyper_path` parameter to explicitly specify the location of the folder (!) containing the `hyperd` binary (not the path to the binary itself!).

```python
from tableauhyperapi import HyperProcess, Telemetry

HyperProcess(telemetry=Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU,
             hyper_path="/home/avogelsgesang/development/hyper/build/bin") as hyper:
    print(hyper.endpoint)
```

:::note For internal prototyping

Using the `hyper_path`, you can also instruct Hyper API to interact with a different version of `hyperd`.
Thereby, you can use Hyper API to quickly script a benchmark or more extensive test cases for your
new feature or performance improvement.

:::

## Process Settings {#process-settings}

The behavior of the Hyper process can be customized using a couple of settings.
They influence all connections to Hyper.
Those settings can be set during startup of the process through the `parameters` argument of the `HyperProcess`:

```python
process_parameters = {"default_database_version": "2"}
with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU,
                  parameters=process_parameters) as hyper:
    print(hyper.endpoint)
```

### Connectivity Settings {#connectivitysettings}

These settings control how Hyper communicates with its clients.

#### domain_socket_dir

Specifies the directory that Hyper uses for domain sockets. It only has
an effect if Hyper uses domain sockets (using domain sockets is the
default behavior, see [use_tcp_port](#use_tcp_port)).

Default value: `/tmp`

:::note
This setting has no effect on Windows machines.

The maximum path length for valid domain sockets is limited on many
platforms. It is therefore recommended to use a short path as the domain
socket directory.
:::

#### use_tcp_port

If this setting is set to a port number or the special `auto` value,
Hyper will use the TCP protocol to communicate with clients. If `auto`
is passed, Hyper will automatically pick an available port. Otherwise,
the passed port number is used. If this setting is set to `off`, which
is the default value, Hyper will use named pipes on Windows and domain
sockets on Linux and macOS.

If TCP communication is desired, it is recommended to use the automatic
port detection by passing `auto` instead of an explicit port.

Default value: `off`

Accepted values: `auto`, `off` or a port number between 1 and 65535

### Logging Settings {#loggingsettings}

These settings control how Hyper writes its activity logs.
Note that these setting controls the activity log of Hyper and not a transactional
write-ahead log.

#### log_config

Can be used to disable Hyper's logging by setting it to the empty
string. By default, logging is enabled.

#### log_dir

Specifies the directory into which Hyper's log files will be written.

#### log_file_max_count

Specifies how many Hyper log files are kept until the oldest ones are
deleted. This setting only has an effect if multiple log files will be
created (see: [log_file_size_limit](#log_file_size_limit)). For example,
if `log_file_max_count` is set to `2` and
[log_file_size_limit](#log_file_size_limit) is set to `100M`, there will
be at most two log files with a file size of up to 100 MB containing the
most recent log information.

It is not recommended to set the limit to `1`, since this can lead to
situations in which very little log information is available. This is
because the old log file will be deleted immediately when a new log file
is started.

When set to `0`, the number of log files is not limited.

Default value: `0`

#### log_file_size_limit

Specifies how large a Hyper log file is allowed to grow before logging
switches to a new log file. When this setting is set to a value greater
than zero, the log files will be suffixed with a timestamp indicating
the time at which the logging into this file started. The setting\'s
value can be specified in `K`(KB), `M`(MB), `G`(GB) or `T`(TB) units.
For example, you can specify `100M` to limit the file size of each log
file to 100 MB. A limit on how many log files should be kept around can
be specified with [log_file_max_count](#log_file_max_count).

When set to `0`, the log file size is not limited and no timestamps are
added to the log file name.

Default value: `0`

### Database Settings {#databasesettings}

These settings control Hyper's database files.

#### default_database_version

Specifies the default database file format version that will be used to
create new database files.
Every version builds on the improvements of the previous version(s) and
adds some new functionality, like new data types.

Default value: `0`

Accepted values: `0`, `1` (writing this version is deprecated in favor
of version 2 and will be removed in a future Hyper API release), `2`, `3`, and `4`.

:::note
Newer database file format versions than the initial version `0` are
unsupported in older product versions. This means that you can use newer
database versions with the latest Hyper API and newer product versions
but you cannot open them in older product versions. For example, the
database file format version `2` can be opened in Tableau Desktop
2020.4.15 but it cannot be opened in Tableau Desktop 2020.3. The
complete compatibility matrix is documented in the version sections
below.

Opening a database file with an unsupported
Tableau product version will produce an error message similar to:

"There was an error during loading database '[...]/file.hyper':
unsupported version 3 (max supported version: 2). To open this database,
please update your product. (error code 0AS01)"
:::


##### version 0

The default and initial database file format version is version `0`. It
is supported by all product versions. To create a new Hyper database
file with this version, set `default_database_version=0`.

##### version 1 (deprecated)

Database file format version `1` improves Hyper's file format
significantly. It contains a collection of improvements from the years
since Hyper's initial release:

-   Hyper will compress database files more efficiently after rows have
    been deleted. The initial file format was not able to compress data
    blocks with deleted rows, so the file size increased significantly
    when rows were deleted.

-   Hyper will process queries on textual data with collations more
    efficiently.

-   Hyper will detect database files that have been corrupted externally
    more reliably.

To create a new Hyper database file with this version, set
`default_database_version=1`. Note: Writing file version 1 is deprecated
and will be removed in a future Hyper API release.

:::note
The database file format version `1` is supported by Tableau
Desktop/Server 2019.2.10, 2019.3.6, 2019.4.5, 2020.1.1 and newer product
versions. It is supported by Tableau Prep 2020.2 and newer versions.
:::

##### version 2

Database file format version `2` adds support for storing and querying
textual data with arbitrary versions of the Unicode collation tables.

To create a new Hyper database file with this version, set
`default_database_version=2`.

:::note
The database file format version `2` is supported by Tableau
Desktop/Server 2020.4.15, 2021.1.12, 2021.2.9, 2021.3.8, 2021.4.4,
2022.1.2 and newer product versions. It is supported by Tableau Prep
2022.3 and newer versions.
:::

##### version 3

Database file format version `3` supports storing and querying 128-bit
numerics. 128-bit numerics support a precision of up to 38 places.
Additionally, file format `3` improves compression of all 128-bit data types.

To create a new Hyper database file with this version, set
`default_database_version=3`.

:::note
The database file format version `3` is supported by Tableau Desktop
2022.4.1 and Server 2023.1 and newer product versions. It is supported by
Tableau Prep 2022.4.1 and newer versions.
:::

#### version 4
Database file format version `4` was introduced to support
persisting and reading the new 32-bit floating point type.

Starting with release 0.0.19484, Hyper uses 32-bit floats for
the SQL types `real`, `float4`, and `float(p)` with `p <= 24`.
The types `double precision`, `float`, `float8`, and `float(p)` with `p >= 25`
still use 64-bit doubles.

To create a new Hyper database file with this version, set
`default_database_version=4`.

:::note
The database file format version `4` will be supported
by Tableau Desktop/Server/Prep 2024.3 and newer product versions.
:::

<!-- ### Experimental Settings {#experimentalsettings}

:::warning
This section describes pre-release features that are not supported and
should not be used in production code. Their interfaces, semantics, and
performance characteristics are subject to change or they could be
*removed at any time without prior notice.* There may also be bugs. If
you encounter an issue, please [report it](https://github.com/tableau/hyper-db/issues).
If you use an experimental feature in your test environment, we
encourage you to enable telemetry in the Hyper API to help us improve
these features. You can do so by passing the "send usage data to
Tableau" flag to the `HyperProcess` constructor.

We also encourage you to share your feedback about experimental
features in our [slack space](https://join.slack.com/t/tableau-datadev/shared_invite/zt-1q4rrimsh-lHHKzrhid1MR4aMOkrnAFQ).
:::

These settings control experimental features of Hyper: -->
