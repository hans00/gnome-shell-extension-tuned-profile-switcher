// gnome-shell-extension-tuned-profile-switcher
// tuned-profile-switcher@hans00.me/extension.js


import * as Main from "resource:///org/gnome/shell/ui/main.js";
import {Extension} from "resource:///org/gnome/shell/extensions/extension.js";

import {TunedProxyAdapter} from "./dbus.js";
import {TunedProfileSwitcherWidget} from "./widget.js";


/**
 * TuneD Profile Switcher extension main class.
 */
export default class TunedProfileSwitcherExtension extends Extension {

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable () {
        console.debug(`[${this.metadata.name}]: enabling`);
        this._tuned = new TunedProxyAdapter();
        this._widget = new TunedProfileSwitcherWidget(this._tuned);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._widget);
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable () {
        console.debug(`[${this.metadata.name}]: disabling`);
        if (this._tuned) {
            this._tuned.destroy();
            this._tuned = null;
        }
        if (this._widget) {
            this._widget.destroy();
            this._widget = null;
        }
    }
}
