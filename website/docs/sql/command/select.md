# SELECT

— retrieve rows from a table or view

## Synopsis

```sql_template
[ WITH [ RECURSIVE ] <with_query> [, ...] ]
SELECT [ ALL | DISTINCT [ ON ( <expression> [, ...] ) ] ]
    [ * | <expression> [ [ AS ] <output_name> ] [, ...] ]
    [ FROM <from_item> [, ...] ]
    [ WHERE <condition> ]
    [ GROUP BY <grouping_element> [, ...] ]
    [ HAVING <condition> [, ...] ]
    [ WINDOW <window_name> AS ( <window_definition> ) [, ...] ]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] <select> ]
    [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
    [ LIMIT { <count> | ALL } ]
    [ OFFSET <start> [ ROW | ROWS ] ]
    [ FETCH { <FIRST> | <NEXT> } [ <count> ] { ROW | ROWS } ONLY ];
```

where `with_query` is:

```sql_template
<with_query_name> [ ( <column_name> [, ...] ) ] AS ( <select> )
```

and `from_item` can be one of:

```sql_template
<table_name> [ [ AS ] <alias> [ ( <column_alias> [, ...] ) ] ]
    [ TABLESAMPLE <sampling_method> ( <sample_size> ) [ REPEATABLE ( <seed> ) ] ]

<with_query_name> [ [ AS ] <alias> [ ( <column_alias> [, ...] ) ] ]

[ LATERAL ] ( <select> ) [ AS ] [<alias>] [ ( <column_alias> [, ...] ) ]

[ LATERAL ] <function_name> ( [ <argument> [, ...] ] )
    [ [ AS ] <alias> [ ( <column_alias> [, ...] ) ] ]

<from_item> [ NATURAL ] <join_type> <from_item>
    [ ON <join_condition> | USING ( <join_column> [, ...] )
```

and `grouping_element` can be one of

```sql_template
( )
<expression>
( <expression>s [, ...] )
ROLLUP ( { <expression> | ( <expression> [, ...] ) } [, ...] )
CUBE ( { <expression> | ( <expression> [, ...] ) } [, ...] )
GROUPING SETS ( <grouping_element> [, ...] )
```

and `sample_size` can be one of:

```sql_template
<size> [ ROWS | PERCENT ]
<size> PERCENT [ BETWEEN { <count> | UNBOUNDED } ROWS AND { <count> | UNBOUNDED } ROWS }
```

## Description

`SELECT` retrieves rows from zero or more tables. The general processing
of `SELECT` is as follows:

