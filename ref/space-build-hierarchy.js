import { hydrofracturer, moonOutpost, planetCracker, researchVessel, sattelite, spaceElevator, spaceStation, sunlifter } from "./space-buildings";

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
        researchVessel,
        spaceStation,
    ],
];