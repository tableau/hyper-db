# Comparison Operators

Comparison operators compare a value against another value.

## Usual comparison operators

The usual comparison operators are available:

Operator|Description
---|---
`<`|less than
`>`|greater than
`<=`|less than or equal to
`>=`|greater than or equal to
`=`|equal
`<>` or `!=`|not equal

Comparison operators are available for all relevant data types. All
comparison operators are binary operators that return values of type
`boolean`. Expressions like `1 < 2 < 3` are not valid (because there is
no `<` operator to compare a Boolean value with `3`).

## `BETWEEN`

The `BETWEEN` predicate simplifies range tests

```sql_template
<a> BETWEEN <x> AND <y>
<a> NOT BETWEEN <x> AND <y>
```

`a BETWEEN x AND y` is equivalent to `a >= x AND a <= y`.
Notice that `BETWEEN` treats the endpoint values as included in the range.
`NOT BETWEEN` does the opposite comparison: `a NOT BETWEEN x AND y`
is equivalent to `a < x OR a > y`.

## NULL-sensitive comparison operators

While the normal comparison operators and `BETWEEN` ignore NULLs, we
sometimes want different NULL behavior. For this purpose, the SQL standard
provides the following comparison functions. These behave much like operators
 but have special syntax mandated by the SQL standard.

```sql_template
<a> IS DISTINCT FROM <b>
<a> IS NOT DISTINCT FROM <b>
<expression> IS NULL
<expression> IS NOT NULL
<expression> ISNULL         -- nonstandard syntax
<expression> NOTNULL        -- nonstandard syntax
<boolean_expression> IS TRUE
<boolean_expression> IS NOT TRUE    -- is false or unknown
<boolean_expression> IS FALSE
<boolean_expression> IS NOT FALSE   -- is true or unknown
<boolean_expression> IS UNKNOWN
<boolean_expression> IS NOT UNKNOWN -- is true or false
```

Ordinary comparison operators yield null (signifying "unknown"), not
true or false, when either input is null. For example, `7 = NULL` yields
null, as does `7 <> NULL`. When this behavior is not suitable, use the
`IS NOT DISTINCT FROM` predicates: `a IS DISTINCT FROM b`,
`a IS NOT DISTINCT FROM b`. For non-null inputs, `IS DISTINCT FROM` is the
same as the `<>` operator. However, if both inputs are null it returns
false, and if only one input is null it returns true. Similarly,
`IS NOT DISTINCT FROM` is identical to `=` for non-null inputs, but it
returns true when both inputs are null, and false when only one input is
null. Thus, these predicates effectively act as though null were a
normal data value, rather than "unknown".

To check whether a value is or is not null, use the predicates
`expression IS NULL`, `expression IS NOT NULL` or the equivalent, but
nonstandard, predicates: `expression ISNULL`, `expression NOTNULL`.

Do *not* write `expression = NULL` because `NULL` is not "equal to"
`NULL`. (The null value represents an unknown value, and it is not known
whether two unknown values are equal.)

Boolean values can also be tested using the predicates `IS TRUE`,
`IS NOT TRUE`, `IS FALSE`, `IS NOT FALSE`, `IS UNKNOWN`, and `IS NOT UNKNOWN`.
These will always return true or false, never a null value, even when
the operand is null. A null input is treated as the logical value
"unknown". Notice that `IS UNKNOWN` and `IS NOT UNKNOWN` are effectively
the same as `IS NULL` and `IS NOT NULL`, respectively, except that the
input expression must be of Boolean type.


## `IN` and `NOT IN` {#comparisons-in-scalar}

`IN` and `NOT IN` compare an expression against multiple values. They use
the syntax

```sql_template
<expression> IN ( <value>, ... )
<expression> NOT IN ( <value>, ... )
```

The right-hand side is a parenthesized list of scalar expressions. The value
from the left-hand side is compared against each of the expressions from the
right-hand side.

For `IN`, the result is "true" if the left-hand expression's result is
equal to any of the right-hand expressions. This is a shorthand notation
for `expression = value1 OR expression = value2 OR ...`

For `NOT IN` the result is "true" if the left-hand expression's result is
unequal to all of the right-hand expressions. This is a shorthand notation
for `expression <> value1 AND expression <> value2 AND ...`

Note that if the left-hand expression yields null, or if there are no
equal right-hand values and at least one right-hand expression yields
null, the result of the `IN`/`NOT IN` construct will be null, not false.
This is in accordance with SQL's normal rules for Boolean combinations
of null values.

`IN` and `NOT IN` are syntactically related to the [subquery forms](subquery_comparison#subquery-in)
but do not involve subqueries.

:::note
`x NOT IN y` is equivalent to `NOT (x IN y)` in all cases. However, null
values are much more likely to trip up the novice when working with NOT
IN than when working with IN. It is best to express your condition
positively if possible.
:::
