---
description: Advanced installation instructions
---

# Installation


```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Link } from "react-router-dom";
```

Hyper API is available for Python, C++, Java and .NET supporting Windows, Mac and Linux each.
Depending on the language, the installation can be complex.
This page contains the detailed requirements and installation instructions for all languages.

## Supported platforms

- Microsoft Windows 8 or newer (64-bit)
- macOS 10.13 or newer
- Microsoft Windows Server 2016, 2012, 2012 R2, 2008 R2, 2019
- Ubuntu 18.04 LTS, 20.04 LTS and 22.04 LTS
- Amazon Linux 2, Red Hat Enterprise Linux (RHEL) 7.3+ and 8.3+, CentOS 7.9+, Oracle Linux 7.3+

## Hardware requirements

The Hyper API only supports 64-bit platforms. 
It has the following minimum hardware requirements:

- Intel Nehalem or AMD Bulldozer processor or newer
- 2 GB memory
- 1.5 GB minimum free disk space

## Language-specific Requirements

```mdx-code-block
<Tabs queryString="client-language">
  <TabItem value="python" label="Python" default>
```

* The Hyper API supports `x86-64` platforms.
* **[Python 3.8](https://www.python.org/downloads/)** (or newer) is required.
  - Install the 64-bit version (for example, for Windows, the download is listed as `Windows x86-64`).
  - On Windows, we recommend to select the option **Add Python 3.x to PATH** during installation.

:::info
Hyper API runs on Apple Silicon only with [Rosetta 2](https://support.apple.com/en-us/HT211861) instead of natively. In particular for Python, this means that the host Python needs to run with Rosetta, too.
:::

```mdx-code-block
  </TabItem>
  <TabItem value="cxx" label="C++">
```

* The Hyper API supports `x86-64` platforms.
* The C++ headers use C++11, so a **standard-compliant compiler with thorough C++11 support** is required. Our internal testing is done with the newest Clang.

:::tip
Using at least C++17 is recommended, as the API uses C++17 classes, such as `std::optional` and `std::string_view`. If the headers are compiled with a standard older than C++17, interface-compatible classes of the API will be used instead.
:::

* For the examples, a CMake project file is provided. To build it, **[CMake](https://cmake.org/download/)** must be installed on your computer and available in your PATH.
  * On Windows, you also need Visual Studio 2015 (or newer).

```mdx-code-block
  </TabItem>
  <TabItem value="java" label="Java">
```

* The Hyper API supports `x86-64` platforms.
* **[JDK 8](https://www.oracle.com/java/technologies/downloads/)** (or newer) is required.

```mdx-code-block
  </TabItem>
  <TabItem value="dotnet" label=".NET">
```

* The Hyper API supports `x86-64` platforms.
* **[.NET Core 2.2 SDK](https://dotnet.microsoft.com/download)** (or newer) or **[.NET Framework 4.6.1](https://dotnet.microsoft.com/en-us/download/dotnet-framework)** (or newer) is required.
  * The examples use the .NET Core SDK.

```mdx-code-block
  </TabItem>
</Tabs>
```


## Instructions

```mdx-code-block
<Tabs queryString="client-language">
  <TabItem value="python" label="Python" default>
```

:::note
The following instructions assume that you have set up a virtual environment for Python. For more information on creating virtual environments, see [venv - Creation of virtual environments](https://docs.python.org/3/library/venv.html) in the Python Standard Library.
:::

1. Open a terminal and navigate to the `venv` directory.

1. Install the **[tableauhyperapi](https://pypi.org/project/tableauhyperapi/)** module using **pip**.

    ```
    pip install tableauhyperapi
    ```

    If you previously installed the `tableauhyperapi`, you can upgrade to the latest version using the following command.

    ```
    pip install --upgrade tableauhyperapi
    ```

    :::warning
    Linux installations require `pip` version 19.3 or newer. Note that `pip` versions 20.0 and 20.1 are not working because of issues with `pip`.
    :::

    Alternatively, you can [download](/docs/releases#download) the Python **Hyper API wheel package (`.whl` file)** for your operating system. Use `pip` to install the `.whl` file you downloaded.
      * On Windows: `Scripts\pip install [*path_to_whl_file*]`
      * On Linux/macOS: `bin/pip install [*path_to_whl_file*]`

1. Try out the examples:
    - [Download](/docs/releases#download) and unzip the Python `.zip` package for your operating system.
    - Open a terminal and navigate into the `examples` directory.
    - Run the Python examples (for example, try `insert_data_into_single_table.py`).
        - On Windows:
        `[venv_directory]\Scripts\python insert_data_into_single_table.py`
        - On Linux/macOS:
        `[venv_directory]/bin/python insert_data_into_single_table.py`

```mdx-code-block
  </TabItem>
  <TabItem value="cxx" label="C++">
```

1. [Download](/docs/releases#download) the C++ Hyper API package file (`.zip` file) for your operating system.

1. Unzip the Hyper API package file to a convenient location.

1. To build and run the examples on the command line:
    - Open a terminal. On Windows, open the **VS2019 x64 Native Tools Command Prompt**.
    - Navigate into the `examples` directory of the extracted C++ Hyper API package.
    - Configure the project with `cmake`:
        - On Windows: `cmake -G "Visual Studio 16 2019 Win64" .`
        - On Linux/macOS: `cmake .`
    - Build the examples:
        - On Windows: `cmake --build . --config Debug`
          or `cmake --build . --config Release`
        - On Linux/macOS: `cmake --build .`
    - Run the examples
        - On Windows: `ctest --verbose -C Debug`
          or `ctest --verbose -C Release`
        - On Linux/macOS: `ctest --verbose`

1. To build and run the examples in Visual Studio, go to **File > Open > Folder** and select the `examples` directory of the `tableauhyperapi-cxx` package.

1. If you want to build your own applications, you need to install the Hyper API library on your computer. To do this:
    - On Windows: Append the extracted bin directory to your system `PATH` variable.
    - On Linux: Append the extracted lib directory to your system `LD_LIBRARY_PATH` variable.
    - On macOS: You need to include the lib directory as `RPATH` for every binary.

```mdx-code-block
  </TabItem>
  <TabItem value="java" label="Java">
```

1. [Download](/docs/releases#download) the Java Hyper API package file (`.zip` file) for your operating system.

1. Unzip the Hyper API package file to a convenient location.

1. To build and run the examples on the command line:
    - Open a terminal and navigate into the `examples` directory of the extracted Java Hyper API package.
    - Build the examples: `gradle build`
    - Run the examples: `gradle run`

1. You can import the example project into IntelliJ or Eclipse:
    - IntelliJ:
        - Import the Hyper API into IntelliJ by opening the `build.gradle` file from the unzipped Hyper API package.
        - In the **Gradle** view, choose an example and select **Tasks > application > run**.
    - Eclipse:
        - You need to have a recent version of Eclipse installed to use Gradle.
        - Import the Hyper API into Eclipse as an existing Gradle project (**File > Import > Gradle > Existing Gradle Project**).
        - Select the directory of the unzipped Hyper API package as the "Project root directory".
        - Select **Override workspace settings** in the "Import Options" dialog and use at least Gradle version 5.5.
        - In the **Gradle Tasks** view, choose an example and select **application > run**.

1. You can create new projects that use the Hyper API in IntelliJ or Eclipse:
    - Create a new Java project. Make sure the JDK is set to Java 8, that is, **JavaSDK-1.8**.
    - Add the following libraries from the `lib` directory of the unzipped Hyper API package as external JARs:
        `tableauhyperapi.jar`
        `tableauhyperapi-windows.jar` (Windows),
        `tableauhyperapi-linux.jar` (Linux),
        `tableauhyperapi-darwin.jar` (macOS)
        `jna-5.6.0.jar`
    - Copy the `hyper` folder from the `lib` directory of the unzipped Hyper API package next to the JARs, as in the example project.
    - To enable proper Javadoc, add the `hapi-javadoc.jar` from the lib directory as the Javadoc archive.


### Java Native Access Library

If your security requirements require you to run Java applications with the system property `jna.nounpack` set to `true`, which disables unpacking from a `.jar` file, you need to obtain the native Hyper API library in another way. While you could extract the library from the `.jar` file in the Java Hyper API package, the easiest way is to download and unzip the C++ Hyper API package for your platform, as described in the following steps:

1. [Download](/docs/releases#download) `hyperapi-cxx` package for your platform.
1. Unzip the package and place the native Hyper API library in a directory or folder accessible by the Java application.
    * For Windows, the native library (`tableauhyperapi.dll`) file is in the `bin` directory of the `.zip` file.
    * For Linux, the library (`libtableauhyperapi.so`) is in the `lib` directory of the `.zip` file.
    * For macOS, the library (`libtableauhyperapi.dylib`) is in the `lib` folder of the `.zip` file.
1. Set system property `jna.library.path` with value set to the absolute path of the folder or directory that contains the native library file for your platform (from step 2).

```mdx-code-block
  </TabItem>
  <TabItem value="dotnet" label=".NET">
```

You can install the Hyper API for .NET in two ways. You can either download the `.zip` file that contains the library and example code, or you can install the NuGet package for the library, either directly, or by adding a reference to your project.

### Using the Hyper API NuGet package {#using-the-hyper-api-nuget-package}

The Hyper API library is available as a NuGet package. To use the library, you need to add a reference to the `Tableau.HyperAPI.NET` package in your project. Use the NuGet Package Manager in Visual Studio, or for other installation options, see **[Tableau.HyperAPI.NET in the NuGet Gallery](https://www.nuget.org/packages/Tableau.HyperAPI.NET/)**.

### Hyper API for .NET installation from the download (.zip) package

In addition to using the NuGet package, you can also download the Hyper API library for .NET. The download package includes the .NET examples for the Hyper API.

1. [Download](/docs/releases#download) the .NET Hyper API package file (`.zip` file) for your operating system. The files are identified as `tableauhyperapi-dotnet-`
1. Unzip the Hyper API package file to a convenient location.
1. Build and run the examples.
    * To run the examples, you need to install .Net Core 2.2 SDK or newer. You can install it from the [official .NET download page](https://dotnet.microsoft.com/download).
    * To build the example project, open a terminal, navigate into the example directory and run:
        * On Windows: `build.bat`
        * On Linux/macOS: `./build.sh`
    * Then run the examples with `dotnet run`. For example, `dotnet run -- insert-data-into-single-table`

    :::note
    The examples assume that you have .NET Core 2.2 installed. Depending upon the version of the .NET Core Framework you are using (2.2 or later), you might need to change the `<TargetFramework>` version in the project file (`Example.csproj`). You might also need to change the `xcopy` path in the `build.bat` or `build.sh` file.
    :::

### Use Visual Studio to create new .NET project

 You can create a new project with the Hyper API in Visual Studio.

* In Visual Studio, create or initialize a new .NET project.
* In the project file (`.csproj`), add a reference to the managed library (`Tableau.HyperAPI.NET.dll`). The library is located in the `lib` directory where you extracted the Hyper API package.

  ```xml
        <ItemGroup>
          <Reference Include="Tableau.HyperAPI.NET">
              <HintPath>../lib/Tableau.HyperAPI.NET.dll</HintPath>
          </Reference>
        </ItemGroup>
  ```

* Or if you want to use the NuGet package, and a reference to the package as described [Using the Hyper API NuGet package](#using-the-hyper-api-nuget-package).
* Change the platform to **x64** in the Configuration manager.
* Make sure to deploy the native tableauhyperapi library (`tableauhyperapi.dll` on Windows and `libtableauhyperapi.so` on Linux) and the `hyper` folder next to the managed `Tableau.HyperAPI.NET.dll` assembly. Both are located in the `lib` folder where you installed the Hyper API package.

```mdx-code-block
  </TabItem>
</Tabs>
```
