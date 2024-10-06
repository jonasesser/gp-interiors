
import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { PropertiesView } from './src/propertiesView.js';

alt.onceServer(SYSTEM_EVENTS.TICKS_START, PropertiesView.init);
alt.log(`~ly~Plugin Loaded -- gpInteriors`);
