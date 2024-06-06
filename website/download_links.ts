import { config } from './src/config';
import { spawn } from 'child_process';

function downloadFile(targetPath: string, url: string) {
    const cmd = `curl --output ${targetPath} ${url}`
    console.log(`Downloading ${url} to ${targetPath}`);
    console.log(cmd)
    spawn(cmd, [], { shell: true, stdio: 'inherit' })
}

async function downloadArtifact(artifactName: string) {
    const url = config.download[artifactName];
    if(!url) throw `Unknown artifact ${artifactName}`
    const fileSuffix = url.split(".").slice(-1);
    downloadFile(artifactName + "." + fileSuffix, url)
}

async function doDownloads() {
    const args = process.argv.slice(2);
    for (const v of args) {
        await downloadArtifact(v)
    };
}

doDownloads().catch((e) => {
    console.log(e);
    process.exit(1);
})
