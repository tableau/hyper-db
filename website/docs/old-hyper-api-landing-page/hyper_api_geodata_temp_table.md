---
title: Legacy Method - Add Spatial Data to a Hyper File
---


<div class="alert alert-info" > <b>Important: </b>
 This is the legacy method that uses a temporary table and is not recommended if you are using the current release of the Hyper API (version 0.0.10309 or later). For information about the preferred method, see <a href="https://help.tableau.com/current/api/hyper_api/en-us/docs/hyper_api_geodata.html">Add Spatial Data to a Hyper File</a>.
</div>


Tableau supports geographical data in `.hyper` files. In the Hyper API version 0.0.1002 and earlier, the Hyper API does not implement the direct insertion of spatial data. If you are using the earlier versions of the Hyper API, to insert spatial data, you first need to copy or insert the spatial data as `text` strings. You can then convert the text strings to `geography` types inside the Hyper file using Hyper SQL commands.

This topic describes how you can use the Hyper API and Hyper SQL to add geography type data to the Hyper file if you are using version 0.0.1002 of the Hyper API or earlier.

---

**In this section**

* TOC
{:toc}

---

## Overview of the workaround to insert spatial data

The basic process for adding spatial data consists of two parts. The first step is to put the geographical data into the `.hyper` file in text strings. The second step is to convert the text strings to `geography` types inside the file using Hyper SQL commands.

