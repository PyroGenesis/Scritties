import { SCRITTIES_LOG } from "./config/log";
import { SCRITTIES_SETTINGS } from "./config/settings";
import { farm } from "./scripts/actions/farm";
import { hunt } from "./scripts/actions/hunt";

SCRITTIES_LOG.farm = true;
SCRITTIES_SETTINGS.farm = true;
let farmInterval = setInterval(farm, 2000);

SCRITTIES_LOG.catpower.hunt = true;
SCRITTIES_SETTINGS.catpower.hunt = true;
SCRITTIES_LOG.catpower.parchment = false;
SCRITTIES_SETTINGS.catpower.parchment = false;
let huntInterval = setInterval(hunt, 5000);
