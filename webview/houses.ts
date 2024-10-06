
// Funktion zum Laden von JSON-Dateien über HTTP
async function loadJsonFile(_path) {
  
    let path = _path;
    
    if (!('alt' in window)) {
        path = _path.replace('http://assets/gp-assets/', 'http://localhost:3000/plugins/testdata/');
    }

    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return response.json();
   
}

async function loadStaticHouses() {
   return await loadJsonFile('http://assets/gp-assets/gp-interiors/gp_houses.json');
}

// Lade die Übersetzungen und exportiere sie
export const staticHouseData = await loadStaticHouses();
