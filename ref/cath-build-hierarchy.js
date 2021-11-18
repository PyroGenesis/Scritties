import {
    pasture, aqueduct, library, academy, observatory, barn, warehouse, harbor, mine, quarry, lumberMill, smelter, amphitheatre, temple, workshop, tradepost, unicornPasture, ziggurat, hut, logHouse, mansion, oilWell, accelerator, steamworks, magneto, mint, chapel, factory, solarFarm, broadcastTower, biolab
} from "./cath-buildings";

export let cathBuildHierarchy = [
    [
        workshop,
        lumberMill,
        mine,
        smelter,

        // Conditions restrict
        aqueduct,
        tradepost,
        mint,
        solarFarm,
    ],
    [
        hut,
        logHouse,
        mansion
    ],
    [
        library,
        academy,
        observatory,
        amphitheatre,
        broadcastTower,
    ],
    [
        accelerator,
        temple,
        chapel,
        // steamworks,
        // magneto
    ],
    [
        factory,

        barn,
        warehouse,
        harbor,

        oilWell,
        quarry,
        biolab,
    ]
];