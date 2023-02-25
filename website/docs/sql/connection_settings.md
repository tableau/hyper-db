# Connection Settings {#connectionsettings}

Connection settings are settings that apply only on a connection level.
Other connections to the same Hyper process are not affected. They can
be set during connection startup. With the Hyper API, they can be passed
to the `Connection` constructor.

## Date and Time Settings {#datetimesettings}

These settings control how date and time data is handled in a Hyper
connection.

### lc_time

Controls the Locale setting that is used for dates. A Locale controls
which cultural preferences the application should apply. For example,
the literal `Januar 1. 2002` can be converted to a date with the German
locale `de` but not with the English locale `en_US`.

Default value: `en_US`

Allowed values start with a [two-letter
ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language
code and an optional [two-letter
ISO-3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
country code. If a country code is used, an underscore has to be used to
separate it from the language code. Some examples are: `en_US` (English:
United States), `en_GB` (English: Great Britain), `de` (German), `de_AT`
(German: Austria).

:::note
This setting has no influence on the order of day, month, and year
inside a date literal. This is controlled by the
[date_style](#date_style) setting.
:::

### date_style

Controls how date strings are interpreted. `Y`, `M` and `D` stand for
Year, Month, and Day respectively.

For example, the string "01/02/2000" could be interpreted as "2nd of
January 2000" or "1st of February 2000". The first possibility is chosen
with the `MDY` date style while the second is chosen with the `DMY` date
style.

This setting also affects date parsing from CSV files.

Default value: `MDY`

Accepted values: `MDY`, `DMY`, `YMD`, `YDM`
