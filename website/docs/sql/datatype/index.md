# Data Types

Hyper has a rich set of native data types available to users.

[table_title](#datatype-table) shows all the built-in general-purpose
data types. Most of the alternative names listed in the "Aliases" column
are the names used internally by Hyper for historical reasons. In
addition, some internally used types are available, but are not listed
here.

  Name                               |Aliases               |Description
  -----------------------------------|----------------------|-------------------------------------------------------
  `BIGINT`                           |`INT8`                |signed eight-byte integer
  `BOOLEAN`                          |`BOOL`                |Boolean value with ternary logic (true/false/unknown)
  `BYTES`                            |                      |binary data ("byte array")
  `CHARACTER [ (n) ]`                |`CHAR [ (n) ]`        |fixed-length character string
  `CHARACTER VARYING (n)`            |`VARCHAR (n)`         |variable-length character string with limit
  `DATE`                             |                      |calendar date (year, month, day)
  `DOUBLE PRECISION`                 |`FLOAT8`              |double precision floating-point number (8 bytes)
  `INTEGER`                          |`INT`, `INT4`         |signed four-byte integer
  `INTERVAL`                         |                      |time span; not supported in Tableau
  `NUMERIC [ (p, s) ]`               |`DECIMAL [ (p, s) ]`  |exact numeric of selectable precision
  `SMALLINT`                         |`INT2`                |signed two-byte integer
  `TEXT`                             |                      |variable-length character string
  `TIME [ WITHOUT TIME ZONE ]`       |                      |time of day (no time zone)
  `TIMESTAMP [ WITHOUT TIME ZONE ]`  |                      |date and time (no time zone)
  `TIMESTAMP WITH TIME ZONE`         |`TIMESTAMPTZ`         |date and time, including time zone
  `GEOGRAPHY`                        |                      |a geography object

Each data type has an external representation determined by its input
and output functions. Many of the built-in types have obvious external
formats. However, several types are either unique to Hyper, or have
several possible formats, such as the date and time types. Some of the
input and output functions are not invertible, i.e., the result of an
output function might lose accuracy when compared to the original input.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```