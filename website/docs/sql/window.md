# Window Functions and Queries

Window functions provide the ability to perform calculations across sets
of rows that are related to the current query row. This documentation
page provides a brief introduction to window queries as well as a
reference for the window functions supported in Hyper and the syntax
used to call them.

## Introduction to Window Queries {#tutorial-window}

A window function performs a calculation across a set of table rows that
are somehow related to the current row. This is comparable to the type
of calculation that can be done with an aggregate function. However,
window functions do not cause rows to become grouped into a single
output row like non-window aggregate calls would. Instead, the rows
retain their separate identities. Behind the scenes, the window function
is able to access more than just the current row of the query result.

Here is an example that shows how to compare each employee's salary
with the average salary in his or her department:

    SELECT depname, empno, salary, avg(salary) OVER (PARTITION BY depname) FROM empsalary;

    depname   | empno | salary |          avg
    ----------+-------+--------+-----------------------
    develop   |    11 |   5200 | 5020.0000000000000000
    develop   |     7 |   4200 | 5020.0000000000000000
    develop   |     9 |   4500 | 5020.0000000000000000
    develop   |     8 |   6000 | 5020.0000000000000000
    develop   |    10 |   5200 | 5020.0000000000000000
    personnel |     5 |   3500 | 3700.0000000000000000
    personnel |     2 |   3900 | 3700.0000000000000000
    sales     |     3 |   4800 | 4866.6666666666666667
    sales     |     1 |   5000 | 4866.6666666666666667
    sales     |     4 |   4800 | 4866.6666666666666667
    (10 rows)

The first three output columns come directly from the table empsalary,
and there is one output row for each row in the table. The fourth column
represents an average taken across all the table rows that have the same
depname value as the current row. (This actually is the same function as
the non-window `avg` aggregate, but the `OVER` clause causes it to be
treated as a window function and computed across the window frame.)

A window function call always contains an `OVER` clause directly
following the window function's name and argument(s). This is what
syntactically distinguishes it from a normal function or non-window
aggregate. The `OVER` clause determines exactly how the rows of the
query are split up for processing by the window function. The
`PARTITION BY` clause within `OVER` divides the rows into groups that
share the same values of the `PARTITION BY` expression(s). For each row,
the window function is computed across the rows that fall into the same
partition as the current row.

You can also control the order in which rows are processed by window
functions using `ORDER BY` within `OVER`. Here is an example:

    SELECT depname, empno, salary, rank() OVER (PARTITION BY depname ORDER BY salary DESC)
    FROM empsalary;

    depname   | empno | salary | rank
    ----------+-------+--------+-----
    develop   |     8 |   6000 |    1
    develop   |    10 |   5200 |    2
    develop   |    11 |   5200 |    2
    develop   |     9 |   4500 |    4
    develop   |     7 |   4200 |    5
    personnel |     2 |   3900 |    1
    personnel |     5 |   3500 |    2
    sales     |     1 |   5000 |    1
    sales     |     4 |   4800 |    2
    sales     |     3 |   4800 |    2
    (10 rows)

As shown here, the `rank` function produces a numerical rank for each
distinct `ORDER BY` value in the current row's partition, using the
order defined by the `ORDER BY` clause. `rank` needs no explicit
parameter, because its behavior is entirely determined by the `OVER`
clause.

Note that the window `ORDER BY` can be specified independently of the
order in which the rows are output, i.e., independently of the top-level
query `ORDER BY`.

The rows considered by a window function are those of the "virtual
table" produced by the query's `FROM` clause as filtered by its
`WHERE`, `GROUP BY`, and `HAVING` clauses if any. For example, a row
removed because it does not meet the `WHERE` condition is not seen by
any window function. A query can contain multiple window functions that
slice up the data in different ways using different `OVER` clauses, but
they all act on the same collection of rows defined by this virtual
table.

We already saw that `ORDER BY` can be omitted if the ordering of rows is
not important. It is also possible to omit `PARTITION BY`, in which case
there is a single partition containing all rows.

