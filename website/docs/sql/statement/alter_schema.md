# ALTER SCHEMA

— change properties of a schema

## Synopsis

```
ALTER SCHEMA <name> RENAME TO <new_name>
```

## Description

`ALTER SCHEMA` changes the definition of a schema. Currently, Hyper only
supports renaming a schema.

## Parameters

<dl>
    <dt>&lt;name&gt;</dt>
    <dd>The name of an existing schema.</dd>
    <dt>&lt;new_name&gt;</dt>
    <dd>The new name of the schema. The new name cannot begin with `pg_`, as
    such names are reserved for system schemas.</dd>
</dl>