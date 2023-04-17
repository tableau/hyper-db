# Date/Time Types

Hyper supports the set of SQL date and time types shown in the table below.
The operations available on these data types are described in
[Date/Time Functions and Operators](/docs/sql/scalar_func/datetime). Dates are
counted according to the Gregorian calendar, even in years before that
calendar was introduced.

Name                             |Storage Size  |Description                             |Range       |Resolution
---------------------------------|--------------|----------------------------------------|------------------|---------------
`timestamp [without time zone]`  |8 bytes       |both date and time (no time zone)       |4713 BC - 294276 AD        |1 microsecond
`timestamp with time zone`       |8 bytes       |both date and time, with time zone      |4713 BC - 294276 AD        |1 microsecond
`date`                           |4 bytes       |date (no time of day)                   |4713 BC - 5874897 AD       |1 day
`time`                           |8 bytes       |time of day (no date and no time zone)  |00:00:00 - 24:00:00         |1 microsecond
`interval`                       |16 bytes      |time interval                           |-178000000 years - 178000000 years  |1 microsecond

:::note
The SQL standard requires that writing just `timestamp` be equivalent to
`timestamp without time zone`, and Hyper honors that behavior.
`timestamptz` is accepted as an abbreviation for
`timestamp with time zone`; this is a Hyper extension, also available in
PostgreSQL
:::

The type `time with time zone` is defined by the SQL standard, but not
supported in Hyper. In most cases, a combination of `date`, `time`,
`timestamp without time zone`, and `timestamp with time zone` should
provide a complete range of date/time functionality required by any
application.

## Date/Time Input {#datetime-input}

