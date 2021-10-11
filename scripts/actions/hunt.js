import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";

export let hunt = () => {
    if (!SCRITTIES_SETTINGS.catpower.hunt) return;   // Run according to setting

    let manpowerRes = game.resPool.resourceMap.manpower;
    if (!manpowerRes.unlocked) return;   // No cheating

    if (manpowerRes.value >= manpowerRes.maxValue) {
        if (SCRITTIES_LOG.catpower.hunt) console.log("Going hunting");
        game.village.huntAll();

        if(!SCRITTIES_SETTINGS.catpower.parchment) return;    // Run according to setting
        if (gamePage.workshop.getCraft('parchment').unlocked) {
            let ticks_needed_to_fill_MP = manpowerRes.maxValue / manpowerRes.perTickCached
            let fur_used_while_filling_MP = game.resPool.resourceMap.furs.perTickCached * ticks_needed_to_fill_MP // this is -ve
            let fur_available_for_parchments = game.resPool.resourceMap.furs.value + fur_used_while_filling_MP
            let parchs_to_craft = Math.trunc(fur_available_for_parchments / 175)

            if (SCRITTIES_LOG.catpower.parchment) console.log(`Converting ${parchs_to_craft * 175} furs to ${parchs_to_craft} parchments`);
            game.craft('parchment', parchs_to_craft);
        }

    }
};