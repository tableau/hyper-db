import https from 'https';
import fs from 'fs';
import { config } from './src/config';

function downloadFile(targetPath: string, url: string) {
    console.log(`Downloading ${url}`);
    return new Promise<void>(( resolve, reject ) => {
        const file = fs.createWriteStream(targetPath);
        const request = https.get(url, function(response) {
            response.pipe(file);
    
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                console.log("Download Completed");
                resolve();
            });
            file.on('error', (e)=> {
                file.close();
                reject(e);
            });
        });
    });
}

async function downloadArtifact(artifactName: string) {
    const url = config.download[artifactName];
    if(!url) throw `Unknown artifact ${artifactName}`
    const fileSuffix = url.split(".").slice(-1);
    await downloadFile(artifactName + "." + fileSuffix, url)
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
