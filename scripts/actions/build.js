import { SCRITTIES_LOG } from "../../config/log";
import { logicalBtnClick } from "../utility/utility";

export let build = (bld) => {

    let result = {
        unlocked: false,
        impossible: true,
        available: false,
        built: false
    }

    if (!bld.model.metadata.unlocked) return result; // No cheating
    result.unlocked = true;

    result.impossible = bld.model.resourceIsLimited;
    result.available = bld.model.enabled;

    if (result.impossible || !result.available) return result;

    logicalBtnClick(bld);
    result.built = true;
    return result;
}

export let builder = (tab, buildHierarchy, logVarName) => {
    // tab isn't visible yet
    if (!tab.visible) return;

    tab.update();
    for (let goalGroup of buildHierarchy) {
        // console.log('gg', goal_group.map(g => g.label).join(', '));
        SCRITTIES_LOG[logVarName] = ""
        let grpImpossible = true;
        for (let goal of goalGroup) {
            if (!goal.conditions.every(cond => cond())) continue;

            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let buildRes = build(goal.bldObj);
                if (!buildRes.unlocked) continue; // No cheating

                grpImpossible = grpImpossible && buildRes.impossible;
                if (!buildRes.available && !buildRes.impossible) {
                    SCRITTIES_LOG[logVarName] += goal.name + ", ";
                }

                if (buildRes.built) goal.after.forEach(afterFn => { afterFn(); });

                if (SCRITTIES_LOG.build && buildRes.built) console.log(`Building a ${goal.bldObj.model.metadata.label}`);
            }
        }
        if (!grpImpossible) {
            // buildGrpLogVar = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
}