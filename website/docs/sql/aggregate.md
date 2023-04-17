# Aggregate Functions

Aggregate functions compute a single result from a set of input values.
There are multiple types of aggregate function:
[General-Purpose Aggregates](#general-purpose),
[Statistical Aggregates](#statistical) and
[Ordered Set Aggregates](#ordered-set).
Furthermore, the [GROUPING function](#grouping-func) can be used in
combination with grouping sets to check which columns the results
were aggregated on.

## General-Purpose Aggregates {#general-purpose}

The built-in general-purpose aggregate functions are listed below:

Function|Argument Type(s)|Return Type|Description|
---|---|---|---|
`any_value(expression)`|any type|same as argument data type|an arbitrary, implementation-defined value from the set of input values. The result is non-deterministic.
`approx_count_distinct(expression, e)`|any, `double precision`|`bigint`|Computes approximation of `count(distinct expression)`, with expected relative error `e`. Supported values of `e` are in range (0.002, 1]. The `e` argument is optional, if omitted, the value 0.023 is used (2.3% expected relative error to real distinct count).
`avg(expression)`|any numerical type|`numeric` with a scale of 4 for any integer-type argument, `double precision` for a floating-point argument, otherwise the same as the argument data type|the average (arithmetic mean) of all input values
`bit_and(expression)`|integral types|same as argument data type|the bitwise AND of all non-null input values, or null if none
`bit_or(expression)`|integral types|same as argument data type|the bitwise OR of all non-null input values, or null if none
`bool_and(expression)`|`bool`|`bool`|true if all input values are true, otherwise false
`bool_or(expression)`|`bool`|`bool`|true if at least one input value is true, otherwise false
`count(*)`||`bigint`|number of input rows
`count(expression)`|any|`bigint`|number of input rows for which the value of `<expression>` is not null
`every(expression)`|`bool`|`bool`|equivalent to `bool_and`
`max(expression)`|any|same as argument type|maximum value of `<expression>` across all input values
`min(expression)`|any|same as argument type|minimum value of `<expression>` across all input values
`sum(expression)`|any numerical type|`bigint` for any integer-type argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|sum of `<expression>` across all input values

It should be noted that except for `count`, these functions return a
null value when no rows are selected. In particular, `sum` of no rows
returns null, not zero as one might expect. The `coalesce` function can
be used to substitute zero for null when necessary.

## Statistic aggregates {#statistical}

The next table shows aggregate
functions typically used in statistical analysis. (These are separated
out merely to avoid cluttering the listing of more-commonly-used
aggregates.) In all cases, null is returned if the computation is
meaningless, for example when the number of input rows for which all
input expressions are non-null is zero.

Function|Argument Type|Return Type|Description
---|---|---
`corr(Y, X)`|`double precision`|`double precision`|correlation coefficient
`covar_pop(Y, X)`|`double precision`|`double precision`|population covariance
`covar_samp(Y, X)`|`double precision`|`double precision`|sample covariance
`stddev(expression)`|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|alias for `stddev_samp`
`stddev_pop(expression)`|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|population standard deviation of the input values
`stddev_samp(expression)`|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|sample standard deviation of the input values
`variance`(`<expression>`)|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|alias for `var_samp`
`var_pop`(`<expression>`)|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|population variance of the input values (square of the population standard deviation)
`var_samp`(`<expression>`)|any numerical type|`NUMERIC(38,4)` for any integer-type argument, `double precision` for a floating-point argument, `NUMERIC(38,s)` for any `NUMERIC(p,s)`|sample variance of the input values (square of the sample standard deviation)

## Ordered set aggregates {#ordered-set}

The table below shows some aggregate
functions that use the ordered-set aggregate syntax.

Function | Direct Argument Type(s) | Aggregated Argument Type(s) | Return Type | Description
---------------------------------------------------------------------|-------------------------|----------------------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------
`mode() WITHIN GROUP (ORDER BY sort_expression)`                     |                         |any sortable type                 |same as sort expression  |returns the most frequent input value (arbitrarily choosing the first one if there are multiple equally-frequent results)
`percentile_cont(fraction) WITHIN GROUP (ORDER BY sort_expression)`  |`double precision`       |`double precision` or `interval`  |same as sort expression  |continuous percentile: returns a value corresponding to the specified fraction in the ordering, interpolating between adjacent input items if needed
`percentile_disc(fraction) WITHIN GROUP (ORDER BY sort_expression)`  |`double precision`       |any sortable type                 |same as sort expression  |discrete percentile: returns the first input value whose position in the ordering equals or exceeds the specified fraction

All ordered-set aggregates ignore null values in their sorted input.
For those that take a `<fraction>` parameter, the fraction value must be between 0 and 1;
an error is thrown if not. However, a null fraction value simply produces a null result.

## `GROUPING` function

```sql_template
GROUPING(<group_by_expression> [, ...])
```

Returns a bit mask indicating which `GROUP BY` expressions are not included in the current grouping set. Bits are assigned with the rightmost argument corresponding to the least-significant bit; each bit is 0 if the corresponding expression is included in the grouping criteria of the grouping set generating the current result row, and 1 if it is not included. At most 31 expressions may be used as arguments.

The `GROUPING` function is used in conjunction with
[grouping sets](command/select#grouping-sets) to distinguish result
rows. The arguments to the `GROUPING` function are not actually
evaluated, but they must exactly match expressions given in the
`GROUP BY` clause of the associated query level. For example:

    SELECT * FROM items_sold;

     make  | model | sales
    -------+-------+-------
     Foo   | GT    |  10
     Foo   | Tour  |  20
     Bar   | City  |  15
     Bar   | Sport |  5

    SELECT make, model, GROUPING(make,model), sum(sales) FROM items_sold GROUP BY ROLLUP(make,model);

     make  | model | grouping | sum
    -------+-------+----------+-----
     Foo   | GT    |        0 | 10
     Foo   | Tour  |        0 | 20
     Bar   | City  |        0 | 15
     Bar   | Sport |        0 | 5
     Foo   |       |        1 | 30
     Bar   |       |        1 | 20
           |       |        3 | 50

Here, the `grouping` value `0` in the first four rows shows that those
have been grouped normally, over both the grouping columns. The value
`1` indicates that `model` was not grouped by in the next-to-last two
rows, and the value `3` indicates that neither `make` nor `model` was
grouped by in the last row (which therefore is an aggregate over all the
input rows).
