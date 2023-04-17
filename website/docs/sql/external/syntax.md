# Reading External Data in SQL

Hyper provides three options to refer to external data in SQL:

-   External data can be copied into a Hyper table with the
    [COPY FROM](../command/copy_from) SQL command.

-   External data can be read directly in a SQL query using the set
    returning function [external](../setreturning#external). In this
    case, no Hyper table is involved, so such a query can even be used
    if no database is attached to the current session.

-   External data can be exposed as if it was a table using the
    [CREATE EXTERNAL TABLE](../command/create_external_table) SQL
    command. It can then  subsequently be queried using the name of
    the external table. Again, no Hyper table is involved; querying
    an external table will instead result in the data being read from
    the external source directly.

Usage examples of the individual alternatives can be found in the
documentations of the respective statements.
The choice between these ways to access external data depends on the use
case.

## `COPY` vs. `INSERT` + `external`

`COPY` will create a copy of the data in a Hyper table. It is
functionally equivalent to an [INSERT](../command/insert) command that
reads from the `external` function. For example, the following two
statements have the same effect, assuming that `'products.parquet'`
has the same columns as the existing table `products`:

```
COPY products FROM 'products.parquet';
INSERT INTO products (SELECT * FROM external('products.parquet'))
```

The two statements differ in that the `COPY` statement will
automatically select only the columns that are in the target table,
while the insert statement needs to name the columns to insert
explicitly, in case the external file has more columns. Also, for
formats that do not carry schema information (such as CSV), `COPY` will
assume that the file has the schema of the table, while `external` will
require the schema to be given explicitly.

In general, using `INSERT` with `external` is more flexible, as it
allows to transform and filter the data before it is inserted into the
table. For example, the following query will only insert products with a
price greater than 100 and it will transform the product name to upper
case:

```
INSERT INTO products (
    SELECT upper(name), price
    FROM external('products.parquet')
    WHERE price > 100)
```

`external` can also be used in `CREATE TABLE AS` statements to concisely
create and fill a new Hyper table. For example, this will create and
fill a products table:

```
CREATE TABLE products AS (SELECT * FROM external('products.parquet'))
```

## Creating External Tables vs. Using Ad-hoc Queryies

The set returning function `external` and the
`CREATE TEMPORARY EXTERNAL TABLE` statement can both be used to query
external data without inserting it into a Hyper table.

Using `external` has the advantage that it enables to write a fully
self-contained query that does not rely on external tables being set up
before. `CREATE TEMPORARY EXTERNAL TABLE` on the other hand enables
reading external data as if it was a Hyper table. It therefore enables
SQL queries that can either operate on a Hyper table or on an external
table without changing their syntax. Also, these queries contains less
visual noise.

`CREATE TEMPORARY EXTERNAL TABLE` will infer the schema of the source on
creation. If the source file then gets replaced by a file with a
different schema, subsequent queries will fail. In contrast, `external`
will re-infer the schema whenever the query containing it is executed.

Creating an external table is also a hint to Hyper that the external
data might be accessed multiple times. Therefore, Hyper might cache more
statistics or schema information for the data, so subsequent queries
might be faster. This however is by no means guaranteed.