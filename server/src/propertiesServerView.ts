import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { PermSetModerator } from '@AthenaServer/systems/permission.js';
import { View_Events_GPProperties } from '@AthenaPlugins/gp-interiors/shared/events.js';

export class PropertiesServerView {
    static init() {
        Athena.systems.messenger.commands.register(
            'openProperties',
            '/openProperties - Open openProperties',
            PermSetModerator,
            PropertiesServerView.open,
        );
    }

    static open(player: alt.Player, ...args: string[]) {
        alt.emitClient(player, View_Events_GPProperties.SC_Open);        
    }

  
}