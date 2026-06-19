/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  /**
   * Gets satellite UUID list from entity 
   * @param {JSEntity} entity - Required
   **/
  function getSatList(entity) {
    var nbt = system.mainNBT(entity);
    var list = nbt.getTagList("playerInfoSat");
    var count = list.tagCount();
    var result = [];
    for (i = 0; i < count; i++) {
      result.push(list.getCompoundTag(i).getString("id")+";:"+list.getCompoundTag(i).getString("uuid"));
    };
    return result;
  };
  function updateIDList(entity, manager) {
    var idList = getSatList(entity);
    var list = [];
    idList.forEach(entry => {
      var entries = entry.split(";:");
      var id = entries[0];
      var uuid = entries[1];
      if (system.isStillCyber(entity, id)) {
        var otherEntity = entity.world().getEntityById(id);
        if (otherEntity.getName() != entity.getName()) {
          var name = system.getAliasName(otherEntity);
          var listEntry = id + ";:" + name;
          if (uuid != "") {
            listEntry = listEntry + ";:" + uuid;
          };
          list.push(listEntry);
        };
      };
    });
    return list;
  };
  /**
   * Turns NBT String List into an array for easier use in code
   * @param {JSNBTList} list - required
   * @returns Array of waypoint names
  **/
  function getWaypointNameArray(list) {
    var waypointList = list;
    var count = waypointList.tagCount();
    var result = [];
    for (i = 0; i < count; i++) {
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
    for (i = 0; i < count; i++) {
      var waypointTag = waypointList.getCompoundTag(i);
      var waypoint = {
        name: waypointTag.getString("waypointName"),
        coords: [waypointTag.getInteger("xCoord"), waypointTag.getInteger("yCoord"), waypointTag.getInteger("zCoord"), waypointTag.getInteger("dim")]
      };
      result.push(waypoint);
    };
    return result;
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
    var waypointNames = getWaypointNameArray(nbt.getTagList("waypoints"));
    return waypointNames;
  };
  /**
   * List of waypoints
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @returns List of waypoint names
   **/
  function waypointsQueueList(entity, manager) {
    var nbt = system.getMainNBT(entity);
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newWaypointsList);
    };
    var waypointNames = getWaypointNameArray(nbt.getTagList("waypointsTransmitBuffer"));
    return waypointNames;
  };
  /**
  * Gets position of other cybers
  * @param tx - Transmitter
  * @param rx - Receiver
  **/
  function getPos(module, tx, rx) {
    var otherName = system.getModelID(tx);
    var positionMessage = "<nh>" + otherName + "<n> | (<nh>" + tx.posX().toFixed(0) + "<n>, <nh>" + tx.posY().toFixed(0) + "<n>, <nh>" + tx.posZ().toFixed(0) + "<n>)";
    if (system.hasOwnProperty("distance")) {
      var distance = system.distance(rx.pos(), tx.pos());
      positionMessage = positionMessage + "<n> | <nh>" + distance;
    };
    if (system.hasOwnProperty("direction")) {
      var direction = system.direction(rx.pos(), tx.pos());
      positionMessage = positionMessage + "<n> | <nh>" + direction;
    };
    if (system.hasOwnProperty("elevation")) {
      var elevation = system.elevation(rx.pos(), tx.pos());
      positionMessage = positionMessage + "<n> | <nh>" + ((elevation == 0) ? "-" : ((elevation > 0) ? "+" + elevation : elevation));
    };
    system.moduleMessage(module, rx, positionMessage);
  };
  /**
  * Transmits status of tx to rx
  * @param tx - Transmitter
  * @param rx - Receiver
  **/
  function getStatus(module, tx, rx) {
    var otherName = system.getModelID(tx);
    system.moduleMessage(module, rx, "<nh>" + otherName + "<n> | <nh>" + ((tx.getHealth()/tx.getMaxHealth())*100) + "%<n> | <nh>" + ((tx.as("PLAYER").getFoodLevel()/20)*100) + "%<n>");
  };
  /**
  * Receives suits
  * @param module - module passthrough
  * @param tx - Transmitter requried
  * @param rx - Receiver requried
  * @param manager - Required
  **/
  function receiveSuits(module, tx, rx, manager) {
    var nbtRX = system.mainNBT(rx);
    var nbtTX = system.mainNBT(tx);
    if (!nbtRX.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbtRX, "suitDatastore", newSuitsList);
    };
    if (!nbtRX.hasKey("suitsReceiveBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbtRX, "suitsReceiveBuffer", newBuffer);
    };
    var suitReceiveDuration = 0;
    var receivesBuffered = 0;
    var transmitBuffer = nbtTX.getStringList("suitsTransmitBuffer");
    var receiveBuffer = nbtRX.getStringList("suitsReceiveBuffer");
    var transmitBufferArray = system.getStringArray(transmitBuffer);
    transmitBufferArray.forEach(entry => {
      manager.appendString(receiveBuffer, entry);
      var receiveDuration = 0;
      if (PackLoader.getSide() == "SERVER") {
        receiveDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
      };
      suitReceiveDuration = suitReceiveDuration + receiveDuration;
      receivesBuffered = receivesBuffered + 1;
    });
    var txName = system.getModelID(tx);
    var rxName = system.getModelID(rx);
    system.moduleMessage(module, rx, "<n>Receiving suits from <nh>" + txName + "<n>!");
    system.moduleMessage(module, tx, "<n>Transmitting suits to <nh>" + rxName + "<n>!");
    system.moduleMessage(module, rx, "<n>Attempting to receive <nh>" + receivesBuffered + "<n> " + ((receivesBuffered == 1) ? "suit!" : "suits!"));
    var rxDomain = rx.getWornChestplate().suitType().split(":")[0];
    manager.setDataWithNotify(rx, rxDomain + ":dyn/receive_suits_duration", suitReceiveDuration);
    manager.setDataWithNotify(rx, rxDomain + ":dyn/receiving_suits", true);
  };
  /**
  * Receives suit
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentReceive - Current suit being received
  **/
  function receiveSuit(module, entity, manager, currentReceive) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var receiveBuffer = nbt.getStringList("suitsReceiveBuffer");
    var suitDatastore = nbt.getStringList("suitDatastore");
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    var currentSuit = receiveBuffer.getString(currentReceive);
    system.moduleMessage(module, entity, "<n>Receiving suit \"<nh>" + currentSuit + "<n>\"!");
    if (suitDatastoreArray.indexOf(currentSuit) == -1) {
      suitDatastoreArray.push(currentSuit);
      manager.appendString(suitDatastore, currentSuit);
      system.moduleMessage(module, entity, "<s>Successfully added suit \"<sh>" + currentSuit + "<s>\" to " + system.getModelID(entity) + "!");
      if (entity.getData("skyhighheroes:dyn/current_menu") == "comms" && entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
        var list = system.getStringArray(nbt.getStringList("suitDatastore"));
        system.updateList(entity, manager, 10, list);
      };
      if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_edit") {
        var list = system.getStringArray(nbt.getStringList("suitDatastore"));
        system.updateList(entity, manager, 10, list);
      };
      if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
        var list = system.getStringArray(nbt.getStringList("suitDatastore"));
        system.updateList(entity, manager, 10, list);
      };
      if (PackLoader.getSide() == "CLIENT") {
        entity.playSound("minecraft:random.orb", 1.0, 1.0);
      };
    } else {
      system.moduleMessage(module, entity, "<e>Discarding data for suit \"<eh>" + currentSuit + "<e>\"! Already exists in datastore!");
    };
  };
  /**
  * Transmits suits using command
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitList - List of suit indexes seperated by commas
  **/
  function transmitSuitsCommand(module, entity, manager, suitList) {
    if (typeof suitList === "undefined") {
      system.moduleMessage(module, entity, "<e>Suit list cannot be empty!");
      return;
    };
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuits = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuits);
    };
    if (!nbt.hasKey("suitsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "suitsTransmitBuffer", newBuffer);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    var suitsToTransmit = [];
    if (suitList == "*") {
      for (var i = 0; i < suitDatastoreArray.length; i++) {
        suitsToTransmit.push(i);
      };
    } else {
      suitsToTransmit = suitList.split(",");
    };
    var suitsTransmitBuffer = nbt.getStringList("suitsTransmitBuffer");
    var suitsTransmitBufferArray = system.getStringArray(nbt.getStringList("suitsTransmitBuffer"));
    var suitTransmitDuration = 0;
    var transmitsBuffered = 0;
    suitsToTransmit.forEach(entry => {
      if ((entry < (suitDatastoreArray.length)) && (entry > -1)) {
        var currentSuit = suitDatastoreArray[entry];
        if (suitsTransmitBufferArray.indexOf(currentSuit) == -1) {
          manager.appendString(suitsTransmitBuffer, currentSuit);
          suitsTransmitBufferArray.push(currentSuit);
          var transmitDuration = 0;
          if (PackLoader.getSide() == "SERVER") {
            transmitDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
          };
          suitTransmitDuration = suitTransmitDuration + transmitDuration;
          transmitsBuffered = transmitsBuffered + 1;
        };
      };
    });
    manager.setTagList(nbt, "suitsTransmitBuffer", suitsTransmitBuffer);
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_suits_duration", suitTransmitDuration);
    system.moduleMessage(module, entity, "<n>Transmitting <nh>" + transmitsBuffered + "<n> " + ((transmitsBuffered == 1) ? "suit!" : "suits!"));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_suits", true);
  };
  /**
  * Transmits suit
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentTransmission - Suit index
  **/
  function transmitSuit(module, entity, manager, currentTransmission) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitsTransmitBuffer = nbt.getStringList("suitsTransmitBuffer");
    var currentSuit = suitsTransmitBuffer.getString(currentTransmission);
    system.moduleMessage(module, entity, "<s>Transmitted suit \"<sh>" + currentSuit + "<s>\" to other cybers in range!");
    if (PackLoader.getSide() == "CLIENT") {
      entity.playSound("minecraft:random.orb", 1.0, 1.0);
    };
  };
  function startSuitsTransmit(module, entity, manager) {
    transmitSuits(module, entity, manager);
    var range = 16;
    var foundPlayers = [];
    var foundPlayerNames = [];
    var newRange = (range * 1);
    var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
    var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
    if (txAntennaDeployed) {
      newRange = (range * 4);
    };
    var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
    entities.forEach(otherEntity => {
      if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
        if (system.hasCyberneticBody(otherEntity) && system.checkFrequency(entity, otherEntity)) {
          if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
            foundPlayerNames.push(otherEntity.getName());
            foundPlayers.push(otherEntity);
          };
        };
      };
    });
    if (txSatelliteDeployed) {
      var idList = system.getSatIDList(entity);
      idList.forEach(id => {
        if (id > -1) {
          if (system.isStillCyber(entity, id)) {
            var otherEntity = entity.world().getEntityById(id);
            if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
              if (system.checkSatellite(entity, otherEntity)) {
                foundPlayerNames.push(otherEntity.getName());
                foundPlayers.push(otherEntity);
              };
            };
          };
        };
      });
    };
    if (foundPlayers.length > 0) {
      //entity = tx
      //otherEntity = rx
      foundPlayers.forEach(otherEntity => {
        var rxDomain = otherEntity.getWornChestplate().suitType().split(":")[0];
        var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
        var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
        if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
          receiveSuits(module, entity, otherEntity, manager);
        } else if (txAntennaDeployed && rxAntennaDeployed && system.checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range * 4)) {
          receiveSuits(module, entity, otherEntity, manager);
        } else if (txSatelliteDeployed && rxSatelliteDeployed && system.checkSatellite(entity, otherEntity)) {
          receiveSuits(module, entity, otherEntity, manager);
        };
      });
    } else {
      system.moduleMessage(module, entity, "<n>No other cybers in range!");
    };
  };

  /**
  * Transmits suits using GUI
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  **/
  function transmitSuits(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuits = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuits);
    };
    if (!nbt.hasKey("suitsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "suitsTransmitBuffer", newBuffer);
    };
    var suitsTransmitBufferArray = system.getStringArray(nbt.getStringList("suitsTransmitBuffer"));
    var suitTransmitDuration = 0;
    var transmitsBuffered = 0;
    suitsTransmitBufferArray.forEach(entry => {
      var transmitDuration = 0;
      if (PackLoader.getSide() == "SERVER") {
        transmitDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
      };
      suitTransmitDuration = suitTransmitDuration + transmitDuration;
      transmitsBuffered = transmitsBuffered + 1;
    });
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_suits_duration", suitTransmitDuration);
    system.moduleMessage(module, entity, "<n>Transmitting <nh>" + transmitsBuffered + "<n> " + ((transmitsBuffered == 1) ? "suit!" : "suits!"));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_suits", true);
  };
  /**
  * Queues a suit to transmit to suit drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function addSuitToSuitQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("suitsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "suitsTransmitBuffer", newBuffer);
    };
    var suitsTransmitBuffer = nbt.getStringList("suitsTransmitBuffer");
    var suitsTransmitBufferArray = system.getStringArray(nbt.getStringList("suitsTransmitBuffer"));
    if (suitsTransmitBufferArray.indexOf(suitEntry) == -1) {
      manager.appendString(suitsTransmitBuffer, suitEntry);
      system.moduleMessage(module, entity, "<n>Added suit <nh>" + suitEntry + "<n> to transmit queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> already in transmit queue!");
    };
  };
  /**
  * Removes a suit from transmit queue
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function removeSuitFromSuitQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("suitsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "suitsTransmitBuffer", newBuffer);
    };
    var suitsTransmitBuffer = nbt.getStringList("suitsTransmitBuffer");
    var suitsTransmitBufferArray = system.getStringArray(nbt.getStringList("suitsTransmitBuffer"));
    var suitIndex = suitsTransmitBufferArray.indexOf(suitEntry);
    if (suitIndex > -1) {
      manager.removeTag(suitsTransmitBuffer, suitIndex);
      system.moduleMessage(module, entity, "<n>Removed suit <nh>" + suitEntry + "<n> from transmit queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> not in transmit queue!");
    };
  };
  /**
  * Removes a suit from transmit queue
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function suitsQueueList(entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("suitsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "suitsTransmitBuffer", newBuffer);
    };
    var suitsTransmitBufferArray = system.getStringArray(nbt.getStringList("suitsTransmitBuffer"));
    return suitsTransmitBufferArray;
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function suitsList(entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    return suitDatastoreArray;
  };
  /**
  * Receives waypoints
  * @param module - module passthrough
  * @param tx - Transmitter requried
  * @param rx - Receiver requried
  * @param manager - Required
  **/
  function receiveWaypoints(module, tx, rx, manager) {
    var nbtRX = system.mainNBT(rx);
    var nbtTX = system.mainNBT(tx);
    if (!nbtRX.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbtRX, "waypoints", newWaypointsList);
    };
    if (!nbtRX.hasKey("waypointsReceiveBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbtRX, "waypointsReceiveBuffer", newBuffer);
    };
    var waypointReceiveDuration = 0;
    var receivesBuffered = 0;
    var transmitBuffer = nbtTX.getTagList("waypointsTransmitBuffer");
    var receiveBuffer = nbtRX.getTagList("waypointsReceiveBuffer");
    for (var i = 0;i<transmitBuffer.tagCount();i++) {
      var entry = transmitBuffer.getCompoundTag(i);
      manager.appendTag(receiveBuffer, entry);
      var receiveDuration = 0;
      if (PackLoader.getSide() == "SERVER") {
        receiveDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
      };
      waypointReceiveDuration = waypointReceiveDuration + receiveDuration;
      receivesBuffered = receivesBuffered + 1;
    };
    var txName = system.getModelID(tx);
    var rxName = system.getModelID(rx);
    system.moduleMessage(module, rx, "<n>Receiving waypoints from <nh>" + txName + "<n>!");
    system.moduleMessage(module, tx, "<n>Transmitting waypoints to <nh>" + rxName + "<n>!");
    system.moduleMessage(module, rx, "<n>Attempting to receive <nh>" + receivesBuffered + "<n> " + ((receivesBuffered == 1) ? "waypoint!" : "waypoints!"));
    var rxDomain = rx.getWornChestplate().suitType().split(":")[0];
    manager.setDataWithNotify(rx, rxDomain + ":dyn/receive_waypoints_duration", waypointReceiveDuration);
    manager.setDataWithNotify(rx, rxDomain + ":dyn/receiving_waypoints", true);
  };
  /**
  * Receives waypoint
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentReceive - Current waypoint being received
  **/
  function receiveWaypoint(module, entity, manager, currentReceive) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    var receiveBuffer = nbt.getTagList("waypointsReceiveBuffer");
    var waypoints = nbt.getTagList("waypoints");
    var waypointsArray = getWaypointNameArray(nbt.getTagList("waypoints"));
    var currentWaypoint = receiveBuffer.getCompoundTag(currentReceive);
    var currentWaypointName = currentWaypoint.getString("waypointName");
    system.moduleMessage(module, entity, "<n>Receiving waypoint \"<nh>" + currentWaypointName + "<n>\"!");
    if (waypointsArray.indexOf(currentWaypointName) == -1) {
      manager.appendTag(waypoints, currentWaypoint);
      system.moduleMessage(module, entity, "<s>Successfully added waypoint \"<sh>" + currentWaypointName + "<s>\" to " + system.getModelID(entity) + "!");
      if (entity.getData("skyhighheroes:dyn/current_menu") == "comms" && entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
        var list = getWaypointNameArray(nbt.getTagList("waypoints"));
        system.updateList(entity, manager, 10, list);
      };
      if (entity.getData("skyhighheroes:dyn/current_menu") == "waypoints" && entity.getData("skyhighheroes:dyn/current_submenu") == "waypoints_edit") {
        var list = getWaypointNameArray(nbt.getTagList("waypoints"));
        system.updateList(entity, manager, 10, list);
      };
      if (PackLoader.getSide() == "CLIENT") {
        entity.playSound("minecraft:random.orb", 1.0, 1.0);
      };
    } else {
      system.moduleMessage(module, entity, "<e>Discarded data for waypoint \"<eh>" + currentWaypointName + "<e>\"! Already exists!");
    };
  };
  /**
  * Transmits waypoints using command
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param waypointList - List of waypoint indexes seperated by commas
  **/
  function transmitWaypointsCommand(module, entity, manager, waypointList) {
    if (typeof waypointList === "undefined") {
      system.moduleMessage(module, entity, "<e>Waypoint list cannot be empty!");
      return;
    };
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypoints = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypoints);
    };
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newBuffer);
    };
    var waypointsArray = system.getStringArray(nbt.getTagList("waypoints"));
    var waypointsToTransmit = [];
    if (waypointList == "*") {
      for (var i = 0; i < waypointsArray.length; i++) {
        waypointsToTransmit.push(i);
      };
    } else {
      waypointsToTransmit = waypointList.split(",");
    };
    var waypointTransmitBuffer = nbt.getTagList("waypointsTransmitBuffer");
    var waypointTransmitBufferArray = getWaypointNameArray(nbt.getTagList("waypointsTransmitBuffer"));
    var waypointTransmitDuration = 0;
    var transmitsBuffered = 0;
    waypointsToTransmit.forEach(entry => {
      if ((entry < (waypointsArray.length)) && (entry > -1)) {
        var currentWaypoint = waypointsArray[entry];
        if (waypointTransmitBufferArray.indexOf(currentWaypoint) == -1) {
          manager.appendString(waypointTransmitBuffer, currentWaypoint);
          waypointTransmitBufferArray.push(currentWaypoint);
        };
      };
    });
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_waypoints_duration", waypointTransmitDuration);
    system.moduleMessage(module, entity, "<n>Transmitting <nh>" + transmitsBuffered + "<n> " + ((transmitsBuffered == 1) ? "waypoint!" : "waypoints!"));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_waypoints", true);
  };
  /**
  * Transmits waypoint
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentTransmission - Waypoint index
  **/
  function transmitWaypoint(module, entity, manager, currentTransmission) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newBuffer);
    };
    var waypoints = nbt.getTagList("waypointsTransmitBuffer");
    var currentWaypoint = waypoints.getCompoundTag(currentTransmission);
    var currentWaypointName = currentWaypoint.getString("waypointName");
    system.moduleMessage(module, entity, "<n>Transmitted waypoint \"<nh>" + currentWaypointName + "<n>\" to other cybers in range!");
    if (PackLoader.getSide() == "CLIENT") {
      entity.playSound("minecraft:random.orb", 1.0, 1.0);
    };
  };
  function startWaypointsTransmit(module, entity, manager) {
    transmitWaypoints(module, entity, manager);
    var range = 16;
    var foundPlayers = [];
    var foundPlayerNames = [];
    var newRange = (range * 1);
    var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
    var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
    if (txAntennaDeployed) {
      newRange = (range * 4);
    };
    var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
    entities.forEach(otherEntity => {
      if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
        if (system.hasCyberneticBody(otherEntity) && system.checkFrequency(entity, otherEntity)) {
          if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
            foundPlayerNames.push(otherEntity.getName());
            foundPlayers.push(otherEntity);
          };
        };
      };
    });
    if (txSatelliteDeployed) {
      var idList = system.getSatIDList(entity);
      idList.forEach(id => {
        if (id > -1) {
          if (system.isStillCyber(entity, id)) {
            var otherEntity = entity.world().getEntityById(id);
            if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
              if (system.checkSatellite(entity, otherEntity)) {
                foundPlayerNames.push(otherEntity.getName());
                foundPlayers.push(otherEntity);
              };
            };
          };
        };
      });
    };
    if (foundPlayers.length > 0) {
      //entity = tx
      //otherEntity = rx
      foundPlayers.forEach(otherEntity => {
        var rxDomain = otherEntity.getWornChestplate().suitType().split(":")[0];
        var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
        var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
        if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
          receiveWaypoints(module, entity, otherEntity, manager);
        } else if (txAntennaDeployed && rxAntennaDeployed && system.checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range * 4)) {
          receiveWaypoints(module, entity, otherEntity, manager);
        } else if (txSatelliteDeployed && rxSatelliteDeployed && system.checkSatellite(entity, otherEntity)) {
          receiveWaypoints(module, entity, otherEntity, manager);
        };
      });
    } else {
      system.moduleMessage(module, entity, "<n>No other cybers in range!");
    };
  };
  /**
  * Queues a waypoint to transmit to waypoint drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param waypointEntry - waypoint
  **/
  function addWaypointToWaypointQueue(module, entity, manager, waypointEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newBuffer);
    };
    var waypointTransmitBuffer = nbt.getTagList("waypointsTransmitBuffer");
    var waypointsTransmitBufferArray = getWaypointNameArray(nbt.getTagList("waypointsTransmitBuffer"));
    if (waypointsTransmitBufferArray.indexOf(waypointEntry) == -1) {
      var waypoints = nbt.getTagList("waypoints");
      var waypointArray = getWaypointNameArray(waypoints);
      var waypointIndex = waypointArray.indexOf(waypointEntry);
      var waypoint = waypoints.getCompoundTag(waypointIndex);
      manager.appendTag(waypointTransmitBuffer, waypoint);
      system.moduleMessage(module, entity, "<n>Added waypoint <nh>" + waypointEntry + "<n> to transmit queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Waypoint <nh>" + waypointEntry + "<n> already in transmit queue!");
    };
  };
  /**
  * Removes a waypoint from transmit queue
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param waypointEntry - waypoint
  **/
  function removeWaypointFromWaypointQueue(module, entity, manager, waypointEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypointsList = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypointsList);
    };
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newBuffer);
    };
    
    var waypointTransmitBuffer = nbt.getTagList("waypointsTransmitBuffer");
    var waypointTransmitBufferArray = getWaypointNameArray(waypointTransmitBuffer);
    var waypointIndex = waypointTransmitBufferArray.indexOf(waypointEntry);
    if (waypointIndex > -1) {
      manager.removeTag(waypointTransmitBuffer, waypointIndex);
      system.moduleMessage(module, entity, "<n>Removed waypoint <nh>" + waypointEntry + "<n> from transmit queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Waypoint <nh>" + waypointEntry + "<n> not in transmit queue!");
    };
  };

  /**
  * Transmits waypoints with GUI
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  **/
  function transmitWaypoints(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("waypoints")) {
      var newWaypoints = manager.newTagList();
      manager.setTagList(nbt, "waypoints", newWaypoints);
    };
    if (!nbt.hasKey("waypointsTransmitBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "waypointsTransmitBuffer", newBuffer);
    };
    var waypointTransmitBuffer = nbt.getTagList("waypointsTransmitBuffer");
    var waypointTransmitBufferArray = getWaypointNameArray(nbt.getTagList("waypointsTransmitBuffer"));
    var waypointTransmitDuration = 0;
    var transmitsBuffered = 0;
    waypointTransmitBufferArray.forEach(entry => {
      var transmitDuration = 0;
      if (PackLoader.getSide() == "SERVER") {
        transmitDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
      };
      waypointTransmitDuration = waypointTransmitDuration + transmitDuration;
      transmitsBuffered = transmitsBuffered + 1;
    });
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_waypoints_duration", waypointTransmitDuration);
    system.moduleMessage(module, entity, "<n>Transmitting <nh>" + transmitsBuffered + "<n> " + ((transmitsBuffered == 1) ? "waypoint!" : "waypoints!"));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_waypoints", true);
  };

  return {
    name: "communications",
    moduleMessageName: "Comms",
    type: 12,
    command: "comms",
    cyberOverviewButtons: {
      "satellite_rain_mode": {
        borderingButtons: {
          bottom: "satellite_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/satellite_rain_mode", !entity.getData("skyhighheroes:dyn/satellite_rain_mode"));
            if (entity.getData("skyhighheroes:dyn/satellite_rain_mode")) {
              system.moduleMessage(this, entity, "<n>Activating satellite rain mode!");
            } else {
              system.moduleMessage(this, entity, "<n>Deactivating satellite rain mode!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "satellite_deploy": {
        borderingButtons: {
          top: "satellite_rain_mode",
          bottom: "antenna_deploy",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", !entity.getData("skyhighheroes:dyn/satellite_deployed"));
            if (entity.getData("skyhighheroes:dyn/satellite_deployed")) {
              system.moduleMessage(this, entity, "<n>Deploying satellite!");
            } else {
              system.moduleMessage(this, entity, "<n>Retracting satellite!");
            };
          },
          backAction: (entity, manager) => {
            system.setButton(entity, manager, "main_overview");
            system.setMenu(entity, manager, "main");
          },
        }
      },
      "antenna_deploy": {
        borderingButtons: {
          top: "satellite_deploy",
          bottom: "optics_enabled",
        },
        properties: {
          confirmAction: (entity, manager) => {
            manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", !entity.getData("skyhighheroes:dyn/antenna_deployed"));
            if (entity.getData("skyhighheroes:dyn/antenna_deployed")) {
              system.moduleMessage(this, entity, "<n>Deploying antenna!");
            } else {
              system.moduleMessage(this, entity, "<n>Retracting antenna!");
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
      "comms": {
        parent: "main",
        prevButton: "main_comms",
        buttons: {
          "comms_status": {
            borderingButtons: {
              bottom: "comms_suits",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "comms_cyber_status");
                system.setSubmenu(entity, manager, "comms_status");
                var idList = updateIDList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", idList.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(idList.length - 1, 0));
                system.updateList(entity, manager, 1, idList);
                manager.setData(entity, "skyhighheroes:dyn/receiving_status_data", true);
                manager.setData(entity, "skyhighheroes:dyn/transmitting_status_data", true);
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_comms");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "comms_cyber_status": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "comms_status");
                system.setSubmenu(entity, manager, "");
                manager.setData(entity, "skyhighheroes:dyn/receiving_status_data", false);
                manager.setData(entity, "skyhighheroes:dyn/transmitting_status_data", false);
              },
              leftAction: (entity, manager) => {
                var list = updateIDList(entity, manager);
                system.scrollUp(entity, manager, list);
                system.updateList(entity, manager, 1, list);
                manager.setData(entity, "skyhighheroes:dyn/receiving_status_data", true);
                manager.setData(entity, "skyhighheroes:dyn/transmitting_status_data", true);
              },
              rightAction: (entity, manager) => {
                var list = updateIDList(entity, manager);
                system.scrollDown(entity, manager, 1, list);
                system.updateList(entity, manager, 1, list);
                manager.setData(entity, "skyhighheroes:dyn/receiving_status_data", true);
                manager.setData(entity, "skyhighheroes:dyn/transmitting_status_data", true);
              }
            }
          },
          "comms_suits": {
            borderingButtons: {
              top: "comms_status",
              bottom: "comms_waypoints",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setSubmenu(entity, manager, "comms_suits");
                system.setButton(entity, manager, "comms_base_select_0");
                var queueList = suitsQueueList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list2_total", queueList.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll2_total", Math.max(queueList.length - 10, 0));
                system.updateList2(entity, manager, 10, queueList);
                var list = suitsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                system.updateList(entity, manager, 10, list);
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_comms");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "comms_waypoints": {
            borderingButtons: {
              top: "comms_suits",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setSubmenu(entity, manager, "comms_waypoints");
                system.setButton(entity, manager, "comms_base_select_0");
                var queueList = waypointsQueueList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list2_total", queueList.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll2_total", Math.max(queueList.length - 10, 0));
                system.updateList2(entity, manager, 10, queueList);
                var list = waypointsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                system.updateList(entity, manager, 10, list);
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_comms");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "comms_run_queue": {
            borderingButtons: {
              top: "comms_base_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  startWaypointsTransmit(this, entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  startSuitsTransmit(this, entity, manager);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
            }
          },
          "comms_base_select_0": {
            borderingButtons: {
              right: "comms_queue_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                system.scrollUp(entity, manager, list);
                system.updateList(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  system.setButton(entity, manager, "comms_base_select_1");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "comms_base_select_1": {
            borderingButtons: {
              top: "comms_base_select_0",
              right: "comms_queue_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  system.setButton(entity, manager, "comms_base_select_2");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "comms_base_select_2": {
            borderingButtons: {
              top: "comms_base_select_1",
              right: "comms_queue_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  system.setButton(entity, manager, "comms_base_select_3");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "comms_base_select_3": {
            borderingButtons: {
              top: "comms_base_select_2",
              right: "comms_queue_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  system.setButton(entity, manager, "comms_base_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "comms_base_select_4": {
            borderingButtons: {
              top: "comms_base_select_3",
              right: "comms_queue_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  system.setButton(entity, manager, "comms_base_select_5");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "comms_base_select_5": {
            borderingButtons: {
              top: "comms_base_select_4",
              right: "comms_queue_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  system.setButton(entity, manager, "comms_base_select_6");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "comms_base_select_6": {
            borderingButtons: {
              top: "comms_base_select_5",
              right: "comms_queue_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_7") != "") {
                  system.setButton(entity, manager, "comms_base_select_7");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              }
            }
          },
          "comms_base_select_7": {
            borderingButtons: {
              top: "comms_base_select_6",
              right: "comms_queue_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_8") != "") {
                  system.setButton(entity, manager, "comms_base_select_8");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
              }
            }
          },
          "comms_base_select_8": {
            borderingButtons: {
              top: "comms_base_select_7",
              right: "comms_queue_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_9") != "") {
                  system.setButton(entity, manager, "comms_base_select_9");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
              }
            }
          },
          "comms_base_select_9": {
            borderingButtons: {
              top: "comms_base_select_8",
              right: "comms_queue_select_9",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  addWaypointToWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  addSuitToSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsList(entity, manager);
                };
                system.scrollDown(entity, manager, 10, list);
                system.updateList(entity, manager, 10, list);
                if (list.indexOf(entity.getData("skyhighheroes:dyn/scroll_entry_9")) == (list.length - 1)) {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
              }
            }
          },
          "comms_queue_select_0": {
            borderingButtons: {
              left: "comms_base_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_0"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                system.scrollUp2(entity, manager, list);
                system.updateList2(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_1") != "") {
                  system.setButton(entity, manager, "comms_queue_select_1");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_0"));
              }
            }
          },
          "comms_queue_select_1": {
            borderingButtons: {
              top: "comms_queue_select_0",
              left: "comms_base_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_1"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_2") != "") {
                  system.setButton(entity, manager, "comms_queue_select_2");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_1"));
              }
            }
          },
          "comms_queue_select_2": {
            borderingButtons: {
              top: "comms_queue_select_1",
              left: "comms_base_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_2"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_3") != "") {
                  system.setButton(entity, manager, "comms_queue_select_3");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_2"));
              }
            }
          },
          "comms_queue_select_3": {
            borderingButtons: {
              top: "comms_queue_select_2",
              left: "comms_base_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_3"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_4") != "") {
                  system.setButton(entity, manager, "comms_queue_select_4");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_3"));
              }
            }
          },
          "comms_queue_select_4": {
            borderingButtons: {
              top: "comms_queue_select_3",
              left: "comms_base_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_4"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_5") != "") {
                  system.setButton(entity, manager, "comms_queue_select_5");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_4"));
              }
            }
          },
          "comms_queue_select_5": {
            borderingButtons: {
              top: "comms_queue_select_4",
              left: "comms_base_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_5"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_6") != "") {
                  system.setButton(entity, manager, "comms_queue_select_6");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_5"));
              }
            }
          },
          "comms_queue_select_6": {
            borderingButtons: {
              top: "comms_queue_select_5",
              left: "comms_base_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_6"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/list2_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll2_value");
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_7") != "") {
                  system.setButton(entity, manager, "comms_queue_select_7");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_6"));
              }
            }
          },
          "comms_queue_select_7": {
            borderingButtons: {
              top: "comms_queue_select_6",
              left: "comms_base_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_7"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_8") != "") {
                  system.setButton(entity, manager, "comms_queue_select_8");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_7"));
              }
            }
          },
          "comms_queue_select_8": {
            borderingButtons: {
              top: "comms_queue_select_7",
              left: "comms_base_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_8"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_9") != "") {
                  system.setButton(entity, manager, "comms_queue_select_9");
                } else {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_8"));
              }
            }
          },
          "comms_queue_select_9": {
            borderingButtons: {
              top: "comms_queue_select_8",
              left: "comms_base_select_9",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_9"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  removeWaypointFromWaypointQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = waypointsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  removeSuitFromSuitQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = suitsQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  system.setButton(entity, manager, "comms_waypoints");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  system.setButton(entity, manager, "comms_suits");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
                  list = waypointsQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
                  list = suitsQueueList(entity, manager);
                };
                system.scrollDown2(entity, manager, 10, list);
                system.updateList2(entity, manager, 10, list);
                if (list.indexOf(entity.getData("skyhighheroes:dyn/scroll2_entry_9")) == (list.length - 1)) {
                  system.setButton(entity, manager, "comms_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_9"));
              }
            }
          },
        }
      }
    },
    cyberMainButton: {
      buttonID: "main_comms",
      borderingButtons: {
        top: "main_suits",
        bottom: "main_thermoptics"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setMenu(entity, manager, "comms");
          system.setButton(entity, manager, "comms_status");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
        }
      }
    },
    helpMessage: "<n>!comms <nh>-<n> Communications",
    disabledMessage: "<e>Module <eh>communications<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 5) {
        switch (argList[1]) {
          case "cyberPos":
            var range = 16;
            var foundPlayers = [];
            var foundPlayerNames = [];
            var newRange = (range*1);
            var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            if (txAntennaDeployed) {
              newRange = (range*4);
            };
            var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
            entities.forEach(otherEntity => {
              if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
                if (system.hasCyberneticBody(otherEntity) && system.checkFrequency(entity, otherEntity)) {
                  if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                    foundPlayerNames.push(otherEntity.getName());
                    foundPlayers.push(otherEntity);
                  };
                };
              };
            });
            if (txSatelliteDeployed) {
              var idList = system.getSatIDList(entity);
              idList.forEach(id => {
                if (id > -1) {
                  if (system.isStillCyber(entity, id)) {
                    var otherEntity = entity.world().getEntityById(id);
                    if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                      if (system.checkSatellite(entity, otherEntity)) {
                        foundPlayerNames.push(otherEntity.getName());
                        foundPlayers.push(otherEntity);
                      };
                    };
                  };
                };
              });
            };
            if (foundPlayers.length > 0) {
              //entity = tx
              //otherEntity = rx
              foundPlayers.forEach(otherEntity => {
                var rxDomain = otherEntity.getWornHelmet().suitType().split(":")[0];
                var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
                  getPos(this, otherEntity, entity);
                } else if (txAntennaDeployed && rxAntennaDeployed && system.checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range*4)) {
                  getPos(this, otherEntity, entity);
                } else if (txSatelliteDeployed && rxSatelliteDeployed && system.checkSatellite(entity, otherEntity)) {
                  getPos(this, otherEntity, entity);
                };
              });
            } else {
              system.moduleMessage(this, entity, "<n>No other cybers in range!");
            };
            break;
          case "cyberStatus":
            var range = 16;
            var foundPlayers = [];
            var foundPlayerNames = [];
            var newRange = (range*1);
            var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            if (txAntennaDeployed) {
              newRange = (range*4);
            };
            var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
            entities.forEach(otherEntity => {
              if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
                if (system.hasCyberneticBody(otherEntity) && system.checkFrequency(entity, otherEntity)) {
                  if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                    foundPlayerNames.push(otherEntity.getName());
                    foundPlayers.push(otherEntity);
                  };
                };
              };
            });
            if (txSatelliteDeployed) {
              var idList = system.getSatIDList(entity);
              idList.forEach(id => {
                if (id > -1) {
                  if (system.isStillCyber(entity, id)) {
                    var otherEntity = entity.world().getEntityById(id);
                    if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                      if (system.checkSatellite(entity, otherEntity)) {
                        foundPlayerNames.push(otherEntity.getName());
                        foundPlayers.push(otherEntity);
                      };
                    };
                  };
                };
              });
            };
            if (foundPlayers.length > 0) {
              //entity = tx
              //otherEntity = rx
              foundPlayers.forEach(otherEntity => {
                var rxDomain = otherEntity.getWornHelmet().suitType().split(":")[0];
                var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
                  getStatus(this, otherEntity, entity);
                } else if (txAntennaDeployed && rxAntennaDeployed && system.checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range*4)) {
                  getStatus(this, otherEntity, entity);
                } else if (txSatelliteDeployed && rxSatelliteDeployed && system.checkSatellite(entity, otherEntity)) {
                  getStatus(this, otherEntity, entity);
                };
              });
            } else {
              system.moduleMessage(this, entity, "<n>No other cybers in range!");
            };
            break;
          case "suits":
            var range = 16;
            var foundPlayers = [];
            var foundPlayerNames = [];
            var newRange = (range*1);
            var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
            if (txAntennaDeployed) {
              newRange = (range*4);
            };
            var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
            entities.forEach(otherEntity => {
              if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
                if (system.hasCyberneticBody(otherEntity) && system.checkFrequency(entity, otherEntity)) {
                  if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                    foundPlayerNames.push(otherEntity.getName());
                    foundPlayers.push(otherEntity);
                  };
                };
              };
            });
            if (txSatelliteDeployed) {
              var idList = system.getSatIDList(entity);
              idList.forEach(id => {
                if (id > -1) {
                  if (system.isStillCyber(entity, id)) {
                    var otherEntity = entity.world().getEntityById(id);
                    if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
                      if (system.checkSatellite(entity, otherEntity)) {
                        foundPlayerNames.push(otherEntity.getName());
                        foundPlayers.push(otherEntity);
                      };
                    };
                  };
                };
              });
            };
            if (foundPlayers.length > 0) {
              //entity = tx
              //otherEntity = rx
              transmitSuitsCommand(this, entity, manager, argList[2]);
              foundPlayers.forEach(otherEntity => {
                var rxDomain = otherEntity.getWornChestplate().suitType().split(":")[0];
                var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_deploy_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
                if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
                  receiveSuits(this, entity, otherEntity, manager);
                } else if (txAntennaDeployed && rxAntennaDeployed && system.checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range*4)) {
                  receiveSuits(this, entity, otherEntity, manager);
                } else if (txSatelliteDeployed && rxSatelliteDeployed && system.checkSatellite(entity, otherEntity)) {
                  receiveSuits(this, entity, otherEntity, manager);
                };
              });
            } else {
              system.moduleMessage(this, entity, "<n>No other cybers in range!");
            };
            break;
          case "show":
            switch (argList[2]) {
              case "sat":
                manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", true);
                system.moduleMessage(this, entity, "<n>Deploying satellite!");
                break;
              case "ant":
                manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", true);
                system.moduleMessage(this, entity, "<n>Deploying antenna!");
                break;
              case "satRain":
                manager.setData(entity, "skyhighheroes:dyn/satellite_rain_mode", true);
                system.moduleMessage(this, entity, "<n>Activating satellite rain mode!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>transmitter<e>!");
                break;
            };
            break;
          case "hide":
            switch (argList[2]) {
              case "sat":
                manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", false);
                system.moduleMessage(this, entity, "<n>Retracting satellite!");
                break;
              case "ant":
                manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", false);
                system.moduleMessage(this, entity, "<n>Retracting antenna!");
                break;
              case "satRain":
                manager.setData(entity, "skyhighheroes:dyn/satellite_rain_mode", false);
                system.moduleMessage(this, entity, "<n>Deactivating satellite rain mode!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>transmitter<e>!");
                break;
            };
            break;
          case "set":
            var nbt = system.mainNBT(entity);
            switch (argList[2]) {
              case "holoAnt":
                manager.setBoolean(nbt, "holoAnt", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoAnt")));
                system.moduleMessage(this, entity, "<n>holoAnt set to <nh>" + nbt.getBoolean("holoAnt") + "<n>!");
                break;
              case "holoSat":
                manager.setBoolean(nbt, "holoSat", ((argList[3] == "true") ? true : (argList[3] == "false") ? false : nbt.getBoolean("holoSat")));
                system.moduleMessage(this, entity, "<n>holoSat set to <nh>" + nbt.getBoolean("holoSat") + "<n>!");
                break;
              case "xSat":
                manager.setData(entity, "skyhighheroes:dyn/satellite_x", parseInt(argList[2]));
                manager.setShort(nbt, "xSat", parseInt(argList[2]));
                system.moduleMessage(this, entity, "<n>xSat set to <nh>" + nbt.getShort("xSat") + "<n>!");
                break;
              case "ySat":
                manager.setData(entity, "skyhighheroes:dyn/satellite_y", parseInt(argList[2]));
                manager.setShort(nbt, "ySat", parseInt(argList[2]));
                system.moduleMessage(this, entity, "<n>ySat set to <nh>" + nbt.getShort("ySat") + "<n>!");
                break;
              case "zSat":
                manager.setData(entity, "skyhighheroes:dyn/satellite_z", parseInt(argList[2]));
                manager.setShort(nbt, "zSat", parseInt(argList[2]));
                system.moduleMessage(this, entity, "<n>zSat set to <nh>" + nbt.getShort("zSat") + "<n>!");
                break;
              case "freq":
                manager.setData(entity, "skyhighheroes:dyn/frequency", parseInt(argList[2]));
                manager.setShort(nbt, "freq", parseInt(argList[2]));
                system.moduleMessage(this, entity, "<n>Frequency set to <nh>" + nbt.getShort("freq") + "<n>!");
                break;
              default:
                system.moduleMessage(this, entity, "<e>Unknown <eh>comms<e> setting!");
                break;
            };
            break;
          case "status":
            system.moduleMessage(this, entity, "<n>Comms status:");
            system.moduleMessage(this, entity, "<n>Antenna: <nh>" + ((entity.getData("skyhighheroes:dyn/antenna_deploy_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Satellite: <nh>" + ((entity.getData("skyhighheroes:dyn/satellite_deploy_timer") > 0) ? "DEPLOYED" : "STOWED"));
            system.moduleMessage(this, entity, "<n>Satellite Rain Mode: <nh>" + ((entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") > 0) ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Connected Satellite: <nh>" + entity.getData("skyhighheroes:dyn/satellite_x") + "<n>, <nh>" + entity.getData("skyhighheroes:dyn/satellite_y") + "<n>, <nh>" + entity.getData("skyhighheroes:dyn/satellite_z"));
            system.moduleMessage(this, entity, "<n>Frequency: <nh>" + entity.getData("skyhighheroes:dyn/frequency"));
            system.moduleMessage(this, entity, "<n>Antenna Hologram: <nh>" + (nbt.getBoolean("holoAnt") ? "ENABLED" : "DISABLED"));
            system.moduleMessage(this, entity, "<n>Satellite Hologram: <nh>" + (nbt.getBoolean("holoSat") ? "ENABLED" : "DISABLED"));
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Communications commands:");
            system.moduleMessage(this, entity, "<n>!comms show <sat|ant|satRain> <nh>-<n> Deploys comms type");
            system.moduleMessage(this, entity, "<n>!comms hide <sat|ant|satRain> <nh>-<n> Retracts comms type");
            system.moduleMessage(this, entity, "<n>!comms suits <suits> <nh>-<n> Transmits suits (comma seperated indexes) to other Cybers");
            system.moduleMessage(this, entity, "<n>!comms cyberPos <nh>-<n> Gets position of other Cybers");
            system.moduleMessage(this, entity, "<n>!comms cyberStatus <nh>-<n> Gets stats of other Cybers");
            system.moduleMessage(this, entity, "<n>!comms set <holoAnt|holoSat|xSat|ySat|zSat|freq> <nh>-<n> Settings");
            system.moduleMessage(this, entity, "<n>!comms status <nh>-<n> Status of comms");
            system.moduleMessage(this, entity, "<n>!comms help <nh>-<n> Shows communications commands");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>comms<e> command! Try <eh>!comms help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>comms<e> command! Try <eh>!comms help<e> for a list of commands!");
      };
    },
    isModifierEnabled: function (entity, modifier) {
      result = false;
      if (!system.isModuleDisabled(entity, this.name)) {
      };
      if (modifier.name() == "fiskheroes:transformation") {
        result = true;
      };
      return result;
    },
    whenDisabled: function (entity, manager) {
      manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/satellite_rain_mode", false);
    },
    tickHandler: function (entity, manager) {
      if (!system.hasEnoughEnergy(entity, manager, "satellite")) {
        manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", false);
      };
      if (!system.hasEnoughEnergy(entity, manager, "antenna")) {
        manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", false);
      };
      if (!system.hasEnoughEnergy(entity, manager, "receiving")) {
        manager.setData(entity, "skyhighheroes:dyn/receiving_status_data", false);
        manager.setData(entity, "skyhighheroes:dyn/receiving_suits", false);
        manager.setData(entity, "skyhighheroes:dyn/receiving_waypoints", false);
      };
      if (!system.hasEnoughEnergy(entity, manager, "transmitting")) {
        manager.setData(entity, "skyhighheroes:dyn/transmitting_status_data", false);
        manager.setData(entity, "skyhighheroes:dyn/transmitting_suits", false);
        manager.setData(entity, "skyhighheroes:dyn/transmitting_waypoints", false);
      };
      if (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) {
        var rainMode = (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
        var receiving = (entity.getData("skyhighheroes:dyn/receiving_suits") || entity.getData("skyhighheroes:dyn/receiving_waypoints") || entity.getData("skyhighheroes:dyn/receiving_status_data"))
        var transmitting = (entity.getData("skyhighheroes:dyn/transmitting_suits") || entity.getData("skyhighheroes:dyn/transmitting_waypoints") || entity.getData("skyhighheroes:dyn/transmitting_status_data"));
        manager.setData(entity, "skyhighheroes:dyn/transmit_beam", rainMode && transmitting);
        manager.setData(entity, "skyhighheroes:dyn/receive_beam", rainMode && receiving);
      };
      if (!entity.getData("skyhighheroes:dyn/satellite_deployed")) {
        manager.setData(entity, "skyhighheroes:dyn/transmit_beam", false);
        manager.setData(entity, "skyhighheroes:dyn/receive_beam", false);
      };
      if (entity.getData("skyhighheroes:dyn/satellite_deployed")) {
        system.useEnergy(entity, manager, "satellite");
      };
      if (entity.getData("skyhighheroes:dyn/antenna_deployed")) {
        system.useEnergy(entity, manager, "antenna");
      };
      if (entity.getData("skyhighheroes:dyn/receiving_suits") || entity.getData("skyhighheroes:dyn/receiving_waypoints") || entity.getData("skyhighheroes:dyn/receiving_status_data")) {
        system.useEnergy(entity, manager, "receiving");
      };
      if (entity.getData("skyhighheroes:dyn/transmitting_suits") || entity.getData("skyhighheroes:dyn/transmitting_waypoints") || entity.getData("skyhighheroes:dyn/transmitting_status_data")) {
        system.useEnergy(entity, manager, "transmitting");
      };
      var nbt = system.mainNBT(entity);
      if (entity.getData("skyhighheroes:dyn/receive_suits_timer") >= 1) {
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.levelup", 1.0, 1.0);
        };
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receiving_suits", false);
        system.moduleMessage(this, entity, "<s>Finished receiving suits!");
        manager.setTagList(nbt, "suitsReceiveBuffer", manager.newTagList());
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_suits_duration", 0);
        if (entity.getData("skyhighheroes:dyn/current_menu") == "comms" && entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
          system.updateList2(entity, manager, 10, []);
        };
        if (entity.getData("skyhighheroes:dyn/current_menu") == "comms" && entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
          system.updateList2(entity, manager, 10, []);
        };
      };
      var suitReceiveBuffer = manager.newTagList();
      if (nbt.getStringList("suitsReceiveBuffer") != null) {
        suitReceiveBuffer = nbt.getStringList("suitsReceiveBuffer");
      };
      var receiveSuitsDuration = entity.getData("skyhighheroes:dyn/receive_suits_duration");
      if (entity.getData("skyhighheroes:dyn/receiving_suits")) {
        var step = (1 / receiveSuitsDuration);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_suits_timer", entity.getData("skyhighheroes:dyn/receive_suits_timer") + step);
      };
      if (!entity.getData("skyhighheroes:dyn/receiving_suits") && entity.getData("skyhighheroes:dyn/receive_suits_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_suits_timer", 0);
      };
      if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/receive_suits_timer") < 1) && (entity.getData("skyhighheroes:dyn/receive_suits_timer") > 0) && entity.getData("skyhighheroes:dyn/receiving_suits")) {
        var suitReceiveDuration = (receiveSuitsDuration / suitReceiveBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/receive_suits_timer") * receiveSuitsDuration);
        if (currentTime % suitReceiveDuration == 0) {
          var currentReceive = (currentTime / suitReceiveDuration) - 1;
          receiveSuit(this, entity, manager, currentReceive);
        };
      };
      if (entity.getData("skyhighheroes:dyn/transmit_suits_timer") >= 1) {
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.levelup", 1.0, 1.0);
        };
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_suits", false);
        system.moduleMessage(this, entity, "<s>Finished transmitting suits!");
        manager.setTagList(nbt, "suitsTransmitBuffer", manager.newTagList());
        system.updateList2(entity, manager, 10, []);
        var list = system.getStringArray(nbt.getStringList("suitDatastore"));
        system.updateList(entity, manager, 10, list);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_suits_duration", 0);
      };
      var suitsTransmitBuffer = manager.newTagList();
      if (nbt.getStringList("suitsTransmitBuffer") != null) {
        suitsTransmitBuffer = nbt.getStringList("suitsTransmitBuffer");
      };
      var transmitSuitsDuration = entity.getData("skyhighheroes:dyn/transmit_suits_duration");
      if (entity.getData("skyhighheroes:dyn/transmitting_suits")) {
        var step = (1 / transmitSuitsDuration);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_suits_timer", entity.getData("skyhighheroes:dyn/transmit_suits_timer") + step);
      };
      if (!entity.getData("skyhighheroes:dyn/transmitting_suits") && entity.getData("skyhighheroes:dyn/transmit_suits_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_suits_timer", 0);
      };
      if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/transmit_suits_timer") < 1) && (entity.getData("skyhighheroes:dyn/transmit_suits_timer") > 0) && entity.getData("skyhighheroes:dyn/transmitting_suits")) {
        var suitTransmitDuration = (transmitSuitsDuration / suitsTransmitBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/transmit_suits_timer") * transmitSuitsDuration);
        if (currentTime % suitTransmitDuration == 0) {
          var currentTransmit = (currentTime / suitTransmitDuration) - 1;
          transmitSuit(this, entity, manager, currentTransmit);
        };
      };
      if (entity.getData("fiskheroes:flight_timer") > 0) {
        if (entity.getData("skyhighheroes:dyn/satellite_deployed")) {
          system.moduleMessage(this, entity, "<e>Retracting Satellite!");
          manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", false);
        };
        if (entity.getData("skyhighheroes:dyn/antenna_deployed")) {
          system.moduleMessage(this, entity, "<e>Retracting Antenna!");
          manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", false);
        };
      };

      //Waypoints
      if (entity.getData("skyhighheroes:dyn/receive_waypoints_timer") >= 1) {
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.levelup", 1.0, 1.0);
        };
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receiving_waypoints", false);
        system.moduleMessage(this, entity, "<s>Finished receiving waypoints!");
        manager.setTagList(nbt, "waypointsReceiveBuffer", manager.newTagList());
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_waypoints_duration", 0);
      };
      var waypointReceiveBuffer = manager.newTagList();
      if (nbt.getTagList("waypointsReceiveBuffer") != null) {
        waypointReceiveBuffer = nbt.getTagList("waypointsReceiveBuffer");
      };
      var receiveWaypointsDuration = entity.getData("skyhighheroes:dyn/receive_waypoints_duration");
      if (entity.getData("skyhighheroes:dyn/receiving_waypoints")) {
        var step = (1 / receiveWaypointsDuration);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_waypoints_timer", entity.getData("skyhighheroes:dyn/receive_waypoints_timer") + step);
      };
      if (!entity.getData("skyhighheroes:dyn/receiving_waypoints") && entity.getData("skyhighheroes:dyn/receive_waypoints_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/receive_waypoints_timer", 0);
      };
      if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/receive_waypoints_timer") < 1) && (entity.getData("skyhighheroes:dyn/receive_waypoints_timer") > 0) && entity.getData("skyhighheroes:dyn/receiving_waypoints")) {
        var waypointReceiveDuration = (receiveWaypointsDuration / waypointReceiveBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/receive_waypoints_timer") * receiveWaypointsDuration);
        if (currentTime % waypointReceiveDuration == 0) {
          var currentReceive = (currentTime / waypointReceiveDuration) - 1;
          receiveWaypoint(this, entity, manager, currentReceive);
        };
      };
      if (entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") >= 1) {
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.levelup", 1.0, 1.0);
        };
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmitting_waypoints", false);
        system.moduleMessage(this, entity, "<s>Finished transmitting waypoints!");
        manager.setTagList(nbt, "waypointsTransmitBuffer", manager.newTagList());
        system.updateList2(entity, manager, 10, []);
        var list = getWaypointNameArray(nbt.getTagList("waypoints"));
        system.updateList(entity, manager, 10, list);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_waypoints_duration", 0);
      };
      var waypointTransmitBuffer = manager.newTagList();
      if (nbt.getTagList("waypointsTransmitBuffer") != null) {
        waypointTransmitBuffer = nbt.getTagList("waypointsTransmitBuffer");
      };
      var transmitWaypointsDuration = entity.getData("skyhighheroes:dyn/transmit_waypoints_duration");
      if (entity.getData("skyhighheroes:dyn/transmitting_waypoints")) {
        var step = (1 / transmitWaypointsDuration);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_waypoints_timer", entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") + step);
      };
      if (!entity.getData("skyhighheroes:dyn/transmitting_waypoints") && entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/transmit_waypoints_timer", 0);
      };
      if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") < 1) && (entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") > 0) && entity.getData("skyhighheroes:dyn/transmitting_waypoints")) {
        var waypointTransmitDuration = (transmitWaypointsDuration / waypointTransmitBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/transmit_waypoints_timer") * transmitWaypointsDuration);
        if (currentTime % waypointTransmitDuration == 0) {
          var currentTransmit = (currentTime / waypointTransmitDuration) - 1;
          transmitWaypoint(this, entity, manager, currentTransmit);
        };
      };
    },
    onInitSystem: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!nbt.hasKey("xSat")) {
        manager.setShort(nbt, "xSat", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/satellite_x", nbt.getShort("xSat"));
      if (!nbt.hasKey("ySat")) {
        manager.setShort(nbt, "ySat", 1000);
      };
      manager.setData(entity, "skyhighheroes:dyn/satellite_y", nbt.getShort("ySat"));
      if (!nbt.hasKey("zSat")) {
        manager.setShort(nbt, "zSat", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/satellite_z", nbt.getShort("zSat"));
      if (!nbt.hasKey("freq")) {
        manager.setShort(nbt, "freq", 100);
      };
      manager.setData(entity, "skyhighheroes:dyn/frequency", nbt.getShort("freq"));
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", false);
      manager.setData(entity, "skyhighheroes:dyn/receiving_suits", false);
      manager.setData(entity, "skyhighheroes:dyn/receiving_waypoints", false);
      manager.setData(entity, "skyhighheroes:dyn/transmitting_suits", false);
      manager.setData(entity, "skyhighheroes:dyn/transmitting_waypoints", false);
    }
  };
};