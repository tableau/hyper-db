---
title: Read Data from Hyper Files
---

Using the Hyper API, you can read data from tables in an `.hyper` file by sending SQL queries.

**In this section**

* TOC
{:toc}

---

## Step 1: Connect to the database (.hyper file)

To read data from a file, you first need a connection to the database (the `.hyper` file). Using the connection object, you can send SQL queries.

1. Start the Hyper server (`HyperProcess`). Keep the process running until your application is done reading the data and is finished working with the extract file. Starting and stopping Hyper after each operation takes time and is unnecessary.

2. Open a connection to the database (`.hyper` file). Use the connection object to send queries to read the data. Because you are reading from an existing `.hyper` file, you don't need to specify the `CreateMode` (the default value is `CreateMode.NONE`).

### Example: Connect to database (.hyper file) (Python)

```python

# Start Hyper
with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU ) as hyper:

#  Connect to an existing .hyper file (CreateMode.NONE)
    with Connection(endpoint=hyper.endpoint, database='mydb.hyper') as connection:

        # ... use the connection object to send SQL queries to read data

```

## Step 2: Execute the SQL query using the connection object

The `Connection` class in the Hyper API provides methods for executing SQL statements and queries. The Hyper API provides three methods that are specific to queries. The queries return either a Hyper API `result` object, a list of rows, each row represented by a list of objects, or the value from one row, one column.

| Connection query method  | Returns |
| ---- | ---- |
`execute_query` | A Hyper API `result` object. You can iterate over the object to get the information you are interested in. Be sure to properly close the result object when you are done. You can do this by using a `with` block (recommended) or by calling the result object's `close()` method. |
`execute_list_query` | A list of rows. (Python only) |
`execute_scalar_query` | The value from one row, one column. |

The syntax for these SQL query methods is as follows:


```python

    connection.query_method(query="query_string")

```

Where *query_method* is one of the methods listed in the table. The *query_string* can be any Hyper SQL query that returns a result type that is valid for the query method. For example, the `execute_query` method returns a `result` object, and the `execute_scalar_query` method executes a scalar query and returns the value from one row, one column.

You can use `SELECT ...  FROM ... [table]` statements to retrieve data from a table named `table`. For more information, see [SELECT](..//reference/sql/sql-select.html){:target="_blank"}{:rel="noopener"}. In Python, you can use formatted string literals (or f-strings). You add an `f` in front of the query string and place expressions in `{ }`that will be replaced with their values, for example, `f"SELECT {escape_name('Customer ID')} FROM {escape_name('Customer')}"`.  For more information, see [Formatted string literals](https://docs.python.org/3/reference/lexical_analysis.html#f-strings){:target="_blank"}{:rel="noopener"} in the Python documentation.

If you need to qualify the name of the table (and you should), use the `TableName` class. While you could use the `escape_name` method, it is better to use `TableName` in SQL statements because it correctly quotes and escapes the name of the table, which protects agains SQL injection attacks. 

To get the list of tables in the `.hyper` file, you can use the `connection.catalog.get_table_names()` method. Additionally, you might need to use the connection catalog `get_table_definition` method to identify the names of the tables and their column names (`table_names = connection.catalog.get_table_definition(name=table)`).

For more information about the supported SQL statements, see the [Hyper SQL documentation](../reference/sql/index.html){:target="_blank" rel="noopener"}.

## Example: `execute_query` (Python)

Prints the values in a table, row by row.

```python

with connection.execute_query(query=f"SELECT * FROM {TableName('foo')} ") as result:
    rows = list(result)
    print(rows)

```

The `result` object implements the iterator protocol, so you can use it on the returned object to cycle through the data.

```python

with connection.execute_query('SELECT * FROM foo') as result:
    for row in result:
        print(row)

```

## Example: `execute_query` using an Extract API 2.0 Hyper file (Python)

If you want to read from a `.hyper` file that was created with the Extract API 2.0, you need to specify the fully-qualified name of the table to read from, which includes the schema (or namespace) and the name of the table. The default schema for a `.hyper` file created with the Extract API 2.0 is `Extract`.
For example, to read from a table named **Extract** that is in the `Extract` namespace, you could use a formatted-string literal (f-string) and the `TableName` method to construct the query. 

```python

with connection.execute_query(query=f"SELECT * FROM {TableName("Extract", "Extract")}") as result:
    for row in result:
        print(row)
```

The `execute_query` method returns a `Result` object. Use the `Result` object in a `with` statement (recommended) or call its `close()` method when done.

## Example: `execute_list_query` (Python)

The method returns a list of rows in the table.

```python

rows_in_table = connection.execute_list_query(query=f"SELECT * FROM {TableName('foo')}")
print(rows_in_table)

```

## Example: `execute_scalar_query` (Python)

Find the value of a specific column and row in a table and print that value.

```python

value_in_table = connection.execute_scalar_query(query=f"SELECT value FROM {TableName('foo')} WHERE {escape_name('rowID')} = 12")
print(value_in_table)

```

## Example: `execute_scalar_query` to find maximum value (Python)

Find the maximum value in a column of a table and print its value. 

```python

max_in_table =  connection.execute_scalar_query(query=f"SELECT MAX(value) FROM {TableName('Extract', 'Extract')}") 
print(f"The max value in the table is: {max_in_table}")


```
