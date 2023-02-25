# Comparison Functions and Operators {#functions-comparison}

The usual comparison operators are available, as shown in
[table_title](#functions-comparison-op-table).

  Operator      |Description
  --------------|--------------------------
  `<`           |less than
  `>`           |greater than
  `<=`          |less than or equal to
  `>=`          |greater than or equal to
  `=`           |equal
  `<>` or `!=`  |not equal

  : Comparison Operators

Comparison operators are available for all relevant data types. All
comparison operators are binary operators that return values of type
`boolean`; expressions like `1 < 2 < 3` are not valid (because there is
no `<` operator to compare a Boolean value with `3`).

There are also some comparison predicates, as shown in
[table_title](#functions-comparison-pred-table). These behave much like
operators, but have special syntax mandated by the SQL standard.

  Predicate                             |Description
  --------------------------------------|-------------------------------------------------
  `<a> BETWEEN <x> AND <y>`             |between
  `<a\> NOT BETWEEN <x> AND <y>`        |not between
  `<a\> IS DISTINCT FROM <b\>`          |not equal, treating null like an ordinary value
  `<a\> IS NOT DISTINCT FROM <b\>`      |equal, treating null like an ordinary value
  `<expression\> IS NULL`               |is null
  `<expression\> IS NOT NULL`           |is not null
  `<expression\> ISNULL`                |is null (nonstandard syntax)
  `<expression\> NOTNULL`               |is not null (nonstandard syntax)
  `<boolean_expression> IS TRUE`        |is true
  `<boolean_expression> IS NOT TRUE`    |is false or unknown
  `<boolean_expression> IS FALSE`       |is false
  `<boolean_expression> IS NOT FALSE`   |is true or unknown
  `<boolean_expression> IS UNKNOWN`     |is unknown
  `<boolean_expression> IS NOT UNKNOWN` |is true or false

  : Comparison Predicates

The `BETWEEN` predicate simplifies range tests: `a BETWEEN x AND y`
is equivalent to `a >= x AND a <= y`. Notice that
`BETWEEN` treats the endpoint values as included in the range.
`NOT BETWEEN` does the opposite comparison: `a NOT BETWEEN x AND y`
is equivalent to `a < x OR a > y`.

Ordinary comparison operators yield null (signifying "unknown"), not
true or false, when either input is null. For example, `7 = NULL` yields
null, as does `7 <> NULL`. When this behavior is not suitable, use the
`IS NOT DISTINCT FROM` predicates: \<a\> IS DISTINCT FROM \<b\> \<a\> IS
NOT DISTINCT FROM \<b\> For non-null inputs, `IS DISTINCT FROM` is the
same as the `<>` operator. However, if both inputs are null it returns
false, and if only one input is null it returns true. Similarly,
`IS NOT DISTINCT FROM` is identical to `=` for non-null inputs, but it
returns true when both inputs are null, and false when only one input is
null. Thus, these predicates effectively act as though null were a
normal data value, rather than "unknown".

To check whether a value is or is not null, use the predicates:
\<expression\> IS NULL \<expression\> IS NOT NULL or the equivalent, but
nonstandard, predicates: \<expression\> ISNULL \<expression\> NOTNULL

Do *not* write `expression = NULL` because `NULL` is not "equal to"
`NULL`. (The null value represents an unknown value, and it is not known
whether two unknown values are equal.)

Boolean values can also be tested using the predicates
\<boolean_expression\> IS TRUE \<boolean_expression\> IS NOT TRUE
\<boolean_expression\> IS FALSE \<boolean_expression\> IS NOT FALSE
\<boolean_expression\> IS UNKNOWN \<boolean_expression\> IS NOT UNKNOWN
These will always return true or false, never a null value, even when
the operand is null. A null input is treated as the logical value
"unknown". Notice that `IS UNKNOWN` and `IS NOT UNKNOWN` are effectively
the same as `IS NULL` and `IS NOT NULL`, respectively, except that the
input expression must be of Boolean type.
