# Row Comparisons

This section describes several specialized constructs for making
multiple comparisons between groups of values. These forms are
syntactically related to the subquery forms of the previous section, but
do not involve subqueries. All of the expression forms documented in
this section return Boolean results.

## `IN` {#functions-comparisons-in-scalar}

```sql_template
<expression> IN ( <value>, ... )
```

The right-hand side is a parenthesized list of scalar expressions. The
result is "true" if the left-hand expression\'s result is equal to any
of the right-hand expressions. This is a shorthand notation for
\<expression\> = \<value1\> OR \<expression\> = \<value2\> OR \...

Note that if the left-hand expression yields null, or if there are no
equal right-hand values and at least one right-hand expression yields
null, the result of the IN construct will be null, not false. This is in
accordance with SQL\'s normal rules for Boolean combinations of null
values.

## `NOT IN`

```sql_template
<expression> NOT IN ( <value>, \...)
```

The right-hand side is a parenthesized list of scalar expressions. The
result is "true" if the left-hand expression\'s result is unequal to all
of the right-hand expressions. This is a shorthand notation for
\<expression\> \<\> \<value1\> AND \<expression\> \<\> \<value2\> AND
\...

Note that if the left-hand expression yields null, or if there are no
equal right-hand values and at least one right-hand expression yields
null, the result of the NOT IN construct will be null, not true as one
might expect. This is in accordance with SQL\'s normal rules for Boolean
combinations of null values.

:::tip
`x NOT IN y` is equivalent to `NOT (x IN y)` in all cases. However, null
values are much more likely to trip up the novice when working with NOT
IN than when working with IN. It is best to express your condition
positively if possible.
:::
