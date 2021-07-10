const ExtensionUtils = imports.misc.extensionUtils;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Style = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

class AdwaitaThemeVariantManager {
    themeName = "Adwaita";
    themeNameDark = this.themeName + "-dark";
    themeNameLight = this.themeName;

    constructor() {
        this.themeSettings = new Gio.Settings({
            schema: "org.gnome.desktop.interface",
        });
        this.userSettings = new Gio.Settings({
            schema: "org.gnome.shell.extensions.user-theme",
        });
    }

    getThemeName() {
        return this.themeName;
    }

    getCurrentThemeVariant() {
        return this.themeSettings.get_string("gtk-theme");
    }

    useDark() {
        this.useThemeVariant(this.themeNameDark);
    }

    useLight() {
        this.useThemeVariant(this.themeNameLight);
    }

    useThemeVariant(variant) {
        this.themeSettings.set_string("gtk-theme", variant);
        this.userSettings.set_string("name", variant);
    }
}

class ThemeVariantIndicator extends PanelMenu.Button {
    constructor(domain, manager) {
        this.domain = domain;
        this.manager = manager;
    }

    _init(domain, manager) {
        super._init(0.0, "Theme Variant Indicator");

        this.domain = domain;
        this.manager = manager;
        this.icon = this.createIcon();

        this.add_child(this.icon);
        this.menu.addMenuItem(this.createMenuItemDark());
        this.menu.addMenuItem(this.createMenuItemLight());

        this.updateIcon();
    }

    getIconName() {
        const variant = this.manager.getCurrentThemeVariant();

        if (variant === this.manager.themeNameLight) {
            return "weather-clear-symbolic";
        }

        return "weather-clear-night-symbolic";
    }

    createIcon() {
        return new Style.Icon({
            icon_name: this.getIconName(),
            style_class: "system-status-icon",
        });
    }

    updateIcon() {
        this.icon.icon_name = this.getIconName();

        Main.panel.statusArea[this.domain] = null;
        Main.panel.addToStatusArea(this.domain, this);
    }

    createMenuItemDark() {
        const text = "Use " + this.manager.getThemeName() + " dark";
        const item = new PopupMenu.PopupMenuItem(text);
        item.connect("activate", () => {
            this.manager.useDark();
            this.updateIcon();
        });
        return item;
    }

    createMenuItemLight() {
        const text = "Use " + this.manager.getThemeName() + " light";
        const item = new PopupMenu.PopupMenuItem(text);
        item.connect("activate", () => {
            this.manager.useLight();
            this.updateIcon();
        });
        return item;
    }
}

const ThemeVariantIndicatorClass = GObject.registerClass(ThemeVariantIndicator);

class ThemeVariantExtension {
    constructor(extension) {
        this.domain = extension.metadata.uuid;
    }

    enable() {
        this.manager = new AdwaitaThemeVariantManager();
        this.indicator = new ThemeVariantIndicatorClass(this.domain, this.manager);
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
