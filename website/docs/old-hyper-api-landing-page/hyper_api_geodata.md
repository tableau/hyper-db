---
title: Add Spatial Data to a Hyper File
---
Tableau supports spatial data (geography) in `.hyper` files. However the Hyper API does not directly accept Well-Known-Text for spatial data. Instead you need to provide a `CAST("column_as_text" AS GEOGRAPHY)` expression in the inserter to provide the spatial data as `text` strings. Hyper API's inserter pushes the `CAST("column_as_text" AS GEOGRAPHY)` expression down to Hyper where the `text` strings are converted to spatial data.

<div class="alert alert-info" > <b>Tip: </b>
The procedure explained here is for Hyper API v0.0.10309 and later. To add geographic data to a Hyper file using temporary tables, a solution used for previous versions of the Hyper API, see <a href="https://help.tableau.com/current/api/hyper_api/en-us/docs/hyper_api_geodata_temp_table.html">Legacy Method - Add Spatial Data to a Hyper File</a>.
</div>

This topic describes how you can use the Hyper API to add geography type data to the Hyper file.

---

**In this section**

* TOC
{:toc}

---

## Overview of inserting spatial data to a hyper file

The basic process for adding spatial data involves defining your inputs to Hyper APIs inserter and specifying how to convert the text strings to geography types using Hyper SQL expressions. Hyper APIs inserter pushes the expression down to Hyper to convert text string to spatial data on the fly during insertion

