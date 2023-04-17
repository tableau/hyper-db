# DEALLOCATE

— deallocate a prepared statement

## Synopsis

```sql_template
DEALLOCATE [PREPARE] { <name> | ALL }
```

## Description

`DEALLOCATE` is used to deallocate a previously prepared SQL statement.
If you do not explicitly deallocate a prepared statement, it is
deallocated when the session ends.

For more information on prepared statements, see [PREPARE](prepare).

## Parameters

`PREPARE`

:   This optional key word is ignored and has no semantical meaning.

`<name>`

:   The name of the prepared statement to deallocate.

`ALL`

:   Deallocate all prepared statements.

## Compatibility

The SQL standard includes a `DEALLOCATE` statement, but it is only for
use in embedded SQL.