There is another important concept associated with window functions: for
each row, there is a set of rows within its partition called its window
frame. Some window functions act only on the rows of the window frame,
rather than of the whole partition. By default, if `ORDER BY` is
supplied then the frame consists of all rows from the start of the
partition up through the current row, plus any following rows that are
equal to the current row according to the `ORDER BY` clause. When
`ORDER BY` is omitted the default frame consists of all rows in the
partition. Here is an example using `sum`:

    SELECT salary, sum(salary) OVER () FROM empsalary;

    salary |  sum
    -------+-------
      5200 | 47100
      5000 | 47100
      3500 | 47100
      4800 | 47100
      3900 | 47100
      4200 | 47100
      4500 | 47100
      4800 | 47100
      6000 | 47100
      5200 | 47100
    (10 rows)

Above, since there is no `ORDER BY` in the `OVER` clause, the window
frame is the same as the partition, which for lack of `PARTITION BY` is
the whole table; in other words each sum is taken over the whole table
and so we get the same result for each output row. But if we add an
`ORDER BY` clause, we get very different results:

    SELECT salary, sum(salary) OVER (ORDER BY salary) FROM empsalary;

    salary |  sum
    -------+-------
      3500 |  3500
      3900 |  7400
      4200 | 11600
      4500 | 16100
      4800 | 25700
      4800 | 25700
      5000 | 30700
      5200 | 41100
      5200 | 41100
      6000 | 47100
    (10 rows)

Here the sum is taken from the first (lowest) salary up through the
current one, including any duplicates of the current one (notice the
results for the duplicated salaries).

Window functions are permitted only in the `SELECT` list and the
`ORDER BY` clause of the query. They are forbidden elsewhere, such as in
`GROUP BY`, `HAVING` and `WHERE` clauses. This is because they logically
execute after the processing of those clauses. Also, window functions
execute after non-window aggregate functions. This means it is valid to
include an aggregate function call in the arguments of a window
function, but not vice versa.

If there is a need to filter or group rows after the window calculations
are performed, you can use a sub-select. For example:

    SELECT depname, empno, salary, enroll_date
    FROM
       (SELECT depname, empno, salary, enroll_date,
       rank() OVER (PARTITION BY depname ORDER BY salary DESC, empno) AS pos
       FROM empsalary
       ) AS ss
    WHERE pos < 3;

The above query only shows the rows from the inner query having `rank`
less than 3.

When a query involves multiple window functions, it is possible to write
out each one with a separate `OVER` clause, but this is duplicative and
error-prone if the same windowing behavior is wanted for several
functions. Instead, each windowing behavior can be named in a `WINDOW`
clause and then referenced in `OVER`. For example:

    SELECT sum(salary) OVER w, avg(salary) OVER w
    FROM empsalary
    WINDOW w AS (PARTITION BY depname ORDER BY salary DESC);

