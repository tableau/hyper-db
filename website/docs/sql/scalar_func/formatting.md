# Data Type Formatting Functions

The Hyper formatting functions provide a powerful set of tools for
converting various data types to formatted strings and for converting
from formatted strings to specific data types.
The table below lists them. These functions
all follow a common calling convention: the first argument is the value
to be formatted and the second argument is a template that defines the
output or input format.

Function                                                |Description                  |Example
--------------------------------------------------------|-----------------------------|------------------------------------------------
`to_char(timestamp, text)` → `text`                     |convert timestamp to string  |`to_char(current_timestamp, 'HH12:MI:SS')`
`to_char(interval, text)`  → `text`                     |convert interval to string   |`to_char(interval '15h 2m 12s', 'HH24:MI:SS')`
`to_date(text, text)`      → `date`                     |convert string to date       |`to_date('05 Dec 2000', 'DD Mon YYYY')`
`to_timestamp(text, text)` → `timestamp with time zone` |convert string to timestamp  |`to_timestamp('05 Dec 2000', 'DD Mon YYYY')`

:::note
There is also a single-argument `to_timestamp` function; see
[Date/Time functions](datetime).
:::

:::tip
`to_timestamp` and `to_date` exist to handle input formats that cannot
be converted by simple casting. For most standard date/time formats,
simply casting the source string to the required data type works, and is
much easier.
:::

In a `to_char` output template string, there are certain patterns that
are recognized and replaced with appropriately-formatted data based on
the given value. Any text that is not a template pattern is simply
copied verbatim. Similarly, in an input template string (for the other
functions), template patterns identify the values to be supplied by the
input data string. If there are characters in the template string that
are not template patterns, the corresponding characters in the input
data string are simply skipped over (whether or not they are equal to
the template string characters).

The template patterns available for formatting date and time values are:

Pattern                           |Description
----------------------------------|--------------------------------------------------------------------------------------------------
`HH`                              |hour of day (01-12)
`HH12`                            |hour of day (01-12)
`HH24`                            |hour of day (00-23)
`MI`                              |minute (00-59)
`SS`                              |second (00-59)
`MS`                              |millisecond (000-999)
`US`                              |microsecond (000000-999999)
`SSSS`                            |seconds past midnight (0-86399)
`AM`, `am`, `PM` or `pm`          |meridiem indicator (without periods)
`A.M.`, `a.m.`, `P.M.` or `p.m.`  |meridiem indicator (with periods)
`Y,YYY`                           |year (4 or more digits) with comma
`YYYY`                            |year (4 or more digits)
`YYY`                             |last 3 digits of year
`YY`                              |last 2 digits of year
`Y`                               |last digit of year
`IYYY`                            |ISO 8601 week-numbering year (4 or more digits)
`IYY`                             |last 3 digits of ISO 8601 week-numbering year
`IY`                              |last 2 digits of ISO 8601 week-numbering year
`I`                               |last digit of ISO 8601 week-numbering year
`BC`, `bc`, `AD` or `ad`          |era indicator (without periods)
`B.C.`, `b.c.`, `A.D.` or `a.d.`  |era indicator (with periods)
`MONTH`                           |full upper case English month name (blank-padded to 9 chars)
`Month`                           |full capitalized English month name (blank-padded to 9 chars)
`month`                           |full lower case English month name (blank-padded to 9 chars)
`MON`                             |abbreviated upper case English month name (3 chars)
`Mon`                             |abbreviated capitalized English month name (3 chars)
`mon`                             |abbreviated lower case English month name (3 chars)
`MM`                              |month number (01-12)
`DAY`                             |full upper case English day name (blank-padded to 9 chars)
`Day`                             |full capitalized English day name (blank-padded to 9 chars)
`day`                             |full lower case English day name (blank-padded to 9 chars)
`DY`                              |abbreviated upper case English day name (3 chars)
`Dy`                              |abbreviated capitalized English day name (3 chars)
`dy`                              |abbreviated lower case English day name (3 chars)
`DDD`                             |day of year (001-366)
`IDDD`                            |day of ISO 8601 week-numbering year (001-371; day 1 of the year is Monday of the first ISO week)
`DD`                              |day of month (01-31)
`D`                               |day of the week, Sunday (`1`) to Saturday (`7`)
`ID`                              |ISO 8601 day of the week, Monday (`1`) to Sunday (`7`)
`W`                               |week of month (1-5) (the first week starts on the first day of the month)
`WW`                              |week number of year (1-53) (the first week starts on the first day of the year)
`IW`                              |week number of ISO 8601 week-numbering year (01-53; the first Thursday of the year is in week 1)
`CC`                              |century (2 digits) (the twenty-first century starts on 2001-01-01)
`J`                               |Julian Day (integer days since November 24, 4714 BC at midnight UTC)
`Q`                               |quarter
`RM`                              |month in upper case Roman numerals (I-XII; I=January)
`rm`                              |month in lower case Roman numerals (i-xii; i=January)
`TZ`                              |upper case time-zone abbreviation (only supported in `to_char`)
`tz`                              |lower case time-zone abbreviation (only supported in `to_char`)
`TZH`                             |time-zone hours
`TZM`                             |time-zone minutes
`OF`                              |time-zone offset from UTC (only supported in `to_char`)

