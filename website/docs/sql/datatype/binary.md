# Binary Data Type

The `bytes` data type allows storage of binary strings.

A binary string is a sequence of octets (or bytes). Binary strings are
distinguished from character strings in two ways. First, binary strings
specifically allow storing octets of value zero and other
"non-printable" octets (usually, octets outside the decimal range 32 to
126). Character strings disallow zero octets, and also disallow any
other invalid Unicode characters.
Second, operations on binary strings process the actual bytes, whereas the
processing of character strings depends on locale settings. In short,
binary strings are appropriate for storing data that the programmer
thinks of as "raw bytes", whereas character strings are appropriate for
storing text.

For compatibility reasons, Hyper provides the following aliases for the
`bytes` type: `bytea`, `blob`, and `varbinary`. The SQL standard defines
a different binary string type, called `BLOB` or `BINARY LARGE OBJECT`.
The input format is different from `bytes`, but the provided functions
and operators are mostly the same.

## `bytes` Hex Format

The `bytes` type supports input and output using the "hex" format.

The "hex" format encodes binary data as 2 hexadecimal digits per byte,
most significant nibble first. The entire string is preceded by the
sequence `\x` In some contexts, the initial backslash may need to be
escaped by doubling it. For input, the hexadecimal digits can be either
upper or lower case.

Example:

    SELECT '\xDEADBEEF'::bytea;
