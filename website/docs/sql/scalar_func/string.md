# String Functions and Operators

This section describes functions and operators for examining and
manipulating string values. Unless otherwise noted, all of the functions
listed below work on all string types, but be wary of potential effects
of automatic space-padding when using the whitespace padded`character` type.

SQL defines some string functions that use key words, rather than
commas, to separate arguments. The strings defined in the SQL standard
are shown in the table below:

Function|Return Type|Description|Example
---|---|---|---
<code>string &#124;&#124; string</code>|`text`|String concatenation|<code>'Hy'&#124;&#124;'per'</code> → `'Hyper'`
<code>string &#124;&#124; non-string</code><br/>or<br/><code>non-string &#124;&#124; string</code>|`text`|String concatenation with one non-string input|<code>'Value: '&#124;&#124;42</code> → `'Value: 42'`
`bit_length(string)`|`int`|Number of bits in string|`bit_length('jose')` → `32`|
`char_length(string)`<br/>or<br/>`character_length(string)`|`int`|Number of characters in string|`char_length('jose')` → `4`
`lower(string)`|`text`|Convert string to lower case|`lower('TOM')` → `'tom'`
`octet_length(string)`|`int`|Number of bytes in string|`octet_length('jose')` → `4`
`overlay(string placing string from int for int)`|`text`|Replace substring|`overlay('Txxxxas' placing 'hom' from 2 for 4)` → `'Thomas'`
`position(substring in string)`|`int`|Location of specified substring|`position('om' in 'Thomas')` → `3`
`substring(string from int for int)`|`text`|Extract substring|`substring('Thomas' from 2 for 3)` → `'hom'`
<code>trim(leading &#124; trailing &#124; both characters from string)</code>|`text`|Remove the longest string containing only characters from `characters` (a space by default) from the start, end, or both ends (`both` is the default) of `string`|`trim(both 'xyz' from 'yxTomxx')` → `'Tom'`
`upper(string)`|`text`|Convert string to upper case|`upper('tom')` → `'TOM'`

Hyper also provides versions of these functions that use the regular
function invocation syntax, together with additional, non-standard
string manipulation functions. Those functions are:

Function|Return Type|Description|Example
---|---|---|---
`ascii(string)`|`int`|ASCII code of the first character of the argument. For UTF8 returns the Unicode code point of the character.|`ascii('x')` → `120`
`btrim(string text , characters text)`|`text`|Remove the longest string consisting only of characters in `characters` (a space by default) from the start and end of `string`.|`btrim('xyxtrimyyx', 'xyz')` → `'trim'`
`chr(int)`|`text`|Character with the given code. For UTF8 the argument is treated as a Unicode code point. The NULL (0) character is not allowed because text data types cannot store such bytes.|`chr(65)` → `'A'`
`concat(str "any" [, str "any" [, ...] ])`|`text`|Concatenate the text representations of all the arguments. NULL arguments are ignored.|`concat('abcde', 2, NULL, 22)` → `abcde222`
`decode(string text, format text)`|`bytea`|Decode binary data from textual representation in `string`. Options for `format` are same as in `encode`.|`decode('MTIzAAE=', 'base64')` → `\x3132330001`
`encode(data bytea, format text)`|`text`|Encode binary data into a textual representation. Supported formats are: `base64`, `hex`, `escape`. `escape` converts zero bytes and high-bit-set bytes to octal sequences (`\``<nnn>`) and doubles backslashes.|`encode('123\000\001', 'base64')` → `MTIzAAE=`
`initcap(string)`|`text`|Convert the first letter of each word to upper case and the rest to lower case. Words are sequences of alphanumeric characters separated by non-alphanumeric characters.|`initcap('hi THOMAS')` → `'Hi Thomas'`
`left(str text, n int)`|`text`|Return first `<n>` characters in the string. When `<n>` is negative, return all but last <code>&#124;&#60;n&#62;&#124;</code> characters.|`left('abcde', 2)` → `'ab'`
`length(string)`|`int`|Number of characters in `string`|`length('jose')` → `4`
`lpad(string text, length int , fill text)`|`text`|Fill up the `string` to length `length` by prepending the characters `fill` (a space by default). If the `string` is already longer than `length` then it is truncated (on the right).|`lpad('hi', 5, 'xy')` → `'xyxhi'`
`ltrim(string text , characters text)`|`text`|Remove the longest string containing only characters from `characters` (a space by default) from the start of `string`.|`ltrim('zzzytest', 'xyz')` → `'test'`
`md5(string)`|`text`|Calculates the MD5 hash of `string`, returning the result in hexadecimal.|`md5('abc')` → `900150983cd24fb0 d6963f7d28e17f72`
`quote_ident(string text)`|`text`|Return the given string suitably quoted to be used as an identifier in an SQL statement string. Quotes are added only if necessary (i.e., if the string contains non-identifier characters or would be case-folded). Embedded quotes are properly doubled.|`quote_ident('Foo bar')` → `'"Foo bar"'`
`quote_literal(string text)`|`text`|Return the given string suitably quoted to be used as a string literal in an SQL statement string. Embedded single-quotes and backslashes are properly doubled. Note that `quote_literal` returns null on null input; if the argument might be null, `quote_nullable` is often more suitable.|`quote_literal(E'O\'Reilly')` → `'O''Reilly'`
`repeat(string text, number int)`|`text`|Repeat `string` the specified `number` of times|`repeat('Hyper!', 2)` → `'Hyper!Hyper!'`
`replace(string text, from text, to text)`|`text`|Replace all occurrences in `string` of substring `from` with substring `to`.|`replace('abcdefabcdef', 'cd', 'XX')` → `'abXXefabXXef'`
`reverse(str)`|`text`|Return reversed string.|`reverse('abcde')` → `'edcba'`
`right(str text, n int)`|`text`|Return last `<n>` characters in the string. When `<n>` is negative, return all but first <code>&#124;&#60;n&#62;&#124;</code> characters.|`right('abcde', 2)` → `'de'`
`rpad(string text, length int , fill text)`|`text`|Fill up the `string` to length `length` by appending the characters `fill` (a space by default). If the `string` is already longer than `length` then it is truncated.|`rpad('hi', 5, 'xy')` → `'hixyx'`
`rtrim(string text , characters text)`|`text`|Remove the longest string containing only characters from `characters` (a space by default) from the end of `string`.|`rtrim('testxxzx', 'xyz')` → `'test'`
`split_part(string text, delimiter text, field int)`|`text`|Split `string` on `delimiter` and return the given field (counting from one).|`split_part('abc~@~def~@~ghi', '~@~', 2)` → `'def'`
`strpos(string, substring)`|`int`|Location of specified substring (same as `position(substring in string)`, but note the reversed argument order).|`strpos('high', 'ig')` → `2`
`substr(string, from , count)`|`text`|Extract substring (same as `substring(string from from for count)`).|`substr('alphabet', 3, 2)` → `'ph'`
`to_hex(number int or bigint)`|`text`|Convert `number` to its equivalent hexadecimal representation.|`to_hex(2147483647)` → `'7fffffff'`
