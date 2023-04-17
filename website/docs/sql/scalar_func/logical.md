# Logical Operators

The usual logical operators are available for boolean values:
`AND`, `OR`, `NOT`.
SQL uses a three-valued logic system with true, false, and `null`,
which represents "unknown". Observe the following truth tables:

  `a`    |`b`    |`a AND b` |`a OR b`
  -------|-------|----------|--------
  TRUE   |TRUE   |TRUE      |TRUE
  TRUE   |FALSE  |FALSE     |TRUE
  TRUE   |NULL   |NULL      |TRUE
  FALSE  |FALSE  |FALSE     |FALSE
  FALSE  |NULL   |FALSE     |NULL
  NULL   |NULL   |NULL      |NULL

  `a`   |`NOT a`
  ------|-------
  TRUE  |FALSE
  FALSE |TRUE
  NULL  |NULL

The operators `AND` and `OR` are commutative, that is, you can switch
the left and right operand without affecting the result.
