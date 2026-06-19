function initModule(system) {
  /**
   * Turns NBT String List into an array for easier use in code
   * @param {JSEntity} entity - Entity to create waypoint array from
   * @param {JSDataManager} manager - required
   * @returns Array of waypoint names
   **/
  function getWaypointNameArray(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypointList = nbt.getTagList("waypoints");
    var count = waypointList.tagCount();
    var result = [];
    for (i=0;i<count;i++) {
      result.push(waypointList.getCompoundTag(i).getString("waypointName"));
    };
    return result;
  };
  /**
   * Turns NBT String List into an array for easier use in code
   * @param {JSEntity} entity - Entity to create waypoint array from
   * @param {JSDataManager} manager - required
   * @returns Array of waypoint names, coords and dimension
   **/
  function getWaypointArray(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypointList = nbt.getTagList("waypoints");
    var count = waypointList.tagCount();
    var result = [];
    for (i=0;i<count;i++) {
      var waypointTag = waypointList.getCompoundTag(i);
      var waypoint = {
        name: waypointTag.getString("waypointName"),
        coords: [waypointTag.getInteger("xCoord"),waypointTag.getInteger("yCoord"),waypointTag.getInteger("zCoord"),waypointTag.getInteger("dim")]
      };
      result.push(waypoint);
    };
    return result;
  };
  /**
   * Adds waypoint
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} waypointName - Name of waypoint
   **/
  function addWaypoint(entity, manager, waypointName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypoint = manager.newCompoundTag();
    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    manager.setString(waypoint, "waypointName", waypointName);
    manager.setInteger(waypoint, "xCoord", x);
    manager.setInteger(waypoint, "yCoord", y);
    manager.setInteger(waypoint, "zCoord", z);
    manager.setInteger(waypoint, "dim", dim);
    var waypoints = nbt.getTagList("waypoints");
    var waypointIndex = getWaypointNameArray(entity, manager).indexOf(waypointName);
    if (waypointIndex > -1) {
      system.moduleMessage(this, entity, "<e>Duplicate waypoint name <eh>" + waypointName + "<e>!");
    } else {
      system.moduleMessage(this, entity, "<s>Waypoint created with name: <sh>" + waypointName + "<s>!");
      manager.appendTag(waypoints, waypoint);
    };
  };
  /**
   * Remove waypoint by waypoint name
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} waypointName - Name of waypoint
   **/
  function removeWaypoint(entity, manager, waypointName) {
    var nbt = system.getMainNBT(entity);
    var waypoints = nbt.getTagList("waypoints");
    var waypointIndex = getWaypointNameArray(entity, manager).indexOf(waypointName);
    if (waypointIndex < 0) {
      system.moduleMessage(this, entity, "<e>Unable to find waypoint with name <eh>" + waypointName + "<e> to remove!");
    } else {
      system.moduleMessage(this, entity, "<e>Removed waypoint <eh>" + waypointName + "<e>!");
      manager.removeTag(waypoints, waypointIndex);
    };
  };
  /**
   * Teleports to waypoint by waypoint name
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} waypointName - Name of waypoint
   **/
  function teleportToWaypoint(entity, manager, waypointName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypointIndex = getWaypointNameArray(entity, manager).indexOf(waypointName);
    if (waypointIndex < 0) {
      system.moduleMessage(this, entity, "<e>Unable to find waypoint with name <eh>" + waypointName + "<e> to teleport to!");
    } else {
      var waypoint = nbt.getTagList("waypoints").getCompoundTag(waypointIndex);
      system.moduleMessage(this, entity, "<s>Selected waypoint <sh>" + waypoint.getString("waypointName") + "<s>!");
      manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(waypoint.getInteger("xCoord"), waypoint.getInteger("yCoord"), waypoint.getInteger("zCoord"), waypoint.getInteger("dim")));
      manager.setData(entity, "fiskheroes:teleport_delay", 6);
    };
  };
  /**
   * Lists waypoints
   * @param {JSEntity} entity - Required
   **/
  function listWaypoints(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypoints = getWaypointArray(entity, manager);
    system.moduleMessage(this, entity, "<n>You have <nh>" + waypoints.length + ((waypoints.length == 1) ? "<n> waypoint!" : "<n> waypoints!"));
    waypoints.forEach(entry => {
      var waypointMessage = "<nh>" + entry.name + "<n>: (<nh>" + entry.coords[0] + "<n>, <nh>" + entry.coords[1] + "<n>, <nh>" + entry.coords[2] + "<n>, <nh>DIM" + entry.coords[3] + "<n>)";
      var waypoint = PackLoader.asVec3(entry.coords[0],entry.coords[1],entry.coords[2]).add(0.5, 0, 0.5);
      if (system.hasOwnProperty("distance")) {
        var distance = system.distance(entity.pos(), waypoint);
        waypointMessage = waypointMessage + "<n> <nh>" + distance;
      };
      if (system.hasOwnProperty("direction")) {
        var direction = system.direction(entity.pos(), waypoint);
        waypointMessage = waypointMessage + "<n> <nh>" + direction;
      };
      if (system.hasOwnProperty("elevation")) {
        var elevation = system.elevation(entity.pos(), waypoint);
        waypointMessage = waypointMessage + "<n> <nh>" + ((elevation == 0) ? "-" : ((elevation > 0) ? "+" + elevation : "V " + elevation));
      };
      system.moduleMessage(this, entity, waypointMessage);
    });
  };
  /**
   * List of waypoints
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @returns List of waypoint names
   **/
  function waypointsList(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var waypointNames = getWaypointNameArray(entity, manager);
    return waypointNames;
  };
  /**
   * Waypoint data
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} waypoint - name of waypoint
   * @returns Waypoint data
   **/
  function getWaypointInfo(entity, manager, waypoint) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var coords = "0;:0;:0;:0";
    var waypointNames = getWaypointNameArray(entity, manager);
    var waypointDataArray = getWaypointArray(entity, manager);
    var waypointIndex = waypointNames.indexOf(waypoint);
    if (waypointIndex > -1) {
      waypointData = waypointDataArray[waypointIndex].coords;
      coords = waypointData[0] + ";:" + waypointData[1] + ";:" + waypointData[2] + ";:" + waypointData[3]
    };
    return coords;
  };
  /**
   * Waypoint data
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} waypoint - name of waypoint
   **/
  function trackWaypoint(entity, manager, waypoint) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    if (!nbt.hasKey("trackedWaypoint")) {
      manager.setString(nbt, "trackedWaypoint", "");
    };
    var waypointNames = getWaypointNameArray(entity, manager);
    var waypointDataArray = getWaypointArray(entity, manager);
    var waypointIndex = waypointNames.indexOf(waypoint);
    if (waypointIndex > -1) {
      waypointData = waypointDataArray[waypointIndex].coords;
      data = waypoint + ";:" + waypointData[0] + ";:" + waypointData[1] + ";:" + waypointData[2] + ";:" + waypointData[3];
      manager.setString(nbt, "trackedWaypoint", "");
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/tracked_waypoint", data);
      system.systemMessage(entity, "Now tracking waypoint " + waypoint + "!")
    };
  };
  return {
    name: "waypoints",
    moduleMessageName: "Waypoints",
    type: 1,
    command: "wp",
    transerMenus: {
      "waypoints": {
        parent: "main",
        prevButton: "main_waypoints",
        buttons: {
          "waypoints_edit": {
            borderingButtons: {
              bottom: "waypoints_add",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_select_0");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "1;:1;:1;:1");
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  system.setButton(entity, manager, "main_waypoints");
                  system.setMenu(entity, manager, "main");
                };
              },
            }
          },
          "waypoints_add": {
            borderingButtons: {
              top: "waypoints_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  system.setButton(entity, manager, "main_waypoints");
                  system.setMenu(entity, manager, "main");
                };
              },
              textAction: (entity, manager, entry) => {
                addWaypoint(entity, manager, entry);
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                if ((list.length - 1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length - 1));
                };
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 7, 0));
                system.updateList(entity, manager, 7, list);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "waypoints_delete": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                removeWaypoint(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                if ((list.length - 1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length - 1));
                };
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 7, 0));
                system.updateList(entity, manager, 7, list);
                system.setButton(entity, manager, "waypoints_select_0");
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                system.setButton(entity, manager, "waypoints_select_" + listValue);
              },
            }
          },
          "waypoints_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              upAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if (value > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")-1);
                };
                system.updateList(entity, manager, 7, list);
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  system.setButton(entity, manager, "waypoints_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_1": {
            borderingButtons: {
              top: "waypoints_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  system.setButton(entity, manager, "waypoints_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_2": {
            borderingButtons: {
              top: "waypoints_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  system.setButton(entity, manager, "waypoints_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_3": {
            borderingButtons: {
              top: "waypoints_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  system.setButton(entity, manager, "waypoints_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_4": {
            borderingButtons: {
              top: "waypoints_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  system.setButton(entity, manager, "waypoints_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_5": {
            borderingButtons: {
              top: "waypoints_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  system.setButton(entity, manager, "waypoints_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_6": {
            borderingButtons: {
              top: "waypoints_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
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
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          }
        }
      }
    },
    transerMainButton: {
      buttonID: "main_waypoints",
      borderingButtons: {
        top: "main_Brother",
        bottom: "main_settings",
        left: "main_groups",
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "waypoints");
          system.setButton(entity, manager, "waypoints_edit");
          var list = waypointsList(entity, manager);
          manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
          manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
          manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length-7, 0));
          system.updateList(entity, manager, 7, list);
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/transer", false);
        }
      }
    },
    cyberMainButton: {
      buttonID: "main_waypoints",
      borderingButtons: {
        top: "main_contacts_groups",
        bottom: "main_chat"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "waypoints");
          system.setButton(entity, manager, "waypoints_add");
          var list = waypointsList(entity, manager);
          manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
          manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
          manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
          system.updateList(entity, manager, 10, list);
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
        },
        selectAction: (entity, manager) => {
          var list = waypointsList(entity, manager);
          manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
          manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
          manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
          system.updateList(entity, manager, 10, list);
        }
      }
    },
    cyberMenus: {
      "waypoints": {
        parent: "main",
        prevButton: "main_waypoints",
        buttons: {
          "waypoints_edit": {
            borderingButtons: {
              top: "waypoints_add",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_select_0");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", "1;:1;:1;:1");
                var list = getWaypointNameArray(entity, manager);
                system.updateList(entity, manager, 10, list);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  system.setButton(entity, manager, "main_waypoints");
                  system.setMenu(entity, manager, "main");
                };
              },
            }
          },
          "waypoints_add": {
            borderingButtons: {
              bottom: "waypoints_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  system.setButton(entity, manager, "main_waypoints");
                  system.setMenu(entity, manager, "main");
                };
              },
              textAction: (entity, manager, entry) => {
                addWaypoint(entity, manager, entry);
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                if ((list.length - 1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length - 1));
                };
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                system.updateList(entity, manager, 10, list);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "waypoints_delete": {
            borderingButtons: {
              top: "waypoints_track",
            },
            properties: {
              confirmAction: (entity, manager) => {
                removeWaypoint(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                if ((list.length - 1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length - 1));
                };
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                system.updateList(entity, manager, 10, list);
                system.setButton(entity, manager, "waypoints_select_0");
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                system.setButton(entity, manager, "waypoints_select_" + listValue);
              },
            }
          },
          "waypoints_track": {
            borderingButtons: {
              bottom: "waypoints_delete",
            },
            properties: {
              confirmAction: (entity, manager) => {
                trackWaypoint(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                system.setButton(entity, manager, "waypoints_select_" + listValue);
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                system.setButton(entity, manager, "waypoints_select_" + listValue);
              },
            }
          },
          "waypoints_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                system.scrollUp(entity, manager, list);
                system.updateList(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  system.setButton(entity, manager, "waypoints_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_1": {
            borderingButtons: {
              top: "waypoints_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  system.setButton(entity, manager, "waypoints_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_2": {
            borderingButtons: {
              top: "waypoints_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  system.setButton(entity, manager, "waypoints_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_3": {
            borderingButtons: {
              top: "waypoints_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  system.setButton(entity, manager, "waypoints_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_4": {
            borderingButtons: {
              top: "waypoints_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  system.setButton(entity, manager, "waypoints_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_5": {
            borderingButtons: {
              top: "waypoints_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  system.setButton(entity, manager, "waypoints_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_6": {
            borderingButtons: {
              top: "waypoints_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_7") != "") {
                  system.setButton(entity, manager, "waypoints_select_7");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_7": {
            borderingButtons: {
              top: "waypoints_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_8") != "") {
                  system.setButton(entity, manager, "waypoints_select_8");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_8": {
            borderingButtons: {
              top: "waypoints_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_9") != "") {
                  system.setButton(entity, manager, "waypoints_select_9");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
          "waypoints_select_9": {
            borderingButtons: {
              top: "waypoints_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_track");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "waypoints_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = waypointsList(entity, manager);
                system.scrollDown(entity, manager, 10, list);
                system.updateList(entity, manager, 10, list);
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
                var data = getWaypointInfo(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", data);
              }
            }
          },
        }
      }
    },
    helpMessage: "<n>!wp <nh>-<n> Waypoints",
    disabledMessage: "<e>Module <eh>waypoints<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch (argList[1]) {
          case "add":
            (argList.length == 3) ? addWaypoint(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!wp add <nh><waypointName>");
            break;
          case "rem":
            (argList.length == 3) ? removeWaypoint(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!wp rem <nh><waypointName>");
            break;
          case "tp":
            if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
              (argList.length == 3) ? teleportToWaypoint(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!wp tp <nh><waypointName>");
            } else {
              system.moduleMessage(this, entity, "<e>Unknown waypoint command! Try <eh>!wp help<e> for a list of commands!");
            };
            break;
          case "list":
            listWaypoints(entity, manager);
            break;
          case "help":
            system.moduleMessage(this, entity, "Waypoint commands:")
            system.moduleMessage(this, entity, "<n>!wp add <nh><name><n> <nh>-<n> Creates waypoint at current location by name");
            system.moduleMessage(this, entity, "<n>!wp rem <nh><name><n> <nh>-<n> Removes waypoint by name");
            if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
              system.moduleMessage(this, entity, "<n>!wp tp <nh><name><n> <nh>-<n> TPs to waypoint by name");
            };
            system.moduleMessage(this, entity, "<n>!wp list <nh>-<n> Lists waypoints");
            system.moduleMessage(this, entity, "<n>!wp help <nh>-<n> Shows waypoint commands");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown waypoint command! Try <eh>!wp help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>waypoint<e> command! Try <eh>!wp help<e> for a list of commands!");
      };
    },
  };
};