/**
*You put all of the required functions in here
*@param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  return {
    name: "rockets",
    moduleMessageName: "Rockets",
    type: 12,
    command: "rocket",
    cyberMenus: {
      "rockets_wings": {
        parent: "main",
        prevButton: "main_rockets_wings",
        buttons: {
          "rockets_arms_armed": {
            borderingButtons: {
              bottom: "rockets_body_armed",
              right: "rockets_wings_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/rockets_arms_armed")) {
                  if (entity.getData("skyhighheroes:dyn/wings_armed")) {
                    system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
                    manager.setBoolean(nbt, "rocketsArms", true);
                    system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> rockets!");
                  };
                } else {
                  if (!(entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", false);
                    manager.setBoolean(nbt, "rocketsArms", false);
                    system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> rockets!");
                  } else {
                    system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>arm<e> rockets!");
                  };
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "rockets_body_armed": {
            borderingButtons: {
              top: "rockets_arms_armed",
              bottom: "rockets_legs_armed",
              right: "wings_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/rockets_body_armed")) {
                  if (entity.getData("skyhighheroes:dyn/wings_armed")) {
                    system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
                    manager.setBoolean(nbt, "rocketsBody", true);
                    system.moduleMessage(this, entity, "<s>Armed <sh>body<s> rockets!");
                  };
                } else {
                  if (!(entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", false);
                    manager.setBoolean(nbt, "rocketsBody", false);
                    system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> rockets!");
                  } else {
                    system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>body<e> rockets!");
                  };
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "rockets_legs_armed": {
            borderingButtons: {
              top: "rockets_body_armed",
              right: "rockets_inner_legs",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/rockets_legs_armed")) {
                  if (entity.getData("skyhighheroes:dyn/wings_armed")) {
                    system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
                    manager.setBoolean(nbt, "rocketsLegs", true);
                    system.moduleMessage(this, entity, "<s>Armed <sh>leg<s> rockets!");
                  };
                } else {
                  if (!(entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", false);
                    manager.setBoolean(nbt, "rocketsLegs", false);
                    system.moduleMessage(this, entity, "<s>Disarmed <sh>leg<s> rockets!");
                  } else {
                    system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>leg<e> rockets!");
                  };
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "rockets_wings_armed": {
            borderingButtons: {
              bottom: "wings_armed",
              left: "rockets_arms_armed",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/rockets_wings_armed")) {
                  if (entity.getData("skyhighheroes:dyn/wings_armed")) {
                    system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", true);
                    manager.setBoolean(nbt, "rocketsWings", true);
                    system.moduleMessage(this, entity, "<s>Armed <sh>wings<s> to deploy on rockets!");
                  };
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", false);
                  manager.setBoolean(nbt, "rocketsWings", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s> to deploy on rockets!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "rockets_on_fall": {
            borderingButtons: {
              top: "wings_armed",
              left: "rockets_inner_legs",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (!entity.getData("skyhighheroes:dyn/rockets_on_fall")) {
                  if (entity.getData("skyhighheroes:dyn/wings_armed")) {
                    system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
                  } else {
                    manager.setData(entity, "skyhighheroes:dyn/rockets_on_fall", true);
                    manager.setBoolean(nbt, "rocketsOnFall", true);
                    system.moduleMessage(this, entity, "<s>Armed any armed rockets for <sh>onFall<s> protection!");
                  };
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_on_fall", false);
                  manager.setBoolean(nbt, "rocketsOnFall", false);
                  system.moduleMessage(this, entity, "<s>Disarmed any armed rockets for <sh>onFall<s> protection!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_rockets_wings");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "rockets_inner_legs": {
            borderingButtons: {
              left: "rockets_legs_armed",
              right: "rockets_on_fall",
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                manager.setBoolean(nbt, "innerRockets", !nbt.getBoolean("innerRockets"));
                manager.setData(entity, "skyhighheroes:dyn/rocket_inner_legs_enabled", nbt.getBoolean("innerRockets"));
                system.moduleMessage(this, entity, "<n>Inner Rockets set to <nh>" + entity.getData("skyhighheroes:dyn/rocket_inner_legs_enabled") + "<n>!");
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
        top: "main_overview",
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
    cyberOverviewButtons: {
      "rocket_body_left_deploy": {
        borderingButtons: {
          left: "cannon_body_left_deploy",
          right: "rocket_left_leg_inner_deploy",
          top: "intake_body_left_start_up",
          bottom: "external_arm_left_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", !entity.getData("skyhighheroes:dyn/rocket_body_left_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_body_left_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left body<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left body<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_body_right_deploy": {
        borderingButtons: {
          right: "cannon_body_right_deploy",
          left: "rocket_right_leg_inner_deploy",
          top: "intake_body_right_start_up",
          bottom: "external_arm_right_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", !entity.getData("skyhighheroes:dyn/rocket_body_right_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_body_right_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right body<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right body<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_arm_outer_deploy": {
        borderingButtons: {
          top: "intake_left_arm_open",
          bottom: "shield_left_deploy",
          left: "rocket_left_arm_front_deploy",
          right: "rocket_left_arm_back_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_arm_outer_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_arm_outer_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm outer<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm outer<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_arm_front_deploy": {
        borderingButtons: {
          top: "intake_left_arm_start_up",
          bottom: "cannon_left_arm_front_deploy",
          left: "cannon_head_left_deploy",
          right: "rocket_left_arm_outer_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_arm_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_arm_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm front<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm front<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_arm_back_deploy": {
        borderingButtons: {
          top: "intake_left_arm_open",
          bottom: "cannon_left_arm_back_deploy",
          left: "rocket_left_arm_outer_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_arm_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_arm_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left arm back<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left arm back<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_arm_outer_deploy": {
        borderingButtons: {
          top: "intake_right_arm_open",
          bottom: "shield_right_deploy",
          right: "rocket_right_arm_front_deploy",
          left: "rocket_right_arm_back_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_arm_outer_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_arm_outer_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm outer<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm outer<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_arm_front_deploy": {
        borderingButtons: {
          top: "intake_right_arm_start_up",
          bottom: "cannon_right_arm_front_deploy",
          right: "cannon_head_right_deploy",
          left: "rocket_right_arm_outer_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_arm_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_arm_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm front<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm front<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_arm_back_deploy": {
        borderingButtons: {
          top: "intake_right_arm_open",
          bottom: "cannon_right_arm_back_deploy",
          right: "rocket_right_arm_outer_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_arm_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_arm_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right arm back<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right arm back<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_leg_main_deploy": {
        borderingButtons: {
          top: "rocket_left_leg_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_leg_main_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_leg_main_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>main left leg<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>main left leg<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_leg_outer_deploy": {
        borderingButtons: {
          bottom: "rocket_left_leg_main_deploy",
          left: "rocket_left_leg_front_deploy",
          top: "intake_left_leg_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_leg_outer_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_leg_outer_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left leg outer<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left leg outer<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_leg_inner_deploy": {
        borderingButtons: {
          bottom: "rocket_left_leg_main_deploy",
          left: "rocket_left_leg_back_deploy",
          right: "rocket_left_leg_front_deploy",
          top: "intake_left_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_leg_inner_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_leg_inner_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left leg inner<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left leg inner<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_leg_front_deploy": {
        borderingButtons: {
          bottom: "rocket_left_leg_main_deploy",
          right: "rocket_left_leg_outer_deploy",
          left: "rocket_left_leg_inner_deploy",
          top: "intake_left_leg_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_leg_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_leg_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left leg front<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left leg front<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_left_leg_back_deploy": {
        borderingButtons: {
          bottom: "rocket_left_leg_main_deploy",
          left: "external_arm_left_deploy",
          right: "rocket_left_leg_inner_deploy",
          top: "intake_left_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", !entity.getData("skyhighheroes:dyn/rocket_left_leg_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_left_leg_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>left leg back<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>left leg back<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_leg_main_deploy": {
        borderingButtons: {
          top: "rocket_right_leg_front_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_leg_main_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_leg_main_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>main right leg<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>main right leg<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_leg_outer_deploy": {
        borderingButtons: {
          bottom: "rocket_right_leg_main_deploy",
          right: "rocket_right_leg_front_deploy",
          top: "intake_right_leg_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_leg_outer_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_leg_outer_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right leg outer<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right leg outer<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_leg_inner_deploy": {
        borderingButtons: {
          bottom: "rocket_right_leg_main_deploy",
          right: "rocket_right_leg_back_deploy",
          left: "rocket_right_leg_front_deploy",
          top: "intake_right_leg_open",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_leg_inner_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_leg_inner_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right leg inner<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right leg inner<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_leg_front_deploy": {
        borderingButtons: {
          bottom: "rocket_right_leg_main_deploy",
          left: "rocket_right_leg_outer_deploy",
          right: "rocket_right_leg_inner_deploy",
          top: "intake_right_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_leg_front_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_leg_front_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right leg front<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right leg front<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "rocket_right_leg_back_deploy": {
        borderingButtons: {
          bottom: "rocket_right_leg_main_deploy",
          left: "rocket_right_leg_inner_deploy",
          right: "external_arm_right_deploy",
          top: "intake_right_leg_start_up",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", !entity.getData("skyhighheroes:dyn/rocket_right_leg_back_deployed"));
            if (entity.getData("skyhighheroes:dyn/rocket_right_leg_back_deployed")) {
              system.moduleMessage(this, entity, "<s>Deployed <sh>right leg back<s> rocket!");
            } else {
              system.moduleMessage(this, entity, "<s>Stowed <sh>right leg back<s> rocket!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
    },
    helpMessage: "<n>!rocket <nh>-<n> Rockets",
    disabledMessage: "<e>Module <eh>rockets<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        var nbt = system.mainNBT(entity);
        switch(argList[1]) {
          case "arm":
            if (entity.getData("skyhighheroes:dyn/wings_armed")) {
              system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
            } else {
              switch (argList[2]) {
                case "onFall":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_on_fall", true);
                  manager.setBoolean(nbt, "rocketsOnFall", true);
                  system.moduleMessage(this, entity, "<s>Armed any armed rockets for <sh>onFall<s> protection!");
                  break;
                case "arms":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
                  manager.setBoolean(nbt, "rocketsArms", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> rockets!");
                  break;
                case "body":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
                  manager.setBoolean(nbt, "rocketsBody", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>body<s> rockets!");
                  break;
                case "legs":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
                  manager.setBoolean(nbt, "rocketsLegs", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>leg<s> rockets!");
                  break;
                case "wings":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", true);
                  manager.setBoolean(nbt, "rocketsWings", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>wings<s> to deploy on rockets!");
                  break;
                case "*":
                  manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
                  manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
                  manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
                  manager.setBoolean(nbt, "rocketsArms", true);
                  manager.setBoolean(nbt, "rocketsBody", true);
                  manager.setBoolean(nbt, "rocketsLegs", true);
                  system.moduleMessage(this, entity, "<s>Armed <sh>all<s> rockets!");
                  break;
                default:
                  system.moduleMessage(this, entity, "<e>Unknown <eh>rocket set<e>!");
                  break;
              };
            };
            break;
          case "disarm":
            switch (argList[2]) {
              case "onFall":
                manager.setData(entity, "skyhighheroes:dyn/rockets_on_fall", false);
                manager.setBoolean(nbt, "rocketsOnFall", false);
                system.moduleMessage(this, entity, "<s>Disarmed any armed rockets for <sh>onFall<s> protection!");
                break;
              case "arms":
                if (!(entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", false);
                  manager.setBoolean(nbt, "rocketsArms", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>arm<e> rockets!");
                };
                break;
              case "body":
                if (!(entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", false);
                  manager.setBoolean(nbt, "rocketsBody", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>body<e> rockets!");
                };
                break;
              case "legs":
                if (!(entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", false);
                  manager.setBoolean(nbt, "rocketsLegs", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>leg<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>leg<e> rockets!");
                };
                break;
              case "wings":
                manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", false);
                manager.setBoolean(nbt, "rocketsWings", false);
                system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s> to deploy on rockets!");
                break;
              case "*":
                if (!(entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", false);
                  manager.setBoolean(nbt, "rocketsArms", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>arm<e> rockets!");
                };
                if (!(entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", false);
                  manager.setBoolean(nbt, "rocketsBody", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>body<e> rockets!");
                };
                if (!(entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
                  manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", false);
                  manager.setBoolean(nbt, "rocketsLegs", false);
                  system.moduleMessage(this, entity, "<s>Disarmed <sh>leg<s> rockets!");
                } else {
                  system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>leg<e> rockets!");
                };
                system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> inactive rockets!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>rocket set<e>!");
                break;
            };
            break;
          case "show":
            switch (argList[2]) {
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>arm<s> rockets!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm<s> rockets!");
                break;
              case "leftArmOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm outer<s> rocket!");
                break;
              case "leftArmFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm front<s> rocket!");
                break;
              case "leftArmBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left arm back<s> rocket!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm<s> rockets!");
                break;
              case "rightArmOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm outer<s> rocket!");
                break;
              case "rightArmFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm front<s> rocket!");
                break;
              case "rightArmBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right arm back<s> rocket!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>body<s> rockets!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left body<s> rocket!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right body<s> rocket!");
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>leg<s> rockets!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg<s> rockets!");
                break;
              case "leftLegMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>main left leg<s> rocket!");
                break;
              case "leftLegSides":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg side<s> rockets!");
                break;
              case "leftLegOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg outer<s> rocket!");
                break;
              case "leftLegInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg inner<s> rocket!");
                break;
              case "leftLegFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg front<s> rocket!");
                break;
              case "leftLegBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>left leg back<s> rocket!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right leg<s> rockets!");
                break;
              case "rightLegMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>main right leg<s> rocket!");
                break;
              case "rightLegOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right leg outer<s> rocket!");
                break;
              case "rightLegInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right leg inner<s> rocket!");
                break;
              case "rightLegFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right leg front<s> rocket!");
                break;
              case "rightLegBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>right leg back<s> rocket!");
                break;
              case "legsMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>main leg<s> rockets!");
                break;
              case "legsSides":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>side leg<s> rockets!");
                break;
              case "legsOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>outer leg<s> rockets!");
                break;
              case "legsInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>inner leg<s> rockets!");
                break;
              case "legsFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>front leg<s> rockets!");
                break;
              case "legsBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Deployed <sh>back leg<s> rockets!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", true);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", true);
                system.moduleMessage(this, entity, "<s>Deployed <sh>all<s> rockets!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>rocket<e>!");
                break;
            };
            break;
          case "hide":
            switch (argList[2]) {
              case "arms":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>arm<s> rockets!");
                break;
              case "leftArm":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm<s> rockets!");
                break;
              case "leftArmOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm outer<s> rocket!");
                break;
              case "leftArmFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm front<s> rocket!");
                break;
              case "leftArmBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left arm back<s> rocket!");
                break;
              case "rightArm":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm<s> rockets!");
                break;
              case "rightArmOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm outer<s> rocket!");
                break;
              case "rightArmFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm front<s> rocket!");
                break;
              case "rightArmBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right arm back<s> rocket!");
                break;
              case "body":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>body<s> rockets!");
                break;
              case "bodyLeft":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left body<s> rocket!");
                break;
              case "bodyRight":
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right body<s> rocket!");
              case "legs":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>leg<s> rockets!");
                break;
              case "leftLeg":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg<s> rockets!");
                break;
              case "leftLegMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>main left leg<s> rocket!");
                break;
              case "leftLegSides":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg side<s> rockets!");
                break;
              case "leftLegOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg outer<s> rocket!");
                break;
              case "leftLegInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg inner<s> rocket!");
                break;
              case "leftLegFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg front<s> rocket!");
                break;
              case "leftLegBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>left leg back<s> rocket!");
                break;
              case "rightLeg":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg<s> rockets!");
                break;
              case "rightLegMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>main right leg<s> rocket!");
                break;
              case "rightLegSides":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg side<s> rockets!");
                break;
              case "rightLegOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg outer<s> rocket!");
                break;
              case "rightLegInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg inner<s> rocket!");
                break;
              case "rightLegFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg front<s> rocket!");
                break;
              case "rightLegBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>right leg back<s> rocket!");
                break;
              case "legsMain":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>main leg<s> rockets!");
                break;
              case "legsSides":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>side leg<s> rockets!");
                break;
              case "legsOuter":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>outer leg<s> rockets!");
                break;
              case "legsInner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>inner leg<s> rockets!");
                break;
              case "legsFront":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>front leg<s> rockets!");
                break;
              case "legsBack":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>back leg<s> rockets!");
                break;
              case "*":
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", false);
                manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", false);
                system.moduleMessage(this, entity, "<s>Stowed <sh>all<s> rockets!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>rocket<e>!");
                break;
            };
            break;
          case "set":
            switch (argList[2]) {
              case "holo":
                manager.setBoolean(nbt, "holoFlight", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoFlight")));
                system.moduleMessage(this, entity, "<n>Hologram set to <nh>" + nbt.getBoolean("holoFlight") + "<n>!");
                break;
              case "holoBoost":
                manager.setBoolean(nbt, "holoBoostFlight", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoBoostFlight")));
                system.moduleMessage(this, entity, "<n>Hologram Boost set to <nh>" + nbt.getBoolean("holoBoostFlight") + "<n>!");
                break;
              case "holoMotion":
                manager.setBoolean(nbt, "holoFlightMotion", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoFlightMotion")));
                system.moduleMessage(this, entity, "<n>holoMotion set to <nh>" + nbt.getBoolean("holoFlightMotion") + "<n>!");
                break;
              case "inner":
                manager.setData(entity, "skyhighheroes:dyn/rocket_inner_legs_enabled", ((argList[2] == "true") ? true : (argList[2] == "false") ? false : entity.getData("skyhighheroes:dyn/rocket_inner_legs_enabled")));
                manager.setBoolean(nbt, "innerRockets", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("innerRockets")));
                system.moduleMessage(this, entity, "<n>Inner Rockets set to <nh>" + nbt.getBoolean("innerRockets") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>rocket<e> setting!");
                break;
            };
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Rockets commands:");
            system.moduleMessage(this, entity, "<n>!rocket arm <onFall|arms|body|legs|*> <nh>-<n> Arms set of rockets or onFall protection");
            system.moduleMessage(this, entity, "<n>!rocket disarm <onFall|arms|body|legs|*> <nh>-<n> Disarms set of rockets or onFall protection");
            system.moduleMessage(this, entity, "<n>!rocket show <rocket|rocketSet> <nh>-<n> Deploys set of rockets");
            system.moduleMessage(this, entity, "<n>!rocket hide <rocket|rocketSet> <nh>-<n> Retracts set of rockets");
            system.moduleMessage(this, entity, "<n>!rocket set <holo|holoBoost|holoMotion|inner> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!rocket status <nh>-<n> Shows status of rockets");
            system.moduleMessage(this, entity, "<n>!rocket help <nh>-<n> Shows rockets commands");
            break;
          case "status":
            var armsSet = (entity.getData("skyhighheroes:dyn/rockets_arms_timer") > 0);
            var bodySet = (entity.getData("skyhighheroes:dyn/rockets_body_timer") > 0);
            var legsSet = (entity.getData("skyhighheroes:dyn/rockets_legs_timer") > 0);
            system.moduleMessage(this, entity, "<n>Rocket status:");
            system.moduleMessage(this, entity, "<n>Arm set: <nh>" + (entity.getData("skyhighheroes:dyn/rockets_arms_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Body set: <nh>" + (entity.getData("skyhighheroes:dyn/rockets_body_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Leg set: <nh>" + (entity.getData("skyhighheroes:dyn/rockets_legs_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Fall protection: <nh>" + (entity.getData("skyhighheroes:dyn/rockets_on_fall") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Wings: <nh>" + (entity.getData("skyhighheroes:dyn/rockets_wings_armed") ? "ARMED" : "DISARMED"));
            system.moduleMessage(this, entity, "<n>Left Arm outer: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_arm_outer_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Arm front: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_arm_front_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Arm back: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_arm_back_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>right Arm outer: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_arm_outer_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>right Arm front: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_arm_front_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>right Arm back: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_arm_back_deploy_timer") > 0) || armsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Body: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_body_left_deploy_timer") > 0) || bodySet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Body: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_body_right_deploy_timer") > 0) || bodySet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Leg inner: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_leg_inner_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Leg outer: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_leg_outer_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Leg front: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_leg_front_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Leg back: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_leg_back_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));;
            system.moduleMessage(this, entity, "<n>Right Leg inner: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_leg_inner_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Leg outer: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_leg_outer_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Leg front: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_leg_front_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Leg back: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_leg_back_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Left Leg main: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_left_leg_main_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Right Leg main: <nh>" + ((entity.getData("skyhighheroes:dyn/rocket_right_leg_main_deploy_timer") > 0) || legsSet ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Hologram: <nh>" + (nbt.getBoolean("holoFlight") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Hologram Boost: <nh>" + (nbt.getBoolean("holoBoostFlight") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Hologram Motion: <nh>" + (nbt.getBoolean("holoFlightMotion") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Inner: <nh>" + (entity.getData("skyhighheroes:dyn/rocket_inner_legs_enabled") ? "ENABLED" : "DISABLED"));
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>rockets<e> command! Try <eh>!rocket help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>rockets<e> command! Try <eh>!rocket help<e> for a list of commands!");
      };
    },
    armHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      if (entity.getData("skyhighheroes:dyn/wings_armed")) {
        system.moduleMessage(this, entity, "<e>Unable to arm rockets! Wings are already armed!");
      } else {
        switch(arg) {
          case "armsRockets":
            manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
            manager.setBoolean(nbt, "rocketsArms", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>arm<s> rockets!");
            return;
          case "bodyRockets":
            manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
            manager.setBoolean(nbt, "rocketsBody", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>body<s> rockets!");
            return;
          case "legsRockets":
            manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
            manager.setBoolean(nbt, "rocketsLegs", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>leg<s> rockets!");
            return;
          case "wingsRockets":
            manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", true);
            manager.setBoolean(nbt, "rocketsWings", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>wings<s> to deploy on rockets!");
            return;
          case "rockets":
            manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
            manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
            manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
            manager.setBoolean(nbt, "rocketsArms", true);
            manager.setBoolean(nbt, "rocketsBody", true);
            manager.setBoolean(nbt, "rocketsLegs", true);
            system.moduleMessage(this, entity, "<s>Armed <sh>all<s> rockets!");
            return;
        };
      };
    },
    disarmHandler: function (entity, manager, arg) {
      var nbt = system.mainNBT(entity);
      switch (arg) {
        case "armsRockets":
          if (!(entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsArms", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>arm<e> rockets!");
          };
          return;
        case "bodyRockets":
          if (!(entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsBody", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>body<e> rockets!");
          };
          return;
        case "legsRockets":
          if (!(entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsLegs", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>leg<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>leg<e> rockets!");
          };
          return;
        case "wingsRockets":
          manager.setBoolean(nbt, "rocketsWings", false);
          system.moduleMessage(this, entity, "<s>Disarmed <sh>wings<s> to deploy on rockets!");
          return;
        case "rockets":
          if (!(entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsArms", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>arm<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>arm<e> rockets!");
          };
          if (!(entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsBody", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>body<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>body<e> rockets!");
          };
          if (!(entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flight_timer") > 0)) {
            manager.setBoolean(nbt, "rocketsLegs", false);
            system.moduleMessage(this, entity, "<s>Disarmed <sh>leg<s> rockets!");
          } else {
            system.moduleMessage(this, entity, "<e>Unable to disarm active <eh>leg<e> rockets!");
          };
          system.moduleMessage(this, entity, "<s>Disarmed <sh>all<s> inactive rockets!");
          return;
      }
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
        var arms = (entity.getData("skyhighheroes:dyn/rockets_arms_armed")) ? "T" : "F";
        var body = (entity.getData("skyhighheroes:dyn/rockets_body_armed")) ? "T" : "F";
        var legs = (entity.getData("skyhighheroes:dyn/rockets_legs_armed")) ? "T" : "F";
        if (modifier.name() == "fiskheroes:controlled_flight" && !entity.getData("skyhighheroes:dyn/battle_mode")) {
          if (modifier.id() == "rockets_" + arms + body + legs) {
            result = entity.getData("skyhighheroes:dyn/rockets_arms_armed") || entity.getData("skyhighheroes:dyn/rockets_body_armed") || entity.getData("skyhighheroes:dyn/rockets_legs_armed");
          };
        };
        if (modifier.name() == "fiskheroes:teleportation") {
          result = true;
        };
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      manager.setBoolean(nbt, "rocketsArms", false);
      manager.setBoolean(nbt, "rocketsBody", false);
      manager.setBoolean(nbt, "rocketsLegs", false);
      manager.setBoolean(nbt, "rocketsWings", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", false);
    },
    tickHandler: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!system.hasEnoughEnergy(entity, manager, "rockets05") || !system.hasEnoughEnergy(entity, manager, "rockets10") || !system.hasEnoughEnergy(entity, manager, "rockets15") || !system.hasEnoughEnergy(entity, manager, "rockets20") || !system.hasEnoughEnergy(entity, manager, "rockets25") || !system.hasEnoughEnergy(entity, manager, "rockets30") || !system.hasEnoughEnergy(entity, manager, "rockets35") || !system.hasEnoughEnergy(entity, manager, "rockets45")) {
        manager.setData(entity, "fiskheroes:flying", false);
        manager.setData(entity, "skyhighheroes:dyn/rockets_arms", false);
        manager.setData(entity, "skyhighheroes:dyn/rockets_legs", false);
        manager.setData(entity, "skyhighheroes:dyn/rockets_body", false);
      };
      if (!entity.isSneaking() && !entity.getData("fiskheroes:flying") && entity.getData("skyhighheroes:dyn/rockets_on_fall") && entity.world().isUnobstructed(entity.pos(), entity.pos().add(0, -5, 0)) && entity.motionY() < -0.75) {
        system.moduleMessage(this, entity, "<n>Auto activated any armed rockets!");
        manager.setData(entity, "fiskheroes:flying", true);
      };
      var arms = entity.getData("skyhighheroes:dyn/rockets_arms_armed") && entity.getData("fiskheroes:flying");
      var body = entity.getData("skyhighheroes:dyn/rockets_body_armed") && entity.getData("fiskheroes:flying");
      var legs = entity.getData("skyhighheroes:dyn/rockets_legs_armed") && entity.getData("fiskheroes:flying");
      var wings = entity.getData("skyhighheroes:dyn/rockets_wings_armed") && entity.getData("fiskheroes:flying");
      if (entity.getData("fiskheroes:flight_timer") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/rockets_arms", arms);
        manager.setData(entity, "skyhighheroes:dyn/rockets_legs", legs);
        manager.setData(entity, "skyhighheroes:dyn/rockets_body", body);
        manager.setData(entity, "skyhighheroes:dyn/wings", wings);
        if (arms && body && legs) {
          if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
            system.useEnergy(entity, manager, "rockets10");
          } else {
            system.useEnergy(entity, manager, "rockets45");
          };
        } else if ((arms && body && !legs) || (arms && !body && legs) || (!arms && body && legs)) {
          if (arms && body && !legs) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets10");
            } else {
              system.useEnergy(entity, manager, "rockets25");
            };
          };
          if (arms && !body && legs) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets10");
            } else {
              system.useEnergy(entity, manager, "rockets30");
            };
          };
          if (!arms && body && legs) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets10");
            } else {
              system.useEnergy(entity, manager, "rockets35");
            };
          };
        } else {
          if (arms) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets10");
            } else {
              system.useEnergy(entity, manager, "rockets05");
            };
          };
          if (body) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets15");
            } else {
              system.useEnergy(entity, manager, "rockets10");
            };
          };
          if (legs) {
            if (entity.isSprinting() && entity.getData("fiskheroes:flight_boost_timer") > 0) {
              system.useEnergy(entity, manager, "rockets20");
            } else {
              system.useEnergy(entity, manager, "rockets10");
            };
          };
        };
        if (entity.getData("fiskheroes:flight_timer") < 0.2) {
          if (arms && body && legs) {
            system.shoutMessage(entity, "Activating Rockets!", 16);
          } else if ((arms && body && !legs) || (arms && !body && legs) || (!arms && body && legs)) {
            if (arms && body && !legs) {
              system.shoutMessage(entity, "Activating Arms and Body Rockets!", 16);
            };
            if (arms && !body && legs) {
              system.shoutMessage(entity, "Activating Arms and Leg Rockets!", 16);              
            };
            if (!arms && body && legs) {
              system.shoutMessage(entity, "Activating Body and Leg Rockets!", 16);
            };
          } else {
            if (arms) {
              system.shoutMessage(entity, "Activating Arms Rockets!", 16);
            };
            if (body) {
              system.shoutMessage(entity, "Activating Body Rockets!", 16);
            };
            if (legs) {
              system.shoutMessage(entity, "Activating Leg Rockets!", 16);
            };
          };
        };
      };/* 
      var wings = entity.getData("skyhighheroes:dyn/rockets_wings_armed") && entity.getData("fiskheroes:flying") && entity.isSprinting();
      if (entity.getData("fiskheroes:flight_boost_timer") > 0) {
        manager.setData(entity, "skyhighheroes:dyn/wings", wings);
      }; */
      manager.setData(entity, "skyhighheroes:dyn/rocket_inner_legs", entity.getData("skyhighheroes:dyn/rocket_inner_legs_enabled"));
      var x = entity.posX();
      var y = entity.posY();
      var z = entity.posZ();
      if (entity.world().getDimension() == 0 && entity.posY() >= 4000 && (entity.rotPitch() <= -87.5) && entity.getData("fiskheroes:flight_boost_timer") == 1) {
        manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 2595));
        manager.setData(entity, "fiskheroes:teleport_delay", 6);
      };
      if (entity.world().getDimension() == 2595 && entity.posY() >= 1000 && (entity.rotPitch() <= -87.5) && entity.getData("fiskheroes:flight_boost_timer") == 1) {
        manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 0));
        manager.setData(entity, "fiskheroes:teleport_delay", 6);
      };
      var t = entity.getData("skyhighheroes:dyn/superhero_boosting_landing_ticks");
      if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid() && entity.world().blockAt(entity.pos()).name() == "minecraft:air") {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/superhero_boosting_landing_ticks", t = 12);
      } else if (t > 0) {
        manager.setData(entity, "skyhighheroes:dyn/superhero_boosting_landing_ticks", --t);
      };
      manager.incrementData(entity, "skyhighheroes:dyn/superhero_boosting_landing_timer", 2, 8, t > 0);
      var pain = (entity.rotPitch() > 12.5 && entity.motionY() < -0.075 && entity.motionY() > -1.25 && (entity.motionZ() > 0.125 || entity.motionZ() < -0.125 || entity.motionX() > 0.125 || entity.motionX() < -0.125)) && !entity.isSprinting() && !entity.isOnGround() && entity.getData("fiskheroes:flight_timer") > 0 && (entity.world().blockAt(entity.pos().add(0, -1, 0)).isSolid() || entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid() || entity.world().blockAt(entity.pos().add(0, -3, 0)).isSolid()) && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.world().blockAt(entity.pos()).name() == "minecraft:air";
      manager.incrementData(entity, "skyhighheroes:dyn/superhero_landing_timer", 10, 10, pain);
    },
    fightOrFlight: function (entity, manager) {
      if (!entity.getData("skyhighheroes:dyn/rockets_arms_armed") || !entity.getData("skyhighheroes:dyn/rockets_body_armed") || !entity.getData("skyhighheroes:dyn/rockets_legs_armed")) {
        manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", true);
        manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", true);
        system.systemMessage(entity, "<n>Automatically armed <nh>rockets<n>!");
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("holoFlightMotion")) {
        manager.setBoolean(nbt, "holoFlightMotion", false);
      };
      if (!nbt.hasKey("rocketsOnFall")) {
        manager.setBoolean(nbt, "rocketsOnFall", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rockets_on_fall", nbt.getBoolean("rocketsOnFall"));
      if (!nbt.hasKey("rocketsArms")) {
        manager.setBoolean(nbt, "rocketsArms", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rockets_arms_armed", nbt.getBoolean("rocketsArms"));
      if (!nbt.hasKey("rocketsBody")) {
        manager.setBoolean(nbt, "rocketsBody", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rockets_body_armed", nbt.getBoolean("rocketsBody"));
      if (!nbt.hasKey("rocketsLegs")) {
        manager.setBoolean(nbt, "rocketsLegs", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rockets_legs_armed", nbt.getBoolean("rocketsLegs"));
      if (!nbt.hasKey("rocketsWings")) {
        manager.setBoolean(nbt, "rocketsWings", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rockets_wings_armed", nbt.getBoolean("rocketsWings"));
      if (!nbt.hasKey("innerRockets")) {
        manager.setBoolean(nbt, "innerRockets", false);
      };
      manager.setData(entity, "skyhighheroes:dyn/rocket_inner_legs_enabled", nbt.getBoolean("innerRockets"));
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "fiskheroes:flying", false);
      manager.setData(entity, "skyhighheroes:dyn/rockets_arms", false);
      manager.setData(entity, "skyhighheroes:dyn/rockets_legs", false);
      manager.setData(entity, "skyhighheroes:dyn/rockets_body", false);
    },
    onSleep: function (entity, manager) {
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_rockets", entity.getData("fiskheroes:flying"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_rockets_body", entity.getData("skyhighheroes:dyn/rockets_body"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_rockets_arms", entity.getData("skyhighheroes:dyn/rockets_arms"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_rockets_legs", entity.getData("skyhighheroes:dyn/rockets_legs"));
      manager.setDataWithNotify(entity, "fiskheroes:flying", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_arms", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_legs", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_body", false);
    },
    onWake: function (entity, manager) {
      manager.setDataWithNotify(entity, "fiskheroes:flying", entity.getData("skyhighheroes:dyn/prev_rockets"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_body", entity.getData("skyhighheroes:dyn/prev_rockets_body"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_arms", entity.getData("skyhighheroes:dyn/prev_rockets_arms"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/rockets_legs", entity.getData("skyhighheroes:dyn/prev_rockets_legs"));
    },
  };
};