# String Pattern Matching

There are two separate approaches to pattern matching provided by Hyper:
the traditional SQL `LIKE` operator and the more recent `SIMILAR TO`
operator (added in SQL:1999).

## `LIKE` {#like}

```sql_template
<string> LIKE <pattern> [ESCAPE <escape_character>]
<string> NOT LIKE <pattern> [ESCAPE <escape_character>]
<string> ILIKE <pattern> [ESCAPE <escape_character>]
<string> NOT ILIKE <pattern> [ESCAPE <escape_character>]
```

The `LIKE` expression returns true if the `<string>` matches the
supplied `<pattern>`. (As expected, the `NOT LIKE` expression returns
false if `LIKE` returns true, and vice versa. An equivalent expression
is `NOT (string LIKE pattern)`.)

If `<pattern>` does not contain percent signs or underscores, then the
pattern only represents the string itself; in that case `LIKE` acts like
the equals operator. An underscore (`_`) in `<pattern>` stands for
(matches) any single character; a percent sign (`%`) matches any
sequence of zero or more characters.

Some examples:

    'abc' LIKE 'abc'  → true
    'abc' LIKE 'a%'   → true
    'abc' LIKE '_b_'  → true
    'abc' LIKE 'c'    → false

`LIKE` pattern matching always covers the entire string. Therefore, if
it's desired to match a sequence anywhere within a string, the pattern
must start and end with a percent sign.

To match a literal underscore or percent sign without matching other
characters, the respective character in `<pattern>` must be preceded by
the escape character. The default escape character is the backslash but
a different one can be selected by using the `ESCAPE` clause. To match
the escape character itself, write two escape characters.

It's also possible to select no escape character by writing
`ESCAPE ''`. This effectively disables the escape mechanism, which makes
it impossible to turn off the special meaning of underscore and percent
signs in the pattern.

The key word `ILIKE` can be used instead of `LIKE` to make the match
case-insensitive according to the active locale. This is not in the SQL
standard but is a Hyper extension (similarly to PostgreSQL).

The operator `~~` is equivalent to `LIKE`, and `~~*` corresponds to
`ILIKE`. There are also `!~~` and `!~~*` operators that represent
`NOT LIKE` and `NOT ILIKE`, respectively. All of these operators are
Hyper-specific (similarly to PostgreSQL).

## Regular Expression Match Operators {#match-operators}

The available operators for pattern matching using POSIX regular expressions are:

Operator  |Description                                          |Example
----------|-----------------------------------------------------|----------------------------
`~`       |Matches regular expression, case sensitive           |`'thomas' ~ '.*thomas.*'`
`~*`      |Matches regular expression, case insensitive         |`'thomas' ~* '.*Thomas.*'`
`!~`      |Does not match regular expression, case sensitive    |`'thomas' !~ '.*Thomas.*'`
`!~*`     |Does not match regular expression, case insensitive  |`'thomas' !~* '.*vadim.*'`

Regular expressions provide a more powerful means for pattern matching
than the `LIKE` operator . Many Unix tools such as `egrep`, `sed`, or
`awk` use a pattern matching language that is similar to the one used
here, which is briefly described in [Regular Expression
Syntax](#regex-syntax) below.

A regular expression is a character sequence that is an abbreviated
definition of a set of strings (a regular set). A string is said to
match a regular expression if it is a member of the regular set
described by the regular expression. As with `LIKE`, pattern characters
match string characters exactly unless they are special characters in
the regular expression language — but regular expressions use
different special characters than `LIKE` does. Unlike `LIKE` patterns, a
regular expression is allowed to match anywhere within a string, unless
the regular expression is explicitly anchored to the beginning or end of
the string.

Some examples:

    'abc' ~ 'abc'    → true
    'abc' ~ '^a'     → true
    'abc' ~ '(b|d)'  → true
    'abc' ~ '^(b|c)' → false

## Regular Expression Syntax {#regex-syntax}

Hyper supports a subset of the POSIX regular expression syntax, which is
documented in this section.

A regular expression is defined as one or more branches, separated by
`|`. It matches anything that matches one of the branches.

A branch is zero or more quantified atoms or constraints, concatenated.
It matches a match for the first, followed by a match for the second,
etc; an empty branch matches the empty string.

A quantified atom is an atom possibly followed by a single quantifier.
Without a quantifier, it matches a match for the atom. With a
quantifier, it can match some number of matches of the atom. 
The available atoms and quantifiers are shown in the tables below.

*Atoms*:

Atom        |Description
------------|-----------
`.`         |matches any single character
`[<chars>]` |a bracket expression, matching any one of the `<chars>`
`<k>`       |(where `<k>` is a non-alphanumeric character) matches that character taken as an ordinary character, e.g., `\\` matches a backslash character
`{`         |when followed by a character other than a digit, matches the left-brace character `{`; when followed by a digit, it is the beginning of a `<bound>` (see below)
`<x>`       |where `<x>` is a single character with no other significance, matches that character

*Quantifiers*:

Quantifier     |Matches
---------------|----------------------------------------------------------------------------------------------
`*`            |a sequence of 0 or more matches of the atom
`+`            |a sequence of 1 or more matches of the atom
`?`            |a sequence of 0 or 1 matches of the atom
`{<m>}`        |a sequence of exactly `<m>` matches of the atom
`{<m>,}`       |a sequence of `<m>` or more matches of the atom
`{<m>,<n>}`    |a sequence of `<m>` through <code>&#60;n&#62;</code> (inclusive) matches of the atom; `<m>` cannot exceed <code>&#60;n&#62;</code>

The forms using `{<...>}` are known as bounds. The numbers `<m>`
and `<n>` within a bound are unsigned decimal integers with permissible
values from 0 to 255 inclusive.

A constraint matches an empty string, but matches only when specific
conditions are met. A constraint can be used where an atom could be
used, except it cannot be followed by a quantifier. The simple
constraints are:

Constraint  |Description
------------|----------------------------------------
`^`         |matches at the beginning of the string
`$`         |matches at the end of the string