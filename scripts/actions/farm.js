import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";

export let farm = () => {
    if (!SCRITTIES_SETTINGS.farm) return;   // Run according to setting

    game.bldTab.update();
    if (!game.bld.get('field').unlocked) return;    // No cheating
    if (game.calendar.season > 1 || game.challenges.isActive("winterIsComing")) return; // only run for spring and summer

    let field = game.bldTab.children.find((node) => node.opts.building === 'field');

    let btn = field.buttonContent;
    let impossible = field.model.resourceIsLimited;
    let available = field.model.enabled;

    if (impossible || !available) return;

    if (SCRITTIES_LOG.farm) console.log(`Building a Catnip Field`);
    btn.click();
}