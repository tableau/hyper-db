# Client-side API

Hyper is a full-fledged, relational SQL database system.
Tableau Hyper API bundles the Hyper database server (`hyperd`) with a client-side library to interact with `hyperd`.
The API provides utilities for:

* Starting a `hyperd` process, connecting to it and sending SQL queries (`HyperProcess` and `Connection`)
* Inserting data into tables (the `Inserter` class)
* Meta data queries (`connection.catalog`)
* SQL escaping (`escape_string_literal` etc.)

This section describes the high-level abstractions provided by Hyper API.
The provided examples use Python, but the underlying concepts apply for all client languages.
You can find the API details for your specific client language in the corresponding API reference.