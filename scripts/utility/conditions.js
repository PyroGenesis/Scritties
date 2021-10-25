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