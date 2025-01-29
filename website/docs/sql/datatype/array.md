# Array Type

An array is a sequential collection of elements packed into a single SQL value.
Arrays are useful to model dependent information with an inherent ordering in a single row – for example, time-series data from longitudinal studies, or embedding vectors from machine learning models. 

Array Types are created using the following syntax:

```
array(<atomic type> [not null])
```

`<atomic type>` may be any of Hyper's [atomic data types](./index.md#atomic-types).
The optional `not null` specifier indicates whether array elements are allowed to be `null`. 
For example, `array(integer not null)` denotes an array of non-null integer elements. 

All array types in Hyper have the following properties:
 - Arrays have variable length. Within a column, arrays are not required to have the same number of elements.
 - Arrays are one-dimensional. Higher-dimensional objects (e.g., matrices) must be flattened explicitly.

For a comprehensive overview of supported operations on arrays, see the section on [Array Functions](../scalar_func/arrays.md).

## Creating Arrays

Arrays can be created in two ways:

 - Using the type constructor syntax
 ```sql
   > select array[1,2,3];
   {1,2,3}

   > select array['one','two','three'];
   {one,two,three}
 ```

 The constructor syntax consists of the keyword `array` followed by a comma-separated list of element SQL values surrounded by square brackets `[...]`.

 Using this syntax, the array type will be inferred automatically. 
 If the given list of elements does not contain a `null` value, the [element type](#element-types-and-nullability) will be inferred as non-nullable.

 - Using a [cast](../scalar_func/conversion.md) from string data
 ```sql
 > select '{1,2,3}'::array(integer);
   {1,2,3}

 > select '{one,two,three}'::array(text);
 {one,two,three} 
 ```

 An array string literal consists of a comma-separated list of element literals surrounded by curly braces `{...}`.
 The element literal syntax is identical to that of the respective atomic type.

 Note that for string array types (such as, e.g., `array(text)`), any upper- or lower-case variant of the element literal `null` will be parsed as a `null` value.
 To specify the string `null`, the element literal must be escaped using double quotes, like so:
 ```sql 
 > select '{null, "null"}'::array(text)
 {NULL,null} # A null element, followed by the string 'null'
 ```
 
## Element Types and Nullability

Hyper's arrays are _strongly typed_:
All elements must be of the same type – the array's _element type_.
The element type is a defining part of the array's overall type, meaning that `array(integer)` is a different type than `array(boolean)` or `array(text)`.
Arrays can be built from all [atomic types](./index.md) available in Hyper.

Part of an array's element type is the element's nullability. 
For example, `array(smallint)` is different from `array(smallint not null)`.
Note that this is independent of the nullability of the array itself.
The following four options all represent different types in Hyper:

|Type|array nullable?|elements nullable?| possible values|
|---|---|---|---|
|`array(integer)`|✅|✅|`{}`,`{1,2,3}`,`{1,2,null}`, `null`|
|`array(integer not null)`|✅|❌|`{}`,`{1,2,3}`,`null`|
|`array(integer) not null`|❌|✅|`{}`,`{1,2,3}`,`{1,2,null}`|
|`array(integer not null) not null`|❌|❌|`{}`,`{1,2,3}`|

The inner nullability of an array type can be changed by casting, using the conventional [cast syntax](../scalar_func/conversion.md):

```sql
# nullable to non-nullable
> select ('{1,2,3}'::array(integer))::array(integer not null)
# non-nullable to nullable
> select ('{1,2,3}'::array(integer not null))::array(integer)
```

A cast from a non-nullable element type to its nullable counterpart always succeeds.
The reverse direction (nullable to non-nullable) succeeds if the array does not contain `null` elements; otherwise the cast results in an error.
Casts across element types (e.g. from `array(integer not null)` to `array(bigint not null)`) are currently not supported, the only exception being casts from and to string types.

:::info
Non-nullable element types use less memory and enable optimizations for certain array operations. Users are therefore advised to use the most "restrictive" element type possible, given the use case at hand. 
:::

## Limitations

Arrays are subject to the following limitations:

- The size of an array is limited to 4GB. Hyper is not optimized for processing large arrays; performance may degrade before this limit is reached.
- Arrays cannot be nested.
- Arrays cannot be used as column types in non-temporary tables.

:::note
Also, see the restrictions regarding array support in [external formats](../external/formats.md).
:::
