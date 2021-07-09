const ExtensionUtils = imports.misc.extensionUtils;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const GetText = imports.gettext;
const Style = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

class AdwaitaThemeVariantManager {

    useDark() {
	this.useThemeVariant("Adwaita-dark");
    }

    useLight() {
	this.useThemeVariant("Adwaita");
    }

    useThemeVariant(variant) {
	this.setGSettingProperty("org.gnome.desktop.interface", "gtk-theme", variant);
	this.setGSettingProperty("org.gnome.shell.extensions.user-theme", "name", variant);
    }

    setGSettingProperty(schema, key, value) {
	GLib.spawn_command_line_sync(`gsettings set ${schema} ${key} ${value}`);
    }
}

class ThemeVariantResources {

    constructor(domain) {
	this.domain = GetText.domain(domain);
    }

    getValue(key) {
	return this.domain.gettext(key);
    }
}

class ThemeVariantIndicator extends PanelMenu.Button {

    constructor(resources, manager) {
	this.resources = resources;
	this.manager = manager;
    }

    _init(resources, manager) {
	super._init(0.0, resources.getValue("indicator-name"));

	this.resources = resources;
	this.manager = manager;
	this.add_child(this.createIcon());
	this.menu.addMenuItem(this.createMenuItemDark());
	this.menu.addMenuItem(this.createMenuItemLight());
    }

    createIcon() {
	return new Style.Icon({
	    icon_name: "weather-clear-symbolic",
	    style_class: "system-status-icon",
	});
    }

    createMenuItemDark() {
	const label = this.resources.getValue("indicator-menu-item-label-dark")
	const item = new PopupMenu.PopupMenuItem(label);
	item.connect("activate", () => this.manager.useDark());
	return item;
    }

    createMenuItemLight() {
	const label = this.resources.getValue("indicator-menu-item-label-light")
	const item = new PopupMenu.PopupMenuItem(label);
	item.connect("activate", () => this.manager.useLight());
	return item;
    }
}

const ThemeVariantIndicatorClass = GObject.registerClass(ThemeVariantIndicator);

class ThemeVariantExtension {

    constructor(extension) {
	this.domain = extension.metadata.uuid;
	ExtensionUtils.initTranslations(this.domain);
    }

    enable() {
	this.resources = new ThemeVariantResources(this.domain);
	this.manager = new AdwaitaThemeVariantManager();
	this.indicator = new ThemeVariantIndicatorClass(this.resources, this.manager);

	Main.panel.addToStatusArea(this.domain, this.indicator);
    }

    disable() {
	this.indicator.destroy();
	this.indicator = null;
	this.resources = null;
	this.manager = null;
    }
}

function init() {
    return new ThemeVariantExtension(ExtensionUtils.getCurrentExtension());
}

