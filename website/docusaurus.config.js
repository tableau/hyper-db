// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');

const getConfig = async () => {
  const remarkDefList = (await import("remark-deflist")).default;

  const isUpcomingVersion =  !!process.env.IS_UPCOMING
  const isInofficial = process.env.GITHUB_ORIGIN !== 'https://tableau.github.io';

  var title = 'Hyper';
  if (isInofficial) title = 'Inofficial Hyper';
  else if (isUpcomingVersion) title = 'Pre-Release Hyper';

  /** @type {import('@docusaurus/types').Config} */
  return {
    title: title,
    tagline: 'The SQL Database for Interactive Analytics of the Freshest State of Data.',
    favicon: 'img/favicon.ico',

    // Pick up URL and baseUrl from config parameters set by the Github action runner
    url: process.env.GITHUB_ORIGIN ?? 'http://localhost/',
    baseUrl: (process.env.GITHUB_BASE_PATH ?? '') + '/',

    // We don't want to have the preview version or clones of the Github repository
    // indexed by search engines
    noIndex: isUpcomingVersion || isInofficial,

    // We want all issues to be reported as build errors
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',

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
              'https://github.dev/tableau/hyper-db/blob/main/website/',
            remarkPlugins: [remarkDefList],
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
        /* We intentionally don't have a social card, as we are not
         * happy with the design, yet */
        // image: 'img/hyper-social-card.png',
        navbar: {
          title: 'Hyper',
          logo: {
            alt: 'Hyper',
            src: 'img/hyper-logo.svg',
          },
          items: [
            {
              to: '/journey',
              label: 'Our Journey',
            },
            {
              to: '/docs',
              position: 'left',
              label: 'Documentation',
            },
          ],
        },
        colorMode: {
          defaultMode: 'light',
          disableSwitch: true,
        },
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Docs',
              items: [
                {
                  label: 'Releases',
                  to: '/docs/releases',
                },
                {
                  label: 'Installation',
                  to: '/docs/installation',
                },
                {
                  label: 'Guides',
                  to: '/docs/guides',
                },
                {
                  label: 'SQL Reference',
                  to: '/docs/sql',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'GitHub',
                  href: 'https://github.com/tableau/hyper-db',
                },
                {
                  label: 'Slack',
                  href: 'https://join.slack.com/t/tableau-datadev/shared_invite/zt-1q4rrimsh-lHHKzrhid1MR4aMOkrnAFQ',
                },
                {
                  label: 'Getting Help',
                  href: '/docs/faq#getting-help',
                },
              ],
            },
            {
              title: 'Legal',
              items: [
                {
                label: 'Legal',
                href: 'https://www.salesforce.com/company/legal/',
                },
                {
                  label: 'Terms of Service',
                  href:  'https://www.salesforce.com/company/legal/sfdc-website-terms-of-service/',
                  },
                {
                  label: 'Privacy',
                  href: 'https://www.salesforce.com/company/privacy/'
                },
                {
                  label: 'Responsible Disclosure',
                  href:  'https://www.salesforce.com/company/legal/disclosure/',
                },
                {
                  label: 'Trust',
                  href:  'https://trust.salesforce.com/',
                  }, 
                  {
                   html:  `<a href="#" data-ignore-geolocation="true" class="optanon-toggle-display" style="color:#FFFFFF">Cookie Preferences</a>`,
                  }
              ]       
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Salesforce, Inc. Built with Docusaurus.`,
        },
        prism: {
          theme: lightCodeTheme,
        },
        announcementBar: isUpcomingVersion ? {
          content:
            'You are browsing a preview of the documentation for the upcoming Hyper version.',
          backgroundColor: '#a00',
          textColor: '#fff',
          isCloseable: false,
        } : undefined,
      }),

      plugins: [
        [
          '@docusaurus/plugin-google-tag-manager',
          {
            containerId: 'GTM-BVCN',
          },
        ],
        [
          '@docusaurus/plugin-google-gtag',
          {
            trackingID: '469571326',
            anonymizeIP: true,
          },
        ],
      ],

      clientModules: [
        require.resolve('./_analytics.js'),
      ],
  };
}

module.exports = getConfig;
