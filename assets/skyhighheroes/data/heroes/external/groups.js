function initModule(system) {
  /**
   * Turns NBT String List into an array for easier use in code
   * @param {JSEntity} entity - Entity to create group array from
   * @returns Array of group names
   **/
  function getGroupArray(entity) {
    var groupList = system.getMainNBT(entity).getTagList("groups");
    var count = groupList.tagCount();
    var result = [];
    for (i=0;i<count;i++) {
      result.push(groupList.getCompoundTag(i).getString("groupName"));
    };
    return result;
  };
  /**
   * Turns NBT String List into an array for easier use in code
   * @param {JSEntity} entity - Entity to create group array from
   * @returns Array of group names and member counts
   **/
  function getGroupArrayMembers(entity) {
    var groupList = system.getMainNBT(entity).getTagList("groups");
    var count = groupList.tagCount();
    var result = [];
    for (i=0;i<count;i++) {
      var group = groupList.getCompoundTag(i);
      var entry = {
        "groupName": group.getString("groupName"),
        "memberCount": group.getStringList("members").tagCount(),
      };
      result.push(entry);
    };
    return result;
  };
  /**
   * Adds group
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} groupName - Name of group
   **/
  function addGroup(entity, manager, groupName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var group = manager.newCompoundTag();
    var members = manager.newTagList();
    manager.appendString(members, entity.getName());
    manager.setString(group, "groupName", groupName);
    manager.setTagList(group, "members", members);
    var groups = nbt.getTagList("groups");
    var groupIndex = getGroupArray(entity, manager).indexOf(groupName);
    if (groupIndex > -1) {
      system.moduleMessage(this, entity, "<e>Duplicate group name <eh>" + groupName + "<e>!");
    } else {
      system.moduleMessage(this, entity, "<s>Group created with name: <sh>" + groupName + "<s>!");
      manager.appendTag(groups, group);
      if (nbt.getString("groupSelected") == "") {
        manager.setString(nbt, "groupSelected", groupName);
      };
    };
    var list = groupsList(entity, manager);
    manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
    if ((list.length-1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
      manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length-1));
    };
    manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length-7, 0));
    system.updateList(entity, manager, 7, list);
  };
  /**
   * List groups
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function listGroups(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groups = getGroupArrayMembers(entity, manager);
    system.moduleMessage(this, entity, "<n>You are in <nh>" + groups.length + ((groups.length == 1) ? "<n> group!" : "<n> groups!"));
    groups.forEach(entry => {
      system.moduleMessage(this, entity, "<nh>" + entry.groupName + "<n> (<nh>" + entry.memberCount + ((entry.memberCount > 1) ? "<n> members)" : "<n> member)"))
    });
  };
  /**
   * List groups
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function groupsList(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groupNames = getGroupArray(entity, manager);
    return groupNames;
  };
  /**
   * Remove group by group name
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} groupName - Name of group
   **/
  function removeGroup(entity, manager, groupName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groups = nbt.getTagList("groups");
    var groupIndex = getGroupArray(entity).indexOf(groupName);
    if (groupIndex < 0) {
      system.moduleMessage(this, entity, "<e>Unable to find group with name <eh>" + groupName + "<e> to remove!");
    } else {
      system.moduleMessage(this, entity, "<e>Removed group <eh>" + groupName + "<e>!");
      manager.removeTag(groups, groupIndex);
    };
    var list = groupsList(entity, manager);
    manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
    if ((list.length-1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
      manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length-1));
    };
    manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length-7, 0));
    system.updateList(entity, manager, 7, list);
  };
  /**
   * Adds member to group
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} groupName - Name of group to add member to
   * @param {string} username - Username to add to group
   **/
  function addGroupMember(entity, manager, groupName, username) {
    var nbt = system.getMainNBT(entity);
    var groups = nbt.getTagList("groups");
    var contacts = nbt.getTagList("contacts");
    var groupIndex = getGroupArray(entity).indexOf(groupName);
    var members = groups.getCompoundTag(groupIndex).getStringList("members");
    var memberIndex = system.getStringArray(members).indexOf(username);
    var groups = nbt.getTagList("groups");
    var contactIndex = system.getStringArray(contacts).indexOf(username);
    if (!nbt.hasKey("groups")) {
      system.moduleMessage(this, entity, "<e>You have not set up any groups yet!");
    } else if (groupIndex < 0) {
      system.moduleMessage(this, entity, "<e>Group <eh>" + groupName + "<e> does not exist!");
    } else if (contactIndex < 0) {
      system.moduleMessage(this, entity, "<eh>" + username + "<e> is not added as a contact!")
    } else if (memberIndex > -1) {
      system.moduleMessage(this, entity, "<e>Member <eh>" + username + "<e> is already in group <eh>" + groupName + "<e>!");
    } else {
      system.moduleMessage(this, entity, "<s>Successfully added <sh>" + username  + "<s> to group <sh>" + groupName + "<s>!");
      manager.appendString(members, username);
    };
  };
  /**
   * Adds member to group
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} groupName - Name of group to remove member from
   * @param {string} username - Username to remove from group
   **/
  function removeGroupMember(entity, manager, groupName, username) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groups = nbt.getTagList("groups");
    var groupIndex = getGroupArray(entity).indexOf(groupName);
    var members = groups.getCompoundTag(groupIndex).getStringList("members");
    var memberIndex = system.getStringArray(members).indexOf(username);
    if (groupIndex < 0) {
      system.moduleMessage(this, entity, "<e>Group <eh>" + groupName + "<e> does not exist!");
    } else if (memberIndex < 0) {
      system.moduleMessage(this, entity, "<eh>" + username + "<e> is not in group <eh>" + groupName + "<e>!");
    } else {
      system.moduleMessage(this, entity, "<s>Successfully removed <sh>" + username  + "<s> from group <sh>" + groupName + "<s>!");
      manager.removeTag(members, memberIndex);
    };
  };
  /**
   * Lists members of group
   * @param {JSEntity} entity - Required
   * @param {integer} groupName - Name of group to add member to
   **/
  function listGroupMembers(entity, manager, groupName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groups = nbt.getTagList("groups");
    var groupIndex = getGroupArray(entity).indexOf(groupName);
    var members = system.getStringArray(groups.getCompoundTag(groupIndex).getStringList("members"));
    if (groupIndex < 0) {
      system.moduleMessage(this, entity, "<e>Group <eh>" + groupName + "<e> does not exist!");
    } else {
      system.moduleMessage(this, entity, "<s>Members in <sh>" + groupName + "<s>:")
      members.forEach(entry => {
        system.moduleMessage(this, entity, "<sh>" + entry);
      });
    };
  };
  /**
   * Lists members of group
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} groupName - Name of group to add member to
   **/
  function groupMembersList(entity, manager, groupName) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("groups")) {
      var newGroupsList = manager.newTagList();
      manager.setTagList(nbt, "groups", newGroupsList);
    };
    var groups = nbt.getTagList("groups");
    var groupIndex = getGroupArray(entity).indexOf(groupName);
    var members = system.getStringArray(groups.getCompoundTag(groupIndex).getStringList("members"));
    var membersList = [];
    if (groupIndex > -1) {
      members.forEach(entry => {
        membersList.push(entry);
      });
    };
    return membersList;
  };
  return {
    name: "groups",
    moduleMessageName: "Groups",
    type: 1,
    command: "g",
    transerMenus: {
      "groups": {
        parent: "main",
        prevButton: "main_groups",
        buttons: {
          "groups_edit": {
            borderingButtons: {
              bottom: "groups_add",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_0");
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_groups");
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                };
              },
            }
          },
          "groups_add": {
            borderingButtons: {
              top: "groups_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_groups");
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                };
              },
              textAction: (entity, manager, entry) => {
                addGroup(entity, manager, entry);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "groups_delete": {
            borderingButtons: {
              top: "groups_members"
            },
            properties: {
              confirmAction: (entity, manager) => {
                removeGroup(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_0");
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_" + listValue);
              },
            }
          },
          "groups_members": {
            borderingButtons: {
              bottom: "groups_delete"
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "group_members");
                manager.setData(entity, "skyhighheroes:dyn/prev_list_entry", entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/prev_list_value", entity.getData("skyhighheroes:dyn/list_value"));
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                system.updateList(entity, manager, 7, list);
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_" + listValue);
              },
            }
          },
          "groups_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              upAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if (value > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")-1);
                };
                system.updateList(entity, manager, 7, list);
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 1) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "groups_select_1": {
            borderingButtons: {
              top: "groups_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 2) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "groups_select_2": {
            borderingButtons: {
              top: "groups_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 3) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "groups_select_3": {
            borderingButtons: {
              top: "groups_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 4) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "groups_select_4": {
            borderingButtons: {
              top: "groups_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 5) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "groups_select_5": {
            borderingButtons: {
              top: "groups_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
                if ((list.length) > 6) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "groups_select_6": {
            borderingButtons: {
              top: "groups_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsList(entity, manager);
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
          },
          //Members submenu
        }
      },
      "group_members": {
        parent: "groups",
        buttons: {
          "groups_members_edit": {
            borderingButtons: {
              bottom: "groups_members_add",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_0");
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "groups");
                var list = groupsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                system.updateList(entity, manager, 7, list);
                var listValue = entity.getData("skyhighheroes:dyn/prev_list_value").toString();
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_" + listValue);
              },
            }
          },
          "groups_members_add": {
            borderingButtons: {
              top: "groups_members_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "groups");
                  var list = groupsList(entity, manager);
                  manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                  system.updateList(entity, manager, 7, list);
                  var listValue = entity.getData("skyhighheroes:dyn/prev_list_value").toString();
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_select_" + listValue);
                };
              },
              textAction: (entity, manager, entry) => {
                addGroupMember(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"), entry);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "groups_members_delete": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                removeGroupMember(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"), entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_0");
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_" + listValue);
              },
            }
          },
          "groups_members_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              upAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if (value > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")-1);
                };
                system.updateList(entity, manager, 7, list);
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 1) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "groups_members_select_1": {
            borderingButtons: {
              top: "groups_members_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 2) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "groups_members_select_2": {
            borderingButtons: {
              top: "groups_members_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 3) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "groups_members_select_3": {
            borderingButtons: {
              top: "groups_members_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 4) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "groups_members_select_4": {
            borderingButtons: {
              top: "groups_members_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 5) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "groups_members_select_5": {
            borderingButtons: {
              top: "groups_members_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupMembersList(entity, manager, entity.getData("skyhighheroes:dyn/prev_list_entry"));
                if ((list.length) > 6) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "groups_members_select_6": {
            borderingButtons: {
              top: "groups_members_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_members_edit");
              },
              downAction: (entity, manager) => {
                var list = groupsMembersList(entity);
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
      buttonID: "main_groups",
      borderingButtons: {
        top: "main_Brother",
        bottom: "main_settings",
        left: "main_contacts",
        right: "main_waypoints",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/current_menu", "groups");
          manager.setData(entity, "skyhighheroes:dyn/selected_button", "groups_edit");
          var list = groupsList(entity, manager);
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
    helpMessage: "<n>!g <nh>-<n> Groups",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch (argList[1]) {
          case "add":
            (argList.length == 3) ? addGroup(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!g add <nh><name>");
            break;
          case "rem":
            (argList.length == 3) ? removeGroup(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!g rem <nh><name>");
            break;
          case "list":
            listGroups(entity, manager);
            break;
          case "addMem":
            (argList.length == 3) ? addGroupMember(entity, manager, entity.getData("skyhighheroes:dyn/group_name"), argList[2]) : system.moduleMessage(this, entity, "<n>!g addMem <nh><name>");
            break;
          case "remMem":
            (argList.length == 3) ? removeGroupMember(entity, manager, entity.getData("skyhighheroes:dyn/group_name"), argList[2]) : system.moduleMessage(this, entity, "<n>!g remMem <nh><name>");
            break;
          case "listMem":
            listGroupMembers(entity, manager, entity.getData("skyhighheroes:dyn/group_name"));
            break;
          case "help":
            system.moduleMessage(this, entity, "Group commands:")
            system.moduleMessage(this, entity, "<n>!g add <nh><name><n> <nh>-<n> Creates group by name");
            system.moduleMessage(this, entity, "<n>!g rem <nh><name><n> <nh>-<n> Removes group by name");
            system.moduleMessage(this, entity, "<n>!g list <nh>-<n> Lists groups");
            system.moduleMessage(this, entity, "Below commands apply to the currently selected group!")
            system.moduleMessage(this, entity, "<n>!g addMem <nh><name><n> <nh>-<n> Adds member to currently selected group");
            system.moduleMessage(this, entity, "<n>!g remMem <nh><name><n> <nh>-<n> Removes member from currently selected group");
            system.moduleMessage(this, entity, "<n>!g listMem <nh>-<n> Lists members in currently selected group");
            system.moduleMessage(this, entity, "<n>!g help <nh>-<n> Shows this list");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown group command! Try <eh>!g help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown group command! Try <eh>!g help<e> for a list of commands!");
      };
    },
  };
};
