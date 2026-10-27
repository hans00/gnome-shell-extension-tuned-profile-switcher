// gnome-shell-extension-tuned-profile-switcher
// tuned-profile-switcher@hans00.me/widget.js


import GObject from "gi://GObject";
import St from "gi://St";

import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";
import {QuickMenuToggle, SystemIndicator} from "resource:///org/gnome/shell/ui/quickSettings.js";
import {gettext as _} from "resource:///org/gnome/shell/extensions/extension.js";

import * as Constants from "./constants.js";
import {fallbackIconName, formatProfileName, profileIconName} from "./profiles.js";


/**
 * TuneD Profile Switcher quick settings toggle.
 *
 * Toggle itself switches TuneD auto profile selection,
 * menu lists TuneD profiles.
 */
const TunedProfileSwitcherToggle = GObject.registerClass(
    class TunedProfileSwitcherToggle extends QuickMenuToggle {

        /**
         * Toggle constructor.
         *
         * @param {TunedProxyAdapter} tuned. TuneD DBus proxy adapter instance.
         */
        _init (tuned) {

            super._init({
                "title": "TuneD",
                "iconName": fallbackIconName,
                "toggleMode": false
            });
            this._tuned = tuned;
            this._profilesMenuItems = new Map();

            // toggle clicked: switch auto profile selection
            this.connect(
                "clicked",
                () => {
                    if (this.checked) {
                        this._tuned.switchProfile(this._tuned.activeProfile);
                    } else {
                        this._tuned.autoProfile();
                    }
                    this._sync();
                }
            );

            // populate menu with profiles menu items
            this.menu.setHeader(fallbackIconName, "TuneD");
            this._profilesSection = new PopupMenu.PopupMenuSection();
            this.menu.addMenuItem(this._profilesSection);
            // profiles list can be long, so move it to the scrollable area
            this._profilesScrollView = new St.ScrollView({
                "style": "max-height: 20em;",
                "hscrollbar_policy": St.PolicyType.NEVER,
                "vscrollbar_policy": St.PolicyType.AUTOMATIC,
                "overlay_scrollbars": true
            });
            this.menu.box.remove_child(this._profilesSection.actor);
            this._profilesScrollView.child = this._profilesSection.actor;
            this.menu.box.add_child(this._profilesScrollView);
            for (let profile of this._tuned.profiles) {
                let iconName = profileIconName(profile),
                    profileMenuItem = new PopupMenu.PopupMenuItem(formatProfileName(profile));
                // unknown performance level gets invisible icon to keep labels aligned
                profileMenuItem.insert_child_below(
                    new St.Icon({
                        "style_class": "popup-menu-icon",
                        "icon_name": iconName ?? fallbackIconName,
                        "opacity": iconName === null ? 0 : 255
                    }),
                    profileMenuItem.label
                );
                profileMenuItem.connect(
                    "activate",
                    () => {
                        this._tuned.switchProfile(profile);
                        this._sync();
                    }
                );
                this._profilesMenuItems.set(profile, profileMenuItem);
                this._profilesSection.addMenuItem(profileMenuItem);
            }

            // connect DBus event listener
            this._tuned.connectSignal(
                Constants.tunedProfileChangedSignalName,
                () => {
                    this._sync();
                }
            );

            this._sync();

        }

        /**
         * Sync toggle and menu state with TuneD.
         */
        _sync () {
            let {activeProfile, mode} = this._tuned,
                auto = mode === Constants.tunedModeAuto,
                iconName = profileIconName(activeProfile) ?? fallbackIconName,
                subtitle = activeProfile === null
                    ? _("Unknown")
                    : formatProfileName(activeProfile);

            this.visible = mode !== null;
            this.checked = auto;
            this.subtitle = subtitle;
            this.iconName = iconName;
            this.menu.setHeader(
                iconName,
                "TuneD",
                auto
                    ? `${subtitle} (${_("Auto select profile")})`
                    : subtitle
            );
            for (let [profile, item] of this._profilesMenuItems) {
                item.setOrnament(
                    profile === activeProfile
                        ? PopupMenu.Ornament.CHECK
                        : PopupMenu.Ornament.NONE
                );
            }
        }
});


/**
 * TuneD Profile Switcher widget main class.
 *
 * Holds TuneD quick settings toggle.
 */
export const TunedProfileSwitcherWidget = GObject.registerClass(
    class TunedProfileSwitcherWidget extends SystemIndicator {

        /**
         * Widget constructor.
         *
         * @param {TunedProxyAdapter} tuned. TuneD DBus proxy adapter instance.
         */
        _init (tuned) {
            super._init();
            this.quickSettingsItems.push(new TunedProfileSwitcherToggle(tuned));
        }

        /*
         * Widget destructor.
         */
        destroy () {
            this.quickSettingsItems.forEach(item => item.destroy());
            this.quickSettingsItems = [];
            super.destroy();
        }
});
