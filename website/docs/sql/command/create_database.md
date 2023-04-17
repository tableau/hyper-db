# CREATE DATABASE

— create a new database

## Synopsis

```sql_template
CREATE DATABASE [IF NOT EXISTS] <name> [FROM <source_database>]
```

## Description

`CREATE DATABASE` creates a new Hyper database.

## Parameters

`IF NOT EXISTS`

:   Do not throw an error if the database cannot be created because a
    database file with the same name already exists. Even with `IF NOT EXISTS`,
    the `CREATE TABLE` command fails if the already existing file is not a
    Hyper database file.

`<name>`

:   The name of the database to create. The new database will be stored
    as a file with this name in the default database directory. No
    default file extension is added, but one can be provided as part of
    the name. Alternatively, this parameter can also be an absolute or
    relative path to where the database file should be stored. See
    examples below.

`<source_database>`

:   If the `FROM` clause is specified, then the new database will
    contain a copy of the source database, including the content of all
    tables and all metadata.

## Examples

To create a new database:

    CREATE DATABASE mydb;

To create a new database at the specified absolute file path (assuming
not restricted to the default database directory):

    CREATE DATABASE "/home/johndoe/mydatabase.db";

To create a new database under a specified file path relative to the
default database directory:

    CREATE DATABASE "other_databases/mytest.db";

To copy a database `sales` into a new database `sales_copy`:

    CREATE DATABASE sales_copy FROM sales;

## Compatibility

There is no `CREATE DATABASE` statement in the SQL standard. Databases
are equivalent to the concept of catalogs, whose creation the SQL
standard leaves to the application.