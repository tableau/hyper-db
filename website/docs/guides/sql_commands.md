# Execute SQL Commands

Hyper API is a wrapper around Hyper, a full-fledged SQL database.
As such, you can use SQL queries and commands to interact with Hyper:

```python
from tableauhyperapi import HyperProcess, Telemetry, Connection

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(endpoint=hyper.endpoint) as connection:
        connection.execute_command("""
            CREATE TEMPORARY TABLE animals(name, legs) AS VALUES
                ('dog', 4),
                ('cat', 4),
                ('bird', 2),
                ('cangaroo', 2),
                ('centipede', 100)
            """)

        with connection.execute_query("SELECT name FROM animals") as results:
            for row in results
                print(row)

        bipeds = connection.execute_list_query(
            "SELECT name FROM animals WHERE legs = 2")
        print(bipeds)

        max_legs = connection.execute_scalar_query(
            "SELECT MAX(legs) FROM animals")
        print("max legs: ", max_legs)
```

First, we need to start a Hyper process and connect to it.
The [`HyperProcess`](../hyper-api/hyper_process.md) and the `Connection` class handle those two aspects for us.
Using the connection object, we can then send SQL commands and SQL queries to Hyper.

### Functions for executing SQL queries {#query-functions}

The Connection class provides methods for executing SQL statements and queries.
There is one method for SQL commands, and three methods for queries which differ primarily in their return value:

| Method   | Returns |
| ---- | ---- |
`execute_command` | The count of affected rows, if available. None if not. |
`execute_query`  | A Hyper API `result` object. You can iterate over the returned rows using this object. |
`execute_list_query` | A list of rows. (Python only) |
`execute_scalar_query` | The value from one row, one column. |

`execute_command` is meant to be used for SQL commands like
[CREATE TABLE](../sql/command/create_table), [COPY FROM](../sql/command/copy_from),
[INSERT](../sql/command/insert), [UPDATE](../sql/command/update),
[DELETE](../sql/command/delete) etc., all of which don't produce any
result tuples but instead are executed because we are interested in their
side effects. `execute_command` returns the number of rows affected by the
command.
The different `execute_query` variants are meant for SQL queries,
i.e. SQL statements that return actual tuples.

`execute_query` is the most versatile among the query functions:
Through the returned `result` object, you can access both the result rows
as well as metadata about the query result, such as the names and
data types of the returned columns.
To access the result rows, simply iterate over the result object using
a `for` loop.
Make sure to close the `result` object when it is no longer needed.
In Python, this can be ensured by using a `with` block.

`execute_list_query` is a convenience method which reads the complete
result of a query into a Python list.

`execute_scalar_query` is a convenience method meant for queries which
return exactly one row consisting of a single column, and returns
that single result value.

## Constructing Hyper SQL statements {#escapings}

Using Hyper SQL you can, e.g., insert, update, and delete data from tables, import data from
Parquet files or pose arbitrarily complex analytical queries.
For a reference documentation of the supported commands, see [Hyper SQL commands](/docs/sql/command/).

Because the SQL statements are passed to the Hyper API as strings, you need to ensure that
identifiers and string values are properly encoded.
As long as you are using hardcoding your query strings, this won't be a problem.
You can simply make sure that your query is correctly written:

```python
max_legs = connection.execute_scalar_query("SELECT MAX(legs) FROM animals")
```

You can use the full power of Python (or your preferred client language) to
construct your SQL strings. E.g., in Python, formatted string literals
(or "f-strings") are a very useful tool to build SQL commands:

```python
# Create 10 tables, just for fun...
for id in range(0, 10):
    connection.execute_command(f"""
    CREATE TEMPORARY TABLE test_table_{id}(my_column int);
    """)
```

However, you must be careful to correctly escape your names and strings.
E.g., the following code will not work

```python
table_name = "Guest Names"
value = "Francisco Eduardo"
# This will send an invalid command to Hyper
connection.execute_command(f"INSERT INTO {table_name} VALUES({value})")
```

because the SQL command sent to Hyper would be

```
INSERT INTO Guest Names VALUES(Francisco Eduardo)
```

which is incorrect. The correct query would be

```
INSERT INTO "Guest Names" VALUES('Francisco Eduardo')
```

The table name must be in double quotes and the string constant in single quotes.

Escaping for identifiers and strings is documented in [General Syntax](../sql/syntax.md).
Instead of reimplementing those escaping rules by yourself, you can use the `escape_name`
and `escape_string_literal` functions to correctly format identifiers and strings in
your SQL statements.
Use `escape_name` for identifers, such as column or table names.
Use `escape_string_literal` when you need to use quoted string values.
Furthermore, the utility classes `TableName` etc. are automatically escaped correctly when
formatted as a string.

For example, if you have a table named `Customers` you could use `{TableName('Customers')}` in the SQL statement.

```python
table = TableName("Customers")
for name in ["Dennis Kane", "Dorothe Hagen"]:
    row_count = connection.execute_command(f"""
        DELETE FROM {table}
        WHERE "Name" = {escape_string_literal(name)}
        """)
```