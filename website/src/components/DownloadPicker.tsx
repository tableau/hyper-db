import React from 'react';
import { config } from '@site/src/config';
import { detectOS } from '@site/src/os_detection';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

export function DownloadPicker() {
  const isAppleSilicon = false;

  return <Tabs defaultValue={detectOS()}>
    <TabItem value="windows" label="Windows">
      <ul>
        <li><a href={config.download.windows_py}>Python .whl (Windows)</a></li>
        <li><a href={config.download.windows_cxx}>C++ (Windows)</a></li>
        <li><a href={config.download.windows_java}>Java (Windows)</a></li>
        <li><a href={config.download.windows_dotnet}>.Net (Windows)</a></li>
      </ul>
    </TabItem>
    <TabItem value="macos" label="macOS">
      <ul>
        <li><a href={config.download.macos_py}>Python .whl (macOS)</a></li>
        <li><a href={config.download.macos_cxx}>C++ (macOS)</a></li>
        <li><a href={config.download.macos_java}>Java (macOS)</a></li>
        <li><a href={config.download.macos_dotnet}>.Net (macOS)</a></li>
      </ul>
      <Admonition type="info" title="Apple Silicon support">
        <p>Hyper API runs on Apple Silicon only under Rosetta 2 instead of natively. In particular for Python, this means that your host Python needs to be running in Intel mode.</p>
      </Admonition>
    </TabItem>
    <TabItem value="linux" label="Linux">
      <ul>
        <li><a href={config.download.linux_py}>Python .whl (Linux)</a></li>
        <li><a href={config.download.linux_cxx}>C++ (Linux)</a></li>
        <li><a href={config.download.linux_java}>Java (Linux)</a></li>
        <li><a href={config.download.linux_dotnet}>.Net (Linux)</a></li>
      </ul>
    </TabItem>
  </Tabs>
}
