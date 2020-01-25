<img src="build/icons/128x128.png" alt="logo" height="80" align="right" />

# Freelook

Freelook, an Electron-based client for Microsoft Outlook. This is a fork from eNkru/freelook. I rewrote some parts to have a better desktop integration with linux, especially fort people using outlook at work.

![screenshot_linux](https://user-images.githubusercontent.com/13460738/35953459-a0875872-0ce9-11e8-9bca-880564b9beee.png)

## Differences with eNkru/freelook:
 * Automatic connexion with an email stored in settings
 * Event notifications parsing inspired from mihai-chezan/owa_notifications_firefox_extension
 * Stop missing your meetings: Outlook reminders trigger Desktop Notifications (dbus for Linux) with a configurable timeout.
 * JS Event based communications between electron main and renderer processes


## Feature
* Receive your hotmail / outlook / office 365 online from the desktop app
* Close to minimise
* Dock tray support
* System notification
* Network connection detection
* Customized setting


## Build & Install
Clone the repository and run in development mode.
```
git clone https://github.com/vgeof/electron-outlook.git
cd electron-outlook
npm install
npm start
```



## License of of eNkru/freelook
[MIT](https://github.com/eNkru/electron-xiami/blob/master/LICENSE) @ [Howard Ju](https://enkru.github.io/)
