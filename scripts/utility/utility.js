
export let logicalBtnClick = (logicalBtn) => {
    logicalBtn.animate();
    logicalBtn.controller.buyItem(logicalBtn.model, 1, function(result) {
        if (result) {
            logicalBtn.update();
        }
    });
};

let getAlicornReq = (res, count) => {
    if (res === 'relic') {
        let currentRelics = game.resPool.resourceMap.relic.value;
        let relicsToCraft = count - currentRelics;

        if (relicsToCraft <= 0) return 0;
        let effectiveRelicRatio = 1 + game.globalEffectsCached.relicRefineRatio;
        let refines = Math.ceil(relicsToCraft / effectiveRelicRatio);

        res = 'timeCrystal';
        count = refines * 25;
    }

    if (res === 'timeCrystal') {
        let currentTc = game.resPool.resourceMap.timeCrystal.value;
        let tcToCraft = count - currentTc;

        if (tcToCraft <= 0) return 0;
        let effectiveTcRatio = 1 + game.globalEffectsCached.tcRefineRatio;
        let sacrifices = Math.ceil(tcToCraft / effectiveTcRatio);
        return sacrifices * 25;
    }
}

let getAlicornRes = () => {
    let effectiveTcRatio = 1 + game.globalEffectsCached.tcRefineRatio;
    let effectiveRelicRatio = 1 + game.globalEffectsCached.relicRefineRatio;

    let currentTc = game.resPool.resourceMap.timeCrystal.value;
    let sacrifices = Math.floor(game.resPool.resourceMap.alicorn.value / 25);
    let createdTc = sacrifices * effectiveTcRatio;
    let totalTc = currentTc + createdTc;

    let currentRelics = game.resPool.resourceMap.relic.value;
    let refines = Math.floor(totalTc / 25);
    let createdRelics = refines * effectiveRelicRatio;
    let totalRelics = currentRelics + createdRelics;

    return `Sacrifices: ${sacrifices}, TC: ${totalTc.toFixed(2)}, Relics: ${totalRelics}`
}


let secondsToString = (seconds) => {
    let result = [];
    let numyears = Math.floor(seconds / 31536000);
    if (numyears > 0) result.push(numyears + 'yr')

    let numdays = Math.floor((seconds % 31536000) / 86400);
    if (numdays > 0) result.push(numdays + 'd')

    let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    if (numhours > 0) result.push(numhours + 'hr')

    let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    if (numminutes > 0) result.push(numminutes + 'm')

    let numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    if (numseconds > 0) result.push(numseconds + 's')

    return result.join(' ');
}