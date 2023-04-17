# Type Conversions

Converting from one data type to another can be done using `CAST` or `TRY_CAST`.

```sql_template
CAST (<expression> AS <type>)
<expression>::<type>
TRY_CAST (<expression> AS <type>)
```

The SQL `CAST` function converts a value from one type to another. If the
type conversion fails, an error will be thrown.
In constrast, the `TRY_CAST` function returns NULL if the conversion fails.
The syntax `::` is equivalent `CAST`.


Examples:

    SELECT CAST('true' AS bool);
    Result: t

    SELECT CAST('tuu' AS bool);
    Result: (error)

    SELECT 'true'::bool;
    Result: t

    SELECT 'tuu'::bool;
    Result: (error)

    SELECT TRY_CAST('true' AS bool);
    Result: t

    SELECT TRY_CAST('tuu' AS bool);
    Result: NULL