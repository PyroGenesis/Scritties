import {
    pasture, aqueduct, library, academy, observatory, barn, warehouse, harbor, mine, quarry, lumberMill, smelter, amphitheatre, temple, workshop, tradepost, unicornPasture, ziggurat, hut, logHouse, mansion, oilWell, accelerator, steamworks, magneto, mint, chapel, factory, solarFarm, broadcastTower, biolab, hydroPlant, dataCenter
} from "./cath-buildings";

export let cathBuildHierarchy = [
    [
        workshop,
        lumberMill,
        mine,
        smelter,

        // Conditions restrict
        factory,
        aqueduct,
        tradepost,
        solarFarm,
        hydroPlant,
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
        dataCenter,
    ],
    [
        accelerator,
        temple,
        chapel,
        // steamworks,
        // magneto
    ],
    [
        mint,

        barn,
        warehouse,
        harbor,

        oilWell,
        quarry,
        biolab,
    ]
];