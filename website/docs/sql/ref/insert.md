INSERT

\[ WITH \[ RECURSIVE \]

with_query

\[, \...\] \] INSERT INTO

table_name

{ { DEFAULT VALUES \| \[ (

column_name

\[, \...\] ) \] VALUES ( {

expression

\| DEFAULT }) \[, \...\] \| \[ (

column_name

\[, \...\] ) \]

query

} \[ RETURNING \* \|

output_expression

\[ \[ AS \]

output_name

\] \[, \...\] \]

# Description

`INSERT` inserts new rows into a table. One can insert one or more rows
specified by value expressions, or zero or more rows resulting from a
query.

The target column names can be listed in any order. If no list of column
names is given at all, the default is all the columns of the table in
their declared order; or the first \<N\> column names, if there are only
\<N\> columns supplied by the `VALUES` clause or \<query\>. The values
supplied by the `VALUES` clause or \<query\> are associated with the
explicit or implicit column list left-to-right.

Note that the syntax for the `VALUES` clause is extended from its
general definition in [???](#sql-select), as it also supports the
special argument `DEFAULT`. In this special case, the default value is
used for the corresponding column. The default value is specified when
creating the table. See [???](#sql-createtable).

Each column not present in the explicit or implicit column list will be
filled with a default value, either its declared default value or null
if there is none.

If the expression for any column is not of the correct data type,
automatic type conversion will be attempted.

The optional `RETURNING` clause causes `INSERT` to compute and return
value(s) based on each row actually inserted. This is primarily useful
for obtaining values that were supplied by defaults. However, any
expression using the table\'s columns is allowed. The syntax of the
`RETURNING` list is identical to that of the output list of `SELECT`.
Only rows that were successfully inserted will be returned. For example,
if a row violates a constraint, it will not be returned.

Use of the `RETURNING` clause requires `SELECT` privilege on all columns
mentioned in `RETURNING`. If you use the \<query\> clause to insert rows
from a query, you of course need to have `SELECT` privilege on any table
or column used in the query.

# Parameters

\<with_query\>

:   The `WITH` clause allows you to specify one or more subqueries that
    can be referenced by name in the `INSERT` query. See
    [???](#sql-select) for details.

    It is possible for the \<query\> (`SELECT` statement) to also
    contain a `WITH` clause. In such a case both sets of \<with_query\>
    can be referenced within the \<query\>, but the second one takes
    precedence since it is more closely nested.

\<table_name\>

:   The name (optionally schema-qualified) of an existing table.

\<column_name\>

:   The name of a column in the table named by \<table_name\>. The
    column name can be qualified with a subfield name or array
    subscript, if needed. (Inserting into only some fields of a
    composite column leaves the other fields null.)

`DEFAULT VALUES`

:   All columns will be filled with their default values.

\<expression\>

:   An expression or value to assign to the corresponding column.

`DEFAULT`

:   The corresponding column will be filled with its default value.

\<query\>

:   A query (`SELECT` statement) that supplies the rows to be inserted.
    Refer to the [???](#sql-select) statement for a description of the
    syntax.

\<output_expression\>

:   An expression to be computed and returned by the `INSERT` command
    after each row is inserted or updated. The expression can use any
    column names of the table named by \<table_name\>. Write `*` to
    return all columns of the inserted or updated row(s).

\<output_name\>

:   A name to use for a returned column.

# Outputs

If the `INSERT` command contains a `RETURNING` clause, the result will
be similar to that of a `SELECT` statement containing the columns and
values defined in the `RETURNING` list, computed over the row(s)
inserted or updated by the command.

# Examples

Insert a single row into table `films`:

    INSERT INTO films VALUES
        ('UA502', 'Bananas', 105, '1971-07-13', 'Comedy', '82 minutes');

In this example, the `len` column is omitted and therefore it will have
the default value:

    INSERT INTO films (code, title, did, date_prod, kind)
        VALUES ('T_601', 'Yojimbo', 106, '1961-06-16', 'Drama');

This example uses the `DEFAULT` clause for the date columns rather than
specifying a value:

    INSERT INTO films VALUES
        ('UA502', 'Bananas', 105, DEFAULT, 'Comedy', '82 minutes');
    INSERT INTO films (code, title, did, date_prod, kind)
        VALUES ('T_601', 'Yojimbo', 106, DEFAULT, 'Drama');

To insert a row consisting entirely of default values:

    INSERT INTO films DEFAULT VALUES;

To insert multiple rows using the multirow `VALUES` syntax:

    INSERT INTO films (code, title, did, date_prod, kind) VALUES
        ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
        ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');

This example inserts some rows into table `films` from a table
`tmp_films` with the same column layout as `films`:

    INSERT INTO films SELECT * FROM tmp_films WHERE date_prod < '2004-05-07';

This example inserts into array columns:

    -- Create an empty 3x3 gameboard for noughts-and-crosses using arrays
    INSERT INTO tictactoe (game, board) VALUES (1, '{{" "," "," "},{" "," "," "},{" "," "," "}}');
    -- Add a new board state
    INSERT INTO tictactoe (game, board) VALUES (2, '{{X," "," "},{" ",O," "},{" ",X," "}}');

Insert a single row into table `distributors`, returning the number
generated by the `DEFAULT` clause:

    INSERT INTO distributors (did, dname) VALUES (DEFAULT, 'XYZ Widgets')
       RETURNING did;

# Compatibility

`INSERT` conforms to the SQL standard, except that the `RETURNING`
clause is a Hyper extension (also available in PostgreSQL), as is the
ability to use `WITH` with `INSERT`. Also, the case in which a column
name list is omitted, but not all the columns are filled from the
`VALUES` clause or \<query\>, is disallowed by the standard.

Possible limitations of the \<query\> clause are documented under
[???](#sql-select).
