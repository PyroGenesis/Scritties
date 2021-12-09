import { hydrofracturer, moonOutpost, planetCracker, researchVessel, sattelite, spaceElevator, sunlifter } from "./space-buildings";

export let spaceBuildHierarchy = [
    [
        planetCracker,
        hydrofracturer,
        moonOutpost
    ],
    [
        sattelite,
    ],
    [
        spaceElevator,
        sunlifter,
        researchVessel
    ],
];