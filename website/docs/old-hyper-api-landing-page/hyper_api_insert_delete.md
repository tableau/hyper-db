---
title: Insert, Update, and Delete Data from a Hyper File
---


Using the Hyper API, you can read, insert, update, and delete data from tables in an `.hyper` file by sending [SQL commands](../reference/sql/sql-commands.html){:target="_blank"}{:ref="noopener"} and queries, and by using the `Inserter` class to add rows to a table.


**In this section**

* TOC
{:toc}

---



## Insert data using the Inserter class

The following example in Python inserts two rows of data into a table (`Extract.Extract`). The Inserter class constructor takes two arguments: the connection to the file and the table to insert data into. You can specify the name of the table or the table definition.

Use the `add_row` or `add_rows` methods to insert data. Call `inserter.execute` to commit the data to the table.

```python

    # The rows to insert 
    data_to_insert = [
        ["DK-13375", "Dennis Kane", 518, "Consumer"],
        ["EB-13705", "Ed Braxton", 815, "Corporate"]
    ]

    with Inserter(connection, TableName('Extract','Extract')) as inserter:
        inserter.add_rows(rows=data_to_insert)
        inserter.execute()

```


## Insert data using Hyper SQL commands

The following example uses the Hyper SQL [INSERT](../reference/sql/sql-insert.html){:target="_blank"}{:ref="noopener"} command to add two rows of data to a table. To specify a table named `Extract` that uses the `Extract` schema, use the `TableName` method to correctly format the name of the table. The `execute_command` method returns the count of affected rows. As with other Hyper SQL commands, you first need to have a HyperProcess and have established a connection to the `.hyper` file.

```python

    table_name = TableName("Extract", "Extract")
    row_count = connection.execute_command(command=f"INSERT INTO {table_name} VALUES (A, 1), (B, 2)")
    print(row_count)

```

The most efficient method for adding data to a table is with the [COPY](../reference/sql/sql-copy.html){:target="_blank"}{:ref="noopener"} command. Hyper SQL provides a way to copy data directly from comma-separated value (CSV) files. The `COPY` from CSV command can be much faster than using the `Inserter` class. For more information, see [Insert Data Directly From CSV Files]({{site.baseurl}}/docs/hyper_api_insert_csv.html).

```python

    count_in_customer_table = connection.execute_command(
    command=f"COPY {customer_table.name} from {escape_string_literal(path_to_csv)} with "
    f"(format csv, NULL 'NULL', delimiter ',', header)")
 print(f"The number of rows in table {customer_table.name} is {count_in_customer_table}.")


```

While copying data from CSV files can be extremely effective, there are other circumstances, such as when you have the data in memory, or already in a program, where you will want to directly insert the data into the `.hyper` file. In this case you can either use the Hyper API `Inserter` class (recommended) or raw SQL `INSERT` statements. The `Inserter` class is recommended over raw SQL statements as it performs binary data transfer, takes care of data buffering, and other details.


## Update data using Hyper SQL commands

You can use the [UPDATE](../reference/sql/sql-update.html){:target="_blank"}{:ref="noopener"} command to change values in a table. The UPDATE command changes the values of specified columns in all rows that satisfy the condition that is specified in the WHERE clause.

For example, the following example shows a command that would add more reward points to customers who are identified as corporate customers. As with other Hyper SQL commands, you first need to have a HyperProcess and have established a connection to the `.hyper` file.

```python

    row_count = connection.execute_command(
        command=f"UPDATE {escape_name('Customer')} "
        f"SET {escape_name('Loyalty Reward Points')} = {escape_name('Loyalty Reward Points')} + 50 "
        f"WHERE {escape_name('Segment')} = {escape_string_literal('Corporate')}")

```


## Delete data using Hyper SQL commands

Use the Hyper SQL [DELETE](../reference/sql/sql-delete.html){:target="_blank"}{:ref="noopener"} command to delete rows from a table. The `DELETE` command deletes tuples that satisfy the condition specified in the `WHERE` clause. If there is no `WHERE` clause, all rows of the table are deleted (the table itself will still exist).


```python


    row_count = connection.execute_command(
        command=f"DELETE FROM {escape_name('Orders')} "
        f"WHERE {escape_name('Customer ID')} = ANY("
        f"SELECT {escape_name('Customer ID')} FROM {escape_name('Customer')} "
        f"WHERE {escape_name('Customer Name')} = {escape_string_literal('Dennis Kane')})")

```