import { SCRITTIES_LOG } from "../../config/log";

export let praise = () => {
    let faithRes = game.resPool.resourceMap.faith;
    if (!faithRes.unlocked) return;   // No cheating

    if(faithRes.value >= faithRes.maxValue) {
        if (SCRITTIES_LOG.faith) console.log("Praise the sun!");
        game.religion.praise();
    }
};
