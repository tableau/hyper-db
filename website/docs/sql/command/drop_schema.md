# DROP SCHEMA

— remove a schema

## Synopsis

```sql_template
DROP SCHEMA [IF EXISTS] <name> [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP SCHEMA` removes one or more schemas from the database.

A schema can only be dropped by its owner or a superuser.

## Parameters

`IF EXISTS`

:   Do not throw an error if the schema does not exist. A notice is
    issued in this case.

`<name>`

:   The name of a schema.

`CASCADE`

:   Automatically drop objects (tables, functions, etc.) that are
    contained in the schema, and in turn all objects that depend on
    those objects.

`RESTRICT`

:   Refuse to drop the schema if it contains any objects. This is the
    default.

## Notes

Using the `CASCADE` option might make the command remove objects in
other schemas besides the one(s) named.

## Examples

To remove schema `mystuff` from the database, along with everything it
contains:

    DROP SCHEMA mystuff CASCADE;

## Compatibility

`DROP SCHEMA` is fully conforming with the SQL standard, except that the
standard only allows one schema to be dropped per command, and apart
from the `IF EXISTS` option, which is a Hyper extension.

## See Also
