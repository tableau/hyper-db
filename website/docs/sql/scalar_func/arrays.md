# Array Functions

This section describes functions and operators to inspect and transform [`array` values](../datatype/array.md). In the following, `array(T)` denotes an array type with element type `T`. 
The element type is omitted when irrelevant.


## Access & Inspection
The following functions yield access to array elements or metadata.
These operations are compatible with all (nullable and non-nullable) element types.

Signature|Description|Example
---|---|---
<code>array(T)**[**int**]**</code> → `T`| Returns the n-th element of the array (1-indexed). | `(array[1,2,3])[1]` → `1`
<code>array(T)**[**int**:**int**]**</code> → `T` | Returns the subarray within the given boundes (1-indexed, inclusive). |`(array[1,2,3])[2:3]` → `{2,3}` | 
<code>**array_length(**array**)**</code> → `int` | Returns the length of the array. | `array_length(array[1,2,3])` → `3`
<code>**array_to_string(**array, text [, text]**)**</code>| Converts the array into a textual representation, with the given element separator and (optional) null indicator. | `array_to_string(array[1,2,3], ';')` → `1;2;3`<br/>`array_to_string(array[3,2,1,null], '⏰', '🎉')` → `3⏰2⏰1⏰🎉` 

## Transformations
The following functions produce new array values from existing ones.
These operations are compatible with all (nullable and non-nullable) element types.

Signature|Description|Example
---|---|---
<code>**array_prepend(**T,array(T)**)**</code> → `array(T)`<br/>or<br/><code>T **\|\|** array(T)</code> → `array(T)`| Inserts a value at the front of the array.| `array_prepend(1, array[2,3,4])` → `array[1,2,3,4]` 
<code>**array_append(**array(T), T**)**</code> → `array(T)`<br/>or<br/><code>array(T) **\|\|** T</code> → `array(T)`| Inserts a value at the end of the array.| `array_append(array[1,2,3], 4)` → `array[1,2,3,4]` 
<code>**array_cat(**array(T), array(T)**)**</code> → `array(T)`<br/>or<br/><code>array(T) **\|\|** array(T)</code> → `array(T)`| Concatenates two arrays. | `array_cat(array[1,2], array[3,4])` → `array[1,2,3,4]`  


## Inner Products
Hyper offers high-performance implementations of common inner products in vector spaces. These functions operate on two input vectors (represented as arrays) and produce a scalar value of type `double precision`. 

Contrary to other array operations, vector functions only apply to a certain set of arrays:
 - the element type must be `real` or `double precision`
 - both arrays must have the same element type (but may have different element nullability)
 - both arrays must have the same length

If any of the input arrays contains a `null` element, or is itself `null`, the result of an inner product will be `null`.
Passing arrays of different lengths or incompatible types will result in an error.

In the following table, signatures and examples are abbreviated for clarity. `vec` denotes a suitable array type (i.e., `array(real)` or `array(double precision not null)`). It is implied that both array arguments have the same element type. Similarly, the `{1.0, 2.0, 3.0}` syntax in the example column represents a suitable array value (e.g., `'{1.0, 2.0, 3.0}'::array(real not null)`).

|Signature|Description|Example
|---|---|---|
|<code>**dot_product(**vec, vec**)**</code> → `double precision`| Computes the conventional [dot product][dot-product] between two vectors. | <code>dot_product({1.0, 2.0, 3.0}, {-1.0, 2.0, -3.0})</code> →  `-6.0`<br/><code>dot_product({1.0, null, 3.0}, {-1.0, 2.0, -3.0})</code> → `null`
|<code>**cosine_similarity(**vec, vec**)**</code> → `double precision`| Computes [cosine similarity][cosine-similarity]  between two vectors. | <code>cosine_similarity({1.0, 2.0, 3.0}, {-1.0, 2.0, -3.0})</code> →  `-0.42857...`<br/><code>cosine_similarity({1.0, 2.0, 3.0}, {null, 2.0, -3.0})</code> →  `null`

:::tip
If possible, prefer arrays with non-nullable element types (i.e., `array(real not null)` or `array(double precision not null)`) when computing inner products.
This allows Hyper to skip element `null` checks, resulting in better performance.
:::

[dot-product]: https://en.wikipedia.org/wiki/Dot_product
[cosine-similarity]: https://en.wikipedia.org/wiki/Cosine_similarity
