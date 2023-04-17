# The `Connection`

To connect to a running `HyperProcess`, use the `Connection` class.
The `Connection` class then provides you means to interact with Hyper by sending SQL commands or by using some other utilities like the `catalog` or the `Inserter` class.

```python
from tableauhyperapi import HyperProcess, Telemetry, Connection

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(endpoint=hyper.endpoint) as connection:
        print(connection.execute_scalar_query("SELECT 1+3"))
```

The `Connection` can be created from an endpoint string.
The endpoint string specifies how to connect to Hyper (which protocol to use, which port to use, ...) and can be obtained from the `HyperProcess.endpoint` property.
Multiple connections can use the same `HyperProcess` instance, and Hyper is able to serve multiple SQL queries in parallel.
However, each `Connection` must only ever be used on a single thread.
`Connection` objects are not thread-safe.

Just like you should shutdown the `HyperProcess`, you should always close the connection when your application is finished interacting with the `.hyper` file.
If you create the connection using a `with` statement (in Python; `using` in C#, a RAII scope in C++, or `try-with-resources`in Java), the connection will be closed at the end of the `with`.
Alternatively, we could also call `connection.close()` to explicitly close the connection.

## Sending SQL queries {#sending-sql-commands}

The Connection class provides methods for executing SQL statements and queries.
For more details, see [Executing SQL Commands](../guides/sql_commands.md)

## Connecting to Hyper files

By default, a `Connection` is connected against no Hyper file at all.
This means that commands such as `CREATE TABLE` will fail, because there is no corresponding `.hyper` file into which Hyper could store that table.
Those database-less connections are still useful to, e.g., interact with external Parquet files, though.

To connect with a Hyper file, pass its file path as the `database` parameter to the `Connection` constructor.

```python
from tableauhyperapi import HyperProcess, Telemetry, Connection, CreateMode

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.NONE) as connection:
        print(connection.execute_scalar_query('SELECT COUNT(*) FROM "my_table"'))
```

In addition, the `CreateMode` specifies how Hyper should react if the given Hyper file does not exist:

Mode  | Behavior
---- | ----
`NONE` | The database file will not be created. It is expected that the database already exists. An error will be raised if it does not exist
`CREATE` | The database will be created. It is expected that the database does not exist. An error will be raised if the file already exists; a pre-existing file will not be overwritten.
`CREATE_AND_REPLACE` | Create an empty database. If the database file already exists, replace it by a new, empty database.
`CREATE_IF_NOT_EXISTS` | If the database file already exists, connect to it. Otherwise create a new, empty database and connect to it.

:::caution Single connection per file

A `.hyper` file can only be opened by one process at a time.
That is, while your application is connected to the `.hyper` file, it has exclusive access: no other instance of Hyper can connect to the file.
For example, you can't have a `.hyper` file opened in Tableau and at the same time use the Hyper API to read from or write to the same file.

You cannot open multiple connections to the same `.hyper` file at the same time. However, you can connect to different `.hyper` files from a single instance of the `HyperProcess`. For example, you could read from one `.hyper` file and insert or copy data to another `.hyper` file.

:::

## Connection settings

Connection settings only apply to a single connection.
Other connections to the same Hyper process are not affected.
They can be set during connection startup.
With the Hyper API, they can be passed to the `Connection` constructor.


### Date and Time Settings {#datetimesettings}

These settings control how date and time data is handled in a Hyper
connection.

#### lc_time

Controls the Locale setting that is used for dates. A Locale controls
which cultural preferences the application should apply. For example,
the literal `Januar 1. 2002` can be converted to a date with the German
locale `de` but not with the English locale `en_US`.

Allowed values start with a [two-letter
ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language
code and an optional [two-letter
ISO-3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
country code. If a country code is used, an underscore has to be used to
separate it from the language code. Some examples are: `en_US` (English:
United States), `en_GB` (English: Great Britain), `de` (German), `de_AT`
(German: Austria).

:::note
This setting has no influence on the order of day, month, and year
inside a date literal. This is controlled by the
[date_style](#date_style) setting.
:::

Default value: `en_US`

#### date_style

Controls how date strings are interpreted. `Y`, `M` and `D` stand for
Year, Month, and Day respectively.

For example, the string "01/02/2000" could be interpreted as "2nd of
January 2000" or "1st of February 2000". The first possibility is chosen
with the `MDY` date style while the second is chosen with the `DMY` date
style.

This setting also affects date parsing from CSV files.

Default value: `MDY`
