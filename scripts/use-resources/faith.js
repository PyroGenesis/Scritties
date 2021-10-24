import { SCRITTIES_LOG } from "../../config/log";

export let faith = () => {
    let faithRes = game.resPool.resourceMap.faith;
    if (!faithRes.unlocked) return;   // No cheating

    // if transcendence is unlocked
    if (game.religion.getRU("transcendence").on >= 1) {
        // load the religion tab if not loaded
        if (!game.religionTab.zgUpgradeButtons || game.religionTab.zgUpgradeButtons.length === 0) $(`a.Religion`)[0].click();
        
        // solarchant       -> + faith generation
        // scholasticism    -> + max science
        // goldenSpire      -> + max faith
        // sunAltar         -> + fixed max faith, + happiness
        // stainedGlass     -> + culture
        // basilica         -> + culture, + max culture
        // templars         -> + catpower limit

        let religionUpgradeList = [
            {
                name: 'solarchant',
                conditions: []
            }, {
                name: 'scholasticism',
                conditions: []
            }, {
                name: 'goldenSpire',
                conditions: [ (game.resPool.resourceMap.titanium.value / game.resPool.resourceMap.titanium.maxValue) > 0.95 ]
            }, {
                name: 'basilica',
                conditions: [ (game.resPool.resourceMap.titanium.value / game.resPool.resourceMap.titanium.maxValue) > 0.95 ]
            }, {
                name: 'templars',
                conditions: [ (game.resPool.resourceMap.titanium.value / game.resPool.resourceMap.titanium.maxValue) > 0.95 ]
            },
        ];

        // console.log(religionUpgradeList)

        for (let religionUpgrade of religionUpgradeList) {
            let RU = game.religionTab.rUpgradeButtons.find((node) => node.id === religionUpgrade.name);
            // console.log(!RU, !religionUpgrade.conditions.every(cond => cond))
            if (!RU) continue; // No cheating
            if (!religionUpgrade.conditions.every(cond => cond)) continue;  // Does not satisfy extra conditions
    
            let impossible = RU.model.resourceIsLimited;
            let available = RU.model.enabled;
            let btn = RU.buttonContent;

            // console.log(impossible, available, btn);
            if (!impossible) {
                if (available) {
                    if (SCRITTIES_LOG.faith.upgrade) console.log(`Building a ${religionUpgrade.name} from faith`);
                    btn.click();
                }
                return;
            } 
        }
    }

    if (faithRes.value < faithRes.maxValue) return; // Only run if full faith
    if (SCRITTIES_LOG.faith.praise) console.log("Praise the sun!");
    game.religion.praise();
};
