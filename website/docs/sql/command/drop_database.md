# DROP DATABASE

— remove a database

## Synopsis

```sql_template
DROP DATABASE [IF EXISTS] <name>
```

## Description

`DROP DATABASE` drops a database. It deletes the underlying file
containing the data, as well as any associated files such as the
transaction log. It cannot be executed while you or anyone else is
connected to the target database.

`DROP DATABASE` cannot be undone. Use it with care!

## Parameters

`IF EXISTS`

:   Do not throw an error if the database does not exist.

`<name>`

:   The name of the database to remove.

## Compatibility

There is no `DROP DATABASE` statement in the SQL standard.