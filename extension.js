const Style = imports.gi.St;
const GObject = imports.gi.GObject;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

class ThemeVariantIndicator extends PanelMenu.Button {

    constructor(i18n) {
	this.i18n = i18n;
    }

    _init() {
	super._init(0.0, this.i18n.getText("indicator-name"));

	this.add_child(this.createIcon());
	this.menu.addMenuItem(this.createMenuItemDark());
	this.menu.addMenuItem(this.createMenuItemLight());
    }

    createIcon() {
	return new Style.Icon({
	    icon_name: "face-smile-symbolic",
	    style_class: "system-status-icon",
	});
    }

    createMenuItemDark() {
	const label = this.i18n.getText("indicator-menu-item-label-dark")
	const item = new PopupMenu.PopupMenuItem(label);
	item.connect("activate", this.change);
	return item;
    }

    createMenuItemLight() {
	const label = this.i18n.getText("indicator-menu-item-label-light")
	const item = new PopupMenu.PopupMenuItem(label);
	item.connect("activate", this.change);
	return item;
    }

    change() {
    }
}

const ExtensionGetText = imports.gettext;

class I18n {

    constructor(domain) {
	this.domain= ExtensionGetText.domain(domain);
    }

    getText(key) {
	return this.domain.gettext(key);
    }
}

const ExtensionIndicator = GObject.registerClass(ThemeVariantIndicator);
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {

    constructor(extension) {
	this.domain = extension.meta.uuid;
	ExtensionUtils.initTranslations(this.domain);
    }

    enable() {
	this.i18n = new I18n(this.domain);
	this.indicator = new ExtensionIndicator(this.i18n);

	Main.panel.addToStatusArea(this.domain, this.indicator);
    }

    disable() {
	this.indicator.destroy();
	this.indicator = null;
	this.i18n = null;
    }
}

function init() {
    return new Extension(ExtensionUtils.getCurrentExtension());
}

