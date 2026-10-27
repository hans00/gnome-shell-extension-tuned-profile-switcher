// gnome-shell-extension-tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/dbus.js


import Gio from "gi://Gio";

import * as Constants from "./constants.js";


const TunedDBusProxy = Gio.DBusProxy.makeProxyWrapper(Constants.tunedInterface);


/**
 * TuneD DBus proxy adapter.
 */
export class TunedProxyAdapter {

    /**
     * Adapter constructor.
     *
     * Creates DBus proxy instance.
     */
    constructor () {
        this._signals = [];
        try {
            this._tunedProxy = new TunedDBusProxy(
                Gio.DBus.system,
                Constants.tunedDBusName,
                Constants.tunedDBusPath
            );
        } catch (error) {
            this._tunedProxy = null;
            console.error(`[${Constants.extensionName}]: error. ${error}`);
        }
    }

    destroy() {
        if (this._tunedProxy) {
            for (let signal of this._signals) {
                this._tunedProxy.disconnectSignal(signal);
            }
            this._signals = [];
            this._tunedProxy = null;
        }
    }

    /**
     * Get TuneD active profile.
     *
     * @return {String|null}. TuneD active profile.
     */
    get activeProfile () {
        try {
            return this._tunedProxy.active_profileSync().toString();
        } catch (error) {
            console.error(`[${Constants.extensionName}]: error. ${error}`);
            return null;
        }

    }

    /**
     * Detect TuneD mode.
     *
     * @return {String|null}. TuneD mode name ["auto", "manual"].
     */
    get mode () {
        try {
            return this._tunedProxy.profile_modeSync()
                .toString()
                .split(",")[0];
        } catch (error) {
            console.error(`[${Constants.extensionName}]: error. ${error}`);
            return null;
        }
    }

    /**
     * Get TuneD profiles.
     *
     * @return {Array}. TuneD profiles list.
     */
    get profiles () {
        try {
            return this._tunedProxy.profilesSync()
                .toString()
                .split(",");
        } catch (error) {
            console.error(`[${Constants.extensionName}]: error. ${error}`);
            return [];
        }
    }

    /**
     * Set TuneD profile automatically.
     */
    autoProfile () {
        try {
            this._tunedProxy.auto_profileSync();
        } catch (error) {
            console.error(`[${Constants.extensionName}]: error. ${error}`);
        }
    }

    /**
     * Set TuneD profile.
     *
     * @param {String} profile. TuneD profile name.
     */
    switchProfile (profile) {
        try {
            this._tunedProxy.switch_profileSync(profile);
        } catch (error) {
            console.error(`[${Constants.extensionName}]: error. ${error}`);
        }
    }

    /**
     * Connect listener to DBus signal.
     *
     * @param {String} signal. Signal name to listen to.
     * @param {function} listener. Signal handler function.
     */
    connectSignal (signal, listener) {
        if (!this._tunedProxy) {
            return;
        }
        this._signals.push(this._tunedProxy.connectSignal(
            signal,
            (proxy, nameOwner, args) => {

                listener(
                    proxy,
                    nameOwner,
                    args
                );

            }
        ));
    }
}
