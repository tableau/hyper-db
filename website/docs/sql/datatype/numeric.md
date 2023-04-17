# Numeric Types

Numeric types consist of two-, four-, and eight-byte integers, as well
as eight-byte floating-point numbers and selectable-precision decimals:

Name | Description 
---|---
`smallint`|small-range integer: -32768 to +32767 (2 bytes)
`integer`|typical choice for integer: -2147483648 to +2147483647 (4 bytes)
`bigint`|large-range integer: -9223372036854775808 to +9223372036854775807 (8 bytes)
`numeric`|exact, fixed-length representation of numbers with decimal point: up to decimal 38 digits
`double precision`|variable-precision, inexact: 15 decimal digits precision

## Integer Types {#int}

The types `smallint`, `integer`, and `bigint` store whole numbers, that
is, numbers without fractional components, of various ranges. Attempts
to store values outside of the allowed range will result in an error.

## Fixed-point Numbers {#numeric-decimal}

The type `numeric` can store fixed-point numbers with up to 38 digits
without loss of precision. It is especially recommended for storing
monetary amounts and other quantities where exactness is required.
Calculations with `numeric` values yield exact results where possible,
e.g. addition, subtraction, multiplication.

We use the following terms below: The precision of a `numeric` is the
total count of significant digits in the whole number, that is, the
number of digits to both sides of the decimal point. The scale of a
`numeric` is the count of decimal digits in the fractional part, to the
right of the decimal point. So the number 23.5141 has a precision of 6
and a scale of 4. Integers can be considered to have a scale of zero.

The maximum supported precision is 38. Internally, `numeric` values are
stored as 64-bit values if the precision is smaller or equal to 18.
Precisions over 18 require 128-bit for internal storage. Processing
128-bit `numeric` values is often slower than processing 64-bit values,
so it is advisable to use a sensible precision for the use case at hand
instead of always using the maximum precision by default.

Both the maximum precision and the maximum scale of a `numeric` column
can be configured. To declare a column of type `numeric` use the syntax
`NUMERIC(precision, scale)`. The precision must be positive, the scale zero or positive.
Alternatively, `NUMERIC(precision)` selects a scale of 0.
Specifying `NUMERIC` selects the maximum precision of 38 and a scale of 0.

The type propagation rules for arithmetic operations with numerics never
decrease the scale and set the precision such that the biggest possible
result will fit into the result type. This may lead to undesired growth
of both scale and precision, especially when chaining multiple
arithmetic operations. Large scale might be undesirable because it takes
away from the digits in front of the decimal point, potentially leading
to overflow errors. Large precision might also be undesirable because
`numeric` values with precision over 18 internally use 128-bit which may
slow down processing. To avoid this, explicit casts to the desired scale
and precision can be added throughout a query.

Arithmetic operations between a `NUMERIC(p1,s1)` and a `NUMERIC(p2,s2)`
have the following results:

|Operator|Result Type|
|---|---|
| + or - |NUMERIC(precision, scale) with:<br/>scale = max(s1,s2)<br/>precision = min(38, max((p1-s1),(p2-s2)) + 1 + scale)|
|*|NUMERIC(precision, scale) with:<br/> scale = max(max(s1,s2), min(s1+s2, 38 - (p1-s1) - (p2-s2)))<br/> precision = min(p1+p2, 38)|
|/|NUMERIC(precision, scale) with:<br/> scale = max(s1,s2)<br/>precision = min(38, ((p1-s1) + s2 + scale)) |
|%|NUMERIC(precision, scale) with:<br/> scale = max(s1,s2)<br/>precision = min((p1-s1), (p2-s2)) + scale  |

When used in arithmetic operation together with `NUMERIC`,
`DOUBLE PRECISION` operands will always give `DOUBLE PRECISION` results,
`SMALLINT` behaves the same as `NUMERIC(5,0)`, `INTEGER` as
`NUMERIC(10,0)` and `BIGINT` as `NUMERIC(19,0)`.

:::note
In the SQL standard, as well as in PostgreSQL and many other database
systems, the types `decimal` and `numeric` are equivalent and both
support variable-length precision. This is unlike Hyper, where `numeric`
has fixed-length precision and `decimal` is not officially supported.
:::

:::note
If you create an extract of a relational database in Tableau, the
extract will always use the Hyper `double precision` type, so you only
get 15 digits of precision. However, you can create the extract file
using the Hyper API and specify the `numeric` type to get up to 38
digits.
:::

:::note
Once a `numeric` value has a precision of over 18, 128-bit are used for
internal storage which can impact the performance of all subsequent
operations.
:::

:::note
Storing `numeric` columns with precision larger than 18 in Hyper files
is not supported, yet.
:::

## Floating-Point Type {#float}

The data type `double precision` is an inexact, variable-precision
numeric type. On all currently supported platforms, these types are
implementations of IEEE Standard 754 for Binary Floating-Point
Arithmetic.

Inexact means that some values cannot be converted exactly to the
internal format and are stored as approximations, so that storing and
retrieving a value might show slight discrepancies. This is not a
limitation of Hyper but an inherent trade-off of using floating-point
values. In particular, the following recommendations should be taken
into account when using floating-point types:

-   If you require exact storage and calculations (such as for monetary
    amounts), use the `numeric` type instead.

-   Aggregations such as `sum()` on floating-point values may yield
    inconsistent results when executed repeatedly due to parallel
    computation of aggregates. If you require consistent results,
    consider using `numeric` instead.

-   Comparing two floating-point values for equality might not always
    work as expected. Using difference to a small epsilon value is
    recommended instead.

On all currently supported platforms, the `double precision` type has a
range of around 1E-307 to 1E+308 with a precision of at least 15 digits.
Values that are too large or too small will cause an error. Rounding
might take place if the precision of an input number is too high.
Numbers too close to zero that are not representable as distinct from
zero will cause an underflow error.

By default, floating point values are output in text form in their
shortest precise decimal representation; the decimal value produced is
closer to the true stored binary value than to any other value
representable in the same binary precision. This value will use at most
17 significant decimal digits.

In addition to ordinary numeric values, the floating-point types have
several special values:

    Infinity
    -Infinity
    NaN

These represent the IEEE 754 special values "infinity", "negative
infinity", and "not-a-number", respectively. When writing these values
as constants in an SQL command, you must put quotes around them, for
example `UPDATE table SET x = '-Infinity'`. On input, these strings are
recognized in a case-insensitive manner.

:::note
IEEE754 specifies that `NaN` should not compare equal to any other
floating-point value (including `NaN` itself). In Hyper, `NaN` compares
as equal to `NaN`, though. This decision was made for compatibility
with PostgresQL and many other database systems.
:::

Hyper also supports the SQL-standard notations `float` and `float(p)`
for specifying inexact numeric types. Here, `p` specifies the minimum
acceptable precision in *binary* digits. However, the `p` argument is
currently ignored and all `float(p)` types are simply mapped to
`double precision`. `float` with no precision specified is also mapped
to `double precision`.
