import { SCRITTIES_SETTINGS } from '../config/settings';
import { priceCondition, researchCondition, resourceCondition } from '../scripts/utility/conditions';

let getBldObj = (buildingName, limit, /*extraPropsFn,*/ conditions = [], after = []) => {
    // extraPropsFn = extraPropsFn || function() { return {} };
    return {
        name: buildingName,
        get bldObj() { return game.bldTab.children.find((bld) => bld.opts.building === buildingName) },
        limit: limit,
        conditions: conditions,
        after: after,
        // ...extraPropsFn()
    }
}

export let field = getBldObj('field', -1); 
export let pasture = getBldObj('pasture', -1);              // No, chance of death
export let solarFarm = getBldObj('pasture', -1);            // Always, if unlocked and full titanium
export let aqueduct = getBldObj('aqueduct', -1);            // If mineral full
aqueduct.conditions.push(resourceCondition.bind(null, 'minerals', 'fraction', 1));
solarFarm.conditions.push(() => game.bld.get('pasture').stage === 1)
solarFarm.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));

export let hut = getBldObj('hut', -1);                      // Upto kitten limit
export let logHouse = getBldObj('logHouse', -1);            // Upto kitten limit
export let mansion = getBldObj('mansion', -1);              // Upto kitten limit, if titanium is full
hut.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
logHouse.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
mansion.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
mansion.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));

export let library = getBldObj('library', -1);          
export let academy = getBldObj('academy', -1);              // If science is full
export let observatory = getBldObj('observatory', -1);      // If science, iron is full
export let biolab = getBldObj('biolab', -1);                // No, reserve alloy
academy.conditions.push(resourceCondition.bind(null, 'science', 'fraction', 1));
observatory.conditions.push(resourceCondition.bind(null, 'science', 'fraction', 1));
observatory.conditions.push(resourceCondition.bind(null, 'iron', 'fraction', 1));
// observatory.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));

export let barn = getBldObj('barn', -1);                    // Always at end
export let warehouse = getBldObj('warehouse', -1);          // Always at end, double resources available
export let harbor = getBldObj('harbor', -1);                // Always at end, not until 250 ships, double resources available
warehouse.conditions.push(priceCondition('warehouse', 'all', 2));
harbor.conditions.push(priceCondition('harbor', 'all', 2));
harbor.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));

export let mine = getBldObj('mine', -1);                    // Always
export let quarry = getBldObj('quarry', -1);                // If ships = 250, triple resources available
export let lumberMill = getBldObj('lumberMill', -1);        // Always
export let oilWell = getBldObj('oilWell', -1);              // If ships = 250, triple resources available
export let accelerator = getBldObj('accelerator', -1);      // If titanium full, turn on/off upto current
quarry.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));
quarry.conditions.push(priceCondition('quarry', 'all', 3));
oilWell.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));
oilWell.conditions.push(priceCondition('oilWell', 'all', 3));
accelerator.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));
accelerator.after.push(() => {
    if (game.bld.get('accelerator').val === 1) {
        game.bld.get('accelerator').on = 0;
    } else if (game.bld.get('accelerator').on > 0) {
        game.bld.get('accelerator').on -= 1;
    }
});

export let steamworks = getBldObj('steamworks', -1);        // If blueprint > 1000, magneto researched and > steamworks + 7
export let magneto = getBldObj('magneto', -1);              // If blueprint > 1000, oil > 0.25/sec, alloy triple
export let smelter = getBldObj('smelter', -1);              // Always
export let calciner = getBldObj('calciner', -1);            // Manual
export let factory = getBldObj('factory', -1);              // If carbon sequestration researched, 4 power available, double plate
export let reactor = getBldObj('reactor', -1);              // Manual
steamworks.conditions.push(resourceCondition.bind(null, 'blueprint', 'fixed', 1000));
steamworks.conditions.push(researchCondition(game.science, 'electricity')); // magneto unlocked
steamworks.conditions.push(() => game.bld.get('magneto').val > (game.bld.get('steamworks').val + 7));
magneto.conditions.push(resourceCondition.bind(null, 'blueprint', 'fixed', 1000));
magneto.conditions.push(() => game.resPool.resourceMap.oil.perTickCached > 0.05);
magneto.conditions.push(priceCondition('magneto', 'alloy', 3));
factory.conditions.push(researchCondition(game.workshop, 'carbonSequestration'));
factory.conditions.push(() => (game.resPool.energyWinterProd - game.resPool.energyCons) >= 4);
factory.conditions.push(() => game.bld.get('factory').on === game.bld.get('factory').val);
factory.conditions.push(priceCondition('factory', 'plate', 2));

export let amphitheatre = getBldObj('amphitheatre', -1);    // Always, except when upgrade available
export let broadcastTower = getBldObj('amphitheatre', -1);  // Always, if unlocked
export let chapel = getBldObj('chapel', -1);                // If ship > 250, manuscripts is 10x
export let temple = getBldObj('temple', -1);                // If gold is full, manuscripts are double, plate is triple
amphitheatre.conditions.push(researchCondition(game.science, 'electronics', true));
broadcastTower.conditions.push(() => game.bld.get('amphitheatre').stage === 1)
chapel.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));
chapel.conditions.push(priceCondition('chapel', 'parchment', 10));
temple.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));
temple.conditions.push(priceCondition('temple', 'manuscript', 2));
temple.conditions.push(priceCondition('temple', 'plate', 3));

export let workshop = getBldObj('workshop', -1);            // Always, priority 1
export let tradepost = getBldObj('tradepost', -1);          // If gold is full
tradepost.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));

export let mint = getBldObj('mint', -1);                    // If gold is full, plate is triple
export let unicornPasture = getBldObj('unicornPasture', -1);
export let brewery = getBldObj('brewery', -1);              
export let ziggurat = getBldObj('ziggurat', -1);            // Manual
mint.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));
mint.conditions.push(priceCondition('mint', 'plate', 3));
mint.after.push(() => { game.bld.get('mint').on = 0; });