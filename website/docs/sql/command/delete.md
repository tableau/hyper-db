# DELETE

— delete rows of a table

## Synopsis

```sql_template
[ WITH [RECURSIVE] <with_query> [, ...] ]
DELETE FROM <table_name> [ [AS] <alias> ]
[ USING <using_list> ]
[ WHERE <condition> ]
[ RETURNING { * | <output_expression> [AS <output_name>]} [, ...] ]
```

## Description

`DELETE` deletes rows that satisfy the `WHERE` clause from the specified
table. If the `WHERE` clause is absent, the effect is to delete all rows
in the table. The result is a valid, but empty table.

There are two ways to delete rows in a table using information contained
in other tables in the database: using sub-selects, or specifying
additional tables in the `USING` clause. Which technique is more
appropriate depends on the specific circumstances.

The optional `RETURNING` clause causes `DELETE` to compute and return
value(s) based on each deleted row. Any expression using the
table's columns, and/or columns of other tables mentioned in the
`USING` clause, can be computed. The syntax of the `RETURNING` list is
identical to that of the output list of `SELECT`.

## Parameters

`<with_query>`

:   The `WITH` clause allows you to specify one or more subqueries that
    can be referenced by name in the `DELETE` query. See
    [SELECT](select) for details.

`<table_name>`

:   The name (optionally schema-qualified) of the table to delete rows
    from.

`<alias>`

:   A substitute name for the target table. When an alias is provided,
    it completely hides the actual name of the table. For example, given
    `DELETE FROM foo AS f`, the remainder of the `DELETE` statement must
    refer to this table as `f` not `foo`.

`<using_list>`

:   A list of table expressions, allowing columns from other tables to
    appear in the `WHERE` condition. This is similar to the list of
    tables that can be specified in the [FROM](select#from) clause of
    a `SELECT` statement; for example, an alias for the table name can
    be specified. Do not repeat the target table in the `<using_list>`,
    unless you wish to set up a self-join.

`<condition>`

:   An expression that returns a value of type `boolean`. Only rows for
    which this expression returns `true` will be deleted.

`<output_expression>`

:   An expression to be computed and returned by the `DELETE` command
    after each row is deleted. The expression can use any column names
    of the table named by `<table_name>` or table(s) listed in `USING`.
    Write `*` to return all columns.

`<output_name>`

:   A name to use for a returned column.

## Outputs

If the `DELETE` command contains a `RETURNING` clause, the result will
be similar to that of a `SELECT` statement containing the columns and
values defined in the `RETURNING` list, computed over the row(s) deleted
by the command.

## Referring to other tables

Hyper lets you reference columns of other tables in the `WHERE`
condition by specifying the other tables in the `USING` clause. For
example, to delete all films produced by a given producer, one can do:

    DELETE FROM films USING producers
      WHERE producer_id = producers.id AND producers.name = 'foo';

What is essentially happening here is a join between films and
producers, with all successfully joined films rows being marked for
deletion. This syntax is not standard. A more standard way to do it is:

    DELETE FROM films
      WHERE producer_id IN (SELECT id FROM producers WHERE name = 'foo');

The query plans generated for both forms are equivalent. Thus, they do
not differ in terms of performance.

## Examples

Delete all films but musicals:

    DELETE FROM films WHERE kind <> 'Musical';

Clear the table `films`:

    DELETE FROM films;

Delete completed tasks, returning full details of the deleted rows:

    DELETE FROM tasks WHERE status = 'DONE' RETURNING *;

## Compatibility

This command conforms to the SQL standard, except that the `USING` and
`RETURNING` clauses are Hyper extensions (also available in PostgreSQL),
as is the ability to use `WITH` with `DELETE`.
