import ViewModel from '@AthenaClient/models/viewModel.js';
import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { View_Events_GPProperties } from '@AthenaPlugins/gp-interiors/shared/events.js';

const PAGE_NAME = View_Events_GPProperties.PAGE_NAME;
let controlActive = false;

export class PropertiesView implements ViewModel {
    
    static init() {
        //Import Shop App Events
        alt.onServer(View_Events_GPProperties.SC_Open, PropertiesView.open);        
    }

    static async open(): Promise<void> {     
        // AthenaClient.webview.on(View_Events_GPTablet.CmdStartEngine, GPTabletView.CommandStartEngine);
        AthenaClient.webview.on(View_Events_GPProperties.VC_ActivateControl, PropertiesView.toggleControl);
        AthenaClient.webview.openPages(PAGE_NAME, true, PropertiesView.close);
        AthenaClient.webview.ready(PAGE_NAME, PropertiesView.ready);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static ready() {}

    static close() {
        alt.Player.local.isMenuOpen = false;
        alt.toggleGameControls(true);
        AthenaClient.webview.closePages([PAGE_NAME]);
        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
    }

    static toggleControl(status: boolean = false) {
        if(status) {
            controlActive = true;
        } else {
            controlActive = !controlActive;
        }
        alt.toggleGameControls(controlActive);
    }

}