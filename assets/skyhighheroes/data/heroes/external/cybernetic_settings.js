/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  return {
    name: "settings",
    moduleMessageName: "Settings",
    type: 1,
    command: "set",
    cyberMenus: {
      "settings": {
        parent: "main",
        prevButton: "main_settings",
        buttons: {
          "settings_statue_mode": {
            borderingButtons: {
              bottom: "settings_alias_active",
              right: "settings_sleep",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "statueMode", !nbt.getBoolean("statueMode"));
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", nbt.getBoolean("statueMode"));
                if (entity.getData("skyhighheroes:dyn/cybernetic_statue_mode")) {
                  system.moduleMessage(this, entity, "<n>Enabled <nh>statue mode<n>!");
                } else {
                  system.moduleMessage(this, entity, "<n>Disabled <nh>statue mode<n>!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "settings_body_lights": {
            borderingButtons: {
              bottom: "settings_night_vision",
              left: "settings_sleep",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "bodyLights", !nbt.getBoolean("bodyLights"));
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
                if (entity.getData("skyhighheroes:dyn/cybernetic_body_lights")) {
                  system.moduleMessage(this, entity, "<n>Enabled <nh>body lights<n>!");
                } else {
                  system.moduleMessage(this, entity, "<n>Disabled <nh>body lights<n>!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "settings_alias_active": {
            borderingButtons: {
              top: "settings_statue_mode",
              right: "settings_offline",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "aliasActive", !nbt.getBoolean("aliasActive"));
                manager.setData(entity, "skyhighheroes:dyn/alias_active", nbt.getBoolean("aliasActive"));
                if (entity.getData("skyhighheroes:dyn/alias_active")) {
                  system.moduleMessage(this, entity, "<n>Enabled <nh>alias<n>!");
                } else {
                  system.moduleMessage(this, entity, "<n>Disabled <nh>alias<n>!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "settings_night_vision": {
            borderingButtons: {
              top: "settings_body_lights",
              left: "settings_offline",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "nightVision", !nbt.getBoolean("nightVision"));
                manager.setData(entity, "skyhighheroes:dyn/night_vision", nbt.getBoolean("nightVision"));
                if (entity.getData("skyhighheroes:dyn/night_vision")) {
                  system.moduleMessage(this, entity, "<n>Enabled <nh>night vision<n>!");
                } else {
                  system.moduleMessage(this, entity, "<n>Disabled <nh>night vision<n>!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "settings_sleep": {
            borderingButtons: {
              bottom: "settings_offline",
              left: "settings_statue_mode",
              right: "settings_body_lights",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", !entity.getData("skyhighheroes:dyn/cybernetic_sleep"));
                if (entity.getData("skyhighheroes:dyn/cybernetic_sleep")) {
                  system.moduleMessage(this, entity, "<n>Sleep mode activated!");
                  manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", false);
                  system.onSleepActions.forEach(action => {
                    action(entity, manager);
                  });
                } else {
                  system.moduleMessage(this, entity, "<n>Sleep mode deactivated!");
                  var nbt = system.mainNBT(entity);
                  manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
                  system.onWakeActions.forEach(action => {
                    action(entity, manager);
                  });
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "settings_offline": {
            borderingButtons: {
              top: "settings_sleep",
              left: "settings_alias_active",
              right: "settings_night_vision",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/cybernetics_offline", !entity.getData("skyhighheroes:dyn/cybernetics_offline"));
                if (entity.getData("skyhighheroes:dyn/cybernetics_offline")) {
                  system.moduleMessage(this, entity, "<n>Now offline!");
                } else {
                  system.moduleMessage(this, entity, "<n>Now online!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_settings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
        }
      }
    },
    cyberMainButton: {
      buttonID: "main_settings",
      borderingButtons: {
        top: "main_thermoptics",
        bottom: "main_contacts_groups"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "settings");
          system.setButton(entity, manager, "settings_sleep");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
        }
      }
    },
    helpMessage: "<n>!set <nh>-<n> Settings",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        var nbt = system.mainNBT(entity);
        switch(argList[1]) {
          case "statueMode":
            manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : entity.getData("skyhighheroes:dyn/cybernetic_body_lights")));
            manager.setBoolean(nbt, "statueMode", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : nbt.getBoolean("statueMode")));
            system.moduleMessage(this, entity, "<n>statueMode set to <nh>" + nbt.getBoolean("statueMode") + "<n>!");
            break;
          case "bodyLights":
            manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : entity.getData("skyhighheroes:dyn/cybernetic_body_lights")));
            manager.setBoolean(nbt, "bodyLights", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : nbt.getBoolean("bodyLights")));
            system.moduleMessage(this, entity, "<n>bodyLights set to <nh>" + nbt.getBoolean("bodyLights") + "<n>!");
            break;
          case "fightOrFlightDur":
            manager.setData(entity, "skyhighheroes:dyn/fight_or_flight_duration", parseInt(argList[2]));
            manager.setShort(nbt, "durationFightOrFlight", parseInt(argList[2]));
            system.moduleMessage(this, entity, "<n>fightOrFlightDur set to <nh>" + nbt.getShort("durationFightOrFlight") + "<n>!");
            break;
          case "fightOrFlightMin":
            manager.setData(entity, "skyhighheroes:dyn/fight_or_flight_min_health", parseInt(argList[2]));
            manager.setInteger(nbt, "minHealthFightOrFlight", parseInt(argList[2]));
            system.moduleMessage(this, entity, "<n>fightOrFlightMin set to <nh>" + nbt.getShort("minHealthFightOrFlight") + "<n>!");
            break;
          case "aliasActive":
            manager.setData(entity, "skyhighheroes:dyn/alias_active", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : entity.getData("skyhighheroes:dyn/alias_active")));
            manager.setBoolean(nbt, "aliasActive", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : nbt.getBoolean("aliasActive")));
            system.moduleMessage(this, entity, "<n>aliasActive set to <nh>" + nbt.getBoolean("aliasActive") + "<n>!");
            break;
          case "nightVision":
            manager.setData(entity, "skyhighheroes:dyn/night_vision", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : entity.getData("skyhighheroes:dyn/night_vision")));
            manager.setBoolean(nbt, "nightVision", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : nbt.getBoolean("nightVision")));
            system.moduleMessage(this, entity, "<n>nightVision set to <nh>" + nbt.getBoolean("nightVision") + "<n>!");
            break;
          case "hudScale":
            manager.setData(entity, "skyhighheroes:dyn/hud_scale", parseFloat(argList[2]));
            manager.setFloat(nbt, "hudScale", parseFloat(argList[2]));
            system.moduleMessage(this, entity, "<n>hudScale set to <nh>" + nbt.getFloat("hudScale") + "<n>!");
            break;
          case "hudSidesBorder":
            manager.setData(entity, "skyhighheroes:dyn/hud_sides_border", parseFloat(argList[2]));
            manager.setFloat(nbt, "hudSidesBorder", parseFloat(argList[2]));
            system.moduleMessage(this, entity, "<n>hudSidesBorder set to <nh>" + nbt.getFloat("hudSidesBorder") + "<n>!");
            break;
          case "hudTopBorder":
            manager.setData(entity, "skyhighheroes:dyn/hud_top_border", parseFloat(argList[2]));
            manager.setFloat(nbt, "hudTopBorder", parseFloat(argList[2]));
            system.moduleMessage(this, entity, "<n>hudTopBorder set to <nh>" + nbt.getFloat("hudTopBorder") + "<n>!");
            break;
          case "list":
            system.moduleMessage(this, entity, "<n>statueMode: <nh>" + entity.getData("skyhighheroes:dyn/cybernetic_statue_mode"));
            system.moduleMessage(this, entity, "<n>bodyLights: <nh>" + entity.getData("skyhighheroes:dyn/cybernetic_body_lights"));
            system.moduleMessage(this, entity, "<n>fightOrFlightDur: <nh>" + entity.getData("skyhighheroes:dyn/fight_or_flight_duration"));
            system.moduleMessage(this, entity, "<n>fightOrFlightMin: <nh>" + entity.getData("skyhighheroes:dyn/fight_or_flight_min_health"));
            system.moduleMessage(this, entity, "<n>aliasActive: <nh>" + entity.getData("skyhighheroes:dyn/alias_active"));
            system.moduleMessage(this, entity, "<n>nightVision: <nh>" + entity.getData("skyhighheroes:dyn/night_vision"));
            system.moduleMessage(this, entity, "<n>hudScale: <nh>" + entity.getData("skyhighheroes:dyn/hud_scale"));
            system.moduleMessage(this, entity, "<n>hudSidesBorder: <nh>" + entity.getData("skyhighheroes:dyn/hud_sides_border"));
            system.moduleMessage(this, entity, "<n>hudTopBorder: <nh>" + entity.getData("skyhighheroes:dyn/hud_top_border"));
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Settings commands:");
            system.moduleMessage(this, entity, "<n>!set list <nh>-<n> Lists current settings and their values");
            system.moduleMessage(this, entity, "<n>!set statueMode <true|false> <nh>-<n> Sets if all body movement is supressed");
            system.moduleMessage(this, entity, "<n>!set bodyLights <true|false> <nh>-<n> Sets if body lights are active");
            system.moduleMessage(this, entity, "<n>!set fightOrFlightDur <number> <nh>-<n> Sets duration of fight or flight response");
            system.moduleMessage(this, entity, "<n>!set fightOrFlightMin <number> <nh>-<n> Sets minimum health to activate fight or flight");
            system.moduleMessage(this, entity, "<n>!set aliasActive <true|false> <nh>-<n> Sets if alias name appears above head");
            system.moduleMessage(this, entity, "<n>!set nightVision <true|false> <nh>-<n> Sets if night vision is active");
            system.moduleMessage(this, entity, "<n>!set hudScale <number> <nh>-<n> Sets scale of HUD elements");
            system.moduleMessage(this, entity, "<n>!set hudSidesBorder <number> <nh>-<n> Sets horizontal border of HUD elements");
            system.moduleMessage(this, entity, "<n>!set hudTopBorder <number> <nh>-<n> Sets vertical border of HUD elements");
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
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("statueMode")) {
        manager.setBoolean(nbt, "statueMode", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", nbt.getBoolean("statueMode"));
      if (!nbt.hasKey("bodyLights")) {
        manager.setBoolean(nbt, "bodyLights", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
      if (!nbt.hasKey("durationFightOrFlight")) {
        manager.setShort(nbt, "durationFightOrFlight", 20);
      };
      manager.setData(entity, "skyhighheroes:dyn/fight_or_flight_duration", nbt.getShort("durationFightOrFlight"));
      if (!nbt.hasKey("minHealthFightOrFlight")) {
        manager.setShort(nbt, "minHealthFightOrFlight", 5);
      };
      manager.setData(entity, "skyhighheroes:dyn/fight_or_flight_min_health", nbt.getShort("minHealthFightOrFlight"));
      if (!nbt.hasKey("hudScale")) {
        manager.setFloat(nbt, "hudScale", 1.0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_scale", nbt.getFloat("hudScale"));
      if (!nbt.hasKey("hudSidesBorder")) {
        manager.setInteger(nbt, "hudSidesBorder", 220.0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_sides_border", nbt.getInteger("hudSidesBorder"));
      if (!nbt.hasKey("hudTopBorder")) {
        manager.setInteger(nbt, "hudTopBorder", 110.0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_top_border", nbt.getInteger("hudTopBorder"));
      if (!nbt.hasKey("nightVision")) {
        manager.setBoolean(nbt, "nightVision", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/night_vision", nbt.getBoolean("nightVision"));
      if (!nbt.hasKey("aliasActive")) {
        manager.setBoolean(nbt, "aliasActive", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/alias_active", nbt.getBoolean("aliasActive"));
    }
  };
};