import { SCRITTIES_LOG } from "../../log";

export let praise = () => {
    let faith = game.resPool.resourceMap.faith;
    if (!faith.unlocked) return;   // No cheating

    if(faith.value >= faith.maxValue) {
        if (SCRITTIES_LOG.faith) console.log("Praise the sun!");
        game.religion.praise();
    }
};
