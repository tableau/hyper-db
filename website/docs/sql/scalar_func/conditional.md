# Conditional Expressions

The conditional expressions select one of multiple result values.

## `CASE` {#case}

The SQL CASE expression is a generic conditional expression, similar to
if/else statements in other programming languages.
CASE clauses can be used wherever an expression is valid
They come in two variants:

```sql_template
CASE
    WHEN <condition> THEN <result>
    [WHEN ...]
    [ELSE <result>]
END CASE

CASE <expression>
    WHEN <value> THEN <result>
    [WHEN ...]
    [ELSE <result>]
END CASE
```

In the first variant, each `condition` is an expression that returns
a boolean result. If the condition's result is true, the value of the
CASE expression is the `result` that follows the condition, and the
remainder of the CASE expression is not processed. If the condition's
result is not true, any subsequent WHEN clauses are examined in the
same manner. If no WHEN `condition` yields true, the value of the CASE
expression is the `result` of the ELSE clause. If the ELSE clause is
omitted and no condition is true, the result is null.

E.g., the query

```sql_template
CREATE TABLE test AS VALUES(1),(2),(3);

SELECT a,
    CASE
        WHEN a=1 THEN 'one'
        WHEN a=2 THEN 'two'
        ELSE 'other'
    END
FROM test;
```

yields the result

```
a | case
--+-------
1 | one
2 | two
3 | other
```

The second form of CASE expressions, sometimes referred to as "simple"
case expressions, is similar to a `switch` statement in C.

First, `expression` is computed and then compared to each of the `value`
expressions in the WHEN clauses until one is found that is equal to it.
If no match is found, the `result` of the ELSE clause (or a null value)
is returned.

The example above can be written using the simple CASE syntax:

```sql_template
SELECT a,
    CASE a
        WHEN 1 THEN 'one'
        WHEN 2 THEN 'two'
        ELSE 'other'
    END
FROM test;
```

A CASE expression does not evaluate any subexpressions that are not
needed to determine the result. For example, this is a possible way of
avoiding a division-by-zero failure:

```sql_template
SELECT ... WHERE CASE WHEN x <> 0 THEN y/x > 1.5 ELSE false END;
```

The data types of all the `result` expressions must be convertible to
a single output type.

## `COALESCE` {#coalesce-nvl-ifnull}

```sql_template
COALESCE(<value>, ...)
```

The `COALESCE` function returns the first of its arguments that is not
null. Null is returned only if all arguments are null. It is often used
to substitute a default value for null values when data is retrieved for
display, for example:

```sql_template
SELECT COALESCE(description, short_description, '(none)') ...
```

This returns `description` if it is not null, otherwise
`short_description` if it is not null, otherwise `(none)`.

Like a CASE expression, `COALESCE` only evaluates the arguments that are
needed to determine the result; that is, arguments to the right of the
first non-null argument are not evaluated.

## `NULLIF` {#nullif}

```sql_template
NULLIF(<value1>, <value2>)
```

The `NULLIF` function returns a null value if `value1` equals
`value2`; otherwise it returns `value1`. This can be used to perform
the inverse operation of the `COALESCE` example given above:

```sql_template
SELECT NULLIF(value, '(none)')
```

In this example, if `value` is `(none)`, null is returned, otherwise the
value of `value` is returned.

## `GREATEST` and `LEAST` {#greatest-least}

```sql_template
GREATEST(value, ...)
LEAST(value, ...)
GREATEST(PRESERVE NULLS value, ...)
LEAST(PRESERVE NULLS value, ...)
```

The `GREATEST` and `LEAST` functions select the largest or smallest
value from a list of any number of expressions. The expressions must all
be convertible to a common data type, which will be the type of the
result.

By default, NULL values in the list are ignored. The result will be NULL
only if all the inputs evaluate to NULL.
If NULLs from the inputs should be preserve, use the `PRESERVE NULLS
variants. In this case the result will be NULL if any input is NULL.

Note that `GREATEST` and `LEAST` are not in the SQL standard, but are a
common extension.
