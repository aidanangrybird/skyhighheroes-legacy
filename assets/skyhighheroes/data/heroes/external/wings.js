/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  return {
    name: "wings",
    moduleMessageName: "Wings",
    type: 12,
    command: "wing",
    cyberOverviewButtons: {
      "wing_left_deploy": {
        borderingButtons: {
          top: "intake_body_left_start_up",
          right: "external_arm_left_deploy",
          left: "system_core_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", !entity.getData("skyhighheroes:dyn/wing_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/wing_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left<s> wing!");
            } else {
              system.moduleMessage(this, entity, "<s>Retracted <sh>left<s> wing!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "wing_right_deploy": {
        borderingButtons: {
          top: "intake_body_right_start_up",
          left: "external_arm_right_deploy",
          right: "system_core_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", !entity.getData("skyhighheroes:dyn/wing_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/wing_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right<s> wing!");
            } else {
              system.moduleMessage(this, entity, "<s>Retracted <sh>right<s> wing!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
    },
    cyberMenus: {
      "rockets_wings": {
        parent: "main",
        prevButton: "main_rockets_wings",
        buttons: {
          "wings_armed": {
            borderingButtons: {
              top: "rockets_wings_armed",
              bottom: "rockets_on_fall",
              left: "rockets_body_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/wings_armed")) {
                  if (entity.getData("skyhighheroes:dyn/rockets_arms_armed") || entity.getData("skyhighheroes:dyn/rockets_body_armed") || entity.getData("skyhighheroes:dyn/rockets_legs_armed") || entity.getData("skyhighheroes:dyn/rockets_wings_armed")) {
                    system.moduleMessage(this, entity, "<e>A rocket set is already armed! Disarm rockets before arming wings!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/wings_armed", true);
                    manager.setBoolean(nbt, "wings", true);
                    system.moduleMessage(this, entity, "<s>Armed <sh>wings<s>!");
                  };
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/wings_armed", false);
                  manager.setBoolean(nbt, "wings", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s>!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
        }
      }
    },
    cyberMainButton: {
      buttonID: "main_rockets_wings",
      borderingButtons: {
        top: "main_external_arms",
        bottom: "main_cannons"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "rockets_wings");
          system.setButton(entity, manager, "rockets_arms_armed");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
        }
      }
    },
    helpMessage: "<n>!wing <nh>-<n> Wings",
    disabledMessage: "<e>Module <eh>wings<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        var nbt = system.mainNBT(entity);
        switch(argList[1]) {
          case "arm":
            if (entity.getData("skyhighheroes:dyn/rockets_arms_armed") || entity.getData("skyhighheroes:dyn/rockets_body_armed") || entity.getData("skyhighheroes:dyn/rockets_legs_armed") || entity.getData("skyhighheroes:dyn/rockets_wings_armed")) {
              system.moduleMessage(this, entity, "<e>A rocket set is already armed! Disarm rockets before arming wings!");
            } else {
              manager.setData(entity, "skyhighheroes:dyn/wings_armed", true);
              manager.setBoolean(nbt, "wings", true);
              system.moduleMessage(this, entity, "<s>Armed <sh>wings<s>!");
            };
            break;
          case "disarm":
            manager.setData(entity, "skyhighheroes:dyn/wings_armed", false);
            manager.setBoolean(nbt, "wings", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s>!");
            break;
          case "show":
            switch(argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left<s> wing!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right<s> wing!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>wings<s>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>wing<e>!");
                break;
            };
            break;
          case "hide":
            switch(argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", false);
                system.moduleMessage(this, entity, "<s>Retracted <sh>left<s> wing!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Retracted <sh>right<s> wing!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Retracted <sh>wings<s>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>wing<e>!");
                break;
            };
            break;
          case "set":
            switch (argList[2]) {
              case "holo":
                manager.setBoolean(nbt, "holoGlide", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoGlide")));
                system.moduleMessage(this, entity, "<n>Hologram set to <nh>" + nbt.getBoolean("holoGlide") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>wing<e> setting!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Wings commands:");
            system.moduleMessage(this, entity, "<n>!wing arm <nh>-<n> Arms wings");
            system.moduleMessage(this, entity, "<n>!wing disarm <nh>-<n> Disarms wings");
            system.moduleMessage(this, entity, "<n>!wing show <nh>-<n> Deploys wings");
            system.moduleMessage(this, entity, "<n>!wing hide <nh>-<n> Retracts wings");
            system.moduleMessage(this, entity, "<n>!wing set <holo> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!wing status <nh>-<n> Shows status of wings");
            system.moduleMessage(this, entity, "<n>!wing help <nh>-<n> Shows wings commands");
            break;
          case "status":
            var wings = (entity.getData("skyhighheroes:dyn/wings_timer") > 0);
            system.moduleMessage(this, entity, "<n>Wings status:");
            system.moduleMessage(this, entity, "<n>Wings: <nh>" + (entity.getData("skyhighheroes:dyn/wings_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Left wing: <nh>" + ((entity.getData("skyhighheroes:dyn/wing_left_deploy_timer") > 0) || wings ? "DEPLOYED" : "RETRACTED"));
            system.moduleMessage(this, entity, "<n>Right wing: <nh>" + ((entity.getData("skyhighheroes:dyn/wing_right_deploy_timer") > 0) || wings ? "DEPLOYED" : "RETRACTED"));
            system.moduleMessage(this, entity, "<n>Hologram: <nh>" + (nbt.getBoolean("holoGlide") ? "ENABLED" : "DISABLED"));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>wings<e> command! Try <eh>!wing help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>wings<e> command! Try <eh>!wing help<e> for a list of commands!");
      };
    },
    armHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "wings":
          if (entity.getData("skyhighheroes:dyn/rockets_arms_armed") || entity.getData("skyhighheroes:dyn/rockets_body_armed") || entity.getData("skyhighheroes:dyn/rockets_legs_armed") || entity.getData("skyhighheroes:dyn/rockets_wings_armed")) {
            system.moduleMessage(this, entity, "<e>A rocket set is already armed! Disarm rockets before arming wings!");
          } else {
            manager.setData(entity, "skyhighheroes:dyn/wings_armed", true);
            manager.setBoolean(nbt, "wings", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>wings<s>!");
          };
          return;
      };
    },
    disarmHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "wings":
          manager.setData(entity, "skyhighheroes:dyn/wings_armed", false);
          manager.setBoolean(nbt, "wings", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s>!");
          return;
      };
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      var wings = entity.getData("skyhighheroes:dyn/wings_armed");
      if (!system.isModuleDisabled(entity, this.name)) {
        if (modifier.name() == "fiskheroes:gliding" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = wings;
        };
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setBoolean(nbt, "wings", false);
      manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", false);
    },
    tickHandler: function (entity, manager) {
      var wings = entity.getData("skyhighheroes:dyn/wings_armed") && entity.getData("fiskheroes:gliding");
      if (!entity.getData("skyhighheroes:dyn/rockets_wings_armed") && entity.getData("fiskheroes:gliding_timer") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/wings", wings);
        if (entity.getData("fiskheroes:gliding_timer") < 0.2) {
          if (wings) {
            system.shoutMessage(entity, "Activating Wings!", 16);
          };
        };
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("wings")) {
        manager.setBoolean(nbt, "wings", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/wings_armed", nbt.getBoolean("wings"));
    },
    onSleep: function (entity, manager) {
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_wings", entity.getData("skyhighheroes:dyn/wings"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_gliding", entity.getData("fiskheroes:gliding"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_wings", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_gliding", false);
    },
    onWake: function (entity, manager) {
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/wings", entity.getData("skyhighheroes:dyn/prev_wings"));
      manager.setDataWithNotify(entity, "fiskheroes:gliding", entity.getData("skyhighheroes:dyn/prev_gliding"));
    },
  };
};