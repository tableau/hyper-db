# ALTER TABLE

— change the definition of a table

## Synopsis

```sql_template
ALTER TABLE [IF EXISTS] <name> RENAME TO <new_name>;
ALTER TABLE [IF EXISTS] <name> RENAME [COLUMN] <column_name> TO <new_name>;

ALTER TABLE [IF EXISTS] <name>
  ADD [COLUMN] [IF NOT EXISTS] <column_name> <data_type>    
  [COLLATE <collation>]
  [<column_constraint>] [...];

ALTER TABLE [IF EXISTS] DROP [COLUMN] [IF EXISTS] <column_name>

ALTER TABLE [IF EXISTS] <name> ADD <table_constraint>;
```

where `column_constraint` is:

```sql_template
{ NOT NULL | NULL | DEFAULT default_expr }
```

and `table_constraint` is as described in [CREATE TABLE](create_table).

## Description

`ALTER TABLE` changes the definition of an existing table. Hyper
currently only supports the following changes:

`RENAME`

:   The `RENAME` forms change the name of a table, the name of an
    individual column in a table, or the name of a constraint of the
    table. There is no effect on the stored data.

`ADD COLUMN [ IF NOT EXISTS ]`

:   This form adds a new column to the table, using the same syntax as
    [CREATE TABLE](create_table). If `IF NOT EXISTS` is specified and a
    column already exists with this name, no error is thrown. In
    contrast to `CREATE TABLE`, which supports any variable-free
    expression, including non-constant expressions like random(), the
    default value here must be a constant.

`DROP COLUMN [ IF EXISTS ]`

:   This form drops a column from a table. Columns with indexes and
    table constraints can\'t be dropped.

`ADD table_constraint [ NOT VALID ]`

:   This form adds a new constraint to a table using the same syntax as
    [CREATE TABLE](create_table).

Some forms of ALTER TABLE that act on a single table can be combined
into a list of multiple alterations to be applied together. It is
possible to add several columns and/or drop several columns in a single
command. It is also possible to create multiple column constraints in
a single command. It is not possible to combine altering columns with
adding constraints.

## Parameters

`IF EXISTS`

:   Do not throw an error if the table does not exist.

`<name>`

:   The name (optionally schema-qualified) of an existing table to
    alter.

`<column_name>`

:   Name of a new or existing column.

`<new_column_name>`

:   New name for an existing column.

`<new_name>`

:   New name for the table.

`<data_type>`

:   Data type of the new column.

## Notes

The key word `COLUMN` is noise and can be omitted.

Changing any part of a system catalog table is not permitted.

## Examples

To add a column of type `text` to a table:

    ALTER TABLE distributors ADD COLUMN address text;

To drop a column from a table:

    ALTER TABLE distributors DROP COLUMN address;

To rename an existing column:

    ALTER TABLE distributors RENAME COLUMN address TO city;

To rename an existing table:

    ALTER TABLE distributors RENAME TO suppliers;

To add an unnamed assumed foreign key constraint to a table:

    ALTER TABLE distributors ADD ASSUMED FOREIGN KEY (address) REFERENCES addresses (address);

See [CREATE TABLE](create_table) for more examples of table constraints.