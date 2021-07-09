const ExtensionUtils = imports.misc.extensionUtils;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Style = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

class AdwaitaThemeVariantManager {

    getThemeName() {
	return "Adwaita";
    }

    useDark() {
	this.useThemeVariant(this.getThemeName() + "-dark");
    }

    useLight() {
	this.useThemeVariant(this.getThemeName());
    }

    useThemeVariant(variant) {
	this.setGSettingProperty("org.gnome.desktop.interface", "gtk-theme", variant);
	this.setGSettingProperty("org.gnome.shell.extensions.user-theme", "name", variant);
    }

    setGSettingProperty(schema, key, value) {
	GLib.spawn_command_line_sync(`gsettings set ${schema} ${key} ${value}`);
    }
}

class ThemeVariantIndicator extends PanelMenu.Button {

    constructor(manager) {
	this.manager = manager;
    }

    _init(manager) {
	super._init(0.0, "Theme Variant Indicator");

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
	const text = "Use " + this.manager.getThemeName() + " dark";
	const item = new PopupMenu.PopupMenuItem(text);
	item.connect("activate", () => this.manager.useDark());
	return item;
    }

    createMenuItemLight() {
	const text = "Use " + this.manager.getThemeName() + " light";
	const item = new PopupMenu.PopupMenuItem(text);
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
	this.manager = new AdwaitaThemeVariantManager();
	this.indicator = new ThemeVariantIndicatorClass(this.manager);

	Main.panel.addToStatusArea(this.domain, this.indicator);
    }

    disable() {
	this.indicator.destroy();
	this.indicator = null;
	this.manager = null;
    }
}

function init() {
    return new ThemeVariantExtension(ExtensionUtils.getCurrentExtension());
}

