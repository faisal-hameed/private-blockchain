### NPM issues

1. Installing windows build tools
```
npm install --global --production windows-build-tools
```
2. Changing MS build version
```
npm config get msvs_version
npm config set msvs_version 2017 --global
```
3. Fix VCTargetsPath
```
C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\v140
```
