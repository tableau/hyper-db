# Create and Update Hyper Files

Hyper stores its tables in `.hyper` files. Using Hyper API, you can create `.hyper` files and then insert, delete, update, and read data from those files.
You can then use `.hyper` files as data sources in Tableau, across the whole family of Tableau offerings (Tableau Desktop, Tableau Cloud, Tableau Prep, ...).
Thereby, putting your data into a `.hyper` file is a good way to prepare your data for analyzing it with Tableau.

This guide will outline the basic steps for creating and updating data within a `.hyper` file.

:::tip Use Pandas to Load Your Data
While this guide shows you the most versatile way to load your data, using the [integration with the pandas data framework](../pandas_integration.md#loading-data-through-pandas) might get you to your goal more quickly.
:::

## Creating a Hyper File

The following script creates a simple Hyper file with a single table:

```python
from tableauhyperapi import HyperProcess, Connection, Telemetry, CreateMode, \
    TableDefinition, TableName, SqlType, Inserter

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU,
            parameters = {"default_database_version": "2"}) as hyper:
    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.CREATE_AND_REPLACE) as connection:
        # Create an `Extract` table inside an `Extract` schema
        connection.catalog.create_schema('Extract')
        example_table = TableDefinition(TableName('Extract','Extract'), [
            TableDefinition.Column('rowID', SqlType.big_int()),
            TableDefinition.Column('value', SqlType.big_int()),
        ])
        connection.catalog.create_table(example_table)

        # Insert data using the `Inserter` class
        with Inserter(connection, example_table) as inserter:
            for i in range (1, 101):
                inserter.add_row(
                    [ i, i ]
            )
            inserter.execute()
```

The script consist of 3 high-level steps:

1. Start a Hyper process. The [`HyperProcess`](../../hyper-api/hyper_process)
2. Create a connection to the `.hyper` file. Since we create the [`Connection` class](../../hyper-api/connection) class with the `CreateMode.CREATE_AND_REPLACE`, the `.hyper` will be automatically created if doesn't exist yet, and will be overwritten if a file with that name already exists.
3. Defining the table. In this case, we are using the Python utilities `TableDefinition` and `catalog.create_table`. We could have also used a [CREATE TABLE](../../sql/command/create_table) SQL command.
4. Insert the data. In the example, we use the `Inserter` utility to provide the data from Python. You can also use [INSERT](../../sql/command/insert) or [COPY](../../sql/command/copy_from) statements or any other means to load data into the table. E.g., you can thereby directly load your table from a CSV file.

#### File Format Versions

By default, Hyper will use the initial default file format version 0.
We recommend to use a more recent file format version, as shown in the example.
In general, all reasonably up-to-date versions of Tableau should be able to read file format version 2, but if you are still using (very) outdated Tableau products, you might want to use file format 0 instead
To learn more about the available versions and product support, see the [Hyper Process Settings](../../hyper-api/hyper_process#default_database_version).

## Update an existing extract file

The workflow for updating an existing extract is similar to the workflow for the basic creation of an extract.

1. Start the `HyperProcess`.
2. Connect to the database (`.hyper` file) using the `Connection` object.
3. Append, insert, or update data in the table(s).

The main difference when connecting is that you use `CreateMode.NONE` instead of `CreateMode.CREATE_AND_REPLACE`.
By using `CreateMode.NONE`, Hyper will connect to a pre-existing file instead of recreating a new, empty file.
Since the default for `CreateMode` is `NONE`, you can also just leave this parameter out completely.

You can then use SQL commands ([INSERT](../../sql/command/insert), [UPDATE](../../sql/command/update), [DELETE](../../sql/command/delete), [COPY](../../sql/command/copy_from), ...) or the `Inserter` utility class to change the data in the table.
You could also create new tables or drop existing tables.

The following example removes rows with a `value < 50` and appends two new row to an existing table within an extract file:

```python
from tableauhyperapi import HyperProcess, Connection, Telemetry, CreateMode, Inserter

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.NONE) as connection:
        # Delete every row where `value < 50`
        connection.execute_command("""
            DELETE FROM "Extract"."Extract" WHERE value < 50
        """)

        # Insert two new rows
        with Inserter(connection, TableName('Extract','Extract')) as inserter:
            inserter.add_row([101, 101])
            inserter.add_row([102, 102])
            inserter.execute()
```
