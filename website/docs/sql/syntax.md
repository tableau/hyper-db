# General Syntax

SQL commands are represented as strings.
Those SQL command string consists of tokens.
A token can be a key word, an identifier, a quoted identifier,
a literal (or constant), or a special character symbol.
Tokens are normally separated by whitespace (space, tab,
newline), but need not be if there is no ambiguity
(which is generally only the case if a special character is
adjacent to some other token type).
Additionally, comments can occur in SQL input. They are not
tokens, they are effectively equivalent to whitespace.

For example, the following is a valid SQL input:

```sql_template
SELECT *
FROM Orders
WHERE "Discount" > 0.1 -- discount is measured on a scale from 0 to 1
  AND "Region" = 'EMEA'
```

In this example,
* `SELECT`, `FROM`, `WHERE` and `AND` are [key words](#key-words),
* `Customers` is a an unquoted identifier;`"Discount"` and `"Region"` are quoted [identifiers](#identifiers)
* `12` is an [numeric constant](#numbers)
* `'EMEA'` is a [string constant](#strings)
* `>` and `=` are [operators](#operators)
* the part following `--` is a [comment](#comments)

:::tip
For guidance on programmatically crafting correctly escaped SQL queries, see
the guide [Executing SQL Commands](../guides/sql_commands#escapings).
Hyper API provides helper functions like `escape_name` and `escape_string_literal` to
correctly format SQL queries.
:::

## Key Words

Tokens such as `SELECT` and `WHERE` in the example above are key words, i.e.
words that have a special meaning in SQL.
Key words provide the overall structure of the SQL commands, and usually introduce
the various parts of a SQL command.
E.g., the `SELECT` command above contained 3 parts:

1. the list of selected columns, i.e. the `SELECT` clause (in this case `*`)
2. the list of tables, i.e. the `FROM` clause
3. the applied filters, i.e. the `WHERE` clause

Each of those clauses is introduced by a key word.
The expected keywords depend on the specific SQL command and are described
in the [SQL Command](command/) reference.

Key words share the same syntax as unquoted identifiers.
One frequently used convention is to write key words in upper case and identifiers
in lower case, e.g.:

```
UPDATE my_table SET a = 5;
```

thereby making it easier for readers to disambiguate them.

## Identifiers

The tokens `Customers` and `"Discount"` are examples of identifiers. They
identify names of tables, columns, or other database objects, depending
on the command they are used in. Therefore they are sometimes simply
called “names”.

There are two types of identifiers: "unquoted" identifiers such as
`Customers` and "quoted" or "delimitied" identifiers such as `"Discount"`.

Unquoted identifiers must start with a letter (non-Latin letters are
also accepted) or an underscore. Subsequent characters in an identifier
can be letters, underscores or digits (0-9).

Quoted identifiers are enclosed in double-quotes (`"`) and can contain
arbitrary characters. Quoted identifiers can contain any character.
To include a double quote, write two double quotes. Except for that,
no escaping is required or supported. Special characters like tabs,
protected whitespaces or even newline characters can be directly included
between the quotes.

Unquoted indentifiers are always folded to lower case. For example, the identifiers
`MyCustomers`, `myCustomers` and `"mycustomers"` all represent the lower-case
name "mycustomers".
In contrast, quoted not lower-cased and are case sensitive.

A couple of examples on the case sensitivity of identifiers: 

```sql_template
CREATE TABLE myTable(column1 int); -- actually creates `mytable`
SELECT * FROM mytable; -- SUCCESS. searches for `mytable`
SELECT * FROM myTable; -- SUCCESS. searches for `mytable`
SELECT * FROM MYtable; -- SUCCESS. searches for `mytable`
SELECT * FROM "myTable"; -- ERROR. searches for `myTable` which does not exist

CREATE TABLE "yourTable"(column1 int); -- actually creates `yourTable`
SELECT * FROM yourtable; -- ERROR. searches for `mytable` which does not exist
SELECT * FROM yourTable; -- ERROR. searches for `mytable` which does not exist
SELECT * FROM "yourTable"; -- SUCCESS
```

Note that unquoted identifiers can easily be collide with keywords.
E.g., if you want to name your column "column", you will have to use
a quoted identifier. An unquoted `column` identifier would be interpreted
as a keyword instead of an identifier.

```
CREATE TABLE foo(column int); -- INCORRECT
CREATE TABLE foo("column" int); -- Correct
```

To avoid ambiguity between identifiers and key words, we recommend to always
use quoted identifiers. Even if a query currently works with a non-quoted
identifier, future extensions might introduce additional key words. By using
quoted identifiers, your queries will be more future-proof.

For compatibility with Postgres, Hyper also supports quoted identifiers of the
form `U&"d\0061t\+000061"`. Given that Hyper always support full Unicode already
in the normal, quoted identifiers, there is no need to use this syntax, though,
and it is only implemented for compatibility reasons.

## Strings

A string constant in SQL is an arbitrary sequence of characters bounded by
single quotes (`'`), for example `'This is a string'`. To include a
single-quote character within a string constant, write two adjacent single
quotes, e.g., `'Dianne''s horse'`. Note that this is not the same as a
double-quote character (`"`).

Two string constants that are only separated by whitespace with at least one newline are concatenated and effectively treated as if the string had been written as one constant. For example:

```
SELECT 'foo'
'bar';
```

is equivalent to:

```
SELECT 'foobar';
```

but:

```
SELECT 'foo'      'bar';
```

is not valid syntax. (This slightly bizarre behavior is specified by SQL; Hyper is following the standard.)

### Strings With C-Style Escapes

Hyper also accepts string constants with escaped characters, which are an extension to
the SQL standard. An escaped string constant is specified by writing the letter
`E` (upper or lower case) just before the opening single quote, e.g., `E'foo'`.
Within an escape string, a backslash character (`\`) begins a C-like backslash
escape sequence, in which the combination of backslash and following character(s)
represent a special byte value, as shown in the following table:

Backslash Escape Sequence | Interpretation
---- | ----
`\b` | backspace
`\f` | form feed
`\n` | newline
`\r` | carriage return
`\t` | tab
`\o`, `\oo`, `\ooo` (`o` = 0–7) | octal byte value
`\xh`, `\xhh` (`h` = 0–9, A–F) | hexadecimal byte value
`\uxxxx`, `\Uxxxxxxxx` (`x` = 0–9, A–F) | 16 or 32-bit hexadecimal Unicode character value

Any other character following a backslash is taken literally. Thus, to include a backslash character, write two backslashes (`\\`). Also, a single quote can be included in an escape string by writing `\'`, in addition to the normal way of `''`.

For compatibility with Postgres, Hyper also supports quoted identifiers of the
form `U&'d\0061t\+000061'`. Given that Hyper always support full Unicode already
in normal strings, there is no need to use this syntax, though, and it is only
implemented for compatibility reasons.

### Dollar-Quoted String Constants

While the standard syntax for specifying string constants is usually convenient,
it can be difficult to understand when the desired string contains many single
quotes or backslashes, since each of those must be doubled. To allow more
readable queries in such situations, Hyper provides another way, called “dollar quoting”,
to write string constants.

A dollar-quoted string constant consists of a dollar sign (`$`), an optional “tag”
of zeroor more characters, another dollar sign, an arbitrary sequence of characters
that makes up the string content, a dollar sign, the same tag that began this dollar
quote, and a dollar sign. For example, here are two different ways to specify the
string “Dianne's horse” using dollar quoting:

```
$$Dianne's horse$$
$SomeTag$Dianne's horse$SomeTag$
```

Notice that inside the dollar-quoted string, single quotes can be used without needing to be escaped. Indeed, no characters inside a dollar-quoted string are ever escaped: the string content is always written literally. Backslashes are not special, and neither are dollar signs, unless they are part of a sequence matching the opening tag.

Hyper's dollar-quoted strings are similar to the "raw string literals" supported by C++.
Also, Postgres supports dollar quoted strings with the exact same syntax as Hyper.

## Numbers

Numeric constants are accepted in these general forms:

```sql_template
<digits>
<digits>.[<digits>][e[+-]<digits>]
[<digits>].<digits>[e[+-]<digits>]
<digits>e[+-]<digits>
```

where `digits` is one or more decimal digits (0 through 9). At least one digit must
be before or after the decimal point, if one is used. At least one digit must follow
the exponent marker (`e`), if one is present. There cannot be any spaces or other
characters embedded in the constant. Note that any leading plus or minus sign is not
actually considered part of the constant; it is an operator applied to the constant.

Some examples of valid numeric constants:

```
42
3.5
4.
.001
5e2
1.925e-3
```

## Constants Of Other Types

A constant of an arbitrary type can be entered using any one of the following notations:

```sql_template
<type> 'string'
'string'::<type>
CAST('string' AS <type>)
```

The `::` and `CAST()` syntaxes can also be used to specify run-time type conversions of arbitrary expressions, as discussed in [Type Conversions](scalar_func/conversion.md).

The `CAST()` syntax conforms to SQL. The `type 'string'` syntax is a generalization of the
standard: SQL specifies this syntax only for a few data types, but Hyper allows it
for all types (as does PostgreSQL). The syntax with :: is historical PostgreSQL usage,
which Hyper implements for compatibility reasons.

The string constant can be written using either regular SQL notation or dollar-quoting.

## Operators

An operator name is a sequence of characters from the following list:

```
+ - * / < > = ~ ! @ # % ^ & | ` ?
```

`--` and `/*` cannot appear anywhere in an operator name, since they will be taken as the start of a comment.

## Special Characters

Some characters that are not alphanumeric have a special meaning that is different from being an operator. Details on the usage can be found at the location where the respective syntax element is described. This section only exists to advise the existence and summarize the purposes of these characters.

* A dollar sign (`$`) followed by digits is used to represent a positional parameter in the body of a function definition or a prepared statement. In other contexts the dollar sign can be part of an identifier or a dollar-quoted string constant.
* Parentheses (`()`) have their usual meaning to group expressions and enforce precedence. In some cases parentheses are required as part of the fixed syntax of a particular SQL command.
* Commas (`,`) are used in some syntactical constructs to separate the elements of a list.
* The asterisk (`*`) is used in some contexts to denote all the fields of a table row or composite value. It also has a special meaning when used as the argument of an aggregate function, namely that the aggregate does not require any explicit parameter.
* The period (`.`) is used in numeric constants, and to separate schema, table, and column names.

## Comments

A comment is a sequence of characters beginning with double dashes and extending to the end of the line, e.g.:

```
-- This is a standard SQL comment
```

A comment is removed from the input stream before further syntax analysis and is effectively replaced by whitespace.
