import { SCRITTIES_LOG } from "../../config/log"

let unicornBldQueue = []

let unicornTombBtnIdx = 0 //{ name: 'unicornTomb', label: 'Unicorn Tomb' }
let ivoryTowerBtnIdx = 1 //{ name: 'ivoryTower', label: 'Unicorn Tomb' }
let ivoryCitadelBtnIdx = 2 //{ name: 'ivoryCitadel', label: 'Unicorn Tomb' }

export let sacrifice = () => {
    // load the religion tab if not loaded
    if (!game.religionTab.zgUpgradeButtons || game.religionTab.zgUpgradeButtons.length === 0) $(`a.Religion`)[0].click();

    // Queue is empty
    if (unicornBldQueue.length === 0) return;
    // Check if a ziggurat was ever bought
    let ziggBld = game.bld.get('ziggurat');
    if(!ziggBld.on) return;

    // Get upgrade object from religion tab
    let ziggUpgrade = game.religionTab.zgUpgradeButtons[unicornBldQueue[0]]
    // Check if upgrade is unlocked
    if (!ziggUpgrade.model.metadata.unlocked) return;   // No cheating

    // Calculate the tears required for upgrade
    let tearsRequired = ziggUpgrade.model.prices.find(price => price.name === 'tears').val - game.resPool.resourceMap.tears.value
    // Calculate number of sacrifices needed to get all tears
    let sacrificesRequired = Math.ceil(tearsRequired / ziggBld.val)

    if (sacrificesRequired > 0) {
        // Check if you have enough unicorns for your sacrifices
        let unicornsRequired = 2500 * sacrificesRequired;
        if (game.resPool.resourceMap.unicorns.value < unicornsRequired) return;

        // Make the sacrifices
        if(SCRITTIES_LOG.sacrifice) console.log(`Sacrificing ${unicornsRequired} unicorns for ${sacrificesRequired * ziggBld.val} tears`)
        game.religionTab.sacrificeBtn.controller._transform(game.religionTab.sacrificeBtn.model, sacrificesRequired)
    }

    // Remove from queue
    unicornBldQueue.shift()

    // Build the upgrade
    setTimeout(() => {
        if(SCRITTIES_LOG.sacrifice) console.log(`Building a ${ziggUpgrade.opts.name}`)
        ziggUpgrade.buttonContent.click();
    }, 5*1000)
}