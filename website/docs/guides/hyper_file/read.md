# Read Data from Hyper Files

To read data from a `.hyper` file, open a `Connection` to the file and
then use the [SELECT](../../sql/command/select.md) command to retrieve data from the file.

```python
from tableauhyperapi import HyperProcess, Connection, Telemetry, CreateMode, Inserter

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.NONE) as connection:
        # Read all data from the table.
        # But be careful with this! It might be a lot of data and Python
        # might not be able to cope with that much data...
        my_data = connection.execute_list_query("""
            SELECT * FROM "Extract.Extract"
        """)
        print(my_data)

        # Maybe we are only interested in a more specific part of data?
        # If so, use the power of SQL to only retrieve the data you are
        # actually interested in!
        max_in_table =  connection.execute_scalar_query("""
            SELECT MAX(value) FROM "Extract"."Extract
        """)
        print(max_in_table)
```

In general, you can send arbitrarily complex queries against the data in a Hyper file.
More information on the available SQL commands can be found in the [SQL reference](../../sql/).
For more information on how to issue SQL queries from Python (or your preferred language) and how to make programatically craft SQL queries, see the [Executing SQL Commands](../sql_commands) guide.