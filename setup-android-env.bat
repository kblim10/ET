@echo off
echo Setting up Android environment variables for this session...

REM Check if Android Studio is installed in common locations
if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\" (
    set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo Found Android SDK at: %ANDROID_HOME%
) else if exist "C:\Android\Sdk\" (
    set ANDROID_HOME=C:\Android\Sdk
    echo Found Android SDK at: %ANDROID_HOME%
) else (
    echo Android SDK not found in common locations.
    echo Please install Android Studio and set ANDROID_HOME manually.
    echo Common path: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    pause
    exit /b 1
)

REM Add Android tools to PATH for this session
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

echo.
echo Environment variables set for this PowerShell session:
echo ANDROID_HOME=%ANDROID_HOME%
echo.
echo You can now run:
echo   npx react-native run-android
echo.

REM Update local.properties file
echo sdk.dir=%ANDROID_HOME% > android\local.properties
echo Updated android\local.properties with SDK path

echo.
echo Press any key to open a new PowerShell window with Android environment...
pause > nul

REM Open new PowerShell with environment
powershell -NoExit -Command "cd '%~dp0'; $env:ANDROID_HOME='%ANDROID_HOME%'; $env:PATH='%PATH%'; Write-Host 'Android environment configured. You can now run: npx react-native run-android' -ForegroundColor Green"
