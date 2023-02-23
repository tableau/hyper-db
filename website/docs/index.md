---
title: Tableau Hyper API
sidebar_position: 1
---

The Hyper API contains a set of functions you can use to automate your interactions with Tableau extract (`.hyper`) files. You can use the API to create new extract files, or to open existing files, and then insert, delete, update, or read data from those files. Using the Hyper API developers and administrators can:

- Create extract files for data sources not currently supported by Tableau.

- Automate custom extract, transform and load (ETL) processes (for example, implement rolling window updates or custom incremental updates).

- Retrieve data from an extract file.

## Do more using the power of Hyper

In addition to supporting the features of the previous Extract API 2.0 for creating and updating extract files, the Hyper API provides access to new features:

- You can create, read, update, and delete data in `.hyper` files (also known as CRUD operations).

- You can leverage the full speed of Hyper for creating and updating extract files.

- You can load data directly from CSV files, much faster, and without having to write special code to do so.

- You can use the power of SQL to interact with data in `.hyper` files. The Hyper API provides methods for executing SQL on `.hyper` files.

The Hyper API gives you the tools for interacting with local `.hyper` extract files. For information about how to programmatically publish the extracts to
Tableau Server, see the [Tableau Server REST
API](https://onlinehelp.tableau.com/current/api/rest_api/en-us/help.htm)
and the [Tableau Server Client
(Python)](https://tableau.github.io/server-client-python/#) library.


## Supported languages

The Hyper API only supports 64-bit platforms. The Hyper API libraries are available for the following programming languages:

- Python (the three most recent versions)
- C++ (C++11 or newer)
- Java (Java 8 or newer)
- C#/.NET (.NET Standard 2.0)

While it is expected that the Hyper API will work on newer versions of these languages, it may not be fully tested.

## Supported platforms

- Microsoft Windows Server 2016, 2012, 2012 R2, 2008 R2, 2019

- Amazon Linux 2, Red Hat Enterprise Linux (RHEL) 7.3+, CentOS 7.3+, Oracle Linux 7.3+, Ubuntu 16.04 LTS and 18.04 LTS

- Microsoft Windows 7 or newer (64-bit)

- macOS 10.13 or newer

## Hardware requirements

The Hyper API has the following minimum hardware requirements. 

- Intel Nehalem or AMD Bulldozer processor or newer
- 2 GB memory
- 1.5 GB minimum free disk space
