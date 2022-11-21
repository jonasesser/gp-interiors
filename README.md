# altv-athena-plugin-interior

This Plugin helps you to find an interior including position and ipl informations.
You can use it ingame or for development as interior database.

# Installation

1. Get plugin from gumroad (Yes it's free, but I am happy when I notice that someone is using it.)
   https://shop.my-gp.de
2. Copy Folder gp-interiors to your athena project under src/core/plugins/

# Usage

1. In-Game as administrator

    `/gotointerior [name] - Goto Interior (try /gotointerior Movie Theatre)`

2. In-Code as developer

    ```
    import { GpInteriors, GpInteriors_Category } from '../gpInteriors/gpInteriors';
    ...
     //Get Interiors
    let interior = GpInteriors.getInterior("Movie Theatre");
    let allInteriors = GpInteriors.getInteriors();
    let interiorByCat = GpInteriors.getInteriorsByCategory(GpInteriors_Category.Office);

    //Get Interior names only
    let allInteriorNames = GpInteriors.getInteriorNames();
    let interiorNamesByCat = GpInteriors.getInteriorNamesByCategory(GpInteriors_Category.Office);

    //Get Interior position by name
    let position = GpInteriors.getInteriorPosition(interior.Name);  //returns alt.Vector3
    let ipl = GpInteriors.getInteriorIPL(interior.Name); //returns IPL name to be load or null
    ```

# Categories

-   Store
-   FIB
-   Penthouse
-   Garage
-   CargoShip
-   Warehouse
-   CompanyWarehouse
-   Office - All office interiors
-   Stilthouse
-   Custom - Custom places without IPL, MLO must be loaded seperatly. ATTENTION: If MLO is not loaded -> take a parachute with you.
-   Special - Special places with one postion and several IPLs.
