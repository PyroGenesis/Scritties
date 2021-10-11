export let resourceToResourceMapping = [
    {
        source: 'catnip',
        result: 'wood',
        cost: 50,
        otherResources: []
    }, {
        source: 'wood',
        result: 'beam',
        cost: 175,
        otherResources: []
    }, {
        source: 'minerals',
        result: 'slab',
        cost: 250,
        otherResources: []
    }, {
        source: 'iron',
        result: 'plate',
        cost: 125,
        otherResources: []
    }, {
        source: 'coal',
        result: 'steel',
        cost: 100,
        otherResources: [
            { resource: 'iron', cost: 100 }
        ]
    }, {
        source: 'titanium',
        result: 'alloy',
        cost: 10,
        otherResources: [
            { resource: 'steel', cost: 75 }
        ]
    }
];