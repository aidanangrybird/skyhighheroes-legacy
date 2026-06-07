/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  //The point of BrotherBand is to allow communication at much farther ranges and to give buffs when you are near each other
  var locations = {
    "center": "0",
    "left_top": "1",
    "right_top": "2",
    "left_center": "3",
    "right_center": "4",
    "left_bottom": "5",
    "right_bottom": "6",
  };


  //Rework the entire thing so that reading a brother's personal and secret message requires the brother be online, therefore allowing me to remove the public key, encrypted message, and personal message from the brother nbt data
  //Also add a way to reestablish brotherband with a brother if the entityID is different
  /**
   * Forms BrotherBand
   * @param {JSEntity} entity - Player forming BrotherBand
   * @param {JSDataManager} manager - Required
   * @param {string} username - Username of player to form BrotherBand with
   * @param {string} location - Location on brothers screen
   **/
  function addBrotherBand(entity, manager, otherEntityID, location) {
    var success = false;
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("Brothers")) {
      var newBrotherBandList = manager.newTagList();
      manager.setTagList(nbt, "Brothers", newBrotherBandList);
    };
    var maxedBrothers = maxBrothers(entity);
    if (!maxedBrothers) {
      var otherEntity = entity.world().getEntityById(parseInt(otherEntityID));
      if (otherEntity.exists() && otherEntity.isLivingEntity()) {
        if (otherEntity.is("PLAYER")) {
          var otherPlayer = otherEntity.as("PLAYER");
          if (otherPlayer.isWearingFullSuit()) {
            if (system.isWearingTranser(otherEntity)) {
              var otherNBT = system.mainNBT(otherEntity);
              if (!otherNBT.hasKey("Brothers")) {
                var brotherBand = manager.newTagList();
                manager.setTagList(otherNBT, "Brothers", brotherBand);
              };
              var brotherFormed = hasBrother(entity, otherEntity.getName());
              var brotherFormedOther = entityHasBrother(entity, otherEntity);
              var maxedOtherBrothers = maxBrothers(otherEntity);
              if (!brotherFormed && !brotherFormedOther && !maxedOtherBrothers) {
                var brotherBand = nbt.getTagList("Brothers");
                var brotherBandOther = otherNBT.getTagList("Brothers");
                var otherBrother = createSelfBrotherNBT(otherEntity, manager, parseInt(otherEntityID));
                manager.setString(otherBrother, "location", location);
                manager.appendTag(brotherBand, otherBrother);
                var foundBrotherSlot = "";
                var openLocations = openBrothersLocation(otherEntity);
                openLocations.forEach(openLocation => {
                  if (foundBrotherSlot != "") {
                    foundBrotherSlot = openLocation;
                  };
                });
                if (foundBrotherSlot != "") {
                  var entityID = otherEntity.getData("fiskheroes:grabbed_by");
                  var brotherBandSelf = createSelfBrotherNBT(entity, manager, entityID);
                  manager.setString(brotherBandSelf, "location", foundBrotherSlot);
                  manager.appendTag(brotherBand, brotherBandSelf);
                };
                system.moduleMessage(this, entity, "<s>Successfully formed BrotherBand connection to <sh>" + otherEntity.getName() + "<s>!");
                updateList(entity, manager);
                system.moduleMessage(this, otherEntity, "<s>Successfully formed BrotherBand connection to <sh>" + entity.getName() + "<s>!");
                updateList(otherEntity, manager);
                success = true;
              } else {
                if (brotherFormed || brotherFormedOther) {
                  system.moduleMessage(this, entity, "<e>Brother has already been formed between players!");
                };
                if (maxedOtherBrothers) {
                  system.moduleMessage(this, entity, "<e>Other player has reached the maximum amount of Brothers!");
                };
                success = false;
              };
            };
          } else {
            system.moduleMessage(this, entity, "<e>Entity is not wearing a transer!");
            success = false;
          };
        } else {
          system.moduleMessage(this, entity, "<e>Entity is not a player!");
          success = false;
        };
      };
    } else {
      system.moduleMessage(this, entity, "<e>You have reached the maximum amount of Brother!");
      success = false;
    };
    return success;
  };
  /**
   * Deletes BrotherBand
   * @param {JSPlayer} player - Player deleteting BrotherBand
   * @param {JSDataManager} manager - Required
   * @param {integer} username - Username of player deleteting BrotherBand with
   **/
  function deleteBrotherBand(entity, manager, username) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("Brothers")) {
      var newBrotherBandList = manager.newTagList();
      manager.setTagList(nbt, "Brothers", newBrotherBandList);
    };
    var brotherBand = nbt.getTagList("Brothers");
    if (brotherBand.tagCount() == 0) {
      system.moduleMessage(this, entity, "<e>You have no BrotherBands to delete!");
    } else {
      var index = brothersUsernames(entity).indexOf(username);
      if (index < 0) {
        system.moduleMessage(this, entity, "<e>Unable to find BrotherBand with username <eh>" + username + "<e> to delete!");
      } else {
        var location = brothersLocation(entity)[index];
        var entryNumber = locations[location];
        system.moduleMessage(this, entity, "Index " + index + "");
        system.moduleMessage(this, entity, "<s>Removed BrotherBand with <sh>" + username + "<s>!");
        manager.removeTag(brotherBand, index);
        manager.setData(entity, "skyhighheroes:dyn/scroll_entry_"+entryNumber, "");
      };
    };
    updateList(entity, manager);
  };
  /**
   * Lists player's BrotherBands
   * @param {JSEntity} entity - Required
   **/
  function listBrotherBands(entity) {
    var brotherBand = brothersUsernames(entity);
    system.moduleMessage(this, entity,"<nh>You have <nh>" + brotherBand.length + ((brotherBand.length == 1)?"<n> Brothers!": "<n> Brother!"));
    brotherBand.forEach(entry => {
      system.moduleMessage(this, entity, entry);
    });
  };

  function updateBrotherBand(entity, manager, otherEntityID) {
    var success = false;
    var entry = entity.getData("skyhighheroes:dyn/list_entry").split(";:");
    var username = entry[0];
    var satellite = entry[1];
    var uuid = entry[4];
    var human = entry[5];
    var otherEntity = entity.world().getEntityById(parseInt(otherEntityID));
    if (otherEntity.exists() && otherEntity.isLivingEntity()) {
      if (otherEntity.is("PLAYER")) {
        var otherPlayer = otherEntity.as("PLAYER");
        if (otherPlayer.isWearingFullSuit()) {
          if (system.isWearingTranser(otherEntity)) {
            if (hasBrother(otherEntity, entity.getName())) {
              var otherNBT = system.mainNBT(otherEntity);
              if ((username == otherEntity.getName()) && (satellite == otherNBT.getString("satellite"))) {
                if (uuid != "") {
                  if ((uuid == otherEntity.getUUID()) && (uuid == otherEntity.getString("compatibleUUID")) && (human == otherNBT.getString("compatibleHuman"))) {
                    success = true;
                    var nbt = mainNBT(entity);
                    var index = brothersUsernames(entity).indexOf(username);
                    var otherBrotherSelf = nbt.getTagList("Brothers").getCompoundTag(index);
                    manager.setInteger(otherBrotherSelf, "entityID", parseInt(otherEntityID));
                    var selfEntityID = otherEntity.getData("fiskheroes:grabbed_by");
                    var otherIndex = brothersUsernames(otherEntity).indexOf(entity.getName());
                    var selfBrotherOther = nbt.getTagList("Brothers").getCompoundTag(otherIndex);
                    manager.setInteger(selfBrotherOther, "entityID", parseInt(otherEntityID));
                    system.moduleMessage(this, entity, "Reestablished connection with " + human + "!");
                    updateList(entity, manager);
                    system.moduleMessage(this, otherEntity, "Reestablished connection with " + ((nbt.hasKey("compatibleHuman")) ? nbt.getString("compatibleHuman") : entity.getName()) + "!");
                    updateList(otherEntity, manager);
                  };
                } else {
                  success = true;
                  var nbt = mainNBT(entity);
                  var index = brothersUsernames(entity).indexOf(username);
                  var otherBrotherSelf = nbt.getTagList("Brothers").getCompoundTag(index);
                  manager.setInteger(otherBrotherSelf, "entityID", parseInt(otherEntityID));
                  var selfEntityID = otherEntity.getData("fiskheroes:grabbed_by");
                  var otherIndex = brothersUsernames(otherEntity).indexOf(entity.getName());
                  var selfBrotherOther = nbt.getTagList("Brothers").getCompoundTag(otherIndex);
                  manager.setInteger(selfBrotherOther, "entityID", parseInt(otherEntityID));
                  system.moduleMessage(this, entity, "Reestablished connection with " + human + "!");
                  updateList(entity, manager);
                  system.moduleMessage(this, otherEntity, "Reestablished connection with " + ((nbt.hasKey("compatibleHuman")) ? nbt.getString("compatibleHuman") : entity.getName()) + "!");
                  updateList(otherEntity, manager);
                };
              };
            } else {
              system.moduleMessage(this, entity, "Player does not have you as a Brother!");
            };
          };
        };
      } else {
        system.moduleMessage(this, entity, "Entity is not a player!");
      };
    };
    return success;
  };
  /**
   * Lists player's BrotherBands
   * @param {JSEntity} entity - Required
   * @returns Array of the data for each brother
   **/
  function brothersData(entity) {
    var nbt = system.mainNBT(entity);
    var brotherList = nbt.getTagList("Brothers");
    var count = brotherList.tagCount();
    var result = [];
    for (i=0;i<count;i++) {
      var brother = brotherList.getCompoundTag(i);
      var entry = {};
      if (!brother.hasKey("uuid") && !brother.hasKey("humanName")) {
        entry = {
          username: brother.getString("username"),
          satellite: brother.getString("satellite"),
          location: brother.getString("location"),
          entityID: brother.getInteger("entityID"),
        };
      };
      if (brother.hasKey("uuid") && !brother.hasKey("humanName")) {
        entry = {
          username: brother.getString("username"),
          satellite: brother.getString("satellite"),
          location: brother.getString("location"),
          entityID: brother.getInteger("entityID"),
          uuid: brother.getString("uuid"),
        };
      };
      if (brother.hasKey("uuid") && brother.hasKey("humanName")) {
        entry = {
          username: brother.getString("username"),
          satellite: brother.getString("satellite"),
          location: brother.getString("location"),
          entityID: brother.getInteger("entityID"),
          uuid: brother.getString("uuid"),
          humanName: brother.getString("humanName"),
        };
      };
      result.push(entry);
    };
    return result;
  };
  /**
   * Array of player's Brother usernames
   * @param {JSEntity} entity - Required
   * @returns Array of brother usernames
   **/
  function brothersUsernames(entity) {
    var brotherData = brothersData(entity);
    var result = [];
    brotherData.forEach(entry => {
      result.push(entry.username);
    });
    return result;
  };
  /**
   * Array of player's Brother locations
   * @param {JSEntity} entity - Required
   * @returns Array of brother locations
   **/
  function brothersLocation(entity) {
    var brotherData = brothersData(entity);
    var result = [];
    brotherData.forEach(entry => {
      result.push(entry.location);
    });
    return result;
  };
  /**
   * Array of player's open Brother locations
   * @param {JSEntity} entity - Required
   * @returns Array of open brother locations
   **/
  function openBrothersLocation(entity) {
    var validLocations = ["left_top", "right_top", "left_center", "right_center", "left_bottom", "right_bottom"];
    var brotherData = brothersData(entity);
    var brotherLocations = [];
    var result = [];
    brotherData.forEach(entry => {
      brotherLocations.push(entry.location);
    });
    validLocations.forEach(entry => {
      if (brotherLocations.indexOf(entry) == -1) {
        result.push(entry);
      };
    });
    return result;
  };
  
  /**
   * Lists player's BrotherBands
   * @param {JSEntity} entity - Required
   **/
  function brothersList(entity) {
    var brothersList = brothersData(entity);
    var list = [];
    var selfBrother = createSelfBrother(entity);
    list.push(brotherEntry(selfBrother));
    brothersList.forEach(brother => {
      list.push(brotherEntry(brother));
    });
    return list;
  };

  function updateList(entity, manager) {
    var list = brothersList(entity);
    var selfBrother = createSelfBrother(entity);
    list.push(brotherEntry(selfBrother));
    setBrotherLocations(entity, manager, list);
  };
  
  /**
   * Lists player's BrotherBands
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {Array} list - Required
   **/
  function setBrotherLocations(entity, manager, list) {
    var domain = system.mainPiece(entity).suitType().split(":")[0];
    list.forEach(entry => {
      var entryList = entry.split(";:");
      var location = entryList[2];
      var value = 0;
      if (locations.hasOwnProperty(location)) {
        value = locations[location];
      };
      manager.setData(entity, domain + ":dyn/scroll_entry_" + value, entry);
    });
  };
  /**
   * Lists player's BrotherBands
   * @param {JSEntity} entry - Required
   **/
  function brotherEntry(entry) {
    var brother = ""
    //0
    if (entry.hasOwnProperty("username")) {
      brother = brother + entry.username;
    };
    //1
    if (entry.hasOwnProperty("satellite")) {
      brother = brother + ";:" + entry.satellite;
    };
    //2
    if (entry.hasOwnProperty("location")) {
      brother = brother + ";:" + entry.location;
    };
    //3
    if (entry.hasOwnProperty("entityID")) {
      brother = brother + ";:" + entry.entityID;
    };
    //4
    if (entry.hasOwnProperty("uuid")) {
      brother = brother + ";:" + entry.uuid;
    };
    //5
    if (entry.hasOwnProperty("humanName")) {
      brother = brother + ";:" + entry.humanName;
    };
    return brother;
  };
  /**
   * Checks if a player has another player as a Brother
   * @param {JSEntity} sender - Player getting checked
   * @param {JSEntity} receiver - Player whose BrotherBand list is being checked
   * @returns If sender is in receiver's BrotherBands
   **/
  function entityHasBrother(sender, receiver) {
    var brotherBands = brothersUsernames(entity);
    var result = false;
    brothers.forEach(entry => {
      if (entry == sender.getName()) {
        result = true;
      };
    });
    return result;
  };
  /**
   * Checks if a player has another player as a Brother
   * @param {JSEntity} entity - Player getting checked
   * @param {string} username - username of player being checked
   * @returns If sender is in receiver's BrotherBands
   **/
  function hasBrother(entity, username) {
    var brotherBands = brothersUsernames(entity);
    var result = false;
    brotherBands.forEach(entry => {
      if (entry == username) {
        result = true;
      };
    });
    return result;
  };
  /**
   * Checks if a player has the max number of brothers
   * @param {JSEntity} entity - Player getting checked
   * @returns If player has less than 6 brothers
   **/
  function maxBrothers(entity) {
    var brotherBands = system.mainNBT(entity).getTagList("Brothers");
    return (brotherBands.tagCount >= 6);
  };
  /**
   * Creates an object with all of the required player and transer information for brother formation
   * @param {JSEntity} entity - Player getting information from
   * @returns Object with information
   **/
  function createSelfBrother(entity) {
    var nbt = system.mainNBT(entity);
    var selfBrother = {};
    var hasUUID = (entity.getUUID() != "");
    var isCompatible = ((nbt.hasKey("compatibleUUID") && nbt.hasKey("compatibleHuman")) ? (nbt.getString("compatibleUUID") == entity.getUUID()) : false);
    if (!hasUUID && !isCompatible) {
      selfBrother = {
        username: entity.getName(),
        satellite: nbt.getString("satellite"),
        location: "center",
        entityID: nbt.getInteger("entityID"),
      };
    };
    if (hasUUID && !isCompatible) {
      selfBrother = {
        username: entity.getName(),
        satellite: nbt.getString("satellite"),
        location: "center",
        entityID: nbt.getInteger("entityID"),
        uuid: entity.getUUID(),
      };
    };
    if (hasUUID && isCompatible) {
      selfBrother = {
        username: entity.getName(),
        satellite: nbt.getString("satellite"),
        location: "center",
        entityID: nbt.getInteger("entityID"),
        uuid: entity.getUUID(),
        humanName: nbt.getString("compatibleHuman"),
      };
    };
    return selfBrother;
  };
  /**
   * Creates a NBT compound tag with all of the required player and transer information for brother formation
   * @param {JSEntity} entity - Player getting information from
   * @param {JSDataManager} manager - required
   * @returns NBT compound tag with information
   **/
  function createSelfBrotherNBT(entity, manager, entityID) {
    var selfBrother = manager.newCompoundTag();
    manager.setString(selfBrother, "username", entity.getName());
    manager.setString(selfBrother, "satellite", nbt.getString("satellite"));
    manager.setInteger(selfBrother, "entityID", entityID);
    if (entity.getUUID() != "") {
      manager.setString(selfBrother, "uuid", entity.getUUID());
    };
    if (nbt.hasKey("compatibleUUID") && nbt.hasKey("compatibleHuman")) {
      if (nbt.getString("compatibleUUID") == entity.getUUID()) {
        manager.setString(selfBrother, "humanName", nbt.getString("compatibleHuman"));
      };
    };
    return selfBrother;
  };
  /**
   * Sends message in BrotherBand format
   * @param {JSPlayer} player - Entity recieving message
   * @param {string} sender - Entity sending message
   * @param {string} message - Messsage content
   **/
  function brotherBandMessage(entity, sender, message) {
    if (PackLoader.getSide() == "SERVER") {
      entity.as("PLAYER").addChatMessage("[BrotherBand]> " + sender + "> " + message);
    };
  };
  return {
    name: "BrotherBand",
    moduleMessageName: "BrotherBand",
    type: 3,
    command: "bb",
    transerMenus: {
      "Brother_profile": {
        parent: "Brother",
        buttons: {
          "Brother_profile_delete": {
            borderingButtons: {
              top: "Brother_profile_reestablish"
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.moduleMessage(this, entity, "Test BrotherBands delete brother");
                var entry = entity.getData("skyhighheroes:dyn/list_entry");
                var entryList = entry.split(";:");
                deleteBrotherBand(entity, manager, entryList[0]);
                updateList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                updateList(entity, manager);
              },
            }
          },
          "Brother_profile_reestablish": {
            borderingButtons: {
              top: "Brother_profile_secret_message",
              bottom: "Brother_profile_delete"
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_reestablish");
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = updateBrotherBand(entity, manager, entry);
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  updateList(entity, manager);
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_profile_secret_message": {
            borderingButtons: {
              top: "Brother_profile_personal_message",
              bottom: "Brother_profile_reestablish"
            },
            properties: {
              confirmAction: (entity, manager) => {
                var isCorrectEntity = false;
                var entry = entity.getData("skyhighheroes:dyn/list_entry").split(";:");
                var username = entry[0];
                var satellite = entry[1];
                var otherEntityID = entry[3];
                var uuid = entry[4];
                var human = entry[5];
                var otherEntity = entity.world().getEntityById(parseInt(otherEntityID));
                if (otherEntity.exists() && otherEntity.isLivingEntity()) {
                  if (otherEntity.is("PLAYER")) {
                    var otherPlayer = otherEntity.as("PLAYER");
                    if (otherPlayer.isWearingFullSuit()) {
                      if (system.isWearingTranser(otherEntity) && hasBrother(otherEntity, entity.getName())) {
                        var otherNBT = system.mainNBT(otherEntity);
                        if ((username == otherEntity.getName()) && (satellite == otherNBT.getString("satellite"))) {
                          if (uuid != "") {
                            if ((uuid == otherEntity.getUUID()) && (uuid == otherNBT.getString("compatibleUUID")) && (human == otherNBT.getString("compatibleHuman"))) {
                              isCorrectEntity = true;
                              var encryptedMessage = otherNBT.getString("secretMessage");
                              var publicKey = otherNBT.getString("publicKey");
                              var decryptedMessage = system.decryptSecretMessage(encryptedMessage, publicKey);
                              system.moduleMessage(this, entity, human + "'s secret message: " + decryptedMessage);
                            };
                          } else {
                            isCorrectEntity = true;
                            var encryptedMessage = otherNBT.getString("secretMessage");
                            var publicKey = otherNBT.getString("publicKey");
                            var decryptedMessage = system.decryptSecretMessage(encryptedMessage, publicKey);
                            system.moduleMessage(this, entity, username + "'s secret message: " + decryptedMessage);
                          };
                        };
                      };
                    };
                  };
                };
                if (!isCorrectEntity) {
                  system.moduleMessage(this, entity, "<e>Unable to establish connection to Brother!");
                };
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                updateList(entity, manager);
              },
            }
          },
          "Brother_profile_personal_message": {
            borderingButtons: {
              bottom: "Brother_profile_secret_message"
            },
            properties: {
              confirmAction: (entity, manager) => {
                var isCorrectEntity = false;
                var entry = entity.getData("skyhighheroes:dyn/list_entry").split(";:");
                var username = entry[0];
                var satellite = entry[1];
                var otherEntityID = entry[3];
                var uuid = entry[4];
                var human = entry[5];
                var otherEntity = entity.world().getEntityById(parseInt(otherEntityID));
                if (otherEntity.exists() && otherEntity.isLivingEntity()) {
                  if (otherEntity.is("PLAYER")) {
                    var otherPlayer = otherEntity.as("PLAYER");
                    if (otherPlayer.isWearingFullSuit()) {
                      if (system.isWearingTranser(otherEntity) && hasBrother(otherEntity, entity.getName())) {
                        var otherNBT = system.mainNBT(otherEntity);
                        if ((username == otherEntity.getName()) && (satellite == otherNBT.getString("satellite"))) {
                          if (uuid != "") {
                            if ((uuid == otherEntity.getUUID()) && (uuid == otherEntity.getString("compatibleUUID")) && (human == otherNBT.getString("compatibleHuman"))) {
                              isCorrectEntity = true;
                              var message = otherNBT.getString("personalMessage");
                              system.moduleMessage(this, entity, human + "'s personal message: " + message);
                            };
                          } else {
                            isCorrectEntity = true;
                            var message = otherNBT.getString("personalMessage");
                            system.moduleMessage(this, entity, username + "'s personal message: " + message);
                          };
                        };
                      };
                    };
                  };
                };
                if (!isCorrectEntity) {
                  system.moduleMessage(this, entity, "<e>Unable to establish connection to Brother!");
                };
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                updateList(entity, manager);
              },
            }
          },
        }
      },
      "Brother_self_profile": {
        parent: "Brother",
        prevButton: "Brother_self",
        buttons: {
          "Brother_self_profile_view_message": {
            borderingButtons: {
              top: "Brother_self_profile_edit_message"
            },
            properties: {
              confirmAction: (entity, manager) => {
                var nbt = system.mainNBT(entity);
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "personal") {
                  var message = nbt.getString("personalMessage");
                  system.moduleMessage(this, entity, message);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "secret") {
                  var encryptedMessage = nbt.getString("secretMessage");
                  var publicKey = nbt.getString("publicKey");
                  var decryptedMessage = system.decryptSecretMessage(encryptedMessage, publicKey);
                  system.moduleMessage(this, entity, decryptedMessage);
                };
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                manager.setData(entity, "skyhighheroes:dyn/current_submenu", "");
                updateList(entity, manager);
              },
            }
          },
          "Brother_self_profile_edit_message": {
            borderingButtons: {
              bottom: "Brother_self_profile_view_message"
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", entity.getData("skyhighheroes:dyn/prev_selected_button"));
                  manager.setData(entity, "skyhighheroes:dyn/current_submenu", "");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "personal") {
                  var nbt = system.mainNBT(entity);
                  manager.setString(nbt, "personalMessage", entry);
                  var brother = createSelfBrother(entity);
                  var brotherEntries = brotherEntry(brother);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", brotherEntries);
                  manager.setData(entity, "skyhighheroes:dyn/scroll_entry_0", brotherEntries);
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "secret") {
                  if (PackLoader.getSide() == "SERVER") {
                    var entcryptedStuff = system.encryptSecretMessage(entity, entry);
                    var secretMessage = entcryptedStuff.encryptedMessage;
                    var publicKey = entcryptedStuff.publicKey;
                    var nbt = system.mainNBT(entity);
                    manager.setString(nbt, "secretMessage", secretMessage);
                    manager.setString(nbt, "publicKey", publicKey);
                    manager.setDataWithNotify(entity, "skyhighheroes:dyn/entering_value", false);
                  };
                };
              },
            }
          },
          "Brother_self_profile_secret_message": {
            borderingButtons: {
              top: "Brother_self_profile_personal_message"
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_submenu", "secret");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_self_profile_secret_message");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self_profile_view_message");
                updateList(entity, manager);
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self");
                updateList(entity, manager);
              },
            }
          },
          "Brother_self_profile_personal_message": {
            borderingButtons: {
              bottom: "Brother_self_profile_secret_message"
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_submenu", "personal");
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_self_profile_personal_message");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self_profile_view_message");
                updateList(entity, manager);
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self");
                updateList(entity, manager);
              },
            }
          },
        }
      },
      "Brother": {
        parent: "main",
        prevButton: "main_Brother",
        buttons: {
          "Brother_self": {
            borderingButtons: {
              left: "Brother_left_center",
              right: "Brother_right_center",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_self_profile");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self_profile_personal_message");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
                manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_self");
                updateList(entity, manager);
              },
              backAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                updateList(entity, manager);
              },
            }
          },
          "Brother_left_top": {
            borderingButtons: {
              bottom: "Brother_left_center",
              right: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_top");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "left_top");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_top");
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_left_center": {
            borderingButtons: {
              top: "Brother_left_top",
              bottom: "Brother_left_bottom",
              right: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_center");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "left_center");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_center");
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_left_bottom": {
            borderingButtons: {
              top: "Brother_left_center",
              right: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/scroll_entry_5", "aidanangrybird;:pegasus;:left_bottom;:297;:a3d071d4-c912-41e1-a6b2-c0de99ea4a84;:Aidan Stelar")
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_bottom");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "left_bottom");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_left_bottom");
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_right_top": {
            borderingButtons: {
              bottom: "Brother_right_center",
              left: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_top");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "right_top");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_top");
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_right_center": {
            borderingButtons: {
              top: "Brother_right_top",
              bottom: "Brother_right_bottom",
              left: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_center");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "right_center");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_center");
                };
              },
              usesTelekinesis: true
            }
          },
          "Brother_right_bottom": {
            borderingButtons: {
              top: "Brother_right_center",
              left: "Brother_self",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_bottom");
                  updateList(entity, manager);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", true);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/entering_value")) {
                  manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                } else {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "main");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "main_Brother");
                };
                updateList(entity, manager);
              },
              textAction: (entity, manager, entry) => {
                var wasSuccess = addBrotherBand(entity, manager, entry, "right_bottom");
                manager.setData(entity, "skyhighheroes:dyn/entering_value", false);
                if (wasSuccess) {
                  manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother_profile");
                  manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_profile_personal_message");
                  manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                  manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
                  manager.setData(entity, "skyhighheroes:dyn/prev_selected_button", "Brother_right_bottom");
                };
              },
              usesTelekinesis: true
            }
          }
        }
      }
    },
    transerMainButton: {
      buttonID: "main_Brother",
      borderingButtons: {
        bottom: "main_groups",
        left: "main_personal",
        right: "main_waypoints",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/current_menu", "Brother");
          manager.setData(entity, "skyhighheroes:dyn/selected_button", "Brother_self");
          updateList(entity, manager);
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/transer", false);
        }
      }
    },
    modeID: "BrotherBand",
    helpMessage: "<n>!bb <nh>-<n> BrotherBand",
    chatModeMessage: "<n>You are now in <nh>BrotherBand<n> mode!",
    messageHandler: function (entity, name, range) {
      var message = entity.getData("skyhighheroes:dyn/entry");
      var foundPlayer = null;
      var nbt = system.mainNBT(entity);
      if (nbt.getStringList("Brothers").tagCount() > 0) {
        var brothersList = brothersUsernames(entity);
        var chat = entity.getData("skyhighheroes:dyn/brotherband_selected");
        var chatIndex = brothersList.indexOf(chat);
        if (chatIndex > -1) {
          var entities = entity.world().getEntitiesInRangeOf(entity.pos(), 512);
          entities.forEach(otherEntity => {
            if (otherEntity.is("PLAYER") && otherEntity.getName() == chat) {
              foundPlayer = otherEntity;
            };
          });
        } else {
          system.moduleMessage(this, entity, "<e>You do not have <eh>" + chat + "<e> as a Brother!");
          return;
        };
      } else {
        system.moduleMessage(this, entity, "<e>You do not have any Brothers to message!");
      };
      if (foundPlayer != null) {
        if (system.isWearingTranser(foundPlayer)) {
          if (hasBrother(entity, foundPlayer)) {
            brotherBandMessage(entity, name, message);
          };
        };
      };
    },
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch (argList[1]) {
          case "form":
            (argList.length == 3) ? addBrotherBand(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!bb form <nh><name>");
            break;
          case "delete":
            (argList.length == 3) ? deleteBrotherBand(entity, manager, argList[2]) : system.moduleMessage(this, entity, "<n>!bb delete <nh><name>");
            break;
          case "list":
            listBrotherBands(entity);
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>BrotherBand commands:")
            system.moduleMessage(this, entity, "<n>!bb form <nh><name><n> <nh>-<n> Adds Brother to your BrotherBand by name");
            system.moduleMessage(this, entity, "<n>!bb delete <nh><name><n> <nh>-<n> Removes Brother from your BrotherBand by name");
            system.moduleMessage(this, entity, "<n>!bb list <nh>-<n> Lists Brothers");
            system.moduleMessage(this, entity, "<n>!bb help <nh>-<n> Shows this list");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>BrotherBand<e> command! Try <eh>!bb help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>BrotherBand<e> command! Try <eh>!bb help<e> for a list of commands!");
      };
    },
    chatInfo: function (entity, manager, chat) {
      var nbt = system.mainNBT(entity);
      if (nbt.hasKey("Brothers")) {
        if (nbt.getTagList("Brothers").tagCount() > 0) {
          var brothersList = brothersUsernames(entity);
          var chatIndex = brothersList.indexOf(chat);
          if (chatIndex > -1) {
            manager.setData(entity, "skyhighheroes:dyn/brotherband_selected", chat);
            manager.setString(nbt, "BrotherBandSelected", chat);
            system.moduleMessage(this, entity, "<n>You are now messaging <nh>" + chat + "<n>!");
          } else {
            system.moduleMessage(this, entity, "<e>You do not have <eh>" + chat + "<e> as a Brother!");
            return;
          };
        } else {
          system.moduleMessage(this, entity, "<e>You do not have any Brothers!");
        };
      } else {
        system.moduleMessage(this, entity, "<e>You do not have any Brothers!");
      };
    },
    chatModeInfo: function (entity) {
      var nbt = system.mainNBT(entity);
      if (nbt.hasKey("Brothers")) {
        if (nbt.getTagList("Brothers").tagCount() > 0) {
          var brothersList = brothersUsernames(entity);
          var chat = entity.getData("skyhighheroes:dyn/brotherband_selected");
          var chatIndex = brothersList.indexOf(chat);
          if (chatIndex > -1) {
            system.moduleMessage(this, entity, "<n>You are now messaging <nh>" + chat + "<n>!");
          } else {
            system.moduleMessage(this, entity, "<e>You do not have <eh>" + chat + "<e> as a Brother!");
            return;
          };
        } else {
          system.moduleMessage(this, entity, "<e>You do not have any Brothers!");
        };
      } else {
        system.moduleMessage(this, entity, "<e>You do not have any Brothers!");
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("BrotherBandSelected")) {
        manager.setString(nbt, "BrotherBandSelected", "");
      };
      manager.setData(entity, "skyhighheroes:dyn/brotherband_selected", nbt.getString("BrotherBandSelected"));
    }
  };
};