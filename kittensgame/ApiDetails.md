# Resources
## Direct Access
Syntax: `game.resPool.resourceMap.resourceName`  
Example: `game.resPool.resourceMap.manpower`

## Indirect Access
Syntax: `game.resPool.get(resourceName)`  
Example: `game.resPool.get('parchment')`

## Returned object
```
{
    "name": "manpower",         // internal name
    "title": "catpower",        // display name
    "type": "common",
    "visible": true,
    "transient": true,
    "color": "#DBA901",
    "calculatePerTick": true,
    "value": 1325,              // Current value
    "unlocked": true,
    "maxValue": 1325,
    "perTickCached": 0.480309,  // Change per tick
    "isHidden": false
}
```

# Craftables
## Indirect Access
Syntax: `gamePage.workshop.getCraft(resourceName)`  
Example: `gamePage.workshop.getCraft('parchment')`

## Returned object
```
{
    "name": "parchment",
    "label": "Parchment",
    "description": "A material for writing on made from animal skin, required for cultural buildings.",
    "prices": [
        {
            "name": "furs",
            "val": 175
        }
    ],
    "progressHandicap": 1,
    "tier": 1,
    "unlocked": true,
    "value": 0,
    "progress": 0,
    "isLimited": false
}
```

# Village
#### Hunt All
`game.village.huntAll()`

