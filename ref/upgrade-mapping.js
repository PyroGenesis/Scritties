export let constructionAutoUpgrades = [
    {
        result: 'gear',
        ratio: 0.2,
        limit: -1,
        needs: [
            { resource: 'steel', cost: 15, limited: true }
        ]
    },
    {
        result: 'concrate',
        ratio: 0.2,
        limit: -1,
        needs: [
            { resource: 'slab', cost: 2500, limited: true },
            { resource: 'steel', cost: 25, limited: true }
        ]
    },
    {
        result: 'scaffold',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'beam', cost: 50, limited: true }
        ]
    },
    {
        result: 'manuscript',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'parchment', cost: game.science.getPolicy('tradition').researched ? 20 : 25 , limited: true },
            { resource: 'culture', cost: game.science.getPolicy('tradition').researched ? 300 : 400 , limited: false }
        ]
    },
    {
        result: 'compedium',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'manuscript', cost: 50, limited: true },
            { resource: 'science', cost: 10000, limited: false }
        ]
    },
    {
        result: 'blueprint',
        ratio: 0.5,
        limit: -1,
        needs: [
            { resource: 'compedium', cost: 25, limited: true },
            { resource: 'science', cost: 25000, limited: false }
        ]
    },
    {
        result: 'ship',
        ratio: 1,
        limit: 250,
        needs: [
            { resource: 'starchart', cost: 25, limited: true },
            { resource: 'plate', cost: 150, limited: true },
            { resource: 'scaffold', cost: 100, limited: true }
        ]
    },
    {
        result: 'megalith',
        ratio: 0.1,
        limit: -1,
        needs: [
            { resource: 'beam', cost: 25, limited: true },
            { resource: 'slab', cost: 50, limited: true },
            { resource: 'plate', cost: 5, limited: true }
        ]
    }
];

// ship priority shift
if (game.resPool.get('ship').value >= 250) {
    let shipUpgradeIdx = constructionAutoUpgrades.findIndex(upgrade => upgrade.result === 'ship');
    if (shipUpgradeIdx > -1) {
        constructionAutoUpgrades[shipUpgradeIdx].ratio = 0.5
        constructionAutoUpgrades[shipUpgradeIdx].limit = -1
    }
}