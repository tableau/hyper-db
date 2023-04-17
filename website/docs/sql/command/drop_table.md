# DROP TABLE

— remove a table

## Synopsis

```sql_template
DROP TABLE [ IF EXISTS ] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP TABLE` removes one or more tables from the database. To empty
a table of rows without destroying the table, use [DELETE](delete)
or [TRUNCATE](truncate).

## Parameters

`IF EXISTS`

:   Do not throw an error if the table does not exist.

`<name>`

:   The name (optionally schema-qualified) of the table to drop.

`CASCADE`

:   Automatically drop objects that depend on the table (such as views),
    and in turn all objects that depend on those objects.

`RESTRICT`

:   Refuse to drop the table if any objects depend on it. This is the
    default.

## Examples

To destroy two tables, `films` and `distributors`:

    DROP TABLE films, distributors;

## Compatibility

This command conforms to the SQL standard, except that the standard only
allows one table to be dropped per command, and apart from the
`IF EXISTS` option, which is a Hyper extension (also available in
PostgreSQL).
