/**
*You put all of the required functions in here
*@param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  var cannonMultiTap = system.initMultiTap("skyhighheroes:dyn/cannon");
  return {
    name: "cannons",
    moduleMessageName: "Cannons",
    type: 13,
    command: "cannon",
    cyberMenus: {
      "cannons": {
        parent: "main",
        prevButton: "main_cannons",
        buttons: {
          "cannons_head_armed": {
            borderingButtons: {
              bottom: "cannons_body_armed",
              right: "cannons_head_flush",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/cannons_head_armed")) {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
                  manager.setBoolean(nbt, "cannonsHead", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>head<s> cannons!");
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
                  manager.setBoolean(nbt, "cannonsHead", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>head<s> cannons!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_body_armed": {
            borderingButtons: {
              top: "cannons_head_armed",
              bottom: "cannons_arms_armed",
              right: "cannons_body_flush",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/cannons_body_armed")) {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
                  manager.setBoolean(nbt, "cannonsBody", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>body<s> cannons!");
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
                  manager.setBoolean(nbt, "cannonsBody", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> cannons!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_arms_armed": {
            borderingButtons: {
              top: "cannons_body_armed",
              left: "cannons_left_arm_flush",
              right: "cannons_right_arm_flush",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/cannons_arms_armed")) {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
                  manager.setBoolean(nbt, "cannonsArms", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> cannons!");
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
                  manager.setBoolean(nbt, "cannonsArms", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> cannons!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_head_flush": {
            borderingButtons: {
              bottom: "cannons_body_flush",
              left: "cannons_head_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "flushHeadCannons", !nbt.getBoolean("flushHeadCannons"));
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_flush_enabled", nbt.getBoolean("flushHeadCannons"));
                system.moduleMessage(this, entity, "<n>Flush Head Cannons set to <nh>" + entity.getData("skyhighheroes:dyn/cannon_head_flush_enabled") + "<n>!");
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_body_flush": {
            borderingButtons: {
              top: "cannons_head_flush",
              bottom: "cannons_right_arm_flush",
              left: "cannons_body_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "flushBodyCannons", !nbt.getBoolean("flushBodyCannons"));
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_flush_enabled", nbt.getBoolean("flushBodyCannons"));
                system.moduleMessage(this, entity, "<n>Flush Body Cannons set to <nh>" + entity.getData("skyhighheroes:dyn/cannon_body_flush_enabled") + "<n>!");
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_left_arm_flush": {
            borderingButtons: {
              top: "cannons_body_armed",
              right: "cannons_arms_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "flushLeftArmCannons", !nbt.getBoolean("flushLeftArmCannons"));
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_flush_enabled", nbt.getBoolean("flushLeftArmCannons"));
                system.moduleMessage(this, entity, "<n>Flush Left Arm Cannon set to <nh>" + entity.getData("skyhighheroes:dyn/cannon_left_arm_flush_enabled") + "<n>!");
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "cannons_right_arm_flush": {
            borderingButtons: {
              top: "cannons_body_flush",
              left: "cannons_arms_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "flushRightArmCannons", !nbt.getBoolean("flushRightArmCannons"));
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_flush_enabled", nbt.getBoolean("flushRightArmCannons"));
                system.moduleMessage(this, entity, "<n>Flush Right Arm Cannon set to <nh>" + entity.getData("skyhighheroes:dyn/cannon_right_arm_flush_enabled") + "<n>!");
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_cannons");
                system.setMenu(entity, manager, "main");
              },
            }
          },
        }
      }
    },
    cyberOverviewButtons: {
      "cannon_head_left_deploy": {
        borderingButtons: {
          top: "antenna_deploy",
          bottom: "intake_head_left_start_up",
          right: "rocket_left_arm_front_deploy",
          left: "optics_enabled",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", !entity.getData("skyhighheroes:dyn/cannon_head_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_head_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left head<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left head<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_head_right_deploy": {
        borderingButtons: {
          top: "antenna_deploy",
          bottom: "intake_head_right_start_up",
          left: "rocket_right_arm_front_deploy",
          right: "optics_enabled",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", !entity.getData("skyhighheroes:dyn/cannon_head_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_head_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right head<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right head<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_body_left_deploy": {
        borderingButtons: {
          top: "intake_body_left_open",
          right: "rocket_body_left_deploy",
          left: "cannon_body_right_deploy",
          bottom: "system_core_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", !entity.getData("skyhighheroes:dyn/cannon_body_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_body_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left body<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left body<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_body_right_deploy": {
        borderingButtons: {
          top: "intake_body_right_open",
          left: "rocket_body_right_deploy",
          right: "cannon_body_left_deploy",
          bottom: "system_core_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", !entity.getData("skyhighheroes:dyn/cannon_body_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_body_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right body<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right body<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_left_arm_bottom_deploy": {
        borderingButtons: {
          top: "shield_left_deploy",
          bottom: "intake_left_leg_open",
          left: "intake_head_left_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", !entity.getData("skyhighheroes:dyn/cannon_left_arm_bottom_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_left_arm_bottom_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm bottom<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm bottom<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_left_arm_front_deploy": {
        borderingButtons: {
          top: "cannon_left_arm_front_deploy",
          left: "blade_left_deploy",
          right: "shield_left_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", !entity.getData("skyhighheroes:dyn/cannon_left_arm_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_left_arm_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm front<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm front<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_left_arm_back_deploy": {
        borderingButtons: {
          top: "rocket_left_arm_back_deploy",
          bottom: "cannon_left_arm_bottom_deploy",
          left: "shield_left_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", !entity.getData("skyhighheroes:dyn/cannon_left_arm_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_left_arm_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm back<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm back<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_right_arm_bottom_deploy": {
        borderingButtons: {
          top: "shield_right_deploy",
          bottom: "intake_right_leg_open",
          right: "intake_head_right_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", !entity.getData("skyhighheroes:dyn/cannon_right_arm_bottom_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_right_arm_bottom_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm bottom<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm bottom<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_right_arm_front_deploy": {
        borderingButtons: {
          top: "rocket_right_arm_front_deploy",
          bottom: "cannon_right_arm_bottom_deploy",
          right: "blade_right_deploy",
          left: "shield_right_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", !entity.getData("skyhighheroes:dyn/cannon_right_arm_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_right_arm_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm front<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm front<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "cannon_right_arm_back_deploy": {
        borderingButtons: {
          top: "rocket_right_arm_back_deploy",
          bottom: "cannon_right_arm_bottom_deploy",
          right: "shield_right_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", !entity.getData("skyhighheroes:dyn/cannon_right_arm_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/cannon_right_arm_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm back<s> cannon!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm back<s> cannon!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
    },
    cyberMainButton: {
      buttonID: "main_cannons",
      borderingButtons: {
        top: "main_rockets_wings",
        bottom: "main_blades_shields"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "cannons");
          system.setButton(entity, manager, "cannons_head_armed");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/interface", false);
        }
      }
    },
    helpMessage: "<n>!cannon <nh>-<n> Cannons",
    disabledMessage: "<e>Module <eh>cannons<e> is disabled!",
    keyBinds: function (hero, color) {
      hero.addKeyBindFunc("CANNONS", (player, manager) => {
        //system.moduleMessage(this, player, "<e>To arm a cannon set do <eh>!cannon arm <arms|body|head><e>.");
        cannonMultiTap.tap(player, manager);
        return true;
      }, "\u00A7" + color + "Cannons (x2 to arm)", 4);
      hero.addKeyBindFunc("CHARGED_BEAM", (player, manager) => {
        cannonMultiTap.tap(player, manager);
        return true;
      }, "\u00A7" + color + "Cannons (x2 to disarm)", 4);
      hero.addKeyBind("CANNONS_ARMS", "\u00A7" + color + "", 4);
    },
    isKeyBindEnabled: function (entity, keyBind) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        var head = entity.getData("skyhighheroes:dyn/cannons_head_armed");
        var body = entity.getData("skyhighheroes:dyn/cannons_body_armed");
        var arms = entity.getData("skyhighheroes:dyn/cannons_arms_armed");
        if (keyBind == "CANNONS" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = (!head && !body && !arms);
        };
        if (keyBind == "CHARGED_BEAM" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = (head || body || arms);
        };
      };
      return result;
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        var head = (entity.getData("skyhighheroes:dyn/cannons_head_armed")) ? "T" : "F";
        var body = (entity.getData("skyhighheroes:dyn/cannons_body_armed")) ? "T" : "F";
        var arms = (entity.getData("skyhighheroes:dyn/cannons_arms_armed")) ? "T" : "F";
        if (modifier.name() == "fiskheroes:charged_beam" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          if (modifier.id() == "cannons_" + head + body + arms) {
            result = true;
          };
        };
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        var nbt = system.mainNBT(entity);
        switch (argList[1]) {
          case "arm":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
                manager.setBoolean(nbt, "cannonsHead", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>head<s> cannons!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
                manager.setBoolean(nbt, "cannonsBody", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>body<s> cannons!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
                manager.setBoolean(nbt, "cannonsArms", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> cannons!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
                manager.setBoolean(nbt, "cannonsHead", true);
                manager.setBoolean(nbt, "cannonsBody", true);
                manager.setBoolean(nbt, "cannonsArms", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>all<s> cannons!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>cannon set<e>!");
                break;
            };
            break;
          case "disarm":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
                manager.setBoolean(nbt, "cannonsHead", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>head<s> cannons!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
                manager.setBoolean(nbt, "cannonsBody", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> cannons!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
                manager.setBoolean(nbt, "cannonsArms", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> cannons!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
                manager.setBoolean(nbt, "cannonsHead", false);
                manager.setBoolean(nbt, "cannonsBody", false);
                manager.setBoolean(nbt, "cannonsArms", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> cannons!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>cannon set<e>!");
                break;
            };
            break;
          case "show":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>head<s> cannons!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left head<s> cannon!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right head<s> cannon!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>body<s> cannons!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left body<s> cannon!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right body<s> cannon!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>arm<s> cannons!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> cannon!");
                break;
              case "leftArmBottom":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm bottom<s> cannon!");
                break;
              case "leftArmFront":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm front<s> cannon!");
                break;
              case "leftArmBack":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm back<s> cannon!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm<s> cannon!");
                break;
              case "rightArmBottom":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm bottom<s> cannon!");
                break;
              case "rightArmFront":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm front<s> cannon!");
                break;
              case "rightArmBack":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm back<s> cannon!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>all<s> cannons!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>cannon<e>!");
                break;
            };
            break;
          case "hide":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>head<s> cannons!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left head<s> cannon!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right head<s> cannon!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>body<s> cannons!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left body<s> cannon!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right body<s> cannon!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>arm<s> cannons!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> cannon!");
                break;
              case "leftArmBottom":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm bottom<s> cannon!");
                break;
              case "leftArmFront":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm front<s> cannon!");
                break;
              case "leftArmBack":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm back<s> cannon!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm<s> cannon!");
                break;
              case "rightArmBottom":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm bottom<s> cannon!");
                break;
              case "rightArmFront":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm front<s> cannon!");
                break;
              case "rightArmBack":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm back<s> cannon!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>all<s> cannons!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>cannon<e>!");
                break;
            };
            break;
          case "set":
            switch (argList[2]) {
              case "holo":
                manager.setBoolean(nbt, "holoCannons", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoCannons")));
                system.moduleMessage(this, entity, "<n>Hologram set to <nh>" + nbt.getBoolean("holoCannons") + "<n>!");
                break;
              case "flushHead":
                manager.setData(entity, "skyhighheroes:dyn/cannon_head_flush_enabled", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : entity.getData("skyhighheroes:dyn/cannon_head_flush_enabled")));
                manager.setBoolean(nbt, "flushHeadCannons", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("flushHeadCannons")));
                system.moduleMessage(this, entity, "<n>Flush Head Cannons set to <nh>" + nbt.getBoolean("flushHeadCannons") + "<n>!");
                break;
              case "flushBody":
                manager.setData(entity, "skyhighheroes:dyn/cannon_body_flush_enabled", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : entity.getData("skyhighheroes:dyn/cannon_body_flush_enabled")));
                manager.setBoolean(nbt, "flushBodyCannons", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("flushBodyCannons")));
                system.moduleMessage(this, entity, "<n>Flush Body Cannons set to <nh>" + nbt.getBoolean("flushBodyCannons") + "<n>!");
                break;
              case "flushLeftArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_flush_enabled", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : entity.getData("skyhighheroes:dyn/cannon_left_arm_flush_enabled")));
                manager.setBoolean(nbt, "flushLeftArmCannons", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("flushLeftArmCannons")));
                system.moduleMessage(this, entity, "<n>Flush Left Arm Cannon set to <nh>" + nbt.getBoolean("flushLeftArmCannons") + "<n>!");
                break;
              case "flushRightArm":
                manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_flush_enabled", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : entity.getData("skyhighheroes:dyn/cannon_right_arm_flush_enabled")));
                manager.setBoolean(nbt, "flushRightArmCannons", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("flushRightArmCannons")));
                system.moduleMessage(this, entity, "<n>Flush Right Arm Cannon set to <nh>" + nbt.getBoolean("flushRightArmCannons") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>cannon<e> setting!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Cannons commands:");
            system.moduleMessage(this, entity, "<n>!cannon status <nh>-<n> Shows status of cannons");
            system.moduleMessage(this, entity, "<n>!cannon arm <head|body|arms|*> <nh>-<n> Arms set of cannons");
            system.moduleMessage(this, entity, "<n>!cannon disarm <head|body|arms|*> <nh>-<n> Disarm set of cannons");
            system.moduleMessage(this, entity, "<n>!cannon show <head|body|arms|*> <nh>-<n> Deploys cannons");
            system.moduleMessage(this, entity, "<n>!cannon hide <head|body|arms|*> <nh>-<n> Retracts cannons");
            system.moduleMessage(this, entity, "<n>!cannon set <holo|flushHead|flushLeftArm|flushRightArm> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!cannon help <nh>-<n> Shows cannons commands");
            break;
          case "status":
            var headSet = (entity.getData("skyhighheroes:dyn/cannons_head_timer") > 0);
            var bodySet = (entity.getData("skyhighheroes:dyn/cannons_body_timer") > 0);
            var armSet = (entity.getData("skyhighheroes:dyn/cannons_arms_timer") > 0);
            system.moduleMessage(this, entity, "<n>Cannons status:");
            system.moduleMessage(this, entity, "<n>Head set: <nh>" + (entity.getData("skyhighheroes:dyn/cannons_head_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Body set: <nh>" + (entity.getData("skyhighheroes:dyn/cannons_body_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Arm set: <nh>" + (entity.getData("skyhighheroes:dyn/cannons_arms_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Left Head: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_head_left_deploy_timer") > 0) || headSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Head: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_head_right_deploy_timer") > 0) || headSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Body: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_body_left_deploy_timer") > 0) || bodySet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Body: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_body_right_deploy_timer") > 0) || bodySet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Arm bottom: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_left_arm_bottom_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Arm front: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_left_arm_front_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Arm back: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_left_arm_back_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Arm bottom: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_right_arm_bottom_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Arm front: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_right_arm_front_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Arm back: <nh>" + ((entity.getData("skyhighheroes:dyn/cannon_right_arm_back_deploy_timer") > 0) || armSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Flush Head Cannons: <nh>" + (entity.getData("skyhighheroes:dyn/cannon_head_flush_enabled") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Flush Body Cannons: <nh>" + (entity.getData("skyhighheroes:dyn/cannon_body_flush_enabled") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Flush Left Arm Cannon: <nh>" + (entity.getData("skyhighheroes:dyn/cannon_left_arm_flush_enabled") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Flush Right Arm Cannon: <nh>" + (entity.getData("skyhighheroes:dyn/cannon_right_arm_flush_enabled") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Hologram: <nh>" + (nbt.getBoolean("holoCannons") ? "ENABLED" : "DISABLED"));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>cannons<e> command! Try <eh>!cannon help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>cannons<e> command! Try <eh>!cannon help<e> for a list of commands!");
      };
    },
    armHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "headCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
          manager.setBoolean(nbt, "cannonsHead", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>head<s> cannons!");
          return;
        case "bodyCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
          manager.setBoolean(nbt, "cannonsBody", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>body<s> cannons!");
          return;
        case "armCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
          manager.setBoolean(nbt, "cannonsArms", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> cannons!");
          return;
        case "cannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
          manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
          manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
          manager.setBoolean(nbt, "cannonsHead", true);
          manager.setBoolean(nbt, "cannonsBody", true);
          manager.setBoolean(nbt, "cannonsArms", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>all<s> cannons!");
          return;
      };
    },
    disarmHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "headCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
          manager.setBoolean(nbt, "cannonsHead", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>head<s> cannons!");
          return;
        case "bodyCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
          manager.setBoolean(nbt, "cannonsBody", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> cannons!");
          return;
        case "armCannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
          manager.setBoolean(nbt, "cannonsArms", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> cannons!");
          return;
        case "cannons":
          manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
          manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
          manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
          manager.setBoolean(nbt, "cannonsHead", false);
          manager.setBoolean(nbt, "cannonsBody", false);
          manager.setBoolean(nbt, "cannonsArms", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> cannons!");
          return;
      };
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setBoolean(nbt, "cannonsHead", false);
      manager.setBoolean(nbt, "cannonsBody", false);
      manager.setBoolean(nbt, "cannonsArms", false);
      manager.setData(entity, "skyhighheroes:dyn/cannons_arms", false);
      manager.setData(entity, "skyhighheroes:dyn/cannons_body", false);
      manager.setData(entity, "skyhighheroes:dyn/cannons_head", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", false);
    },
    tickHandler: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!system.hasEnoughEnergy(entity, manager, "cannons1") || !system.hasEnoughEnergy(entity, manager, "cannons2") || !system.hasEnoughEnergy(entity, manager, "cannons3") || !system.hasEnoughEnergy(entity, manager, "cannonsCharging1") || !system.hasEnoughEnergy(entity, manager, "cannonsCharging2") || !system.hasEnoughEnergy(entity, manager, "cannonsCharging3")) {
        manager.setData(entity, "fiskheroes:beam_charge", 0.0);
        manager.setData(entity, "fiskheroes:beam_charging", false);
        manager.setData(entity, "fiskheroes:beam_shooting", 0.0);
        manager.setData(entity, "fiskheroes:beam_shooting_timer", 0.0);
        manager.setData(entity, "skyhighheroes:dyn/cannons_arms", false);
        manager.setData(entity, "skyhighheroes:dyn/cannons_body", false);
        manager.setData(entity, "skyhighheroes:dyn/cannons_head", false);
      };
      var head = entity.getData("skyhighheroes:dyn/cannons_head_armed") && entity.getData("fiskheroes:beam_charging");
      var body = entity.getData("skyhighheroes:dyn/cannons_body_armed") && entity.getData("fiskheroes:beam_charging");
      var arms = entity.getData("skyhighheroes:dyn/cannons_arms_armed") && entity.getData("fiskheroes:beam_charging");
      if ((!entity.getData("skyhighheroes:dyn/cannons_head_armed") || !entity.getData("skyhighheroes:dyn/cannons_body_armed") || !entity.getData("skyhighheroes:dyn/cannons_arms_armed")) && cannonMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", true);
        manager.setBoolean(nbt, "cannonsHead", true);
        manager.setBoolean(nbt, "cannonsBody", true);
        manager.setBoolean(nbt, "cannonsArms", true);
        system.moduleMessage(this, entity, "<s>Armed <sh>all<s> cannons!");
      };
      if ((entity.getData("skyhighheroes:dyn/cannons_head_armed") || entity.getData("skyhighheroes:dyn/cannons_body_armed") || entity.getData("skyhighheroes:dyn/cannons_arms_armed")) && cannonMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", false);
        manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", false);
        manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", false);
        manager.setBoolean(nbt, "cannonsHead", false);
        manager.setBoolean(nbt, "cannonsBody", false);
        manager.setBoolean(nbt, "cannonsArms", false);
        system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> cannons!");
      };
      if ((entity.getData("skyhighheroes:dyn/cannons_head_armed") || entity.getData("skyhighheroes:dyn/cannons_body_armed") || entity.getData("skyhighheroes:dyn/cannons_arms_armed")) && entity.getData("fiskheroes:beam_charge") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/cannons_arms", arms);
        manager.setData(entity, "skyhighheroes:dyn/cannons_body", body);
        manager.setData(entity, "skyhighheroes:dyn/cannons_head", head);
        if (head && body && arms) {
          if (entity.getData("fiskheroes:beam_shooting") > 0) {
            system.useEnergy(entity, manager, "cannons3");
          } else if (entity.getData("fiskheroes:beam_charging")) {
            system.useEnergy(entity, manager, "cannonsCharging3");
          };
        } else if ((head && body && !arms) || (head && !body && arms) || (!head && body && arms)) {
          if (head && body && !arms) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons2");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging2");
            };
          };
          if (head && !body && arms) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons2");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging2");
            };
          };
          if (!head && body && arms) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons2");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging2");
            };
          };
        } else {
          if (arms) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons1");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging1");
            };
          };
          if (body) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons1");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging1");
            };
          };
          if (head) {
            if (entity.getData("fiskheroes:beam_shooting") > 0) {
              system.useEnergy(entity, manager, "cannons1");
            } else if (entity.getData("fiskheroes:beam_charging")) {
              system.useEnergy(entity, manager, "cannonsCharging1");
            };
          };
        };
        if (entity.getData("fiskheroes:beam_charge") < 0.1) {
          if (head && body && arms) {
            system.shoutMessage(entity, "Activating Cannons!", 16);
          } else if ((head && body && !arms) || (head && !body && arms) || (!head && body && arms)) {
            if (head && body && !arms) {
              system.shoutMessage(entity, "Activating Head and Body Cannons!", 16);
            };
            if (head && !body && arms) {
              system.shoutMessage(entity, "Activating Body and Arm Cannons!", 16);              
            };
            if (!head && body && arms) {
              system.shoutMessage(entity, "Activating Body and Arm Cannons!", 16);
            };
          } else {
            if (head) {
              system.shoutMessage(entity, "Activating Head Cannons!", 16);
            };
            if (body) {
              system.shoutMessage(entity, "Activating Body Cannons!", 16);
            };
            if (arms) {
              system.shoutMessage(entity, "Activating Arm Cannons!", 16);
            };
          };
        };
      };
      manager.setData(entity, "skyhighheroes:dyn/cannon_head_flush", entity.getData("skyhighheroes:dyn/cannon_head_flush_enabled"));
      manager.setData(entity, "skyhighheroes:dyn/cannon_body_flush", entity.getData("skyhighheroes:dyn/cannon_body_flush_enabled"));
      manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_flush", entity.getData("skyhighheroes:dyn/cannon_left_arm_flush_enabled"));
      manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_flush", entity.getData("skyhighheroes:dyn/cannon_right_arm_flush_enabled"));
      cannonMultiTap.tapReset(entity, manager);
    },
    fightOrFlight: function (entity, manager) {
      if (!entity.getWornChestplate().nbt().getBoolean("cannonsHead") || !entity.getWornChestplate().nbt().getBoolean("cannonsBody") || !entity.getWornChestplate().nbt().getBoolean("cannonsArms")) {
        manager.setBoolean(entity.getWornChestplate().nbt(), "cannonsHead", true);
        manager.setBoolean(entity.getWornChestplate().nbt(), "cannonsBody", true);
        manager.setBoolean(entity.getWornChestplate().nbt(), "cannonsArms", true);
        system.systemMessage(entity, "<n>Automatically armed <nh>cannons<n>!");
      }
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("cannonsHead")) {
        manager.setBoolean(nbt, "cannonsHead", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannons_head_armed", nbt.getBoolean("cannonsHead"));
      if (!nbt.hasKey("cannonsBody")) {
        manager.setBoolean(nbt, "cannonsBody", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannons_body_armed", nbt.getBoolean("cannonsBody"));
      if (!nbt.hasKey("cannonsArms")) {
        manager.setBoolean(nbt, "cannonsArms", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannons_arms_armed", nbt.getBoolean("cannonsArms"));
      if (!nbt.hasKey("flushHeadCannons")) {
        manager.setBoolean(nbt, "flushHeadCannons", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannon_head_flush_enabled", nbt.getBoolean("flushHeadCannons"));
      if (!nbt.hasKey("flushBodyCannons")) {
        manager.setBoolean(nbt, "flushBodyCannons", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannon_body_flush_enabled", nbt.getBoolean("flushBodyCannons"));
      if (!nbt.hasKey("flushLeftArmCannons")) {
        manager.setBoolean(nbt, "flushLeftArmCannons", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_flush_enabled", nbt.getBoolean("flushLeftArmCannons"));
      if (!nbt.hasKey("flushRightArmCannons")) {
        manager.setBoolean(nbt, "flushRightArmCannons", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_flush_enabled", nbt.getBoolean("flushRightArmCannons"));
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "fiskheroes:beam_charge", 0.0);
      manager.setData(entity, "fiskheroes:beam_charging", false);
      manager.setData(entity, "fiskheroes:beam_shooting", 0.0);
      manager.setData(entity, "fiskheroes:beam_shooting_timer", 0.0);
      manager.setData(entity, "skyhighheroes:dyn/cannons_arms", false);
      manager.setData(entity, "skyhighheroes:dyn/cannons_body", false);
      manager.setData(entity, "skyhighheroes:dyn/cannons_head", false);
    }
  };
};