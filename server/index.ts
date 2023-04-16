import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { GpInteriors } from './src/gpInteriors';

const PLUGIN_NAME = 'gpInteriors';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    GpInteriors.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
