import { SCRITTIES_LOG } from "../../config/log";
import { aqueduct } from "../../ref/buildings";

export let minerals = () => {
    let mineralRes = game.resPool.resourceMap.minerals;
    if (!mineralRes.unlocked) return;     // No cheating
    if (mineralRes.value < mineralRes.maxValue) return;   // Only run when minerals are full

    // Try to make mineral only buildings
    game.bldTab.update();
    let mineralBuildings = [aqueduct];

    for (let mineralBuilding of mineralBuildings) {
        if (!game.bld.get(mineralBuilding.name).unlocked) continue;

        let mineralBuildingOpts = game.bldTab.children.find((node) => node.opts.building === mineralBuilding.name);
        let btn = mineralBuildingOpts.buttonContent;
        let impossible = mineralBuildingOpts.model.resourceIsLimited;
        let available = mineralBuildingOpts.model.enabled;

        if (impossible || !available) continue;
        if (SCRITTIES_LOG.minerals) console.log(`Building a ${mineralBuilding.label} to use minerals`);
        btn.click();
    }
};