More details about `WINDOW` clauses in queries can be found in the
[SELECT](command/select#window) reference page.

## Window Functions Reference {#window-detail}

A window function call represents the application of an aggregate-like
function over some portion of the rows selected by a query. Unlike
non-window aggregate calls, this is not tied to grouping of the selected
rows into a single output row — each row remains separate in the query
output. However, the window function has access to all the rows that
would be part of the current row's group according to the grouping
specification (`PARTITION BY` list) of the window function call.

The built-in window functions are listed in the next table.
Note that these functions *must* be invoked using window function
syntax, i.e., an `OVER` clause is required.

Function |Return Type |Description
----|----|----
`row_number()` |`bigint` |number of the current row within its partition, counting from 1
`rank()` |`bigint` |rank of the current row with gaps; same as `row_number` of its first peer
`modified_rank()` |`bigint` |rank of the current row with gaps, but taking the lowest rank in case of ties; same as `row_number` of its last peer
`dense_rank()` |`bigint` |rank of the current row without gaps; this function counts peer groups
`percent_rank()` |`double precision` |relative rank of the current row: (`rank` - 1) / (total partition rows - 1)
`cume_dist()` |`double precision` |cumulative distribution: (number of partition rows preceding or peer with current row) / total partition rows
`ntile(num_buckets integer)` |`integer` |integer ranging from 1 to the argument value, dividing the partition as equally as possible
`lag(value anyelement [, offset integer [, default anyelement ]])` |`same type as value` |returns `<value>` evaluated at the row that is `<offset>` rows before the current row within the partition; if there is no such row, instead return `<default>` (which must be of the same type as `<value>`). Both `<offset>` and `<default>` are evaluated with respect to the current row. If omitted, `<offset>` defaults to 1 and `<default>` to null
`lead(value anyelement [, offset integer [, default anyelement ]])` |`same type as value` |returns `<value>` evaluated at the row that is `<offset>` rows after the current row within the partition; if there is no such row, instead return `<default>` (which must be of the same type as `<value>`). Both `<offset>` and `<default>` are evaluated with respect to the current row. If omitted, `<offset>` defaults to 1 and `<default>` to null
`first_value(value any)` |`same type as value` |returns `<value>` evaluated at the row that is the first row of the window frame
`last_value(value any)` |`same type as value` |returns `<value>` evaluated at the row that is the last row of the window frame
`nth_value(value any, nth integer)` |`same type as value` |returns `<value>` evaluated at the row that is the `<nth>` row of the window frame (counting from either the first or the last row in the frame, depending on the `FROM` option); null if no such row

In addition to these functions, most aggregate functions can be used as
a window function as well; see [Aggregate Functions](aggregate) for a list of
the built-in aggregates. Aggregate functions act as window functions
only when an `OVER` clause follows the call; otherwise they act as
non-window aggregates and return a single row for the entire set.

All of the functions listed above depend on the sort ordering specified
by the `ORDER BY` clause of the associated window definition. Rows that
are not distinct when considering only the `ORDER BY` columns are said
to be peers. The four ranking functions (including `cume_dist`) are
defined so that they give the same answer for all peer rows.

The `modified_rank` function differs from `rank` in that it assigns the
lowest (instead of highest) rank among all entries in case of a tie.
This difference is illustrated in the example below.

    SELECT depname, empno, salary,
       rank() OVER (PARTITION BY depname ORDER BY salary DESC),
       modified_rank() OVER (PARTITION BY depname ORDER BY salary DESC)
    FROM empsalary;

    depname   | empno | salary | rank | modified_rank
    ----------+-------+--------+------+--------------
    develop   |     8 |   6000 |    1 |             1
    develop   |    10 |   5200 |    2 |             3
    develop   |    11 |   5200 |    2 |             3
    develop   |     9 |   4500 |    4 |             4
    develop   |     7 |   4200 |    5 |             5
    personnel |     2 |   3900 |    1 |             1
    personnel |     5 |   3500 |    2 |             2
    sales     |     1 |   5000 |    1 |             1
    sales     |     4 |   4800 |    2 |             3
    sales     |     3 |   4800 |    2 |             3
    (10 rows)

`modified_rank` is a Hyper extension that is not specified in the SQL
standard.

Note that `first_value`, `last_value`, and `nth_value` consider only the
rows within the "window frame", which by default contains the rows from
the start of the partition through the last peer of the current row.
This is likely to give unhelpful results for `last_value` and sometimes
also `nth_value`. You can redefine the frame by adding a suitable frame
specification (`RANGE`, `ROWS`) to the `OVER` clause. See
[Window Function Call Syntax](#syntax-window-functions) for more
information about frame specifications.

When an aggregate function is used as a window function, it aggregates
over the rows within the current row's window frame. An aggregate used
with `ORDER BY` and the default window frame definition produces a
"running sum" type of behavior, which may or may not be what's wanted.
To obtain aggregation over the whole partition, omit `ORDER BY` or use
`ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Other frame
specifications can be used to obtain other effects.

`cume_dist` computes the fraction of partition rows that are less than
or equal to the current row and its peers, while `percent_rank` computes
the fraction of partition rows that are less than the current row,
assuming the current row does not exist in the partition.

## Window Function Call Syntax {#syntax-window-functions}

The syntax of a window function call is one of the following:

```sql_template
<function_name>([ <expression> [, ...] ])
    [ FROM { FIRST | LAST } ]
    [ { RESPECT | IGNORE } NULLS ]
    OVER { ( <window_name> ) | <window_definition> }
<function_name>(*)
    [ { RESPECT | IGNORE } NULLS ]
    OVER { ( <window_name> ) | <window_definition> }
```

where `<window_definition>` has the syntax

```sql_template
[ <window_name> ]
[ PARTITION BY <expression> [, ...] ]
[ ORDER BY <expression> [ ASC | DESC | USING <operator> ] [ NULLS { FIRST | LAST } ] [, ...] ]
[ <frame_clause> ]
```

The optional `<frame_clause>` can be one of

```sql_template
{ RANGE | ROWS } <frame_start> [ <frame_exclusion> ]
{ RANGE | ROWS } BETWEEN <frame_start> AND <frame_end> [ <frame_exclusion> ]
```

where `<frame_start>` and `<frame_end>` can be one of

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

Here, `<expression>` represents any value expression that does not
itself contain window function calls.

`<window_name>` is a reference to a named window specification defined
in the query's `WINDOW` clause. Alternatively, a full
`<window_definition>` can be given within parentheses, using the same
syntax as for defining a named window in the `WINDOW` clause; see the
[SELECT](command/select#window) reference page for details. It's worth pointing out
that `OVER wname` is not exactly equivalent to `OVER (wname ...)`; the
latter implies copying and modifying the window definition, and will be
rejected if the referenced window specification includes a frame clause.

The `PARTITION BY` clause groups the rows of the query into partitions,
which are processed separately by the window function. `PARTITION BY`
works similarly to a query-level `GROUP BY` clause, except that its
expressions are always just expressions and cannot be output-column
names or numbers. Without `PARTITION BY`, all rows produced by the query
are treated as a single partition. The `ORDER BY` clause determines the
order in which the rows of a partition are processed by the window
function. It works similarly to a query-level `ORDER BY` clause, but
likewise cannot use output-column names or numbers. Without `ORDER BY`,
rows are processed in an unspecified order.

The `<frame_clause>` specifies the set of rows constituting the window
frame, which is a subset of the current partition, for those window
functions that act on the frame instead of the whole partition. The set
of rows in the frame can vary depending on which row is the current row.
The frame can be specified in `RANGE`, `ROWS` or `GROUPS` mode; in each
case, it runs from the `<frame_start>` to the `<frame_end>`. If
`<frame_end>` is omitted, the end defaults to `CURRENT ROW`.

A `<frame_start>` of `UNBOUNDED PRECEDING` means that the frame starts
with the first row of the partition, and similarly a `<frame_end>` of
`UNBOUNDED FOLLOWING` means that the frame ends with the last row of the
partition.

In `RANGE` or `GROUPS` mode, a `<frame_start>` of `CURRENT ROW` means
the frame starts with the current row's first peer row (a row that the
window's `ORDER BY` clause sorts as equivalent to the current row),
while a `<frame_end>` of `CURRENT ROW` means the frame ends with the
current row's last peer row. In `ROWS` mode, `CURRENT ROW` simply means
the current row.

In the `<offset> PRECEDING` and `<offset> FOLLOWING` frame options,
the `<offset>` must be an expression not containing any variables,
aggregate functions, or window functions. The meaning of the `<offset>`
depends on the frame mode:

-   In `ROWS` mode, the `<offset>` must yield a non-null, non-negative
    integer, and the option means that the frame starts or ends the
    specified number of rows before or after the current row.

-   In `RANGE` mode, these options require that the `ORDER BY` clause
    specify exactly one column. The `<offset>` specifies the maximum
    difference between the value of that column in the current row and
    its value in preceding or following rows of the frame. The data type
    of the `<offset>` expression varies depending on the data type of
    the ordering column. For numeric ordering columns it is typically of
    the same type as the ordering column, but for datetime ordering
    columns it is an `interval`. For example, if the ordering column is
    of type `date` or `timestamp`, one could write
    `RANGE BETWEEN '1 day' PRECEDING AND '10 days' FOLLOWING`. The
    `<offset>` is still required to be non-null and non-negative, though
    the meaning of "non-negative" depends on its data type.

In any case, the distance to the end of the frame is limited by the
distance to the end of the partition, so that for rows near the end of
the partition, the frame might contain fewer rows than elsewhere.

Notice that in `ROWS` mode, `0 PRECEDING` and `0 FOLLOWING` is equivalent
to `CURRENT ROW`. This normally holds in `RANGE` mode as well, for an
appropriate data-type-specific meaning of "zero".

The `<frame_exclusion>` option allows rows around the current row to be
excluded from the frame, even if they would be included according to the
frame start and frame end options. `EXCLUDE CURRENT ROW` excludes the
current row from the frame. `EXCLUDE GROUP` excludes the current row and
its ordering peers from the frame. `EXCLUDE TIES` excludes any peers of
the current row from the frame, but not the current row itself.
`EXCLUDE NO OTHERS` simply specifies explicitly the default behavior of
not excluding the current row or its peers.

The default framing option is `RANGE UNBOUNDED PRECEDING`, which is the
same as `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. With
`ORDER BY`, this sets the frame to be all rows from the partition start
up through the current row's last `ORDER BY` peer. Without `ORDER BY`,
this means all rows of the partition are included in the window frame,
since all rows become peers of the current row.

Restrictions are that `<frame_start>` cannot be `UNBOUNDED FOLLOWING`,
`<frame_end>` cannot be `UNBOUNDED PRECEDING`, and the `<frame_end>`
choice cannot appear earlier in the above list of `<frame_start>` and
`<frame_end>` options than the `<frame_start>` choice does — for
example `RANGE BETWEEN CURRENT ROW AND offset PRECEDING` is not allowed.
But, for example, `ROWS BETWEEN 7 PRECEDING AND 8 PRECEDING` is allowed,
even though it would never select any rows.

The `FROM FIRST` or `FROM LAST` options are valid only for the
`nth_value` function. They specify whether the n-th value picked by the
function is counted from the first row or the last row in the frame. The
default is `FROM FIRST`.

For some window functions, `NULL` values within a window frame can cause
undesired results. A common example is a table imported from a
spreadsheet where values are not repeated for rows of the same group.
For example:

     row_no | country | region | amount
     -------+---------+--------+-------
          1 | USA     | North  |   1000
          2 | NULL    | East   |   1200
          3 | NULL    | West   |   3000
          4 | NULL    | South  |   2600
          5 | Germany | North  |   1800
          6 | NULL    | East   |   2700
          7 | NULL    | West   |   1100
          8 | NULL    | South  |   2100

In this example, the `country` value only occurs in the first value of
each group, but a query with a filter by `region` might return all rows
with `NULL` in the `country` column. This problem can be fixed with the
`IGNORE NULLS` clause and the `last_value` function:

    SELECT last_value(country) IGNORE NULLS OVER (ORDER BY row_no)
       region,
       amount
    FROM regions

This query produces the following result:

    country | region | amount
    --------+--------+-------
    USA     | North  |   1000
    USA     | East   |   1200
    USA     | West   |   3000
    USA     | South  |   2600
    Germany | North  |   1800
    Germany | East   |   2700
    Germany | West   |   1100
    Germany | South  |   2100

`IGNORE NULLS` is only supported for the `last_value` function. The
clause `RESPECT NULLS` does not ignore `NULL` values, which is the
default behavior supported in all window functions.

:::note
The SQL standard defines `RESPECT NULLS` and `IGNORE NULLS` as options
for `lead`, `lag`, `first_value`, `last_value`, and `nth_value`, the
former one being the default behavior. In Hyper the `IGNORE NULLS`
option is currently only supported for the `last_value` function.
:::

The syntaxes using `*` are used for calling parameter-less aggregate
functions as window functions, for example
`count(*) OVER (PARTITION BY x ORDER BY y)`. The asterisk (`*`) is
customarily not used for window-specific functions. Window-specific
functions do not allow `DISTINCT` or `ORDER BY` to be used within the
function argument list.

Window function calls are permitted only in the `SELECT` list and the
`ORDER BY` clause of the query.

[^1]: There are options to define the window frame in other ways. See
    [Window Function Call Syntax](#syntax-window-functions) for details.
