# Using Hyper with Pandas

If you want to use Hyper API together with pandas, the [pantab](https://pantab.readthedocs.io/en/latest/index.html) library has you covered.
pantab allows you to read and write pandas dataframes from/to Hyper.
pantab internally wraps Hyper API and provides convenience functions for integration with pandas on top of it.
To install pantab, simply run `pip install pantab`.

On this page, we provide a couple of usage examples for pantab.
For more information on pantab, see the [pantab examples](https://pantab.readthedocs.io/en/latest/examples.html) and the [pantab API reference](https://pantab.readthedocs.io/en/latest/api.html).

## Loading Data through Pandas

Pandas can read data from a plethora of other database systems (PostgreSQL, MS-SQL, Google Big Query, ...) out-of-the-box and can read many common file formats (such as Excel, HTML tables, ...).
Through `pantab`, we can leverage this support to ingest data into a Hyper file, making the data accessible for analysis in Tableau.

E.g., loading data from a PostgreSQL database into a Hyper file needs only a couple of lines:

```python
import pandas as pd
import pantab

animals_df = pd.read_sql('SELECT * FROM animals', 'postgres:///my_db_name') 
pantab.frame_to_hyper(animals_df, "animals.hyper", table="animals")
```

The `frame_to_hyper` function writes a data frame into the specified Hyper file under a given table name.
It internally handles all interactions with Hyper API (spawing a `HyperProcess`, creating a `Connection` to it, sending the data from pandas to Hyper, ...).

Of course, we can also ingest data from arbitrary other sources supported by pantab.
To read data from an Excel file, we would use:

```python
import pandas as pd
import pantab

animals_df = pd.read_excel('animals.xlsx')  
pantab.frame_to_hyper(animals_df, "animals.hyper", table="animals")
```

## Querying Parquet files From Pandas

To kickstart your creativity on potential use cases, let's use Hyper to run an analytical query on a Parquet file - and read the result back to a pandas frame using `pantab`.

You can send SQL queries to Hyper and get the result as a pandas dataframe using `pantab.frame_from_hyper_query`.
Combined with Hyper's capabilities to [query external file formats](../sql/external/), you can use this, e.g., to directly run queries on your Parquet files, Iceberg tables or Parquet files.
The following example demonstrates this on the Parquet file `orders_10rows.parquet` which you can [download here](https://github.com/tableau/hyper-api-samples/raw/main/Community-Supported/parquet-to-hyper/orders_10rows.parquet).

```python
import pandas as pd
import pantab
from tableauhyperapi import HyperProcess, Telemetry, Connection

with HyperProcess(Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(hyper.endpoint) as connection:
        results_df = pantab.frame_from_hyper_query(connection, """
            SELECT
                YEAR(o_orderdate),
                CAST(SUM(o_totalprice) AS double precision)
            FROM external('orders_10rows.parquet')
            GROUP BY YEAR(o_orderdate)
            """)
        # The query result is now in a pandas data frame.
        # We have the whole power of the pandas ecosystem at our
        # fingertips - and we only print it... how boring...
        print(results_df)
```

:::note Missing Numerics Support in pantab
pantab currently does not yet support reading `NUMERIC` types.
The query shown above works around this issue by using a `CAST`.
:::


## Communicate via Arrow files

You can use the [Apache Arrow format](https://arrow.apache.org/) to communicate between Hyper and Arrow.

* [Hyper's Arrow documentation](../sql/external/syntax)
* [Panda's Arrow documentation](https://arrow.apache.org/docs/python/pandas.html)

```python
import pandas as pd
import pyarrow as pa
from tableauhyperapi import HyperProcess, Telemetry, Connection

with HyperProcess(Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU) as hyper:
    with Connection(hyper.endpoint) as connection:
      # Write an Arrow file from Hyper
      connection.execute_command("SET global.experimental_external_format_arrow=1")
      connection.execute_command("COPY (SELECT 1) TO './out.arrow'")

      # Read an Arrow file with Pandas
      with pa.ipc.open_file('out.arrow') as reader:
         df = reader.read_pandas()
         print("DataFrame\n", df)
      
      # Write an Arrow file with Pandas
      df = pd.DataFrame({"a": [1, 2, 3]})
      table = pa.Table.from_pandas(df)
      with pa.ipc.new_file('in.arrow', table.schema) as writer:
         writer.write_table(table)

      # Read an Arrow file with Hyper
      results = connection.execute_list_query("SELECT * FROM external('in.arrow', columns => descriptor(a bigint))")
      print("Query results:\n", results)
```
