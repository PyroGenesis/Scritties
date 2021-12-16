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
        return () => {
            let price = game.bld.getPrices(bld).find(price => price.name === resource).val * multiplier;
            return resourceCondition(resource, 'fixed', price);
        }
    } else {
        return () => {
            return game.bld.getPrices(bld).every(price => {
                return resourceCondition(price.name, 'fixed', price.val * multiplier);
            });
        }
    }
}

export function researchCondition(discipline, name, negate=false) {
    return () => Boolean(discipline.get(name).researched ^ negate);
}

export function powerCondition(limit) {
    return () => (game.resPool.energyWinterProd - game.resPool.energyCons) >= limit
}

export function turnOffNewTrigger(bld) {
    return () => {
        if (bld.val === 1) {
            bld.on = 0;
        } else if (bld.on > 0) {
            bld.on -= 1;
        }
    }
}