# COPY TO

— copy data from a SQL query to a file

## Synopsis

```sql_template
COPY { <table_name> [ (<column_name> [, ...] ) ] | ( <query> ) }
  TO <target_location>
  [ WITH (<option> [, ...]) ]
```

where `<option>` can be one of:

```sql_template
FORMAT => <format_name>
<format_specific_option> => <value>
```

## Description

`COPY TO` copies the content of a Hyper database table to one or
more files, overriding existing files if there are any.

If a column list is specified, only those specified columns will
be written, in the order they appear in the column list.

Depending on the target location, Hyper will write data, e.g., to a
local file or an AWS S3 bucket. More information on the available
locations can be found in [External Locations](/docs/sql/external/location).

## Parameters

`<table_name>`

:   The name (optionally database- or schema-qualified) of an existing
    table.

`<column_name>`

:   An optional list of columns to be copied. If no column list is
    specified, all columns of the table will be copied.

`<query>`

:   A [SELECT](select) command, [VALUES](values) command or any other SQL query.

`<target_location>`

: Location to write the data to. See [External Location](/docs/sql/external/location)
  documentation for more information.

`FORMAT => format_name`

:   Selects the data format to be written. This option can be omitted in
    case the format can be inferred from the file extension. Supported
    formats are depicted in detail in
    [External Formats](/docs/sql/external/formats).

`format_specific_option => value`

:   A format-specific option. The available options for each respective
    format can be found in [External Formats](/docs/sql/external/formats).

## Examples {#sql-copy-examples}

Copy a table to a CSV file in the working directory of the Hyper server,
having a custom delimiter. The schema of the CSV file will be the same
as the schema of the table `products`:

    COPY products TO './products.csv' WITH ( FORMAT => 'csv', DELIMITER => '|' )

Same but writing to multiple CSV files (assume the table `products` is
large enough so that the resulting CSV file will be larger than 500000
bytes):

    COPY products to './products.csv'
    WITH ( FORMAT => 'csv', max_file_size => 500000 )

Copy to an Apache Parquet file to Amazon S3 using empty credentials and
inferring the bucket region. The file format is inferred from the file
extension:

    COPY products TO s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => '',
        secret_access_key => ''
    )

Same but with explicit Amazon S3 credentials and bucket region:

    COPY products
    TO s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => 'ACCESSKEYID12EXAMPLE',
        secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
        region => 'us-east-1'
    )

Instead of copying the table `products` as a whole, use a query instead
to do whatever operation is needed:

    COPY (SELECT name FROM products ORDER BY price LIMIT 100)
    TO s3_location(
        's3://mybucket/mydirectory/cheap_products.parquet',
        access_key_id => 'ACCESSKEYID12EXAMPLE',
        secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
        region => 'us-east-1'
    )

## Notes

Files named in a `COPY` command are written directly by the server, not by
the client application. Therefore, they must reside on or be accessible
to the database server machine, not the client. They must be accessible
to and writable by the Hyper user (the user ID the server runs as), not
the client.

`COPY` input and output is affected by [date_style](#date_style).

`COPY` stops operation at the first error.

Hyper also supports the PostgreSQL syntax of the `COPY` command, which
is slightly different from the syntax depicted here. This is only
supported for PostgreSQL compatibility. When writing SQL for Hyper, we
recommend using the syntax documented here.

