// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const getConfig = async () => {
  const remarkDefList = (await import("remark-deflist")).default;

  /** @type {import('@docusaurus/types').Config} */
  return {
    title: 'HyperDB',
    tagline: 'Hyper Hyper!',
    favicon: 'img/favicon.ico',

    /* XXX
    // Set the production url of your site here
    url: 'https://tableau.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/hyper-db',
    */
    url: 'https://fantastic-adventure-59k6vny.pages.github.io/',
    baseUrl: '/',

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        {
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              'https://github.com/tableau/hyper-db/tree/main/website/',
            remarkPlugins: [remarkDefList],
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              'https://github.com/tableau/hyper-db/tree/main/website/',
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        },
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
          title: 'HyperDB',
          logo: {
            alt: 'Hyper',
            src: 'img/hyper-logo.svg',
          },
          items: [
            {
              to: 'docs',
              position: 'left',
              label: 'Documentation',
            },
            { to: '/blog', label: 'Blog', position: 'left' },
          ],
        },
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Docs',
              items: [
                {
                  label: 'Installation',
                  to: '/docs/installation',
                },
                {
                  label: 'SQL reference',
                  to: '/docs/sql',
                },
              ],
            },
            {
              title: 'Use cases',
              items: [
                {
                  label: 'Hyper for Tableau users',
                  href: '/docs/usescases/tableau',
                },
                {
                  label: 'Hyper for data scientists',
                  href: '/docs/usescases/datascience',
                },
                {
                  label: 'Hyper for researchers',
                  href: '/docs/usescases/research',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'Blog',
                  to: '/blog',
                },
                {
                  label: 'GitHub',
                  href: 'https://github.com/facebook/docusaurus',
                },
                {
                  label: 'Slack',
                  href: 'https://join.slack.com/t/tableau-datadev/shared_invite/zt-1q4rrimsh-lHHKzrhid1MR4aMOkrnAFQ',
                },
                {
                  label: 'Support',
                  href: '/docs/faq#how-can-i-get-suport-for-hyper',
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Salesforce, Inc. Built with Docusaurus.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  };
}

module.exports = getConfig;
