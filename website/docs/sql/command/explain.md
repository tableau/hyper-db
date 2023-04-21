# EXPLAIN

— show the query plan for a query

## Synopsis

```sql_template
EXPLAIN (<option>, ...) <query>;
EXPLAIN [VERBOSE] [ANALYZE] <query>;
```

## Description

:::warning Unstable Interface
The returned query plans map directly to Hyper's internal representation of query plans.
As Hyper evolves, the query plans might change considerably.
Don't expect query plans (neither their formatting nor their semantics) to be stable across Hyper versions.
:::


This command retrieves the query plan which Hyper uses to execute the given query.
The query plan describes which tables are accessed in which order, how they are joined together, which expressions are evaluated and all other details of query execution.

One or more `<option>`s can provided to change which information is displayed and how it is displayed.
In general, options are provided within parentheses after the `EXPLAIN` keyword.
In addition, `VERBOSE` and `ANALYZE` can also be provided without parentheses.

There are three types of plans which can be queried:

* The *optimized plan*. By default, if no other behavior is requested through an `<option>`, `EXPLAIN` will display the optimized plan.
* The *optimizer steps*. If the `OPTIMIZERSTEPS` option is present, Hyper will output the plan at multiple intermediate steps during query optimization, e.g., before and after join reordering.
* The *analyzed plan*. When invoked with the `ANALYZE` option, Hyper will actually execute the query, including all side effects (inserted/deleted tuples, etc.). Instead of the normal query results, you will however receive the query plan of the query, annotated with runtime statistics such as the number of tuples processed by each operator.

By default, plans are formatted as ASCII art.
The ASCII art is useful for quickly grasping the overall query structure, but is lacking details, such as the exact join conditions.
Those details are present in the JSON output format, which can be requested using the `VERBOSE` option. 
The `VERBOSE` option can be combined with any other choice
To visualize a JSON query plan and interactively explore it, copy-paste the plan into [Hyper's Plan Viewer](https://tableau.github.io/query-graphs/).

## Examples

The following will give us the query plan of TPC-H query 6, formatted as an ASCII art.

```
EXPLAIN
SELECT sum(l_extendedprice * l_discount) as revenue
FROM lineitem
WHERE l_shipdate >= date '1994-01-01'
    AND l_shipdate < date '1995-01-01'
    AND l_discount BETWEEN 0.06 - 0.01 AND 0.06 + 0.01
    AND l_quantity < 24
```

If we want to understand how the query plan changed during the optimization steps, we can use `OPTIMIZERSTEPS`:

```
EXPLAIN (OPTIMIZERSTEPS)
SELECT sum(l_extendedprice * l_discount) as revenue
FROM lineitem
WHERE l_shipdate >= date '1994-01-01'
    AND l_shipdate < date '1995-01-01'
    AND l_discount BETWEEN 0.06 - 0.01 AND 0.06 + 0.01
    AND l_quantity < 24
```

If we want to view the plan in a graphical plan viewer, or want to see additional details in the plan, we can use the `VERBOSE` option and then copy-paste the resulting JSON into [Hyper's Plan Viewer](https://tableau.github.io/query-graphs/).

```
SELECT sum(l_extendedprice * l_discount) as revenue
FROM lineitem
WHERE l_shipdate >= date '1994-01-01'
    AND l_shipdate < date '1995-01-01'
    AND l_discount BETWEEN 0.06 - 0.01 AND 0.06 + 0.01
    AND l_quantity < 24
```
