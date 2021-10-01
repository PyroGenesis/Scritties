let LOG_AUTOMATION = false;

let hunt = setInterval(() => {
    let mp = game.resPool.resourceMap.manpower;
    if (mp.value >= mp.maxValue) {
        if (LOG_AUTOMATION) console.log("Going hunting");
        game.village.huntAll();

        if (gamePage.workshop.getCraft('parchment').unlocked) {
            let ticks_needed_to_fill_MP = mp.maxValue / mp.perTickCached
            let fur_used_while_filling_MP = game.resPool.resourceMap.furs.perTickCached * ticks_needed_to_fill_MP // this is -ve
            let fur_available_for_parchments = game.resPool.resourceMap.furs.value + fur_used_while_filling_MP
            let parchs_to_craft = Math.trunc(fur_available_for_parchments / 175)

            if (LOG_AUTOMATION) console.log(`Converting ${parchs_to_craft * 175} furs to ${parchs_to_craft} parchments`);
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

let useUpInResources = setInterval(() => {
    for (let res_to_res of resource_to_resource_mapping) {
        let src_obj = game.resPool.get(res_to_res.source)
        if (!src_obj.unlocked || !game.resPool.get(res_to_res.result).unlocked) continue;

        if (src_obj.value / src_obj.maxValue > 0.98) {
            let craft_num = Math.max(1, Math.trunc((src_obj.maxValue * 0.02) / res_to_res.cost))
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
                    log_text += res_to_res.otherResources.map((other_resource) => `${other_resource.cost} ${other_resource.resource}`).join(', ');
                    log_text += ')'
                }
                log_text += ` to ${craft_num} ${res_to_res.result}`
                console.log(log_text);
            }
            game.craft(res_to_res.result, craft_num);
        }
    }
}, 10*1000);

let LOG_CULTURE_AUTOMATION = true;
let useUpCulture = setInterval(() => {
    let culture = game.resPool.resourceMap.culture;
    if(culture.value >= culture.maxValue) {
        for (let i = 0; i < game.diplomacyTab.racePanels.length; i++) {
            let racePanel = game.diplomacyTab.racePanels[i];
            if (racePanel.embassyButton.model.enabled) {
                $(`a.Trade`)[0].click()
                if (LOG_CULTURE_AUTOMATION) console.log("Building embassy for " + racePanel.race.title);
                racePanel.embassyButton.buttonContent.click();
            }
        }
    }
}, 5*1000);

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

// let useUpGold = setInterval(() => {
//     if(game.resPool.resourceMap.gold.value >= game.resPool.resourceMap.gold.maxValue) {
//         if (LOG_AUTOMATION) console.log("Promoting kittens");
//         game.village.promoteKittens();
//     }
// }, 10*1000);

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

// { ...amphitheatre, limit: -1 },
// { ...academy, limit: -1 },
// { ...library, limit: -1 }

let bld_goals = [
    [
        { ...tradepost, limit: -1 },
        { ...mine, limit: -1 },
        { ...lumberMill, limit: -1 },
        { ...workshop, limit: -1 },
        { ...academy, limit: -1 },
        { ...library, limit: -1 },
    ],
    [
        { ...observatory, limit: -1 },
        { ...temple, limit: -1 },
        { ...smelter, limit: -1 },
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

let fulfillGoals = setInterval(() => {    
    $(`a.Bonfire`)[0].click()
    for (let goal_group of bld_goals) {
        lastBldGrpReached = ""
        let impossible = true;
        for (let goal of goal_group) {
            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let potential_btn = $(`.btnContent:contains('${goal.label}')`)
                if (potential_btn.length === 0) continue;

                let btn = potential_btn[0]
                let btnImpossible = btn.firstElementChild.classList.contains('limited')
                let btnDisabled = btn.parentElement.classList.contains('disabled')

                if (!btnImpossible) {
                    impossible = false;
                    lastBldGrpReached += goal.label + ", ";
                }
                if (btnImpossible || btnDisabled) continue;

                if (LOG_BLD_AUTOMATION) console.log(`Building a ${goal.label}`);
                btn.click();
            }
        }
        if (!impossible) {
            // lastBldGrpReached = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
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
        result: 'ship',
        ratio: 1,
        limit: 245,
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