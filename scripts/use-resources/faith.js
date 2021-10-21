import { SCRITTIES_LOG } from "../../config/log";

export let faith = () => {
    let faithRes = game.resPool.resourceMap.faith;
    if (!faithRes.unlocked) return;   // No cheating
    if (faithRes.value < faithRes.maxValue) return; // Only run if full faith

    // if transcendence is unlocked
    if (game.religion.getRU("transcendence").on >= 1) {
        // solarchant       -> + faith generation
        // scholasticism    -> + max science
        // goldenSpire      -> + max faith
        // sunAltar         -> + fixed max faith, + happiness
        // stainedGlass     -> + culture
        // basilica         -> + culture, + max culture
        // templars         -> + catpower limit

        let religionUpgradeList = [ 'solarchant', 'scholasticism', 'goldenSpire' ]

        for (let religionUpgradeName of religionUpgradeList) {
            let RU = game.religionTab.rUpgradeButtons.find((node) => node.id === religionUpgradeName);
            if (!RU) continue; // No cheating
    
            let impossible = RU.model.resourceIsLimited;
            let available = RU.model.enabled;
            let btn = RU.buttonContent;

            if (!impossible) {
                if (available) {
                    if (SCRITTIES_LOG.faith.upgrade) console.log(`Building a ${religionUpgradeName} from faith`);
                    btn.click();
                }
                return;
            } 
        }
    }

    if (SCRITTIES_LOG.faith.praise) console.log("Praise the sun!");
    game.religion.praise();
};
