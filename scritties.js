import { hunt } from "./scripts/actions/hunt";
import { observe } from "./scripts/actions/observe";
import { builder, kittenLimiter } from "./scripts/actions/build";
import { setupCloudSaving } from "./scripts/actions/cloud-save";
import { upgrade } from "./scripts/actions/upgrade";
import { culture } from "./scripts/use-resources/culture";
import { useUpResources } from "./scripts/use-resources/general";
import { gold } from "./scripts/use-resources/gold";
import { minerals } from "./scripts/use-resources/minerals";
import { faith } from "./scripts/use-resources/faith";

let huntInterval = setInterval(hunt, 5000);
let faithInterval = setInterval(faith, 5000);
let observeInterval = setInterval(observe, 2000);

let cultureInterval = setInterval(culture, 5000);
let goldInterval = setInterval(gold, 30*1000, 30*1000);

// jQuery.expr[':'].icontains = function(a, i, m) {
//     return jQuery(a).text().toUpperCase()
//             .indexOf(m[3].toUpperCase()) >= 0;
// };

let useResourcesInterval = setInterval(() => {
    builder();
    minerals();
    useUpResources();
}, 1 * 1000);
let kittenLimiterInterval = setInterval(kittenLimiter, 10 * 1000);

let upgradeInterval = setInterval(upgrade, 2 * 1000);

// let cloudSaveInterval = setupCloudSaving();