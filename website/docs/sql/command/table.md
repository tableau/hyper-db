# TABLE

— retrieve rows from a table or view (short-hand)

## Synopsis

```sql_template
[ WITH [ RECURSIVE ] <with_query> [, ...] ]
TABLE <table_name>
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] <select> ]
    [ ORDER BY <expression> [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] ]
    [ LIMIT { <count> | ALL } ]
    [ OFFSET <start> [ ROW | ROWS ] ]
    [ FETCH { <FIRST> | <NEXT> } [ <count> ] { ROW | ROWS } ONLY ];
```

## Description

The command

```sql_template
TABLE <table_name>;
```

is equivalent to

```sql_template
SELECT * FROM <table_name>;
```

It can be used as a top-level command or as a space-saving syntax variant in
parts of complex queries. Only the [WITH](select#with), [UNION](select#union),
[INTERSECT](select#intersect), [EXCEPT](select#except), [ORDER BY](select#orderby),
[LIMIT](select#limit), [OFFSET](select#limit), and [FETCH](select#limit) clauses
can be used with TABLE; the WHERE clause and any form of aggregation cannot be used.
For more information on those clauses, see the documentation of [SELECT](select).

## Examples

To select all columns from rows of the `films` table:

```
TABLE films
```

To select only the 10 most recent films:

```
TABLE films
ORDER BY f.date_prod DESC
LIMIT 10
```

It is possible to union multiple `TABLE` queries, `SELECT` queries and `VALUES` queries:

```
TABLE films
UNION ALL
TABLE series
UNION ALL
SELECT * FROM some_other_table
```

One can also use the `TABLE` command to select the results of a `WITH`:

```
WITH comedies AS (
    SELECT * FROM films WHERE kind = 'Comedy'
)
TABLE films
EXCEPT
TABLE comedies
```