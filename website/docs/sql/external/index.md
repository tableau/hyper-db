# External Formats

Besides its own table format, Hyper is able to access data stored in
other commonly used data formats (called external formats or external
data hereinafter).

There are three orthogonal concepts when it comes to external formats:

* The format in which the data is stored (CSV, Parquet, ...). The various
  formats provide different options, such as which character to use as the
  separator in CSV files. See [External Formats](formats) for more details.
* Where the external files are stored (on the local file system, on S3) and
  corresponding options, such as the credentials to use when connecting to
  S3. See [External Locations](location) for more details.
* What to do with the external data. E.g., there are multiple syntactic
  options to [read external data](syntax).

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
