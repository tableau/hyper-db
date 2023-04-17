# TRUNCATE

— empty a table

## Synopsis

```sql_template
TRUNCATE [ TABLE ] <name>
```

## Description

`TRUNCATE` removes all rows from a table. It has the same effect as an
unqualified `DELETE` on the target table. It is just used as a
convenience statement.

## Parameters

`<name>`

:   The name (optionally schema-qualified) of a table to truncate.

## Examples

Truncate the table `bigtable`:

    TRUNCATE bigtable;
