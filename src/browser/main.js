(function() {
  const { ipcRenderer, remote } = require("electron");
  ipcRenderer.on("fillEmail", (_, arg) => fillEmail(arg));
  window.setInterval(function() {
    console.log("heartbeat...");
    createEvents();
  }, 1000);

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
  function createEvents() {
    // send an event when the login screen asking for email appears
    if (!!isLoginPage() && !!findEmailInput()) {
      const reply = ipcRenderer.send("emailPrompt");
      console.log(reply);
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
  }
  function isLoginPage() {
    return document.URL.includes("login");
  }
  function findEmailInput() {
    return document.querySelector("input[type=email]");
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
    console.log(popup);
    if (popup.length > 0) return popup;
  }
})();
