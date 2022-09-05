
let slime = 0
let slimeSinceLastTick = 0
let clickIncrement = 1
let totalSlimeCollected = 0
let manualSlimeCollected = 0
let autoSlimeCollected = 0
const tickInMilliSeconds = 3000

let updateCounter = 0

// DOM Elements
const slimesCollectedElem = document.getElementById("slimes-collected")
const clickAugmentsIconElem = document.getElementById("click-augments")
const clickersIconElem = document.getElementById("clickers")
const trappersIconElem = document.getElementById("trappers")
const slimeHoundsIconElem = document.getElementById("slime-hounds")
const clickAugmentUpgradeElem = document.getElementById("click-augment-upgrade")
const clickAugmentQuantityElem = document.getElementById("click-augment-quantity")
const clickerQuantityElem = document.getElementById("clicker-quantity")
const clickerUpgradeElem = document.getElementById("clicker-upgrade")
const trappersQuantityElem = document.getElementById("trappers-quantity")
const trappersUpgradeElem = document.getElementById("trappers-upgrade")
const slimeHoundQuantityElem = document.getElementById("slime-hound-quantity")
const slimeHoundUpgradeElem = document.getElementById("slime-hound-upgrade")
const slimePerClickElem = document.getElementById("slime-per-click")
const slimePerSecondElem = document.getElementById("slime-per-second")
const totalSlimeElem = document.getElementById("total-slime")
const manualSlimeElem = document.getElementById("manual-slime")
const autoSlimeElem = document.getElementById("auto-slime")
const shopElem = document.getElementById("shop")
const badgesElem = document.getElementById("badges")


let upgrades = [
  {
    name: "click-augment",
    type: "click",
    costInitial: 15,
    costCurrent: 15,
    costMultiplier: 1.2,
    quantity: 0,
    icon: `<i class="mdi mdi-sword text-theme-accent"></i>`,
    iconX10: `<i class="mdi mdi-sword text-x10"></i>`,
    iconX100: `<i class="mdi mdi-sword text-x100"></i>`,
    iconX1000: `<i class="mdi mdi-sword text-x1000"></i>`,
    clickAmountMultiplier: 2,
    clicksPerTickInitial: 1,
    clicksPerTickCurrent: 1,
    isHidden: true,
    shopItemElem: document.getElementById("click-augment-item")
  },
  {
    name: "clicker",
    type: "auto",
    costInitial: 100,
    costCurrent: 100,
    costMultiplier: 1.2,
    quantity: 0,
    icon: `<i class="mdi mdi-sword-cross text-theme-accent"></i>`,
    iconX10: `<i class="mdi mdi-sword-cross text-x10"></i>`,
    iconX100: `<i class="mdi mdi-sword-cross text-x100"></i>`,
    iconX1000: `<i class="mdi mdi-sword-cross text-x1000"></i>`,
    clickAmountMultiplier: 1.2,
    clicksPerTickInitial: 1,
    clicksPerTickCurrent: 1,
    isHidden: true,
    shopItemElem: document.getElementById("clicker-item")
  },
  {
    name: "trappers",
    type: "auto",
    costInitial: 300,
    costCurrent: 300,
    costMultiplier: 1.2,
    quantity: 0,
    icon: `<i class="mdi mdi-cog-pause text-theme-accent"></i>`,
    iconX10: `<i class="mdi mdi-cog-pause text-x10"></i>`,
    iconX100: `<i class="mdi mdi-cog-pause text-x100"></i>`,
    iconX1000: `<i class="mdi mdi-cog-pause text-x1000"></i>`,
    clickAmountMultiplier: 1.2,
    clicksPerTickInitial: 10,
    clicksPerTickCurrent: 10,
    isHidden: true,
    shopItemElem: document.getElementById("trappers-item")
  },
  {
    name: "slime-hound",
    type: "auto",
    costInitial: 750,
    costCurrent: 750,
    costMultiplier: 1.2,
    quantity: 0,
    icon: `<i class="mdi mdi-dog-side text-theme-accent"></i>`,
    iconX10: `<i class="mdi mdi-dog-side text-x10"></i>`,
    iconX100: `<i class="mdi mdi-dog-side text-x100"></i>`,
    iconX1000: `<i class="mdi mdi-dog-side text-x1000"></i>`,
    clickAmountMultiplier: 1.2,
    clicksPerTickInitial: 50,
    clicksPerTickCurrent: 50,
    isHidden: true,
    shopItemElem: document.getElementById("slime-hound-item")
  }
]

