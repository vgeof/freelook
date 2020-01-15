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
      console.log(findNextButton());
      findNextButton().focus();
      findNextButton().click();
    }
  }
  function createEvents() {
    // dispatch an event when the login screen asking for email appears
    if (isLoginPage() && findEmailInput()) {
      const reply = ipcRenderer.send("emailPrompt");
      console.log(reply);
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
