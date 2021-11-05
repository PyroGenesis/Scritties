import { priceCondition, resourceCondition } from '../scripts/utility/conditions';

let getSpaceBldObj = (planetName, buildingName, limit, /*extraPropsFn,*/ conditions = [], after = []) => {
    // extraPropsFn = extraPropsFn || function() { return {} };
    return {
        name: buildingName,
        get bldObj() { return game.spaceTab.planetPanels.find(pp => pp.name === planetName).children.find(up => up.id === buildingName) },
        limit: limit,
        conditions: conditions,
        after: after,
        // ...extraPropsFn()
    }
}

export let spaceElevator = getSpaceBldObj('Cath', 'spaceElevator', -1)  // Always?
export let sattelite = getSpaceBldObj('Cath', 'sattelite', -1)          // Always, if Solar Satellites is researched
sattelite.conditions.push(() => game.workshop.get('solarSatellites').researched);

// aqueduct.conditions.push(resourceCondition.bind(null, 'minerals', 'fraction', 1));
// solarFarm.conditions.push(() => game.bld.get('pasture').stage === 1)
// solarFarm.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));