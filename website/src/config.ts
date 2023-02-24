const version = '0.0.16491.r416a9c30';
const pyversion = version.substr(0, version.lastIndexOf('.'));

const downloadBaseUrl = 'https://downloads.tableau.com/tssoftware/';

export const config = {
    download: {
        windows_py: `${downloadBaseUrl}/tableauhyperapi-${pyversion}-py3-none-win_amd64.whl`,
        windows_cxx: `${downloadBaseUrl}/tableauhyperapi-cxx-windows-x86_64-release-main.${version}.zip`,
        windows_java: `${downloadBaseUrl}/tableauhyperapi-java-windows-x86_64-release-main.${version}.zip`,
        windows_dotnet: `${downloadBaseUrl}/tableauhyperapi-dotnet-windows-x86_64-main.${version}.zip`,

        macos_py: `${downloadBaseUrl}/tableauhyperapi-${pyversion}-py3-none-macosx_10_11_x86_64.whl`,
        macos_cxx: `${downloadBaseUrl}/tableauhyperapi-cxx-macos-x86_64-release-main.${version}.zip`,
        macos_java: `${downloadBaseUrl}/tableauhyperapi-java-macos-x86_64-release-main.${version}.zip`,
        macos_dotnet: `${downloadBaseUrl}/tableauhyperapi-dotnet-macos-x86_64-main.${version}.zip`,

        linux_py: `${downloadBaseUrl}/tableauhyperapi-${pyversion}-none-manylinux2014_x86_64.whl`,
        linux_cxx: `${downloadBaseUrl}/tableauhyperapi-cxx-linux-x86_64-release-main.${version}.zip`,
        linux_java: `${downloadBaseUrl}/tableauhyperapi-java-linux-x86_64-release-main.${version}.zip`,
        linux_dotnet: `${downloadBaseUrl}/tableauhyperapi-dotnet-linux-x86_64-main.${version}.zip`,
    },
};
