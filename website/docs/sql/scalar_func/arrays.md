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
<code>**array_length(**array**)**</code> → `int` | Returns the length of the array. | `array_length(array[1,2,3])` → `3` <br/>`array_length(array[])` → `0`
<code>**array_to_string(**array, text [, text]**)**</code>| Converts the array into a textual representation, with the given element separator and (optional) null indicator. | `array_to_string(array[1,2,3], ';')` → `1;2;3`<br/>`array_to_string(array[3,2,1,null], '⏰', '🎉')` → `3⏰2⏰1⏰🎉`
<code>**array_contains(**array, value**)**</code>| Checks if a given value is contained within the array. | `array_contains(array[1,3,4], 3)` → `true`<br/>`array_contains(array[1,3,4], 2)` → `false`
<code>**array_position(**array, value**)**</code>| Returns the index of the first occurrence of `value` inside `array`. Comparisons are done using `IS NOT DISTINCT FROM` semantics, so it is possible to search for `NULL`. Returns `NULL` if the element is not found. | `array_position(array[1,3,4,3], 3)` → `2`<br/>`array_contains(array[1,3,4,3], 2)` → `NULL`
<code>**array_positions(**array, value**)**</code>| Returns the an array containing the indices of all occurrences of `value` inside `array`. Comparisons are done using `IS NOT DISTINCT FROM` semantics, so it is possible to search for `NULL`. `NULL` is returned only if the array is `NULL`; if the value is not found in the array, an empty array is returned. | `array_positions(array[1,3,4,3], 3)` → `[2,4]`<br/>`array_contains(array[1,3,4,3], 2)` → `[]`

## Transformations
The following functions produce new array values from existing ones.
These operations are compatible with all (nullable and non-nullable) element types.

Signature|Description|Example
---|---|---
<code>**array_prepend(**T,array(T)**)**</code> → `array(T)`<br/>or<br/><code>T **\|\|** array(T)</code> → `array(T)`| Inserts a value at the front of the array.<br/>If `null` is prepended to an array with non-nullable element type, the resulting element type is nullable. | `array_prepend(1, array[2,3,4])` → `array[1,2,3,4]`<br/>`array_prepend(null, [2,3,4])` → `array[null,2,3,4]` 
<code>**array_append(**array(T), T**)**</code> → `array(T)`<br/>or<br/><code>array(T) **\|\|** T</code> → `array(T)`| Inserts a value at the end of the array.<br/>If `null` is appended to an array with non-nullable element type, the resulting element type is nullable. | `array_append(array[1,2,3], 4)` → `array[1,2,3,4]`<br/>`array_append(array[1,2,3], null)` → `array[1,2,3,null]` 
<code>**array_cat(**array(T), array(T)**)**</code> → `array(T)`<br/>or<br/><code>array(T) **\|\|** array(T)</code> → `array(T)`| Concatenates two arrays.<br/>The resulting element type is non-nullable if and only if both input element types are non-nullable. | `array_cat(array[1,2], array[3,4])` → `array[1,2,3,4]`<br/>`array_cat(array[1,null], array[3,4])` → `array[1,null,3,4]`<br/>`array_cat(array[1,2], array[null,4])` → `array[1,2,null,4]`


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

### Example Use Case: Vector Search

With inner products, vector search can be implemented directly in Hyper.

:::info
[Vector search][vector-space-model] is a search technique to find semantically similar items (called _documents_) in a given corpus. 
Each document is represented as an _embedding vector_ in a high-dimensional vector space, e.g. using word-count statistics or machine learning models.
Two documents are considered similar if their embeddings are "close by" in the space &mdash; as measured by an inner product.
:::

For illustration, consider the problem of finding products similar to a search string in the product catalog of an e-commerce business.
To simplify the example, let's assume that the product catalog is already loaded into a temporary table `products` with the following columns:

 - `description_vec` (type: `array(real not null)`) a description of the product, reprsented as a suitable embedding vector
 - `name` (type: `text`) the name of the product

Further, let's assume that the search string has already been converted into a vector `{1.1, -0.2, 0.7, -0.3}`, using the same embedding model as the `description_vec` column.

Retrieving the top five most-similar products can be expressed in SQL as follows:

```sql
select
    name,
    dot_product('{1.1, -0.2, 0.7, -0.3}'::array(real not null), description_vec) as score
from products
limit 5
order by score descending
```

:::note
The embedding vector in this example has been chosen as four-dimensional to keep the query readable; realistic applications likely use much higher dimensionalities.
:::

[dot-product]: https://en.wikipedia.org/wiki/Dot_product
[cosine-similarity]: https://en.wikipedia.org/wiki/Cosine_similarity
[vector-space-model]: https://en.wikipedia.org/wiki/Vector_space_model