When you add the text strings into the Hyper file, the text must be in the Well-Known-Text (WKT) format for geography data. The WKT is defined by the Open GIS Consortium, Inc, in the [*OpenGIS Simple Features Specification For SQL*](https://www.opengeospatial.org/standards/sfa){:target="_blank"}{:ref="noopener"}. The types include **Point**, **MultiPoint**, **LineString**, **MultiLineString**, **Polygon**, and **MultiPolygon**.

## Create tables for text and spatial data

1. Define and create a table in the `.hyper` file to contain the `SqlType.geography()` data. This is the table that you will use in Tableau. For example, the following Python code snippet creates a table to hold location data. The table is called `Extract` and is in the `Extract` namespace (or schema) similar to Hyper files created with Tableau.

    ```python

        connection.catalog.create_schema('Extract')
        geo_table = TableDefinition(TableName('Extract','Extract'), [
            TableDefinition.Column('Name', SqlType.text(), nullability=NOT_NULLABLE),
            TableDefinition.Column('Location',  SqlType.geography(), nullability=NOT_NULLABLE),
         ])

        connection.catalog.create_table(geo_table)

    ```

2. Define your inputs to the inserter as a List of `TableDefinition.Column` . This definition will be similar to the TableDefinition of `Extract` table created before except that the columns with `SqlType.geography()` will be specified as `SqlType.text()` type

    ```python
     # Inserter definition contains the column definition for the values that are inserted
     # The data input has two text values Name and Location_as_text
     inserter_definition = [
         TableDefinition.Column(name='Name', type=SqlType.text(), nullability=NOT_NULLABLE),
         TableDefinition.Column(name='Location_as_text', type=SqlType.text(), nullability=NOT_NULLABLE)]

    ```

3. Specify the conversion of `SqlType.text()` to `SqlType.geography()` using `CAST` expression in `Inserter.ColumnMapping`. Specify all columns into which data is inserter in `Inserter.ColumnMapping` list. For columns that do not require any transformations provide only the names

    ```python
        column_mappings = [
            'Name',
            Inserter.ColumnMapping('Location', f'CAST({escape_name("Location_as_text")} AS GEOGRAPHY)')
        ]
    ```


## Insert the spatial data as text (WKT) into the text table

When you add the text data to the Hyper file, the text must be in the Well Known Text Format (WKT) format for geography data, such as Point, Polygon, etc. For example, to specify location data, you would use `point(Longitude Latitude)`.

The following Python code example inserts two rows of data with location information into a table that is defined to hold geography data.

```python

    data_to_insert = [
        [ 'Seattle', "point(-122.338083 47.647528)" ],
        [ 'Munich' , "point(11.584329 48.139257)"   ]
    ]

    with Inserter(connection, geo_table, column_mappings, inserter_definition = inserter_definition) as inserter:
        inserter.add_rows(rows=data_to_insert)
        inserter.execute()

```

Note if you have WKT data in a comma-separated value (CSV) file, you can use the [COPY](../reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command to insert the data from a CSV file. The command automatically converts the WKT strings to the geography data type. For more information, see the [Example code using copy from CSV](#example-code-using-copy-from-csv) and the Help topic [Insert Data Directly from CSV Files]({{site.baseurl}}/docs/hyper_api_insert_csv.html) and the CSV sample on GitHub, [hyper-api-samples](https://github.com/tableau/hyper-api-samples){:target="_blank"}{:ref="noopener"}.

## Example code using the Inserter

The following example Python code illustrates how you can create a `.hyper` file that contains location (`geography`) information by using expressions in the Inserter.


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
            TableDefinition.Column('Name', SqlType.text(), nullability=NOT_NULLABLE),
            TableDefinition.Column('Location',  SqlType.geography(), nullability=NOT_NULLABLE),
         ])
        print("The geo_table is defined.")
        connection.catalog.create_table(geo_table)

        # Inserter definition contains the column definition for the values that are inserted
        # The data input has two text values Name and Location_as_text
        inserter_definition = [
            TableDefinition.Column(name='Name', type=SqlType.text(), nullability=NOT_NULLABLE),
            TableDefinition.Column(name='Location_as_text', type=SqlType.text(), nullability=NOT_NULLABLE)]

        # Column 'Name' is inserted into "Extract"."Extract" as-is.
        # Column 'Location' in "Extract"."Extract" of geography type is computed from Column 'Location_as_text' of text type
        # using the expression 'CAST("Location_as_text") AS GEOGRAPHY'.
        # Inserter.ColumnMapping is used for mapping the CAST expression to Column 'Location'.
        column_mappings = [
            'Name',
            Inserter.ColumnMapping('Location', f'CAST({escape_name("Location_as_text")} AS GEOGRAPHY)')
        ]

    # Format the data as well-known text (WKT)
        data_to_insert = [
        [ 'Seattle', "point(-122.338083 47.647528)" ],
        [ 'Munich' , "point(11.584329 48.139257)"  ]
        ]

        # Insert data into "Extract"."Extract" table with CAST expression.
        with Inserter(connection, geo_table, column_mappings, inserter_definition = inserter_definition) as inserter:
            inserter.add_rows(rows=data_to_insert)
            inserter.execute()
        print("The data was added to the table.")

    print("The connection to the Hyper extract file is closed.")
print("The HyperProcess has shut down.")

```

## Example code using copy from CSV

When you copy the text data from a CSV file to the Hyper file, the text data is converted to geography data. Just as with the Inserter, the data must be in the Well Known Text Format (WKT) format for geography data, such as Point, Polygon, etc. For example, to specify location data, you would use `point(Longitude Latitude)`.

The following Python code example copies two rows of data from a CSV file into a table that is defined to hold geography data. The location data is in a CSV file (`locations.csv`) that looks like the following:

### locations.csv

```cs
Name, Location
Seattle, point(-122.338083 47.647528)
Munich , point(11.584329 48.139257)

```

```python

from tableauhyperapi import Connection, HyperProcess, SqlType, TableDefinition, \
    escape_string_literal, escape_name, NOT_NULLABLE, Telemetry, Inserter, CreateMode, TableName

# CSV file that contains, 
path_to_csv =  "locations.csv"

with HyperProcess(Telemetry.SEND_USAGE_DATA_TO_TABLEAU, 'myapp' ) as hyper:
    print("The HyperProcess has started.")

    with Connection(hyper.endpoint, 'TrivialExample_geo_csv.hyper', CreateMode.CREATE_AND_REPLACE) as connection:
        print("The connection to the Hyper file is open.")

    # create geography table
        connection.catalog.create_schema('Extract')
        geo_table = TableDefinition(TableName('Extract','Extract'), [  
            TableDefinition.Column('Name', SqlType.text(), nullability=NOT_NULLABLE),
            TableDefinition.Column('Location',  SqlType.geography(), nullability=NOT_NULLABLE)])
        print("The geo_table is defined.")
        connection.catalog.create_table(geo_table)

        # Load all rows into the geo_table from the CSV file.
        # `execute_command` executes a SQL statement and returns the impacted row count.
        count_in_geo_table = connection.execute_command(
             command=f"COPY {geo_table.table_name} from {escape_string_literal(path_to_csv)} with "
             f"(format csv, NULL 'NULL', delimiter ',', header)")
        print(f"The number of rows in table {geo_table.table_name} is {count_in_geo_table}.")

    print("The connection to the Hyper extract file is closed.")
print("The HyperProcess has shut down.")

```