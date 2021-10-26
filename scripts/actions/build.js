import { SCRITTIES_LOG } from "../../config/log";
import { bldGoals } from "../../ref/build-hierarchy";

export let build = (bld, bldTabUpdated) => {
    if (!bldTabUpdated) game.bldTab.update();

    let result = {
        unlocked: false,
        impossible: true,
        available: false,
        built: false
    }

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
            if (!goal.conditions.every(cond => cond())) continue;

            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let buildRes = build(goal.bldObj, true);
                if (!buildRes.unlocked) continue; // No cheating

                grpImpossible = grpImpossible && buildRes.impossible;
                if (!buildRes.available && !buildRes.impossible) {
                    SCRITTIES_LOG.BUILD_LastGroupReached += goal.name + ", ";
                }

                if (buildRes.built) goal.after.forEach(afterFn => { afterFn(); });

                if (SCRITTIES_LOG.build && buildRes.built) console.log(`Building a ${goal.bldObj.opts.name}`);
            }
        }
        if (!grpImpossible) {
            // SCRITTIES_LOG.lastBldGroupReached = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
}