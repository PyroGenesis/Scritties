let LOG_AUTOMATION = true;

let hunt = setInterval(() => {
    if(game.resPool.resourceMap.manpower.value === game.resPool.resourceMap.manpower.maxValue) {
        if (LOG_AUTOMATION) console.log("Going hunting");
        $("#fastHuntContainer>a")[0].click();
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

let useUpInBuildings = setInterval(() => {
    let resource_to_building_mapping = [
        {
            source: 'gold',
            result: 'Tradepost',
            tab: 'Bonfire'   
        }
    ]

    for (let res_to_bld of resource_to_building_mapping) {
        let src_obj = game.resPool.get(res_to_bld.source)
        if (src_obj.value / src_obj.maxValue > 0.95) {
            $(`a.${res_to_bld.tab}`)[0].click() // Switching tabs
            // TODO: Improve this log to include resources used
            if (LOG_AUTOMATION) console.log(`Building ${res_to_bld.result} from excess ${res_to_bld.source}`);
            $(`.btnContent:contains('${res_to_bld.result}')`)[0].click()
        }
    }
}, 10*1000);