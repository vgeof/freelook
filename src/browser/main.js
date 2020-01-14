(function() {
  const { ipcRenderer, remote } = require("electron");
  document.addEventListener("emailPrompt", fillEmail);
  window.setInterval(function() {
    console.log("heartbeat...");
    createEvents();
  }, 1000);

  function fillEmail() {
    const email = "test@outlook.fr";
    findEmailInput().value = email;
    if (findEmailInput().value === email) {
      console.log(findNextButton());
      findNextButton().focus();
      findNextButton().click();
    }
  }
  function createEvents() {
    // dispatch an event when the login screen asking for email appears
    if (isLoginPage() && findEmailInput()) {
      var emailPrompt = new Event("emailPrompt");
      document.dispatchEvent(emailPrompt);
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
})();
