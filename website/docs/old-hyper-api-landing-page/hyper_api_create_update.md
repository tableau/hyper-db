---
title: Create and Update Hyper Files
---

You can use the Hyper API to automate your interactions with Tableau. You can create Tableau `.hyper` files and then insert, delete, update, and read data from those files.
You can then use files as data sources in Tableau. This topic will outline the basic steps for creating and then updating a `.hyper` file.

---

**In this section**

* TOC
{:toc}

---

## Prerequisites

The following instructions assume you have installed the Hyper API and that you can build and run the example code. For more information, see [Install the Hyper API]({{site.baseurl}}/docs/hyper_api_installing.html).

## Basic steps for creating a .hyper file

The following shows the basic workflow for creating a `.hyper` extract file that you can use in Tableau.

<div class="mermaid">
graph TD 
A[Import Hyper API library] -->|Start HyperProcess|B[HyperProcess] 
B-->|Open file|C[.hyper file]
C-->D["Define table(s)"]
D-->E[Create tables]
E-->F[Add data to .hyper]
F-->|Close file|C
C-->|Stop HyperProcess|B
</div>


### 1. Import the Hyper API library

The name of the library will vary depending upon the programming language and client library you are using (for example, the library is `tableauhyperapi` for the Python client library).

```python

from tableauhyperapi import HyperProcess, Telemetry, Connection, CreateMode, NOT_NULLABLE, NULLABLE, \
SqlType, TableDefinition, Inserter, escape_name, escape_string_literal, HyperException, TableName

```

### 2. Start the HyperProcess

