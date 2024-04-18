# Data Types

Hyper has a rich set of native data types available to users.

The table below shows all the built-in general-purpose
data types. Most of the alternative names listed in the "Aliases" column
are the names supported by Hyper for compatibility reasons with Postgres.

Name|Aliases|Description
---|---|---
`BIGINT`|`INT8`|signed eight-byte integer
`BOOLEAN`|`BOOL`|Boolean value with ternary logic (true/false/unknown)
`BYTES`||binary data ("byte array")
`CHARACTER [ (n) ]`|`CHAR [ (n) ]`|fixed-length character string
`CHARACTER VARYING (n)`|`VARCHAR (n)`|variable-length character string with limit
`DATE`||calendar date (year, month, day)
`REAL`|`FLOAT4`|single precision floating-point number (4 bytes)
`DOUBLE PRECISION`|`FLOAT`, `FLOAT8`|double precision floating-point number (8 bytes)
`INTEGER`|`INT`, `INT4`|signed four-byte integer
`INTERVAL`||time span; not supported in Tableau
`NUMERIC [ (p, s) ]`|`DECIMAL [ (p, s) ]`|exact numeric of selectable precision
`SMALLINT`|`INT2`|signed two-byte integer
`TEXT`||variable-length character string
`TIME [ WITHOUT TIME ZONE ]`||time of day (no time zone)
`TIMESTAMP [ WITHOUT TIME ZONE ]`||date and time (no time zone)
`TIMESTAMP WITH TIME ZONE`|`TIMESTAMPTZ`|date and time, including time zone
`GEOGRAPHY`||a geography object

:::note
Persisting `NUMERIC`s with a precision greater than 18 requires at least [database version 3](/docs/hyper-api/hyper_process#version-3).
:::
:::note
Persisting 32-bit floating point values (e.g., type `REAL`) requires at least [database version 4](/docs/hyper-api/hyper_process#version-4).
Up until Hyper API release [0.0.18825](/docs/releases#0.0.18825) Hyper used 64-bit floating points for all float types (i.e., also for `REAL`).
:::


Links to detailed documentation:

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
