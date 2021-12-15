import { tectonic, spaceBeacon, terraformingStation } from "../../ref/space-buildings";
import { builder } from "../actions/build";

let antimatterBuildHierarchy = [
    [tectonic], [spaceBeacon], [terraformingStation], /* [Sunforge], [HR Harvester] */
];

export let antimatter = () => {
    let antimatterRes = game.resPool.resourceMap.antimatter;
    if (!antimatterRes.unlocked) return;     // No cheating
    if (antimatterRes.value < antimatterRes.maxValue) return;   // Only run when antimatter is full
    
    // load the space tab if not loaded
    // if (!game.spaceTab.content) game.spaceTab.domNode.click();
    // game.spaceTab.update();

    builder(game.spaceTab, antimatterBuildHierarchy, 'ANTIMATTER_BUILD_LastGroupReached');
}