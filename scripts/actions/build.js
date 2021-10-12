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

export let builder = () => {    
    game.bldTab.update();
    for (let goal_group of bldGoals) {
        // console.log('gg', goal_group.map(g => g.label).join(', '));
        SCRITTIES_LOG.BUILD_LastGroupReached = ""
        let impossible = true;
        for (let goal of goal_group) {
            if (goal.limit == -1 || game.bld.get(goal.name).val < goal.limit) {
                let bld = game.bldTab.children.find((node) => node.opts.building === goal.name);
                if (!bld) continue; // No cheating

                if (impossible) impossible = bld.model.resourceIsLimited;
                let available = bld.model.enabled;
                let btn = bld.buttonContent;

                if (!available && !bld.model.resourceIsLimited) {
                    SCRITTIES_LOG.BUILD_LastGroupReached += goal.label + ", ";
                }
                if (impossible || !available) continue;

                if (SCRITTIES_LOG.build) console.log(`Building a ${goal.label}`);
                btn.click();
            }
        }
        if (!impossible) {
            // SCRITTIES_LOG.lastBldGroupReached = goal_group.map((goal) => goal.label).join(', ');
            break;
        }
    }
}