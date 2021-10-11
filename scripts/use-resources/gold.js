import { SCRITTIES_LOG } from "../../config/log";

export let gold = () => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked) return;     // No cheating

    if(goldRes.value >= goldRes.maxValue && game.science.get('civil').researched) {
        if (SCRITTIES_LOG.gold.promoteLeader) console.log("Promoting kitten leader");
        game.villageTab.censusPanel.census.promoteLeaderHref.click();
        goldRes = game.resPool.resourceMap.gold;
    }

    if(goldRes.value >= goldRes.maxValue && game.diplomacy.get('zebras').unlocked) {
        if (SCRITTIES_LOG.gold.tradeZebras) console.log("Trading with zebras instead");
        game.diplomacy.tradeAll(game.diplomacy.get("zebras"));
        goldRes = game.resPool.resourceMap.gold;
    }
};
