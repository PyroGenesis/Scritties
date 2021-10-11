import { SCRITTIES_LOG } from "../../config/log";

export let observe = () => {
    let observeBtnQ = $("#observeBtn")
    if (observeBtnQ.length > 0) {
        if (SCRITTIES_LOG.observe) console.log("Observing the sky!");
        observeBtnQ[0].click();
    }
};