let badges = [
  {
    symbol: "👿",
    description: "You captured more than 100,000 slimes",
    shortDesc: "100,000 slimes",
    amount: 100000
  },
  {
    symbol: "💀",
    description: "You captured more than 1,000,000 slimes",
    shortDesc: "1,000,000 slimes",
    amount: 1000000
  },
  {
    symbol: "☠️",
    description: "You captured more than 10,000,000 slimes",
    shortDesc: "10,000,000 slimes",
    amount: 10000000
  },
  {
    symbol: "👻",
    description: "You captured more than 100,000,000 slimes",
    shortDesc: "100,000,000 slimes",
    amount: 100000000
  }
]

function hunt() {
  calculateManualClickIncrement()
  slimeSinceLastTick += clickIncrement
  slime += clickIncrement
  manualSlimeCollected += clickIncrement
  update()
}

function calculateManualClickIncrement() {
  let clickUpgrades = []
  let newIncrement = 0

  upgrades.forEach(upgrade => {
    if (upgrade.type === "click") {
      clickUpgrades.push(upgrade)
    }
  })

  clickUpgrades.forEach(upgrade => {
    if (upgrade.quantity > 0) {
      clickIncrement = Math.round(upgrade.clicksPerTickCurrent * upgrade.clickAmountMultiplier)
    }
  })
}

function collectAutoUpgrades() {
  let autoUpgrades = []
  let autoSlimeGained = 0

  upgrades.forEach(upgrade => {
    if (upgrade.type === "auto") {
      autoUpgrades.push(upgrade)
    }
  })

  autoUpgrades.forEach(upgrade => {
    if (upgrade.quantity > 0) {
      autoSlimeGained += Math.round(upgrade.clicksPerTickCurrent * upgrade.quantity)
      slimeSinceLastTick = autoSlimeGained
    }
  })
  slime += autoSlimeGained
  autoSlimeCollected += autoSlimeGained
  console.log(`Slime gain this tick (${updateCounter}): `, slimeSinceLastTick)
  slimeSinceLastTick = 0
  update()
}

function calculateSlimePerSecond() {
  let slimePerSecond = 0
  let autoUpgrades = []

  upgrades.forEach(upgrade => {
    if (upgrade.type === "auto") {
      autoUpgrades.push(upgrade)
    }
  })

  autoUpgrades.forEach(upgrade => {
    if (upgrade.quantity > 0) {
      slimePerSecond += Math.round((upgrade.clicksPerTickCurrent * upgrade.quantity) / (tickInMilliSeconds / 1000))
    }
  })


  return slimePerSecond
}

function buyUpgrade(item) {
  let upgrade = upgrades.find(upgrade => upgrade.name === item)
  // @ts-ignore
  if (slime >= upgrade.costCurrent) {
    // @ts-ignore
    slime -= upgrade.costCurrent
    // @ts-ignore
    upgrade.costCurrent = Math.round(upgrade.costCurrent * upgrade.costMultiplier)
    // @ts-ignore
    upgrade.quantity++
    // @ts-ignore
    if (upgrade.quantity > 1) {
      // @ts-ignore
      upgrade.clicksPerTickCurrent += Math.round(upgrade.clicksPerTickCurrent * upgrade.clickAmountMultiplier)
    }
    // @ts-ignore

    update()
  }
}

function getIcons(item) {
  let upgrade = upgrades.find(upgrade => upgrade.name === item)
  let templateX1000 = ""
  let templateX100 = ""
  let templateX10 = ""
  let templateX1 = ""
  let template = ""

  // @ts-ignore
  let tempQuantity = upgrade.quantity

  while (tempQuantity >= 1000) {
    templateX1000 += upgrade.iconX1000
    templateX100 = ""
    templateX10 = ""
    templateX1 = ""
    tempQuantity -= 1000
  }
  while (tempQuantity >= 100) {
    templateX100 += upgrade.iconX100
    templateX10 = ""
    templateX1 = ""
    tempQuantity -= 100
  }
  while (tempQuantity >= 10) {
    templateX10 += upgrade.iconX10
    templateX1 = ""
    tempQuantity -= 10
  }
  while (tempQuantity > 0) {
    templateX1 += upgrade.icon
    tempQuantity--
  }

  template = templateX1000 + templateX100 + templateX10 + templateX1
  return template
}

