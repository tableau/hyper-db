# EXPLAIN

— show the query plan for a query

## Synopsis

```sql_template
EXPLAIN (<option>, ...) <query>;
```

where the available `<option>`s are

```sql_template
FORMAT <format>
VERBOSE
ANALYZE
OPTIMIZERSTEPS
```

## Description

:::warning Unstable Interface
The returned query plans map directly to Hyper's internal representation of query plans.
As Hyper evolves, the query plans might change considerably.
Don't expect query plans (neither their formatting nor their semantics) to be stable across Hyper versions.
:::


The `EXPLAIN` command retrieves information about the query plan which Hyper uses to execute the given query.
The query plan describes which tables are accessed in which order, how they are joined together, which expressions are evaluated and all other details of query execution.

`EXPLAIN` can provide the following types of information:

* The *optimized plan*. By default, if no other behavior is requested through an `<option>`, `EXPLAIN` will display the optimized plan.
* The *optimizer steps*. If the `OPTIMIZERSTEPS` option is present, Hyper will output the plan at multiple intermediate steps during query optimization, e.g., before and after join reordering.
* The *analyzed plan*. When invoked with the `ANALYZE` option, Hyper will actually execute the query, including all side effects (inserted/deleted tuples, etc.). Instead of the normal query results, you will however receive the query plan of the query, annotated with runtime statistics such as the number of tuples processed by each operator.
* The *result schema*. With the `FORMAT SCHEMA`, only the list of result columns and their types are returned. The actual query plan is not printed.

The `FORMAT` option determines the formatting of the returned data. The availble options are:
* `TEXT_TREE`: a tree-like representation of the query plan as ASCII art. To be viewed using a monospaced font.
* `JSON`: output the plan as pretty-printed JSON.
* `TERSE_JSON`: output the plan as JSON without pretty-printing.
* `SCHEMA`: only print a list of the returned columns. Don't actually print information about the joins, table scans, etc.

By default, plans are formatted as ASCII art trees.
The ASCII art representation is useful for quickly grasping the overall query structure, but is lacking details, such as the exact join conditions.
Those details are present in the JSON output format, which can be requested using the `FORMAT JSON` option.
To visualize a JSON query plan and interactively explore it, copy-paste the plan into [Hyper's Plan Viewer](https://tableau.github.io/query-graphs/).

## Examples

The following will give us the query plan of TPC-H query 6, formatted as ASCII art.

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

If we want to view the plan in a graphical plan viewer, or want to see additional details in the plan, we can use the `FORMAT JSON` option and then copy-paste the resulting JSON into [Hyper's Plan Viewer](https://tableau.github.io/query-graphs/).

```
EXPLAIN (FORMAT JSON, OPTIMIZERSTEPS)
SELECT sum(l_extendedprice * l_discount) as revenue
FROM lineitem
WHERE l_shipdate >= date '1994-01-01'
    AND l_shipdate < date '1995-01-01'
    AND l_discount BETWEEN 0.06 - 0.01 AND 0.06 + 0.01
    AND l_quantity < 24
```
