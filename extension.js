const ExtensionUtils = imports.misc.extensionUtils;
const GObject = imports.gi.GObject;
const GetText = imports.gettext;
const Style = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

class ThemeVariantIndicator extends PanelMenu.Button {

    constructor(i18n) {
	this.i18n = i18n;
    }

    _init(i18n) {
	super._init(0.0, i18n.getText("indicator-name"));

	this.i18n = i18n;
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

class I18n {

    constructor(domain) {
	this.domain = GetText.domain(domain);
    }

    getText(key) {
	return this.domain.gettext(key);
    }
}

const ExtensionIndicator = GObject.registerClass(ThemeVariantIndicator);

class Extension {

    constructor(extension) {
	this.domain = extension.metadata.uuid;
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

