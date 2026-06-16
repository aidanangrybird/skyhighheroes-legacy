/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  var shieldMultiTap = system.initMultiTap("skyhighheroes:dyn/shield");
  return {
    name: "shields",
    moduleMessageName: "Shields",
    type: 14,
    command: "shield",
    cyberOverviewButtons: {
      "shield_left_deploy": {
        borderingButtons: {
          top: "rocket_left_arm_outer_deploy",
          bottom: "cannon_left_arm_bottom_deploy",
          right: "cannon_left_arm_back_deploy",
          left: "cannon_left_arm_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", !entity.getData("skyhighheroes:dyn/shield_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/shield_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> shield!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> shield!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "shield_right_deploy": {
        borderingButtons: {
          top: "rocket_right_arm_outer_deploy",
          bottom: "cannon_right_arm_bottom_deploy",
          left: "cannon_right_arm_back_deploy",
          right: "cannon_right_arm_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", !entity.getData("skyhighheroes:dyn/shield_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/shield_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> shield!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> shield!");
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
      "blades_shields": {
        parent: "main",
        prevButton: "main_blades_shields",
        buttons: {
          "shield_left_armed": {
            borderingButtons: {
              top: "blade_left_stealth",
              right: "shield_right_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", !entity.getData("skyhighheroes:dyn/shield_left_armed"));
                manager.setBoolean(nbt, "shieldsLeft", !nbt.getBoolean("shieldsLeft"));
                if (entity.getData("skyhighheroes:dyn/shield_left_armed")) {
                  system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> shield!");
                } else {
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> shield!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_blades_shields");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "shield_right_armed": {
            borderingButtons: {
              top: "blade_right_stealth",
              left: "shield_left_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", !entity.getData("skyhighheroes:dyn/shield_right_armed"));
                manager.setBoolean(nbt, "shieldsRight", !nbt.getBoolean("shieldsRight"));
                if (entity.getData("skyhighheroes:dyn/shield_right_armed")) {
                  system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> shield!");
                } else {
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> shield!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_blades_shields");
                system.setMenu(entity, manager, "main");
              },
            }
          },
        }
      }
    },
    cyberMainButton: {
      buttonID: "main_blades_shields",
      borderingButtons: {
        top: "main_blades",
        bottom: "main_suits"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setButton(entity, manager, "shield_left_armed");
          system.setMenu(entity, manager, "blades_shields");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/interface", false);
        }
      }
    },
    helpMessage: "<n>!shield <nh>-<n> Shields",
    disabledMessage: "<e>Module <eh>shields<e> is disabled!",
    keyBinds: function (hero, color) {
      hero.addKeyBindFunc("SHIELDS", (player, manager) => {
        //system.moduleMessage(this, player, "<e>To arm a shield do <eh>!shield arm <left|right><e>.");
        shieldMultiTap.tap(player, manager);
        return true;
      }, "\u00A7" + color + "Shields (x2 to arm)", 2);
      hero.addKeyBindFunc("SHIELD", (player, manager) => {
        shieldMultiTap.tap(player, manager);
        return true;
      }, "\u00A7" + color + "Shields (x2 to disarm)", 2);
    },
    isKeyBindEnabled: function (entity, keyBind) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        var left = entity.getData("skyhighheroes:dyn/shield_left_armed");
        var right = entity.getData("skyhighheroes:dyn/shield_right_armed");
        if (keyBind == "SHIELDS" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = (!left && !right);
        };
        if (keyBind == "SHIELD" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = (left || right);
        };
      };
      return result;
    },
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        var nbt = system.mainNBT(entity);
        switch (argList[1]) {
          case "arm":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", true);
                manager.setBoolean(nbt, "shieldsLeft", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> shield!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", true);
                manager.setBoolean(nbt, "shieldsRight", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> shield!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", true);
                manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", true);
                manager.setBoolean(nbt, "shieldsLeft", true);
                manager.setBoolean(nbt, "shieldsRight", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>all<s> shields!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>shield<e>!");
                break;
            };
            break;
          case "disarm":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", false);
                manager.setBoolean(nbt, "shieldsLeft", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> shield!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", false);
                manager.setBoolean(nbt, "shieldsRight", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> shield!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", false);
                manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", false);
                manager.setBoolean(nbt, "shieldsLeft", false);
                manager.setBoolean(nbt, "shieldsRight", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> shields!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>shield<e>!");
                break;
            };
            break;
          case "show":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> shield!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm<s> shield!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>all<s> shields!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>shield<e>!");
                break;
            };
            break;
          case "hide":
            switch (argList[2]) {
              case "left":
                if (!entity.getData("skyhighheroes:dyn/shield_left_armed") && entity.getData("fiskheroes:shield_timer") > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", false);
                  system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> shield!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to retract armed <eh>left arm<e> shield!");
                };
                break;
              case "right":
                if (!entity.getData("skyhighheroes:dyn/shield_right_armed") && entity.getData("fiskheroes:shield_timer") > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", false);
                  system.moduleMessage(this, entity, "<s>Stowed <sh>right arm<s> shield!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to retract armed <eh>right arm<e> shield!");
                };
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>all<s> shields!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>shield<e>!");
                break;
            };
            break;
          case "set":
            switch (argList[2]) {
              case "holo":
                manager.setBoolean(nbt, "holoShields", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoShields")));
                system.moduleMessage(this, entity, "<n>holoShields set to <nh>" + nbt.getBoolean("holoShields") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>shield<e> setting!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Shields commands:");
            system.moduleMessage(this, entity, "<n>!shield arm <left|right|*> <nh>-<n> Arms shields");
            system.moduleMessage(this, entity, "<n>!shield disarm <left|right|*> <nh>-<n> Disarms shields");
            system.moduleMessage(this, entity, "<n>!shield show <left|right|*> <nh>-<n> Deploys shields");
            system.moduleMessage(this, entity, "<n>!shield hide <left|right|*> <nh>-<n> Retracts disarmed shields");
            system.moduleMessage(this, entity, "<n>!shield set <holo> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!shield status <nh>-<n> Shows status of shields");
            system.moduleMessage(this, entity, "<n>!shield help <nh>-<n> Shows shields commands");
            break;
          case "status":
            system.moduleMessage(this, entity, "<n>Shields status:");
            system.moduleMessage(this, entity, "<n>Left: <nh>" + (entity.getData("skyhighheroes:dyn/shield_left_armed") ? "ARMED" : "DISARMED") + " <n>-<nh> " + ((entity.getData("skyhighheroes:dyn/shield_left_deploy_timer") > 0) || (entity.getData("skyhighheroes:dyn/shield_left_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right: <nh>" + (entity.getData("skyhighheroes:dyn/shield_right_armed") ? "ARMED" : "DISARMED") + " <n>-<nh> " + ((entity.getData("skyhighheroes:dyn/shield_right_deploy_timer") > 0) || (entity.getData("skyhighheroes:dyn/shield_right_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Hologram: <nh>" + (nbt.getBoolean("holoShields") ? "ENABLED" : "DISABLED"));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>shields<e> command! Try <eh>!shield help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>shields<e> command! Try <eh>!shield help<e> for a list of commands!");
      };
    },
    armHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "leftShield":
          manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", true);
          manager.setBoolean(nbt, "shieldsLeft", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> shield!");
          return;
        case "rightShield":
          manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", true);
          manager.setBoolean(nbt, "shieldsRight", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> shield!");
          return;
        case "shields":
          manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", true);
          manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", true);
          manager.setBoolean(nbt, "shieldsLeft", true);
          manager.setBoolean(nbt, "shieldsRight", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>all<s> shields!");
          return;
      };
    },
    disarmHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "leftShield":
          manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", false);
          manager.setBoolean(nbt, "shieldsLeft", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> shield!");
          return;
        case "rightShield":
          manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", false);
          manager.setBoolean(nbt, "shieldsRight", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> shield!");
          return;
        case "shields":
          manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", false);
          manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", false);
          manager.setBoolean(nbt, "shieldsLeft", false);
          manager.setBoolean(nbt, "shieldsRight", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> shields!");
          return;
      };
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      var left = (entity.getData("skyhighheroes:dyn/shield_left_armed")) ? "T" : "F";
      var right = (entity.getData("skyhighheroes:dyn/shield_right_armed")) ? "T" : "F";
      if (modifier.name() == "fiskheroes:shield" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
        if (modifier.id() == "shields_" + left + right) {
          result = true;
        };
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    initDamageProfiles: function (hero) {
      hero.addDamageProfile("SHIELD", {
        "types": {
          "BLUNT": 1.0
        }
      });
    },
    getDamageProfile: function (entity) {
      var result = null;
      if (!system.isModuleDisabled(entity, this.name)) {
        if (entity.getData("skyhighheroes:dyn/shield_left_timer") == 1 || entity.getData("skyhighheroes:dyn/shield_right_timer") == 1) {
          result = "SHIELD";
        };
      };
      return result;
    },
    initAttributeProfiles: function (hero) {
      hero.addAttributeProfile("SHIELD_LEFT_ARM", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -0.75, 1);
        profile.addAttribute("SPRINT_SPEED", 0.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("STEP_HEIGHT", -1.0, 1);
        profile.addAttribute("KNOCKBACK", 0.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
      hero.addAttributeProfile("SHIELD_RIGHT_ARM", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -0.75, 1);
        profile.addAttribute("SPRINT_SPEED", 0.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("STEP_HEIGHT", -1.0, 1);
        profile.addAttribute("KNOCKBACK", 0.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
      hero.addAttributeProfile("SHIELD_BOTH_ARMS", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -0.75, 1);
        profile.addAttribute("SPRINT_SPEED", 0.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("STEP_HEIGHT", -1.0, 1);
        profile.addAttribute("KNOCKBACK", 0.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
    },
    getAttributeProfile: function (entity) {
      var result = null;
      if (!system.isModuleDisabled(entity, this.name)) {
        if (entity.getData("fiskheroes:shield_blocking_timer") > 0 && entity.getData("skyhighheroes:dyn/shield_left_timer") == 1) {
          result = "SHIELD_LEFT_ARM";
        };
        if (entity.getData("fiskheroes:shield_blocking_timer") > 0 && entity.getData("skyhighheroes:dyn/shield_right_timer") == 1) {
          result = "SHIELD_RIGHT_ARM";
        };
        if (entity.getData("fiskheroes:shield_blocking_timer") > 0 && entity.getData("skyhighheroes:dyn/shield_left_timer") == 1 && entity.getData("skyhighheroes:dyn/shield_right_timer") == 1) {
          result = "SHIELD_BOTH_ARMS";
        };
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setBoolean(nbt, "shieldsLeft", false);
      manager.setBoolean(nbt, "shieldsRight", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_left", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_right", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", false);
    },
    tickHandler: function (entity, manager) {
      if (!system.hasEnoughEnergy(entity, manager, "shield") || !system.hasEnoughEnergy(entity, manager, "shieldDamaged")) {
        manager.setData(entity, "fiskheroes:shield", false);
        manager.setData(entity, "skyhighheroes:dyn/shield_left", false);
        manager.setData(entity, "skyhighheroes:dyn/shield_right", false);
      };
      var left = entity.getData("skyhighheroes:dyn/shield_left_armed") && entity.getData("fiskheroes:shield");
      var right = entity.getData("skyhighheroes:dyn/shield_right_armed") && entity.getData("fiskheroes:shield");
      if ((!entity.getData("skyhighheroes:dyn/shield_left_armed") || !entity.getData("skyhighheroes:dyn/shield_right_armed")) && shieldMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        var nbt = system.mainNBT(entity);
        manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", true);
        manager.setBoolean(nbt, "shieldsLeft", true);
        manager.setBoolean(nbt, "shieldsRight", true);
        system.moduleMessage(this, entity, "<s>Armed <sh>all<s> shields!");
      };
      if ((entity.getData("skyhighheroes:dyn/shield_left_armed") || entity.getData("skyhighheroes:dyn/shield_right_armed")) && shieldMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        var nbt = system.mainNBT(entity);
        manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", false);
        manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", false);
        manager.setBoolean(nbt, "shieldsLeft", false);
        manager.setBoolean(nbt, "shieldsRight", false);
        system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> shields!");
      };
      if ((entity.getData("skyhighheroes:dyn/shield_left_armed") || entity.getData("skyhighheroes:dyn/shield_right_armed")) && entity.getData("fiskheroes:shield_timer") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/shield_left", left);
        manager.setData(entity, "skyhighheroes:dyn/shield_right", right);
        if (left) {
          if (entity.getData("fiskheroes:ticks_since_shield_damaged") == 0) {
            system.useEnergy(entity, manager, "shieldDamaged");
          };
          system.useEnergy(entity, manager, "shield");
        };
        if (right) {
          if (entity.getData("fiskheroes:ticks_since_shield_damaged") == 0) {
            system.useEnergy(entity, manager, "shieldDamaged");
          };
          system.useEnergy(entity, manager, "shield");
        };
        if (entity.getData("fiskheroes:shield_timer") < 0.5) {
          if (left && right) {
            system.shoutMessage(entity, "Activating Shields!", 16);
          } else {
            if (left) {
              system.shoutMessage(entity, "Activating Left Shield!", 16);
            };
            if (right) {
              system.shoutMessage(entity, "Activating Right Shield!", 16);
            };
          };
        };
      };
      shieldMultiTap.tapReset(entity, manager);
    },
    fightOrFlight: function (entity, manager) {
      if (!entity.getWornChestplate().nbt().getBoolean("shieldsLeft") || !entity.getWornChestplate().nbt().getBoolean("shieldsRight")) {
        manager.setBoolean(entity.getWornChestplate().nbt(), "shieldsLeft", true);
        manager.setBoolean(entity.getWornChestplate().nbt(), "shieldsRight", true);
        system.systemMessage(entity, "<n>Automatically armed <nh>shields<n>!");
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("shieldsLeft")) {
        manager.setBoolean(nbt, "shieldsLeft", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/shield_left_armed", nbt.getBoolean("shieldsLeft"));
      if (!nbt.hasKey("shieldsRight")) {
        manager.setBoolean(nbt, "shieldsRight", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/shield_right_armed", nbt.getBoolean("shieldsRight"));
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "fiskheroes:shield", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_left", false);
      manager.setData(entity, "skyhighheroes:dyn/shield_right", false);
    }
  };
};