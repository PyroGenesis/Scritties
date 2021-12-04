import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";
import { build } from "./build";
import { field } from './../../ref/cath-buildings';

export let farm = () => {
    if (!SCRITTIES_SETTINGS.farm) return;   // Run according to setting
    if (game.calendar.season > 0 || game.challenges.isActive("winterIsComing")) return; // only run for spring

    game.bldTab.update();
    let buildRes = build(field.bldObj);
    if (SCRITTIES_LOG.farm && buildRes.built) console.log(`Building a Catnip Field`);
}