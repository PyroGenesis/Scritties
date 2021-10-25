import {
    pasture, aqueduct, library, academy, observatory, barn, warehouse, harbor, mine, quarry, lumberMill, smelter, amphitheatre, temple, workshop, tradepost, unicornPasture, ziggurat, hut, logHouse, mansion, oilWell, accelerator, steamworks, magneto, mint
} from "./buildings";

export let bldGoals = [
    [
        workshop,
        lumberMill,
        mine,
        smelter,

        // Conditions restrict
        aqueduct,
        tradepost,
        temple,
        mint,
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
    ],
    [
        accelerator,
        // steamworks,
        // magneto
    ],
    [
        barn,
        warehouse,
        harbor,
        quarry,
        oilWell,
    ]
];