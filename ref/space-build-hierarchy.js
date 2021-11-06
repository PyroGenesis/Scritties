import { hydrofracturer, planetCracker, sattelite, spaceElevator } from "./space-buildings";

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
];