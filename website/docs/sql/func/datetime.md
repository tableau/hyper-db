# Date/Time Functions and Operators {#functions-datetime}

[table_title](#functions-datetime-table) shows the available functions
for date/time value processing, with details appearing in the following
subsections. [table_title](#operators-datetime-table) illustrates the
behaviors of the basic arithmetic operators (`+`, `*`, etc.). For
formatting functions, refer to [???](#functions-formatting). You should
be familiar with the background information on date/time data types from
[???](#datatype-datetime).

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
[PostgreSQL](https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-OUTPUT)
to represent them as strings. However, when outputing interval data as a
string, Hyper uses the [ISO-8601
style](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals). An
example of interval in this format is `P1DT2H3M4S`, which corresponds to
1 day, 2 hours, 3 minutes, and 4 seconds.

While all examples here work as expected, please note that when
converting intervals to strings for output, you might see a different
format than what is shown in this page.
:::

  Operator  |Example                                                        |Result
  ----------|---------------------------------------------------------------|-----------------------------------
  `+`       |`date '2001-09-28' + integer '7'`                              |`date '2001-10-05'`
  `+`       |`date '2001-09-28' + interval '1 hour'`                        |`timestamp '2001-09-28 01:00:00'`
  `+`       |`date '2001-09-28' + time '03:00'`                             |`timestamp '2001-09-28 03:00:00'`
  `+`       |`interval '1 day' + interval '1 hour'`                         |`interval '1 day 01:00:00'`
  `+`       |`timestamp '2001-09-28 01:00' + interval '23 hours'`           |`timestamp '2001-09-29 00:00:00'`
  `+`       |`time '01:00' + interval '3 hours'`                            |`time '04:00:00'`
  `-`       |`- interval '23 hours'`                                        |`interval '-23:00:00'`
  `-`       |`date '2001-10-01' - date '2001-09-28'`                        |`integer '3'` (days)
  `-`       |`date '2001-10-01' - integer '7'`                              |`date '2001-09-24'`
  `-`       |`date '2001-09-28' - interval '1 hour'`                        |`timestamp '2001-09-27 23:00:00'`
  `-`       |`time '05:00' - time '03:00'`                                  |`interval '02:00:00'`
  `-`       |`time '05:00' - interval '2 hours'`                            |`time '03:00:00'`
  `-`       |`timestamp '2001-09-28 23:00' - interval '23 hours'`           |`timestamp '2001-09-28 00:00:00'`
  `-`       |`interval '1 day' - interval '1 hour'`                         |`interval '1 day -01:00:00'`
  `-`       |`timestamp '2001-09-29 03:00' - timestamp '2001-09-27 12:00'`  |`interval '1 day 15:00:00'`
  `*`       |`900 * interval '1 second'`                                    |`interval '00:15:00'`
  `*`       |`21 * interval '1 day'`                                        |`interval '21 days'`
  `*`       |`double precision '3.5' * interval '1 hour'`                   |`interval '03:30:00'`
  `/`       |`interval '1 hour' / double precision '1.5'`                   |`interval '00:40:00'`

  : Date/Time Operators

+-------------+-------------+-------------+-------------+-------------+
| Function    | Return Type | Description | Example     | Result      |
+=============+=============+=============+=============+=============+
| `cu         | `date`      | Current     |             |             |
| rrent_date` |             | date; see   |             |             |
|             |             | [Current    |             |             |
|             |             | Date/T      |             |             |
|             |             | ime](#funct |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-current) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `cu         | `time with  | Current     |             |             |
| rrent_time` |  time zone` | time of     |             |             |
|             |             | day; see    |             |             |
|             |             | [Current    |             |             |
|             |             | Date/T      |             |             |
|             |             | ime](#funct |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-current) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `current    | `tim        | Current     |             |             |
| _timestamp` | estamp with | date and    |             |             |
|             |  time zone` | time (start |             |             |
|             |             | of current  |             |             |
|             |             | statement); |             |             |
|             |             | see         |             |             |
|             |             | [Current    |             |             |
|             |             | Date/T      |             |             |
|             |             | ime](#funct |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-current) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `date_      | `double     | Get         | `date_pa    | `20`        |
| part(text,  |  precision` | subfield    | rt('hour',  |             |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `extract`); | 20:38:40')` |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `date       | `double     | Get         | `date       | `3`         |
| _part(text, |  precision` | subfield    | _part('mont |             |
|  interval)` |             | (equivalent | h', interva |             |
|             |             | to          | l '2 years  |             |
|             |             | `extract`); | 3 months')` |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `date_t     | `timestamp` | Truncate to | `date_tru   | `2001-02-1  |
| runc(text,  |             | specified   | nc('hour',  | 6 20:00:00` |
| timestamp)` |             | precision;  | timestamp ' |             |
|             |             | see         | 2001-02-16  |             |
|             |             | [](#fun     | 20:38:40')` |             |
|             |             | ctions-date |             |             |
|             |             | time-trunc) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `date_      | `interval`  | Truncate to | `da         | `2 day      |
| trunc(text, |             | specified   | te_trunc('h | s 03:00:00` |
|  interval)` |             | precision;  | our', inter |             |
|             |             | see         | val '2 days |             |
|             |             | [](#fun     |  3 hours 40 |             |
|             |             | ctions-date |  minutes')` |             |
|             |             | time-trunc) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `day(       | `integer`   | Get day     | `day(       | `16`        |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `E          | 20:38:40')` |             |
|             |             | XTRACT(DAY  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `day        | `integer`   | Get day     | `da         | `42`        |
| (interval)` |             | (equivalent | y(interval  |             |
|             |             | to          | '42 days')` |             |
|             |             | `E          |             |             |
|             |             | XTRACT(DAY  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `extract(   | `nu         | Get         | `extract    | `20`        |
| field from  | meric(8,6)` | subfield;   | (hour from  |             |
| timestamp)` | for field   | see [,      | timestamp ' |             |
|             | `second`    | ](#funct    | 2001-02-16  |             |
|             |             | ions-dateti | 20:38:40')` |             |
|             | `num        | me-extract) |             |             |
|             | eric(18,6)` |             |             |             |
|             | for field   |             |             |             |
|             | `epoch`     |             |             |             |
|             |             |             |             |             |
|             | `integer`   |             |             |             |
|             | for any     |             |             |             |
|             | other field |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `extract    | `nu         | Get         | `extr       | `3`         |
| (field from | meric(8,6)` | subfield;   | act(month f |             |
|  interval)` | for field   | see [,      | rom interva |             |
|             | `second`    | ](#funct    | l '2 years  |             |
|             |             | ions-dateti | 3 months')` |             |
|             | `double     | me-extract) |             |             |
|             |  precision` |             |             |             |
|             | for field   |             |             |             |
|             | `epoch`     |             |             |             |
|             |             |             |             |             |
|             | `integer`   |             |             |             |
|             | for any     |             |             |             |
|             | other field |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `hour(      | `integer`   | Get hour    | `hour(      | `20`        |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `EX         | 20:38:40')` |             |
|             |             | TRACT(HOUR  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `hour       | `integer`   | Get hour    | `hour(in    | `2`         |
| (interval)` |             | (equivalent | terval '121 |             |
|             |             | to          |  minutes')` |             |
|             |             | `EX         |             |             |
|             |             | TRACT(HOUR  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `j          | `interval`  | Adjust      | `           | `1          |
| ustify_days |             | interval so | justify_day | mon 5 days` |
| (interval)` |             | 30-day time | s(interval  |             |
|             |             | periods are | '35 days')` |             |
|             |             | represented |             |             |
|             |             | as months   |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `ju         | `interval`  | Adjust      | `ju         | `1 da       |
| stify_hours |             | interval so | stify_hours | y 03:00:00` |
| (interval)` |             | 24-hour     | (interval ' |             |
|             |             | time        | 27 hours')` |             |
|             |             | periods are |             |             |
|             |             | represented |             |             |
|             |             | as days     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `justi      | `interval`  | Adjust      | `justify_in | `29 day     |
| fy_interval |             | interval    | terval(inte | s 23:00:00` |
| (interval)` |             | using       | rval '1 mon |             |
|             |             | `ju         |  -1 hour')` |             |
|             |             | stify_days` |             |             |
|             |             | and         |             |             |
|             |             | `just       |             |             |
|             |             | ify_hours`, |             |             |
|             |             | with        |             |             |
|             |             | additional  |             |             |
|             |             | sign        |             |             |
|             |             | adjustments |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `make_da    | `date`      | Create date | `m          | `           |
| te(year int |             | from year,  | ake_date(20 | 2013-07-15` |
| , month int |             | month and   | 13, 7, 15)` |             |
| , day int)` |             | day fields  |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `make_ti    | `time`      | Create time | `m          | `           |
| me(hour int |             | from hour,  | ake_time(8, | 08:15:23.5` |
| , min int,  |             | minute and  |  15, 23.5)` |             |
| sec double  |             | seconds     |             |             |
| precision)` |             | fields      |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `make_time  | `timestamp` | Create      | `make_tim   | `           |
| stamp(year  |             | timestamp   | estamp(2013 | 2013-07-15  |
| int, month  |             | from year,  | , 7, 15, 8, | 08:15:23.5` |
| int, day in |             | month, day, |  15, 23.5)` |             |
| t, hour int |             | hour,       |             |             |
| , min int,  |             | minute and  |             |             |
| sec double  |             | seconds     |             |             |
| precision)` |             | fields      |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `minute(    | `integer`   | Get minute  | `minute(    | `38`        |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `EXTR       | 20:38:40')` |             |
|             |             | ACT(MINUTE  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `minute     | `integer`   | Get minute  | `minute(i   | `30`        |
| (interval)` |             | (equivalent | nterval '30 |             |
|             |             | to          |  minutes')` |             |
|             |             | `EXTR       |             |             |
|             |             | ACT(MINUTE  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `month(     | `integer`   | Get month   | `month(     | `2`         |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `EXT        | 20:38:40')` |             |
|             |             | RACT(MONTH  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `month      | `integer`   | Get month   | `month      | `6`         |
| (interval)` |             | (equivalent | (interval ' |             |
|             |             | to          | 6 months')` |             |
|             |             | `EXT        |             |             |
|             |             | RACT(MONTH  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `now()`     | `tim        | Current     |             |             |
|             | estamp with | date and    |             |             |
|             |  time zone` | time (start |             |             |
|             |             | of current  |             |             |
|             |             | statement); |             |             |
|             |             | see         |             |             |
|             |             | [Current    |             |             |
|             |             | Date/T      |             |             |
|             |             | ime](#funct |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-current) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `quarter(   | `integer`   | Get quarter | `quarter(   | `1`         |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `E          | 20:38:40')` |             |
|             |             | XTRACT(DAY  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `second(    | `numeric`   | Get second  | `           | `40.500`    |
| timestamp)` |             | (equivalent | second(time |             |
|             |             | to          | stamp '2001 |             |
|             |             | `EXTR       | -02-16 20:3 |             |
|             |             | ACT(SECOND  | 8:40.500')` |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `second     | `numeric`   | Get second  | `second(i   | `21.0`      |
| (interval)` |             | (equivalent | nterval '21 |             |
|             |             | to          |  seconds')` |             |
|             |             | `EXTR       |             |             |
|             |             | ACT(SECOND  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `to_timest  | `tim        | Convert     | `to_        | `2          |
| amp(double  | estamp with | Unix epoch  | timestamp(1 | 010-09-13 0 |
| precision)` |  time zone` | (seconds    | 284352323)` | 4:32:03+00` |
|             |             | since       |             |             |
|             |             | 1970-01-01  |             |             |
|             |             | 0           |             |             |
|             |             | 0:00:00+00) |             |             |
|             |             | to          |             |             |
|             |             | timestamp   |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `week(      | `integer`   | Get week    | `week(      | `7`         |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `E          | 20:38:40')` |             |
|             |             | XTRACT(DAY  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `year(      | `integer`   | Get year    | `year(      | `2001`      |
| timestamp)` |             | (equivalent | timestamp ' |             |
|             |             | to          | 2001-02-16  |             |
|             |             | `EX         | 20:38:40')` |             |
|             |             | TRACT(YEAR  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+
| `year       | `integer`   | Get year    | `yea        | `8`         |
| (interval)` |             | (equivalent | r(interval  |             |
|             |             | to          | '8 years')` |             |
|             |             | `EX         |             |             |
|             |             | TRACT(YEAR  |             |             |
|             |             | FROM ...)`) |             |             |
|             |             | see [,      |             |             |
|             |             | ](#funct    |             |             |
|             |             | ions-dateti |             |             |
|             |             | me-extract) |             |             |
+-------------+-------------+-------------+-------------+-------------+

: Date/Time Functions

Subtraction of dates and timestamps can also be complex. One
conceptually simple way to perform subtraction is to convert each value
to a number of seconds using `EXTRACT(EPOCH FROM ...)`, then subtract
the results; this produces the number of *seconds* between the two
values. This will adjust for the number of days in each month, timezone
changes, and daylight saving time adjustments. Subtraction of date or
timestamp values with the "`-`" operator returns the number of days
(24-hours) and hours/minutes/seconds between the values, making the same
adjustments. The `age` function returns years, months, days, and
hours/minutes/seconds, performing field-by-field subtraction and then
adjusting for negative field values. The following queries illustrate
the differences in these approaches. The sample results were produced
with `timezone = 'US/Eastern'`; there is a daylight saving time change
between the two dates used:

    SELECT EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
    EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00');
    Result: 10537200

    SELECT (EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
    EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00'))
    / 60 / 60 / 24;
    Result: 121.958333333333
          

## `EXTRACT`, `date_part` {#functions-datetime-extract}

EXTRACT(

field

FROM

source

)

The `extract` function retrieves subfields such as year or hour from
date/time values. \<source\> must be a value expression of type
`timestamp`, `time`, or `interval`. (Expressions of type `date` are cast
to `timestamp` and can therefore be used as well.) \<field\> is an
identifier or string that selects what field to extract from the source
value. The `extract` function returns values of type `double precision`.
The following are valid field names:

`century`

:   The century

        SELECT EXTRACT(CENTURY FROM TIMESTAMP '2000-12-16 12:21:13');
        Result: 20

        SELECT EXTRACT(CENTURY FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 21

    The first century starts at 0001-01-01 00:00:00 AD, although they
    did not know it at the time. This definition applies to all
    Gregorian calendar countries. There is no century number 0, you go
    from -1 century to 1 century. If you disagree with this, please
    write your complaint to: Pope, Cathedral Saint-Peter of Roma,
    Vatican.

`day`

:   For `timestamp` values, the day (of the month) field (1 - 31) ; for
    `interval` values, the number of days

        SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 16

        SELECT EXTRACT(DAY FROM INTERVAL '40 days 1 minute');
        Result: 40

`decade`

:   The year field divided by 10

        SELECT EXTRACT(DECADE FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 200

`dow`

:   The day of the week as Sunday (`0`) to Saturday (`6`)

        SELECT EXTRACT(DOW FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 5

    Note that `extract`\'s day of the week numbering differs from that
    of the `to_char(..., 'D')` function.

`doy`

:   The day of the year (1 - 365/366)

        SELECT EXTRACT(DOY FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 47

`epoch`

:   For `timestamp with time zone` values, the number of seconds since
    1970-01-01 00:00:00 UTC (can be negative); for `date` and
    `timestamp` values, the number of seconds since 1970-01-01 00:00:00
    local time; for `interval` values, the total number of seconds in
    the interval

        SELECT EXTRACT(EPOCH FROM TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40.12-08');
        Result: 982384720.12

        SELECT EXTRACT(EPOCH FROM INTERVAL '5 days 3 hours');
        Result: 442800

    You can convert an epoch value back to a time stamp with
    `to_timestamp`:

        SELECT to_timestamp(982384720.12);
        Result: 2001-02-17 04:38:40.12+00

`hour`

:   The hour field (0 - 23)

        SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 20

`isodow`

:   The day of the week as Monday (`1`) to Sunday (`7`)

        SELECT EXTRACT(ISODOW FROM TIMESTAMP '2001-02-18 20:38:40');
        Result: 7

    This is identical to `dow` except for Sunday. This matches the ISO
    8601 day of the week numbering.

`isoyear`

:   The ISO 8601 week-numbering year that the date falls in (not
    applicable to intervals)

        SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-01');
        Result: 2005
        SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-02');
        Result: 2006

    Each ISO 8601 week-numbering year begins with the Monday of the week
    containing the 4th of January, so in early January or late December
    the ISO year may be different from the Gregorian year. See the
    `week` field for more information.

`microseconds`

:   The seconds field, including fractional parts, multiplied by 1 000
    000; note that this includes full seconds

        SELECT EXTRACT(MICROSECONDS FROM TIME '17:12:28.5');
        Result: 28500000

`millennium`

:   The millennium

        SELECT EXTRACT(MILLENNIUM FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 3

    Years in the 1900s are in the second millennium. The third
    millennium started January 1, 2001.

`milliseconds`

:   The seconds field, including fractional parts, multiplied by 1000.
    Note that this includes full seconds.

        SELECT EXTRACT(MILLISECONDS FROM TIME '17:12:28.5');
        Result: 28500

`minute`

:   The minutes field (0 - 59)

        SELECT EXTRACT(MINUTE FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 38

`month`

:   For `timestamp` values, the number of the month within the year
    (1 - 12) ; for `interval` values, the number of months, modulo 12
    (0 - 11)

        SELECT EXTRACT(MONTH FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 2

        SELECT EXTRACT(MONTH FROM INTERVAL '2 years 3 months');
        Result: 3

        SELECT EXTRACT(MONTH FROM INTERVAL '2 years 13 months');
        Result: 1

`quarter`

:   The quarter of the year (1 - 4) that the date is in

        SELECT EXTRACT(QUARTER FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 1

`second`

:   The seconds field, including fractional parts (0 - 59[^1])

        SELECT EXTRACT(SECOND FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 40

        SELECT EXTRACT(SECOND FROM TIME '17:12:28.5');
        Result: 28.5

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

    In the ISO week-numbering system, it is possible for early-January
    dates to be part of the 52nd or 53rd week of the previous year, and
    for late-December dates to be part of the first week of the next
    year. For example, `2005-01-01` is part of the 53rd week of year
    2004, and `2006-01-01` is part of the 52nd week of year 2005, while
    `2012-12-31` is part of the first week of 2013. It\'s recommended to
    use the `isoyear` field together with `week` to get consistent
    results.

        SELECT EXTRACT(WEEK FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 7

`year`

:   The year field. Keep in mind there is no `0 AD`, so subtracting `BC`
    years from `AD` years should be done with care.

        SELECT EXTRACT(YEAR FROM TIMESTAMP '2001-02-16 20:38:40');
        Result: 2001

The `extract` function is primarily intended for computational
processing. For formatting date/time values for display, see
[???](#functions-formatting).

The `date_part` function is modeled on the traditional Ingres equivalent
to the SQL-standard function `extract`: date_part(\'\<field\>\',
\<source\>) Note that here the \<field\> parameter needs to be a string
value, not a name. The valid field names for `date_part` are the same as
for `extract`.

    SELECT date_part('day', TIMESTAMP '2001-02-16 20:38:40');
    Result: 16

    SELECT date_part('hour', INTERVAL '4 hours 3 minutes');
    Result: 4

## `date_trunc` {#functions-datetime-trunc}

The function `date_trunc` is conceptually similar to the `trunc`
function for numbers.

date_trunc(\<field\>, \<source\> \[, \<time_zone\> \]) \<source\> is a
value expression of type `timestamp`, `timestamp with time zone`, or
`interval`. (Values of type `date` and `time` are cast automatically to
`timestamp` or `interval`, respectively.) \<field\> selects to which
precision to truncate the input value. The return value is likewise of
type `timestamp`, `timestamp with time zone`, or `interval`, and it has
all fields that are less significant than the selected one set to zero
(or one, for day and month).

Valid values for \<field\> are: `microseconds`, `milliseconds`,
`second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`,
`decade`, `century`, `millennium`

If \<source\> is of type `interval`, then \<field\> may not be `week`.
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

## Current Date/Time {#functions-datetime-current}

Hyper provides a number of functions that return values related to the
current date and time. These SQL-standard functions all return values
based on the start time of the current statement: CURRENT_DATE
CURRENT_TIME CURRENT_TIMESTAMP CURRENT_TIME(\<precision\>)
CURRENT_TIMESTAMP(\<precision\>)

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

[^1]: can be 60 on leap seconds