Date and time input is accepted in almost any reasonable format,
including ISO 8601 and SQL-compatible. For some formats, ordering of
day, month, and year in date input is ambiguous. The expected ordering
of these fields can be selected by the user using the
[date_style](/docs/hyper-api/connection#date_style) setting. Set it to `MDY` to select
month-day-year interpretation, `DMY` to select day-month-year
interpretation, or `YMD` to select year-month-day interpretation.

Any date or time literal input needs to be enclosed in single quotes,
like text strings. SQL requires the following syntax:

    type  'value'

For example:

    SELECT date '1999-01-08';
    SELECT time '04:05:06.789';
    SELECT timestamp with time zone '2004-10-19 10:23:54+02';

### Dates

Some possible inputs for the `date` type:

Example           |Description
------------------|-----------------------------------------------------------------------------------------------
1999-01-08        |ISO 8601; January 8 in any mode (recommended format)
January 8, 1999   |unambiguous in any [date_style](#date_style) input mode
1/8/1999          |January 8 in `MDY` mode; August 1 in `DMY` mode
1/18/1999         |January 18 in `MDY` mode; rejected in other modes
01/02/03          |January 2, 2003 in `MDY` mode; February 1, 2003 in `DMY` mode; February 3, 2001 in `YMD` mode
1999-Jan-08       |January 8 in any mode
Jan-08-1999       |January 8 in any mode
08-Jan-1999       |January 8 in any mode
99-Jan-08         |January 8 in `YMD` mode, else error
08-Jan-99         |January 8, except error in `YMD` mode
Jan-08-99         |January 8, except error in `YMD` mode
1999.008          |year and day of year
J2451187          |Julian date
January 8, 99 BC  |year 99 BC

### Times

The time-of-day type is `time`, which does not include time zone
information. Input for this type is illustrated by the following examples:

Example           |Description
------------------|------------------------------------------
`04:05:06.789`    |ISO 8601
`04:05:06`        |ISO 8601
`04:05`           |ISO 8601
`04:05 AM`        |same as 04:05; AM does not affect value
`04:05 PM`        |same as 16:05; input hour must be \<= 12
`04:05:06.789-8`  |ISO 8601
`04:05:06-08:00`  |ISO 8601
`04:05-08:00`     |ISO 8601

### Time Stamps

Valid input for the time stamp types consists of the concatenation of a
date and a time, followed by an optional time zone, followed by an
optional `AD` or `BC`. Thus:

    1999-01-08 04:05:06

and:

    1999-01-08 04:05:06 -8:00

are valid values, which follow the ISO 8601 standard. In addition, the
common format:

    January 8 04:05:06 1999 PST 

is supported.

The SQL standard differentiates `timestamp without time zone` and
`timestamp with time zone` literals by the presence of a "+" or "-"
symbol and time zone offset after the time. Hence, according to the
standard,

    timestamp '2004-10-19 10:23:54'

is a `timestamp without time zone`, while

    timestamp '2004-10-19 10:23:54+02'

is a `timestamp with time zone`. Hyper never examines the content of a
literal string before determining its type, and therefore will treat
both of the above as `timestamp without time zone`. To ensure that a
literal is treated as `timestamp with time zone`, give it the correct
explicit type:

    timestamp with time zone '2004-10-19 10:23:54+02'

In a literal that has been determined to be
`timestamp without time zone`, Hyper will silently ignore any time zone
indication. That is, the resulting value is derived from the date/time
fields in the input value, and is not adjusted for time zone.

For `timestamp with time zone`, the internally stored value is always in
UTC (Universal Coordinated Time, traditionally known as Greenwich Mean
Time, GMT). An input value that has an explicit time zone specified is
converted to UTC using the appropriate offset for that time zone. If no
time zone is stated in the input string, then it is assumed to be in the
time zone indicated by the system's time zone, and is converted to UTC
using the offset for the `timezone` zone.

When a `timestamp with time zone` value is output, it is always
converted from UTC to the and displayed as local time in the system's
time zone.

Conversions between `timestamp without time zone` and
`timestamp with time zone` normally assume that the
`timestamp without time zone` value should be taken or given as
`timezone` local time.

## Date/Time Output {#datetime-output}

The output format of the date/time types follows the ISO 8601 format, i.e.
`1997-12-17 07:37:16-08`.

:::note
ISO 8601 specifies the use of uppercase letter `T` to separate the date
and time. Hyper accepts that format on input, but on output it uses a
space rather than `T`, as shown above. This is for readability and for
consistency with RFC 3339 as well as some other database systems.
:::

The formatting function `to_char` (see [Data Type Formatting Functions](/docs/sql/scalar_func/formatting))
is also available as a more flexible way to format date/time output.

## Time Zones {#timezones}

Hyper uses the widely-used IANA (Olson) time zone database for
information about historical time zone rules. For times in the future,
the assumption is that the latest known rules for a given time zone will
continue to be observed indefinitely far into the future.

All timezone-aware dates and times are stored internally in UTC.

Hyper allows you to specify time zones in three different forms:

-   A full time zone name, for example `America/New_York`. Hyper uses
    the widely-used IANA time zone data for this purpose, so the same
    time zone names are also recognized by other software.

-   A time zone abbreviation, for example `PST`. Such a specification
    merely defines a particular offset from UTC, in contrast to full
    time zone names which can imply a set of daylight savings
    transition-date rules as well.

-   In addition to the timezone names and abbreviations, Hyper will
    accept POSIX-style time zone specifications of the form
    `<STD><offset>` or `<STD><offset><DST>`, where `<STD>` is a
    zone abbreviation, `<offset>` is a numeric offset in hours west from
    UTC, and `<DST>` is an optional daylight-savings zone abbreviation,
    assumed to stand for one hour ahead of the given offset (e.g.,
    `EST5EDT`).

In short, this is the difference between abbreviations and full names:
abbreviations represent a specific offset from UTC, whereas many of the
full names imply a local daylight-savings time rule, and so have two
possible UTC offsets. As an example, `2014-06-04 12:00 America/New_York`
represents noon local time in New York, which for this particular date
was Eastern Daylight Time (UTC-4). So `2014-06-04 12:00 EDT` specifies
that same time instant. But `2014-06-04 12:00 EST` specifies noon
Eastern Standard Time (UTC-5), regardless of whether daylight savings
was nominally in effect on that date.

Here are some examples of time zone input:

Example             |Description
--------------------|------------------------------------------
`PST`               |Abbreviation (for Pacific Standard Time)
`America/New_York`  |Full time zone name
`PST8PDT`           |POSIX-style time zone specification
`-8:00`             |ISO-8601 offset for PST
`-800`              |ISO-8601 offset for PST
`-8`                |ISO-8601 offset for PST

In all cases, timezone names and abbreviations are recognized
case-insensitively.

## Interval Input {#interval-input}

Interval values can be written as ISO 8601 time intervals, using either
the "format with designators" of the standard's section 4.4.3.2 or the
"alternative format" of section 4.4.3.3. The format with designators
looks like this:

```sql_template
P<quantity> <unit> [<quantity> <unit> ...] [T [<quantity> <unit> ...]]
```

The string must start with a `P`,
and may include a `T` that introduces the time-of-day units. The
available unit abbreviations are:

Abbreviation  |Meaning
--------------|----------------------------
Y             |Years
M             |Months (in the date part)
W             |Weeks
D             |Days
H             |Hours
M             |Minutes (in the time part)
S             |Seconds

Units may be omitted,
and may be specified in any order, but units smaller than a day must
appear after `T`. In particular, the meaning of `M` depends on whether
it is before or after `T`.

In the alternative format: `P [<years>-<months>-<days>] [T <hours>:<minutes>:<seconds>]`
the string must begin with `P`, and
a `T` separates the date and time parts of the interval. The values are
given as numbers similar to ISO 8601 dates.

According to the SQL standard all fields of an interval value must have
the same sign, so a leading negative sign applies to all fields; for
example the negative sign in the interval literal `'-1 2:03:04'` applies
to both the days and hour/minute/second parts.

Some examples of valid `interval` input:

Example               |Description
----------------------|----------------------------------------------------------------------------------------
1-2                   |SQL standard format: 1 year 2 months
3 4:05:06             |SQL standard format: 3 days 4 hours 5 minutes 6 seconds
P1Y2M3DT4H5M6S        |ISO 8601 "format with designators": 1 year 2 months 3 days 4 hours 5 minutes 6 seconds
P0001-02-03T04:05:06  |ISO 8601 "alternative format": same meaning as above

Functions `justify_days` and `justify_hours` (see
[Date/Time Functions](/docs/sql/scalar_func/datetime)) are available for adjusting days and hours
that overflow their normal ranges.

## Interval Output {#interval-output}

The output format of the interval type can be set to one of the styles
`sql_standard` or `iso_8601`. using the
[interval_style](/docs/hyper-api/connection#date_style) setting.
The default is the `iso_8601` format.
Examples of each output style.

Style Specification  |Year-Month Interval  |Day-Time Interval  |Mixed Interval
---------------------|---------------------|-------------------|---------------------
`sql_standard`       |1-2                  |3 4:05:06          |-1-2 +3 -4:05:06
`iso_8601`           |P1Y2M                |P3DT4H5M6S         |P-1Y-2M3DT-4H-5M-6S
