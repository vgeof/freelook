<img src="build/icons/128x128.png" alt="logo" height="80" align="right" />

# Freelook

Freelook, an Electron-based client for Microsoft Outlook.

![screenshot_linux](https://user-images.githubusercontent.com/13460738/35953459-a0875872-0ce9-11e8-9bca-880564b9beee.png)

## Feature
* Receive your hotmail / outlook / office 365 online from the desktop app
* Close to minimise
* Dock tray support
* System notification
* Network connection detection
* Customized setting
    * Ads block as your control
    * Switch between outlook and office 365

## Build Pre-Request
* [GIT](https://git-scm.com/)
* [YARN](https://yarnpkg.com/)

## Build & Install
Clone the repository and run in development mode.
```
git clone https://github.com/eNkru/electron-outlook.git
cd electron-outlook
yarn
yarn start
```
Build the application 
```
yarn run dist:linux
```
This will build an AppImage in the dist folder. This file can be run in most popular linux distributions.

## Release
```
npm version (new release version)
git push origin master
git push origin --tags
npm publish
```

## Download
The released application can be downloaded [here](https://github.com/eNkru/electron-outlook/releases).

## License
[MIT](https://github.com/eNkru/electron-xiami/blob/master/LICENSE) @ [Howard Ju](https://enkru.github.io/)
