# Insert Data Directly from CSV Files

Comma-separated values (CSV) are a popular file format  to import and export tabular data from programs. Hyper is able to directly load data into a Hyper table. Using the PostgreSQL-like [COPY FROM](/docs/sql/command/copy_from) command, you can copy the data much faster than you could by iteratively adding the data one row at a time.

```python
from pathlib import Path
from tableauhyperapi import HyperProcess, Telemetry,  Connection, CreateMode, \
    TableDefinition, NOT_NULLABLE, SqlType, escape_string_literal

customer_table = TableDefinition(
    # Since the table name is not prefixed with an explicit schema name, the table will reside in the default "public" namespace.
    table_name="Customer",
    columns=[
        TableDefinition.Column("Customer ID", SqlType.text(), NOT_NULLABLE),
        TableDefinition.Column("Customer Name", SqlType.text(), NOT_NULLABLE),
        TableDefinition.Column("Loyalty Reward Points", SqlType.big_int(), NOT_NULLABLE),
        TableDefinition.Column("Segment", SqlType.text(), NOT_NULLABLE)
    ]
)

path_to_database = Path("customer.hyper")

with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(endpoint=hyper.endpoint,
                    database=path_to_database,
                    create_mode=CreateMode.CREATE_AND_REPLACE,
                    parameters=connection_parameters) as connection:
        connection.catalog.create_table(customer_table)

        # You can find the sample CSV file in https://github.com/tableau/hyper-api-samples/tree/main/Tableau-Supported/Python/data
        path_to_csv = str(Path(__file__).parent / "data" / "customers.csv")

        # Load all rows into the "Customers" table from the CSV file.
        #
        # You might have to adjust the COPY parameters to the format of your specific csv file.
        # The example assumes that your columns are separated with the ',' character
        # and that NULL values are encoded via the string 'NULL'.
        # Also be aware that the `header` option is used in this example:
        # It treats the first line of the csv file as a header and does not import it.
        added_row_count = connection.execute_command(f"""
            COPY {customer_table.table_name} from {escape_string_literal(path_to_csv)}
            WITH (format => 'csv', NULL => 'NULL', delimiter => ',', header => true)
        """)

        print(f"{added_row_count} rows were loaded from the CSV file.")
```

1. Start the `HyperProcess` and connect to the `.hyper` file.

    Just like other extract file operations, anytime you want to work with a `.hyper` extract file, you need to start the `HyperProcess` and then open a connection to create a new file `.hyper`, or to connect to an existing file.

2. Define and create the table to contain the CSV data.

    Before you can copy the data from the CSV file, you need to define the table (columns and data types) and create the table in the connection catalog. Note that the schema *must match* the schema in the CSV file.

3. Issue the `COPY FROM` command.

    The [COPY FROM](../../sql/command/copy_from) command instructs Hyper to
    directly insert data from an external file into a table.
    The `COPY` command's `WITH` clause specifies additional details about the file format: In this case, the CSV file uses a comma as the delimiter and has a header row.

    To construct the SQL command and correctly escape the file path, we use `escape_string_literal`.
    We then use the `execute_command` method to execute the SQL command.
    See [Execute SQL commands](../sql_commands.md) for more information on how to construct and execute SQL commands.

4. Check the return value.

    The `execute_command` method returns the number of rows that were added to the table. You can check this value or log or report it in some fashion. If you are adding multiple tables to the `.hyper` file, you could use the same connection to execute additional COPY commands.