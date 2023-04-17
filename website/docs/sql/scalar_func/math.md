# Mathematical Functions and Operators

Mathematical operators are provided for many Hyper types. For types
without standard mathematical conventions (e.g., date/time types) we
describe the actual behavior in subsequent sections.

The following mathematical operators are available:

Operator  |Description                                      |Example
----------|-------------------------------------------------|-------------
`+`       |addition                                         |`2 + 3` → `5`
`-`       |subtraction                                      |`2 - 3` → `-1`
`*`       |multiplication                                   |`2 * 3` → `6`
`/`       |division (integer division truncates the result) |`4 / 2` → `2`
`%`       |modulo (remainder)                               |`5 % 4` → `1`
`^`       |exponentiation (associates left to right)        |`2.0 ^ 3.0` → `8`
<code>&#124;/</code>       |square root                     |<code>&#124;/ 25.0</code> → `5`
<code>&#124;&#124;/</code> |cube root                       |<code>&#124;&#124;/ 27.0</code> → `3`
`@`       |absolute value                                   |`@ -5.0` → `5`
`&`       |bitwise AND                                      |`91 & 15` → `11`
<code>&#124;</code>        |bitwise OR                      |<code>32 &#124; 3</code> → `35`
`#`       |bitwise XOR                                      |`17 # 5` → `20`
`~`       |bitwise NOT                                      |`~1` → `-2`
`<<`      |bitwise shift left                               |`1 << 4` → `16`
`>>`      |bitwise shift right                              |`8 >> 2` → `2`

The bitwise operators work only on integral data types, whereas the
others are available for all numeric data types.

The next table shows the available mathematical functions. In the table,
`dp` indicates `double precision`. Many of these functions are provided
in multiple forms with different argument types. Except where noted,
any given form of a function returns the same data type as its argument.
Note that every function, unless stated otherwise, returns an error in
case of failures.

Function | Return Type | Description | Example
 ---|---|---|---
`abs(x)` | same as input | absolute value | `abs(-17.4)` → `17.4`
`cbrt(dp)` | `dp` | cube root | `cbrt(27.0)` → `3.0`
`ceil(dp or numeric)` | same as input | nearest integer greater than or equal to argument | `ceil(-42.8)` → `-42.0`
`ceiling(dp or numeric)` | same as input | nearest integer greater than or equal to argument (same as `ceil`) | `ceiling(-95.3)` → `-95.0`
`degrees(dp)` | `dp` | radians to degrees | `degrees(0.5)` → `28.6478897565412`
`div(y, x)` | same as input, bigint for numeric | integer quotient of `y`/`x` | `div(9,4)` → `2`
`exp(x)` | dp | exponential | `exp(1.0)` → `2.71828182845905`
`floor(dp or numeric)` | same as input | nearest integer less than or equal to argument | `floor(-42.8)` → `-43.0`
`ln(x)` | dp | natural logarithm | `ln(2.0)` → `0.693147180559945`
`log(x)` | dp | base 10 logarithm | `log(100.0)` → `2.0`
`log(b, x)` | `dp` | logarithm to base `b` | `log(2.0, 64.0)` → `6.0000000000`
`mod(y, x)` | same as input, bigint for numeric | remainder of `y`/`x` | `mod(9,4)` → `1`
`pi()` | `dp` | "𝜋" constant | `pi()` → `3.14159265358979`
`power(a, b)` | `dp` or `numeric` | `a` raised to the power of `b` | `power(9.0, 3.0)` → `729`
`radians(x)` | `dp` | degrees to radians | `radians(45.0)` → `0.785398163397448`
`random()`  |`dp` |random value in the range 0.0  <= x < 1.0 | `random()` → `0.6817331`
`round(dp or numeric)` | same as input | round to nearest integer | `round(42.4)` → `42`
`round(v dp or numeric, s int)` | same as input | round to `s` decimal places | `round(42.4382, 2)` → `42.44`
`sign(x)` | same as input | sign of the argument (-1, 0, +1) | `sign(-8.4)` → `-1`
`sqrt(x)` | `dp` | square root | `sqrt(2.0)` → `1.4142135623731`
`trunc(dp or numeric)` | same as input | truncate toward zero | `trunc(42.8)` → `42`
`trunc(v dp or numeric, s int)` | same as input | truncate to `s` decimal places | `trunc(42.4382, 2)` → `42.43`
`width_bucket(operand, b1, b2, count int)` | `int` | return the bucket number to which `operand` would be assigned in a histogram having `count` equal-width buckets spanning the range `b1` to `b2`; returns `0` or `count+1` for an input outside the range | `width_bucket(5.35, 0.024, 10.06, 5)` → `3`

The characteristics of the values returned by `random()` depend on the
system implementation. It is not suitable for cryptographic
applications.

Finally, there are also trigonometric functions available:

Function (radians)  |Description
--------------------|--------------------------
`acos(x)`           |inverse cosine
`asin(x)`           |inverse sine
`atan(x)`           |inverse tangent
`atan2(y, x)`       |inverse tangent of `y/x`
`cos(x)`            |cosine
`cot(x)`            |cotangent
`sin(x)`            |sine
`tan(x)`            |tangent

 All trigonometric functions return values of
type `double precision`.