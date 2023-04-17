# CREATE TABLE

— define a new table

## Synopsis

```sql_template
CREATE [ { TEMPORARY | TEMP } ] TABLE [IF NOT EXISTS] <table_name> (
    {
        <column_name> <data_type> [COLLATE <collation>] [<column_constraint>] |
        <table_constraint>
    } [, ...]
)
```

where `column_constraint` is:

```sql_template
{ NOT NULL |
  NULL |
  DEFAULT <default_expr> |
  ASSUMED UNIQUE |
  ASSUMED PRIMARY KEY |
  ASSUMED REFERENCES <reftable> (<refcolumn> [, ...]) [ MATCH FULL | MATCH SIMPLE ]
}
```

and `table_constraint` is:

```sql_template
{ 
    ASSUMED UNIQUE (<column_name> [, ...]) |
    ASSUMED PRIMARY KEY (<column_name> [, ...]) |
    ASSUMED FOREIGN KEY (<column_name> [, ...])
        REFERENCES <reftale> [ (<refcolumn> [, ...]) ]
        [ MATCH FULL | MATCH SIMPLE ]
}
```

## Description {#sql-createtable-description}

`CREATE TABLE` will create a new, initially empty table in the current
database. The table will be owned by the user issuing the command.

If a schema name is given (for example,
`CREATE TABLE myschema.mytable ...`) then the table is created in the
specified schema. Otherwise it is created in the current schema.
Temporary tables exist in a special schema, so a schema name cannot be
given when creating a temporary table. The name of the table must be
distinct from the name of any other table, sequence, index, view, or
foreign table in the same schema.

The optional constraint clauses specify constraints (tests) that new or
updated rows must satisfy for an insert or update operation to succeed.
A constraint is an SQL object that helps define the set of valid values
in the table in various ways.

Hyper only officially supports `ASSUMED` constraints, which means that
the constraints are not actually verified when rows are modified.
Instead, Hyper assumes that the constraints are enforced by the client,
and thus it performs all useful optimizations that are only possible
when the constraint in question is enforced. Correct behavior cannot be
guaranteed on the database side if the application violates its assumed
constraints.

There are two ways to define constraints: table constraints and column
constraints. A column constraint is defined as part of a column
definition. A table constraint definition is not tied to a particular
column, and it can encompass more than one column. Every column
constraint can also be written as a table constraint; a column
constraint is only a notational convenience for use when the constraint
only affects one column.

## Parameters

`TEMPORARY` or `TEMP`

:   If specified, the table is created as a temporary table. Temporary
    tables are automatically dropped at the end of a session and are
    only visible by this connection. Existing permanent tables with the
    same name are not visible to the current session while the temporary
    table exists, unless they are referenced with schema-qualified
    names. Any indexes created on a temporary table are automatically
    temporary as well.

`IF NOT EXISTS`

:   Do not throw an error if a table with the same name already exists.
    Note that there is no guarantee that the existing table is anything
    like the one that would have been created.

`<table_name>`

:   The name (optionally schema-qualified) of the table to be created.

`<column_name>`

:   The name of a column to be created in the new table.

`<data_type>`

:   The data type of the column. For more information on the data types
    supported by Hyper, refer to [Data Types](/docs/sql/datatype/).

`COLLATE collation`

:   The `COLLATE` clause assigns a collation to the column (which must
    be of a collatable data type). If not specified, the column data
    type's default collation is used.

`NOT NULL`

:   The column is not allowed to contain null values.

`NULL`

:   The column is allowed to contain null values. This is the default.
    This clause is only provided for compatibility with non-standard SQL
    databases. Its use is discouraged in new applications.

`DEFAULT <default_expr>`

:   The `DEFAULT` clause assigns a default data value for the column
    whose column definition it appears within. The value is any
    variable-free expression (subqueries and cross-references to other
    columns in the current table are not allowed). The data type of the
    default expression must match the data type of the column.
    The default expression will be used in any insert operation that
    does not specify a value for the column. If there is no default for
    a column, then the default is null.

`ASSUMED UNIQUE` (column constraint); `ASSUMED UNIQUE ( column_name [, ... ] )` (table constraint)

:   The `UNIQUE` constraint specifies that a group of one or more
    columns of a table can contain only unique values. The behavior of
    the unique table constraint is the same as that for column
    constraints, with the additional capability to span multiple
    columns.
    For the purpose of a unique constraint, null values are not
    considered equal.
    Each unique table constraint must name a set of columns that is
    different from the set of columns named by any other unique or
    primary key constraint defined for the table. (Otherwise it would
    just be the same constraint listed twice.)
    `ASSUMED` constraints are not checked by the database. The user has
    to ensure that they hold, otherwise queries may yield wrong results.

`ASSUMED PRIMARY KEY` (column constraint); `ASSUMED PRIMARY KEY ( column_name [, ... ] )` (table constraint)

:   The `PRIMARY KEY` constraint specifies that a column or columns of a
    table can contain only unique (non-duplicate), nonnull values. Only
    one primary key can be specified for a table, whether as a column
    constraint or a table constraint.
:   The primary key constraint should name a set of columns that is
    different from the set of columns named by any unique constraint
    defined for the same table. (Otherwise, the unique constraint is
    redundant and will be discarded.)
