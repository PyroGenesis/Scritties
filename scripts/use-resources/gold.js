import { SCRITTIES_LOG } from "../../config/log";
import { temple, tradepost } from "../../ref/buildings";
import { build } from "../actions/build";
import { trade } from "../actions/trade";

export let gold = (msBetweenExecutions) => {
    let goldRes = game.resPool.resourceMap.gold;
    if (!goldRes.unlocked) return;     // No cheating
    if (goldRes.value < goldRes.maxValue) return;   // Only run when gold is full

    if(game.science.get('civil').researched) {
        let leader = game.village.sim.kittens.find(kitten => kitten.isLeader);
        if (game.village.sim.expToPromote(leader.rank, leader.rank+1, leader.exp)[0] &&
            game.village.sim.goldToPromote(leader.rank, leader.rank+1, goldRes.value)[0]) {
            if (SCRITTIES_LOG.gold.promoteLeader) console.log("Promoting kitten leader");
            game.village.sim.promote(leader, leader.rank+1);
            return;
        }
    }

    // build a gold building
    // game.bldTab.update();
    // let goldBuildings = [tradepost, temple];

    // for (let goldBuilding of goldBuildings) {
    //     let buildRes = build(goldBuilding.name, true);
    //     if (buildRes.built) {
    //         if (SCRITTIES_LOG.gold.build) console.log(`Building a ${goldBuilding.label} to use gold`);
    //         return;
    //     }
    // }

    // decide trade partner based on steel-alloy ratio
    if (game.resPool.resourceMap.steel.value <= game.resPool.resourceMap.alloy.value) {
        trade('griffins', msBetweenExecutions);
    } else {
        trade('zebras', msBetweenExecutions);
    }
};
