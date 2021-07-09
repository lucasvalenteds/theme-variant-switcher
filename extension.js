const Style = imports.gi.St;
const GObject = imports.gi.GObject;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const GETTEXT_DOMAIN = 'my-indicator-extension';
const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

class ThemeVariantIndicator extends PanelMenu.Button {

    _init() {
	super._init(0.0, _("indicator-name"));

	this.add_child(new Style.Icon({
	    icon_name: 'face-smile-symbolic',
	    style_class: 'system-status-icon',
	}));

	const darkThemeItem = new PopupMenu.PopupMenuItem(_("indicator-menu-item-label-dark"));
	darkThemeItem.connect("activate", this.change);
	this.menu.addMenuItem(darkThemeItem);

	const lightThemeItem = new PopupMenu.PopupMenuItem(_("indicator-menu-item-label-light"));
	lightThemeItem.connect("activate", this.change);
	this.menu.addMenuItem(lightThemeItem);
    }

    change() {
    }
}

const ExtensionIndicator = GObject.registerClass(ThemeVariantIndicator);
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {

    constructor(currentExtension) {
	this.uuid = currentExtension.meta.uuid;
	ExtensionUtils.initTranslations(this.uuid);
    }

    enable() {
	this.indicator = new ExtensionIndicator();
	Main.panel.addToStatusArea(this.uuid, this.indicator);
    }

    disable() {
	this.indicator.destroy();
	this.indicator = null;
    }
}

function init() {
    return new Extension(ExtensionUtils.getCurrentExtension());
}

