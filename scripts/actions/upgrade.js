import { SCRITTIES_LOG } from "../../log";
import { constructionAutoUpgrades } from "../../ref/upgrade-mapping";

export let upgrade = () => {
    SCRITTIES_LOG.UPGRADE_status = [];
    for (let upgrade of constructionAutoUpgrades) {
        let needObjs = upgrade.needs.map(source => game.resPool.get(source.resource));
        let resObj = game.resPool.get(upgrade.result)

        // No cheating!
        if (!resObj.unlocked || !needObjs.every(need => need.unlocked)) continue;

        // Check if limit exceeded
        if (upgrade.limit > -1 && resObj.value > upgrade.limit) {
            SCRITTIES_LOG.UPGRADE_status.push(`${upgrade.result} limit reached (${upgrade.limit})`)
            continue;
        }

        // Check all resources are present for atleast 1 conversion
        let notEnoughRes = needObjs.find((need, i) => need.value < upgrade.needs[i].cost);
        if (notEnoughRes) {
            SCRITTIES_LOG.UPGRADE_status.push(`${upgrade.result} failed (${notEnoughRes.name})`);
            continue;
        }

        let makeResult = true;
        for (let i = 0; i < upgrade.needs.length && makeResult; i++) {
            // If resource is not limited, no need for ratio checking
            if (!upgrade.needs[i].limited) continue;

            let totalNeedValue = needObjs[i].value + resObj.value * upgrade.needs[i].cost
            let optimalResultCount = totalNeedValue * upgrade.ratio / upgrade.needs[i].cost
            makeResult = resObj.value < Math.trunc(optimalResultCount);
            // makeResult = makeResult && needObjs[i].value >= upgrade.needs[i].cost

            if (!makeResult) SCRITTIES_LOG.UPGRADE_status.push(`${upgrade.result} failed (${upgrade.needs[i].resource})`);
        }

        if (makeResult) {
            if (SCRITTIES_LOG.crafting.upgrade) {
                let log_text = `Converting ${upgrade.needs.map(need => `${need.cost} ${need.resource}`).join(', ')} to ${upgrade.result}`
                console.log(log_text);
            }
            game.craft(upgrade.result, 1);
        }
    }
};
