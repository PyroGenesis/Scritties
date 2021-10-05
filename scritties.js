let LOG_AUTOMATION = false;

let LOG_HUNT  = true;
let hunt = setInterval(() => {
    let mp = game.resPool.resourceMap.manpower;
    if (mp.value >= mp.maxValue) {
        if (LOG_HUNT) console.log("Going hunting");
        game.village.huntAll();

        if (gamePage.workshop.getCraft('parchment').unlocked) {
            let ticks_needed_to_fill_MP = mp.maxValue / mp.perTickCached
            let fur_used_while_filling_MP = game.resPool.resourceMap.furs.perTickCached * ticks_needed_to_fill_MP // this is -ve
            let fur_available_for_parchments = game.resPool.resourceMap.furs.value + fur_used_while_filling_MP
            let parchs_to_craft = Math.trunc(fur_available_for_parchments / 175)

            if (LOG_HUNT) console.log(`Converting ${parchs_to_craft * 175} furs to ${parchs_to_craft} parchments`);
            game.craft('parchment', parchs_to_craft);
        }

    }
}, 5000);

let praiseTheSun = setInterval(() => {
    let faith = game.resPool.resourceMap.faith;
    if(faith.value >= faith.maxValue) {
        if (LOG_AUTOMATION) console.log("Praise the sun!");
        game.religion.praise();
    }
}, 5000);

let starClick = setInterval(() => {
    let observeBtnQ = $("#observeBtn")
    if (observeBtnQ.length > 0) {
        if (LOG_AUTOMATION) console.log("Observing the sky!");
        observeBtnQ[0].click();
    }
}, 2000);

let LOG_CULTURE_AUTOMATION = true;
let useUpCulture = setInterval(() => {
    let culture = game.resPool.resourceMap.culture;
    if(culture.value >= culture.maxValue) {
        if (game.diplomacyTab.racePanels.length === 0) {
            $(`a.Trade`)[0].click();
        }
        for (let i = 0; i < game.diplomacyTab.racePanels.length; i++) {
            let racePanel = game.diplomacyTab.racePanels[i];
            racePanel.update();
            if (racePanel.embassyButton.model.enabled) {
                if (LOG_CULTURE_AUTOMATION) console.log("Building embassy for " + racePanel.race.title);
                racePanel.embassyButton.buttonContent.click();
            }
        }
    }
}, 5*1000);

let resource_to_resource_mapping = [
    {
        source: 'catnip',
        result: 'wood',
        cost: 50,
        otherResources: []
    }, {
        source: 'wood',
        result: 'beam',
        cost: 175,
        otherResources: []
    }, {
        source: 'minerals',
        result: 'slab',
        cost: 250,
        otherResources: []
    }, {
        source: 'iron',
        result: 'plate',
        cost: 125,
        otherResources: []
    }, {
        source: 'coal',
        result: 'steel',
        cost: 100,
        otherResources: [
            { resource: 'iron', cost: 100 }
        ]
    // }, {
    //     source: 'culture',
    //     result: 'manuscript',
    //     cost: 400,
    //     otherResources: [
    //         { resource: 'parchment', cost: 25 }
    //     ]
    }
]

let useUpInResources = () => {
    for (let res_to_res of resource_to_resource_mapping) {
        let src_obj = game.resPool.get(res_to_res.source)
        if (!src_obj.unlocked || !game.resPool.get(res_to_res.result).unlocked) continue;

        // if (src_obj.value / src_obj.maxValue > 0.98) {
        if (src_obj.value >= src_obj.maxValue) {
            let craft_num = Math.max(1, Math.trunc((src_obj.maxValue * 0.05) / res_to_res.cost))
            let craft_num_by_other_resources = Infinity;
            for (let other_resource of res_to_res.otherResources) {
                craft_num_by_other_resources = Math.min(
                    craft_num_by_other_resources,
                    Math.trunc(game.resPool.get(other_resource.resource).value / other_resource.cost)
                );
            }
            craft_num = Math.min(craft_num, craft_num_by_other_resources);
            if (craft_num === 0) continue;

            if (LOG_AUTOMATION) {
                let log_text = `Converting ${craft_num * res_to_res.cost} ${res_to_res.source}`
                if (res_to_res.otherResources.length > 0) {
                    log_text += ' (+ ';
                    log_text += res_to_res.otherResources.map((other_resource) => `${craft_num * other_resource.cost} ${other_resource.resource}`).join(', ');
                    log_text += ')'
                }
                log_text += ` to ${craft_num} ${res_to_res.result}`
                console.log(log_text);
            }
            game.craft(res_to_res.result, craft_num);
        }
    }
}

