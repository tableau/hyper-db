// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    "index",
    "release_notes",
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'generated-index' },
      items: [
        'getting-started/download',
        'getting-started/installing',
        'getting-started/examples',
      ],
    },
    {
      type: 'category',
      label: 'How-to',
      link: { type: 'generated-index' },
      items: [
        'how-to/create_update',
        'how-to/read_data',
        'how-to/insert_csv',
        'how-to/insert_delete',
        'how-to/sql_commands',
        'how-to/publish',
        'how-to/geodata',
        'how-to/defrag',
      ],
    },
    {
      type: 'category',
      label: 'SQL',
      link: { type: 'generated-index' },
      items: [
        {
          type: 'category',
          label: 'Statements',
          link: { type: 'generated-index' },
          items: [
            {type: 'autogenerated', dirName: 'sql/statement'}
          ],
        },
        {
          type: 'category',
          label: 'Data Types',
          link: { type: 'doc', id: 'sql/datatype/index' },
          items: [
            "sql/datatype/binary",
            "sql/datatype/boolean",
            "sql/datatype/character",
            "sql/datatype/datetime",
            "sql/datatype/numeric",
          ],
        },
        {
          type: 'category',
          label: 'Functions and Operators',
          link: { type: 'doc', id: 'sql/func/index' },
          items: [
            "sql/func/conversion",
            "sql/func/comparison",
            "sql/func/logical",
            "sql/func/conditional",
            "sql/func/string",
            "sql/func/matching",
            "sql/func/formatting",
            "sql/func/datetime",
            "sql/func/geography",
            "sql/func/aggregate",
            "sql/func/window",
            "sql/func/subquery",
            "sql/func/setreturning",
          ],
        },
        {
          type: 'category',
          label: 'External Formats',
          link: { type: 'doc', id: 'sql/external/index' },
          items: [
            "sql/external/syntax",
            "sql/external/formats",
            "sql/external/fragment_sourcelocation",
          ],
        },
        "sql/process_settings",
        "sql/connection_settings",
      ],
    },
    "client_languages",
    "faq",
  ],
};

module.exports = sidebars;
