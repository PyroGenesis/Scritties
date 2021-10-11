import { SCRITTIES_LOG } from "../../config/log";

export let culture = () => {
    let cultureRes = game.resPool.resourceMap.culture;
    if(!cultureRes.unlocked || !game.diplomacy.hasUnlockedRaces()) return;   // No cheating

    if(cultureRes.value >= cultureRes.maxValue) {
        if (game.diplomacyTab.racePanels.length === 0) {
            $(`a.Trade`)[0].click();
        }
        for (let i = 0; i < game.diplomacyTab.racePanels.length; i++) {
            let racePanel = game.diplomacyTab.racePanels[i];
            racePanel.update();
            if (racePanel.embassyButton.model.enabled) {
                if (SCRITTIES_LOG.culture) console.log("Building embassy for " + racePanel.race.title);
                racePanel.embassyButton.buttonContent.click();
                return;
            }
        }
    }
};
