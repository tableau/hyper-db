// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "index",
    "releases",
    'installation',
    {
      type: 'category',
      label: 'Guides',
      link: { type: 'doc', id: 'guides/index' },
      items: [
        'guides/sql_commands',
        'guides/pandas_integration',
        'guides/hyper_file/create_update',
        'guides/hyper_file/read',
        'guides/hyper_file/insert_csv',
        'guides/hyper_file/geodata',
        'guides/hyper_file/optimize',
        'guides/hyper_file/publish',
      ],
    },
    {
      type: 'category',
      label: 'Client-side API',
      link: { type: 'doc', id: 'hyper-api/index' },
      items: [
        'hyper-api/hyper_process',
        'hyper-api/connection',
        { type: 'link', label: "Examples", href: "https://github.com/tableau/hyper-api-samples" },
        { type: 'link', label: "Python Reference", href: "pathname:///lang_docs/py/index.html" },
        { type: 'link', label: "C++ Reference", href: "pathname:///lang_docs/cxx/index.html" },
        { type: 'link', label: "Java Reference", href: "pathname:///lang_docs/java/overview-summary.html" },
      ],
    },
    'sql',
    "faq",
  ],
};

module.exports = sidebars;
