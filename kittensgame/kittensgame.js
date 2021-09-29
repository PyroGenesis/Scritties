let LOG_AUTOMATION = true;

let hunt = setInterval(() => {
    let mp = game.resPool.resourceMap.manpower;
    if(mp.value === mp.maxValue) {
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

let starClick = setInterval(() => {
    let observeBtnQ = $("#observeBtn")
    if (observeBtnQ.length > 0) {
        if (LOG_AUTOMATION) console.log("Observing the sky!");
        observeBtnQ[0].click();
    }
}, 2000);

let useUpInResources = setInterval(() => {
    let resource_to_resource_mapping = [
        {
            source: 'catnip',
            result: 'wood',
            cost: 50
        }, {
            source: 'wood',
            result: 'beam',
            cost: 175            
        }, {
            source: 'minerals',
            result: 'slab',
            cost: 250            
        }, {
            source: 'iron',
            result: 'plate',
            cost: 125            
        }, {
            source: 'coal',
            result: 'steel',
            cost: 100            
        }
    ]

    for (let res_to_res of resource_to_resource_mapping) {
        let src_obj = game.resPool.get(res_to_res.source)
        if (src_obj.value / src_obj.maxValue > 0.95) {
            let craft_num = Math.max(1, Math.trunc((src_obj.maxValue * 0.05) / res_to_res.cost))
            if (LOG_AUTOMATION) console.log(`Converting ${craft_num * res_to_res.cost} ${res_to_res.source} to ${craft_num} ${res_to_res.result}`);
            game.craft(res_to_res.result, craft_num)
        }
    }
}, 10*1000);

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
//     if(game.resPool.resourceMap.gold.value === game.resPool.resourceMap.gold.maxValue) {
//         if (LOG_AUTOMATION) console.log("Promoting kittens");
//         game.village.promoteKittens();
//     }
// }, 10*1000);

// jQuery.expr[':'].icontains = function(a, i, m) {
//     return jQuery(a).text().toUpperCase()
//             .indexOf(m[3].toUpperCase()) >= 0;
// };

let bld_goals = [
    {
        name: 'amphitheatre',
        label: 'Amphitheatre',
        limit: -1
    },
    {
        name: 'academy',
        label: 'Academy',
        limit: -1
    },
    {
        name: 'library',
        label: 'Library',
        limit: -1
    },

]

let fulfillGoals = setInterval(() => {
    for (let goal of bld_goals) {
        if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
            let btnMatches = $(`div.btn:not(.disabled)>.btnContent:contains('${goal.label}')`);
            if (btnMatches.length > 0) {
                if (LOG_AUTOMATION) console.log(`Building a ${goal.label}`);
                btnMatches[0].click();
            }

        }
    }
}, 30*1000);