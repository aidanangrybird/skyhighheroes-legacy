/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  var bladeMultiTap = system.initMultiTap("skyhighheroes:dyn/blade");
  return {
    name: "blades",
    moduleMessageName: "Blades",
    type: 14,
    command: "blade",
    cyberOverviewButtons: {
      "blade_left_deploy": {
        borderingButtons: {
          top: "rocket_left_arm_front_deploy",
          bottom: "cannon_left_arm_bottom_deploy",
          left: "intake_head_left_start_up",
          right: "cannon_left_arm_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", !entity.getData("skyhighheroes:dyn/blade_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/blade_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> blade!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> blade!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "blade_right_deploy": {
        borderingButtons: {
          top: "rocket_right_arm_front_deploy",
          bottom: "cannon_right_arm_bottom_deploy",
          right: "intake_head_right_start_up",
          left: "cannon_right_arm_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", !entity.getData("skyhighheroes:dyn/blade_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/blade_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm<s> blade!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm<s> blade!");
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
          "blade_left_armed": {
            borderingButtons: {
              bottom: "blade_left_stealth",
              right: "blade_right_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", !entity.getData("skyhighheroes:dyn/blade_left_armed"));
                manager.setBoolean(nbt, "bladesLeft", !nbt.getBoolean("bladesLeft"));
                if (entity.getData("skyhighheroes:dyn/blade_left_armed")) {
                  system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> blade!");
                } else {
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> blade!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_blades_shields");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "blade_left_stealth": {
            borderingButtons: {
              top: "blade_left_armed",
              bottom: "shield_left_armed",
              right: "blade_right_stealth",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", !entity.getData("skyhighheroes:dyn/blade_left_stealth_enabled"));
                manager.setBoolean(nbt, "bladesLeftStealth", !nbt.getBoolean("bladesLeftStealth"));
                if (entity.getData("skyhighheroes:dyn/blade_left_stealth_enabled")) {
                  systemMessage(entity, "<n>Opening core!");
                } else {
                  systemMessage(entity, "<n>Closing core!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_blades_shields");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "blade_right_armed": {
            borderingButtons: {
              bottom: "blade_right_stealth",
              left: "blade_left_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", !entity.getData("skyhighheroes:dyn/blade_right_armed"));
                manager.setBoolean(nbt, "bladesRight", !nbt.getBoolean("bladesRight"));
                if (entity.getData("skyhighheroes:dyn/blade_right_armed")) {
                  system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> blade!");
                } else {
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> blade!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_blades_shields");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "blade_right_stealth": {
            borderingButtons: {
              top: "blade_right_armed",
              bottom: "shield_right_armed",
              left: "blade_left_stealth",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", !entity.getData("skyhighheroes:dyn/blade_right_stealth_enabled"));
                manager.setBoolean(nbt, "bladesRightStealth", !nbt.getBoolean("bladesRightStealth"));
                if (entity.getData("skyhighheroes:dyn/blade_right_stealth_enabled")) {
                  system.moduleMessage(this, entity, "<s>Enabled stealth mode on <sh>right arm<s> blade!");
                } else {
                  system.moduleMessage(this, entity, "<s>Disabled stealth mode on <sh>right arm<s> blade!");
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
        top: "main_cannons",
        bottom: "main_suits"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setButton(entity, manager, "blade_left_armed");
          system.setMenu(entity, manager, "blades_shields");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/interface", false);
        }
      }
    },
    helpMessage: "<n>!blade <nh>-<n> Blades",
    disabledMessage: "<e>Module <eh>bladeSystem<e> is disabled!",
    keyBinds: function (hero, color) {
      hero.addKeyBindFunc("BLADES", (player, manager) => {
        //system.moduleMessage(this, player, "<e>To arm a blade do <eh>!blade arm <left|right><e>.");
        bladeMultiTap.tap(player, manager);
        return false;
      }, "\u00A7" + color + "Blades (x2 to arm)", 1);
      hero.addKeyBindFunc("BLADE", (player, manager) => {
        bladeMultiTap.tap(player, manager);
        return true;
      }, "\u00A7" + color + "Blades (x2 to disarm)", 1);
    },
    isKeyBindEnabled: function (entity, keyBind) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        var left = entity.getData("skyhighheroes:dyn/blade_left_armed");
        var right = entity.getData("skyhighheroes:dyn/blade_right_armed");
        if (keyBind == "BLADES" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = (!left && !right);
        };
        if (keyBind == "BLADE" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
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
                manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
                manager.setBoolean(nbt, "bladesLeft", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
                manager.setBoolean(nbt, "bladesRight", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
                manager.setBoolean(nbt, "bladesLeft", true);
                manager.setBoolean(nbt, "bladesRight", true);
                system.moduleMessage(this, entity, "<s>Armed <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "disarm":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", false);
                manager.setBoolean(nbt, "bladesLeft", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", false);
                manager.setBoolean(nbt, "bladesRight", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", false);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", false);
                manager.setBoolean(nbt, "bladesLeft", false);
                manager.setBoolean(nbt, "bladesRight", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "show":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "hide":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "stealthOn":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", true);
                manager.setBoolean(nbt, "bladesLeftStealth", true);
                system.moduleMessage(this, entity, "<s>Enabled stealth mode on <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", true);
                manager.setBoolean(nbt, "bladesRightStealth", true);
                system.moduleMessage(this, entity, "<s>Enabled stealth mode on <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", true);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", true);
                manager.setBoolean(nbt, "bladesLeftStealth", true);
                manager.setBoolean(nbt, "bladesRightStealth", true);
                system.moduleMessage(this, entity, "<s>Enabled stealth mode on <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "stealthOff":
            switch (argList[2]) {
              case "left":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", false);
                manager.setBoolean(nbt, "bladesLeftStealth", false);
                system.moduleMessage(this, entity, "<s>Disabled stealth mode on <sh>left arm<s> blade!");
                break;
              case "right":
                manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", false);
                manager.setBoolean(nbt, "bladesRightStealth", false);
                system.moduleMessage(this, entity, "<s>Disabled stealth mode on <sh>right arm<s> blade!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", false);
                manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", false);
                manager.setBoolean(nbt, "bladesLeftStealth", false);
                manager.setBoolean(nbt, "bladesRightStealth", false);
                system.moduleMessage(this, entity, "<s>Disabled stealth mode on <sh>all<s> blades!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e>!");
                break;
            };
            break;
          case "set":
            switch (argList[2]) {
              case "holo":
                manager.setBoolean(nbt, "holoBlades", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoBlades")));
                system.moduleMessage(this, entity, "<n>Hologram set to <nh>" + nbt.getBoolean("holoBlades") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>blade<e> setting!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Blades commands:");
            system.moduleMessage(this, entity, "<n>!blade arm <left|right|*> <nh>-<n> Arms blades");
            system.moduleMessage(this, entity, "<n>!blade disarm <left|right|*> <nh>-<n> Disarms blades");
            system.moduleMessage(this, entity, "<n>!blade show <left|right|*> <nh>-<n> Deploys blades");
            system.moduleMessage(this, entity, "<n>!blade hide <left|right|*> <nh>-<n> Retracts disarmed blades");
            system.moduleMessage(this, entity, "<n>!blade stealthOn <left|right|*> <nh>-<n> Enables stealth mode for blades");
            system.moduleMessage(this, entity, "<n>!blade stealthOff <left|right|*> <nh>-<n> Disables stealth mode for blades");
            system.moduleMessage(this, entity, "<n>!blade set <holo> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!blade status <nh>-<n> Shows status of blades");
            system.moduleMessage(this, entity, "<n>!blade help <nh>-<n> Shows blades commands");
            break;
          case "status":
            system.moduleMessage(this, entity, "<n>Blades status:");
            system.moduleMessage(this, entity, "<n>Left: <nh>" + (entity.getData("skyhighheroes:dyn/blade_left_armed") ? "ARMED" : "DISARMED") + " <n>-<nh> " + ((entity.getData("skyhighheroes:dyn/blade_left_deploy_timer") > 0) || (entity.getData("skyhighheroes:dyn/blade_left_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left stealth mode: <nh>" + (entity.getData("skyhighheroes:dyn/blade_left_stealth_enabled") ? "ENGAGED" : "DISENGAGED"));
            system.moduleMessage(this, entity, "<n>Right: <nh>" + (entity.getData("skyhighheroes:dyn/blade_right_armed") ? "ARMED" : "DISARMED") + " <n>-<nh> " + ((entity.getData("skyhighheroes:dyn/blade_right_deploy_timer") > 0) || (entity.getData("skyhighheroes:dyn/blade_right_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right stealth mode: <nh>" + (entity.getData("skyhighheroes:dyn/blade_right_stealth_enabled") ? "ENGAGED" : "DISENGAGED"));
            system.moduleMessage(this, entity, "<n>Hologram: <nh>" + (nbt.getBoolean("holoBlades") ? "ENABLED" : "DISABLED"));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>blades<e> command! Try <eh>!blade help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>blades<e> command! Try <eh>!blade help<e> for a list of commands!");
      };
    },
    armHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "leftBlade":
          manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
          manager.setBoolean(nbt, "bladesLeft", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>left arm<s> blade!");
          return;
        case "rightBlade":
          manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
          manager.setBoolean(nbt, "bladesRight", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>right arm<s> blade!");
          return;
        case "blades":
          manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
          manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
          manager.setBoolean(nbt, "bladesLeft", true);
          manager.setBoolean(nbt, "bladesRight", true);
          system.moduleMessage(this, entity, "<s>Armed <sh>all<s> blades!");
          return;
      };
    },
    disarmHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "leftBlade":
          manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", false);
          manager.setBoolean(nbt, "bladesLeft", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>left arm<s> blade!");
          return;
        case "rightBlade":
          manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", false);
          manager.setBoolean(nbt, "bladesRight", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>right arm<s> blade!");
          return;
        case "blades":
          manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", false);
          manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", false);
          manager.setBoolean(nbt, "bladesLeft", false);
          manager.setBoolean(nbt, "bladesRight", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> blades!");
          return;
      };
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        if (modifier.name() == "fiskheroes:blade" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          result = true;
        };
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    initDamageProfiles: function (hero) {
      hero.addDamageProfile("BLADE", {
        "types": {
          "SHARP": 1.0
        }
      });
    },
    getDamageProfile: function (entity) {
      var result = null;
      if (!system.isModuleDisabled(entity, this.name)) {
        if (entity.getData("skyhighheroes:dyn/blade_left_timer") == 1 || entity.getData("skyhighheroes:dyn/blade_right_timer") == 1) {
          result = "BLADE";
        };
      };
      return result;
    },
    initAttributeProfiles: function (hero) {
      hero.addAttributeProfile("BLADE_LEFT_ARM", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 1.0, 1);
        profile.addAttribute("KNOCKBACK", 5.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
      });
      hero.addAttributeProfile("BLADE_RIGHT_ARM", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 1.0, 1);
        profile.addAttribute("KNOCKBACK", 5.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
      });
      hero.addAttributeProfile("BLADE_BOTH_ARMS", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 1.5, 1);
        profile.addAttribute("KNOCKBACK", 5.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", 14.0, 0);
      });
    },
    getAttributeProfile: function (entity) {
      var result = null;
      if (!system.isModuleDisabled(entity, this.name)) {
        if (entity.getData("skyhighheroes:dyn/blade_left_timer") == 1) {
          result = "BLADE_LEFT_ARM";
        };
        if (entity.getData("skyhighheroes:dyn/blade_right_timer") == 1) {
          result = "BLADE_RIGHT_ARM";
        };
        if (entity.getData("skyhighheroes:dyn/blade_left_timer") == 1 && entity.getData("skyhighheroes:dyn/blade_right_timer") == 1) {
          result = "BLADE_BOTH_ARMS";
        };
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setBoolean(nbt, "bladesLeft", false);
      manager.setBoolean(nbt, "bladesRight", false);
      manager.setBoolean(nbt, "bladesLeftStealth", false);
      manager.setBoolean(nbt, "bladesRightStealth", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_left", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_right", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", false);
    },
    tickHandler: function (entity, manager) {
      if (!system.hasEnoughEnergy(entity, manager, "blade")) {
        manager.setData(entity, "fiskheroes:blade", false);
        manager.setData(entity, "skyhighheroes:dyn/blade_left", false);
        manager.setData(entity, "skyhighheroes:dyn/blade_right", false);
      };
      var left = entity.getData("skyhighheroes:dyn/blade_left_armed") && entity.getData("fiskheroes:blade");
      var right = entity.getData("skyhighheroes:dyn/blade_right_armed") && entity.getData("fiskheroes:blade");
      if ((!entity.getData("skyhighheroes:dyn/blade_left_armed") || !entity.getData("skyhighheroes:dyn/blade_right_armed")) && bladeMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        var nbt = system.mainNBT(entity);
        manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
        manager.setBoolean(nbt, "bladesLeft", true);
        manager.setBoolean(nbt, "bladesRight", true);
        system.moduleMessage(this, entity, "<s>Armed <sh>all<s> blades!");
      };
      if ((entity.getData("skyhighheroes:dyn/blade_left_armed") || entity.getData("skyhighheroes:dyn/blade_right_armed")) && bladeMultiTap.multiTap(entity, manager, 2, 20, 1)) {
        var nbt = system.mainNBT(entity);
        manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", false);
        manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", false);
        manager.setBoolean(nbt, "bladesLeft", false);
        manager.setBoolean(nbt, "bladesRight", false);
        system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> blades!");
      };
      if ((entity.getData("skyhighheroes:dyn/blade_left_armed") || entity.getData("skyhighheroes:dyn/blade_right_armed")) && entity.getData("fiskheroes:blade_timer") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/blade_left", left);
        manager.setData(entity, "skyhighheroes:dyn/blade_right", right);
        if (left) {
          system.useEnergy(entity, manager, "blade");
        };
        if (right) {
          system.useEnergy(entity, manager, "blade");
        };
        if (entity.getData("fiskheroes:blade_timer") < 0.2) {
          if (left && right) {
            system.shoutMessage(entity, "Activating Blades!", 16);
          } else {
            if (left) {
              system.shoutMessage(entity, "Activating Left Blade!", 16);
            };
            if (right) {
              system.shoutMessage(entity, "Activating Right Blade!", 16);
            };
          };
        };
      };
      var leftStealth = entity.getData("skyhighheroes:dyn/blade_left_stealth_enabled");
      var rightStealth = entity.getData("skyhighheroes:dyn/blade_right_stealth_enabled");
      manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth", leftStealth);
      manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth", rightStealth);
      bladeMultiTap.tapReset(entity, manager);
    },
    fightOrFlight: function (entity, manager) {
      if (!entity.getWornChestplate().nbt().getBoolean("bladesLeft") || !entity.getWornChestplate().nbt().getBoolean("bladesRight")) {
        manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", true);
        system.systemMessage(entity, "<n>Automatically armed <nh>blades<n>!");
      };
      if (entity.getData("fiskheroes:blade_timer") == 0) {
        manager.setData(entity, "fiskheroes:blade", true);
        manager.setData(entity, "fiskheroes:blade_timer", 1.0);
        system.systemMessage(entity, "<n>Automatically deployed <nh>blades<n>!");
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("bladesLeft")) {
        manager.setBoolean(nbt, "bladesLeft", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/blade_left_armed", nbt.getBoolean("bladesLeft"));
      if (!nbt.hasKey("bladesRight")) {
        manager.setBoolean(nbt, "bladesRight", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/blade_right_armed", nbt.getBoolean("bladesRight"));
      if (!nbt.hasKey("bladesLeftStealth")) {
        manager.setBoolean(nbt, "bladesLeftStealth", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/blade_left_stealth_enabled", nbt.getBoolean("bladesLeftStealth"));
      if (!nbt.hasKey("bladesRightStealth")) {
        manager.setBoolean(nbt, "bladesRightStealth", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/blade_right_stealth_enabled", nbt.getBoolean("bladesRightStealth"));
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "fiskheroes:blade", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_left", false);
      manager.setData(entity, "skyhighheroes:dyn/blade_right", false);
    }
  };
};