# COPY FROM

COPY

table_name

\[ (

column_name

\[, \...\] ) \] FROM {

source_location

} \[ WITH (

option

\[, \...\] ) \]

where

source_location

can be one of:

\'

file_system_path

\' \'

amazon_s3_uri

\' s3_location(\'

amazon_s3_uri

\' \[, access_key_id =\> \'

text

\', secret_access_key =\> \'

text

\' \[, session_token =\> \'

text

\'\] \] \[, region =\> \'

text

\'\] ) ARRAY

\[

source_location

\[, \...\]

\]

and

option

can be one of:

FORMAT =\>

format_name

format_specific_option

=\>

value

## Description

`COPY` moves data between Hyper tables and external locations.
`COPY FROM` copies data *from* a source location to a table, appending
the data to whatever is in the table already.

If a column list is specified, each field in the file is inserted, in
order, into the specified column. Table columns not specified in the
`COPY FROM column` list will receive their default values.

`COPY` with a file name instructs the Hyper server to directly read from
a file. The file must be accessible by the Hyper user (the user ID the
server runs as) and the name must be specified from the viewpoint of the
server.

## Parameters

\<table_name\>

:   The name (optionally database- or schema-qualified) of an existing
    table.

\<column_name\>

:   An optional list of columns to be copied. If no column list is
    specified, all columns of the table will be copied.

`FORMAT => format_name`

:   Selects the data format to be read. This option can be omitted in
    case the format can be inferred from the file extension. In case of
    a list of sources, all of them need to share this extension.
    Supported formats are depicted in detail in
    [???](#external-formats).

`format_specific_option => value`

:   A format-specific option. The available options for each respective
    format can be found in [???](#table-external-formats).

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
credentials and inferring the bucket region. Note that accessing Amazon
S3 is [an experimental feature](#experimentalsettings). The file format
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

::: note
Hyper also supports the PostgreSQL syntax of the `COPY` command, which
is slightly different from the syntax depicted here. This is only
supported for PostgreSQL compatibility. When writing SQL for Hyper, we
recommend using the syntax documented here.
:::

## Alternatives

Issuing a `COPY` is equivalent to an [???](#sql-insert) command that
reads from the [`external`](#functions-srf-external) function, with the
difference that the latter doesn\'t assume the file schema to be equal
to the table schema, so the schema needs to be given explicitly in the
`external` call or a file format that allows inferring the schema from
the file (such as Apache Parquet) must be used. For example, the
following two statements have the same effect, assuming that
`'products.parquet'` has the same columns as the existing table
`products`:

    COPY products FROM 'products.parquet'
    INSERT INTO products (SELECT * FROM external('products.parquet'))

`COPY` assumes that the columns in the file equal the columns in the
table by types and number, or the listed table columns, if a column list
is specified. In case you only want a subset of columns to be inserted
or need to transform or filter the data before insertion, combine
`external` with `INSERT`.

If you want to create a table based on external data, you can combine
the `external` function with [???](#sql-createtableas) to create and
copy into a table in one statement:

    CREATE TABLE products AS (SELECT * FROM external('products.parquet'))
