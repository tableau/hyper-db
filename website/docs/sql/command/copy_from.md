# COPY FROM

— copy data from a file into a table

## Synopsis

```sql_template
COPY <table_name> [ (<column_name> [, ...] ) ]
  FROM <source_location>
  [ WITH (<option> [, ...]) ]
```

where `<option>` can be one of:

```sql_template
FORMAT => <format_name>
<format_specific_option> => <value>
```

## Description

`COPY FROM` loads data from a source location into a Hyper table,
appending the data to whatever is in the table already.

If a column list is specified, each field in the file is inserted, in
order, into the specified column. Table columns not specified in the
column list will receive their default values.

Depending on the source location, Hyper will read data, e.g., from a
local file or directly from S3. More information on the available
locations can be found in [External Locations](/docs/sql/external/location).

## Parameters

`<table_name>`

:   The name (optionally database- or schema-qualified) of an existing
    table.

`<column_name>`

:   An optional list of columns to be copied. If no column list is
    specified, all columns of the table will be copied.

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

## Examples {#sql-copy-examples}

Copy a local CSV file from the working directory of the Hyper server,
having a custom delimiter. The schema of the CSV file is expected to be
the same as the schema of the table `products`, which must already
exist:

    COPY products FROM './products.csv' WITH ( FORMAT => 'csv', DELIMITER => '|' )

Same but reading from multiple CSV files:

    COPY products FROM ARRAY['./products1.csv', './products2.csv', './products3.csv']
    WITH ( FORMAT => 'csv', DELIMITER => '|' )

Copy from an Apache Parquet file stored on Amazon S3 using empty
credentials and inferring the bucket region. The file format
is inferred from the file extension:

    COPY products FROM s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => '',
        secret_access_key => ''
    )

Same but with explicit Amazon S3 credentials and bucket region:

    COPY products
    FROM s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => 'ACCESSKEYID12EXAMPLE',
        secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
        region => 'us-east-1'
    )

## Notes

Files named in a `COPY` command are read directly by the server, not by
the client application. Therefore, they must reside on or be accessible
to the database server machine, not the client. They must be accessible
to and readable by the Hyper user (the user ID the server runs as), not
the client.

`COPY` input and output is affected by [date_style](#date_style).

`COPY` stops operation at the first error.

Hyper also supports the PostgreSQL syntax of the `COPY` command, which
is slightly different from the syntax depicted here. This is only
supported for PostgreSQL compatibility. When writing SQL for Hyper, we
recommend using the syntax documented here.

## Alternatives

Issuing a `COPY` is equivalent to an [INSERT](insert) command that
reads from the [`external`](/docs/sql/setreturning.md#external) function.
Furthermore, the `external` function can also be combined with
[CREATE TABLE AS](create_table_as) to concisely create and fill a new
Hyper table. For example, this will create and fill a products table:

```
CREATE TABLE products AS (SELECT * FROM external('products.parquet'))
```

Also, note that Hyper can directly operate on external formats, and
importing the data into Hyper tables is unnecessary for most use cases.

For a discussion of the pros and cons of the various alternatives, see
[Reading External Data in SQL](../external/syntax).
