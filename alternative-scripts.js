import { SCRITTIES_SETTINGS, SCRITTIES_LOG } from "./scritties";

// SCRITTIES_SETTINGS = {
//     catpower: {
//         hunting: true,
//         parchment: false
//     },
//     field: true
// }

// SCRITTIES_LOG = {
//     catpower: {
//         hunting: true,
//         parchment: true
//     },
//     field: true
// }

export let fieldPlanter = () => {
    game.bldTab.update();
    if (!game.bld.get('field').unlocked) return;    // No cheating
    if (game.calendar.season > 1 || game.challenges.isActive("winterIsComing")) return; // only run for spring and summer

    let field = game.bldTab.children.find((node) => node.opts.building === 'field');

    let btn = field.buttonContent;
    let impossible = field.model.resourceIsLimited;
    let available = field.model.enabled;

    if (impossible || !available) return;

    if (SCRITTIES_LOG.field) console.log(`Building a Catnip Field`);
    btn.click();
}
let fieldPlanterInterval = setInterval(fieldPlanter, 2000);

let huntInterval = setInterval(hunt, 5000);