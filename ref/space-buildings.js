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
export let spaceStation = getSpaceBldObj('Cath', 'spaceStation', -1)        // Always, but low priority and disable automtic ones immediately
sattelite.conditions.push(researchCondition(game.workshop, 'solarSatellites'));
spaceStation.after.push(() => {
    if (game.space.getBuilding('spaceStation').val === 1) {
        game.space.getBuilding('spaceStation').on = 0;
    } else if (game.space.getBuilding('spaceStation').on > 0) {
        game.space.getBuilding('spaceStation').on -= 1;
    }
});

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