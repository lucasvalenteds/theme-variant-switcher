const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const getText = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
	_init() {
	    super._init(0.0, getText('My Shiny Indicator'));

	    this.add_child(new St.Icon({
		icon_name: 'face-smile-symbolic',
		style_class: 'system-status-icon',
	    }));

	    let item = new PopupMenu.PopupMenuItem(getText('Show Notification'));
	    item.connect('activate', () => {
		Main.notify(getText('Whatʼs up, folks?!!!!'));
	    });
	    this.menu.addMenuItem(item);
	}
    }
);

class Extension {
    constructor(uuid) {
	this._uuid = uuid;

	ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
	this._indicator = new Indicator();
	Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
	this._indicator.destroy();
	this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