// let useUpInBuildings = setInterval(() => {
//     let resource_to_building_mapping = [
//         {
//             source: 'gold',
//             result: 'Tradepost',
//             tab: 'Bonfire'   
//         }
//     ]

//     for (let res_to_bld of resource_to_building_mapping) {
//         let src_obj = game.resPool.get(res_to_bld.source)
//         if (src_obj.value / src_obj.maxValue > 0.95) {
//             $(`a.${res_to_bld.tab}`)[0].click() // Switching tabs
//             // TODO: Improve this log to include resources used
//             if (LOG_AUTOMATION) console.log(`Building ${res_to_bld.result} from excess ${res_to_bld.source}`);
//             $(`.btnContent:contains('${res_to_bld.result}')`)[0].click()
//         }
//     }
// }, 10*1000);

let LOG_GOLD = true;
let useUpGold = setInterval(() => {
    if(game.resPool.resourceMap.gold.value >= game.resPool.resourceMap.gold.maxValue) {
        if (LOG_GOLD) console.log("Promoting kitten leader");
        game.villageTab.censusPanel.census.promoteLeaderHref.click();
        if(game.resPool.resourceMap.gold.value >= game.resPool.resourceMap.gold.maxValue) {
            if (LOG_GOLD) console.log("Promoting all kittens instead");
            game.village.promoteKittens();
        }
    }
}, 30*1000);

// jQuery.expr[':'].icontains = function(a, i, m) {
//     return jQuery(a).text().toUpperCase()
//             .indexOf(m[3].toUpperCase()) >= 0;
// };

// TODO: get this list from better scripts
let pasture = { name: 'pasture', label: 'Pasture' }
let aqueduct = { name: 'aqueduct', label: 'Aqueduct' }
let library = { name: 'library', label: 'Library' }
let academy = { name: 'academy', label: 'Academy' }
let observatory = { name: 'observatory', label: 'Observatory' }
let barn = { name: 'barn', label: 'Barn' }
let warehouse = { name: 'warehouse', label: 'Warehouse' }
let harbor = { name: 'harbor', label: 'Harbour' }
let mine = { name: 'mine', label: 'Mine' }
let lumberMill = { name: 'lumberMill', label: 'Lumber Mill' }
let smelter = { name: 'smelter', label: 'Smelter'}
let amphitheatre = { name: 'amphitheatre', label: 'Amphitheatre' }
let temple = { name: 'temple', label: 'Temple' }
let workshop = { name: 'workshop', label: 'Workshop' }
let tradepost = { name: 'tradepost', label: 'Tradepost' }
let unicornPasture = { name: 'unicornPasture', label: 'Unic. Pasture' }
let ziggurat = { name: 'ziggurat', label: 'Ziggurat' }
let hut = { name: 'hut', label: 'Hut' }
let logHouse = { name: 'logHouse', label: 'Log House' }
let mansion = { name: 'mansion', label: 'Mansion' }

// { ...amphitheatre, limit: -1 },
// { ...academy, limit: -1 },
// { ...library, limit: -1 }

let bld_goals = [
    // [        
    //     { ...smelter, limit: -1 },
    // ],
    [        
        { ...workshop, limit: -1 },
        { ...hut, limit: -1 },
        { ...logHouse, limit: -1 }
    ],
    [
        { ...tradepost, limit: -1 },
        { ...mine, limit: -1 },
        { ...lumberMill, limit: -1 },
        { ...academy, limit: -1 },
        { ...library, limit: -1 },
    ],
    [
        { ...observatory, limit: -1 },
        { ...temple, limit: -1 },
        { ...amphitheatre, limit: -1 },
        { ...aqueduct, limit: -1 },
    ],
    [
        { ...barn, limit: -1 },
        { ...warehouse, limit: -1 },
        { ...harbor, limit: -1 },
    ],
    [
        { ...unicornPasture, limit: -1 },
    ]
]

let LOG_BLD_AUTOMATION = true;
let lastBldGrpReached = ""

