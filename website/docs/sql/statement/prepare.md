# PREPARE

PREPARE

name

\[ (

data_type

\[, \...\] ) \] AS

statement

## Description

`PREPARE` creates a prepared statement. A prepared statement is a
server-side object that can be used to optimize performance. When the
`PREPARE` statement is executed, the specified statement is parsed,
analyzed, rewritten, and planned. When an `EXECUTE` command is
subsequently issued, the prepared statement is simply executed. This
division of labor avoids repetitive parse and analysis work.

Prepared statements can take parameters: values that are substituted
into the statement when it is executed. When creating the prepared
statement, refer to parameters by position, using `$1`, `$2`, etc. A
corresponding list of parameter data types can optionally be specified.
If a list of types is not given, the type of each parameter is inferred
from the context in which it is first referenced (if possible). When
executing the statement, specify the actual values for these parameters
in the `EXECUTE` statement. Refer to [???](#sql-execute) for more
information about that.

Prepared statements only last for the duration of the current database
session. When the session ends, the prepared statement is forgotten, so
it must be recreated before being used again. This also means that a
single prepared statement cannot be used by multiple simultaneous
database clients; however, each client can create their own prepared
statement to use. Prepared statements can be manually cleaned up using
the [???](#sql-deallocate) command.

Prepared statements potentially have the largest performance advantage
when a single session is being used to execute a large number of similar
statements. The performance difference will be particularly significant
if the statements are complex to plan or rewrite, e.g., if the query
involves a join of many tables or requires the application of several
rules. If the statement is relatively simple to plan and rewrite but
relatively expensive to execute, the performance advantage of prepared
statements will be less noticeable.

## Parameters

\<name\>

:   An arbitrary name given to this particular prepared statement. It
    must be unique within a single session and is subsequently used to
    execute or deallocate a previously prepared statement.

\<data_type\>

:   The data type of a parameter to the prepared statement. If the data
    type of a particular parameter is unspecified , it will be inferred
    from the context in which the parameter is first referenced. To
    refer to the parameters in the prepared statement itself, use `$1`,
    `$2`, etc.

\<statement\>

:   Any `SELECT`, `INSERT`, `UPDATE`, `DELETE`, or `VALUES` statement.

## Notes {#sql-prepare-notes}

Prepared statements do not re-generate query plans for executions of the
statement with different values supplied as parameters. As such, the
generic plan might perform worse than the plan that would be generated
by an equivalent query with hard-coded arguments.

Certain table modifications might cause re-compilation, and thus
generation of a new query plan for prepared statements that access that
table. These include schema changes like renaming or dropping and
re-creating a table or view with the same name.

Although the main point of a prepared statement is to avoid repeated
parse analysis and planning of the statement, Hyper will force
re-analysis and re-planning of the statement before using it whenever
database objects used in the statement have undergone definitional (DDL)
changes since the previous use of the prepared statement. Further causes
of re-analysis and re-planning are the insertion of a null value in a
column that only contains non-null values and, conversely, the removal
of the only null value in an otherwise non-null column. In that case,
prepared statements that access the table containing the column are
recompiled on demand during the next execution.

Non-qualified references to tables and views (i.e., without a schema
name as prefix) are translated into their qualified counterparts when a
prepared statement is created. Therefore, the results delivered by the
execution of a prepared statement will not change if the search path is
changed or if tables are created that would cause name resolution to be
different at the time of execution.

## Examples {#sql-prepare-examples}

Create a prepared statement for an `INSERT` statement, and then execute
it:

    PREPARE fooplan (int, text, bool, numeric) AS
        INSERT INTO foo VALUES($1, $2, $3, $4);
    EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);

Create a prepared statement for a `SELECT` statement, and then execute
it:

    PREPARE usrrptplan (int) AS
        SELECT * FROM users u, logs l WHERE u.usrid=$1 AND u.usrid=l.usrid
        AND l.date = $2;
    EXECUTE usrrptplan(1, current_date);

Note that the data type of the second parameter is not specified, so it
is inferred from the context in which `$2` is used.

## Compatibility

The SQL standard includes a `PREPARE` statement, but it is only for use
in embedded SQL. This version of the `PREPARE` statement also uses a
somewhat different syntax, which is derived from PostgreSQL.

## See Also
