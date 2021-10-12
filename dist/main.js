(() => {
  // config/log.js
  var SCRITTIES_LOG = {
    observe: true,
    catpower: {
      hunt: false,
      parchment: false
    },
    faith: true,
    culture: true,
    gold: {
      promoteLeader: true,
      tradeZebras: true
    },
    crafting: {
      capPrevention: false,
      upgrade: false
    },
    farm: false,
    build: true,
    cloudSave: true,
    BUILD_LastGroupReached: "",
    UPGRADE_status: []
  };

  // config/settings.js
  var SCRITTIES_SETTINGS = {
    observe: true,
    catpower: {
      hunt: true,
      parchment: true
    },
    faith: true,
    culture: true,
    gold: {
      promoteLeader: true,
      tradeZebras: true
    },
    crafting: {
      capPrevention: true,
      upgrade: true
    },
    farm: false,
    build: true,
    cloudSave: true,
    kittenLimit: 170
  };

  // scripts/actions/hunt.js
  var hunt = () => {
    if (!SCRITTIES_SETTINGS.catpower.hunt)
      return;
    let manpowerRes = game.resPool.resourceMap.manpower;
    if (!manpowerRes.unlocked)
      return;
    if (manpowerRes.value >= manpowerRes.maxValue) {
      if (SCRITTIES_LOG.catpower.hunt)
        console.log("Going hunting");
      game.village.huntAll();
      if (!SCRITTIES_SETTINGS.catpower.parchment)
        return;
      if (gamePage.workshop.getCraft("parchment").unlocked) {
        let ticks_needed_to_fill_MP = manpowerRes.maxValue / manpowerRes.perTickCached;
        let fur_used_while_filling_MP = game.resPool.resourceMap.furs.perTickCached * ticks_needed_to_fill_MP;
        let fur_available_for_parchments = game.resPool.resourceMap.furs.value + fur_used_while_filling_MP;
        let parchs_to_craft = Math.trunc(fur_available_for_parchments / 175);
        if (SCRITTIES_LOG.catpower.parchment)
          console.log(`Converting ${parchs_to_craft * 175} furs to ${parchs_to_craft} parchments`);
        game.craft("parchment", parchs_to_craft);
      }
    }
  };

  // scripts/actions/observe.js
  var observe = () => {
    let observeBtnQ = $("#observeBtn");
    if (observeBtnQ.length > 0) {
      if (SCRITTIES_LOG.observe)
        console.log("Observing the sky!");
      observeBtnQ[0].click();
    }
  };

  // scripts/actions/praise.js
  var praise = () => {
    let faithRes = game.resPool.resourceMap.faith;
    if (!faithRes.unlocked)
      return;
    if (faithRes.value >= faithRes.maxValue) {
      if (SCRITTIES_LOG.faith)
        console.log("Praise the sun!");
      game.religion.praise();
    }
  };

  // ref/buildings.js
  var aqueduct = { name: "aqueduct", label: "Aqueduct" };
  var library = { name: "library", label: "Library" };
  var academy = { name: "academy", label: "Academy" };
  var barn = { name: "barn", label: "Barn" };
  var warehouse = { name: "warehouse", label: "Warehouse" };
  var harbor = { name: "harbor", label: "Harbour" };
  var mine = { name: "mine", label: "Mine" };
  var quarry = { name: "quarry", label: "Quarry" };
  var lumberMill = { name: "lumberMill", label: "Lumber Mill" };
  var smelter = { name: "smelter", label: "Smelter" };
  var amphitheatre = { name: "amphitheatre", label: "Amphitheatre" };
  var workshop = { name: "workshop", label: "Workshop" };
  var tradepost = { name: "tradepost", label: "Tradepost" };
  var unicornPasture = { name: "unicornPasture", label: "Unic. Pasture" };
  var hut = { name: "hut", label: "Hut" };
  var logHouse = { name: "logHouse", label: "Log House" };

  // ref/build-hierarchy.js
  var bldGoals = [
    [
      { ...workshop, limit: -1 },
      { ...lumberMill, limit: -1 },
      { ...mine, limit: -1 },
      { ...quarry, limit: 10 },
      { ...smelter, limit: -1 }
    ],
    [
      { ...hut, limit: -1 },
      { ...logHouse, limit: -1 }
    ],
    [
      { ...tradepost, limit: -1 },
      { ...academy, limit: -1 },
      { ...library, limit: -1 },
      { ...amphitheatre, limit: -1 }
    ],
    [
      { ...aqueduct, limit: -1 }
    ],
    [
      { ...barn, limit: -1 },
      { ...warehouse, limit: -1 },
      { ...harbor, limit: -1 }
    ],
    [
      { ...unicornPasture, limit: -1 }
    ]
  ];

  // scripts/actions/build.js
  var kittenLimiter = () => {
    if (game.village.maxKittens >= SCRITTIES_SETTINGS.kittenLimit) {
      console.log("No more kittens!");
      bldGoals.splice(1, 1);
      clearInterval(kittenLimiter);
    }
  };
  var builder = () => {
    game.bldTab.update();
    for (let goal_group of bldGoals) {
      SCRITTIES_LOG.BUILD_LastGroupReached = "";
      let impossible = true;
      for (let goal of goal_group) {
        if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
          let bld = game.bldTab.children.find((node) => node.opts.building === goal.name);
          if (!bld)
            continue;
          if (impossible)
            impossible = bld.model.resourceIsLimited;
          let available = bld.model.enabled;
          let btn = bld.buttonContent;
          if (!available && !bld.model.resourceIsLimited) {
            SCRITTIES_LOG.BUILD_LastGroupReached += goal.label + ", ";
          }
          if (impossible || !available)
            continue;
          if (SCRITTIES_LOG.build)
            console.log(`Building a ${goal.label}`);
          btn.click();
        }
      }
      if (!impossible) {
        break;
      }
    }
  };

  // scripts/actions/cloud-save.js
  var secondsBetweenSaves = 20 * 60;

  // ref/upgrade-mapping.js
  var constructionAutoUpgrades = [
    {
      result: "gear",
      ratio: 0.2,
      limit: -1,
      needs: [
        { resource: "steel", cost: 15, limited: true }
      ]
    },
    {
      result: "concrate",
      ratio: 0.2,
      limit: -1,
      needs: [
        { resource: "slab", cost: 2500, limited: true },
        { resource: "steel", cost: 25, limited: true }
      ]
    },
    {
      result: "scaffold",
      ratio: 0.5,
      limit: -1,
      needs: [
        { resource: "beam", cost: 50, limited: true }
      ]
    },
    {
      result: "manuscript",
      ratio: 0.5,
      limit: -1,
      needs: [
        { resource: "parchment", cost: game.science.getPolicy("tradition").researched ? 20 : 25, limited: true },
        { resource: "culture", cost: game.science.getPolicy("tradition").researched ? 300 : 400, limited: false }
      ]
    },
    {
      result: "compedium",
      ratio: 0.5,
      limit: -1,
      needs: [
        { resource: "manuscript", cost: 50, limited: true },
        { resource: "science", cost: 1e4, limited: false }
      ]
    },
    {
      result: "blueprint",
      ratio: 0.5,
      limit: -1,
      needs: [
        { resource: "compedium", cost: 25, limited: true },
        { resource: "science", cost: 25e3, limited: false }
      ]
    },
    {
      result: "ship",
      ratio: 1,
      limit: 250,
      needs: [
        { resource: "starchart", cost: 25, limited: true },
        { resource: "plate", cost: 150, limited: true },
        { resource: "scaffold", cost: 100, limited: true }
      ]
    },
    {
      result: "megalith",
      ratio: 0.2,
      limit: -1,
      needs: [
        { resource: "beam", cost: 25, limited: true },
        { resource: "slab", cost: 50, limited: true },
        { resource: "plate", cost: 5, limited: true }
      ]
    }
  ];
  if (game.resPool.get("ship").value >= 250) {
    let shipUpgradeIdx = constructionAutoUpgrades.findIndex((upgrade2) => upgrade2.result === "ship");
    if (shipUpgradeIdx > -1) {
      constructionAutoUpgrades[shipUpgradeIdx].ratio = 0.5;
      constructionAutoUpgrades[shipUpgradeIdx].limit = -1;
    }
  }

  // scripts/actions/upgrade.js
  var upgrade = () => {
    SCRITTIES_LOG.UPGRADE_status = [];
    for (let upgrade2 of constructionAutoUpgrades) {
      let needObjs = upgrade2.needs.map((source) => game.resPool.get(source.resource));
      let resObj = game.resPool.get(upgrade2.result);
      if (!resObj.unlocked || !needObjs.every((need) => need.unlocked))
        continue;
      if (upgrade2.limit > -1 && resObj.value > upgrade2.limit) {
        SCRITTIES_LOG.UPGRADE_status.push(`${upgrade2.result} limit reached (${upgrade2.limit})`);
        continue;
      }
      let notEnoughRes = needObjs.find((need, i) => need.value < upgrade2.needs[i].cost);
      if (notEnoughRes) {
        SCRITTIES_LOG.UPGRADE_status.push(`${upgrade2.result} failed (${notEnoughRes.name})`);
        continue;
      }
      let makeResult = true;
      for (let i = 0; i < upgrade2.needs.length && makeResult; i++) {
        if (!upgrade2.needs[i].limited)
          continue;
        let totalNeedValue = needObjs[i].value + resObj.value * upgrade2.needs[i].cost;
        let optimalResultCount = totalNeedValue * upgrade2.ratio / upgrade2.needs[i].cost;
        makeResult = resObj.value < Math.trunc(optimalResultCount);
        if (!makeResult)
          SCRITTIES_LOG.UPGRADE_status.push(`${upgrade2.result} failed (${upgrade2.needs[i].resource})`);
      }
      if (makeResult) {
        if (SCRITTIES_LOG.crafting.upgrade) {
          let log_text = `Converting ${upgrade2.needs.map((need) => `${need.cost} ${need.resource}`).join(", ")} to ${upgrade2.result}`;
          console.log(log_text);
        }
        game.craft(upgrade2.result, 1);
      }
    }
  };

  // scripts/use-resources/culture.js
  var culture = () => {
    let cultureRes = game.resPool.resourceMap.culture;
    if (!cultureRes.unlocked || !game.diplomacy.hasUnlockedRaces())
      return;
    if (cultureRes.value >= cultureRes.maxValue) {
      if (game.diplomacyTab.racePanels.length === 0) {
        $(`a.Trade`)[0].click();
      }
      for (let i = 0; i < game.diplomacyTab.racePanels.length; i++) {
        let racePanel = game.diplomacyTab.racePanels[i];
        racePanel.update();
        if (racePanel.embassyButton.model.enabled) {
          if (SCRITTIES_LOG.culture)
            console.log("Building embassy for " + racePanel.race.title);
          racePanel.embassyButton.buttonContent.click();
          return;
        }
      }
    }
  };

  // ref/res-to-res.js
  var resourceToResourceMapping = [
    {
      source: "catnip",
      result: "wood",
      cost: 50,
      otherResources: []
    },
    {
      source: "wood",
      result: "beam",
      cost: 175,
      otherResources: []
    },
    {
      source: "minerals",
      result: "slab",
      cost: 250,
      otherResources: []
    },
    {
      source: "iron",
      result: "plate",
      cost: 125,
      otherResources: []
    },
    {
      source: "coal",
      result: "steel",
      cost: 100,
      otherResources: [
        { resource: "iron", cost: 100 }
      ]
    },
    {
      source: "titanium",
      result: "alloy",
      cost: 10,
      otherResources: [
        { resource: "steel", cost: 75 }
      ]
    }
  ];

  // scripts/use-resources/general.js
  var useUpResources = () => {
    for (let res_to_res of resourceToResourceMapping) {
      let src_obj = game.resPool.get(res_to_res.source);
      if (!src_obj.unlocked || !game.resPool.get(res_to_res.result).unlocked)
        continue;
      if (src_obj.value >= src_obj.maxValue) {
        let craft_num = Math.max(1, Math.trunc(src_obj.maxValue * 0.05 / res_to_res.cost));
        let craft_num_by_other_resources = Infinity;
        for (let other_resource of res_to_res.otherResources) {
          craft_num_by_other_resources = Math.min(craft_num_by_other_resources, Math.trunc(game.resPool.get(other_resource.resource).value / other_resource.cost));
        }
        craft_num = Math.min(craft_num, craft_num_by_other_resources);
        if (craft_num === 0)
          continue;
        if (SCRITTIES_LOG.crafting.capPrevention) {
          let log_text = `Converting ${craft_num * res_to_res.cost} ${res_to_res.source}`;
          if (res_to_res.otherResources.length > 0) {
            log_text += " (+ ";
            log_text += res_to_res.otherResources.map((other_resource) => `${craft_num * other_resource.cost} ${other_resource.resource}`).join(", ");
            log_text += ")";
          }
          log_text += ` to ${craft_num} ${res_to_res.result}`;
          console.log(log_text);
        }
        game.craft(res_to_res.result, craft_num);
      }
    }
  };

  // scripts/use-resources/gold.js
  var gold = () => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked)
      return;
    if (goldRes.value >= goldRes.maxValue && game.science.get("civil").researched) {
      if (SCRITTIES_LOG.gold.promoteLeader)
        console.log("Promoting kitten leader");
      game.villageTab.censusPanel.census.promoteLeaderHref.click();
      goldRes = game.resPool.resourceMap.gold;
    }
    if (goldRes.value >= goldRes.maxValue && game.diplomacy.get("zebras").unlocked) {
      if (SCRITTIES_LOG.gold.tradeZebras)
        console.log("Trading with zebras instead");
      game.diplomacy.tradeAll(game.diplomacy.get("zebras"));
      goldRes = game.resPool.resourceMap.gold;
    }
  };

  // scritties.js
  var huntInterval = setInterval(hunt, 5e3);
  var praiseInterval = setInterval(praise, 5e3);
  var observeInterval = setInterval(observe, 2e3);
  var cultureInterval = setInterval(culture, 5e3);
  var goldInterval = setInterval(gold, 30 * 1e3);
  var useResourcesInterval = setInterval(() => {
    builder();
    useUpResources();
  }, 1 * 1e3);
  var kittenLimiterInterval = setInterval(kittenLimiter, 10 * 1e3);
  var upgradeInterval = setInterval(upgrade, 2 * 1e3);
})();