Modifiers can be applied to any template pattern to alter its behavior.
For example, `FMMonth` is the `Month` pattern with the `FM` modifier.
The modifier patterns for date/time formatting are

Modifier     |Description                                             |Example
-------------|--------------------------------------------------------|----------------------
`FM` prefix  |fill mode (suppress leading zeroes and padding blanks)  |`FMMonth`
`TH` suffix  |upper case ordinal number suffix                        |`DDTH`, e.g., `12TH`
`th` suffix  |lower case ordinal number suffix                        |`DDth`, e.g., `12th`

Usage notes for date/time formatting:

-   `FM` suppresses leading zeroes and trailing blanks that would
    otherwise be added to make the output of a pattern be fixed-width.
    In Hyper, as well as in PostgreSQL, `FM` modifies only the next
    specification, while in other database systems `FM` might affect all
    subsequent specifications, and repeated `FM` modifiers toggle fill
    mode on and off.

-   Ordinary text is allowed in `to_char` templates and will be output
    literally. You can put a substring in double quotes to force it to
    be interpreted as literal text even if it contains template
    patterns. For example, in `'"Hello Year "YYYY'`, the `YYYY` will be
    replaced by the year data, but the single `Y` in `Year` will not be.
    In `to_timestamp` and `to_date`, literal text and double-quoted
    strings result in skipping the number of characters contained in the
    string; for example `"XX"` skips two input characters (whether or
    not they are `XX`).

-   If you want to have a double quote in the output you must precede it
    with a backslash, for example `'\"YYYY Month\"'`. Backslashes are
    not otherwise special outside of double-quoted strings. Within a
    double-quoted string, a backslash causes the next character to be
    taken literally, whatever it is (but this has no special effect
    unless the next character is a double quote or another backslash).

-   In `to_timestamp` and `to_date`, the `YYYY` conversion has a
    restriction when processing years with more than 4 digits. You must
    use some non-digit character or template after `YYYY`, otherwise the
    year is always interpreted as 4 digits. For example (with the year
    20000): `to_date('200001131', 'YYYYMMDD')` will be interpreted as a
    4-digit year; instead use a non-digit separator after the year, like
    `to_date('20000-1131', 'YYYY-MMDD')` or
    `to_date('20000Nov31', 'YYYYMonDD')`.

-   In `to_timestamp` and `to_date`, the `CC` (century) field is
    accepted but ignored if there is a `YYY`, `YYYY` or `Y,YYY` field.
    If `CC` is used with `YY` or `Y` then the result is computed as that
    year in the specified century. If the century is specified but the
    year is not, the first year of the century is assumed.

-   In `to_timestamp` and `to_date`, an ISO 8601 week-numbering date (as
    distinct from a Gregorian date) can be specified in one of two ways:

    -   Year, week number, and weekday: for example
        `to_date('2006-42-4', 'IYYY-IW-ID')` returns the date
        `2006-10-19`. If you omit the weekday it is assumed to be 1
        (Monday).

    -   Year and day of year: for example
        `to_date('2006-291', 'IYYY-IDDD')` also returns `2006-10-19`.

    Attempting to enter a date using a mixture of ISO 8601
    week-numbering fields and Gregorian date fields is contradictory and
    will thus cause an error. In the context of an ISO 8601
    week-numbering year, the concept of a "month" or "day of month" has
    no meaning. On the other hand, in the context of a Gregorian year,
    the ISO week has no meaning.

    :::caution
    While `to_date` and `to_timestamp` will reject a mixture of
    Gregorian and ISO week-numbering date fields, `to_char` will not,
    since output format specifications like `YYYY-MM-DD (IYYY-IDDD)` can
    be useful. But avoid writing something like `IYYY-MM-DD`; that would
    yield surprising results near the start of the year.
    :::

-   In `to_timestamp`, millisecond (`MS`) or microsecond (`US`) fields
    are used as the seconds digits after the decimal point. For example
    `to_timestamp('12.3', 'SS.MS')` is not 3 milliseconds, but 300,
    because the conversion treats it as 12 + 0.3 seconds. So, for the
    format `SS.MS`, the input values `12.3`, `12.30`, and `12.300`
    specify the same number of milliseconds. To get three milliseconds,
    one must write `12.003`, which the conversion treats as 12 + 0.003 =
    12.003 seconds.

    Here is a more complex example:
    `to_timestamp('15:12:02.020.001230', 'HH24:MI:SS.MS.US')` is 15
    hours, 12 minutes, and 2 seconds + 20 milliseconds + 1230
    microseconds = 2.021230 seconds.

-   `to_char(..., 'ID')`'s day of the week numbering matches the
    `extract(isodow from ...)` function, but `to_char(..., 'D')`'s does
    not match `extract(dow from ...)`'s day numbering.

-   `to_char(interval)` formats `HH` and `HH12` as shown on a 12-hour
    clock, for example zero hours and 36 hours both output as `12`,
    while `HH24` outputs the full hour value, which can exceed 23 in an
    `interval` value.

Some examples of the use of the `to_char` function.

    to_char(current_timestamp, 'Day, DD HH12:MI:SS')      → 'Tuesday , 06 05:39:18'
    to_char(current_timestamp, 'FMDay, FMDD HH12:MI:SS')  → 'Tuesday, 6 05:39:18'