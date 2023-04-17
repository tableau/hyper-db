# Boolean Type

Hyper provides the standard SQL type `boolean`. The `boolean` type can
have three states: "true", "false", and a third state, "unknown", which
is represented by the SQL `NULL` value.

Boolean values are usually obtained as the result of a
[comparison](/docs/sql/scalar_func/comparison) or a comparable function call such as
a `LIKE` expression.

Boolean constants can be represented in SQL queries by the SQL key words
`TRUE`, `FALSE`, and `NULL`.

When parsing a `boolean` from a string, the following string
representations are accepted for the "true" state: `true`, `yes`, `on`,
`1`, `t`, `y` and these representations for the "false" state: `false`, `no`, `off`,
`0`, `f`, `n`. Leading or trailing whitespace is ignored, and case does not matter.

Boolean values can be combined using [logical operators](/docs/sql/scalar_func/logical)
and can be used, e.g., in a [WHERE clauses](/docs/sql/command/select#where) to
filter the set of selected tuples or in a
[conditional expression](/docs/sql/scalar_func/conditional).

Converting a `boolean` to a string always emits either `t` or `f`, as
shown in the example:

    CREATE TABLE test1 (a boolean, b text);
    INSERT INTO test1 VALUES (TRUE, 'sic est');
    INSERT INTO test1 VALUES (FALSE, 'non est');

    SELECT * FROM test1;
     a |    b
    ---+---------
     t | sic est
     f | non est

    SELECT * FROM test1 WHERE a;
     a |    b
    ---+---------
     t | sic est

The key words `TRUE` and `FALSE` are the preferred (SQL-compliant)
method for writing Boolean constants in SQL queries. But you can also
use the string representations by following the generic string-literal
constant syntax described above, for example `'yes'::boolean`.

Note that the parser automatically understands that `TRUE` and `FALSE`
are of type `boolean`, but this is not so for `NULL` because that can
have any type. So in some contexts you might have to cast `NULL` to
`boolean` explicitly, for example `NULL::boolean`. Conversely, the cast
can be omitted from a string-literal Boolean value in contexts where the
parser can deduce that the literal must be of type `boolean`.
