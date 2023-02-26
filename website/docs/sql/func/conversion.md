# Data Type Conversion

This section describes the functions for converting between data types
in Hyper.

## `CAST` {#functions-cast}

The SQL CAST function converts a value from one type to another. If the
type conversion fails, an error will be thrown. CAST ( \<value\> AS
\<type\> ) \<value\> :: \<type\> Examples:

    SELECT CAST('true' AS bool);
    Result: t

    SELECT CAST('tuu' AS bool);
    Result: (error)

## `TRY_CAST` {#functions-try_cast}

The SQL TRY_CAST function converts a value from one type to another. If
the conversion fails, \`NULL\` will be returned. `NULL` will be
returned. TRY_CAST ( \<value\> AS \<type\> ) Examples:

    SELECT TRY_CAST('true' AS bool);
    Result: t

    SELECT TRY_CAST('tuu' AS bool);
    Result: NULL
