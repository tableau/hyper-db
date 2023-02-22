---
title: Upgrade from the Extract API 2.0 to the Hyper API
---

If you built an application that used the Extract API 2.0, you can continue to use the application to create and update `.hyper` extract files for Tableau 10.5 and later. However, to take advantage of the performance boost and the new features introduced with the Hyper API, you need to make changes to your application to use the new classes and methods. While there is no direct translation from Extract API 2.0 methods to the Hyper API methods, there are similarities between the two APIs. They both use similar steps to define and populate the tables in the extract. Porting an existing application to the Hyper API should be relatively straight forward. The following table compares the two ways the APIs create `.hyper` files.

---

**In this section**

* TOC
{:toc}

---

# Summary of differences and workflow

| Extract API 2.0   | Hyper API |
| ---- | ---- |
| Include or import the Extract API 2.0 library (`tableausdk`). | Include or import the Hyper API library (`tableauhyperapi`). |
| Initialize the Extract API using the `ExtractAPI.initialize()` method. | Start the `HyperProcess` to start the local Hyper server. |
| Call the `Extract` class constructor and specify the name of the `.hyper` file to create. | Create a `connection` to the Hyper server and name the `.hyper` database file. Set options to create or overwrite the file.|
|  Create a table definition. Call the `TableDefinition` constructor.| Create a `TableDefinition`.  (*Optional*) Create a schema or namespace for the table. For compatibility with tools that use `.hyper` files that were created with the Extract API 2.0, name the schema `Extract` and also name the table `Extract`.  |
| Create the table (`addTable`) | Using the connection `Catalog`, create the table (`connection.catalog.create_table(mytable)`) | 
| Populate the table (`table.insert`)  | Use the `Inserter` to populate the table(s). Or use Hyper SQL commands to add or copy data to the table(s). |
| Close the .hyper file (`.close()`) | Close the connection to the `.hyper` file (`Connection.close()`) |
| Shutdown the Extract API (`ExtractAPI.cleanup()`)   | Shutdown the `HyperProcess`. Use `HyperProcess.close()` or `HyperProcess.shutdown()`.  |



The following two examples show an Extract API 2.0 application that creates a simple extract and the equivalent version that uses the Hyper API.


# Example 1: Extract API 2.0 (Python)

```python

import os
from tableausdk import Exceptions
from tableausdk.HyperExtract import ExtractAPI, Extract, Table, TableDefinition, Row
from tableausdk.Types import Type

# Step 1: initialize the API
ExtractAPI.initialize()

# Step 2: Create the extract file
if os.path.isfile('TrivialExample_eapi2.hyper'):
    os.remove('TrivialExample_eapi2.hyper')

hyper_file = Extract('TrivialExample_eapi2.hyper')

# Step 3: Create the table definition
table_def = TableDefinition()
table_def.addColumn('rowID',  Type.CHAR_STRING )  # column 0
table_def.addColumn('value',  Type.INTEGER )       # column 1

# Step 4: Create the table in the image of the tableDef
table =  hyper_file.addTable('Extract', table_def )

# Step 5: Create some rows and insert them into the table
new_row =  Row(table_def)
for i in range(1,101):
    new_row.setCharString(0, 'Row '+str(i))
    new_row.setLongInteger(1,i)
    table.insert(new_row)

# Step 6: Close the extract file
hyper_file.close()

# Step 7: Shutdown the Extract API
ExtractAPI.cleanup()


```


# Example 2: Hyper API (Python)

The following example creates the equivalent `.hyper` file using the Hyper API. For compatibility with the Extract API 2.0, this example creates a single table named `Extract` in the `Extract` namespace (schema). If no schema is specified, the table is created in the `public` namespace.

```python

from tableauhyperapi import HyperProcess, Connection, \
TableDefinition, SqlType, Telemetry, Inserter, CreateMode, TableName


# Step 1: Start a new private local Hyper instance
with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU, 'myapp' ) as hyper:

# Step 2:  Create the the .hyper file, replace it if it already exists
    with Connection(hyper.endpoint, 'TrivialExample_hyper_schema.hyper', CreateMode.CREATE_AND_REPLACE) as connection:

# Step 3: Create the schema
        connection.catalog.create_schema('Extract')

# Step 4: Create the table definition
        schema = TableDefinition( TableName('Extract','Extract'), [
            TableDefinition.Column('rowID', SqlType.text()),
            TableDefinition.Column('value', SqlType.big_int()),
         ])
# Step 5: Create the table in the connection catalog
        connection.catalog.create_table(schema)

# Step 6: Populate the table with data
        with Inserter(connection, schema) as inserter:
            for i in range (1,101):
                inserter.add_row(
                    [ 'Row '+str(i), i ]
            )
            inserter.execute()
# Step 7: Close the connection (end of "with")
    print("The connection to the Hyper file is closed.")

# Step 8: Shutdown the HyperProcess (end of "with")



```



<!--
```python

from tableauhyperapi import HyperProcess, Connection, TableDefinition, SqlType, Telemetry, Inserter, CreateMode


# Step 1: Start a new private local Hyper instance
with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU, 'myapp' ) as hyper:
# Step 2:  Create the the .hyper file, replace it if it already exists
    with Connection(hyper.endpoint, 'TrivialExample_hyper.hyper', CreateMode.CREATE_AND_REPLACE) as connection:
# Step 3 Create the table definition
        schema = TableDefinition('foo', [
            TableDefinition.Column('rowID', SqlType.text()),
            TableDefinition.Column('value', SqlType.big_int()),
         ])
# Step 4: Create the table in the connection catalog
        connection.catalog.create_table(schema)
# Step 5: Populate the table with data
        with Inserter(connection, schema) as inserter:
            for i in range (1,101):
                inserter.add_row(
                    [ 'Row '+str(i), i ]
            )
            inserter.execute()
# Step 6: Close the connection (end of "with")
    print("The connection to the Hyper file is closed.")

# Step 7: Shutdown the HyperProcess (end of "with")
print("The HyperProcess has shutdown.")

```
-->