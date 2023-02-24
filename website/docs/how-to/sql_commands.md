---
title: Use SQL Commands with Hyper Files
sidebar_position: 5
---

Using the Hyper API, you can use SQL statements to interact with tables and data in `.hyper` files. The Hyper SQL language is based on the SQL standard and incorporates many PostgreSQL features and commands, such as the ability to copy from comma-separated value (CSV) files.


For information about all the SQL commands and queries you can use with Hyper files, see [Hyper SQL Reference](../reference/sql/index.html){:target="_blank" rel="noopener"}.

## Connect to the database (.hyper file)

To use SQL commands with the Hyper API, you first need a connection to the database (the `.hyper` file). Using the connection object, you can send SQL commands and queries.

1. Start the Hyper server (`HyperProcess`). Keep the process running until your application is done reading the data and is finished working with the extract file. Starting and stopping Hyper after each operation takes time and is unnecessary.

2. Open connection to the database (`.hyper` file). Use the connection object to send SQL commands or SQL queries to read the data. Because you are reading from an existing `.hyper` file, you don't need to specify the `CreateMode` (the default value is `CreateMode.NONE`).

#### Example: Connect to database (.hyper file) (Python)

```python
# Start Hyper
with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU ) as hyper:

#  Connect to an existing .hyper file (CreateMode.NONE)
    with Connection(endpoint=hyper.endpoint, database='mydb.hyper') as connection:

        # ... use the connection object to send SQL commands or queries
```

## Create the SQL command using the connection object

The `Connection` class in the Hyper API provides methods for creating SQL statements and queries. The Hyper API provides one method for SQL commands, and three methods that are specific to queries. The command method returns the count of affected rows. The queries return either a Hyper API `result` object, a list of rows, each row represented by a list of objects, or the value from one row, one column.



| Connection SQL methods   | Returns |
| ---- | ---- |
`execute_command` | The count of affected rows, if available. None if not. |
`execute_query`  | A Hyper API `result` object. You can iterate over the object to get the information you are interested in. |
`execute_list_query` | A list of rows. (Python only) |
`execute_scalar_query` | The value from one row, one column. |

**SQL command syntax:**

```python
connection.execute_command(command="SQL-statement")
```

Where the *SQL-statement* can be any valid Hyper SQL command. The `execute_command` method returns the row count of the number of rows affected. Be sure to assign the return value to a variable when you call the method. 

**SQL query syntax:**

```python
connection.query_method(query="query_string")
```

Where the *query_string* can be any Hyper SQL query that returns a result type that is valid for the query method. For example, the `execute_query` method returns a `result` object, and the `execute_scalar_query` method executes a scalar query and returns the value from one row, one column. Be sure to assign the result to a variable when you call the query method. In Python, you should also use a `with` construct when you call the query method, so that you can properly close the results object when you are finished. You can also close the result object directly by calling its `close()` method.  


## Constructing Hyper SQL statements

You build SQL statements from the supported [Hyper SQL commands](../reference/sql/sql-commands.html){:target="_blank"}{:ref="noopener"} and pass them as strings to the Hyper API methods for commands and queries. Hyper SQL provides a set of common useful commands to create, select, alter, insert, update, and delete data from the Hyper file. Because the SQL statements are passed to the Hyper API as strings, you need to ensure that identifiers and string values are properly encoded. You can also use variables in constructing statements.

To correctly format identifiers and strings in your SQL statements, you can use `escape_name` and `escape_string_literal`, or `TableName`. Use `escape_name` for identifers, such as fields or tables. Use `escape_string_literal` when you need to use quoted string values. Use `TableName` for the names of tables. For example, if you have a table named `Sales` you could use `{TableName('Sales')}` in the SQL statement.

In Python, you can use formatted string literals (or f-strings). You add an `f` in front of the query string and place expressions in braces `{ }`that will be replaced with their values.

---

## Examples

The following example, shows how you can update values in a table and how to concatenate long SQL statements in a series of strings. The `execute_command` method returns the count of affected rows.

```python
row_count = connection.execute_command(
    command=f"UPDATE {escape_name('Customer')} "
    f"SET {escape_name('Loyalty Reward Points')} = {escape_name('Loyalty Reward Points')} + 50 "
    f"WHERE {escape_name('Segment')} = {escape_string_literal('Corporate')}")
```

The following example, shows how to delete data from a `.hyper` file, and it also shows how to use `escape_name` and `escape_string_literal` for the names of tables, columns, and values.


```python
row_count = connection.execute_command(
    command=f"DELETE FROM {escape_name('Orders')} "
    f"WHERE {escape_name('Customer ID')} = ANY("
    f"SELECT {escape_name('Customer ID')} FROM {escape_name('Customer')} "
    f"WHERE {escape_name('Customer Name')} = {escape_string_literal('Dennis Kane')})")
```

