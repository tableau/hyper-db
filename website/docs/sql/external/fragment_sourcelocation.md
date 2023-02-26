source_location

Location from which to read data. Can be a path in the file system of
the Hyper server (not the client!) or an Amazon S3 URI (for example
`'s3://mybucket/path/to/myfile.csv'`).

In case of an Amazon S3 URI, the extended syntax `s3_location(...)`
needs to be used to specify credentials and optionally a bucket region.
The specified credentials can be empty when used for buckets with
anonymous access. If no bucket region is specified, Hyper infers the
bucket region. This requires that the specified credentials have
permissions for the `HeadBucket` S3 request.

Hyper\'s read capabilities from Amazon S3 are highly optimized (using
techniques such as concurrent requests, request hedging and
prefetching). For maximum performance, ensure a high network bandwidth
to Amazon S3, e.g., by running HyperAPI directly on an AWS EC2 instance.

The `ARRAY[ source_location [, ...] ]` syntax can be used to read from a
list of source locations. All source locations in this list must share
the same file format.