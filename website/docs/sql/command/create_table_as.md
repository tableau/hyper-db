# CREATE TABLE AS

— define a new table from the results of a query

## Synopsis

```sql_template
CREATE [ { TEMPORARY | TEMP } ] TABLE [IF NOT EXISTS] <table_name>
    [ (<column_name> [, ...] ) ]
    AS <query>
    [WITH [NO] DATA]
```

## Description

`CREATE TABLE AS` creates a table and fills it with data computed by a
`<query>`, usually a [SELECT](select) command. The table columns have
the names and data types associated with the output columns of the
`<query>` (except that you can override the column names by giving an
explicit list of new column names).

`CREATE TABLE AS` bears some resemblance to creating a view, but it is
really quite different: it creates a new table and evaluates the query
just once to fill the new table initially. The new table will not track
subsequent changes to the source tables of the query. In contrast, a
view re-evaluates its defining `SELECT` statement whenever it is
queried.

## Parameters

`TEMPORARY` or `TEMP`

:   If specified, the table is created as a temporary table. Refer to
    [CREATE TABLE](create_table) for details.

`IF NOT EXISTS`

:   Do not throw an error if a table with the same name already exists.
    Refer to [CREATE TABLE](create_table) for details.

`<table_name>`

:   The name (optionally schema-qualified) of the table to be created.

`<column_name>`

:   The name of a column in the new table. If column names are not
    provided, they are taken from the output column names of the query.

`<query>`

:   A [SELECT](select) command in any of its forms (`SELECT`, `TABLE`,
    or `VALUES`).

`WITH [ NO ] DATA`

:   This clause specifies whether or not the data produced by the query
    should be copied into the new table. If not, only the table
    structure is copied. The default is to copy the data.

## Examples

Create a new table `films_recent` consisting of only recent entries from
the table `films`:

    CREATE TABLE films_recent AS
      SELECT * FROM films WHERE date_prod >= '2002-01-01';

To copy a table completely, the short form using the `TABLE` command can
also be used:

    CREATE TABLE films2 AS
      TABLE films;

## Compatibility

`CREATE TABLE AS` conforms to the SQL standard. The following are
nonstandard extensions:

-   The standard requires parentheses around the subquery clause; in
    Hyper, these parentheses are optional.
-   In the standard, the `WITH [ NO ] DATA` clause is required; in Hyper
    it is optional.
-   Hyper handles temporary tables in a way rather different from the
    standard; see [CREATE TABLE](create_table) for details.