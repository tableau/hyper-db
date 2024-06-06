import React from 'react';
import { config } from '@site/src/config';
import { detectOS } from '@site/src/os_detection';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';
import LinuxIcon from '@site/static/img/devicon-linux.svg';
import WindowsIcon from '@site/static/img/devicon-windows.svg';
import MacosIcon from '@site/static/img/devicon-macos.svg';

export function DownloadPicker() {
    return (
        <Tabs defaultValue={detectOS()}>
            <TabItem
                value="windows"
                label={
                    <>
                        <WindowsIcon className={styles.svgicon} /> Windows
                    </>
                }
            >
                <ul>
                    <li>
                        <a href={config.download.windows_py}>Python .whl (Windows)</a>
                    </li>
                    <li>
                        <a href={config.download.windows_cxx}>C++ (Windows)</a>
                    </li>
                    <li>
                        <a href={config.download.windows_java}>Java (Windows)</a>
                    </li>
                </ul>
            </TabItem>
            <TabItem
                value="macos"
                label={
                    <>
                        <MacosIcon className={styles.svgicon} /> macOS
                    </>
                }
            >
                <ul>
                    <li>
                        <a href={config.download.macos_py}>Python .whl (macOS x64)</a>
                    </li>
                    <li>
                        <a href={config.download.macos_arm_py}>Python .whl (macOS ARM)</a>
                    </li>
                    <li>
                        <a href={config.download.macos_cxx}>C++ (macOS x64)</a>
                    </li>
                    <li>
                        <a href={config.download.macos_arm_cxx}>C++ (macOS ARM)</a>
                    </li>
                    <li>
                        <a href={config.download.macos_java}>Java (macOS x64)</a>
                    </li>
                    <li>
                        <a href={config.download.macos_arm_java}>Java (macOS ARM)</a>
                    </li>
                </ul>
            </TabItem>
            <TabItem
                value="linux"
                label={
                    <>
                        <LinuxIcon className={styles.svgicon} /> Linux
                    </>
                }
            >
                <ul>
                    <li>
                        <a href={config.download.linux_py}>Python .whl (Linux)</a>
                    </li>
                    <li>
                        <a href={config.download.linux_cxx}>C++ (Linux)</a>
                    </li>
                    <li>
                        <a href={config.download.linux_java}>Java (Linux)</a>
                    </li>
                </ul>
            </TabItem>
        </Tabs>
    );
}
