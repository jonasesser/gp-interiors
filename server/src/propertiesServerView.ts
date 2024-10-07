import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { PermSetModerator, PermSetUser } from '@AthenaServer/systems/permission.js';
import { View_Events_GPProperties } from '@AthenaPlugins/gp-interiors/shared/events.js';
import { Properity } from '@AthenaPlugins/gp-interiors/shared/interfaces.js';
import { WebhookSystem } from '@AthenaPlugins/webhook/server/src/webhookSystem.js';



export class PropertiesServerView {
    static init() {
        Athena.systems.messenger.commands.register(
            'openProperties',
            '/openProperties - Open openProperties',
            PermSetUser,
            PropertiesServerView.open,
        );

        alt.onClient(View_Events_GPProperties.SV_JumpToProperty, PropertiesServerView.jumpToProperty);
        alt.onClient(View_Events_GPProperties.VS_UpdateDoorPosition, PropertiesServerView.updateDoorPosition);
    }

    static open(player: alt.Player, ...args: string[]) {
        alt.emitClient(player, View_Events_GPProperties.SC_Open);        
    }

    static jumpToProperty(player: alt.Player, property: Properity) {
        const targetPosition = new alt.Vector3(property.outside.x, property.outside.y, property.outside.z);
        player.pos = targetPosition;
    }

    static async updateDoorPosition(player: alt.Player, property: Properity) {
       const newPosition = player.pos;

       const playerData = await Athena.document.character.get(player);
       WebhookSystem.sendMessage(`Player ${playerData.name} reported, New Door Position for ${property.name}:` + JSON.stringify(newPosition), 'reportEventHook');
    }
  
}