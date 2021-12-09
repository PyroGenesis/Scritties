import { SCRITTIES_LOG } from "../../config/log";
import { logicalBtnClick } from "../utility/utility";

export let build = (bld) => {

    let result = {
        unlocked: false,
        impossible: true,
        available: false,
        built: false
    }

    if (!bld || !bld.model.metadata.unlocked) return result; // No cheating
    result.unlocked = true;

    result.impossible = bld.model.resourceIsLimited;
    result.available = bld.model.enabled;

    if (result.impossible || !result.available) return result;

    logicalBtnClick(bld);
    result.built = true;
    return result;
}

export let builder = (tab, buildHierarchy, logVarName) => {
    let hierarchyIter = 0;
    SCRITTIES_LOG[logVarName] = "0";
    // tab isn't visible yet
    if (!tab.visible) return;

    // If tab isn't loaded in yet, click and load it in (only for tabs after science)
    if (!tab.content) tab.domNode.click();

    tab.update();
    for (let goalGroup of buildHierarchy) {
        hierarchyIter += 1;
        SCRITTIES_LOG[logVarName] = `${hierarchyIter}: `;

        let grpImpossible = true;
        for (let goal of goalGroup) {
            if (!goal.conditions.every(cond => cond())) continue;

            if (goal.limit == -1 || goal.bldObj.model.metadata.val < goal.limit) {
                let buildRes = build(goal.bldObj);
                if (!buildRes.unlocked) continue; // No cheating

                grpImpossible = grpImpossible && buildRes.impossible;
                if (!buildRes.available && !buildRes.impossible) {
                    SCRITTIES_LOG[logVarName] += goal.bldObj.model.metadata.label + ", ";
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