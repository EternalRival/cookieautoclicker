let toggleOn = false;
let toggleBigClicks = false;
let toggleUpgradeClicks = false;
let toggleBonusClicks = false;

let clickTimer;
let upgradeTimer;
let bonusTimer;

function changeButtonState(btnID) {
  const btn = document.getElementById(btnID);
  console.log(getSwitcherText(btn));
  btn.textContent = getSwitcherText(btn);
  btn.style.color = getSwitcherColor(btn);
}
function switchFullToggle() {
  toggleOn = !toggleOn;
  changeButtonState("toggleButton");
  if (toggleOn != toggleBigClicks) switchBigClicksToggle();
  if (toggleOn != toggleUpgradeClicks) switchUpgradeClicksToggle();
  if (toggleOn != toggleBonusClicks) switchBonusClicksToggle();
}
function switchBigClicksToggle() {
  toggleBigClicks = !toggleBigClicks;
  changeButtonState("toggleButtonBig");
  bigClicker();
}
function switchUpgradeClicksToggle() {
  toggleUpgradeClicks = !toggleUpgradeClicks;
  changeButtonState("toggleButtonUpgrade");
  upgradeClicker();
}
function switchBonusClicksToggle() {
  toggleBonusClicks = !toggleBonusClicks;
  changeButtonState("toggleButtonBonus");
  bonusClicker();
}
function addSwitcher() {
  const switcherFull = document.createElement("div");
  const switcherBig = document.createElement("div");
  const switcherUpgrade = document.createElement("div");
  const switcherBonus = document.createElement("div");
  switcherFull.style.cursor = "pointer";
  switcherBig.style.cursor = "pointer";
  switcherUpgrade.style.cursor = "pointer";
  switcherBonus.style.cursor = "pointer";

  switcherFull.id = "toggleButton";
  switcherBig.id = "toggleButtonBig";
  switcherUpgrade.id = "toggleButtonUpgrade";
  switcherBonus.id = "toggleButtonBonus";
  switcherFull.textContent = getSwitcherText(switcherFull);
  switcherBig.textContent = getSwitcherText(switcherBig);
  switcherUpgrade.textContent = getSwitcherText(switcherUpgrade);
  switcherBonus.textContent = getSwitcherText(switcherBonus);

  switcherFull.style.color = getSwitcherColor(switcherFull);
  switcherBig.style.color = getSwitcherColor(switcherBig);
  switcherUpgrade.style.color = getSwitcherColor(switcherUpgrade);
  switcherBonus.style.color = getSwitcherColor(switcherBonus);

  switcherFull.onclick = switchFullToggle;
  switcherBig.onclick = switchBigClicksToggle;
  switcherUpgrade.onclick = switchUpgradeClicksToggle;
  switcherBonus.onclick = switchBonusClicksToggle;

  const heralds = document.getElementById("heralds");
  document.getElementById("topBar").innerHTML = "";
  document.querySelector("#topBar").appendChild(heralds);
  document.querySelector("#topBar").appendChild(switcherFull);
  document.querySelector("#topBar").appendChild(switcherBig);
  document.querySelector("#topBar").appendChild(switcherUpgrade);
  document.querySelector("#topBar").appendChild(switcherBonus);
  console.log("В шапке страницы добавлены переключатели 🙃");
}
function getSwitcherColor(switcher) {
  const getColor = (s) => (s ? "lightgreen" : "grey");
  switch (switcher.id) {
    case "toggleButton":
      return getColor(toggleOn);
    case "toggleButtonBig":
      return getColor(toggleBigClicks);
    case "toggleButtonUpgrade":
      return getColor(toggleUpgradeClicks);
    case "toggleButtonBonus":
      return getColor(toggleBonusClicks);
  }
}
function getSwitcherText(switcher) {
  switch (switcher.id) {
    case "toggleButton":
      return "Полная автоматика: " + (toggleOn ? "On" : "Off");
    case "toggleButtonBig":
      return "Большая печенька: " + (toggleBigClicks ? "On" : "Off");
    case "toggleButtonUpgrade":
      return "Апгрейды: " + (toggleUpgradeClicks ? "On" : "Off");
    case "toggleButtonBonus":
      return "Всплывашки: " + (toggleBonusClicks ? "On" : "Off");
  }
}
addSwitcher();
//жмак
function clickBig() {
  Game.ClickCookie();
}
function clickBonus() {
  const bonuses = ["golden", "reindeer"];
  Game.shimmers.forEach((sh) => {
    if (bonuses.includes(sh.type)) {
      console.log(`🍪 Найден бонус: '${sh.type}'`);
      sh.pop();
    }
  });
}
function getCookiesUpcoming(s) {
  return Math.floor(Game.cookies) + Math.floor(Game.cookiesPs * s);
}
function buyUpgrade() {
  santaEvolve();
  const upgrades = Game.UpgradesInStore.filter((u) => u.pool != "toggle");
  for (let i = upgrades.length - 1; i >= 0; i--) {
    if (upgrades[i].canBuy()) upgrades[i].buy();
    else if (upgrades[i].getPrice() <= getCookiesUpcoming(30)) {
      console.log(`📈 Ждём апгрейд '${upgrades[i].name}'`);
      return;
    }
  }
  if (Game.buyMode == 1) {
    const buildings = Game.ObjectsById;
    for (let i = buildings.length - 1; i >= 0; i--) {
      if (buildings[i].locked == 0) {
        while (buildings[i].price <= Game.cookies) buildings[i].buy();
        if (buildings[i].price <= getCookiesUpcoming(15)) {
          console.log(`🏭 Ждём постройку '${buildings[i].name}'`);
          return;
        }
      }
    }
  }
}
//автожмакалки
function bigClicker() {
  if (toggleBigClicks) clickTimer = setInterval(() => clickBig(), 4);
  else clearInterval(clickTimer);
}
function upgradeClicker() {
  if (toggleUpgradeClicks) upgradeTimer = setInterval(() => buyUpgrade(), 100);
  else clearInterval(upgradeTimer);
}
function bonusClicker() {
  if (toggleBonusClicks) bonusTimer = setInterval(() => clickBonus(), 500);
  else clearInterval(bonusTimer);
}

function santaEvolve() {
  if (
    Game.specialTabs.includes("santa") &&
    Game.santaLevel + 1 < Game.santaLevels.length &&
    Math.pow(Game.santaLevel + 1, Game.santaLevel + 1) <= Game.cookies
  ) {
    Game.UpgradeSanta();
    document.getElementById("specialPopup").className = "framed prompt offScreen";
    console.log(`🎅 Уровень санты повышен до ${Game.santaLevel}`);
  }
}
