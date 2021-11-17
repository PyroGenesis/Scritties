// time between two cloud saves (do NOT use a very small value)
let secondsBetweenSaves = 10 * 60;    // 10 minutes

// Syncs the save data with the server
// Similar to game.server.syncData(), except it also accepts a fn to execute after syncing
function syncSaveDataWithRespFunc(respFunc, ...args) {
    game.server._xhr("/kgnet/save/", "GET", {}, function(resp){
        game.server.saveData = resp;
        respFunc(...args);
    });
}

// The function performing the sync
function autoCloudSave(maxTimeDeltaSeconds) {
    // Get the unique ID of current active game
    let currentSaveGuid = game.telemetry.guid;
    // If the game has no unique ID, there is nothing I can do except quit
    if (!currentSaveGuid) return;

    // Get your save from the list of cloud saves
    let cloudSave = game.server.saveData.find((save) => save.guid === currentSaveGuid);
    // If there is no cloud save, this is the first save so save immediately
    if (!cloudSave) {
        game.server.pushSave();
        return;
    }

    // Calculate the unix timestamps of the cloud save and right now
    let nowUnix = Math.floor((new Date()).getTime() / 1000);
    let cloudUnix = Math.floor((new Date(cloudSave.timestamp)).getTime() / 1000);

    if (nowUnix - cloudUnix >= maxTimeDeltaSeconds) {
        // If the cloud save is older than threshold, save and overwrite it
        game.server.pushSave();
    } else {
        // The cloud save is newer, load it in
        game.server.loadSave(currentSaveGuid);
    }
}

// All of the above code packaged into an interval for repeated execution
export function setupCloudSaving() {
    return setInterval(syncSaveDataWithRespFunc, secondsBetweenSaves * 1000, autoCloudSave, secondsBetweenSaves - 1);
}