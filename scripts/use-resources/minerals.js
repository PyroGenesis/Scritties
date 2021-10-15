import { SCRITTIES_LOG } from "../../config/log";
import { aqueduct } from "../../ref/buildings";
import { build } from "../actions/build";

export let minerals = () => {
    let mineralRes = game.resPool.resourceMap.minerals;
    if (!mineralRes.unlocked) return;     // No cheating
    if (mineralRes.value < mineralRes.maxValue) return;   // Only run when minerals are full

    // Try to make mineral only buildings
    game.bldTab.update();
    let mineralBuildings = [aqueduct];

    for (let mineralBuilding of mineralBuildings) {
        let buildRes = build(mineralBuilding.name, true);
        if (buildRes.built) {
            if (SCRITTIES_LOG.minerals) console.log(`Building a ${mineralBuilding.label} to use minerals`);
            return;
        }
    }
};