function hideUnhideUpgrades() {
  let isItemUnhidden = false
  upgrades.forEach(upgrade => {
    if (slime >= upgrade.costCurrent && upgrade.isHidden) {

      // @ts-ignore
      upgrade.shopItemElem.classList.remove("hidden")
      
      upgrade.isHidden = false
      isItemUnhidden = true
    }
  })

  if (isItemUnhidden) {
    // @ts-ignore
    shopElem.classList.remove("hidden")
  }
}

function addBadges() {
  let template = ""
  badges.forEach(badge => {
    if (totalSlimeCollected >= badge.amount) {
      // @ts-ignore
       template += `<div class="d-flex gap-2"><p>${badge.symbol}</p><p>${badge.shortDesc}</p></div>`
    }
  })

  badgesElem.innerHTML = template
}

function update() {
  // @ts-ignore
  slimesCollectedElem.innerText = slime

  // @ts-ignore
  clickAugmentsIconElem.innerHTML = getIcons("click-augment")

  // @ts-ignore
  clickersIconElem.innerHTML = getIcons("clicker")

  // @ts-ignore
  trappersIconElem.innerHTML = getIcons("trappers")

  // @ts-ignore
  slimeHoundsIconElem.innerHTML = getIcons("slime-hound")

  // @ts-ignore
  clickAugmentUpgradeElem.innerText = upgrades.find(upgrade => upgrade.name === "click-augment").costCurrent

  // @ts-ignore
  clickAugmentQuantityElem.innerText = upgrades.find(upgrade => upgrade.name === "click-augment").quantity

  // @ts-ignore
  clickerUpgradeElem.innerText = upgrades.find(upgrade => upgrade.name === "clicker").costCurrent

  // @ts-ignore
  clickerQuantityElem.innerText = upgrades.find(upgrade => upgrade.name === "clicker").quantity

  // @ts-ignore
  trappersUpgradeElem.innerText = upgrades.find(upgrade => upgrade.name === "trappers").costCurrent

  // @ts-ignore
  trappersQuantityElem.innerText = upgrades.find(upgrade => upgrade.name === "trappers").quantity

  // @ts-ignore
  slimeHoundUpgradeElem.innerText = upgrades.find(upgrade => upgrade.name === "slime-hound").costCurrent

  // @ts-ignore
  slimeHoundQuantityElem.innerText = upgrades.find(upgrade => upgrade.name === "slime-hound").quantity

  calculateManualClickIncrement()
  // @ts-ignore
  slimePerClickElem.innerText = clickIncrement

  // @ts-ignore
  slimePerSecondElem.innerText = calculateSlimePerSecond()

  totalSlimeCollected = manualSlimeCollected + autoSlimeCollected

  // @ts-ignore
  totalSlimeElem.innerText = totalSlimeCollected

  // @ts-ignore
  manualSlimeElem.innerText = manualSlimeCollected

  // @ts-ignore
  autoSlimeElem.innerText = autoSlimeCollected


  addBadges()
  hideUnhideUpgrades()
  // console.log("Update: ", updateCounter)
  updateCounter++


  // saveToLocal()
}

function saveToLocal() {
  window.localStorage.setItem("slime", JSON.stringify(slime))
  window.localStorage.setItem("upgrades", JSON.stringify(upgrades))
}

function loadFromLocal() {
  // @ts-ignore
  let slimeData = JSON.parse(window.localStorage.getItem("slime"))
  if (slimeData) {
    slime = slimeData
  }

  // @ts-ignore
  let upgradesData = JSON.parse(window.localStorage.getItem("upgrades"))
  if (upgradesData) {
    upgrades = upgradesData
  }
}

// loadFromLocal()
update()
setInterval(collectAutoUpgrades, tickInMilliSeconds)