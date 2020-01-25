(function() {
  const { ipcRenderer, remote } = require("electron");
  ipcRenderer.on("fillEmail", (_, arg) => fillEmail(arg));
  ipcRenderer.on("goToLogin", goToLogin);
  window.setInterval(function() {
    console.log("heartbeat...");
    createEvents();
  }, 2000);

  function fillEmail(email) {
    console.log("filling Email");
    findEmailInput().value = email;
    if (findEmailInput().value === email) {
      rndTime = (Math.random() + 1) * 1000;
      window.setTimeout(() => {
        findNextButton().focus();
        findNextButton().click();
      }, rndTime);
    }
  }
  function goToLogin() {
    console.log("going to Login page");
    findHomeConnexionButton().focus();
    findHomeConnexionButton().click();
  }
  function createEvents() {
    // send an event when the login screen asking for email appears
    if (!!isLoginPage() && !!findEmailInput()) {
      ipcRenderer.send("emailPrompt");
    }
    if (!!isLoginPage() && !!findPasswordInput()) {
      ipcRenderer.send("passwordPrompt");
    }
    // send an event when a notification for an event appears
    if (!!findNotificationPopup()) {
      console.log("Notification poupup found");
      content = findNotificationPopup();
      ipcRenderer.send(
        "eventNotification",
        Array.from(content).map(elt => elt.innerText)
      );
    }
    if (!!findHomeConnexionButton()) {
      ipcRenderer.send("homeConnexionReady");
    }
    if (isInboxPage()) {
      console.log("sending onInbox");
      ipcRenderer.send("onInbox");
    }
  }
  function isInboxPage() {
    return document.URL.includes("https://outlook.live.com/mail/") || document.URL.includes("https://outlook.office365.com/mail/inbox");
  }
  function isLoginPage() {
    return document.URL.includes("login");
  }
  function findHomeConnexionButton() {
    return document.querySelector("[data-task=signin]");
  }
  function findEmailInput() {
    return document.querySelector("input[type=email]");
  }
  function findPasswordInput() {
    const hiddenPasswordInput = document.querySelector(
      "input[type=password].moveOffScreen"
    );
    if (!!hiddenPasswordInput) {
      return null; // we don't care about the "preloaded password prompte which is hidden"
    }
    return document.querySelector("input[type=password]");
  }
  function findNextButton() {
    return document.querySelector("input[type=submit]");
  }
  function findNotificationPopup() {
    // OWA 2010
    popup = document.querySelectorAll("#spnRmT.alertBtnTxt");
    if (popup.length > 0) return popup;
    // OWA 2013
    popup = document.querySelectorAll("[aria-label='New Notification']");
    if (popup.length > 0) return popup;
    // 365 new check
    popup = document.querySelectorAll(
      ".o365cs-notifications-notificationPopup .o365cs-notifications-notificationHeaderText"
    );
    if (popup.length > 0) return popup;
    // 365 old check
    popup = document.querySelectorAll(
      ".o365cs-notifications-notificationCounter"
    );
    if (popup.length > 0) return popup;
    // outlook.live.com beta
    popup = document.querySelectorAll('[data-storybook="reminder"]');
    if (popup.length > 0) return popup;
  }
})();
