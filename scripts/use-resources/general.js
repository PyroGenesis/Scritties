import { SCRITTIES_LOG } from "../../config/log";
import { resourceToResourceMapping } from "../../ref/res-to-res";
import { toFixed } from "../utility/utility";

export let useUpResources = () => {
    for (let res_to_res of resourceToResourceMapping) {
        let src_obj = game.resPool.get(res_to_res.source)
        if (!src_obj.unlocked || !game.resPool.get(res_to_res.result).unlocked) continue;

        if (src_obj.value >= src_obj.maxValue) {
            let default_percent_consumption = 0.05;
            let percent_res_per_sec = toFixed((src_obj.perTickCached*5) / game.resPool.resourceMap.wood.maxValue, 2);
            let percent_consumption = Math.min(Math.max(default_percent_consumption, percent_res_per_sec), 1)   // bounded by 1 = 100%

            let craft_num = Math.max(1, Math.trunc((src_obj.maxValue * percent_consumption) / res_to_res.cost))
            let craft_num_by_other_resources = Infinity;
            for (let other_resource of res_to_res.otherResources) {
                craft_num_by_other_resources = Math.min(
                    craft_num_by_other_resources,
                    Math.trunc(game.resPool.get(other_resource.resource).value / other_resource.cost)
                );
            }
            craft_num = Math.min(craft_num, craft_num_by_other_resources);
            if (craft_num === 0) continue;

            if (SCRITTIES_LOG.crafting.capPrevention) {
                let log_text = `Converting ${craft_num * res_to_res.cost} ${res_to_res.source}`
                if (res_to_res.otherResources.length > 0) {
                    log_text += ' (+ ';
                    log_text += res_to_res.otherResources.map((other_resource) => `${craft_num * other_resource.cost} ${other_resource.resource}`).join(', ');
                    log_text += ')'
                }
                log_text += ` to ${craft_num} ${res_to_res.result}`
                console.log(log_text);
            }
            game.craft(res_to_res.result, craft_num);
        }
    }
};