:   `PRIMARY KEY` enforces the same data constraints as a combination of
    `UNIQUE` and `NOT NULL`, but identifying a set of columns as the
    primary key also provides metadata about the design of the schema,
    since a primary key implies that other tables can rely on this set
    of columns as a unique identifier for rows.
:   `ASSUMED` constraints are not checked by the database. The user has
    to ensure that they hold, otherwise queries may yield wrong results.

`ASSUMED REFERENCES reftable [ ( refcolumn ) ] [ MATCH FULL | MATCH SIMPLE ]` (column constraint); `ASSUMED FOREIGN KEY ( column [, ... ] ) REFERENCES reftable [ ( refcolumn [, ... ] ) ] [ MATCH FULL | MATCH SIMPLE ]` (table constraint)

:   These clauses specify a foreign key constraint, which requires that
    a group of one or more columns of the new table must only contain
    values that match values in the referenced column(s) of some row of
    the referenced table. If `<refcolumn>` is omitted, the primary key
    of the `<reftable>` is used. The referenced columns must be the
    columns of a unique or primary key constraint in the referenced
    table. Note that foreign key constraints cannot be defined between
    temporary tables and permanent tables.
:   A value inserted into the referencing column(s) is matched against
    the values of the referenced table and referenced columns using the
    given match type. There are two match types: `MATCH FULL` and
    `MATCH SIMPLE`, which is also the default. `MATCH FULL` will not
    allow one column of a multicolumn foreign key to be null unless all
    foreign key columns are null. `MATCH SIMPLE` allows some foreign key
    columns to be null while other parts of the foreign key are not
    null.
:   `ASSUMED` constraints are not checked by the database. The user has
    to ensure that they hold, otherwise queries may yield wrong results.

## Examples {#examples}

Create table `films` and table `distributors`:

    CREATE TABLE films (
        code        char(5) ASSUMED PRIMARY KEY,
        title       varchar(40) NOT NULL,
        did         integer NOT NULL,
        date_prod   date,
        kind        varchar(10),
        len         interval
    );

    CREATE TABLE distributors (
         did    integer ASSUMED PRIMARY KEY,
         name   varchar(40) NOT NULL
    );

Define an assumed unique table constraint for the table `films`. Unique
table constraints can be defined on one or more columns of the table:

    CREATE TABLE films (
        code        char(5),
        title       varchar(40),
        did         integer,
        date_prod   date,
        kind        varchar(10),
        len         interval,
        ASSUMED UNIQUE(date_prod)
    );

Define an assumed primary key table constraint for the table films:

    CREATE TABLE films (
        code        char(5),
        title       varchar(40),
        did         integer,
        date_prod   date,
        kind        varchar(10),
        len         interval,
        ASSUMED PRIMARY KEY(code,title)
    );

Define an assumed primary key constraint for table distributors. The
following two examples are equivalent, the first using the table
constraint syntax, the second the column constraint syntax:

    CREATE TABLE distributors (
        did     integer,
        name    varchar(40),
        ASSUMED PRIMARY KEY(did)
    );

    CREATE TABLE distributors (
        did     integer ASSUMED PRIMARY KEY,
        name    varchar(40)
    );

Assign a literal constant default value for the column `name`, arrange
for the default value of column `did` to be 42, and make the default
value of `modtime` be the time at which the row is inserted:

    CREATE TABLE distributors (
        name      varchar(40) DEFAULT 'Luso Films',
        did       integer DEFAULT 42,
        modtime   timestamp DEFAULT current_timestamp
    );

Define two `NOT NULL` column constraints on the table `distributors`:

    CREATE TABLE distributors (
        did     integer NOT NULL,
        name    varchar(40) NOT NULL
    );

Define an assumed unique constraint for the `name` column:

    CREATE TABLE distributors (
        did     integer,
        name    varchar(40) ASSUMED UNIQUE
    );

The same, specified as a table constraint:

    CREATE TABLE distributors (
        did     integer,
        name    varchar(40),
        ASSUMED UNIQUE(name)
    );

## Compatibility

The `CREATE TABLE` command conforms to the SQL standard, with exceptions
listed below.

### Temporary Tables

Although the syntax of `CREATE TEMPORARY TABLE` resembles that of the
SQL standard, the effect is not the same. In the standard, temporary
tables are defined just once and automatically exist (starting with
empty contents) in every session that needs them. Hyper instead requires
each session to issue its own `CREATE TEMPORARY TABLE` command for each
temporary table to be used. This allows different sessions to use the
same temporary table name for different purposes, whereas the
standard's approach constrains all instances of a given temporary table
name to have the same table structure.

The standard's definition of the behavior of temporary tables is widely
ignored. Hyper's behavior on this point is similar to that of several
other SQL databases (in particular PostgreSQL).

The standard's distinction between global and local temporary tables is
not in Hyper, since that distinction depends on the concept of modules,
which Hyper does not have. For compatibility's sake, Hyper will accept
the `GLOBAL` and `LOCAL` keywords in a temporary table declaration, but
they have no effect.

### `NULL` "Constraint"

The `NULL` "constraint" (actually a non-constraint) is a Hyper extension
to the SQL standard that is included for compatibility with some other
database systems (and for symmetry with the `NOT NULL` constraint).
Since it is the default for any column, its presence is simply noise.

### Zero-column Tables

Hyper allows a table of no columns to be created (for example,
`CREATE TABLE foo();`). This is an extension from the SQL standard,
which does not allow zero-column tables.
