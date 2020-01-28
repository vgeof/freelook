const settings = require("electron-settings");

saveSettings = () => {
  const verticalInput = document.querySelector(
    "#ads-blocker-vertical-class input"
  );
  settings.set("verticalAdsClass", verticalInput.value);
  const smallInput = document.querySelector("#ads-blocker-small-class input");
  settings.set("smallAdsClass", smallInput.value);

  const premiumInput = document.querySelector(
    "#ads-blocker-premium-class input"
  );
  settings.set("premiumAdsClass", premiumInput.value);
  // load home url setting
  const homepageUrlDom = document.querySelector("#homepageUrl");
  settings.set("homepageUrl", homepageUrlDom.value);

  const defaultEmailInput = document.querySelector("#email-value input");
  settings.set("default-email", defaultEmailInput.value);
};
loadSettings = () => {
  // load ads blocker setting
  const verticalClass = settings.get("verticalAdsClass");
  const verticalInput = document.querySelector(
    "#ads-blocker-vertical-class input"
  );
  if (verticalClass) verticalInput.value = verticalClass;

  const smallClass = settings.get("smallAdsClass");
  const smallInput = document.querySelector("#ads-blocker-small-class input");
  if (smallClass) smallInput.value = smallClass;

  const premiumClass = settings.get("premiumAdsClass");
  const premiumInput = document.querySelector(
    "#ads-blocker-premium-class input"
  );
  if (premiumClass) premiumInput.value = premiumClass;

  // load home url setting
  const homepageUrl = settings.get(
    "homepageUrl",
    "https://outlook.live.com/mail"
  );
  const homepageUrlDom = document.querySelector("#homepageUrl");
  homepageUrlDom.value = homepageUrl;

  const defaultEmail = settings.get("default-email");
  console.log(defaultEmail);
  const defaultEmailInput = document.querySelector("#email-value input");
  if (defaultEmail) defaultEmailInput.value = defaultEmail;
  else defaultEmailInput.value = "";
};

loadSettings();
var saveButton = document.querySelector("#saveButton");
saveButton.addEventListener("click", saveSettings);
var cancelButton = document.querySelector("#cancelButton");
cancelButton.addEventListener("click", loadSettings);
var resetButton = document.querySelector("#resetButton");
resetButton.addEventListener("click", () => {
  console.log("resetting settings");
  settings.deleteAll();
  loadSettings();
});
