# Hyper API Examples

The best way to learn how to use the Hyper API is to look at the sample code.
The Hyper API provides samples in your programming language of choice that create extract files and then show how you can read, insert, update, and delete data from the files.

:::tip

Sample code using the Hyper API is also available separately on GitHub, see <a href="https://github.com/tableau/hyper-api-samples">Hyper API Samples</a>.

:::


When you download the Hyper API for your programming language, you can find the example code in the `examples` folder. We recommend the following steps:

1. Download the Hyper API `.zip` file from [our download page](download) for your programming language and platform of choice.

2. Examine the source code in the `examples` folder.

3. Build the examples. For information about building and running the the samples, follow the instructions for your programming language of choice, see [Install the Hyper API](installing).

4. Use the example code as a starting point for your own applications.


:::tip

For basic information about creating <code>.hyper</code> files using the Hyper API and Python, see <a href="https://help.tableau.com/current/api/hyper_api/en-us/docs/hyper_api_create_update.html">Create and Update Hyper Files</a>.

:::

---

## Examples


* **create_hyper_file_from_csv**

    Demonstrates how you can use the Hyper SQL [COPY]({{site.baseurl}}/reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command to quickly populate a table in the `.hyper` file from the contents of a comma-separated value (CSV) file. This technique is the fastest way to bring data into an extract, as Hyper is reading data directly from the CSV file.
    
* **delete_data_from_existing_hyper_file**

   Demonstrates how you can use the Hyper SQL [DELETE]({{site.baseurl}}/reference/sql/sql-delete.html){:target="_blank"}{:ref="noopener"} command to remove data from a table in the `.hyper` file.

* **insert_data_into_multiple_tables**

    This example shows how you can create and insert data into a `.hyper` file that contains multiple tables. Uses the `Inserter` class to add data to the tables and a Hyper SQL query to report the number of rows in the tables.

* **insert_data_into_single_table**
    
    Demonstrates how you to add data to a single table named `Extract` that uses the `Extract` schema. Uses the `Inserter` class to add data to the table and a Hyper SQL query to report the number of rows in the table.

* **read_and_print_data_from_existing_hyper_file**

    Demonstrates how to read data from an existing `.hyper` file and print the output to the console.

* **update_data_in_existing_hyper_file**

    This example demonstrates how you can use the Hyper SQL [UPDATE]({{site.baseurl}}/reference/sql/sql-update.html){:target="_blank"}{:ref="noopener"} command to change values in a `.hyper` file.

* **insert_spatial_data_to_a_hyper_file**

    This example demonstrates how to insert spatial data (WKT) to a `.hyper` file

* **insert_data_using_expressions**

    This examples shows how you can use SQL expressions in Hyper API Inserter to transform or compute data on the fly during data insertion
