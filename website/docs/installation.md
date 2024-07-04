---
description: Advanced installation instructions
---

# Installation


```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Link } from "react-router-dom";
```

Hyper API is available for Python, C++ and Java supporting Windows, Mac and Linux each.
Depending on the language, the installation can be complex.
This page contains the detailed requirements and installation instructions for all languages.

## License

The Hyper API packages are released under the Apache 2.0 License.
The exact license text can be found inside the packages, after unzipping.
The documentation is licensed under the MIT License.
The [source code of the documentation](https://github.com/tableau/hyper-db) can be found on GitHub.


## Hardware requirements

The Hyper API only supports 64-bit platforms. It has the following minimum hardware requirements:

- Intel Nehalem, Apple Silicon or AMD Bulldozer processor or newer
- 2 GB memory
- 1.5 GB minimum free disk space


## Supported platforms

- macOS 10.13 or newer (for Intel)
- macOS 13.0 or newer (for Apple Silicon)
- Microsoft Windows 8 or newer (64-bit)
- Microsoft Windows Server 2016, 2012, 2012 R2, 2008 R2, 2019
- Ubuntu 18.04 LTS, 20.04 LTS and 22.04 LTS
- Amazon Linux 2, Red Hat Enterprise Linux (RHEL) 7.3+ and 8.3+, CentOS 7.9+, Oracle Linux 7.3+

## Language-specific Requirements

```mdx-code-block
<Tabs queryString="client-language">
  <TabItem value="python" label="Python" default>
```

* **[Python 3.8](https://www.python.org/downloads/)** (or newer) is required.
  - Install the 64-bit version (for example, for Windows, the download is listed as `Windows x86-64`).
  - On Windows, we recommend to select the option **Add Python 3.x to PATH** during installation.

```mdx-code-block
  </TabItem>
  <TabItem value="cxx" label="C++">
```

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

* **[JDK 8](https://www.oracle.com/java/technologies/downloads/)** (or newer) is required.

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
    - Download the [samples from Github](https://github.com/tableau/hyper-api-samples).
    - Run the Python examples (for example, try `insert_data_into_single_table.py`).
        - On Windows:
        `[venv_directory]\Scripts\python hyper-api-samples\Tableau-Supported\Python\insert_data_into_single_table.py`
        - On Linux/macOS:
        `[venv_directory]/bin/python hyper-api-samples/Tableau-Supported/Python/insert_data_into_single_table.py`

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
</Tabs>
```
