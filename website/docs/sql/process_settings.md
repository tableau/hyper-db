# Process Settings

Process settings are settings that apply to the Hyper process. They
influence all connections to Hyper. They can be set during startup of
the process (see [Passing Process Settings to
Hyper](#passingprocesssettings)).

## Passing Process Settings to Hyper {#passingprocesssettings}

This section covers different possible ways how [process
settings](#processsettings) can be passed to Hyper.

### Using the Hyper API {#passwithhyperapi}

Process settings can be used with the Hyper API by passing them in the
`HyperProcess` constructor.

For example, to pass the process setting `log_file_size_limit` in
`Python` to limit the size of Hyper event log files to 100 megabytes,
use:

    process_parameters = {"log_file_size_limit": "100M"}
    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU, parameters=process_parameters) as hyper:
      ...

To pass the same setting in `C#`, use:

    var processParameters = new Dictionary<string, string>{{"log_file_size_limit", "100M"}};
    using (HyperProcess hyper = new HyperProcess(Telemetry.SendUsageDataToTableau, "example", processParameters))
    {
      ...

To pass the same setting in `Java`, use:

    Map<String, String> processParameters = new HashMap<>();
    processParameters.put("log_file_size_limit", "100M");
    try (HyperProcess process = new HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU, "example", processParameters)) {
      ...

To pass the same setting in `C++`, use:

    std::unordered_map<std::string, std::string> processParameters = {{"log_file_size_limit", "100M"}};
    hyperapi::HyperProcess hyper(hyperapi::Telemetry::SendUsageDataToTableau, "example", processParameters);

## Connectivity Settings {#connectivitysettings}

These settings control how Hyper communicates with it\'s clients.

### domain_socket_dir

:::note
This Setting has no effect on Windows machines.
:::

Specifies the directory that Hyper uses for domain sockets. It only has
an effect if Hyper uses domain sockets (using domain sockets is the
default behavior, see: [use_tcp_port](#use_tcp_port)).

Default value: `/tmp`

:::note
The maximum path length for valid domain sockets is limited on many
platforms. It is therefore recommended to use a short path as the domain
socket directory.
:::

### use_tcp_port

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

## Logging Settings {#loggingsettings}

These settings control how Hyper writes it\'s activity logs.

:::note
These setting controls the activity log of Hyper and not a transactional
write-ahead log.
:::

### log_config

Can be used to disable Hyper\'s logging by setting it to the empty
string. By default, logging is enabled.

### log_dir

Specifies the directory into which Hyper\'s log files will be written.

### log_file_max_count

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

### log_file_size_limit

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

## Database Settings {#databasesettings}

These settings control Hyper\'s database files.

### default_database_version

:::warning
Newer database file format versions than the initial version `0` are
unsupported in older product versions. This means that you can use newer
database versions with the latest Hyper API and newer product versions
but you cannot open them in older product versions. For example, the new
database file format version `2` can be opened in Tableau Desktop
2020.4.15 but it cannot be opened in Tableau Desktop 2020.3. The
complete compatiblility matrix is documented in the version sections
below.
:::

Specifies the default database file format version that will be used to
create new database files.

Default value: `0`

Accepted values: `0`, `1` (writing this version is deprecated in favor
of version 2 and will be removed in a future Hyper API release), `2`

#### version 0

The default and initial database file format version is version `0`. It
is supported and will always be supported by all product versions. To
create a new Hyper database file with this version, set
`default_database_version=0`.

#### version 1 (deprecated)

Database file format version `1` improves Hyper\'s file format
significantly. It contains a collection of improvements from the years
since Hyper\'s initial release:

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
Opening a database file with an unsupported Tableau product version will
produce an error message similar to:

\"There was an error during loading database \'\[\...\]\\file.hyper\':
unsupported version 1 (max supported version: 0). To open this database,
please update your product. (error code 0AS01)\"
:::

#### version 2

Database file format version `2` includes the improvements of file
format version `1`. Additionally, it supports storing and querying
textual data with arbitrary versions of the Unicode collation tables.

To create a new Hyper database file with this version, set
`default_database_version=2`.

:::note
The database file format version `2` is supported by Tableau
Desktop/Server 2020.4.15, 2021.1.12, 2021.2.9, 2021.3.8, 2021.4.4,
2022.1.2 and newer product versions. It is supported by Tableau Prep
2022.3 and newer versions. Opening a database file with an unsupported
Tableau product version will produce an error message similar to:

\"There was an error during loading database \'\[\...\]\\file.hyper\':
unsupported version 2 (max supported version: 1). To open this database,
please update your product. (error code 0AS01)\"
:::

## Experimental Settings {#experimentalsettings}

These settings control experimental features of Hyper.

:::warning
This page describes pre-release features that are not supported and
should not be used in production code. Their interfaces, semantics, and
performance characteristics are subject to change or they could be
*removed at any time without prior notice.* There may also be bugs. If
you encounter an issue, please [report
it](https://github.com/tableau/hyper-api-samples/issues).

If you use an experimental feature in your test environment, we
encourage you to enable telemetry in the Hyper API to help us improve
these features. You can do so by passing the "send usage data to
Tableau" flag to the `HyperProcess` constructor.

We also encourage you to share your feedback about the experimental
feature in our [slack space](https://tabsoft.co/JoinTableauDev).
:::

### Former Experimental Settings

If you previously used the `experimental_external_format_parquet` flag,
you no longer need it. It's a stable feature now.
