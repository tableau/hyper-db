# Tableau Hyper API

Hyper is Tableau's blazingly fast SQL engine powering Tableau's real time analytics and interactive exploration and Tableau Prep's ETL transformations.
With Hyper API, you can directly leverage the full speed of Hyper to:

* ingest data into `.hyper` files which you can then analyze with Tableau Desktop or upload to Tableau Cloud.
* update data in existing Hyper files, ensuring that your Tableau analysis is based on the freshest, most up-to-date data
* open existing files, and read data from those files
* load data directly from CSV files, much faster, and without having to write custom code to do so.
* read widespread data formats such as CSVs, Parquet and Iceberg files.
* use the power of SQL, e.g. to transform and clean up your data before visualizing it with Tableau

Those capabilities can be used, e.g., to:

- Make data accessible to Tableau which is stored in data sources not
  currently natively supported by Tableau.
- Automate custom extract, transform and load (ETL) processes
- Implement rolling window updates or custom incremental updates

The Hyper API gives you the tools for interacting with local `.hyper` extract files.
You can then publish the those Hyper files to Tableau Cloud or Tableau Server
using the
[Tableau Server REST API](https://onlinehelp.tableau.com/current/api/rest_api/en-us/help.htm)
and the
[Tableau Server Client](https://tableau.github.io/server-client-python/#) library.
Furthermore, you can open `.hyper` files directly in Tableau Desktop and Tableau Prep.

## Runs anywhere

The Hyper API libraries are available for the most commonly used languages, i.e.:

- Python
- C++
- Java
- C#/.NET

and is available for Windows, macOS and Linux.
It can be used both in the cloud as well as on small consumer-grade laptops.

More details on the supported platforms and hardware requirements can be found in the [Installation instructions](installation)