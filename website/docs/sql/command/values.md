# VALUES

— retrieve a hardcoded set of rows

```
VALUES ( <expression> [, ...] ) [, ...]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] <select> ]
    [ ORDER BY <sort_expression> [ ASC | DESC ] [, ...] ]
    [ LIMIT { <count> | ALL } ]
    [ OFFSET <start> [ ROW | ROWS ] ]
    [ FETCH { FIRST | NEXT } [ <count> ] { ROW | ROWS } ONLY ];
```

## Description

`VALUES` retrieves a set of rows hardcoded in the SQL query.
It is particularly useful to provide a set of constant rows for an
[`INSERT` command](insert) or as a subquery in a larger
[`SELECT` query](select).

It can be used as a top-level command or as a space-saving syntax variant in
parts of complex queries. Only the [UNION](select#union),
[INTERSECT](select#intersect), [EXCEPT](select#except), [ORDER BY](select#orderby),
[LIMIT](select#limit), [OFFSET](select#limit), and [FETCH](select#limit) clauses
can be used with TABLE; the WHERE clause and any form of aggregation cannot be used.
For more information on those clauses, see the documentation of [SELECT](select).

The columns produced by the `VALUES` query are named `column1`, `column2` and so on.

## Examples

Return a single row, containing two columns:

```
VALUES(1, 'first entry')
```

The `VALUES` clause can also contain arbitrarily complex expressions:

```
VALUES(1 + 4, NOW())
```

To return multiple rows from a `VALUES` clause, use multiple
comma-separated bracketed lists:

```
VALUES (1, 'first'), (2, 'second'), (1+2, 'third)
```

One can also use `ORDER BY`, `OFFSET` and `LIMIT` on a `VALUES` clause:

```
VALUES (1, 'first'), (3, 'third'), (4, 'fourth'), (2, 'second')
ORDER BY column1
OFFSET 1
LIMIT 2
```