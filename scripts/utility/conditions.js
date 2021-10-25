export function resourceCondition(resource, condType, value) {
    let currVal = game.resPool.get(resource).value
    let maxVal = game.resPool.get(resource).maxValue
    switch(condType) {
        case 'fixed':
            return currVal >= value
        case 'fraction':
            return (currVal / maxVal) >= value
    }
}

export function priceCondition(bld, resource, multiplier) {
    if (resource !== 'all') {
        let price = game.bld.getPrices(bld).find(price => price.name === resource).val * multiplier;
        return resourceCondition.bind(null, resource, 'fixed', price);
    } else {
        return () => {
            return game.bld.getPrices(bld).every(price => {
                resourceCondition(price.name, 'fixed', price.val * multiplier);
            });
        }
    }
}