# Subquery Comparisons

This section describes the SQL-compliant subquery expressions available
in Hyper. All of the expression forms documented in this section return
Boolean results.

## `EXISTS` {#subquery-exists}

```sql_template
EXISTS ( <subquery> )
```

The argument of EXISTS is an arbitrary `SELECT` statement, or subquery.
The subquery is evaluated to determine whether it returns any rows. If
it returns at least one row, the result of EXISTS is "true"; if the
subquery returns no rows, the result of EXISTS is "false".

The subquery can refer to variables from the surrounding query, which
will act as constants during any one evaluation of the subquery.

The subquery will generally only be executed long enough to determine
whether at least one row is returned, not all the way to completion. For
this reason, it is unwise to write a subquery that has side effects,
since those side effects may or may not occur depending on the results
of the subquery.

Since the result depends only on whether any rows are returned, and not
on the contents of those rows, the output list of the subquery is
normally unimportant. A common coding convention is to write all
`EXISTS` expressions in the form `EXISTS(SELECT 1 WHERE ...)`. However,
there are exceptions to this rule, such as subqueries that use
INTERSECT. In that case, a `SELECT 1` in all operands will cause the
`EXISTS` expression to always evaluate to `true`. The same holds for
EXCEPT, with the `EXISTS` evaluating to `false` in that case.

This simple example is like an inner join on `col2`, but it produces at
most one output row for each `tab1` row, even if there are several
matching `tab2` rows:

    SELECT col1
    FROM tab1
    WHERE EXISTS (SELECT 1 FROM tab2 WHERE col2 = tab1.col2);

## `IN` {#subquery-in}

```sql_template
<expression> IN ( <subquery> )
```

The right-hand side is a parenthesized subquery, which must return
exactly one column. The left-hand expression is evaluated and compared
to each row of the subquery result. The result of IN is "true" if any
equal subquery row is found. The result is "false" if no equal row is
found (including the case where the subquery returns no rows).

Note that if the left-hand expression yields `NULL`, or if there are no
equal right-hand values and at least one right-hand row yields `NULL`,
the result of the IN construct will be `NULL`, not false. This is in
accordance with SQL\'s normal rules for Boolean combinations of `NULL`
values.

As with EXISTS, it\'s unwise to assume that the subquery will be
evaluated completely.

## `NOT IN` {#subquery-notin}

```sql_template
<expression> NOT IN ( <subquery> )
```

The right-hand side is a parenthesized subquery, which must return
exactly one column. The left-hand expression is evaluated and compared
to each row of the subquery result. The result of NOT IN is "true" if
only unequal subquery rows are found (including the case where the
subquery returns no rows). The result is "false" if any equal row is
found.

Note that if the left-hand expression yields `NULL`, or if there are no
equal right-hand values and at least one right-hand row yields `NULL`,
the result of the NOT IN construct will be `NULL`, not true. This is in
accordance with SQL\'s normal rules for Boolean combinations of `NULL`
values.

As with EXISTS, it\'s unwise to assume that the subquery will be
evaluated completely.

## `ANY`/`SOME` {#subquery-any-some}

```sql_template
<expression> <operator> ANY ( <subquery> )
<expression> <operator> SOME ( <subquery> )
```

The right-hand side is a parenthesized subquery, which must return
exactly one column. The left-hand expression is evaluated and compared
to each row of the subquery result using the given `<operator>`, which
must yield a Boolean result. The result of ANY is "true" if any true
result is obtained. The result is "false" if no true result is found
(including the case where the subquery returns no rows).

SOME is a synonym for ANY. IN is equivalent to `= ANY`.

Note that if there are no successes and at least one right-hand row
yields `NULL` for the operator\'s result, the result of the ANY
construct will be `NULL`, not false. This is in accordance with SQL\'s
normal rules for Boolean combinations of `NULL` values.

As with EXISTS, it\'s unwise to assume that the subquery will be
evaluated completely.

## `ALL` {#subquery-all}

```sql_template
<expression> <operator> ALL ( <subquery> )
```

The right-hand side is a parenthesized subquery, which must return
exactly one column. The left-hand expression is evaluated and compared
to each row of the subquery result using the given `<operator>`, which
must yield a Boolean result. The result of ALL is "true" if all rows
yield true (including the case where the subquery returns no rows). The
result is "false" if any false result is found. The result is `NULL` if
no comparison with a subquery row returns false, and at least one
comparison returns `NULL`.

NOT IN is equivalent to `<> ALL`.

As with EXISTS, it\'s unwise to assume that the subquery will be
evaluated completely.
