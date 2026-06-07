colors = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f"
];
/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  var settings = {
    "systemColor": {
      defaultValue: "\u00A70",
      type: "string",
      variable: "system_color"
    },
  };
  function getDefaultSystemColor(entity) {
    var satellite = entity.getData("skyhighheroes:dyn/satellite");
    var result = "";
    switch (satellite) {
      case "dragon":
        result = "\u00A72";
        break;
      case "leo":
        var result = "\u00A74";
        break;
      case "pegasus":
        var result = "\u00A71";
        break;
      default:
        var result = "\u00A70";
        break;
    };
    return result;
  };
  /**
   * Puts together list 
   * @param {JSEntity} entity - Required
   **/
  function settingsList(entity) {
    var settingsList = Object.keys(settings);
    var nbt = system.getMainNBT(entity);
    var settingsEntries = [];
    settingsList.forEach(entry => {
      var setting = settings[entry];
      var value = "";
      switch (setting.type.toLowerCase()) {
        case "string":
          value = nbt.getString(entry);
          break;
        case "integer":
          value = nbt.getInteger(entry);
          break;
        case "short":
          value = nbt.getShort(entry);
          break;
        case "long":
          value = nbt.getLong(entry);
          break;
        case "boolean":
          value = nbt.getBoolean(entry);
          break;
        case "float":
          value = nbt.getFloat(entry);
          break;
        case "double":
          value = nbt.getDouble(entry);
          break;
        default:
          value = nbt.getString(entry);
          break;
      };
      var settingsEntry = entry + ";:" + setting.type + ";:" + setting.variable;
      settingsEntries.push(settingsEntry);
    });
    return settingsEntries;
  };
  /**
   * Puts together list 
   * @param {JSEntity} entity - Required
   **/
  function viewValue(entity) {
    var nbt = system.getMainNBT(entity);
    var entry = entity.getData("skyhighheroes:dyn/list_entry");
    var entries = entry.split(";:");
    var nbtKey = entries[0];
    var type = entries[1];
    var value = "";
    switch (type.toLowerCase()) {
      case "string":
        value = nbt.getString(nbtKey);
        break;
      case "integer":
        value = nbt.getInteger(nbtKey);
        break;
      case "short":
        value = nbt.getShort(nbtKey);
        break;
      case "long":
        value = nbt.getLong(nbtKey);
        break;
      case "boolean":
        value = nbt.getBoolean(nbtKey);
        break;
      case "float":
        value = nbt.getFloat(nbtKey);
        break;
      case "double":
        value = nbt.getDouble(nbtKey);
        break;
      default:
        value = nbt.getString(nbtKey);
        break;
    };
    if (nbtKey == "systemColor") {
      system.moduleMessage(this, entity, nbtKey + ": " + value + "color");
    } else {
      system.moduleMessage(this, entity, nbtKey + ": " + value);
    };
  };

  function initSettings(entity, manager) {
    var settingsList = Object.keys(settings);
    var nbt = system.getMainNBT(entity);
    settingsList.forEach(entry => {
      var setting = settings[entry];
      if (entry == "systemColor") {
        if (!nbt.hasKey("systemColor")) {
          var satellite = getDefaultSystemColor(entity);
          manager.setString(nbt, "systemColor", satellite);
        };
        manager.setData(entity, "skyhighheroes:dyn/system_color", nbt.getString("systemColor"))
      } else {
        switch (setting.type.toLowerCase()) {
          case "string":
            manager.setString(nbt, entry, setting.defaultValue);
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getString(entry));
            break;
          case "integer":
            manager.setInteger(nbt, entry, parseInt(setting.defaultValue));
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getInteger(entry));
            break;
          case "short":
            manager.setShort(nbt, entry, parseFloat(setting.defaultValue));
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getShort(entry));
            break;
          case "long":
            manager.setLong(nbt, entry, parseFloat(setting.defaultValue));
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getLong(entry));
            break;
          case "boolean":
            manager.setBoolean(nbt, entry, (setting.defaultValue == "true") ? true : false);
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getBoolean(entry));
            break;
          case "float":
            manager.setFloat(nbt, entry, parseFloat(setting.defaultValue));
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getFloat(entry));
            break;
          case "double":
            manager.setDouble(nbt, entry, parseFloat(setting.defaultValue));
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getDouble(entry));
            break;
          default:
            manager.setString(nbt, entry, setting.defaultValue);
            manager.setData(entity, "skyhighheroes:dyn/" + setting.variable, nbt.getString(entry));
            break;
        };
      };
    });
  };

  function updateSetting(entity, manager, entry) {
    var listEntry = entity.getData("skyhighheroes:dyn/list_entry");
    var entries = listEntry.split(";:");
    var nbt = system.mainNBT(entity);
    var nbtKey = entries[0];
    var type = entries[1];
    var variable = entries[2];
    if (nbtKey == "systemColor") {
      entry = "\u00A7" + entry;
    };
    switch (type.toLowerCase()) {
      case "string":
        manager.setString(nbt, nbtKey, entry);
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getString(nbtKey));
        break;
      case "integer":
        manager.setInteger(nbt, nbtKey, parseInt(entry));
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getInteger(nbtKey));
        break;
      case "short":
        manager.setShort(nbt, nbtKey, parseFloat(entry));
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getShort(nbtKey));
        break;
      case "long":
        manager.setLong(nbt, nbtKey, parseFloat(entry));
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getLong(nbtKey));
        break;
      case "boolean":
        manager.setBoolean(nbt, nbtKey, (entry == "true") ? true : false);
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getBoolean(nbtKey));
        break;
      case "float":
        manager.setFloat(nbt, nbtKey, parseFloat(entry));
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getFloat(nbtKey));
        break;
      case "double":
        manager.setDouble(nbt, nbtKey, parseFloat(entry));
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getDouble(nbtKey));
        break;
      default:
        manager.setString(nbt, nbtKey, entry);
        manager.setData(entity, "skyhighheroes:dyn/" + variable, nbt.getString(nbtKey));
        break;
    };
    if (nbtKey == "systemColor") {
      system.moduleMessage(this, entity, nbtKey + " was updated to " + entry + "color");
    } else {
      system.moduleMessage(this, entity, nbtKey + " was updated to " + entry);
    };
  };
  
  return {
    name: "settings",
    moduleMessageName: "Settings",
    type: 1,
    command: "set",
    transerMenus: {
      "settings": {
        parent: "main",
        prevButton: "main_settings",
        buttons: {
          "settings_view": {
            borderingButtons: {
              top: "settings_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var entry = entity.getData("skyhighheroes:dyn/list_value");
                viewValue(entity, entry);
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
              },
            }
          },
          "settings_edit": {
            borderingButtons: {
              bottom: "settings_view",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                };
              },
              textAction: (entity, manager, entry) => {
                updateSetting(entity, manager, entry);
                var list = settingsList(entity, manager);
                system.updateList(entity, manager, 7, list);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "settings_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_0");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              upAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if (value > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")-1);
                };
                system.updateList(entity, manager, 7, list);
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 1) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "settings_select_1": {
            borderingButtons: {
              top: "settings_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_1");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 2) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "settings_select_2": {
            borderingButtons: {
              top: "settings_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_2");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 3) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "settings_select_3": {
            borderingButtons: {
              top: "settings_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_3");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 4) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "settings_select_4": {
            borderingButtons: {
              top: "settings_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_4");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 5) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "settings_select_5": {
            borderingButtons: {
              top: "settings_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_5");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                if ((list.length) > 6) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "settings_select_6": {
            borderingButtons: {
              top: "settings_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "settings_select_6");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_settings");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
              },
              downAction: (entity, manager) => {
                var list = settingsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if ((list.length-7) > value) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")+1);
                };
                system.updateList(entity, manager, 7, list);
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              }
            }
          }
        }
      }
    },
    transerMainButton: {
      buttonID: "main_settings",
      borderingButtons: {
        top: "main_groups",
        left: "main_chat",
        right: "main_waypoints",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/current_menu", "settings");
          manager.setData(entity, "skyhighheroes:dyn/selected_button", "settings_select_0");
          var list = settingsList(entity);
          system.updateList(entity, manager, 7, list);
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/transer", false);
        }
      }
    },
    helpMessage: "<n>!set <nh>-<n> Settings",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        var nbt = system.mainNBT(entity);
        switch(argList[1]) {
          case "color":
            if (colors.indexOf(argList[2]) > -1) {
              manager.setData(entity, "skyhighheroes:dyn/system_color", argList[2]);
              manager.setString(nbt, "systemColor", argList[2]);
              system.moduleMessage(this, entity, "<n>color set to <nh>\u00A7" + nbt.getString("systemColor") + "COLOR<n>!");
            } else {
              system.moduleMessage(this, entity, "<e>Invalid color code!");
            };
            break;
          case "list":
            system.moduleMessage(this, entity, "<n>color: <nh>\u00A7" + entity.getData("skyhighheroes:dyn/color") + "COLOR");
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Settings commands:");
            system.moduleMessage(this, entity, "<n>!set list <nh>-<n> Lists current settings and their values");
            system.moduleMessage(this, entity, "<n>!set color <color code> <nh>-<n> Sets system color");
            system.moduleMessage(this, entity, "<n>!set help <nh>-<n> Shows this list");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>settings<e> command! Try <eh>!set help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>settings<e> command! Try <eh>!set help<e> for a list of commands!");
      };
    },
    onInitSystem: function (entity, manager) {
      initSettings(entity, manager);
    }
  };
};