When you add the text strings into the Hyper file, the text must be in the Well-Known-Text (WKT) format for geography type data. The WKT is defined by the Open GIS Consortium, Inc, in the [*OpenGIS Simple Features Specification For SQL*](https://www.opengeospatial.org/standards/sfa){:target="_blank"}{:ref="noopener"}. The types include **Point**, **MultiPoint**, **LineString**, **MultiLineString**, **Polygon**, and **MultiPolygon**.

## Create tables for text and spatial data

1. Define and create a table in the `.hyper` file to contain the `SqlType.geography()` data. This is the table that you will use in Tableau. For example, the following Python code snippet creates a table to hold location data. The table is called `Extract` and is in the `Extract` namespace (or schema) for compatibility with Hyper files created with Tableau.


    ```python

        connection.catalog.create_schema('Extract')
        geo_table = TableDefinition(TableName('Extract','Extract'), [
            TableDefinition.Column('Name', SqlType.text()),
            TableDefinition.Column('Location',  SqlType.geography()),
         ])

        connection.catalog.create_table(geo_table)

    ```

2. Define and create a temporary table in the `.hyper` file to hold the geography data as text. This table will contain the text in WKT format. For example, the following Python code creates a table called `Extract.Text`. That is, it creates a table called `Text` in the `Extract` namespace. Both tables use the same names for columns, however, the temporary table defines the `Location` column as containing `SqlType.text()` instead of `SqlType.geography()`. 

    ```python

        text_table = TableDefinition(TableName('Extract','Text'), [
            TableDefinition.Column('Name', SqlType.text()),
            TableDefinition.Column('Location',  SqlType.text()),
        ])

        connection.catalog.create_table(text_table)

    ```

Alternatively, you could create a temporary table for text values using the Hyper SQL `CREATE TEMPORARY TABLE` command. If you use that approach, you also need to populate the table using Hyper SQL commands (for example, `INSERT`, or `COPY`). The advantage of this method is that you do not need to remove (`DROP`) the temporary table when you are finished.

## Insert the spatial data as text (WKT) into the text table

When you add the text data to the Hyper file, the text must be in the Well Known Text Format (WKT) format for geography type data, such as Point, Polygon, etc. For example, to specify location data, you would use `point(Longitude Latitude)`.

The following Python code example inserts two rows of data with location information into a table that is defined to hold text data.

```python

    data_to_insert = [
        [ 'Seattle', "point(-122.338083 47.647528)" ],
        [ 'Munich' , "point(11.584329 48.139257)"   ]
    ]


    with Inserter(connection, text_table) as inserter:
        inserter.add_rows(rows=data_to_insert)
        inserter.execute()

```

Note if you have WKT data in a comma-separated value (CSV) file, you can use the [COPY](../reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command to insert the data from a CSV file. The command automatically converts the WKT strings to the geography data type. For more information, see the Help topic [Insert Data Directly from CSV Files]({{site.baseurl}}/docs/hyper_api_insert_csv.html) and the CSV sample on GitHub, [hyper-api-samples](https://github.com/tableau/hyper-api-samples){:target="_blank"}{:ref="noopener"}.


## Insert the text data into the spatial table using Hyper SQL

After you have created and populated the text table, you can insert the contents of that table into the spatial table you defined earlier.  You can do this with the Hyper API `execute_command` method and the Hyper SQL `INSERT INTO` statement. Inserting the text as WKT into the spatial table converts the text into the `geography` type that Tableau understands.

The following example copies the `Name` and `Location` fields from a text table (`text_table`) into a spatial table (`geo_table`). The `SELECT` clause specifies the names of the columns you are copying from and should match the names of the columns you defined for the spatial table. 

```python

    rows_count = connection.execute_command(command=f"INSERT INTO {geo_table.table_name} SELECT {escape_name('Name')}, {escape_name('Location')} FROM {text_table.table_name};")

```

Alternatively, you can just use the wildcard `*` to select all columns.

```python

    rows_count = connection.execute_command(command=f"INSERT INTO {geo_table.table_name} SELECT * FROM {text_table.table_name};")

```


## Drop (delete) the temporary table

After you copy the text table into the spatial table, you no longer need the text table. At this point, you can safely remove the temporary text table, as keeping it in `.hyper` file might lead to confusion. For compatibility with Hyper files created by Tableau, you might want to have a single table called `Extract.Extract`.

You can delete the temporary text table from the `.hyper` file using the Hyper SQL `DROP` command.

```python

    rows_count = connection.execute_command(command=f"DROP TABLE {text_table.table_name};")


```


## Complete example code (Python)

The following example code illustrates how you can create a `.hyper` file that contains location (`geography`) information by using a temporary text table.


```python

from tableauhyperapi import Connection, HyperProcess, SqlType, TableDefinition, \
    escape_string_literal, escape_name, NOT_NULLABLE, Telemetry, Inserter, CreateMode, TableName


with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU, 'myapp' ) as hyper:
    print("The HyperProcess has started.")

    with Connection(hyper.endpoint, 'TrivialExample_geo.hyper', CreateMode.CREATE_AND_REPLACE) as connection:
        print("The connection to the Hyper file is open.")

    # create geography table
        connection.catalog.create_schema('Extract')
        geo_table = TableDefinition(TableName('Extract','Extract'), [
            TableDefinition.Column('name', SqlType.text()),
            TableDefinition.Column('Location',  SqlType.geography()),
         ])
        print("The geo_table is defined.")
        connection.catalog.create_table(geo_table)

    # Create a temporary text table
        text_table = TableDefinition(TableName('Extract','Text'), [
            TableDefinition.Column('Name', SqlType.text()),
            TableDefinition.Column('Location',  SqlType.text()),
         ])
        print("The text_table is defined.")
        connection.catalog.create_table(text_table)

    # Format the data as well-known text (WKT)
        data_to_insert = [
        [ 'Seattle', "point(-122.338083 47.647528)" ],
        [ 'Munich' , "point(11.584329 48.139257)"  ]
        ]


        with Inserter(connection, text_table) as inserter:
            inserter.add_rows(rows=data_to_insert)
            inserter.execute()
        print("The data was added to the table.")

    # Use SQL to cast the text to geography while copying from the text table to the geography table
        rows_count = connection.execute_command(command=f"INSERT INTO {geo_table.table_name} SELECT * FROM {text_table.table_name};")

    # Drop the text table. It is no longer needed.
        rows_count = connection.execute_command(command=f"DROP TABLE {text_table.table_name};")

    print("The connection to the Hyper extract file is closed.")
print("The HyperProcess has shut down.")

```
