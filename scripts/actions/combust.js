import { SCRITTIES_LOG } from "../../config/log";
import { logicalBtnClick } from "../utility/utility";

export let combust = () => {
    if (!game.resPool.resourceMap.alicorn.unlocked) return;
    if (!game.workshop.get('chronoforge').researched) return;
    if (!game.timeTab.content) game.timeTab.domNode.click();
    game.timeTab.update();
    
    let alicornSacrificeBtn = game.religionTab.sacrificeAlicornsBtn;
    let combustBtn = game.timeTab.children[2].children[0].children[0];

    if (game.resPool.resourceMap.timeCrystal.value < 1) {
        if (game.resPool.resourceMap.alicorn.value < 25) return;
        if (SCRITTIES_LOG.combust) console.log(`Sacrificing 25 Alicorns for ${1+game.globalEffectsCached.tcRefineRatio} time crystals`);
        logicalBtnClick(alicornSacrificeBtn);
        game.timeTab.update();
    }
    if (SCRITTIES_LOG.combust) console.log('Combusting a time crystal');
    logicalBtnClick(combustBtn);
}