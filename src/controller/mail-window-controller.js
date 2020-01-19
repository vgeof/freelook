const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification,
  session
} = require("electron");
const notifier = require("node-notifier");
const settings = require("electron-settings");
const CssInjector = require("../mainProcess/css-injector");
const path = require("path");
const fs = require("fs-extra");
const isOnline = require("is-online");

const settingsExist = fs.existsSync(`${app.getPath("userData")}/Settings`);
// const homepageUrl = settingsExist ? settings.get('homepageUrl', 'https://outlook.live.com/mail') : 'https://outlook.live.com/mail';
const homepageUrl = "https://outlook.live.com/";
const deeplinkUrls = [
  "outlook.live.com/mail/deeplink",
  "outlook.office365.com/mail/deeplink",
  "outlook.office.com/mail/deeplink"
];
const outlookUrls = [
  "outlook.live.com",
  "outlook.office365.com",
  "outlook.office.com"
];

class MailWindowController {
  constructor() {
    this.initSplash();
    setTimeout(() => this.connectToMicrosoft(), 1000);
  }

  init() {
    // Get configurations.
    const showWindowFrame = settings.get("showWindowFrame", true);

    // Create the browser window.
    this.win = new BrowserWindow({
      x: 100,
      y: 100,
      width: 1400,
      height: 900,
      frame: showWindowFrame,
      autoHideMenuBar: true,
      show: false,
      icon: path.join(__dirname, "../../assets/outlook_linux_black.png"),
      webPreferences: {
        preload: path.resolve(__dirname, "..", "browser", "main.js"),
        nativeWindowOpen: true,
        nodeIntegration: false
      }
    });
    this.win.webContents.setUserAgent(
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0"
    );
    session.defaultSession.clearStorageData();

    // and load the index.html of the app.
    this.win.loadURL(homepageUrl);

    // Show window handler
    ipcMain.on("show", () => {
      this.show();
    });
    let firstShowDone = false;
    let firstInboxPage = true;
    ipcMain.on("onInbox", () => {
      if (firstInboxPage) {
        console.log("arrived on inbox, showing page");
        this.splashWin.destroy();

        if (!firstShowDone) this.show();
        firstInboxPage = false;
      }
    });
    setTimeout(() => {
      if (!firstShowDone) this.show();
    }, 20000);

    // insert styles
    //this.win.webContents.on('dom-ready', () => {
    //    this.win.webContents.insertCSS(CssInjector.main);
    //    if (!showWindowFrame) this.win.webContents.insertCSS(CssInjector.noFrame);

    //    //this.addUnreadNumberObserver();

    //    this.win.show()
    //});

    // prevent the app quit, hide the window instead.
    this.win.on("close", e => {
      if (this.win.isVisible()) {
        e.preventDefault();
        this.win.hide();
      }
    });

    // Emitted when the window is closed.
    this.win.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.win = null;
    });

    let loginFirstTry = true;
    ipcMain.on("emailPrompt", (event, _) => {
      if (loginFirstTry) {
        const email = settings.get("default-email");
        event.sender.send("fillEmail", email);
        this.splashWin.webContents.send("fillEmail", email);
        loginFirstTry = false;
      }
    });
    let firstPasswordPrompt = true;
    ipcMain.on("passwordPrompt", (event, _) => {
      if (firstPasswordPrompt) {
        this.show();
        firstPasswordPrompt = false;
      }
    });
    let alreadyDisplayed = [];
    ipcMain.on("homeConnexionReady", (event, _) => {
      event.sender.send("goToLogin");
    });
    ipcMain.on("eventNotification", (_, args) => {
      console.log(alreadyDisplayed);
      console.log(args);
      args.forEach(arg => {
        console.log(arg);

        const splitted = arg.split("\n");
        const title = splitted[0];

        if (!alreadyDisplayed.includes(title)) {
          console.log("sending notification ");
          notifier
            .notify(
              {
                title: "Outlook",
                message: arg,
                icon: path.join(__dirname, "../../build/icons/128x128.png"),
                timeout: 600000
              },
              function(err, data) {
                console.log(err, data);
              }
            )
            .on("click", function() {
              console.log(arguments);
            });
          alreadyDisplayed.push(title);
        }
      });
    });

    // Open the new window in external browser
    this.win.webContents.on("new-window", this.openInBrowser);
  }

  toggleWindow() {
    if (this.win) {
      if (this.win.isFocused()) {
        this.win.hide();
      } else {
        this.show();
      }
    }
  }

  openInBrowser(e, url) {
    // console.log(url);
    if (new RegExp(deeplinkUrls.join("|")).test(url)) {
      // Default action - if the user wants to open mail in a new window - let them.
    } else if (new RegExp(outlookUrls.join("|")).test(url)) {
      // Open calendar, contacts and tasks in the same window
      e.preventDefault();
      this.loadURL(url);
    } else {
      // Send everything else to the browser
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  show() {
    this.win.show();
    this.win.focus();
  }

  initSplash() {
    this.splashWin = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.splashWin.loadURL(
      `file://${path.join(__dirname, "../view/splash.html")}`
    );

    ipcMain.on("reconnect", () => {
      this.connectToMicrosoft();
    });
  }

  connectToMicrosoft() {
    (async () => await isOnline({ timeout: 15000 }))().then(result => {
      if (result) {
        this.init();
      } else {
        this.splashWin.webContents.send("connect-timeout");
      }
    });
  }
}

module.exports = MailWindowController;
