import { SCRITTIES_LOG } from "../../config/log";

export let gold = (msBetweenExecutions) => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked) return;     // No cheating
    if (goldRes.value < goldRes.maxValue) return;   // Only run when gold is full


    if(game.science.get('civil').researched) {
        let leader = game.village.sim.kittens.find(kitten => kitten.isLeader);
        if (game.village.sim.expToPromote(leader.rank, leader.rank+1, leader.exp)[0]) {
            if (SCRITTIES_LOG.gold.promoteLeader) console.log("Promoting kitten leader");
            game.village.sim.promote(leader, leader.rank+1);
            return;
        }
    }

    if(game.diplomacy.get('zebras').unlocked) {
        let zebras = game.diplomacy.get("zebras");
        // at least 1 trade should be done
        let trades = 1;
        // trades according to gold earned betweebn checks
        trades = Math.max(trades, Math.ceil((goldRes.perTickCached * msBetweenExecutions / 200) / (15 - game.getEffect("tradeGoldDiscount"))));
        // limit trades if they are not possible
        trades = Math.min(trades, game.diplomacy.getMaxTradeAmt(zebras))

        if (trades > 0) {
            if (SCRITTIES_LOG.gold.tradeZebras) console.log("Trading with zebras");
            game.diplomacy.tradeMultiple(game.diplomacy.get("zebras"), trades);
            return;
        }
    }
};
