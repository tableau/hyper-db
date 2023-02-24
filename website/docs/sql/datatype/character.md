# Character Types {#datatype-character}

  Name                                   Description
  -------------------------------------- ----------------------------
  `character varying(n)`, `varchar(n)`   variable length with limit
  `character(n)`, `char(n)`              fixed length with padding
  `text`                                 variable length

  : Character Types

[table_title](#datatype-character-table) shows the general-purpose
character types available in Hyper.

::: tip
There is no performance difference among the three types described here.
While `character(n)` has performance advantages in some other database
systems, there is no such advantage in Hyper. Because of internal
storage compression, there is also no disk space trade-off between the
three types. Also note that adding a length limit potentially makes
insertions and operations slightly slower due to length checks. For
these reasons, we recommend simply using `text` in most situations.
:::

SQL defines two primary character types: `character varying(n)` and
`character(n)`, where \<n\> is a positive integer. Both of these types
can store strings up to \<n\> characters (not bytes) in length. An
attempt to store a longer string into a column of these types will
result in only the first \<n\> characters being stored, while the
remaining ones are dropped. If the string to be stored is shorter than
the declared length, values of type `character` will be space-padded;
values of type `character varying` will simply store the shorter string.

If one explicitly casts a value to `character varying(n)` or
`character(n)`, then an over-length value will be truncated to \<n\>
characters without raising an error. (This is required by the SQL
standard.)

The notations `varchar(n)` and `char(n)` are aliases for
`character varying(n)` and `character(n)`, respectively. `character`
without length specifier is equivalent to `character(1)`. If
`character varying` is used without length specifier, the type accepts
strings with length up to 2 GB. The latter is equivalent to `text` and
is a Hyper extension.

In addition, Hyper provides the `text` type, which stores strings of any
length up to 2 GB. Although the type `text` is not in the SQL standard,
several other SQL database management systems have it as well.

    CREATE TABLE test1 (a character(4));
    INSERT INTO test1 VALUES ('ok');
    SELECT a, char_length(a) FROM test1; -- 

     a    | char_length
     -----+-------------
     ok   |           2


    CREATE TABLE test2 (b varchar(5));
    INSERT INTO test2 VALUES ('ok');
    INSERT INTO test2 VALUES ('good      ');
    INSERT INTO test2 VALUES ('too long');   -- implicit truncation

    SELECT b, char_length(b) FROM test2;

     b     | char_length
     -------+-------------
     ok    |           2
     good  |           5
     too l |           5

-   The `char_length` function is discussed in [???](#functions-string).
