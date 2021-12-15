# altv-athena-plugin-interior
GotoInterior Command for Athena Framework

# Installation

1. Copy Folder plugins/gpInteriors/ to your athena project under src/core/plugins/
2. Import server plugin in src/core/plugins/imports.ts:

    ```import './gpInteriors/index';```


# Usage

1. In-Game as administrator

    ```/gotointerior [name] - Goto Interior (try /gotointerior Movie Theatre)```

2. In-Code as developer

    ```
    import { GpInteriors, GpInteriors_Category } from '../gpInteriors/gpInteriors';
    ...
    let allInteriorNames = GpInteriors.getInteriors();
    let interiorNamesByCat = GpInteriors.getInteriorsByCategory(GpInteriors_Category.Office);
    position = GpInteriors.getInteriorPosition(interiorNamesByCat[0]);  //returns alt.Vector3
    let ipl = GpInteriors.getInteriorIPL(interiorNamesByCat[0]); //returns IPL name to be load or null
    ```

# Categories

- Store
- FIB
- Penthouse
- Garage
- CargoShip
- Warehouse
- CompanyWarehouse
- Office - All office interiors
- Stilthouse
- Custom - Custom places without IPL, MLO must be loaded seperatly. ATTENTION: If MLO is not loaded -> take a parachute with you.
- Special - Special places with one postion and several IPLs.