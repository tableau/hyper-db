# Insert Data Directly from CSV Files

The comma-separated values (CSV) file is a popular way to import and export tabular data from programs. The Hyper API provides a fast way of directly inserting CSV data into a `.hyper` extract file. Using the PostgreSQL-like [COPY](../reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command, you can copy the data much faster than you could by iteratively adding the data one row at a time.


---

1. Start the `HyperProcess` and connect to the `.hyper` file.

    Just like other extract file operations, anytime you want to work with a `.hyper` extract file, you need to start the `HyperProcess` and then open a connection to create a new file `.hyper`, or to connect to an existing file. In this example, the HyperProcess will send usage data to Tableau. To opt out, set `telemetry` to `Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU`. See [About Usage Data]({{site.baseurl}}/docs/hyper_api_create_update.html#usage-data).

    ```python
    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

        # Creates a new Hyper file or
        # replaces the file if it already exists.
        with Connection(endpoint=hyper.endpoint,
                database=path_to_hyper_file,
                create_mode=CreateMode.CREATE_AND_REPLACE) as connection:
        # ...
    ```

2. Define and create the table to contain the CSV data.

    Before you can copy the data from the CSV file, you need to define the table (columns and data types) and create the table in the connection catalog. Note that the schema *must match* the schema in the CSV file.

    ```python
    customer_table = TableDefinition(
        table_name="Customer",
        columns=[
            TableDefinition.Column("Customer ID", SqlType.text(), NOT_NULLABLE),
            TableDefinition.Column("Customer Name", SqlType.text(), NOT_NULLABLE),
            TableDefinition.Column("Loyalty Reward Points", SqlType.big_int(), NOT_NULLABLE),
            TableDefinition.Column("Segment", SqlType.text(), NOT_NULLABLE)
        ]
    )
    ```

3. Construct the Hyper SQL command to copy from a CSV file.

    To copy data from a CSV file, you use the connection object to send a Hyper SQL command. Note that there is no COPY command in the SQL standard, but Hyper SQL, like PostgreSQL, supports one. The `Connection` class in the Hyper API provides an `execute_command` method. You use this method to send a Hyper SQL command to the Hyper database. The method executes the command and returns the count of affected rows, if any.

    The `execute_command` method takes one parameter, the Hyper SQL command. To copy from a CSV file, you use the [COPY](../reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command. For example, to copy data from a CSV file that uses a comma as the delimiter and has a header row you would use a Hyper SQL statement similar to the following:

    | Syntax |
    |-----|
    | **COPY** *to table* **FROM**  *csv file* (**WITH** **format csv, delimiter ',' , header** [ **,** *options* ]) |

    The **WITH** clause defines the format (CSV), the delimiter, whether or not the CSV file contains a header, and other options, such as what to use to represent NULL values.

    See the Hyper SQL documentation for the [COPY]({{site.baseurl}}/reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command for more information.

4. Check the return value and close the connection to the `.hyper` file.

    The `execute_query` method returns the number of rows that were added to the table. You can check this value or log or report it in some fashion. If you are adding multiple tables to the `.hyper` file, you could use the same connection to the file and execute additional COPY commands using `execute_query`. If you're writing your code in Python, using the `with` statement automatically closes the connection upon exiting.


## Copy data from CSV example

The following code example shows how you can construct the SQL command to copy from a CSV file. The code is from the `create_hyper_file_from_csv.py` [Python example](https://github.com/tableau/hyper-api-samples/blob/main/Tableau-Supported/Python/create_hyper_file_from_csv.py){:target="_blank"}{:ref="noopener"}. For the copy options, the example specifies the NULL value to be the unquoted literal string "NULL". If it is not specified, the default NULL value for a CSV file is an unquoted empty string.

The example refers to the table `customer_table`, which is defined in the example code (see step 2).


```python
# Using path to current file, create a path that locates CSV file packaged with these examples.

# path_to_csv =  "customers.csv"

# Load all rows into "Customers" table from the CSV file.
# `execute_command` executes a SQL statement and returns the impacted row count.
#
# Note:
# You might have to adjust the COPY parameters to the format of your specific csv file.
# The example assumes that your columns are separated with the ',' character
# and that NULL values are encoded via the string 'NULL'.
# Also be aware that the `header` option is used in this example:
# It treats the first line of the csv file as a header and does not import it.
#
# The parameters of the COPY command are documented in the Tableau Hyper SQL documentation
# (https:#help.tableau.com/current/api/hyper_api/en-us/reference/sql/sql-copy.html).
print("Issuing the SQL COPY command to load the csv file into the table. Since the first line")
print("of our csv file contains the column names, we use the `header` option to skip it.")
count_in_customer_table = connection.execute_command(
    command=f"COPY {customer_table.name} from {escape_string_literal(path_to_csv)} with "
        f"(format csv, NULL 'NULL', delimiter ',', header)")
print(f"The number of rows in table {customer_table.name} is {count_in_customer_table}.")
```
