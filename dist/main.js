(() => {
  // config/log.js
  var SCRITTIES_LOG = {
    observe: false,
    catpower: {
      hunt: false,
      parchment: false
    },
    faith: {
      praise: true,
      upgrade: true
    },
    culture: true,
    gold: {
      promoteLeader: true,
      trade: true,
      build: true
    },
    minerals: true,
    crafting: {
      capPrevention: false,
      upgrade: false
    },
    farm: false,
    build: true,
    sacrifice: true,
    cloudSave: true,
    CATH_BUILD_LastGroupReached: "",
    SPACE_BUILD_LastGroupReached: "",
    UPGRADE_status: []
  };

  // config/settings.js
  var SCRITTIES_SETTINGS = {
    observe: true,
    catpower: {
      hunt: true,
      parchment: true
    },
    faith: {
      praise: true,
      upgrade: true
    },
    culture: true,
    gold: {
      promoteLeader: true,
      trade: true,
      build: true
    },
    minerals: true,
    crafting: {
      capPrevention: true,
      upgrade: true
    },
    farm: false,
    build: true,
    sacrifice: true,
    cloudSave: true,
    kittenLimit: 500
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

  // scripts/utility/utility.js
  var logicalBtnClick = (logicalBtn) => {
    logicalBtn.animate();
    logicalBtn.controller.buyItem(logicalBtn.model, 1, function(result) {
      if (result) {
        logicalBtn.update();
      }
    });
  };

  // scripts/actions/build.js
  var build = (bld) => {
    let result = {
      unlocked: false,
      impossible: true,
      available: false,
      built: false
    };
    if (!bld || !bld.model.metadata.unlocked)
      return result;
    result.unlocked = true;
    result.impossible = bld.model.resourceIsLimited;
    result.available = bld.model.enabled;
    if (result.impossible || !result.available)
      return result;
    logicalBtnClick(bld);
    result.built = true;
    return result;
  };
  var builder = (tab, buildHierarchy, logVarName) => {
    let hierarchyIter = 0;
    SCRITTIES_LOG[logVarName] = "0";
    if (!tab.visible)
      return;
    tab.update();
    for (let goalGroup of buildHierarchy) {
      hierarchyIter += 1;
      SCRITTIES_LOG[logVarName] = `${hierarchyIter}: `;
      let grpImpossible = true;
      for (let goal of goalGroup) {
        if (!goal.conditions.every((cond) => cond()))
          continue;
        if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
          let buildRes = build(goal.bldObj);
          if (!buildRes.unlocked)
            continue;
          grpImpossible = grpImpossible && buildRes.impossible;
          if (!buildRes.available && !buildRes.impossible) {
            SCRITTIES_LOG[logVarName] += goal.bldObj.model.metadata.label + ", ";
          }
          if (buildRes.built)
            goal.after.forEach((afterFn) => {
              afterFn();
            });
          if (SCRITTIES_LOG.build && buildRes.built)
            console.log(`Building a ${goal.bldObj.model.metadata.label}`);
        }
      }
      if (!grpImpossible) {
        break;
      }
    }
  };

  // scripts/actions/cloud-save.js
  var secondsBetweenSaves = 10 * 60;

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
      ratio: 0.3,
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
      ratio: game.resPool.get("ship").value < 250 ? 1 : 0.5,
      limit: game.resPool.get("ship").value < 250 ? 250 : -1,
      needs: [
        { resource: "starchart", cost: 25, limited: true },
        { resource: "plate", cost: 150, limited: true },
        { resource: "scaffold", cost: 100, limited: true }
      ]
    },
    {
      result: "tanker",
      ratio: 0.4,
      limit: game.resPool.get("ship").value < 250 ? 250 : -1,
      needs: [
        { resource: "alloy", cost: 1250, limited: true },
        { resource: "ship", cost: 200, limited: true },
        { resource: "blueprint", cost: 5, limited: true }
      ]
    },
    {
      result: "megalith",
      ratio: 0.1,
      limit: -1,
      needs: [
        { resource: "beam", cost: 25, limited: true },
        { resource: "slab", cost: 50, limited: true },
        { resource: "plate", cost: 5, limited: true }
      ]
    }
  ];

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
    },
    {
      source: "oil",
      result: "kerosene",
      cost: 7500,
      otherResources: []
    },
    {
      source: "uranium",
      result: "thorium",
      cost: 250,
      otherResources: []
    },
    {
      source: "unobtainium",
      result: "eludium",
      cost: 1e3,
      otherResources: [
        { resource: "alloy", cost: 2500 }
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

  // scripts/actions/trade.js
  var trade = (raceName, msBetweenExecutions) => {
    if (game.diplomacy.get(raceName).unlocked) {
      let goldRes = game.resPool.resourceMap.gold;
      let race = game.diplomacy.get(raceName);
      let trades = 1;
      trades = Math.max(trades, Math.floor(goldRes.perTickCached * msBetweenExecutions / 200 / (15 - game.getEffect("tradeGoldDiscount"))));
      trades = Math.min(trades, game.diplomacy.getMaxTradeAmt(race));
      if (trades > 0) {
        if (SCRITTIES_LOG.gold.trade)
          console.log(`Trading with ${raceName}`);
        game.diplomacy.tradeMultiple(game.diplomacy.get(raceName), trades);
        return;
      }
    }
  };

  // scripts/use-resources/gold.js
  var gold = (msBetweenExecutions) => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked)
      return;
    if (goldRes.value < goldRes.maxValue)
      return;
    if (game.science.get("civil").researched) {
      let leader = game.village.sim.kittens.find((kitten) => kitten.isLeader);
      if (game.village.sim.expToPromote(leader.rank, leader.rank + 1, leader.exp)[0] && game.village.sim.goldToPromote(leader.rank, leader.rank + 1, goldRes.value)[0]) {
        if (SCRITTIES_LOG.gold.promoteLeader)
          console.log("Promoting kitten leader");
        game.village.sim.promote(leader, leader.rank + 1);
        return;
      }
    }
    if (game.resPool.resourceMap.steel.value <= game.resPool.resourceMap.alloy.value) {
      trade("griffins", msBetweenExecutions);
    } else {
      trade("zebras", msBetweenExecutions);
    }
  };

  // scripts/use-resources/faith.js
  var faith = () => {
    let faithRes = game.resPool.resourceMap.faith;
    if (!faithRes.unlocked)
      return;
    if (game.religion.getRU("transcendence").on >= 1) {
      if (!game.religionTab.zgUpgradeButtons || game.religionTab.zgUpgradeButtons.length === 0)
        $(`a.Religion`)[0].click();
      let res = game.resPool.resourceMap;
      let titaniumIsNotConstrained = res.titanium.value / res.titanium.maxValue > 0.95 || res.steel.value <= res.alloy.value;
      let religionUpgradeList = [
        {
          name: "solarchant",
          conditions: []
        },
        {
          name: "scholasticism",
          conditions: []
        },
        {
          name: "goldenSpire",
          conditions: []
        },
        {
          name: "basilica",
          conditions: [titaniumIsNotConstrained]
        },
        {
          name: "templars",
          conditions: [titaniumIsNotConstrained]
        },
        {
          name: "sunAltar",
          conditions: [titaniumIsNotConstrained]
        },
        {
          name: "stainedGlass",
          conditions: [titaniumIsNotConstrained]
        }
      ];
      for (let religionUpgrade of religionUpgradeList) {
        let RU = game.religionTab.rUpgradeButtons.find((node) => node.id === religionUpgrade.name);
        if (!RU)
          continue;
        if (!religionUpgrade.conditions.every((cond) => cond))
          continue;
        let impossible = RU.model.resourceIsLimited;
        let available = RU.model.enabled;
        let btn = RU.buttonContent;
        if (!impossible) {
          if (available) {
            if (SCRITTIES_LOG.faith.upgrade)
              console.log(`Building a ${religionUpgrade.name} from faith`);
            btn.click();
          }
          return;
        }
      }
    }
    if (faithRes.value < faithRes.maxValue)
      return;
    if (SCRITTIES_LOG.faith.praise)
      console.log("Praise the sun!");
    game.religion.praise();
  };

  // scripts/actions/sacrifice.js
  var unicornBldQueue = [];
  var sacrifice = () => {
    let ziggBld = game.bld.get("ziggurat");
    if (!ziggBld.on)
      return;
    if (!game.religionTab.zgUpgradeButtons || game.religionTab.zgUpgradeButtons.length === 0)
      $(`a.Religion`)[0].click();
    if (unicornBldQueue.length === 0)
      return;
    let ziggUpgrade = game.religionTab.zgUpgradeButtons[unicornBldQueue[0]];
    if (!ziggUpgrade.model.metadata.unlocked)
      return;
    if (!ziggUpgrade.model.prices.filter((price) => price.name !== "tears").every((price) => game.resPool.get(price.name).value >= price.val))
      return;
    let tearsRequired = ziggUpgrade.model.prices.find((price) => price.name === "tears").val - game.resPool.resourceMap.tears.value;
    let sacrificesRequired = Math.ceil(tearsRequired / ziggBld.val);
    if (sacrificesRequired > 0) {
      let unicornsRequired = 2500 * sacrificesRequired;
      if (game.resPool.resourceMap.unicorns.value < unicornsRequired)
        return;
      if (SCRITTIES_LOG.sacrifice)
        console.log(`Sacrificing ${unicornsRequired} unicorns for ${sacrificesRequired * ziggBld.val} tears`);
      game.religionTab.sacrificeBtn.controller._transform(game.religionTab.sacrificeBtn.model, sacrificesRequired);
      game.religionTab.update();
      ziggUpgrade = game.religionTab.zgUpgradeButtons[unicornBldQueue[0]];
    }
    unicornBldQueue.shift();
    if (SCRITTIES_LOG.sacrifice)
      console.log(`Building a ${ziggUpgrade.opts.name}`);
    logicalBtnClick(ziggUpgrade);
  };

  // scripts/utility/conditions.js
  function resourceCondition(resource, condType, value) {
    let currVal = game.resPool.get(resource).value;
    let maxVal = game.resPool.get(resource).maxValue;
    switch (condType) {
      case "fixed":
        return currVal >= value;
      case "fraction":
        return currVal / maxVal >= value;
    }
  }
  function priceCondition(bld, resource, multiplier) {
    if (resource !== "all") {
      return () => {
        let price = game.bld.getPrices(bld).find((price2) => price2.name === resource).val * multiplier;
        return resourceCondition(resource, "fixed", price);
      };
    } else {
      return () => {
        return game.bld.getPrices(bld).every((price) => {
          return resourceCondition(price.name, "fixed", price.val * multiplier);
        });
      };
    }
  }
  function researchCondition(discipline, name, negate = false) {
    return () => Boolean(discipline.get(name).researched ^ negate);
  }

  // ref/cath-buildings.js
  var getBldObj = (buildingName, limit, conditions = [], after = []) => {
    return {
      name: buildingName,
      get bldObj() {
        return game.bldTab.children.find((bld) => bld.opts.building === buildingName);
      },
      limit,
      conditions,
      after
    };
  };
  var field = getBldObj("field", -1);
  var pasture = getBldObj("pasture", -1);
  var solarFarm = getBldObj("pasture", -1);
  var aqueduct = getBldObj("aqueduct", -1);
  var hydroPlant = getBldObj("aqueduct", -1);
  solarFarm.conditions.push(() => game.bld.get("pasture").stage === 1);
  solarFarm.conditions.push(resourceCondition.bind(null, "titanium", "fraction", 1));
  aqueduct.conditions.push(researchCondition(game.science, "robotics", true));
  aqueduct.conditions.push(resourceCondition.bind(null, "minerals", "fraction", 1));
  hydroPlant.conditions.push(() => game.bld.get("aqueduct").stage === 1);
  hydroPlant.conditions.push(resourceCondition.bind(null, "titanium", "fraction", 1));
  var hut = getBldObj("hut", -1);
  var logHouse = getBldObj("logHouse", -1);
  var mansion = getBldObj("mansion", -1);
  hut.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
  logHouse.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
  mansion.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
  mansion.conditions.push(resourceCondition.bind(null, "titanium", "fraction", 1));
  var library = getBldObj("library", -1);
  var dataCenter = getBldObj("library", -1);
  var academy = getBldObj("academy", -1);
  var observatory = getBldObj("observatory", -1);
  var biolab = getBldObj("biolab", -1);
  library.conditions.push(researchCondition(game.science, "robotics", true));
  dataCenter.conditions.push(() => game.bld.get("library").stage === 1);
  dataCenter.conditions.push(researchCondition(game.workshop, "cryocomputing"));
  dataCenter.conditions.push(() => game.resPool.energyWinterProd - game.resPool.energyCons >= 2);
  dataCenter.conditions.push(priceCondition("library", "all", 10));
  academy.conditions.push(resourceCondition.bind(null, "science", "fraction", 1));
  observatory.conditions.push(resourceCondition.bind(null, "science", "fraction", 1));
  observatory.conditions.push(resourceCondition.bind(null, "iron", "fraction", 1));
  biolab.conditions.push(priceCondition("biolab", "alloy", 100));
  biolab.conditions.push(priceCondition("biolab", "alloy", 100));
  var barn = getBldObj("barn", -1);
  var warehouse = getBldObj("warehouse", -1);
  var harbor = getBldObj("harbor", -1);
  warehouse.conditions.push(priceCondition("warehouse", "all", 2));
  harbor.conditions.push(priceCondition("harbor", "all", 2));
  harbor.conditions.push(resourceCondition.bind(null, "ship", "fixed", 250));
  var mine = getBldObj("mine", -1);
  var quarry = getBldObj("quarry", -1);
  var lumberMill = getBldObj("lumberMill", -1);
  var oilWell = getBldObj("oilWell", -1);
  var accelerator = getBldObj("accelerator", -1);
  lumberMill.conditions.push(resourceCondition.bind(null, "iron", "fraction", 1));
  quarry.conditions.push(resourceCondition.bind(null, "ship", "fixed", 250));
  quarry.conditions.push(priceCondition("quarry", "all", 3));
  oilWell.conditions.push(resourceCondition.bind(null, "ship", "fixed", 250));
  oilWell.conditions.push(priceCondition("oilWell", "all", 3));
  accelerator.conditions.push(resourceCondition.bind(null, "titanium", "fraction", 1));
  accelerator.after.push(() => {
    if (game.bld.get("accelerator").val === 1) {
      game.bld.get("accelerator").on = 0;
    } else if (game.bld.get("accelerator").on > 0) {
      game.bld.get("accelerator").on -= 1;
    }
  });
  var steamworks = getBldObj("steamworks", -1);
  var magneto = getBldObj("magneto", -1);
  var smelter = getBldObj("smelter", -1);
  var calciner = getBldObj("calciner", -1);
  var factory = getBldObj("factory", -1);
  var reactor = getBldObj("reactor", -1);
  steamworks.conditions.push(resourceCondition.bind(null, "blueprint", "fixed", 1e3));
  steamworks.conditions.push(researchCondition(game.science, "electricity"));
  steamworks.conditions.push(() => game.bld.get("magneto").val > game.bld.get("steamworks").val + 7);
  magneto.conditions.push(resourceCondition.bind(null, "blueprint", "fixed", 1e3));
  magneto.conditions.push(() => game.resPool.resourceMap.oil.perTickCached > 0.05);
  magneto.conditions.push(priceCondition("magneto", "alloy", 3));
  factory.conditions.push(researchCondition(game.workshop, "carbonSequestration"));
  factory.conditions.push(() => game.resPool.energyWinterProd - game.resPool.energyCons >= 4);
  factory.conditions.push(() => game.bld.get("factory").on === game.bld.get("factory").val);
  factory.conditions.push(priceCondition("factory", "plate", 2));
  var amphitheatre = getBldObj("amphitheatre", -1);
  var broadcastTower = getBldObj("amphitheatre", -1);
  var chapel = getBldObj("chapel", -1);
  var temple = getBldObj("temple", -1);
  amphitheatre.conditions.push(researchCondition(game.science, "electronics", true));
  broadcastTower.conditions.push(() => game.bld.get("amphitheatre").stage === 1);
  chapel.conditions.push(resourceCondition.bind(null, "ship", "fixed", 250));
  chapel.conditions.push(priceCondition("chapel", "parchment", 10));
  temple.conditions.push(resourceCondition.bind(null, "gold", "fraction", 1));
  temple.conditions.push(priceCondition("temple", "manuscript", 2));
  temple.conditions.push(priceCondition("temple", "plate", 3));
  var workshop = getBldObj("workshop", -1);
  var tradepost = getBldObj("tradepost", -1);
  tradepost.conditions.push(resourceCondition.bind(null, "gold", "fraction", 1));
  var mint = getBldObj("mint", -1);
  var unicornPasture = getBldObj("unicornPasture", -1);
  var brewery = getBldObj("brewery", -1);
  var ziggurat = getBldObj("ziggurat", -1);
  mint.conditions.push(resourceCondition.bind(null, "gold", "fraction", 1));
  mint.conditions.push(priceCondition("mint", "plate", 3));
  mint.after.push(() => {
    game.bld.get("mint").on = 0;
  });

  // ref/cath-build-hierarchy.js
  var cathBuildHierarchy = [
    [
      workshop,
      lumberMill,
      mine,
      smelter,
      aqueduct,
      tradepost,
      mint,
      solarFarm,
      hydroPlant
    ],
    [
      hut,
      logHouse,
      mansion
    ],
    [
      library,
      academy,
      observatory,
      amphitheatre,
      broadcastTower,
      dataCenter
    ],
    [
      accelerator,
      temple,
      chapel
    ],
    [
      factory,
      barn,
      warehouse,
      harbor,
      oilWell,
      quarry,
      biolab
    ]
  ];

  // ref/space-buildings.js
  var getSpaceBldObj = (planetName, buildingName, limit, conditions = [], after = []) => {
    return {
      name: buildingName,
      get bldObj() {
        if (!game.spaceTab.planetPanels)
          return null;
        let planet = game.spaceTab.planetPanels.find((pp) => pp.name === planetName);
        if (!planet)
          return planet;
        return planet.children.find((up) => up.id === buildingName);
      },
      limit,
      conditions,
      after
    };
  };
  var spaceElevator = getSpaceBldObj("Cath", "spaceElevator", -1);
  var sattelite = getSpaceBldObj("Cath", "sattelite", -1);
  sattelite.conditions.push(researchCondition(game.workshop, "solarSatellites"));
  var planetCracker = getSpaceBldObj("Dune", "planetCracker", -1);
  var hydrofracturer = getSpaceBldObj("Dune", "hydrofracturer", -1);
  var researchVessel = getSpaceBldObj("Piscine", "researchVessel", -1);

  // ref/space-build-hierarchy.js
  var spaceBuildHierarchy = [
    [
      spaceElevator
    ],
    [
      sattelite
    ],
    [
      planetCracker,
      hydrofracturer
    ],
    [
      researchVessel
    ]
  ];

  // scritties.js
  var huntInterval = setInterval(hunt, 5e3);
  var faithInterval = setInterval(faith, 5e3);
  var sacrificeInterval = setInterval(sacrifice, 30 * 1e3);
  var observeInterval = null;
  if (!game.workshop.get("seti").researched) {
    observeInterval = setInterval(observe, 2e3);
  }
  var cultureInterval = setInterval(culture, 5e3);
  if (game.spaceTab.visible) {
    if (!game.spaceTab.planetPanels || game.spaceTab.planetPanels.length === 0)
      $(`a.Space`)[0].click();
  }
  var useResourcesInterval = setInterval(() => {
    builder(game.bldTab, cathBuildHierarchy, "CATH_BUILD_LastGroupReached");
    builder(game.spaceTab, spaceBuildHierarchy, "SPACE_BUILD_LastGroupReached");
    useUpResources();
    gold(1 * 1e3);
  }, 1 * 1e3);
  var upgradeInterval = setInterval(upgrade, 2 * 1e3);
})();
