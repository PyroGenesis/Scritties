import { SCRITTIES_LOG } from "../../config/log";

export let gold = (msBetweenExecutions) => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked) return;     // No cheating

    if(goldRes.value >= goldRes.maxValue && game.science.get('civil').researched) {
        if (SCRITTIES_LOG.gold.promoteLeader) console.log("Promoting kitten leader");
        game.villageTab.censusPanel.census.promoteLeaderHref.click();
        goldRes = game.resPool.resourceMap.gold;
    }

    if(goldRes.value >= goldRes.maxValue && game.diplomacy.get('zebras').unlocked) {
        let zebras = game.diplomacy.get("zebras");
        // at least 1 trade should be done
        let trades = 1;
        // trades according to gold earned betweebn checks
        trades = Math.max(trades, Math.ceil((goldRes.perTickCached * msBetweenExecutions / 200) / (15 - game.getEffect("tradeGoldDiscount"))));
        // limit trades if they are not possible
        trades = Math.min(trades, game.diplomacy.getMaxTradeAmt(zebras))

        if (SCRITTIES_LOG.gold.tradeZebras) console.log("Trading with zebras instead");
        game.diplomacy.tradeMultiple(game.diplomacy.get("zebras"), trades);
        // goldRes = game.resPool.resourceMap.gold;
    }
};
