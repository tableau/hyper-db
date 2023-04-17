# External Locations

To specify the location where external data should be read use one of

```sql_template
'file_system_path'
'amazon_s3_uri'
s3_location('amazon_s3_uri'
    [, access_key_id => 'text', secret_access_key => 'text' [, session_token => 'text'] ]
    [, region => 'text']
)
ARRAY[ <source_location> [, ...] ]
```

This can be a path in the file system of the Hyper server (not the
client!) or an Amazon S3 URI (for example `s3://mybucket/path/to/myfile.csv`).

## Local files

```
SELECT * FROM external('path/to/data.parquet')
```

Using a file system path instructs the Hyper server to directly read from
a file. Therefore, they must reside on or be accessible to the database
server machine, not the client. They must be accessible to and readable
by the Hyper user (the user ID the server runs as), not the client.
The name must be specified from the viewpoint of the server.

## Amazon S3

```
SELECT * FROM external(
    s3_location(
        's3://mybucket/mydirectory/products.parquet',
        access_key_id => 'ACCESSKEYID12EXAMPLE',
        secret_access_key => 'sWfssWSmnME5X/36dsf3G/cbyDzErEXAMPLE123',
        region => 'us-east-1'
    )
)
```

In case of an Amazon S3 URI, the extended syntax `s3_location(...)`
can be used to specify credentials and optionally a bucket region.
The specified credentials can be empty when used for buckets with
anonymous access.

If no bucket region is specified, Hyper infers the
bucket region. This requires that the specified credentials have
permissions for the `HeadBucket` S3 request.

Hyper's read capabilities from Amazon S3 are highly optimized (using
techniques such as concurrent requests, request hedging and
prefetching). For maximum performance, ensure a high network bandwidth
to Amazon S3, e.g., by running HyperAPI directly on an AWS EC2 instance.

## Multiple files

```
SELECT * FROM external(
    ARRAY['data/2022/sales.parquet', 'data/2023/sales.parquet']
)
```

The `ARRAY[ <source_location> [, ...] ]` syntax can be used to read from a
list of source locations. All source locations in this list must share
the same file format. The list can contain S3 locations, local files or any
other file locations.

When scanning multiple files at once, different external formats cannot be
mixed in one invocation of `external` or in one external table. To scan data
from different formats at the same time or to scan data in the same
format but with different format options (e.g., when having CSV files
with different delimiters), use one `external` function or external
table per format and combine the results with `UNION ALL`. Of course,
this works only if the selected columns exist in all files. The
following example combines two parquet files with two CSV files:

    -- products1.parquet and products2.parquet both contain the columns (name text, price int)
    SELECT name, price FROM external(ARRAY['products1.parquet', 'products2.parquet'])
    UNION ALL
    SELECT name, price FROM external('products3.csv', COLUMNS => DESCRIPTOR(name text, price int), DELIMITER => ';')
    UNION ALL
    SELECT name, price FROM external('products4.csv', COLUMNS => DESCRIPTOR(name text, discount double precision, price int), DELIMITER => '|')

The two parquet files can be scanned with one invocation of `external`,
the CSV files have a different schema and different delimiter, so they
need to be scanned separately. Note that we can still combine
`'products4.csv'` with the rest even though it has an additional column
`discount`, as this column is not selected.
