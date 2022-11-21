import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { GpInteriors } from './src/gpInteriors';

const PLUGIN_NAME = 'gpInteriors';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    GpInteriors.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
