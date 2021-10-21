import {
    pasture, aqueduct, library, academy, observatory, barn, warehouse, harbor, mine, quarry, lumberMill, smelter, amphitheatre, temple, workshop, tradepost, unicornPasture, ziggurat, hut, logHouse, mansion
} from "./buildings";

export let bldGoals = [
    [
        { ...workshop, limit: -1 },
        { ...lumberMill, limit: -1 },
        { ...mine, limit: -1 },
        { ...quarry, limit: 10 },
        { ...smelter, limit: -1 },
    ],
    [
        { ...hut, limit: -1 },
        { ...logHouse, limit: -1 }
    ],
    [
        { ...tradepost, limit: -1 },
        { ...academy, limit: -1 },
        { ...library, limit: -1 },
        { ...amphitheatre, limit: -1 },
    ],
    [
        // { ...temple, limit: -1 },
        { ...aqueduct, limit: -1 },
    ],
    [
        { ...barn, limit: -1 },
        { ...warehouse, limit: -1 },
        { ...harbor, limit: -1 },
        { ...observatory, limit: -1 },
    ],
    [
        { ...unicornPasture, limit: -1 },
    ]
];