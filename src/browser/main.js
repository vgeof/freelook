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
      console.log(content.innerText);
      ipcRenderer.send("eventNotification", content.innerText);
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
    popup = document.querySelector("#spnRmT.alertBtnTxt");
    if (!!popup) return popup;
    // OWA 2013
    popup = document.querySelector("[aria-label='New Notification']");
    if (!!popup) return popup;
    // 365 new check
    popup = document.querySelector(
      ".o365cs-notifications-notificationPopup .o365cs-notifications-notificationHeaderText"
    );
    if (!!popup) return popup;
    // 365 old check
    popup = document.querySelector(".o365cs-notifications-notificationCounter");
    if (!!popup) return popup;
    // outlook.live.com beta
    popup = document.querySelector('[data-storybook="reminder"]');
    if (!!popup) return popup;
  }
})();