1.  The queries in the `WITH` list effectively serve as temporary tables
    that can be referenced in the `FROM` list. A `WITH` query that is
    referenced more than once in `FROM` is computed only once. See [WITH
    Clause](#with) below.

2.  All elements in the `FROM` list are computed. If more than one
    element is specified in the `FROM` list, they are cross-joined
    together. See [FROM Clause](#from) below.

3.  If the `WHERE` clause is specified, all rows that do not satisfy the
    condition are eliminated from the output. See [WHERE Clause](#where)
    below.

4.  If the `GROUP BY` clause is specified, or if there are
    [aggregate function](/docs/sql/aggregate) calls, the output is
    combined into groups of rows that match on one or more values,
    and the results of aggregate functions are computed. If the `HAVING`
    clause is present, it eliminates groups that do not satisfy the
    given condition. See [GROUP BY Clause](#groupby) and
    [HAVING Clause](#having) below.

5.  The actual output rows are computed using the `SELECT` output
    expressions for each selected row or row group. See [SELECT
    List](#select-list) below.

6.  `SELECT DISTINCT` eliminates duplicate rows from the result.
    `SELECT DISTINCT ON` eliminates rows that match on all the specified
    expressions. `SELECT ALL` (the default) will return all candidate
    rows, including duplicates. See [DISTINCT Clause](#distinct) below.

7.  Using the operators `UNION`, `INTERSECT`, and `EXCEPT`, the output
    of more than one `SELECT` statement can be combined to form a single
    result set. The `UNION` operator returns all rows that are in one or
    both of the result sets. The `INTERSECT` operator returns all rows
    that are strictly in both result sets. The `EXCEPT` operator returns
    the rows that are in the first result set but not in the second. In
    all three cases, duplicate rows are eliminated unless `ALL` is
    specified. The noise word `DISTINCT` can be added to explicitly
    specify eliminating duplicate rows. Notice that `DISTINCT` is the
    default behavior here, even though `ALL` is the default for `SELECT`
    itself. See [UNION Clause](#union), [INTERSECT Clause](#intersect),
    and [EXCEPT Clause](#except) below.

8.  If the `ORDER BY` clause is specified, the returned rows are sorted
    in the specified order. If `ORDER BY` is not given, the rows are
    returned in whatever order the system finds fastest to produce. See
    [ORDER BY Clause](#orderby) below.

9.  If the `LIMIT` (or `FETCH FIRST`) or `OFFSET` clause is specified,
    the `SELECT` statement only returns a subset of the result rows.
    See [LIMIT Clause](#limit) below.

## Parameters

### `WITH` Clause {#with}

The `WITH` clause allows you to specify one or more subqueries that can
be referenced by name in the primary query. The subqueries effectively
act as temporary tables or views for the duration of the primary query.
Each subquery can be a `SELECT`, [`TABLE`](table), or
[`VALUES` statement](values).

A name (without schema qualification) must be specified for each `WITH`
query. Optionally, a list of column names can be specified; if this is
omitted, the column names are inferred from the subquery.

If `RECURSIVE` is specified, it allows a `SELECT` subquery to reference
itself by name. Such a subquery must have the form
`<non_recursive_term> UNION [ ALL | DISTINCT ] <recursive_term>`
where the recursive self-reference must appear on the right-hand side of
the `UNION`. Only one recursive self-reference is permitted per query.
Recursive data-modifying statements are not supported, but you can use
the results of a recursive `SELECT` query in a data-modifying statement.

A key property of `WITH` queries is that they are evaluated only once
per execution of the primary query, even if the primary query refers to
them more than once. In particular, data-modifying statements are
guaranteed to be executed once and only once, regardless of whether the
primary query reads all or any of their output.

The primary query and the `WITH` queries are all (notionally) executed
at the same time. This implies that the effects of a data-modifying
statement in `WITH` cannot be seen from other parts of the query, other
than by reading its `RETURNING` output. If two such data-modifying
statements attempt to modify the same row, the results are unspecified.

### `FROM` Clause {#from}

The `FROM` clause specifies one or more source tables for the `SELECT`.
If multiple sources are specified, the result is the Cartesian product
(cross join) of all the sources. But usually qualification conditions
are added (via `WHERE`) to restrict the returned rows to a small subset
of the Cartesian product.

The `FROM` clause can contain the following elements:

`<table_name>`

:   The name (optionally schema-qualified or database-qualified) of an
    existing table or view.

`<alias>`

:   A substitute name for the `FROM` item containing the alias. An alias
    is used for brevity or to eliminate ambiguity for self-joins (where
    the same table is scanned multiple times). When an alias is
    provided, it completely hides the actual name of the table or
    function; for example given `FROM foo AS f`, the remainder of the
    `SELECT` must refer to this `FROM` item as `f` not `foo`. If an
    alias is written, a column alias list can also be written to provide
    substitute names for one or more columns of the table.

`TABLESAMPLE sampling_method ( sample_size ) [ REPEATABLE ( seed ) ]`

:   A `TABLESAMPLE` clause after a `<table_name>` indicates that the
    specified `<sampling_method>` should be used to retrieve a subset of
    the rows in that table. This sampling precedes the application of
    any other filters such as `WHERE` clauses. Hyper supports two
    sampling methods, `BERNOULLI` and `SYSTEM`.
:   The optional `REPEATABLE` clause specifies a `<seed>` number to use
    for generating random numbers within the sampling method. The seed
    value can be any non-null floating-point literal. Two queries that
    specify the same seed and `<sample_size>` values will select the
    same sample of the table, if the table has not been changed
    meanwhile. But different seed values will usually produce different
    samples. If `REPEATABLE` is not given then a new random sample is
    selected for each query, based upon a system-generated seed.

`<sampling_method>`

:   The `BERNOULLI` method scans the whole table and selects or ignores
    individual rows independently. The `SYSTEM` method does block-level
    sampling, i.e. tuples are drawn randomly in a subset of the table's
    data blocks. The `SYSTEM` method is significantly faster than the
    `BERNOULLI` method when small sampling percentages are specified,
    but it may return a less-random sample of the table as a result of
    clustering effects.

`<sample_size>`

:   The `BERNOULLI` and `SYSTEM` sampling methods each accept a single
    `<sample_size>` argument which determines the number of rows to be
    sampled from the table. The sample size can be specified as a fixed
    number of rows using the `ROWS` syntax, or as a percentage
    (specified as a real number between 0 and 100) of the total number
    of rows in the table using the `PERCENT` syntax. If only a number is
    provided without any keywords, `PERCENT` is assumed as default. The
    argument used for the size must be a numeric literal.
:   When `PERCENT` is specified explicitly, the absolute number of rows
    returned can be bounded with an optional `BETWEEN` clause, which
    specifies the minimum and maximum number of rows to be returned. The
    `UNBOUNDED` keyword can be used instead of a number argument to
    indicate that the sample size is not bounded, either from below or
    from above. Specifying `UNBOUNDED` in both arguments is not valid.
:   Note that the lower bound is not guaranteed. If the table has too
    few rows, the sample might be smaller than the given lower bound
    with `PERCENT` or than the given row count with `ROWS`. Upper
    bounds, on the other hand, are guaranteed.

`<select>`

:   A sub-`SELECT` can appear in the `FROM` clause. This acts as though
    its output were created as a temporary table for the duration of
    this single `SELECT` command. Note that the sub-`SELECT` must be
    surrounded by parentheses, and providing an alias for it is
    optional. If an alias is not provided, the columns of the sub-query
    are only accessible if their names are unique, i.e., they do not
    conflict with the columns produced by any other source table in the
    `FROM` clause. Note that `VALUES` is also considered a `SELECT`;
    thus, it can also be used here.

`<with_query_name>`

:   A `WITH` query is referenced by writing its name, just as though the
    query's name were a table name. (In fact, the `WITH` query hides
    any real table of the same name for the purposes of the primary
    query. If necessary, you can refer to a real table of the same name
    by schema-qualifying the table's name.) An alias can be provided in
    the same way as for a table.

`<function_name>`

:   Function calls can appear in the `FROM` clause. (This is especially
    useful for functions that return result sets, but any function can
    be used.) This acts as though the function's output were created as
    a temporary table for the duration of this single `SELECT` command.
    An alias can be provided in the same way as for a table. If an alias
    is written, a column alias list can also be written to provide
    substitute names for one or more attributes of the function's
    composite return type.

`<join_type>`

:   One of `[ INNER ] JOIN`, `LEFT [ OUTER ] JOIN`, `RIGHT [ OUTER ] JOIN`,
    `FULL [ OUTER ] JOIN`, `CROSS JOIN`
:   For the `INNER` and `OUTER` join types, a join condition must be
    specified, namely exactly one of `NATURAL`, `ON join_condition`, or
    `USING (join_column [, ...])`. See below for the meaning. For
    `CROSS JOIN`, none of these clauses can appear.
:   A `JOIN` clause combines two `FROM` items, which for convenience we
    will refer to as "tables", though in reality they can be any type of
    `FROM` item. Use parentheses if necessary to determine the order of
    nesting. In the absence of parentheses, `JOIN`s nest left-to-right.
    In any case `JOIN` binds more tightly than the commas separating
    `FROM`-list items.
:   `CROSS JOIN` and `INNER JOIN` produce a simple Cartesian product,
    the same result as you get from listing the two tables at the top
    level of `FROM`, but restricted by the join condition (if any).
    `CROSS JOIN` is equivalent to `INNER JOIN ON (TRUE)`, that is, no
    rows are removed by qualification. These join types are just a
    notational convenience, since they do nothing you couldn't do with
    plain `FROM` and `WHERE`.
:   `LEFT OUTER JOIN` returns all rows in the qualified Cartesian
    product (i.e., all combined rows that pass its join condition), plus
    one copy of each row in the left-hand table for which there was no
    right-hand row that passed the join condition. This left-hand row is
    extended to the full width of the joined table by inserting null
    values for the right-hand columns. Note that only the `JOIN`
    clause's own condition is considered while deciding which rows have
    matches. Outer conditions are applied afterwards.
:   Conversely, `RIGHT OUTER JOIN` returns all the joined rows, plus one
    row for each unmatched right-hand row (extended with nulls on the
    left). This is just a notational convenience, since you could
    convert it to a `LEFT OUTER JOIN` by switching the left and right
    tables.
:   `FULL OUTER JOIN` returns all the joined rows, plus one row for each
    unmatched left-hand row (extended with nulls on the right), plus one
    row for each unmatched right-hand row (extended with nulls on the
    left).

`ON <join_condition>`

:   `<join_condition>` is an expression resulting in a value of type
    `boolean` (similar to a `WHERE` clause) that specifies which rows in
    a join are considered to match.

`USING ( <join_column> [, ...] )`

:   A clause of the form `USING ( a, b, ... )` is shorthand for
    `ON left_table.a = right_table.a AND left_table.b = right_table.b ...`.
    Also, `USING` implies that only one of each pair of equivalent
    columns will be included in the join output, not both.

`NATURAL`

:   `NATURAL` is shorthand for a `USING` list that mentions all columns
    in the two tables that have matching names. If there are no common
    column names, `NATURAL` is equivalent to `ON TRUE`.

`LATERAL`

:   The `LATERAL` keyword can precede a sub-`SELECT` or a function-call
    `FROM` item. In the SQL standard, `LATERAL` allows a sub-query or
    function call to access the attributes of preceding `FROM` items.
    In Hyper, sub-queries can always access the attributes of preceding
    `FROM` items, even if the `LATERAL` keyword is not specified. As such,
    this keyword has no effect in Hyper and it is kept just for
    compatibiliy reasons.

### `WHERE` Clause {#where}

The optional `WHERE` clause has the general form `WHERE <condition>`
where `<condition>` is any expression that evaluates to a result of type
`boolean`. Any row that does not satisfy this condition will be
eliminated from the output. A row satisfies the condition if it returns
true when the actual row values are substituted for any variable
references.

### `GROUP BY` Clause {#groupby}

The optional `GROUP BY` clause has the general form
`GROUP BY <grouping_element> [, ...]`.

`GROUP BY` will condense into a single row all selected rows that share
the same values for the grouped expressions. An `<expression>` used
inside a `grouping_element` can be an input column name, or the name
or ordinal number of an output column (`SELECT` list item), or an
arbitrary expression formed from input-column values. In case of
ambiguity, a `GROUP BY` name will be interpreted as an input-column
name rather than an output column name.

If any of `GROUPING SETS`, `ROLLUP` or `CUBE` are present as grouping
elements, then the `GROUP BY` clause as a whole defines some number
of independent grouping sets. The effect of this is equivalent to
constructing a `UNION ALL` between subqueries with the individual
grouping sets as their `GROUP BY` clauses. The optional `DISTINCT`
clause removes duplicate sets before processing; it does not
transform the `UNION ALL` into a `UNION DISTINCT`. For further
details on the handling of grouping sets see
[Grouping Sets](#grouping-sets).

Aggregate functions, if any are used, are computed across all rows
making up each group, producing a separate value for each group. (If
there are aggregate functions but no `GROUP BY` clause, the query is
treated as having a single group comprising all the selected rows.)

When `GROUP BY` is present, or any aggregate functions are present, it
is not valid for the `SELECT` list expressions to refer to ungrouped
columns except within aggregate functions, since there would otherwise
be more than one possible value to return for an ungrouped column.

Keep in mind that all aggregate functions are evaluated before
evaluating any "scalar" expressions in the `HAVING` clause or `SELECT`
list. This means that, for example, a `CASE` expression cannot be used
to skip evaluation of an aggregate function.

### `HAVING` Clause {#having}

The optional `HAVING` clause has the general form `HAVING <condition>`
where `<condition>` is the same as specified for the `WHERE` clause.

`HAVING` eliminates group rows that do not satisfy the condition.
`HAVING` is different from `WHERE`: `WHERE` filters individual rows
before the application of `GROUP BY`, while `HAVING` filters group rows
created by `GROUP BY`. Each column referenced in `<condition>` must
unambiguously reference a grouping column, unless the reference appears
within an aggregate function.

The presence of `HAVING` turns a query into a grouped query even if
there is no `GROUP BY` clause. This is the same as what happens when the
query contains aggregate functions but no `GROUP BY` clause. All the
selected rows are considered to form a single group, and the `SELECT`
list and `HAVING` clause can only reference table columns from within
aggregate functions. Such a query will emit a single row if the `HAVING`
condition is true, zero rows if it is not true.

### `WINDOW` Clause {#window}

The optional `WINDOW` clause has the general form

```sql_template
WINDOW <window_name> AS ( <window_definition> ) [, ...]
```

where `<window_name>` is a name that can be referenced from
`OVER` clauses or subsequent window definitions, and
`<window_definition>` is

```sql_template
[ <existing_window_name> ]
[ PARTITION BY <expression> [, ...] ]
[ ORDER BY `<expression>` [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ <frame_clause> ]
```

If an `<existing_window_name>` is specified it must refer to an earlier
entry in the `WINDOW` list; the new window copies its partitioning
clause from that entry, as well as its ordering clause if any. In this
case the new window cannot specify its own `PARTITION BY` clause, and it
can specify `ORDER BY` only if the copied window does not have one. The
new window always uses its own frame clause; the copied window must not
specify a frame clause.

The elements of the `PARTITION BY` list are interpreted in much the same
fashion as elements of a [GROUP BY Clause](#groupby), except that they are
always simple expressions and never the name or number of an output
column. Another difference is that these expressions can contain
aggregate function calls, which are not allowed in a regular `GROUP BY`
clause. They are allowed here because windowing occurs after grouping
and aggregation.

Similarly, the elements of the `ORDER BY` list are interpreted in much
the same fashion as elements of an [PRDER BY Clause](#orderby), except
that the expressions are always taken as simple expressions and never
the name or number of an output column.

The optional `<frame_clause>` defines the window frame for window
functions that depend on the frame (not all do). The window frame is a
set of related rows for each row of the query (called the current row).
The `<frame_clause>` can be one of

```sql_template
{ RANGE | ROWS } <frame_start> [ <frame_exclusion> ]
{ RANGE | ROWS } BETWEEN <frame_start> AND <frame_end> [ <frame_exclusion> ]
```

where `<frame_start>` and
`<frame_end>` can be one of

```sql_template
UNBOUNDED PRECEDING
<offset> PRECEDING
CURRENT ROW
<offset> FOLLOWING
UNBOUNDED FOLLOWING
```

and `<frame_exclusion>` can be one of

```sql_template
EXCLUDE CURRENT ROW
EXCLUDE GROUP
EXCLUDE TIES
EXCLUDE NO OTHERS
```

If `<frame_end>` is omitted it defaults
to `CURRENT ROW`. Restrictions are that `<frame_start>` cannot be
`UNBOUNDED FOLLOWING`, `<frame_end>` cannot be `UNBOUNDED PRECEDING`.

The default framing option is `RANGE UNBOUNDED PRECEDING`, which is the
same as `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`; it sets the
frame to be all rows from the partition start up through the current
row's last peer (a row that the window's `ORDER BY` clause considers
equivalent to the current row; all rows are peers if there is no
`ORDER BY`). In general, `UNBOUNDED PRECEDING` means that the frame
starts with the first row of the partition, and similarly
`UNBOUNDED FOLLOWING` means that the frame ends with the last row of the
partition, regardless of `RANGE` or `ROWS` mode. In `ROWS` mode,
`CURRENT ROW` means that the frame starts or ends with the current row;
but in `RANGE` mode it means that the frame starts or ends with the
current row's first or last peer in the `ORDER BY` ordering. The
`<offset> PRECEDING` and `<offset> FOLLOWING` options vary in
meaning depending on the frame mode. In `ROWS` mode, the `<offset>` is
an integer indicating that the frame starts or ends that many rows
before or after the current row. In `RANGE` mode, use of an `<offset>`
option requires that there be exactly one `ORDER BY` column in the
window definition. Then the frame contains those rows whose ordering
column value is no more than `<offset>` less than (for `PRECEDING`) or
more than (for `FOLLOWING`) the current row's ordering column value. In
these cases the data type of the `<offset>` expression depends on the
data type of the ordering column. For numeric ordering columns it is
typically of the same type as the ordering column, but for datetime
ordering columns it is an `interval`. In all these cases, the value of
the `<offset>` must be non-null and non-negative. Also, while the
`<offset>` does not have to be a simple constant, it cannot contain
variables, aggregate functions, or window functions.

The `<frame_exclusion>` option allows rows around the current row to be
excluded from the frame, even if they would be included according to the
frame start and frame end options. `EXCLUDE CURRENT ROW` excludes the
current row from the frame. `EXCLUDE GROUP` excludes the current row and
its ordering peers from the frame. `EXCLUDE TIES` excludes any peers of
the current row from the frame, but not the current row itself.
`EXCLUDE NO OTHERS` simply specifies explicitly the default behavior of
not excluding the current row or its peers.

Beware that the `ROWS` mode can produce unpredictable results if the
`ORDER BY` ordering does not order the rows uniquely. The `RANGE` mode
is designed to ensure that rows that are peers in the `ORDER BY`
ordering are treated alike: all rows of a given peer group will be in
the frame or excluded from it.

The purpose of a `WINDOW` clause is to specify the behavior of window
functions appearing in the query's [ List](#select-list) or [
Clause](#orderby). These functions can reference the `WINDOW` clause
entries by name in their `OVER` clauses. A `WINDOW` clause entry does
not have to be referenced anywhere, however; if it is not used in the
query it is simply ignored. It is possible to use window functions
without any `WINDOW` clause at all, since a window function call can
specify its window definition directly in its `OVER` clause. However,
the `WINDOW` clause saves typing when the same window definition is
needed for more than one window function.

Window functions are described in detail in
[Window Functions and Queries](/docs/sql/window).

### `SELECT` List {#select-list}

The `SELECT` list (between the key words `SELECT` and `FROM`) specifies
expressions that form the output rows of the `SELECT` statement. The
expressions can (and usually do) refer to columns computed in the `FROM`
clause.

Just as in a table, every output column of a `SELECT` has a name. In a
simple `SELECT` this name is just used to label the column for display,
but when the `SELECT` is a sub-query of a larger query, the name is seen
by the larger query as the column name of the result set produced by the
sub-query. To specify the name to use for an output column, write
`AS <output_name>` after the column's expression. (You can omit `AS`, but
only if the desired output name does not match any Hyper keyword). For
protection against possible future keyword additions, it is recommended
that you always either write `AS` or double-quote the output name.) If
you do not specify a column name, a name is chosen automatically by
Hyper. If the column's expression is a simple column reference then the
chosen name is the same as that column's name. In more complex cases a
function or type name may be used, or the system may fall back to a
number that specifies the order of that column in the result set,
starting from 1.

An output column's name can be used to refer to the column's value in
`ORDER BY` and `GROUP BY` clauses, but not in the `WHERE` or `HAVING`
clauses; there you must write out the expression instead.

Instead of an expression, `*` can be written in the output list as a
shorthand for all the columns of the selected rows. Also, you can write
`table_name.*` as a shorthand for the columns coming from just that
table. In these cases it is not possible to specify new names with `AS`;
the output column names will be the same as the table columns' names.

According to the SQL standard, the expressions in the output list should
be computed before applying `DISTINCT`, `ORDER BY`, or `LIMIT`. This is
obviously necessary when using `DISTINCT`, since otherwise it's not
clear what values are being made distinct. However, in many cases it is
convenient if output expressions are computed after `ORDER BY` and
`LIMIT`; particularly if the output list contains anyexpensive functions.
With that behavior, the order of function evaluations is more intuitive
and there will not be evaluations corresponding to rows that never appear
in the output. Hyper will effectively evaluate output expressions after
sorting and limiting, so long as those expressions are not referenced
in `DISTINCT`, `ORDER BY` or `GROUP BY`. (As a counterexample,
`SELECT f(x) FROM tab ORDER BY 1` clearly must evaluate `f(x)` before
sorting.) Output expressions that contain set-returning functions are
effectively evaluated after sorting and before limiting, so that `LIMIT`
will act to cut off the output from a set-returning function.

### `DISTINCT` Clause {#distinct}

If `SELECT DISTINCT` is specified, all duplicate rows are removed from
the result set (one row is kept from each group of duplicates).
`SELECT ALL` specifies the opposite: all rows are kept; that is the
default.

`SELECT DISTINCT ON ( expression [, ...] )` keeps only the first row of
each set of rows where the given expressions evaluate to equal. The
`DISTINCT ON` expressions are interpreted using the same rules as for
`ORDER BY` (see above). Note that the "first row" of each set is
unpredictable unless `ORDER BY` is used to ensure that the desired row
appears first. For example:

```
SELECT DISTINCT ON (location) location, time, report
    FROM weather_reports
    ORDER BY location, time DESC;
```

retrieves the most recent weather report for each location. But if we
had not used `ORDER BY` to force descending order of time values for
each location, we'd have gotten a report from an unpredictable time for
each location.

The `DISTINCT ON` expression(s) must match the leftmost `ORDER BY`
expression(s). The `ORDER BY` clause will normally contain additional
expression(s) that determine the desired precedence of rows within each
`DISTINCT ON` group.

### `UNION` Clause {#union}

The `UNION` clause has the general form

```sql_template
<select_statement>
UNION [ ALL | DISTINCT ]
<select_statement>
```

`<select_statement>` is any `SELECT` statement without an `ORDER BY`
or `LIMIT` clause. (`ORDER BY` and `LIMIT` can be attached to a
subexpression if it is enclosed in parentheses. Without parentheses,
these clauses will be taken to apply to the result of the `UNION`,
not to its right-hand input expression.)

The `UNION` operator computes the set union of the rows returned by the
involved `SELECT` statements. A row is in the set union of two result
sets if it appears in at least one of the result sets. The two `SELECT`
statements that represent the direct operands of the `UNION` must
produce the same number of columns, and corresponding columns must be of
compatible data types.

The result of `UNION` does not contain any duplicate rows unless the
`ALL` option is specified. `ALL` prevents elimination of duplicates.
(Therefore, `UNION ALL` is usually significantly quicker than `UNION`;
use `UNION ALL` when you can.)
`DISTINCT` can be written to explicitly specify the default behavior
of eliminating duplicate rows.

Multiple `UNION` operators in the same `SELECT` statement are evaluated
left to right, unless otherwise indicated by parentheses.

### `INTERSECT` Clause {#intersect}

The `INTERSECT` clause has the general form

```sql_template
<select_statement>
INTERSECT [ ALL | DISTINCT ] 
<select_statement>
```

`<select_statement>` is any `SELECT` statement without an `ORDER BY` or
`LIMIT` clause.

The `INTERSECT` operator computes the set intersection of the rows
returned by the involved `SELECT` statements. A row is in the
intersection of two result sets if it appears in both result sets.

The result of `INTERSECT` does not contain any duplicate rows unless the
`ALL` option is specified. With `ALL`, a row that has `m` duplicates
in the left table and `n` duplicates in the right table will appear
`min(m, n)` times in the result set. `DISTINCT` can be written to
explicitly specify the default behavior of eliminating duplicate rows.

Multiple `INTERSECT` operators in the same `SELECT` statement are
evaluated left to right, unless parentheses dictate otherwise.
`INTERSECT` binds more tightly than `UNION`. That is,
`A UNION B INTERSECT C` will be read as `A UNION (B INTERSECT C)`.

### `EXCEPT` Clause {#except}

The `EXCEPT` clause has the general form

```sql_template
<select_statement>
EXCEPT [ ALL | DISTINCT ]
<select_statement>
```

`<select_statement>` is any `SELECT` statement without an `ORDER BY`
or `LIMIT` clause.

The `EXCEPT` operator computes the set of rows that are in the result of
the left `SELECT` statement but not in the result of the right one.

The result of `EXCEPT` does not contain any duplicate rows unless the
`ALL` option is specified. With `ALL`, a row that has `m` duplicates
in the left table and `n` duplicates in the right table will appear
`max(m - n, 0)` times in the result set. `DISTINCT` can be written to
explicitly specify the default behavior of eliminating duplicate rows.

Multiple `EXCEPT` operators in the same `SELECT` statement are evaluated
left to right, unless parentheses dictate otherwise. `EXCEPT` binds at
the same level as `UNION`.

### `ORDER BY` Clause {#orderby}

The optional `ORDER BY` clause has the general form:

```sql_template
ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...]
```

The `ORDER BY` clause causes the result rows to be sorted
according to the specified expression(s). If two rows are equal
according to the leftmost expression, they are compared according to the
next expression and so on. If they are equal according to all specified
expressions, they are returned in an implementation-dependent order.

Each `<expression>` can be the name or ordinal number of an output
column (`SELECT` list item), or it can be an arbitrary expression formed
from input-column values.

The ordinal number refers to the ordinal (left-to-right) position of the
output column. This feature makes it possible to define an ordering on
the basis of a column that does not have a unique name. This is never
absolutely necessary because it is always possible to assign a name to
an output column using the `AS` clause.

It is also possible to use arbitrary expressions in the `ORDER BY`
clause, including columns that do not appear in the `SELECT` output
list. Thus the following statement is valid:

```sql_template
SELECT name FROM distributors ORDER BY code;
```

A limitation of this feature is that an `ORDER BY` clause applying to
the result of a `UNION`, `INTERSECT`, or `EXCEPT` clause can only
specify an output column name or number, not an expression.

If an `ORDER BY` expression is a simple name that matches both an output
column name and an input column name, `ORDER BY` will interpret it as
the output column name. This is the opposite of the choice that
`GROUP BY` will make in the same situation. This inconsistency is made
to be compatible with the SQL standard.

Optionally one can add the key word `ASC` (ascending) or `DESC`
(descending) after any expression in the `ORDER BY` clause. If not
specified, `ASC` is assumed by default.

If `NULLS LAST` is specified, null values sort after all non-null
values; if `NULLS FIRST` is specified, null values sort before all
non-null values. If neither is specified, the default behavior is
`NULLS LAST` when `ASC` is specified or implied, and `NULLS FIRST` when
`DESC` is specified (thus, the default is to act as though nulls are
larger than non-nulls).

Note that ordering options apply only to the expression they follow; for
example `ORDER BY x, y DESC` does not mean the same thing as
`ORDER BY x DESC, y DESC`.

Character-string data is sorted according to the collation that applies
to the column being sorted. That can be overridden at need by including
a `COLLATE` clause in the `<expression>`, for example
`ORDER BY mycolumn COLLATE "en_US"`.

### `LIMIT` and `OFFSET` Clause {#limit}

The `LIMIT` clause consists of two independent sub-clauses:
`LIMIT { <count> | ALL } OFFSET <start>`. `<count>` specifies the maximum
number of rows to return, while `<start>` specifies the number of rows
to skip before starting to return rows. When both are specified,
`<start>` rows are skipped before starting to count the `<count>` rows
to be returned.

If the `<count>` expression evaluates to NULL, it is treated as
`LIMIT ALL`, i.e., no limit. If `<start>` evaluates to NULL, it is
treated the same as `OFFSET 0`.

SQL:2008 introduced a different syntax to achieve the same result, which
Hyper also supports. It is:

```sql_template
OFFSET <start> { ROW \| ROWS }
FETCH { FIRST | NEXT } [ <count> ] { ROW | ROWS } ONLY
```

In this syntax, the `<start>` or `<count>` value is required by the
standard to be a literal constant, a parameter, or a variable name.
If `<count>` is omitted in a `FETCH` clause, it defaults to 1.
`ROW` and `ROWS` as well as `FIRST` and `NEXT` are noise words that don't
influence the effects of these clauses. According to the standard, the
`OFFSET` clause must come before the `FETCH` clause if both are present;
but Hyper is laxer and allows either order.

When using `LIMIT`, it is a good idea to use an `ORDER BY` clause that
constrains the result rows into a unique order. Otherwise you will get
an unpredictable subset of the query's rows — you might be asking for
the tenth through twentieth rows, but tenth through twentieth in what
ordering? You don't know what ordering unless you specify `ORDER BY`.

The query planner takes `LIMIT` into account when generating a query
plan, so you are very likely to get different plans (yielding different
row orders) depending on what you use for `LIMIT` and `OFFSET`. Thus,
using different `LIMIT`/`OFFSET` values to select different subsets of a
query result *will give inconsistent results* unless you enforce a
predictable result ordering with `ORDER BY`. This is not a bug; it is an
inherent consequence of the fact that SQL does not promise to deliver
the results of a query in any particular order unless `ORDER BY` is used
to constrain the order.

It is even possible for repeated executions of the same `LIMIT` query to
return different subsets of the rows of a table, if there is not an
`ORDER BY` to enforce selection of a deterministic subset. Again, this
is not a bug; determinism of the results is simply not guaranteed in
such a case.

## `GROUPING SETS`, `CUBE`, and `ROLLUP` {#grouping-sets}

More complex grouping operations than those described above are possible
using the concept of grouping sets. The data selected by the `FROM` and
`WHERE` clauses is grouped separately by each specified grouping set,
aggregates are computed for each group just as for simple `GROUP BY`
clauses, and then the results are returned.

Each sublist of `GROUPING SETS` may specify zero or more columns or
expressions and is interpreted the same way as though it were directly
in the `GROUP BY` clause. An empty grouping set means that all rows are
aggregated down to a single group (which is output even if no input rows
were present), as described above for the case of aggregate functions
with no `GROUP BY` clause.

References to the grouping columns or expressions are replaced by null
values in result rows for grouping sets in which those columns do not
appear. To distinguish which grouping a particular output row resulted
from, use the [GROUPING function](/docs/sql/aggregate.md#grouping).

A shorthand notation is provided for specifying two common types of
grouping set. A clause of the form

    ROLLUP ( e1, e2, e3, ... )

represents the given list of expressions and all prefixes of the list
including the empty list; thus it is equivalent to

    GROUPING SETS (
        ( e1, e2, e3, ... ),
        ...
        ( e1, e2 ),
        ( e1 ),
        ( )
    )

This is commonly used for analysis over hierarchical data; e.g., total
salary by department, division, and company-wide total.

A clause of the form

    CUBE ( e1, e2, ... )

represents the given list and all of its possible subsets (i.e., the
power set). Thus

    CUBE ( a, b, c )

is equivalent to

    GROUPING SETS (
        ( a, b, c ),
        ( a, b    ),
        ( a,    c ),
        ( a       ),
        (    b, c ),
        (    b    ),
        (       c ),
        (         )
    )

`CUBE` is limited to at most 12 expressions.

The individual elements of a `CUBE` or `ROLLUP` clause may be either
individual expressions, or sublists of elements in parentheses. In the
latter case, the sublists are treated as single units for the purposes
of generating the individual grouping sets. For example:

    CUBE ( (a, b), (c, d) )

is equivalent to

    GROUPING SETS (
        ( a, b, c, d ),
        ( a, b       ),
        (       c, d ),
        (            )
    )

and

    ROLLUP ( a, (b, c), d )

is equivalent to

    GROUPING SETS (
        ( a, b, c, d ),
        ( a, b, c    ),
        ( a          ),
        (            )
    )

The `CUBE` and `ROLLUP` constructs can be used either directly in the
`GROUP BY` clause, or nested inside a `GROUPING SETS` clause. If one
`GROUPING SETS` clause is nested inside another, the effect is the same
as if all the elements of the inner clause had been written directly in
the outer clause.

If multiple grouping items are specified in a single `GROUP BY` clause,
then the final list of grouping sets is the cross product of the
individual items. For example:

    GROUP BY a, CUBE (b, c), GROUPING SETS ((d), (e))

is equivalent to

    GROUP BY GROUPING SETS (
        (a, b, c, d), (a, b, c, e),
        (a, b, d),    (a, b, e),
        (a, c, d),    (a, c, e),
        (a, d),       (a, e)
    )

When specifying multiple grouping items together, the final set of
grouping sets might contain duplicates. For example:

    GROUP BY ROLLUP (a, b), ROLLUP (a, c)

is equivalent to

    GROUP BY GROUPING SETS (
        (a, b, c),
        (a, b),
        (a, b),
        (a, c),
        (a),
        (a),
        (a, c),
        (a),
        ()
    )

If these duplicates are undesirable, they can be removed using the
`DISTINCT` clause directly on the `GROUP BY`. Therefore:

    GROUP BY DISTINCT ROLLUP (a, b), ROLLUP (a, c)

is equivalent to

    GROUP BY GROUPING SETS (
        (a, b, c),
        (a, b),
        (a, c),
        (a),
        ()
    )

This is not the same as using `SELECT DISTINCT` because the output rows
may still contain duplicates. If any of the ungrouped columns contains
NULL, it will be indistinguishable from the NULL used when that same
column is grouped.

## Examples

To join the table `films` with the table `distributors`:

    SELECT f.title, f.did, d.name, f.date_prod, f.kind
        FROM distributors d, films f
        WHERE f.did = d.did

           title       | did |     name     | date_prod  |   kind
    -------------------+-----+--------------+------------+----------
     The Third Man     | 101 | British Lion | 1949-12-23 | Drama
     The African Queen | 101 | British Lion | 1951-08-11 | Romantic
     ...

To sum the column `len` of all films and group the results by `kind`:

    SELECT kind, sum(len) AS total FROM films GROUP BY kind;

       kind   | total
    ----------+-------
     Action   | 07:34
     Comedy   | 02:58
     Drama    | 14:28
     Musical  | 06:42
     Romantic | 04:38

To sum the column `len` of all films, group the results by `kind` and
show those group totals that are less than 5 hours:

    SELECT kind, sum(len) AS total
        FROM films
        GROUP BY kind
        HAVING sum(len) < interval '5 hours';

       kind   | total
    ----------+-------
     Comedy   | 02:58
     Romantic | 04:38

The following two examples are identical ways of sorting the individual
results according to the contents of the second column (`name`):

    SELECT * FROM distributors ORDER BY name;
    SELECT * FROM distributors ORDER BY 2;

     did |       name
    -----+------------------
     109 | 20th Century Fox
     110 | Bavaria Atelier
     101 | British Lion
     107 | Columbia
     102 | Jean Luc Godard
     113 | Luso films
     104 | Mosfilm
     103 | Paramount
     106 | Toho
     105 | United Artists
     111 | Walt Disney
     112 | Warner Bros.
     108 | Westward

The next example shows how to obtain the union of the tables
`distributors` and `actors`, restricting the results to those that begin
with the letter W in each table. Only distinct rows are wanted, so the
key word `ALL` is omitted.

    distributors:               actors:
     did |     name              id |     name
    -----+--------------        ----+----------------
     108 | Westward               1 | Woody Allen
     111 | Walt Disney            2 | Warren Beatty
     112 | Warner Bros.           3 | Walter Matthau
     ...                         ...

    SELECT distributors.name
        FROM distributors
        WHERE distributors.name LIKE 'W%'
    UNION
    SELECT actors.name
        FROM actors
        WHERE actors.name LIKE 'W%';

          name
    ----------------
     Walt Disney
     Walter Matthau
     Warner Bros.
     Warren Beatty
     Westward
     Woody Allen

The following example shows how to use a function in the `FROM` clause.
Currently, Hyper does not support user-defined table functions, but some
built-in table functions such as `generate_series` are supported.

    SELECT * FROM GENERATE_SERIES(1,5);
    ---
     1
     2
     3
     4
     5

This example shows how to use a simple `WITH` clause:

    WITH t AS (
        SELECT random() as x FROM generate_series(1, 3)
    )
    SELECT * FROM t
    UNION ALL
    SELECT * FROM t

             x
    --------------------
      0.534150459803641
      0.520092216785997
     0.0735620250925422
      0.534150459803641
      0.520092216785997
     0.0735620250925422

Notice that the `WITH` query was evaluated only once, so that we got two
sets of the same three random values.

This example uses `WITH RECURSIVE` to find all subordinates (direct or
indirect) of the employee Mary, and their level of indirectness, from a
table that shows only direct subordinates:

    WITH RECURSIVE employee_recursive(distance, employee_name, manager_name) AS (
        SELECT 1, employee_name, manager_name
        FROM employee
        WHERE manager_name = 'Mary'
      UNION ALL
        SELECT er.distance + 1, e.employee_name, e.manager_name
        FROM employee_recursive er, employee e
        WHERE er.employee_name = e.manager_name
      )
    SELECT distance, employee_name FROM employee_recursive;

Notice the typical form of recursive queries: an initial condition,
followed by `UNION`, followed by the recursive part of the query. Be
sure that the recursive part of the query will eventually return no
tuples, or else the query will loop indefinitely.

This example shows the use of `TABLESAMPLE` when querying a table with a
sequence of 100 integers. It uses the sampling method `SYSTEM` to
retrieve 10% of the table's rows, but bounded to a maximum of 6 rows.
Since the table has 100 rows and the percentage alone would yield 10
rows, the result is truncated to 6 rows. Using the `REPEATABLE` clause
with the same argument guarantees that the same sample will be returned
every time the command is executed, provided that the table is not
modified in-between.

    CREATE TABLE Numbers AS SELECT * FROM GENERATE_SERIES(0,99);

    SELECT *
    FROM Numbers
      TABLESAMPLE SYSTEM(10 PERCENT BETWEEN UNBOUNDED ROWS AND 6 ROWS) REPEATABLE(42);
    ----
    25
    32
    65
    45
    20
    41

This example shows the use of `GROUPING SETS` to group by multiple sets
of columns within a singly query (see
[Grouping Sets](#grouping-sets)).

    SELECT * FROM items_sold;

     brand | size | sales
    -------+------+-------
     Foo   | L    |  10
     Foo   | M    |  20
     Bar   | M    |  15
     Bar   | L    |  5

    SELECT brand, size, sum(sales) FROM items_sold GROUP BY GROUPING SETS ((brand), (size), ());

     brand | size | sum
    -------+------+-----
     Foo   |      |  30
     Bar   |      |  20
           | L    |  15
           | M    |  35
           |      |  50

## Compatibility

Of course, the `SELECT` statement is compatible with the SQL standard.
But there are some extensions and some missing features.

### Omitted `FROM` Clauses

Hyper allows one to omit the `FROM` clause. It has a straightforward use
to compute the results of simple expressions:

    SELECT 2+2;

     1
    ---
     4

Some other SQL databases cannot do this except by introducing a dummy
one-row table from which to do the `SELECT`.

Note that if a `FROM` clause is not specified, the query cannot
reference any database tables. For example, the following query is
invalid:

    SELECT distributors.* WHERE distributors.name = 'Westward';

### Empty `SELECT` Lists

The list of output expressions after `SELECT` can be empty, producing a
zero-column result table. This is not valid syntax according to the SQL
standard. Hyper allows it to be consistent with allowing zero-column
tables. However, an empty list is not allowed when `DISTINCT` is used.

### Omitting the `AS` Key Word

In the SQL standard, the optional key word `AS` can be omitted before an
output column name whenever the new column name is a valid column name
(that is, not the same as any reserved keyword). Hyper is slightly more
restrictive: `AS` is required if the new column name matches any keyword
at all, reserved or not. Recommended practice is to use `AS` or
double-quote output column names, to prevent any possible conflict
against future keyword additions.

In `FROM` items, both the standard and Hyper allow `AS` to be omitted
before an alias that is an unreserved keyword. But this is impractical
for output column names, because of syntactic ambiguities.

### `TABLESAMPLE` Clause Restrictions

The `TABLESAMPLE` clause is currently accepted only on regular tables.
According to the SQL standard it should be possible to apply it to any
`FROM` item.

### Function Calls in `FROM`

Hyper allows a function call to be written directly as a member of the
`FROM` list. In the SQL standard it would be necessary to wrap such a
function call in a sub-`SELECT`; that is, the syntax
`FROM func(...) alias` is approximately equivalent to
`FROM (SELECT func(...)) alias`.

### Namespace Available to `GROUP BY` and `ORDER BY`

In the SQL-92 standard, an `ORDER BY` clause can only use output column
names or numbers, while a `GROUP BY` clause can only use expressions
based on input column names. Hyper extends each of these clauses to
allow the other choice as well (but it uses the standard's
interpretation if there is ambiguity). Hyper also allows both clauses to
specify arbitrary expressions. Note that names appearing in an
expression will always be taken as input-column names, not as
output-column names.

SQL:1999 and later use a slightly different definition which is not
entirely upward compatible with SQL-92. In most cases, however, Hyper
will interpret an `ORDER BY` or `GROUP BY` expression the same way
SQL:1999 does.

### `LIMIT` and `OFFSET`

The clauses `LIMIT` and `OFFSET` are Hyper-specific syntax, also used by
PostgreSQL. The SQL:2008 standard has introduced the clauses
`OFFSET ... FETCH {FIRST|NEXT} ...` for the same functionality, as shown
above in the [LIMIT Clause](#limit).

### `DISTINCT ON`

`DISTINCT ON ( ... )` is an extension of the SQL standard.
