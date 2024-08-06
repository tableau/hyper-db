# Array Type

An array is a sequential collection of elements packed into a single SQL value.
Arrays are useful to model dependent information with an inherent ordering in a single row – for example, time-series data from longitudinal studies, or embedding vectors from machine learning models. 

Generally, array values are denoted in curly braces with elements separated by commas, like so:

```
{"Lorem", "ipsum", "dolor", "sit", "amed"}
```


## Element Types and Nullability

Hyper's arrays are _strongly typed_:
All elements must be of the same type – the array's _element type_.
The element type is a defining part of the array's overall type, meaning that `array(integer)` is a different type than `array(boolean)` or `array(text)`.
Arrays can be built from all [atomic types](./index.md) available in Hyper.

Part of an array's element type is its nullability. 
For example, `array(smallint)` is different from `array(smallint not null)`.
Note that this is independent of the nullability of the array itself.
The following four options all represent different types in Hyper:

|Type|array nullable?|elements nullable?| possible values|
|---|---|---|---|
|`array(integer)`|✅|✅|`{}`,`{1,2,3}`,`{1,2,null}`, `null`|
|`array(integer not null)`|✅|❌|`{}`,`{1,2,3}`,`null`|
|`array(integer) not null`|❌|✅|`{}`,`{1,2,3}`,`{1,2,null}`|
|`array(integer not null) not null`|❌|❌|`{}`,`{1,2,3}`|

Array types can be converted using the conventional [cast syntax](../scalar_func/conversion.md).

:::info
Non-nullable element types use less memory and enable optimizations for certain array operations. Users are therefore advised to use the most "restrictive" element type possible, given the use case at hand. 
:::

For nullable types, there exists an alternative shorthand bracket syntax of the form `type[]`. For example, `integer[]` and `array(integer)` reference the same type.

The length (i.e., the number of elements) of an array in Hyper is not part of its type.
While arrays inside a column must have the same element type, they can be of different length.

## Working with Arrays

Arrays can be created in two ways:

 - Using the type constructor syntax:
   ```sql
   > select array[1,2,3];
   {1,2,3}
   ```
 - Using casts from string data:
   ```sql
   > select '{1,2,3}'::array(integer);
   {1,2,3}
   ```

Note that using the constructor syntax, the array type will be inferred automatically.
If the constructed array does not contain a `null` value, the element type will be inferred as non-nullable.


Array elements can be retrieved using the conventional bracket-indexing notation. Indexes start at one.
```sql
> select ('{1,1,2,3,5}'::integer[])[4]
3
```

:::info
Arrays are one-dimensional. Higher-dimensional objects (e.g., matrices) must be flattened explicitly.
:::

For more operations on array, see the section on [Array Functions](../scalar_func/arrays.md).

## Limitations

Arrays are subject to the following limitations:

- The size of an array is limited to 4,294,967,296 elements. The actual limit may be lower, depending on the size(s) and nullability of its elements.
- Arrays cannot be nested.
- Arrays cannot be used as column types in non-temporary tables.

:::note
Also, see the restrictions regarding array support in [external formats](../external/formats.md).
:::
