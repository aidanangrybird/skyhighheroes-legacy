/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  return {
    name: "intakes",
    moduleMessageName: "Intakes",
    type: 12,
    command: "intake",
    cyberOverviewButtons: {
      "intake_head_left_open": {
        borderingButtons: {
          top: "optics_enabled",
          left: "intake_head_right_open",
          right: "intake_head_left_start_up",
          bottom: "intake_body_left_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", !entity.getData("skyhighheroes:dyn/intake_head_left_open"));
            if (entity.getData("skyhighheroes:dyn/intake_head_left_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>left head<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>left head<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_head_right_open": {
        borderingButtons: {
          top: "optics_enabled",
          right: "intake_head_left_open",
          left: "intake_head_right_start_up",
          bottom: "intake_body_right_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", !entity.getData("skyhighheroes:dyn/intake_head_right_open"));
            if (entity.getData("skyhighheroes:dyn/intake_head_right_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>right head<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>right head<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_body_left_open": {
        borderingButtons: {
          top: "intake_head_left_open",
          left: "intake_body_right_open",
          right: "intake_body_left_start_up",
          bottom: "cannon_body_left_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", !entity.getData("skyhighheroes:dyn/intake_body_left_open"));
            if (entity.getData("skyhighheroes:dyn/intake_body_left_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>left body<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>left body<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_body_right_open": {
        borderingButtons: {
          top: "intake_head_right_open",
          right: "intake_body_left_open",
          left: "intake_body_right_start_up",
          bottom: "cannon_body_right_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", !entity.getData("skyhighheroes:dyn/intake_body_right_open"));
            if (entity.getData("skyhighheroes:dyn/intake_body_right_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>right body<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>right body<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_left_arm_open": {
        borderingButtons: {
          bottom: "rocket_left_arm_outer_deploy",
          left: "intake_left_arm_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", !entity.getData("skyhighheroes:dyn/intake_left_arm_open"));
            if (entity.getData("skyhighheroes:dyn/intake_left_arm_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>left arm<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>left arm<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_right_arm_open": {
        borderingButtons: {
          bottom: "rocket_right_arm_outer_deploy",
          right: "intake_right_arm_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", !entity.getData("skyhighheroes:dyn/intake_right_arm_open"));
            if (entity.getData("skyhighheroes:dyn/intake_right_arm_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>right arm<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>right arm<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_left_leg_open": {
        borderingButtons: {
          top: "cannon_left_arm_bottom_deploy",
          bottom: "rocket_left_leg_front_deploy",
          left: "intake_left_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", !entity.getData("skyhighheroes:dyn/intake_left_leg_open"));
            if (entity.getData("skyhighheroes:dyn/intake_left_leg_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>left leg<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>left leg<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_right_leg_open": {
        borderingButtons: {
          top: "cannon_right_arm_bottom_deploy",
          bottom: "rocket_right_leg_front_deploy",
          right: "intake_right_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", !entity.getData("skyhighheroes:dyn/intake_right_leg_open"));
            if (entity.getData("skyhighheroes:dyn/intake_right_leg_open")) {
              system.moduleMessage(this, entity, "<s>Opened <sh>right leg<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Closed <sh>right leg<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_head_left_start_up": {
        borderingButtons: {
          top: "cannon_head_left_deploy",
          bottom: "intake_body_left_start_up",
          right: "cannon_left_arm_bottom_deploy",
          left: "intake_head_left_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", !entity.getData("skyhighheroes:dyn/intake_head_left_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_head_left_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>left head<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>left head<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_head_right_start_up": {
        borderingButtons: {
          top: "cannon_head_right_deploy",
          bottom: "intake_body_right_start_up",
          left: "cannon_right_arm_bottom_deploy",
          right: "intake_head_right_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", !entity.getData("skyhighheroes:dyn/intake_head_right_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_head_right_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>right head<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>right head<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_body_left_start_up": {
        borderingButtons: {
          top: "intake_head_left_start_up",
          right: "intake_left_leg_start_up",
          left: "intake_body_left_open",
          bottom: "wing_left_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", !entity.getData("skyhighheroes:dyn/intake_body_left_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_body_left_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>left body<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>left body<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_body_right_start_up": {
        borderingButtons: {
          top: "intake_head_right_start_up",
          right: "intake_body_right_open",
          left: "intake_right_leg_start_up",
          bottom: "wing_right_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", !entity.getData("skyhighheroes:dyn/intake_body_right_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_body_right_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>right body<s> intake!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>right body<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_left_arm_start_up": {
        borderingButtons: {
          bottom: "rocket_left_arm_front_deploy",
          left: "cannon_head_left_deploy",
          right: "intake_left_arm_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", !entity.getData("skyhighheroes:dyn/intake_left_arm_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_left_arm_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>left arm<s> intakes!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>left arm<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_right_arm_start_up": {
        borderingButtons: {
          bottom: "rocket_right_arm_front_deploy",
          right: "cannon_head_right_deploy",
          left: "intake_right_arm_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", !entity.getData("skyhighheroes:dyn/intake_right_arm_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_right_arm_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>right arm<s> intakes!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>right arm<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_left_leg_start_up": {
        borderingButtons: {
          top: "cannon_left_arm_bottom_deploy",
          bottom: "rocket_left_leg_inner_deploy",
          right: "intake_left_leg_open",
          left: "intake_body_left_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", !entity.getData("skyhighheroes:dyn/intake_left_leg_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_left_leg_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>left leg<s> intakes!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>left leg<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "intake_right_leg_start_up": {
        borderingButtons: {
          top: "cannon_right_arm_bottom_deploy",
          bottom: "rocket_right_leg_inner_deploy",
          left: "intake_right_leg_open",
          right: "intake_body_right_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", !entity.getData("skyhighheroes:dyn/intake_right_leg_starting_up"));
            if (entity.getData("skyhighheroes:dyn/intake_right_leg_starting_up")) {
              system.moduleMessage(this, entity, "<s>Starting up <sh>right leg<s> intakes!");
            } else {
              system.moduleMessage(this, entity, "<s>Shutting down <sh>right leg<s> intake!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
    },
    helpMessage: "<n>!intake <nh>-<n> intakes",
    disabledMessage: "<e>Module <eh>intakes<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        var nbt = system.mainNBT(entity);
        switch(argList[1]) {
          case "open":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>head<s> intakes!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>left head<s> intake!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>right head<s> intake!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>body<s> intakes!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>left body<s> intake!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>right body<s> intake!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>arm<s> intakes!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>left arm<s> intake!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>right arm<s> intake!");
                break;
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>leg<s> intakes!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>left leg<s> intake!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>right leg<s> intake!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>intake<e>!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", true);
                system.moduleMessage(this, entity, "<s>Opened <sh>all<s> intakes!");
                break;
            };
            break;
          case "close":
            switch (argList[2]) {
              case "headIntakes":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>head<s> intakes!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>left head<s> intake!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>right head<s> intake!");
                break;
              case "bodyIntakes":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>body<s> intakes!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>left body<s> intake!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>right body<s> intake!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>arm<s> intakes!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>left arm<s> intake!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>right arm<s> intake!");
                break;
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>leg<s> intakes!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>left leg<s> intake!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>right leg<s> intake!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", false);
                system.moduleMessage(this, entity, "<s>Closed <sh>all<s> intakes!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>intake<e>!");
                break;
            };
            break;case "start":
            switch (argList[2]) {
              case "head":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>head<s> intakes!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>left head<s> intake!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>right head<s> intake!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>body<s> intakes!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>left body<s> intake!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>right body<s> intake!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>arm<s> intakes!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>left arm<s> intakes!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>right arm<s> intakes!");
                break;
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>leg<s> intakes!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>left leg<s> intakes!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>right leg<s> intakes!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>intake<e>!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", true);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", true);
                system.moduleMessage(this, entity, "<s>Starting up <sh>all<s> intakes!");
                break;
            };
            break;
          case "stop":
            switch (argList[2]) {
              case "headIntakes":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>head<s> intakes!");
                break;
              case "headLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>left head<s> intake!");
                break;
              case "headRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>right head<s> intake!");
                break;
              case "bodyIntakes":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>body<s> intakes!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>left body<s> intake!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>right body<s> intake!");
                break;
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>arm<s> intakes!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>left arm<s> intake!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>right arm<s> intake!");
                break;
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>leg<s> intakes!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>left leg<s> intake!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>right leg<s> intake!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", false);
                manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", false);
                system.moduleMessage(this, entity, "<s>Shutting down <sh>all<s> intakes!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>intake<e>!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>intakes commands:");
            system.moduleMessage(this, entity, "<n>!intake open <intake> <nh>-<n> Opens set of intakes");
            system.moduleMessage(this, entity, "<n>!intake close <intake> <nh>-<n> Closes set of intakes");
            system.moduleMessage(this, entity, "<n>!intake start <intake> <nh>-<n> Starts set of intakes");
            system.moduleMessage(this, entity, "<n>!intake stop <intake> <nh>-<n> Stops set of intakes");
            system.moduleMessage(this, entity, "<n>!intake status <nh>-<n> Shows status of intakes");
            system.moduleMessage(this, entity, "<n>!intake help <nh>-<n> Shows intakes commands");
            break;
          case "status":
            system.moduleMessage(this, entity, "<n>Intake status:");
            system.moduleMessage(this, entity, "Left Head: " + ((entity.getData("skyhighheroes:dyn/intake_head_left_starting_up") && entity.getData("skyhighheroes:dyn/intake_head_left_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_head_left_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_head_left_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Right Head: " + ((entity.getData("skyhighheroes:dyn/intake_head_right_starting_up") && entity.getData("skyhighheroes:dyn/intake_head_right_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_head_right_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_head_right_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Left Body: " + ((entity.getData("skyhighheroes:dyn/intake_body_left_starting_up") && entity.getData("skyhighheroes:dyn/intake_body_left_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_body_left_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_body_left_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Right Body: " + ((entity.getData("skyhighheroes:dyn/intake_body_right_starting_up") && entity.getData("skyhighheroes:dyn/intake_body_right_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_body_right_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_body_right_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Left Arm: " + ((entity.getData("skyhighheroes:dyn/intake_left_arm_starting_up") && entity.getData("skyhighheroes:dyn/intake_left_arm_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_left_arm_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_left_arm_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Right Arm: " + ((entity.getData("skyhighheroes:dyn/intake_right_arm_starting_up") && entity.getData("skyhighheroes:dyn/intake_right_arm_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_right_arm_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_right_arm_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Left Leg: " + ((entity.getData("skyhighheroes:dyn/intake_left_leg_starting_up") && entity.getData("skyhighheroes:dyn/intake_left_leg_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_left_leg_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_left_leg_open")) ? "OPEN" : "CLOSED")));
            system.moduleMessage(this, entity, "Right Leg: " + ((entity.getData("skyhighheroes:dyn/intake_right_leg_starting_up") && entity.getData("skyhighheroes:dyn/intake_right_leg_start_up_timer") > 0 && entity.getData("skyhighheroes:dyn/intake_right_leg_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_right_leg_open")) ? "OPEN" : "CLOSED")));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>intakes<e> command! Try <eh>!intake help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>intakes<e> command! Try <eh>!intake help<e> for a list of commands!");
      };
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setData(entity, "skyhighheroes:dyn/intake_head_left_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_head_right_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_body_left_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_body_right_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_open", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_open", false);
    },
    tickHandler: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!system.hasEnoughEnergy(entity, manager, "intakeFan")) {
        manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", false);
        manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", false);
      };
      var headLeft = entity.getData("skyhighheroes:dyn/intake_head_left_starting_up");
      var headRight = entity.getData("skyhighheroes:dyn/intake_head_right_starting_up");
      var bodyLeft = entity.getData("skyhighheroes:dyn/intake_body_left_starting_up");
      var bodyRight = entity.getData("skyhighheroes:dyn/intake_body_right_starting_up");
      var leftArm = entity.getData("skyhighheroes:dyn/intake_left_arm_starting_up");
      var rightArm = entity.getData("skyhighheroes:dyn/intake_right_arm_starting_up");
      var leftLeg = entity.getData("skyhighheroes:dyn/intake_left_leg_starting_up");
      var rightLeg = entity.getData("skyhighheroes:dyn/intake_right_leg_starting_up");
      manager.incrementData(entity, "skyhighheroes:dyn/intake_head_left_start_up_timer", 200, 50, headLeft);
      if (headLeft) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_head_right_start_up_timer", 200, 50, headRight);
      if (headRight) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_body_left_start_up_timer", 200, 50, bodyLeft);
      if (bodyLeft) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_body_right_start_up_timer", 200, 50, bodyRight);
      if (bodyRight) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_left_arm_start_up_timer", 200, 50, leftArm);
      if (leftArm) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_right_arm_start_up_timer", 200, 50, rightArm);
      if (rightArm) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_left_leg_start_up_timer", 200, 50, leftLeg);
      if (leftLeg) {
        system.useEnergy(entity, manager, "intakeFan");
      };
      manager.incrementData(entity, "skyhighheroes:dyn/intake_right_leg_start_up_timer", 200, 50, rightLeg);
      if (rightLeg) {
        system.useEnergy(entity, manager, "intakeFan");
      };
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "skyhighheroes:dyn/intake_head_left_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_head_right_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_body_left_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_body_right_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_left_arm_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_right_arm_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_left_leg_starting_up", false);
      manager.setData(entity, "skyhighheroes:dyn/intake_right_leg_starting_up", false);
    }
  };
};