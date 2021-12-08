import { hydrofracturer, planetCracker, researchVessel, sattelite, spaceElevator } from "./space-buildings";

export let spaceBuildHierarchy = [
    [
        planetCracker,
        hydrofracturer,
    ],
    [
        sattelite,
    ],
    [
        spaceElevator,
    ],
    [
        researchVessel
    ],
];