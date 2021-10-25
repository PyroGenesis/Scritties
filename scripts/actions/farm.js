import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";
import { field } from "../../ref/buildings";
import { build } from "./build";

export let farm = () => {
    if (!SCRITTIES_SETTINGS.farm) return;   // Run according to setting
    if (game.calendar.season > 1 || game.challenges.isActive("winterIsComing")) return; // only run for spring and summer

    let buildRes = build(field.bldObj, false);
    if (SCRITTIES_LOG.farm && buildRes.built) console.log(`Building a Catnip Field`);
}