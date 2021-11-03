import { SCRITTIES_LOG } from "../../config/log";

export let trade = (raceName, msBetweenExecutions) => {
    if(game.diplomacy.get(raceName).unlocked) {
        let goldRes = game.resPool.resourceMap.gold;
        let race = game.diplomacy.get(raceName);
        // at least 1 trade should be done
        let trades = 1;
        // trades according to gold earned betweebn checks
        trades = Math.max(trades, Math.floor((goldRes.perTickCached * msBetweenExecutions / 200) / (15 - game.getEffect("tradeGoldDiscount"))));
        // limit trades if they are not possible
        trades = Math.min(trades, game.diplomacy.getMaxTradeAmt(race));

        if (trades > 0) {
            if (SCRITTIES_LOG.gold.trade) console.log(`Trading with ${raceName}`);
            game.diplomacy.tradeMultiple(game.diplomacy.get(raceName), trades);
            return;
        }
    }
}