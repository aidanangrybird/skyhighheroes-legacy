/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  /**
   * Adds contact
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} username - Username to add as contact
   **/
  function addContact(entity, manager, username) {
    var nbt = system.getMainNBT(entity);
    if (entity.getName() == username) {
      system.moduleMessage(this, entity, "<e>You can not add yourself as a contact!");
      return;
    };
    if (username.length > 16) {
      system.moduleMessage(this, entity, "<e>Username is too long!");
      return;
    };
    if (!nbt.hasKey("contacts")) {
      var contacts = manager.newTagList();
      manager.appendString(contacts, username);
      manager.setTagList(nbt, "contacts", contacts);
      system.moduleMessage(this, entity, "<s>Successfully added <sh>" + username + "<s> as a contact!");
    } else {
      var contacts = nbt.getStringList("contacts");
      var index = system.getStringArray(contacts).indexOf(username);
      if (index > -1) {
        system.moduleMessage(this, entity, "<eh>" + username + "<e> is already a contact!");
      } else {
        system.moduleMessage(this, entity, "<s>Successfully added <sh>" + username + "<s> as a contact!");
        manager.appendString(contacts, username);
        if (nbt.getString("normalSelected") == "") {
          manager.setString(nbt, "normalSelected", username);
        };
      };
    };
    var list = contactsList(entity, manager);
    manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
    if ((list.length-1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
      manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length-1));
    };
    manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length-7, 0));
    system.updateList(entity, manager, 7, list);
  };
  /**
   * Remove contact by username
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {string} username - username of contact
   **/
  function removeContact(entity, manager, username) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("contacts")) {
      var newContactsList = manager.newTagList();
      manager.setTagList(nbt, "contacts", newContactsList);
    };
    var contacts = nbt.getStringList("contacts");
    if (contacts.tagCount() == 0) {
      system.moduleMessage(this, entity, "<e>You have no contacts to remove!");
      return;
    };
    var index = system.getStringArray(contacts).indexOf(username);
    if (index < 0) {
      system.moduleMessage(this, entity, "<e>Unable to find contact with username <eh>" + username + "<e> to remove!");
    } else {
      system.moduleMessage(this, entity, "<s>Removed contact with username <sh>" + username + "<s>!");
      manager.removeTag(contacts, index);
    };
    var list = contactsList(entity, manager);
    manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
    if ((list.length-1) < entity.getData("skyhighheroes:dyn/scroll_value")) {
      manager.setData(entity, "skyhighheroes:dyn/scroll_value", (list.length-1));
    };
    manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length-7, 0));
    system.updateList(entity, manager, 7, list);
  };
  /**
   * Lists player's contacts
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function listContacts(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("contacts")) {
      var newContactsList = manager.newTagList();
      manager.setTagList(nbt, "contacts", newContactsList);
    };
    var contacts = system.getStringArray(nbt.getStringList("contacts"));
    system.moduleMessage(this, entity,"<n>You have <nh>" + contacts.length + ((contacts.length == 1)?"<n> contact:": "<n> contacts:"));
    contacts.forEach(entry => {
      system.moduleMessage(this, entity, "<nh>" + entry);
    });
  };
  /**
   * Lists player's contacts
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function contactsList(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("contacts")) {
      var newContactsList = manager.newTagList();
      manager.setTagList(nbt, "contacts", newContactsList);
    };
    var contacts = system.getStringArray(nbt.getStringList("contacts"));
    return contacts;
  };
  return {
    name: "contacts",
    moduleMessageName: "Contacts",
    type: 1,
    command: "c",
    transerMenus: {
      "contacts": {
        parent: "main",
        prevButton: "main_contacts",
        buttons: {
          "contacts_edit": {
            borderingButtons: {
              bottom: "contacts_add",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_0");
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_contacts");
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                };
              },
            }
          },
          "contacts_add": {
            borderingButtons: {
              top: "contacts_edit",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_contacts");
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                };
              },
              textAction: (entity, manager, entry) => {
                addContact(entity, manager, entry);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
              },
            }
          },
          "contacts_delete": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                removeContact(entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_0");
              },
              backAction: (entity, manager) => {
                var listValue = entity.getData("skyhighheroes:dyn/list_value").toString();
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_" + listValue);
              },
            }
          },
          "contacts_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              upAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll_value");
                if (value > 0) {
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value")-1);
                };
                system.updateList(entity, manager, 7, list);
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 1) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "contacts_select_1": {
            borderingButtons: {
              top: "contacts_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 2) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "contacts_select_2": {
            borderingButtons: {
              top: "contacts_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 3) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "contacts_select_3": {
            borderingButtons: {
              top: "contacts_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 4) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "contacts_select_4": {
            borderingButtons: {
              top: "contacts_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 5) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "contacts_select_5": {
            borderingButtons: {
              top: "contacts_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
                if ((list.length) > 6) {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "contacts_select_6": {
            borderingButtons: {
              top: "contacts_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
              },
              downAction: (entity, manager) => {
                var list = contactsList(entity, manager);
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
      buttonID: "main_contacts",
      borderingButtons: {
        top: "main_personal",
        bottom: "main_chat",
        right: "main_groups",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/current_menu", "contacts");
          manager.setData(entity, "skyhighheroes:dyn/selected_button", "contacts_edit");
          var list = contactsList(entity, manager);
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
    helpMessage: "<n>!c <nh>-<n> Contacts",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch(argList[1]) {
          case "add":
            (argList.length == 3) ? addContact(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!c add <nh><name>");
            break;
          case "rem":
            (argList.length == 3) ? removeContact(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!c rem <nh><name>");
            break;
          case "list":
            listContacts(entity, manager);
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Contact commands:");
            system.moduleMessage(this, entity, "<n>!c add <nh><name><n> <nh>-<n> Adds contact by name");
            system.moduleMessage(this, entity, "<n>!c rem <nh><name><n> <nh>-<n> Removes contact by name");
            system.moduleMessage(this, entity, "<n>!c list <nh>-<n> Lists contacts");
            system.moduleMessage(this, entity, "<n>!c help <nh>-<n> Shows this list");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>contact<e> command! Try <eh>!c help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>contact<e> command! Try <eh>!c help<e> for a list of commands!");
      };
    },
  };
};