import { SCRITTIES_LOG } from "../../log";

export let gold = () => {
    let gold = game.resPool.resourceMap.gold;
    if (!gold.unlocked) return;     // No cheating

    if(gold.value >= gold.maxValue && game.science.get('civil').researched) {
        if (SCRITTIES_LOG.gold.promoteLeader) console.log("Promoting kitten leader");
        game.villageTab.censusPanel.census.promoteLeaderHref.click();
        gold = game.resPool.resourceMap.gold;
    }

    if(gold.value >= gold.maxValue && game.diplomacy.get('zebras').unlocked) {
        if (SCRITTIES_LOG.gold.tradeZebras) console.log("Trading with zebras instead");
        game.diplomacy.tradeAll(game.diplomacy.get("zebras"));
        gold = game.resPool.resourceMap.gold;
    }
};
