# CREATE EXTERNAL TABLE

— define a new external table

## Synopsis

```sql_template
CREATE { TEMPORARY | TEMP } EXTERNAL TABLE [IF NOT EXISTS] <table_name>
    [ ( <column_def> [, ...]) ]
    FOR <source_location>
    [ WITH ( <option>, [...] ) ]
```

where `column_def` is:

```sql_template
<column_name> <data_type> [COLLATE <collation>] [ {NOT NULL | NULL } ]
```

and `option` can be one of:

```sql_template
FORMAT => <format_name>
<format_specific_option> => <value>
```

## Description {#sql-createexternaltable-description}

`CREATE TEMPORARY EXTERNAL TABLE` will create a new temporary external
table, enabling to refer to external data from `<source_location>` in a
SQL query as if it was stored in a Hyper table named `<table_name>`.
However, no data will be stored in Hyper. Instead, Hyper will read from
the external source whenever the external table is accessed in a query.
See [External formats](/docs/sql/external/formats) for a list of supported external formats.
It is mandatory to use the `TEMP` or `TEMPORARY` keyword, as only
temporary external tables are supported.

The schema of the external source can be given explicitly through
`<column_def>`, or it can be omitted, in which case Hyper will infer the
schema from the file. This only works for certain file formats that
carry schema information; refer to [???](#table-external-formats) for
details about which file formats support schema inference.

## Parameters

`TEMPORARY` or `TEMP`

:   Temporary external tables are automatically dropped at the end of a
    session and are only visible to this connection. Existing permanent
    tables with the same name are not visible to the current session
    while the temporary table exists, unless they are referenced with
    schema-qualified names. It is mandatory to use the `TEMP` or
    `TEMPORARY` keyword, as only temporary external tables are
    supported.

`IF NOT EXISTS`

:   Do not throw an error if a table with the same name already exists.
    Note that there is no guarantee that the existing table is anything
    like the one that would have been created.

`<table_name>`

:   The name of the external table to be created.

`<column_name>`

:   The name of a column to be created in the new external table.

`<data_type>`

:   The data type of the column. For more information on the data types
    supported by Hyper, refer to [???](#datatype).

`COLLATE collation`

:   The `COLLATE` clause assigns a collation to the column (which must
    be of a collatable data type). If not specified, the column data
    type\'s default collation is used.

`NOT NULL`

:   The column is not allowed to contain null values.

`NULL`

:   The column is allowed to contain null values. This is the default.
    This clause is only provided for compatibility with non-standard SQL
    databases. Its use is discouraged in new applications.

`<source_location>`

: Location to read the data from. See [External Location](/docs/sql/external/location)
  documentation for more information.

`FORMAT => format_name`

:   Selects the data format to be read. This option can be omitted in
    case the format can be inferred from the file extension. In case of
    a list of sources, all of them need to share this extension.
    Supported formats are depicted in detail in
    [External formats](/docs/sql/external/formats).

`format_specific_option => value`

:   A format-specific option. The available options for each respective
    format can be found in [External formats](/docs/sql/external/formats).

## Examples {#sql-createexternaltable-examples}

Create a temporary external table for a local CSV file in the working
directory of the Hyper server, having two columns and a custom
delimiter. Then, querying the data in this external table:

    CREATE TEMP EXTERNAL TABLE products (
        name      text NOT NULL,
        price     int )
    FOR './products.csv'
    WITH ( FORMAT => 'csv', DELIMITER => '|' )

    SELECT name FROM products WHERE price > 100;

Same but reading from multiple CSV files:

    CREATE TEMP EXTERNAL TABLE products (
        name      text NOT NULL,
        price     int )
    FOR ARRAY['./products1.csv', './products2.csv', './products3.csv']
    WITH ( FORMAT => 'csv', DELIMITER => '|' )

    SELECT name FROM products WHERE price > 100;

Create a temporary external table for an Apache Parquet file from Amazon
S3 using empty credentials and inferring the bucket region.
The schema of the file is inferred from the schema information in the
file. The file format is inferred from the file extension:

    CREATE TEMP EXTERNAL TABLE products
    FOR s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => '',
        secret_access_key => ''
    )

Same but with explicit Amazon S3 credentials and bucket region:

    CREATE TEMP EXTERNAL TABLE products
    FOR s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => 'ACCESSKEYID12EXAMPLE',
        secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
        region => 'us-east-1'
    )

## Alternatives

Using an external table in a SQL query is functionally equivalent to
calling the [`external`](../setreturning#external) function.
Furthermore, the [COPY FROM](copy_from) statement can be used to
directly import data from an external file into a native Hyper file.

For a discussion of the pros and cons of the various alternatives, see
[Reading External Data in SQL](../external/syntax).