let fulfillGoals = () => {    
    game.bldTab.update();
    for (let goal_group of bld_goals) {
        // console.log('gg', goal_group.map(g => g.label).join(', '));
        lastBldGrpReached = ""
        let impossible = true;
        for (let goal of goal_group) {
            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let bld = game.bldTab.children.find((node) => node.opts.building === goal.name);
                if (!bld) continue;

                if (impossible) impossible = bld.model.resourceIsLimited;
                let available = bld.model.enabled;
                let btn = bld.buttonContent;

                if (!impossible) {
                    lastBldGrpReached += goal.label + ", ";
                }
                if (impossible || !available) continue;

                if (LOG_BLD_AUTOMATION) console.log(`Building a ${goal.label}`);
                btn.click();
            }
        }
        if (!impossible) {
            // lastBldGrpReached = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
}

let bldAndRes = setInterval(() => {
    fulfillGoals();
    useUpInResources();
}, 30 * 1000);


let constructionAutoUpgrades = [
    {
        result: 'gear',
        ratio: 0.2,
        limit: -1,
        needs: [
            { resource: 'steel', cost: 15 }
        ]
    },
    {
        result: 'scaffold',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'beam', cost: 50 }
        ]
    },
    {
        result: 'manuscript',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'parchment', cost: 25 }
        ]
    },
    {
        result: 'compedium',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'manuscript', cost: 50 }
        ]
    },
    {
        result: 'blueprint',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'compedium', cost: 25 }
        ]
    },
    {
        result: 'ship',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'starchart', cost: 25 },
            { resource: 'plate', cost: 150 },
            { resource: 'scaffold', cost: 100 }
        ]
    },
    {
        result: 'megalith',
        ratio: 0.2,
        limit: -1,
        needs: [
            { resource: 'beam', cost: 25 },
            { resource: 'slab', cost: 50 },
            { resource: 'plate', cost: 5 }
        ]
    }
]

let LOG_UPGRADE_AUTOMATION = true;
let WATCH_UPGRADE = [];
let upgradeResources = setInterval(() => {
    WATCH_UPGRADE = [];
    for (let upgrade of constructionAutoUpgrades) {
        let needObjs = upgrade.needs.map(source => game.resPool.get(source.resource));
        let resObj = game.resPool.get(upgrade.result)

        // No cheating!
        if (!resObj.unlocked || !needObjs.every(need => need.unlocked)) continue;
        if (upgrade.limit > -1 && resObj.value > upgrade.limit) {
            WATCH_UPGRADE.push(`${upgrade.result} limit reached (${upgrade.limit})`)
            continue;
        }

        let makeResult = true;
        for (let i = 0; i < upgrade.needs.length && makeResult; i++) {
            let totalNeedValue = needObjs[i].value + resObj.value * upgrade.needs[i].cost
            let optimalResultCount = totalNeedValue * upgrade.ratio / upgrade.needs[i].cost
            makeResult = resObj.value < Math.trunc(optimalResultCount);
            makeResult = makeResult && needObjs[i].value >= upgrade.needs[i].cost

            if (!makeResult) WATCH_UPGRADE.push(`${upgrade.result} failed (${upgrade.needs[i].resource})`);
        }

        if (makeResult) {
            if (LOG_UPGRADE_AUTOMATION) {
                let log_text = `Converting ${upgrade.needs.map(need => `${need.cost} ${need.resource}`).join(', ')} to ${upgrade.result}`
                console.log(log_text);
            }
            game.craft(upgrade.result, 1);
        }
    }
}, 10*1000);


// time between two cloud saves (do NOT use a very small value)
let secondsBetweenSaves = 10 * 60;    // 10 minutes

// Syncs the save data with the server
// Similar to game.server.syncData(), except it also accepts a fn to execute after syncing
function syncSaveDataWithRespFunc(respFunc, ...args) {
    game.server._xhr("/kgnet/save/", "GET", {}, function(resp){
        game.server.saveData = resp;
        respFunc(...args);
    });
}

// The function performing the sync
function autoCloudSave(maxTimeDeltaSeconds) {
    // Get the unique ID of current active game
    let currentSaveGuid = game.telemetry.guid;
    // If the game has no unique ID, there is nothing I can do except quit
    if (!currentSaveGuid) return;

    // Get your save from the list of cloud saves
    let cloudSave = game.server.saveData.find((save) => save.guid === currentSaveGuid);
    // If there is no cloud save, this is the first save so save immediately
    if (!cloudSave) {
        game.server.pushSave();
        return;
    }

    // Calculate the unix timestamps of the cloud save and right now
    let nowUnix = Math.floor((new Date()).getTime() / 1000);
    let cloudUnix = Math.floor((new Date(cloudSave.timestamp)).getTime() / 1000);

    if (nowUnix - cloudUnix >= maxTimeDeltaSeconds) {
        // If the cloud save is older than threshold, save and overwrite it
        game.server.pushSave();
    } else {
        // The cloud save is newer, load it in
        game.server.loadSave(currentSaveGuid);
    }
}

// All of the above code packaged into an interval for repeated execution
let autoCloudSaveInterval = setInterval(syncSaveDataWithRespFunc, secondsBetweenSaves * 1000, autoCloudSave, secondsBetweenSaves - 1);