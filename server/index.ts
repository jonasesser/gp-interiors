import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { GpInteriors } from './src/gpInteriors.js';
import { PropertiesServerView } from './src/propertiesServerView.js';

const PLUGIN_NAME = 'gpInteriors';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    GpInteriors.init();
    PropertiesServerView.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
