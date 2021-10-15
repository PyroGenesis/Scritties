import { SCRITTIES_LOG } from "../../config/log";
import { SCRITTIES_SETTINGS } from "../../config/settings";
import { bldGoals } from "../../ref/build-hierarchy";

export let kittenLimiter = () => {
    if (game.village.maxKittens >= SCRITTIES_SETTINGS.kittenLimit) {
        console.log("No more kittens!")
        bldGoals.splice(1, 1)
        clearInterval(kittenLimiter);
    }
};

export let build = (buildingName, bldTabUpdated) => {
    if (!bldTabUpdated) game.bldTab.update();

    let result = {
        unlocked: false,
        impossible: true,
        available: false,
        built: false
    }

    let bld = game.bldTab.children.find((node) => node.opts.building === buildingName);
    if (!bld) return result; // No cheating
    result.unlocked = true;

    result.impossible = bld.model.resourceIsLimited;
    result.available = bld.model.enabled;
    let btn = bld.buttonContent;

    if (result.impossible || !result.available) return result;

    btn.click();
    result.built = true;
    return result;
}

export let builder = () => {    
    game.bldTab.update();
    for (let goal_group of bldGoals) {
        // console.log('gg', goal_group.map(g => g.label).join(', '));
        SCRITTIES_LOG.BUILD_LastGroupReached = ""
        let grpImpossible = true;
        for (let goal of goal_group) {
            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let buildRes = build(goal.name, true);
                if (!buildRes.unlocked) continue; // No cheating

                grpImpossible = grpImpossible && buildRes.impossible;
                if (!buildRes.available && !buildRes.impossible) {
                    SCRITTIES_LOG.BUILD_LastGroupReached += goal.label + ", ";
                }

                if (SCRITTIES_LOG.build && buildRes.built) console.log(`Building a ${goal.label}`);
            }
        }
        if (!grpImpossible) {
            // SCRITTIES_LOG.lastBldGroupReached = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
}