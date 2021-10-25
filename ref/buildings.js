import { SCRITTIES_SETTINGS } from '../config/settings';
import { resourceCondition } from '../scripts/utility/conditions';

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
export let aqueduct = getBldObj('aqueduct', -1);            // If mineral full
aqueduct.conditions.push(resourceCondition.bind(null, 'minerals', 'fraction', 1));

export let hut = getBldObj('hut', -1);                      // Upto kitten limit
export let logHouse = getBldObj('logHouse', -1);            // Upto kitten limit
export let mansion = getBldObj('mansion', -1);              // Upto kitten limit, if titanium is full
hut.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
logHouse.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
mansion.conditions.push(() => game.village.maxKittens < SCRITTIES_SETTINGS.kittenLimit);
mansion.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));

export let library = getBldObj('library', -1);          
export let academy = getBldObj('academy', -1);              // If science is full
export let observatory = getBldObj('observatory', -1);      // If science, iron is full, if ships = 250
export let biolab = getBldObj('biolab', -1);                // No, reserve alloy
academy.conditions.push(resourceCondition.bind(null, 'science', 'fraction', 1));
observatory.conditions.push(resourceCondition.bind(null, 'science', 'fraction', 1));
observatory.conditions.push(resourceCondition.bind(null, 'iron', 'fraction', 1));
observatory.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));

export let barn = getBldObj('barn', -1);                    // Always at end
export let warehouse = getBldObj('warehouse', -1);          // Always at end
export let harbor = getBldObj('harbor', -1);                // Always at end

export let mine = getBldObj('mine', -1);                    // Always
export let quarry = getBldObj('quarry', -1);                // If ships = 250, double resources available
export let lumberMill = getBldObj('lumberMill', -1);        // Always
export let oilWell = getBldObj('oilWell', -1);              // If ships = 250
export let accelerator = getBldObj('accelerator', -1);      // If titanium full, turn on/off upto current
quarry.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));
game.bld.getPrices('quarry').forEach(price => {
    quarry.conditions.push(resourceCondition.bind(null, price.name, 'fixed', price.val * 2));
});
oilWell.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));
accelerator.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));
accelerator.after.push(() => {
    if (game.bld.get('accelerator').on > 0) {
        game.bld.get('accelerator').on -= 1;
    }
});

export let steamworks = getBldObj('steamworks', -1);        // If blueprint > 1000, magneto researched and > steamworks + 7
export let magneto = getBldObj('magneto', -1);              // If blueprint > 1000, oil > 0.25/sec, alloy doubled
export let smelter = getBldObj('smelter', -1);              // Always
export let calciner = getBldObj('calciner', -1);            // Manual
export let factory = getBldObj('factory', -1);              // Manual
export let reactor = getBldObj('reactor', -1);              // Manual
steamworks.conditions.push(resourceCondition.bind(null, 'blueprint', 'fixed', 1000));
steamworks.conditions.push(() => game.bld.get('magneto').unlocked);
steamworks.conditions.push(() => game.bld.get('magneto').val > (game.bld.get('steamworks').val + 7));
magneto.conditions.push(resourceCondition.bind(null, 'blueprint', 'fixed', 1000));
magneto.conditions.push(() => game.resPool.resourceMap.oil.perTickCached > 0.05);
magneto.conditions.push(resourceCondition.bind(null, 'alloy', 'fixed', game.bld.getPrices('magneto').find(price => price.name === 'alloy').val * 2));

export let amphitheatre = getBldObj('amphitheatre', -1);    // Always?
export let chapel = getBldObj('chapel', -1);                // Manual
export let temple = getBldObj('temple', -1);                // If gold is full
temple.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));
chapel.conditions.push(resourceCondition.bind(null, 'ship', 'fixed', 250));

export let workshop = getBldObj('workshop', -1);            // Always, priority 1
export let tradepost = getBldObj('tradepost', -1);          // If gold is full
tradepost.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));

export let mint = getBldObj('mint', -1);                    // If gold is full
export let unicornPasture = getBldObj('unicornPasture', -1);
export let brewery = getBldObj('brewery', -1);              
export let ziggurat = getBldObj('ziggurat', -1);            // Manual
mint.conditions.push(resourceCondition.bind(null, 'gold', 'fraction', 1));
mint.after.push(() => { game.bld.get('mint').on = 0; });