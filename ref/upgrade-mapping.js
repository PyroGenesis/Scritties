export let constructionAutoUpgrades = [
    {
        result: 'gear',
        ratio: 0.2,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'steel', cost: 15, limited: true }
        ]
    },
    {
        result: 'concrate',
        ratio: 0.3,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'slab', cost: 2500, limited: true },
            { resource: 'steel', cost: 25, limited: true }
        ]
    },
    {
        result: 'scaffold',
        ratio: 0.5,
        limit: -1,
        instant: true,
        needs: [
            { resource: 'beam', cost: 50, limited: true }
        ]
    },
    {
        result: 'manuscript',
        ratio: 0.5,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'parchment', cost: game.science.getPolicy('tradition').researched ? 20 : 25 , limited: true },
            { resource: 'culture', cost: game.science.getPolicy('tradition').researched ? 300 : 400 , limited: false }
        ]
    },
    {
        result: 'compedium',
        ratio: 0.5,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'manuscript', cost: 50, limited: true },
            { resource: 'science', cost: 10000, limited: false }
        ]
    },
    {
        result: 'blueprint',
        ratio: 0.5,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'compedium', cost: 25, limited: true },
            { resource: 'science', cost: 25000, limited: false }
        ]
    },
    {
        result: 'ship',
        ratio: game.resPool.get('ship').value < 250 ? 1 : 0.5,
        limit: game.resPool.get('ship').value < 250 ? 250 : -1,
        instant: false,
        needs: [
            { resource: 'starchart', cost: 25, limited: true },
            { resource: 'plate', cost: 150, limited: true },
            { resource: 'scaffold', cost: 100, limited: true }
        ]
    },
    {
        result: 'tanker',
        ratio: 0.4, // This will leave atleast 250 ships on first tanker build
        limit: game.resPool.get('ship').value < 250 ? 250 : -1,
        instant: false,
        needs: [
            { resource: 'alloy', cost: 1250, limited: true },
            { resource: 'ship', cost: 200, limited: true },
            { resource: 'blueprint', cost: 5, limited: true }
        ]
    },
    {
        result: 'megalith',
        ratio: 0.1,
        limit: -1,
        instant: false,
        needs: [
            { resource: 'beam', cost: 25, limited: true },
            { resource: 'slab', cost: 50, limited: true },
            { resource: 'plate', cost: 5, limited: true }
        ]
    }
];
