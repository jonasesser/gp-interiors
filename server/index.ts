import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/gpInteriors';

const PLUGIN_NAME = 'gpInteriors';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
