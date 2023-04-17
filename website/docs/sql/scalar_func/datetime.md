# Date/Time Functions and Operators

[table_title](#datetime-table) shows the available functions
for date/time value processing, with details appearing in the following
subsections. [table_title](#operators-datetime-table) illustrates the
behaviors of the basic arithmetic operators (`+`, `*`, etc.). For
formatting functions, refer to [???](#formatting). You should
be familiar with the background information on date/time data types from
[???](#datetime).

Most of the functions and operators described below that take `time` or
`timestamp` inputs actually come in two variants: one that takes
`time with time zone` or `timestamp with time zone`, and one that takes
`time without time zone` or `timestamp without time zone`. For brevity,
these variants are not shown separately. Also, the `+` and `*` operators
come in commutative pairs (for example both date + integer and integer +
date); we show only one of each such pair.

:::note
The examples in this section that show `interval` values use a
human-readable style similar to
[PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html#INTERVAL-OUTPUT)
to represent them as strings. However, when outputing interval data as a
string, Hyper uses the [ISO-8601
style](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). An
example of interval in this format is `P1DT2H3M4S`, which corresponds to
1 day, 2 hours, 3 minutes, and 4 seconds.

While all examples here work as expected, please note that when
converting intervals to strings for output, you might see a different
format than what is shown in this page.
:::

## Operators

Basic arithemtic operatos (`+`, `-`, `*`, `/`) are also available for dates, times and intervals.

Operator|Example
---|---
`+`|`date '2001-09-28' + integer '7'` → `date '2001-10-05'`
`+`|`date '2001-09-28' + interval '1 hour'` → `timestamp '2001-09-28 01:00:00'`
`+`|`date '2001-09-28' + time '03:00'` → `timestamp '2001-09-28 03:00:00'`
`+`|`interval '1 day' + interval '1 hour'` → `interval '1 day 01:00:00'`
`+`|`timestamp '2001-09-28 01:00' + interval '23 hours'` → `timestamp '2001-09-29 00:00:00'`
`+`|`time '01:00' + interval '3 hours'` → `time '04:00:00'`
`-`|`- interval '23 hours'` → `interval '-23:00:00'`
`-`|`date '2001-10-01' - date '2001-09-28'` → `integer '3'` (days)
`-`|`date '2001-10-01' - integer '7'` → `date '2001-09-24'`
`-`|`date '2001-09-28' - interval '1 hour'` → `timestamp '2001-09-27 23:00:00'`
`-`|`time '05:00' - time '03:00'` → `interval '02:00:00'`
`-`|`time '05:00' - interval '2 hours'` → `time '03:00:00'`
`-`|`timestamp '2001-09-28 23:00' - interval '23 hours'` → `timestamp '2001-09-28 00:00:00'`
`-`|`interval '1 day' - interval '1 hour'` → `interval '1 day -01:00:00'`
`-`|`timestamp '2001-09-29 03:00' - timestamp '2001-09-27 12:00'` → `interval '1 day 15:00:00'`
`*`|`900 * interval '1 second'` → `interval '00:15:00'`
`*`|`21 * interval '1 day'` → `interval '21 days'`
`*`|`double precision '3.5' * interval '1 hour'` → `interval '03:30:00'`
`/`|`interval '1 hour' / double precision '1.5'` → `interval '00:40:00'`

## Functions

Function|Description|Example
---|---|---
`current_date` → `date`|Current date; see [Current Date/Time](#datetime-current)
`current_time` → `time with time zone`|Current time of  day; see [Current Date/Time](#datetime-current)
`current_timestamp` → `timestamp with time zone`|Current date and time (start of current statement); see [Current Date/Time](#datetime-current)
`date_part(text, timestamp)` →`double precision`|Get subfield (equivalent to [EXTRACT](#datetime-extract))|`date_part('hour', timestamp '2001-02-16 20:38:40')` → `20`
`date_part(text, interval)` → `double precision`|Get subfield (equivalent to [EXTRACT](#datetime-extract))|`date_part('month', interval '2 years 3 months')` → `3`
`date_trunc(text, timestamp)` → `timestamp`|Truncate to specified precision; see [date_trunc](#datetime-trunc)|`date_trunc('hour', timestamp '2001-02-16 20:38:40')` → `2001-02-16 20:00:00`
`date_trunc(text, interval)` → `interval`|Truncate to specified precision; see [date_trunc](#datetime-trunc)|`date_trunc('hour', interval '2 days 3 hours 40 minutes')` → `2 days 03:00:00`
`day(timestamp)` → `integer`|Get day (equivalent to `EXTRACT(DAY FROM ...)`)|`day(timestamp '2001-02-16 20:38:40')` → `16`
`day(interval)` → `integer`|Get day (equivalent to `EXTRACT(DAY FROM ...)`)|`day(interval '42 days')` → `42`
`extract(field from timestamp)` → variadic|Get subfield; see [EXTRACT](#datetime-extract)|`extract (hour from timestamp '2001-02-16 20:38:40')` → `20`
`extract (field from interval)` → variadic|Get subfield; see [EXTRACT](#datetime-extract)|`extract(month from interval '2 years3 months')` → `3`
`hour(timestamp)` → `integer`|Get hour (equivalent to `EXTRACT(HOUR FROM ...)`)|`hour(timestamp '2001-02-16 20:38:40')` → `20`
`hour(interval)` → `integer`|Get hour (equivalent to `EXTRACT(HOUR FROM ...)`)|`hour(interval '121 minutes')` → `2`
`justify_days(interval)` → `interval`|Adjust interval so 30-day time periods are represented as months|`justify_days(interval '35 days')` → `1 mon 5 days`
`justify_hours(interval)` → `interval`|Adjust interval so 24-hour time periods are represented as days|`justify_hours (interval '27 hours')` → `1 day 03:00:00`
`justify_interval(interval)` → `interval`|Adjust interval using `justify_days` and `justify_hours`, with additional sign adjustments|`justify_interval(interval '1 mon -1 hour')` → `29 days 23:00:00`
`make_date(year int, month int, day int)` → `date`|Create date from year, month and day fields|`make_date(2013, 7, 15)` → `2013-07-15`
`make_time(hour int, min int, sec double precision)` → `time`|Create time from hour, minute and seconds fields|`make_time(8,15, 23.5)` → `08:15:23.5`
`make_timestamp(year int, month int, day int, hour int, min int, sec double precision)` → `timestamp`|Create timestamp from year, month, day, hour, minute and seconds fields|`make_timestamp(2013, 7, 15, 8,15, 23.5)` → `2013-07-15 08:15:23.5`
`minute(timestamp)` → `integer`|Get minute (equivalent to `EXTRACT(MINUTE FROM ...)`)|`minute(timestamp '2001-02-16 20:38:40')` → `38`
`minute(interval)` → `integer`|Get minute (equivalent to `EXTRACT(MINUTE FROM ...)`)|`minute(interval '30 minutes')` → `30`
`month(timestamp)` → `integer`|Get month (equivalent to `EXTRACT(MONTH FROM ...)`)|`month(timestamp '2001-02-16 20:38:40')` → `2`
`month(interval)` → `integer`|Get month (equivalent to `EXTRACT(MONTH FROM ...)`)|`month (interval '6 months')` → `6`
`now()` → `timestamp with time zone`|Current date and time (start of current statement); see [Current Date/Time](#datetime-current)|||
`quarter(timestamp)` → `integer`|Get quarter (equivalent to `EXTRACT(DAY FROM ...)`)|`quarter(timestamp '2001-02-16 20:38:40')` → `1`
`second(timestamp)` → `numeric`|Get second (equivalent to `EXTRACT(SECOND FROM ...)`)|`second(timestamp '2001-02-16 20:38:40.500')` → `40.500`
`second (interval)` → `numeric`|Get second (equivalent to `EXTRACT(SECOND FROM ...)`)|`second(interval '21 seconds')` → `21.0`
`to_timestamp(double precision)` → `timestamp with time zone`|Convert Unix epoch (seconds since 1970-01-01 00:00:00+00) to timestamp|`to_timestamp(1284352323)` → `2010-09-13 04:32:03+00`
`week(timestamp)` → `integer`|Get week (equivalent to `EXTRACT(DAY FROM ...)`)|`week(timestamp '2001-02-16 20:38:40')` → `7`
`year(timestamp)` → `integer`|Get year (equivalent to `EXTRACT(YEAR FROM ...)`)|`year(timestamp '2001-02-16 20:38:40')` → `2001`
`year (interval)` → `integer`|Get year (equivalent to `EXTRACT(YEAR FROM ...)`)|`year(interval '8 years')` → `8`

Subtraction of dates and timestamps can also be complex. One
conceptually simple way to perform subtraction is to convert each value
to a number of seconds using `EXTRACT(EPOCH FROM ...)`, then subtract
the results; this produces the number of *seconds* between the two
values. This will adjust for the number of days in each month, timezone
changes, and daylight saving time adjustments. Subtraction of date or
timestamp values with the "`-`" operator returns the number of days
(24-hours) and hours/minutes/seconds between the values, making the same
adjustments. The following queries illustrate the differences in these
approaches. The sample results were produced with `timezone = 'US/Eastern'`;
there is a daylight saving time change between the two dates used:

    SELECT EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
    EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00');
    Result: 10537200

    SELECT (EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
    EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00'))
    / 60 / 60 / 24;
    Result: 121.958333333333

    SELECT timestamptz '2013-07-01 12:00:00' - timestamptz '2013-03-01 12:00:00';
    Result: 121 days 23:00:00


## `EXTRACT` {#datetime-extract}

```sql_template
EXTRACT(<field> FROM <source>)
```

The `extract` function retrieves subfields such as year or hour from
date/time values. `<source>` must be a value expression of type
`timestamp`, `time`, or `interval`. (Expressions of type `date` are cast
to `timestamp` and can therefore be used as well.) `<field>` is an
identifier or string that selects what field to extract from the source
value.

The result type of `extract` depends on the given `<field>`:
`numeric(8,6)` for field `second`, `numeric(18,6)` for field `epoch`, and
`integer` for any other field.

The following are valid field names:

`century`
:   The century.
    The first century starts at 0001-01-01 00:00:00 AD, although they
    did not know it at the time. This definition applies to all
    Gregorian calendar countries. There is no century number 0, you go
    from -1 century to 1 century. If you disagree with this, please
    write your complaint to: Pope, Cathedral Saint-Peter of Roma,
    Vatican.

```
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2000-12-16 12:21:13');
Result: 20

SELECT EXTRACT(CENTURY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 21
```

`day`
:   For `timestamp` values, the day (of the month) field (1 - 31) ; for
    `interval` values, the number of days

```
SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 16

SELECT EXTRACT(DAY FROM INTERVAL '40 days 1 minute');
Result: 40
```

`decade`
:   The year field divided by 10

```
SELECT EXTRACT(DECADE FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 200
```

`dow`
:   The day of the week as Sunday (`0`) to Saturday (`6`).
    Note that `extract`'s day of the week numbering differs from that
    of the `to_char(..., 'D')` function.

```
SELECT EXTRACT(DOW FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 5
```

`doy`
:   The day of the year (1 - 365/366)

```
SELECT EXTRACT(DOY FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 47
```

`epoch`
:   For `timestamp with time zone` values, the number of seconds since
    1970-01-01 00:00:00 UTC (can be negative); for `date` and
    `timestamp` values, the number of seconds since 1970-01-01 00:00:00
    local time; for `interval` values, the total number of seconds in
    the interval

```
SELECT EXTRACT(EPOCH FROM TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40.12-08');
Result: 982384720.12

SELECT EXTRACT(EPOCH FROM INTERVAL '5 days 3 hours');
Result: 442800
```

You can convert an epoch value back to a time stamp with
`to_timestamp`:

```
SELECT to_timestamp(982384720.12);
Result: 2001-02-17 04:38:40.12+00
```

`hour`
:   The hour field (0 - 23)

```
SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 20
```

`isodow`
:   The day of the week as Monday (`1`) to Sunday (`7`).
    This is identical to `dow` except for Sunday. This matches the ISO
    8601 day of the week numbering.

```
SELECT EXTRACT(ISODOW FROM TIMESTAMP '2001-02-18 20:38:40');
Result: 7
```

`isoyear`
:   The ISO 8601 week-numbering year that the date falls in (not
    applicable to intervals).
    Each ISO 8601 week-numbering year begins with the Monday of the week
    containing the 4th of January, so in early January or late December
    the ISO year may be different from the Gregorian year. See the
    `week` field for more information.

```
SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-01');
Result: 2005
SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-02');
Result: 2006
```

`microseconds`
:   The seconds field, including fractional parts, multiplied by 1 000
    000; note that this includes full seconds

```
SELECT EXTRACT(MICROSECONDS FROM TIME '17:12:28.5');
Result: 28500000
```

`millennium`
:   The millennium.
    Years in the 1900s are in the second millennium. The third
    millennium started January 1, 2001.

```
SELECT EXTRACT(MILLENNIUM FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 3
```

`milliseconds`
:   The seconds field, including fractional parts, multiplied by 1000.
    Note that this includes full seconds.

```
SELECT EXTRACT(MILLISECONDS FROM TIME '17:12:28.5');
Result: 28500
```

`minute`
:   The minutes field (0 - 59)

```
SELECT EXTRACT(MINUTE FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 38
```

`month`
:   For `timestamp` values, the number of the month within the year
    (1 - 12) ; for `interval` values, the number of months, modulo 12
    (0 - 11)

```
SELECT EXTRACT(MONTH FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 2

SELECT EXTRACT(MONTH FROM INTERVAL '2 years 3 months');
Result: 3

SELECT EXTRACT(MONTH FROM INTERVAL '2 years 13 months');
Result: 1
```

`quarter`
:   The quarter of the year (1 - 4) that the date is in

```
SELECT EXTRACT(QUARTER FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 1
```

`second`

:   The seconds field, including fractional parts (0 - 59; can be 60 on leap seconds)

```
SELECT EXTRACT(SECOND FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 40

SELECT EXTRACT(SECOND FROM TIME '17:12:28.5');
Result: 28.5
```

`timezone`
:   The time zone offset from UTC, measured in seconds. Positive values
    correspond to time zones east of UTC, negative values to zones west
    of UTC. (Technically, Hyper does not use UTC because leap seconds
    are not handled.)

`timezone_hour`
:   The hour component of the time zone offset

`timezone_minute`
:   The minute component of the time zone offset

`week`
:   The number of the ISO 8601 week-numbering week of the year. By
    definition, ISO weeks start on Mondays and the first week of a year
    contains January 4 of that year. In other words, the first Thursday
    of a year is in week 1 of that year.
:   In the ISO week-numbering system, it is possible for early-January
    dates to be part of the 52nd or 53rd week of the previous year, and
    for late-December dates to be part of the first week of the next
    year. For example, `2005-01-01` is part of the 53rd week of year
    2004, and `2006-01-01` is part of the 52nd week of year 2005, while
    `2012-12-31` is part of the first week of 2013. It's recommended to
    use the `isoyear` field together with `week` to get consistent
    results.

```
SELECT EXTRACT(WEEK FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 7
```

`year`

:   The year field. Keep in mind there is no `0 AD`, so subtracting `BC`
    years from `AD` years should be done with care.

```
SELECT EXTRACT(YEAR FROM TIMESTAMP '2001-02-16 20:38:40');
Result: 2001
```

The `extract` function is primarily intended for computational
processing. For formatting date/time values for display, see
[Formatting Functions](formatting).

## `date_part` {#datetime-datepart}

The `date_part` function is modeled on the traditional Ingres/PostgresQL
equivalent to the SQL-standard function `extract`:

```sql_template
date_part(<field>, <source>)
```

Note that here the `<field>` parameter needs to be a string
value, not a name. The valid field names for `date_part` are the same as
for `extract`. In contrast to `extract`, the result type of `date_part`
is always `double precision`, independent of the selected field.

```
SELECT date_part('day', TIMESTAMP '2001-02-16 20:38:40');
Result: 16

SELECT date_part('hour', INTERVAL '4 hours 3 minutes');
Result: 4
```

## `date_trunc` {#datetime-trunc}

The function `date_trunc` is conceptually similar to the `trunc`
function for numbers.

```sql_template
date_trunc(<field>, <source> [, <time_zone>])
```

`<source>` is a value expression of type `timestamp`,
`timestamp with time zone`, or `interval`. (Values of type `date` and
`time` are cast automatically to `timestamp` or `interval`, respectively.)
`<field>` selects to which precision to truncate the input value. The
return value is likewise of type `timestamp`, `timestamp with time zone`,
or `interval`, and it has all fields that are less significant than the
selected one set to zero (or one, for day and month).

Valid values for `<field>` are: `microseconds`, `milliseconds`,
`second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`,
`decade`, `century`, `millennium`

If `<source>` is of type `interval`, then `<field>` may not be `week`.
This is because a month may contain a fractional number of weeks, and
thus truncation to weeks is not possible in the general case.

When the input value is of type `timestamp with time zone`, the
truncation is performed with respect to a particular time zone; for
example, truncation to `day` produces a value that is midnight in that
zone. By default, truncation is done with respect to the current time
zone.

A time zone cannot be specified when processing
`timestamp without time zone` or `interval` inputs. These are always
taken at face value.

Examples (assuming the local time zone is `America/New_York`):

    SELECT date_trunc('hour', TIMESTAMP '2001-02-16 20:38:40');
    Result: 2001-02-16 20:00:00

    SELECT date_trunc('year', TIMESTAMP '2001-02-16 20:38:40');
    Result: 2001-01-01 00:00:00

    SELECT date_trunc('hour', INTERVAL '3 days 02:47:33');
    Result: 3 days 02:00:00

    SELECT date_trunc('day', TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40+00');
    Result: 2001-02-16 00:00:00-05

## Current Date/Time {#datetime-current}

Hyper provides a number of functions that return values related to the
current date and time. These SQL-standard functions all return values
based on the start time of the current statement:

```sql_template
CURRENT_DATE
CURRENT_TIME CURRENT_TIMESTAMP CURRENT_TIME(<precision>)
CURRENT_TIMESTAMP(<precision>)
```

The return value of both `CURRENT_TIME` and `CURRENT_TIMESTAMP` contains
the time zone.

Some examples:

    SELECT CURRENT_TIME;
    Result: 14:39:53.662522-05

    SELECT CURRENT_DATE;
    Result: 2001-12-23

    SELECT CURRENT_TIMESTAMP;
    Result: 2001-12-23 14:39:53.662522-05

All the date/time data types also accept the special literal value `now`
to specify the current date and time. Thus, the following three all
return the same result:

    SELECT CURRENT_TIMESTAMP;
    SELECT now();
    SELECT TIMESTAMP 'now';
    CREATE TABLE a (t TIMESTAMP DEFAULT 'now');

In the fourth example, the current timestamp at time of insertion of a
tuple will be used, and not the timestamp of table creation. This works
differently in PostgreSQL, where the table creation timestamp is used in
every insertion that uses the default value.

