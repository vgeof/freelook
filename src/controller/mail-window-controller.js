const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification
} = require("electron");
const settings = require("electron-settings");
const CssInjector = require("../mainProcess/css-injector");
const path = require("path");
const fs = require("fs-extra");
const isOnline = require("is-online");

const settingsExist = fs.existsSync(`${app.getPath("userData")}/Settings`);
// const homepageUrl = settingsExist ? settings.get('homepageUrl', 'https://outlook.live.com/mail') : 'https://outlook.live.com/mail';
const homepageUrl = "https://outlook.live.com/login.srf/?nlp=1";
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

    // and load the index.html of the app.
    this.win.loadURL(homepageUrl);

    // Show window handler
    ipcMain.on("show", () => {
      this.show();
    });
    this.show();

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
    ipcMain.on("emailPrompt", (event, _) =>
      event.sender.send("fillEmail", "test@outlook.fr")
    );
    let firstTime = true;
    ipcMain.on("eventNotification", (_, arg) => {
      if (firstTime) {
        let notif = new Notification({
          title: "New notif",
          subtitle: "Outlook",
          body: arg
        });
        notif.show();
        firstTime = false;
      }
    });

    // Open the new window in external browser
    this.win.webContents.on("new-window", this.openInBrowser);
  }

  addUnreadNumberObserver() {
    this.win.webContents.executeJavaScript(`
            setTimeout(() => {
                let unreadSpan = document.querySelector('._2iKri0mE1PM9vmRn--wKyI');
                require('electron').ipcRenderer.send('updateUnread', unreadSpan.hasChildNodes());

                let observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        // console.log('Observer Changed.');
                        require('electron').ipcRenderer.send('updateUnread', unreadSpan.hasChildNodes());

                        // Scrape messages and pop up a notification
                        var messages = document.querySelectorAll('div[role="listbox"][aria-label="Message list"]');
                        if (messages.length)
                        {
                            var unread = messages[0].querySelectorAll('div[aria-label^="Unread"]');
                            var body = "";
                            for (var i = 0; i < unread.length; i++)
                            {
                                if (body.length)
                                {
                                    body += "\\n";
                                }
                                body += unread[i].getAttribute("aria-label").substring(7, 127);
                            }
                            if (unread.length)
                            {
                                var notification = new Notification(unread.length + " New Messages", {
                                    body: body,
                                    icon: "assets/outlook_linux_black.png"
                                });
                                notification.onclick = () => {
                                    require('electron').ipcRenderer.send('show');
                                };
                            }
                        }
                    });
                });
            
                observer.observe(unreadSpan, {childList: true});

                // If the div containing reminders gets taller we probably got a new
                // reminder, so force the window to the top.
                let reminders = document.getElementsByClassName("_1BWPyOkN5zNVyfbTDKK1gM");
                let height = 0;
                let reminderObserver = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (reminders[0].clientHeight > height)
                        {
                            require('electron').ipcRenderer.send('show');
                        }
                        height = reminders[0].clientHeight;
                    });
                });

                if (reminders.length) {
                    reminderObserver.observe(reminders[0], { childList: true });
                }

            }, 10000);
        `);
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
        this.splashWin.destroy();
      } else {
        this.splashWin.webContents.send("connect-timeout");
      }
    });
  }
}

module.exports = MailWindowController;
