# DROP DATABASE

— remove a database

## Synopsis

```sql_template
DROP DATABASE [IF EXISTS] <name>
```

## Description

`DROP DATABASE` drops a database. It deletes the underlying file
containing the data, as well as any associated files such as the
transaction log. It can only be executed by the database owner. Also, it
cannot be executed while you or anyone else are connected to the target
database. This implies that the main database, i.e., the database on
which a `hyperd` server was started, cannot be dropped. Connect to the
main database or any other database to issue this command on a regular
database.

`DROP DATABASE` cannot be undone. Use it with care!

## Parameters

`IF EXISTS`

:   Do not throw an error if the database does not exist.

\<name\>

:   The name of the database to remove.

## Compatibility

There is no `DROP DATABASE` statement in the SQL standard.

## See Also
