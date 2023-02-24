# Set Returning Functions {#functions-srf}

This section describes functions that possibly return more than one row.
Set returning functions can be used in SQL queries in places where a
table can be referenced.

## `external` {#functions-srf-external}

external(

source_location

\[,

option

\[, \...\] \] )

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

COLUMNS =\> DESCRIPTOR(

column_def

\[, \... \])

format_specific_option

=\>

value

and

column_def

is:

column_name

data_type

\[ COLLATE

collation

\] \[ NOT NULL \| NULL \]

The `external` function reads data stored in an external file format
from one or multiple external locations.

`FORMAT => format_name`

:   Selects the data format to be read. This option can be omitted in
    case the format can be inferred from the file extension. In case of
    a list of sources, all of them need to share this extension.
    Supported formats are depicted in detail in
    [???](#external-formats).

`COLUMNS => DESCRIPTOR(column_def [, ... ])` where \<column_def\> is: \<column_name\> \<data_type\>`[ COLLATE collation ] [ NOT NULL | NULL ]`

:   The schema of the file. This option must be given, unless Hyper can
    infer the schema from the file if it carries schema information. See
    [???](#table-external-formats) for which formats support inferring
    the schema this way.

`format_specific_option => value`

:   A format-specific option. The available options for each respective
    format can be found in [???](#table-external-formats).

Some examples:

Read a local CSV file from the working directory of the Hyper server,
having two columns and a custom delimiter. A filter is applied to the
price column:

    SELECT name FROM external(
        './products.csv',
        COLUMNS => DESCRIPTOR(
            name      text NOT NULL,
            price     int
        ),
        FORMAT => 'csv',
        DELIMITER => '|'
    ) WHERE price > 100;

Same but reading from multiple CSV files:

    SELECT name FROM external(
        ARRAY['./products1.csv', './products2.csv', './products3.csv'],
        COLUMNS => DESCRIPTOR(
            name      text NOT NULL,
            price     int
        ),
        FORMAT => 'csv',
        DELIMITER => '|'
    ) WHERE price > 100;

Reading an Apache Parquet file from Amazon S3 using empty credentials
and inferring the bucket region. Note that accessing Amazon S3 is [an
experimental feature](#experimentalsettings). The schema of the file is
inferred from the schema information in the file. The file format is
inferred from the file extension:

    SELECT name FROM external(
            s3_location(
            's3://mybucket/mydirectory/products.parquet',
            access_key_id => '',
            secret_access_key => ''
        )
    ) WHERE price > 100;

Same but with explicit Amazon S3 credentials and bucket region:

    SELECT name FROM external(
        s3_location(
            's3://mybucket/mydirectory/products.parquet',
            access_key_id => 'ACCESSKEYID12EXAMPLE',
            secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
            region => 'us-east-1'
        )
    ) WHERE price > 100;

## `generate_series`

  Function                               Argument Type                  Return Type                                                               Description
  -------------------------------------- ------------------------------ ------------------------------------------------------------------------- --------------------------------------------------------------------------------
  `generate_series(start, stop)`         `int`, `bigint` or `numeric`   `setof int`, `setof bigint`, or `setof numeric` (same as argument type)   Generate a series of values, from `start` to `stop` with a step size of one
  `generate_series(start, stop, step)`   `int`, `bigint` or `numeric`   `setof int`, `setof bigint` or `setof numeric` (same as argument type)    Generate a series of values, from `start` to `stop` with a step size of `step`

  : Series Generating Functions

When `step` is positive, zero rows are returned if `start` is greater
than `stop`. Conversely, when `step` is negative, zero rows are returned
if `start` is less than `stop`. Zero rows are also returned for `NULL`
inputs. It is an error for `step` to be zero. Some examples follow:

    SELECT * FROM generate_series(2,4);
    generate_series
    -----------------
    2
    3
    4
    (3 rows)

    SELECT * FROM generate_series(5,1,-2);
    generate_series
    -----------------
    5
    3
    1
    (3 rows)

    SELECT * FROM generate_series(4,3);
    generate_series
    -----------------
    (0 rows)

    SELECT generate_series(1.1, 4, 1.3);
    generate_series
    -----------------
    1.1
    2.4
    3.7
    (3 rows)

    -- this example relies on the date-plus-integer operator
    SELECT current_date + s.a AS dates FROM generate_series(0,14,7) AS s(a);
    dates
    ------------
    2004-02-05
    2004-02-12
    2004-02-19
    (3 rows)
       
