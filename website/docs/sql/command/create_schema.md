# CREATE SCHEMA

— define a new schema

## Synopsis

```sql_template
CREATE SCHEMA [IF NOT EXISTS] <schema_name>
```

## Description

`CREATE SCHEMA` enters a new schema into the current database. The
schema name must be distinct from the name of any existing schema in the
current database.

A schema is essentially a namespace: it contains named objects (tables,
data types, functions, and operators) whose names can duplicate those of
other objects existing in other schemas. Named objects are accessed
either by "qualifying" their names with the schema name as a prefix, or
by setting a search path that includes the desired schema(s). A `CREATE`
command specifying an unqualified object name creates the object in the
current schema (the one at the front of the search path, which can be
determined with the function `current_schema`).

## Parameters

`<schema_name>`

:   The name of a schema to be created. If this is omitted, the
    `<user_name>` is used as the schema name.

`IF NOT EXISTS`

:   Do nothing if a schema with the same name already exists.

## Examples

Create a schema:

    CREATE SCHEMA myschema;

## Compatibility

The `IF NOT EXISTS` option is a Hyper extension.