This starts up a local Hyper database server (`hyperd`). You should only start one instance of Hyper at a time. And as starting up and shutting down the server takes time, you should keep the process running and only close or shutdown the `HyperProcess` when your application is finished. If you call the `HyperProcess` in a `with` statement (Python), `using` statement (C#), scope (C++), or `try-with-resources` statement (Java), the `hyperd` process will safely shutdown. While the `HyperProcess` is running, however, you can create and connect to as many `.hyper` files as you want.

The `HyperProcess` can be instructed to send telemetry on Hyper API usage to Tableau. To send usage data, set `telemetry` to `Telemetry.SEND_USAGE_DATA_TO_TABLEAU` when you start the process. To opt out, set `telemetry` to `Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU`. See [About Usage Data](#usage-data) for more information.

You can also specify the `user_agent`, this is just an arbitrary string that can be used to identify the application. The `user_agent` will not be sent as part of the telemetry.

By default, Hyper will use the initial default file format version 0. You can deviate from the default file format version via the `default_database_version` parameter. To learn more about the available versions and product support, see [Hyper Process Settings]({{site.baseurl}}/reference/sql/databasesettings.html#DEFAULT_DATABASE_VERSION).

```python

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

```

<div class="alert alert-info">
    <p><b>About Usage Data</b></p>
    <p>To help us improve Tableau, you can share usage data with us. Tableau collects data that helps us learn how our products are being used so we can improve existing features and develop new ones. All usage data is collected and handled according to the <a href="https://tableau.com/privacy" target="_blank"> Tableau Privacy Policy</a>.
    </p>
</div>

### 3. Open a connection to the .hyper file

Use the `connection` object to connect to and specify the name of the `.hyper` file (also known as the database file). You can create as many `connection` objects and can connect to as many `.hyper` files as you need to, provided that there is only one connection to a `.hyper` file. You can also set other options, for example, to overwrite the file if it exists. The `Connection` constructor requires a `HyperProcess` instance to connect to. If your application creates multiple connections, each connection can use the same `HyperProcess` instance. 

In the following example, the code snippet assumes that we have started an instance of the `HyperProcess` as `hyper`, so we can connect to the `hyper.endpoint`. The `CreateMode` specifies that we want to do if the `.hyper` file already exists. In this case, we want to create the file (`TrivialExample.hyper`) if it doesn't exist and replace it (overwrite it) if it does (`CreateMode.CREATE_AND_REPLACE`). If you just want to update or modify an existing file, you would choose `CreateMode.NONE`.

If you create the connection using a **with** statement (in Python), when the **with** statement ends, the connection closes.
The **with** construct means we don't have to call `connection.close()` explicitly. You should always close the connection when your application is finished interacting with the `.hyper` file.

```python

with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.CREATE_AND_REPLACE) as connection:

```

<div class="alert alert-info">
    <b>Important:</b> When you open a connection to a <code>.hyper</code> file and while the connection remains open, no other process can use the file. That is, while your application is connected to the <code>.hyper</code> file, it has exclusive access: no other instance of Hyper can connect to the file. That means, you can't open the file using the Hyper API and have the file open in Tableau at the same time.
</div>
 


### 4. Define the table(s)

Create the table definition(s) using `TableDefinition` method and name the table.

You can create a named schema (or namespace) in the database to help organize and differentiate tables. You can use `connection.catalog.create_schema()` method or the SQL `CREATE SCHEMA` command to create and name the schema. If you do not specify a schema, the default schema name is `public`. To work with tables in the `public` space, you only need to specify the name of the table. If you are working with `.hyper` files that were created by applications that use the Extract API 2.0, the default schema is named `Extract`; for those files you need to specify the schema and the name of the table. To specify the schema when you define the table, or when you want to interact with the table and need to pass the name of the table as an argument, use the fully-qualified name. For example, for a `.hyper` file created with the Extract API 2.0, you might use `TableName('Extract', 'Extract')` as an argument when you want to update that existing table. If you want to create a new table named `Extract` in the `Extract` namespace (`Extract.Extract`), you need to create the `Extract` schema before you define the table, as shown in the following example.
```python

connection.catalog.create_schema('Extract')

example_table = TableDefinition( TableName('Extract','Extract'), [
    TableDefinition.Column('rowID', SqlType.big_int()),
    TableDefinition.Column('value', SqlType.big_int()),
])

```


### 5. Create the table(s)

You create a table using the connection `catalog`. The catalog is responsible for the metadata about the extract (database) file. You can use the catalog to query the database. For example, the following Python code creates the catalog for the table we defined in the previous step (`example_table`):

```python

connection.catalog.create_table(example_table)

```

### 6. Add data to the table(s)

Populate the table using the `Inserter` or use SQL commands to copy or add data.

```python

with Inserter(connection, example_table) as inserter:
    for i in range (1, 101):
        inserter.add_row(
            [ i, i ]
        )
    inserter.execute()

```

You don't need to manually buffer the data you are adding with the `Inserter`, as this handled for you.



### 7. Close the connection and shutdown the HyperProcess

When your application is finished populating the extract file with data, you first close the connection you opened to the database (the `.hyper` file) and shutdown the `HyperProcess`. As discussed in Step 2, if you use the Python `with` construct to start the process and open the connection, you don't need to explicitly shutdown the server (`hyperd`) or close the connection.


## Example: Creating an extract (Python)

The following example creates a simple extract file with a single table. For compatibility with the Extract API 2.0, this example creates a table called `Extract` that uses the schema named `Extract`. 

```python

from tableauhyperapi import Connection, HyperProcess, SqlType, TableDefinition, \
    escape_string_literal, escape_name, NOT_NULLABLE, Telemetry, Inserter, CreateMode, TableName

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    print("The HyperProcess has started.")

    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.CREATE_AND_REPLACE) as connection:
        print("The connection to the Hyper file is open.")
        connection.catalog.create_schema('Extract')
        example_table = TableDefinition(TableName('Extract','Extract'), [
            TableDefinition.Column('rowID', SqlType.big_int()),
            TableDefinition.Column('value', SqlType.big_int()),
         ])
        print("The table is defined.")
        connection.catalog.create_table(example_table)
        with Inserter(connection, example_table) as inserter:
            for i in range (1, 101):
                inserter.add_row(
                    [ i, i ]
            )
            inserter.execute()
        print("The data was added to the table.")
    print("The connection to the Hyper extract file is closed.")
print("The HyperProcess has shut down.")

```

## Update an existing extract file

The workflow for updating an existing extract is similar to the workflow for the basic creation of an extract. You still need to start the `HyperProcess`. The main difference is that with the `Connection` object you just need to specify the name of the `.hyper` file. So that you don't clobber the file, set `CreateMode` to `NONE` or don't specify a `CreateMode` option when you create the connection. If left unspecified, `CreateMode.NONE` is used. The file is not created, only the connection to the file is made.

1. Start the `HyperProcess`.

2. Connect to the database (`.hyper` file) using the `Connection` object.

3. Append, insert, or update data in the table(s).

If you are working with `.hyper` files that were created by applications that use the Extract API 2.0, you need to specify the schema (`Extract`) and the name of the table. The default table is also named `Extract`. Use the `TableName` method, for example, `TableName('Extract', 'Extract')` as an argument to specify the fully-qualified name of the table (`Extract.Extract`).

## Example: Updating an extract (Python)

The following example appends a row to an existing table within an extract file.

```python

from tableauhyperapi import Connection, HyperProcess, SqlType, TableDefinition, \
    escape_string_literal, escape_name, NOT_NULLABLE, Telemetry, Inserter, CreateMode, TableName

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    print("The HyperProcess has started.")
    with Connection(hyper.endpoint, 'TrivialExample.hyper', CreateMode.NONE) as connection:
        print("The connection to the .hyper file is open.")
        with Inserter(connection, TableName('Extract','Extract')) as inserter:
            inserter.add_row([101, 101])
            inserter.add_row([102, 102])
            inserter.execute()
        print("The data in table \"Extract\" has been updated.")
    print("The connection to the Hyper file is closed.")
print("The HyperProcess has shutdown.")

```
