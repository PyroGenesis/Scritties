import { powerCondition, priceCondition, researchCondition, resourceCondition } from '../scripts/utility/conditions';

let getSpaceBldObj = (planetName, buildingName, limit, /*extraPropsFn,*/ conditions = [], after = []) => {
    // extraPropsFn = extraPropsFn || function() { return {} };
    return {
        name: buildingName,
        get bldObj() { 
            if (!game.spaceTab.planetPanels) return null;
            
            let planet = game.spaceTab.planetPanels.find(pp => pp.name === planetName);
            if (!planet) return planet;

            return planet.children.find(up => up.id === buildingName)
        },
        limit: limit,
        conditions: conditions,
        after: after,
        // ...extraPropsFn()
    }
}

// Cath
export let spaceElevator = getSpaceBldObj('Cath', 'spaceElevator', -1)      // Always, but low priority
export let sattelite = getSpaceBldObj('Cath', 'sattelite', -1)              // Always, if Solar Satellites is researched
sattelite.conditions.push(researchCondition(game.workshop, 'solarSatellites'));

// Redmoon
export let moonOutpost = getSpaceBldObj('Redmoon', 'moonOutpost', 0)        // Disabled by default, if enough power+1
moonOutpost.conditions.push(powerCondition(6))

// Dune
export let planetCracker = getSpaceBldObj('Dune', 'planetCracker', -1)      // Always
export let hydrofracturer = getSpaceBldObj('Dune', 'hydrofracturer', -1)    // Always

// Piscine
export let researchVessel = getSpaceBldObj('Piscine', 'researchVessel', -1) // Always

// Helios
export let sunlifter = getSpaceBldObj('Helios', 'sunlifter', -1)            // Always

// aqueduct.conditions.push(resourceCondition.bind(null, 'minerals', 'fraction', 1));
// solarFarm.conditions.push(() => game.bld.get('pasture').stage === 1)
// solarFarm.conditions.push(resourceCondition.bind(null, 'titanium', 'fraction', 1));