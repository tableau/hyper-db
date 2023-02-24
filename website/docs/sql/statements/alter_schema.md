# ALTER SCHEMA

ALTER SCHEMA

name

RENAME TO

new_name

## Description

`ALTER SCHEMA` changes the definition of a schema. Currently, Hyper only
supports renaming a schema.

## Parameters

\<name\>

:   The name of an existing schema.

\<new_name\>

:   The new name of the schema. The new name cannot begin with `pg_`, as
    such names are reserved for system schemas.

## Compatibility

There is no `ALTER SCHEMA` statement in the SQL standard.