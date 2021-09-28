let hunt = setInterval(() => {
    if(game.resPool.resourceMap.manpower.value === game.resPool.resourceMap.manpower.maxValue) {
        console.log("Going hunting");
        $("#fastHuntContainer>a")[0].click();
    }
}, 5000);

let starClick = setInterval(() => {
    let observeBtnQ = $("#observeBtn")
    if (observeBtnQ.length > 0) {
        console.log("Observing the sky!");
        observeBtnQ[0].click();
    }
}, 2000);

let useUpExtra = setInterval(() => {
    let resource_to_result = [
        {
            source: 'catnip',
            result: 'wood',
            cost: 50
        }, {
            source: 'wood',
            result: 'beam',
            cost: 175            
        }
    ]

    // let resource_to_result = [
    //     ["catnip",     "wood" ],
    //     // ["wood",     "beam" ],
    //     // ["minerals", "slab" ],
    //     // ["coal",     "steel"],
    //     // ["iron",     "plate"]
    // ];

    for (let res of resource_to_result) {
        let src_obj = game.resPool.get(res.source)
        if (src_obj.value / src_obj.maxValue > 0.95) {
            let craft_num = Math.trunc((src_obj.maxValue * 0.05) / res.cost)
            console.log(`Converting ${src_obj.maxValue * 0.05} ${res.source} to ${craft_num} ${res.result}`);
            game.craft(res.result, craft_num)
        }
    }
}, 10*1000);