// Example of an init.ts file within a plugin

import { loadStaticHouses } from "./houses.js";

export function init() {
    // Lade die Übersetzungen und exportiere sie
    loadStaticHouses();
}