---
title: Download Hyper
---

import {siteConfig} from '@site/src/config';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import FontAwesomeIcon from '@theme/TabItem';

Hyper comes packaged inside "Hyper API". Hyper API bundles the Hyper database together with a client-side library which offers utility functions for connection management, SQL formatting etc.

Below you can download the latest version of Hyper API for your operating system.

<Tabs queryString="operating-system" defaultValue="linux">
  <TabItem value="windows" label={<FontAwesomeIcon icon="fa-brands fa-windows" /> Windows}>
    <ul>
      <li><a href={siteConfig.download.windows_py}>Python .whl (Windows)</a></li>
      <li><a href={siteConfig.download.windows_cxx}>C++ (Windows)</a></li>
      <li><a href={siteConfig.download.windows_java}>Java (Windows)</a></li>
      <li><a href={siteConfig.download.windows_dotnet}>.Net (Windows)</a></li>
    </ul>
  </TabItem>
  <TabItem value="macos" label="macOS">
    <ul>
      <li><a href={siteConfig.download.macos_py}>Python .whl (macOS)</a></li>
      <li><a href={siteConfig.download.macos_cxx}>C++ (macOS)</a></li>
      <li><a href={siteConfig.download.macos_java}>Java (macOS)</a></li>
      <li><a href={siteConfig.download.macos_dotnet}>.Net (macOS)</a></li>
    </ul>
  </TabItem>
  <TabItem value="linux" label="Linux">
    <ul>
      <li><a href={siteConfig.download.linux_py}>Python .whl (Linux)</a></li>
      <li><a href={siteConfig.download.linux_cxx}>C++ (Linux)</a></li>
      <li><a href={siteConfig.download.linux_java}>Java (Linux)</a></li>
      <li><a href={siteConfig.download.linux_dotnet}>.Net (Linux)</a></li>
    </ul>
  </TabItem>
</Tabs>
