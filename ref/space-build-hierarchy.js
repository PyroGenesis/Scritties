import { hydrofracturer, planetCracker, researchVessel, sattelite, spaceElevator } from "./space-buildings";

export let spaceBuildHierarchy = [
    [
        spaceElevator,
    ],
    [
        sattelite,
    ],
    [
        planetCracker,
        hydrofracturer,
    ],
    [
        researchVessel
    ],
];