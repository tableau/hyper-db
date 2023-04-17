# SQL Commands

While Hyper API provides convenience functions for the
common use cases (such as insertion), the most powerful
way to interact with Hyper is by using SQL commands.
Those SQL commands can be sent to Hyper as shown in the
[Using SQL commands](/docs/guides/sql_commands) tutorial.

In general, the available SQL commands can be grouped into
different categories:

1. The query commands ([SELECT](select), [VALUES](values), and
   [TABLE](table)): Those commands compute some query results
   based on some input data. They are at the heart of computing,
   e.g., the data shown in a Tableau visualization or to
   transform data via joins, aggregations and other function
   applications.
2. Data modification commands: Using [INSERT](insert),
   [UPDATE](update), [DELETE](delete), and [TRUNCATE](truncate)),
   one can change the data stored inside a table.
   Furthermore, [COPY FROM](copy_from) copies data directly from
   an external file (e.g., a CSV or Parquet file) into a Hyper
   table.
   When combined with [SELECT](select) queries, one can also use
   those commands to, e.g., materialize the results of complex
   analytical computations.
3. Data definition commands: Hyper supports commands to
   [create databases](create_database), [tables](create_table) and
   modify ("alter") and delete ("drop") them.
5. Support statements for prepared statements: [PREPARE](prepare)
   can pre-compile a query, including placeholder parameters. A
   prepared query can later on be executed through
   [EXECUTE](execute), giving specific values for hte parameters.
   [DEALLOCATE] deallocates a given query.


Below the full list of supported statements:

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
