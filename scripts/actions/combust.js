import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";
import { logicalBtnClick } from "../utility/utility";

export let combust = () => {
    // unlock checks
    if (!game.resPool.resourceMap.alicorn.unlocked || !game.workshop.get('chronoforge').researched) {
        setTimeout(combust, 5 * 60 * 1000)
        return;
    }

    // tab load
    if (!game.timeTab.content) game.timeTab.domNode.click();
    game.timeTab.update();

    // calculate time for next combust
    let effectiveAlicornPS = (game.globalEffectsCached.alicornChance / 2) + (game.resPool.resourceMap.alicorn.perTickCached * 5);   // alicorn generation based on base and rifts
    let timeToCraftTC = (25 / (game.globalEffectsCached.tcRefineRatio + 1)) / effectiveAlicornPS;   // how many seconds to get enough Alicorns for a "single" TC
    timeToCraftTC += SCRITTIES_SETTINGS.saveAlicornTime;                                            // extra time to build up Alicorns
    let heatConsumedPS = game.globalEffectsCached.heatPerTick * 5;                                  // Chronoheat consumed per second
    let timeToCool1Combust = 10 / heatConsumedPS;                                                   // how many seconds to consume all the heat of a combust
    let nextCombustDelay = Math.ceil(Math.max(timeToCraftTC, timeToCool1Combust));                  // time to next combust
    
    // action buttons
    let alicornSacrificeBtn = game.religionTab.sacrificeAlicornsBtn;
    let combustBtn = game.timeTab.children[2].children[0].children[0];

    // sacrifice (if possible) if not enough TC available
    if (game.resPool.resourceMap.timeCrystal.value < 1) {
        if (game.resPool.resourceMap.alicorn.value < 25) {
            setTimeout(combust, nextCombustDelay * 1000);
            return;
        }
        if (SCRITTIES_LOG.combust) console.log(`Sacrificing 25 Alicorns for ${1+game.globalEffectsCached.tcRefineRatio} time crystals`);
        logicalBtnClick(alicornSacrificeBtn);
        game.timeTab.update();
    }
    // combust
    if (SCRITTIES_LOG.combust) console.log(`Combusting a time crystal. Next one in ${nextCombustDelay}s`);
    logicalBtnClick(combustBtn);

    // prepare next combust
    setTimeout(combust, nextCombustDelay * 1000);
}