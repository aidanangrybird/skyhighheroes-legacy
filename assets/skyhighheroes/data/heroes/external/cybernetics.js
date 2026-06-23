//If I see anyone steal this, I will be very mad as I have spent a lot of time working on this to get it working well
//So please don't steal this, it will look very bad on you

var logMessages = false;

regex = /((<ob>))|(<n>)|(<nh>)|(<s>)|(<sh>)|(<e>)|(<eh>)|(<r>)/gm;

var formatting = {
  "<ob>": "\u00A7k",
  "<n>": "\u00A7b",
  "<nh>": "\u00A7a",
  "<s>": "\u00A7a",
  "<sh>": "\u00A7e",
  "<e>": "\u00A7c",
  "<eh>": "\u00A76",
  "<r>": "\u00A7r"
};

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

var colorDamage = {
  //Base
  "9": "12",
  //Blue
  "1": "4",
  //Green
  "2": "2",
  //Orange
  "6": "14",
  //Purple
  "5": "5",
  //Red
  "4": "1",
  //Yellow
  "e": "11"
};

var hexColors = {
  //Base
  "C-9": "0x00AEFF",
  //Blue
  "CB-1": "0x0000FF",
  //Green
  "CG-2": "0x00FF00",
  //Orange
  "CO-6": "0xFF9400",
  //Purple
  "CP-5": "0x7C00FF",
  //Red
  "CR-4": "0xFF0000",
  //Yellow
  "CY-e": "0xFFFF00"
};

modelRegex = /[a-z\s]/gm;

aliasRegex = /[\s]/gm;

/**
 * Gets colorDamage from color
 * @param {string} input - Color
 * @returns colorDamage
 **/
function getColorDamage(input) {
  var output = "0";
  if (colorDamage.hasOwnProperty(input)) {
    output = colorDamage[input];
  };
  return output;
};

/**
 * Formats name to short name
 * @param {string} input - Message to format
 * @returns Formatted message
 **/
function formatModel(input) {
  output = input.replace(modelRegex, function(thing) {
    return "";
  });
  return output;
};

/**
 * Formats name to alias format
 * @param {string} input - Message to format
 * @returns Formatted message
 **/
function formatAlias(input) {
  input = input.toLowerCase();
  output = input.replace(aliasRegex, function(thing) {
    return "_";
  });
  return output;
};

function assignID(entity, manager) {
  var nbt = mainNBT(entity);
  if (!nbt.hasKey("computerID")) {
    if (PackLoader.getSide() == "SERVER") {
      var computerID = Math.random().toFixed(20).toString().substring(2);
      manager.setString(nbt, "computerID", computerID);
    };
  } else {
    var computerID = nbt.getString("computerID");
    if (computerID.length < 20) {
      if (PackLoader.getSide() == "SERVER") {
        var computerID = Math.random().toFixed(20).toString().substring(2);
        manager.setString(nbt, "computerID", computerID);
      };
    };
  };
};

/**
 * Checks if an entity is cybernetic
 * @param {JSEntity} entity - Entity getting checked
 * @returns If the entity is cybernetic
 **/
function hasCyberneticBody(entity) {
  return mainNBT(entity).hasKey("cyberModelID") && mainNBT(entity).getString("cyberAliasName");
};

/**
 * Gets the Cyber ID
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Cyber ID
 **/
function getModelID(entity) {
  return entity.getData("skyhighheroes:dyn/model_id");
};
/**
 * Gets the Cyber name
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Cyber alias
 **/
function getAliasName(entity) {
  return entity.getData("skyhighheroes:dyn/alias");
};
/**
 * Gets the UUID of the suits authorized user
 * @param {JSEntity} entity - Entity getting checked
 * @returns The UUID of the suits authorized user
 **/
function getBoundUUID(entity) {
  return mainNBT(entity).getString("boundUUID");
};

/**
 * Checks if an entity has a device that is a computer
 * @param {JSEntity} entity - Entity getting checked
 * @returns If the entity has a device that is a computer
 **/
function hasComputer(entity) {
  return getMainNBT(entity).hasKey("computerID");
};

/**
 * Applies formatting to system messages
 * @param {string} input - Message to format
 * @returns Formatted message
 **/
function formatSystem(input) {
  output = input.replace(regex, function(thing) {
    return formatting[thing];
  });
  return output;
};

function cleanData(value) {
  return Math.abs(value) < 0.0000075 ? 0 : value;
};

function syncXMotion(entity, manager) {
  if (PackLoader.getSide() == "SERVER") {
    var currentPos = entity.posX();
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/motion_x", cleanData(entity.getData("skyhighheroes:dyn/position_x") - currentPos));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/position_x", currentPos);
  } else {
    return;
  };
};

function syncYMotion(entity, manager) {
  if (PackLoader.getSide() == "SERVER") {
    var currentPos = entity.posY();
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/motion_y", cleanData(entity.getData("skyhighheroes:dyn/position_y") - currentPos));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/position_y", currentPos);
  } else {
    return;
  }
};

function syncZMotion(entity, manager) {
  if (PackLoader.getSide() == "SERVER") {
    var currentPos = entity.posZ();
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/motion_z", cleanData(entity.getData("skyhighheroes:dyn/position_z") - currentPos));
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/position_z", currentPos);
  } else {
    return;
  };
};

function syncMotion(entity, manager) {
  if (PackLoader.getSide() == "SERVER") {
    syncXMotion(entity, manager);
    syncYMotion(entity, manager);
    syncZMotion(entity, manager);
  } else {
    return;
  };
};

/**
 * Number degree to a cardinal direction
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Cardinal direction
 **/
function angleToDirection(angle) {
  var direction = angle.toFixed(0);
  if (((angle >= 0) && (angle <= 11.25)) || ((angle >= 348.75) && (angle <= 360))) {
    direction = "N";
  };
  if ((angle <= 33.75) && (angle >= 11.25)) {
    direction = "NNE";
  };
  if ((angle <= 56.25) && (angle >= 33.75)) {
    direction = "NE";
  };
  if ((angle <= 78.75) && (angle >= 56.25)) {
    direction = "ENE";
  };
  if ((angle <= 101.25) && (angle >= 78.75)) {
    direction = "E";
  };
  if ((angle <= 123.75) && (angle >= 101.25)) {
    direction = "ESE";
  };
  if ((angle <= 146.25) && (angle >= 123.75)) {
    direction = "SE";
  };
  if ((angle <= 168.75) && (angle >= 146.25)) {
    direction = "SSE";
  };
  if ((angle <= 191.25) && (angle >= 168.75)) {
    direction = "S";
  };
  if ((angle <= 213.75) && (angle >= 191.25)) {
    direction = "SSW";
  };
  if ((angle <= 236.25) && (angle >= 213.75)) {
    direction = "SW";
  };
  if ((angle <= 258.75) && (angle >= 236.25)) {
    direction = "WSW";
  };
  if ((angle <= 281.25) && (angle >= 258.75)) {
    direction = "W";
  };
  if ((angle <= 303.75) && (angle >= 281.25)) {
    direction = "WNW";
  };
  if ((angle <= 326.25) && (angle >= 303.75)) {
    direction = "NW";
  };
  if ((angle <= 348.75) && (angle >= 326.25)) {
    direction = "NNW";
  };
  return direction;
};
/**
 * Gets distance from one vector to another
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Distance
 **/
function distance(base, other) {
  var distance = base.multiply(1, 0, 1).distanceTo(other.multiply(1, 0, 1)).toFixed(0);
  return distance;
};

/**
 * Gets distance from one vector to another
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Distance
 **/
function elevation(base, other) {
  var elevation = other.y() - base.y();
  return elevation;
};

/**
 * Gets direction from one vector to another
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Direction
 **/
function direction(base, other) {
  var angle = (((Math.atan2(-1*(other.z()-base.z()), -1*(other.x()-base.x())) * 180) / Math.PI) + 270) % 360;
  var direction = angleToDirection(angle);
  return direction;
};

function mainPiece(entity) {
  return entity.getWornChestplate();
};

function mainNBT(entity) {
  return mainPiece(entity).nbt();
};

function getMainPiece(entity) {
  if (entity.isWearingFullSuit()) {
    if (entity.getWornHelmet().nbt().hasKey("computerID")) {
      return entity.getWornHelmet();
    };
    if (entity.getWornChestplate().nbt().hasKey("computerID")) {
      return entity.getWornChestplate();
    };
    if (entity.getWornLeggings().nbt().hasKey("computerID")) {
      return entity.getWornLeggings();
    };
    if (entity.getWornBoots().nbt().hasKey("computerID")) {
      return entity.getWornBoots();
    };
  };
  return null;
};

function getMainNBT(entity) {
  return ((getMainPiece(entity) != null) ? getMainPiece(entity).nbt() : null);
};

function round(input) {
  var output = ((Math.ceil(input*1000.0))/1000.0);
  return output;
};

var energyConfig = {
  "maxEnergy": 1000000000,
  "minEnergy": 0,
  "reserveEnergy": 500000,
};

var energyUseConfig = {
  //Flight speed of 0.05
  "rockets05": 50,
  //Flight speed of 0.1
  "rockets10": 100,
  //Flight speed of 0.15
  "rockets15": 150,
  //Flight speed of 0.2
  "rockets20": 200,
  //Flight speed of 0.25
  "rockets25": 250,
  //Flight speed of 0.3
  "rockets30": 300,
  //Flight speed of 0.35
  "rockets35": 350,
  //Flight speed of 0.45
  "rockets45": 450,
  //Firing 1 cannon set
  "cannons1": 50,
  //Firing 2 cannon set
  "cannons2": 100,
  //Firing 3 cannon set
  "cannons3": 150,
  //1 cannon set charging
  "cannonsCharging1": 150,
  //2 cannon set charging
  "cannonsCharging2": 300,
  //3 cannon set charging
  "cannonsCharging3": 450,
  //Night vision
  "nightVision": 10,
  //Blade active
  "blade": 10,
  //Shield active
  "shield": 10,
  //Shield recharging after getting damaged
  "shieldDamaged": 50,
  //Camouflage active
  "camouflage": 20000,
  //Disguise active
  "disguise": 1000,
  //Disguise clothing enabled
  "disguiseClothing": 500,
  //Body lights, which can be turned off to preserve energy
  "bodyLights": 10,
  //Statue mode can be turned on to preserve energy
  "motorControl": 10,
  //Optics enabled, which can be turned off to preserve energy
  "opticsEnabled": 10,
  //Intake fan running
  "intakeFan": 100,
  //General movement energy consumption
  "movement": 10,
  //Maintaining a link with the antenna
  "antenna": 25,
  //Maintaining a link with the satellite dish
  "satellite": 25,
  //General external arms energy consumption
  "externalArms": 10,
  //Energy consumption from lifting things using the external arms
  "externalArmsLifting": 50,
  //Transmitting takes energy to send the signals
  "transmitting": 100,
  //Receiving takes energy to decode the signals
  "receiving": 100,
  //Downloading takes energy to decompress and transfer the data
  "downloading": 100,
  //Uploading takes energy to compress and transfer the data
  "uploading": 100,
  //Regen/repair energy consumption
  "damageTaken": 50,
  //Base energy consumption
  "base": 1,
};

var chargingConfig = {
  "minecraft:redstone_ore": 500,
  "fiskheroes:lunar_redstone_ore": 500,
  "minecraft:redstone_block": 1000,
  "fiskheroes:eternium_stone": 5000,
  "fiskheroes:eternium_block": 10000,
  "fiskheroes:supercharged_eternium": 50000,
};

function useEnergy(entity, manager, device) {
  var amount = 0;
  if (energyUseConfig.hasOwnProperty(device)) {
    amount = energyUseConfig[device];
  };
  manager.setInterpolatedData(entity, "skyhighheroes:dyn/energy", clamp(entity.getData("skyhighheroes:dyn/energy") - amount, 0, energyConfig.maxEnergy));
  if ((entity.ticksExisted() % 100) == 0) {
    var nbt = mainNBT(entity);
    manager.setDouble(nbt, "energy", entity.getData("skyhighheroes:dyn/energy"));
  };
};
function hasEnoughEnergy(entity, manager, device) {
  var value = true;
  var amount = 0;
  if (energyUseConfig.hasOwnProperty(device)) {
    amount = energyUseConfig[device];
  };
  if ((entity.getData("skyhighheroes:dyn/energy") - amount) < energyConfig["reserveEnergy"]) {
    value = false;
  };
  return value;
};
function chargeEnergy(entity, manager) {
  var blockBelow = entity.world().getBlock(entity.pos().add(0, -1, 0));
  if (chargingConfig.hasOwnProperty(blockBelow)) {
    var amount = chargingConfig[blockBelow];
    manager.setInterpolatedData(entity, "skyhighheroes:dyn/energy", clamp(entity.getData("skyhighheroes:dyn/energy") + amount, 0, energyConfig.maxEnergy));
    if ((entity.ticksExisted() % 100) == 0) {
      var nbt = mainNBT(entity);
      manager.setDouble(nbt, "energy", entity.getData("skyhighheroes:dyn/energy"));
    };
  };
};
function onChargingBlock(entity) {
  var blockBelow = entity.world().getBlock(entity.pos().add(0, -1, 0));
  var result = chargingConfig.hasOwnProperty(blockBelow);
  return result;
};
/**
 * Attempts to get model of a cybernetic player by id
 * @param {JSEntity} entity - Required
 * @param {JSDataManager} manager - Requried
 * @param {integer} id - ID
 **/
function maybeGetID(entity, manager, id) {
  var nbt = mainNBT(entity);
  var otherEntity = entity.world().getEntityById(id);
  if (!nbt.hasKey("playerInfoSat")) {
    manager.setTagList(nbt, "playerInfoSat", manager.newTagList());
  };
  var tagList = nbt.getTagList("playerInfoSat");
  if (otherEntity.exists() && otherEntity.isLivingEntity()) {
    if (otherEntity.is("PLAYER")) {
      var otherPlayer = otherEntity.as("PLAYER");
      if (otherPlayer.isWearingFullSuit()) {
        if (hasCyberneticBody(otherPlayer)) {
          var uuidList = getSatUUIDList(entity);
          var otherUUID = otherPlayer.getUUID();
          var otherName = otherPlayer.getName();
          var index = uuidList.indexOf(otherUUID);
          if (index < 0) {
            var compoundTag = manager.newCompoundTag();
            manager.setInteger(compoundTag, "id", id);
            manager.setString(compoundTag, "uuid", otherUUID);
            manager.appendTag(tagList, compoundTag);
            if (PackLoader.getSide() == "CLIENT") {
              systemMessage(entity, "Got id " + id + " for " + otherName);
            };
          } else if (index > -1) {
            var compoundTag = tagList.getCompoundTag(index);
            manager.setInteger(compoundTag, "id", id);
            if (PackLoader.getSide() == "CLIENT") {
              systemMessage(entity, "Updated id " + id + " for " + otherName);
            };
          };
        };
      };
    };
  };
};

/**
 * Gets satellite UUID list from entity 
 * @param {JSEntity} entity - Required
 **/
function getSatUUIDList(entity) {
  var nbt = mainNBT(entity);
  var list = nbt.getTagList("playerInfoSat");
  var count = list.tagCount();
  var result = [];
  for (i=0;i<count;i++) {
    result.push(list.getCompoundTag(i).getString("uuid"));
  };
  return result;
};

/**
 * Gets satellite ID list from entity 
 * @param {JSEntity} entity - Required
 **/
function getSatIDList(entity) {
  var nbt = mainNBT(entity);
  var list = mainNBT(entity).getTagList("playerInfoSat");
  var count = list.tagCount();
  var result = [];
  for (i=0;i<count;i++) {
    result.push(list.getCompoundTag(i).getString("id"));
  };
  return result;
};

/**
 * Compares satellites between two entities
 * @param {JSEntity} entity - Required
 * @param {JSEntity} otherEntity - Required
 **/
function checkSatellite(entity, otherEntity) {
  var nbt = mainNBT(entity);
  var nbtOther = mainNBT(otherEntity);
  if ((nbt.getShort("xSat") == nbtOther.getShort("xSat")) && (nbt.getShort("ySat") == nbtOther.getShort("ySat")) && (nbt.getShort("zSat") == nbtOther.getShort("zSat"))) {
    return true;
  } else {
    return false;
  };
};

/**
 * Compares frequencies between two entities
 * @param {JSEntity} entity - Required
 * @param {JSEntity} otherEntity - Required
 **/
function checkFrequency(entity, otherEntity) {
  var nbt = mainNBT(entity);
  var nbtOther = mainNBT(otherEntity);
  if (nbt.getShort("freq") == nbtOther.getShort("freq")) {
    return true;
  } else {
    return false;
  };
};

/**
 * Checks if an entity by ID is still a cyber
 * @param {JSEntity} entity - Required
 * @param {integer} id - ID
 **/
function isStillCyber(entity, id) {
  var result = false;
  var otherEntity = entity.world().getEntityById(id);
  if (otherEntity.exists() && otherEntity.isLivingEntity()) {
    if (otherEntity.is("PLAYER")) {
      var otherPlayer = otherEntity.as("PLAYER");
      if (otherPlayer.isWearingFullSuit() && mainNBT(entity).hasKey("computerID")) {
        if (hasCyberneticBody(otherPlayer)) {
          result = true;
        };
      };
    };
  };
  return result;
};

/**
 * Turns NBT String List into an array for easier use in code
 * @param {JSNBTList} nbtList - NBTList
 * @returns Array of values from the NBTList
 **/
function getStringArray(nbtList) {
  var count = nbtList.tagCount();
  var result = [];
  for (i=0;i<count;i++) {
    result.push(nbtList.getString(i));
  };
  return result;
};
/**
 * Checks if a module is disabled
 * @param {JSEntity} entity - Player getting checked
 * @param {string} moduleName - Module being checked if disabled
 * @returns If module is disabled
 **/
function isModuleDisabled(entity, moduleName) {
  var disabledModules = mainNBT(entity).getStringList("disabledModules");
  var modulesDisabled = getStringArray(disabledModules);
  var result = false;
  modulesDisabled.forEach(entry => {
    if (entry == moduleName) {
      result = true;
    };
  });
  return result;
};
/**
 * Prints message to player's chat
 * @param {JSEntity} entity - Required
 * @param {string} message - Message to be shown to player
 **/
function chatMessage(entity, message) {
  if (PackLoader.getSide() == "SERVER") {
    entity.as("PLAYER").addChatMessage(message);
  };
};
/**
 * Prints message to every line of sight visible player's chat within range
 * @param {JSEntity} entity - Required base entity
 * @param {string} message - Message to be shown to players in range
 * @param {number} range - Range which to shout message at
 **/
function shoutMessage(entity, message, range) {
  var entities = entity.world().getEntitiesInRangeOf(entity.pos(), range);
  var name = entity.getName();
  if (entity.getData("fiskheroes:disguise") != null) {
    name = entity.getData("fiskheroes:disguise");
  };
  entities.forEach(player => {
    if (player.is("PLAYER") && entity.canSee(player)) {
      chatMessage(player, "<" + name + "> " + message);
    };
  });
};
/**
 * Sends system message, formatting tags are below
 * ```
 * "<ob>": "\u00A7k"
 * "<n>": "\u00A7b"
 * "<nh>": "\u00A7a"
 * "<s>": "\u00A7a"
 * "<sh>": "\u00A7e"
 * "<e>": "\u00A7c"
 * "<eh>": "\u00A76"
 * "<r>": "\u00A7r"
 * ```
 * @param {JSEntity} entity - Entity recieving message
 * @param {string} message - Message content
 **/
function systemMessage(entity, message) {
  var color = entity.getData("skyhighheroes:dyn/color");
  chatMessage(entity, formatSystem("\u00A7" + color + "\u00A7lcyberOS" + "<r>> " + message));
};
/**
 * Sends log message
 * @param {string} message - Log message
 **/
function logMessage(message) {
  if (logMessages) {
    PackLoader.print("skyhighheroes: " + message);
  };
};

/**
 * Sends log message
 * @param {object} module - Reference 'this' module
 * @param {JSEntity} entity - Entity recieving message
 * @param {string} message - Message content
 **/
function moduleMessage(module, entity, message) {
  var color = entity.getData("skyhighheroes:dyn/color");
  var messageName = "\u00A7lcyberOS";
  if (module.hasOwnProperty("moduleMessageName")) {
    messageName = module.moduleMessageName
  };
  chatMessage(entity, formatSystem("\u00A7" + color + messageName + "<r>> " + message));
};

/**
 * Clamp
 * @param value - input value
 * @param min - minimum value
 * @param max - maximum value
 **/
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

function cycleUpHud(entity, manager) {
  var nbt = mainNBT(entity);
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 0) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_left", entity.getData("skyhighheroes:dyn/hud_side_left") + 1);
    manager.setInteger(nbt, "hudLeftSide", nbt.getInteger("hudLeftSide") + 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_left") > 7) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_left", 0);
      manager.setInteger(nbt, "hudLeftSide", 0);
    };
  };
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 1) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_top", entity.getData("skyhighheroes:dyn/hud_side_top") + 1);
    manager.setInteger(nbt, "hudTopSide", nbt.getInteger("hudTopSide") + 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_top") > 2) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_top", 0);
      manager.setInteger(nbt, "hudTopSide", 0);
    };
  };
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 2) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_right", entity.getData("skyhighheroes:dyn/hud_side_right") + 1);
    manager.setInteger(nbt, "hudRightSide", nbt.getInteger("hudRightSide") + 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_right") > 2) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_right", 0);
      manager.setInteger(nbt, "hudRightSide", 0);
    };
  };
};

function cycleDownHud(entity, manager) {
  var nbt = mainNBT(entity);
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 0) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_left", entity.getData("skyhighheroes:dyn/hud_side_left") - 1);
    manager.setInteger(nbt, "hudLeftSide", nbt.getInteger("hudLeftSide") - 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_left") < 0) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_left", 7);
      manager.setInteger(nbt, "hudLeftSide", 7);
    };
  };
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 1) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_top", entity.getData("skyhighheroes:dyn/hud_side_top") - 1);
    manager.setInteger(nbt, "hudTopSide", nbt.getInteger("hudTopSide") - 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_top") < 0) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_top", 2);
      manager.setInteger(nbt, "hudTopSide", 2);
    };
  };
  if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 2) {
    manager.setData(entity, "skyhighheroes:dyn/hud_side_right", entity.getData("skyhighheroes:dyn/hud_side_right") - 1);
    manager.setInteger(nbt, "hudRightSide", nbt.getInteger("hudRightSide") - 1);
    if (entity.getData("skyhighheroes:dyn/hud_side_right") < 0) {
      manager.setData(entity, "skyhighheroes:dyn/hud_side_right", 2);
      manager.setInteger(nbt, "hudRightSide", 2);
    };
  };
};

/**
 * Allows for multitapping of keys
 * @param {string} varPrefix - Prefix of variables to use
 * @returns Other functions
 **/
function initMultiTap(varPrefix) {
  var varTimer = varPrefix + "_tap_timer";
  var varCount = varPrefix + "_tap_count";
  var varCooldown = varPrefix + "_tap_cooldown";
  var varCoolingDown = varPrefix + "_tap_cooling_down";
  var varTap = varPrefix + "_tapped";
  return {
  /**
   * Allows for multitapping of keys with condition
   * @param {JSEntity} entity - Entity getting checked
   * @param {JSDataManager} manager - Data manager
   * @param {number} taps - Taps before function returns true
   * @param {number} duration - Ticks before timing out
   * @param {number} cooldown - Ticks between taps
   * @param {boolean} condition - Condition to increase tap count
   * @returns If the number of taps has been reached
   **/
    conditionalMultiTap: function (entity, manager, taps, duration, cooldown, condition) {
      manager.incrementData(entity, varTimer, duration, 0, (entity.getDataOrDefault(varCount, 0) > 0));
      manager.incrementData(entity, varCooldown, 0, cooldown, entity.getDataOrDefault(varCoolingDown, false));
      if (entity.getDataOrDefault(varTimer, 0) == 1 && entity.getDataOrDefault(varCount, 0) != taps) {
        manager.setDataWithNotify(entity, varCount, 0);
        manager.setDataWithNotify(entity, varTimer, 0.0);
        return false;
      };
      if (entity.getDataOrDefault(varCount, 0) == taps && entity.getDataOrDefault(varTimer, 0) > 0) {
        manager.setDataWithNotify(entity, varCount, 0);
        manager.setDataWithNotify(entity, varTimer, 0.0);
        return true;
      };
      if (condition) {
        if (entity.getDataOrDefault(varCooldown, 0) == 0 && entity.getDataOrDefault(varTimer, 1) < 1) {
          manager.setDataWithNotify(entity, varCount, entity.getDataOrDefault(varCount, 0) + 1);
          manager.setDataWithNotify(entity, varCoolingDown, true);
        };
      };
      if (!condition) {
        manager.setDataWithNotify(entity, varCoolingDown, false);
      };
      return false;
    },
  /**
   * Allows for multitapping of keys
   * @param {JSEntity} entity - Entity getting checked
   * @param {JSDataManager} manager - Data manager
   * @param {number} taps - Taps before function returns true
   * @param {number} duration - Ticks before timing out
   * @param {number} cooldown - Ticks between taps
   * @returns If the number of taps has been reached
   **/
    multiTap: function (entity, manager, taps, duration, cooldown) {
      manager.incrementData(entity, varTimer, duration, 0, (entity.getDataOrDefault(varCount, 0) > 0));
      manager.incrementData(entity, varCooldown, 0, cooldown, entity.getDataOrDefault(varCoolingDown, false));
      if (entity.getDataOrDefault(varTimer, 0) == 1 && entity.getDataOrDefault(varCount, 0) != taps) {
        manager.setDataWithNotify(entity, varCount, 0);
        manager.setDataWithNotify(entity, varTimer, 0.0);
        return false;
      };
      if (entity.getDataOrDefault(varCount, 0) == taps && entity.getDataOrDefault(varTimer, 0) > 0) {
        manager.setDataWithNotify(entity, varCount, 0);
        manager.setDataWithNotify(entity, varTimer, 0.0);
        return true;
      };
      if (entity.getDataOrDefault(varTap, false)) {
        if (entity.getDataOrDefault(varCooldown, 0) == 0 && entity.getDataOrDefault(varTimer, 1) < 1) {
          manager.setDataWithNotify(entity, varCount, entity.getDataOrDefault(varCount, 0) + 1);
          manager.setDataWithNotify(entity, varCoolingDown, true);
        };
      };
      if (!entity.getDataOrDefault(varTap, true)) {
        manager.setDataWithNotify(entity, varCoolingDown, false);
      };
      return false;
    },
    tap: function (entity, manager) {
      manager.setDataWithNotify(entity, varTap, true);
    },
    tapReset: function (entity, manager) {
      if (entity.getDataOrDefault(varTap, false)) {
        manager.setDataWithNotify(entity, varTap, false);
      };
    }
  };
};

function setMenu(entity, manager, newMenu) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_menu", entity.getData("skyhighheroes:dyn/current_menu"));
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/current_menu", newMenu);
};
function setSubmenu(entity, manager, newSubmenu) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_submenu", entity.getData("skyhighheroes:dyn/current_submenu"));
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/current_submenu", newSubmenu);
};

function updateList(entity, manager, count, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list_total", list.length);
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_0", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_1", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_2", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_3", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_4", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_5", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_6", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_7", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_8", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_entry_9", "");
  if (list.length > 0) {
    for (i = 0; i < count; i++) {
      var value = entity.getData("skyhighheroes:dyn/scroll_value") + i;
      var variableName = "skyhighheroes:dyn/scroll_entry_" + i;
      var listEntry = ((list.length > value) ? list[value] : "");
      manager.setDataWithNotify(entity, variableName, (typeof listEntry === "string") ? listEntry : "");
    };
  };
};
function updateList2(entity, manager, count, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list2_total", list.length);
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_0", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_1", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_2", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_3", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_4", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_5", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_6", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_7", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_8", "");
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_entry_9", "");
  if (list.length > 0) {
    for (i = 0; i < count; i++) {
      var value = entity.getData("skyhighheroes:dyn/scroll2_value") + i;
      var variableName = "skyhighheroes:dyn/scroll2_entry_" + i;
      var listEntry = ((list.length > value) ? list[value] : "");
      manager.setDataWithNotify(entity, variableName, (typeof listEntry === "string") ? listEntry : "");
    };
  };
};

function scrollDown(entity, manager, count, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list_total", list.length);
  var value = entity.getData("skyhighheroes:dyn/scroll_value");
  if ((list.length - count) > value) {
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value") + 1);
  };
};

function scrollDown2(entity, manager, count, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list2_total", list.length);
  var value = entity.getData("skyhighheroes:dyn/scroll2_value");
  if ((list.length - count) > value) {
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll2_value", entity.getData("skyhighheroes:dyn/scroll2_value") + 1);
  };
};

function scrollUp(entity, manager, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list_total", list.length);
  var value = entity.getData("skyhighheroes:dyn/scroll_value");
  if (value > 0) {
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value") - 1);
  };
};

function scrollUp2(entity, manager, list) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/list_total", list.length);
  var value = entity.getData("skyhighheroes:dyn/scroll_value");
  if (value > 0) {
    manager.setDataWithNotify(entity, "skyhighheroes:dyn/scroll_value", entity.getData("skyhighheroes:dyn/scroll_value") - 1);
  };
};

function setButton(entity, manager, button) {
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/prev_selected_button", entity.getData("skyhighheroes:dyn/selected_button"));
  manager.setDataWithNotify(entity, "skyhighheroes:dyn/selected_button", button);
};

var defaultButtons = [
  {
    buttonID: "main_overview",
    borderingButtons: {
      top: "main_chat",
      bottom: "main_rockets_wings",
    },
    properties: {
      confirmAction: (entity, manager) => {
        setMenu(entity, manager, "overview");
        setButton(entity, manager, "system_core_open");
      },
      backAction: (entity, manager) => {
        manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
      }
    }
  },
   {
    buttonID: "main_chat",
    borderingButtons: {
      top: "main_waypoints",
      bottom: "main_overview",
    },
    properties: {
      confirmAction: (entity, manager) => {
        systemMessage(entity, "Not available yet!");
      },
      backAction: (entity, manager) => {
        manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
      }
    }
  }
];

var defaultMenus = {
};

var onSleepActions = [];

var onWakeActions = [];

/**
 * Initializes cyber system
 * @param {object} moduleList - cyber system modules
 * @param {string} name - Name of the cybernetic being
 * @param {string} colorCode - Color to set system thing to
 **/
function initSystem(moduleList, name, colorCode) {
  var sneakMultiTap = initMultiTap("skyhighheroes:dyn/sneak");
  var maskMultiTap = initMultiTap("skyhighheroes:dyn/mask");
  var punchMultiTap = initMultiTap("skyhighheroes:dyn/punch");
  var selectedSideMultiTap = initMultiTap("skyhighheroes:dyn/hud_selected_side");
  var cyberInstance = this;
  //Type 1 - commands (can have data management)
  /** @var type1Specs - Type 1 Specs */
  var type1Specs = ["command", "commandHandler", "helpMessage"];
  //Type 2 - messaging only
  /** @var type2Specs - Type 2 Specs */
  var type2Specs = ["messageHandler", "chatModeInfo", "chatInfo", "modeID"];
  //Type 3 - commands messaging and data management
  /** @var type3Specs - Type 3 Specs */
  var type3Specs = ["command", "messageHandler", "commandHandler", "chatModeInfo", "chatInfo", "helpMessage", "modeID"];
  //Type 11 - commands (can have data management) with disabled thing
  /** @var type11Specs - Type 11 Specs */
  var type11Specs = ["command", "commandHandler", "helpMessage", "whenDisabled"];
  //Type 12 - cyber module
  /** @var type12Specs - Type 12 Specs */
  var type12Specs = ["command", "commandHandler", "helpMessage", "isModifierEnabled", "whenDisabled"];
  //Type 13 - cyber module
  /** @var type13Specs - Type 13 Specs */
  var type13Specs = ["command", "commandHandler", "helpMessage", "keyBinds", "isKeyBindEnabled", "isModifierEnabled", "whenDisabled"];
  //Type 14 - cyber module
  /** @var type14Specs - Type 14 Specs */
  var type14Specs = ["command", "commandHandler", "helpMessage", "keyBinds", "isKeyBindEnabled", "isModifierEnabled", "initAttributeProfiles", "initDamageProfiles", "getAttributeProfile", "getDamageProfile", "whenDisabled"];
  /** @var modules - Array of modules */
  var modules = [];
  /** @var moduleNames - Module names */
  var moduleNames = [];
  /** @var cyberneticModules - Cyber module names */
  var cyberneticModules = [];
  /** @var normalModules - Normal module names */
  var normalModules = [];
  /** @var commands - Command prefixes */
  var commands = [];
  /** @var commandIndexes - Indexes of command handlers */
  var commandIndexes = [];
  /** @var messagingIndexes - Indexes of messaging handlers */
  var messagingIndexes = [];
  /** @var mainButtons - Main buttons */
  var mainButtons = [];
  /** @var buttonBorders - Button borders */
  var buttonBorders = [];
  /** @var menuIDs - Menu IDs */
  var menuIDs = [];
  /** @var parentMenuIDs - Parent menu IDs */
  var parentMenuIDs = [];
  /** @var prevButtons - Previous button IDs */
  var prevButtons = [];
  /** @var buttonIDs - Button IDs */
  var buttonIDs = [];
  /** @var buttonProperties - Button properties */
  var buttonProperties = [];
  /** @var tempOverviewButtons - Temp overview buttons */
  var tempOverviewButtons = [];
  /** @var chatModes - Chat modes */
  var chatModes = [];
  /** @var modifierIndexes - Indexes of modifier capable modules */
  var modifierIndexes = [];
  /** @var keyBindIndexes - Indexes of keybind capable modules */
  var keyBindIndexes = [];
  /** @var attributeProfileIndexes - Indexes of attribute profile capable modules */
  var attributeProfileIndexes = [];
  /** @var damageProfileIndexes - Indexes of damage profile capable modules */
  var damageProfileIndexes = [];
  /** @var tickHandlerIndexes - Indexes of tick handler capable modules */
  var tickHandlerIndexes = [];
  /** @var onInitSystemIndexes - Indexes of system init capable modules */
  var onInitSystemIndexes = [];
  /** @var fightOrFlightIndexes - Indexes of fight or flight capable modules */
  var fightOrFlightIndexes = [];
  /** @var armHandlerIndexes - Indexes of arming capable modules */
  var armHandlerIndexes = [];
  /** @var disarmHandlerIndexes - Indexes of disarming capable modules */
  var disarmHandlerIndexes = [];
  /** @var onChargingStartIndexes - Indexes of on charging start capable modules */
  var onChargingStartIndexes = [];
  /** @var onChargingStopIndexes - Indexes of on charging stop capable modules */
  var onChargingStopIndexes = [];
  /** @var onSleepIndexes - Indexes of on sleep capable modules */
  var onSleepIndexes = [];
  /** @var onWakeIndexes - Indexes of on wake capable modules */
  var onWakeIndexes = [];
  /** @var cyberModelID - cyber model name */
  var cyberModelID = formatModel(name) + "-" + colorCode;
  /** @var cyberName - cyber name */
  var cyberName = name;
  /** @var color - Color */
  var color = colorCode;
  var hasError = false;
  var errors = [];
  logMessage("Attempting to initialize " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on cybernetic body " + cyberName + "!");
  defaultButtons.forEach(button => {
    mainButtons.push(button);
  });
  moduleList.forEach(module => {
    if (module.hasOwnProperty("initModule")) {
      var moduleInit = module.initModule(cyberInstance);
      if ((moduleInit.hasOwnProperty("type")) ? typeof moduleInit.type === "number" : false) {
        switch (moduleInit.type) {
          case 1:
            type1Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              commandIndexes.push(modules.length-1);
              normalModules.push(moduleInit.name);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                var buttons = moduleInit.cyberOverviewButtons;
                var buttonIDList = Object.keys(buttons);
                buttonIDList.forEach(buttonID => {
                  var button = buttons[buttonID];
                  buttonIDs.push(buttonID);
                  buttonProperties.push(button.properties);
                  buttonBorders.push(button.borderingButtons);
                  logMessage("Added button \"" + buttonID + "\" to menu \"overview\"!");
                });
              };
            };
            hasError = false;
            break;
          case 2:
            type2Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              chatModes.push(moduleInit.modeID);
              messagingIndexes.push(modules.length-1);
              normalModules.push(moduleInit.name);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          case 3:
            type3Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              chatModes.push(moduleInit.modeID);
              commandIndexes.push(modules.length-1);
              messagingIndexes.push(modules.length-1);
              normalModules.push(moduleInit.name);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          case 11:
            type11Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              commandIndexes.push(modules.length-1);
              cyberneticModules.push(moduleInit.name);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("tickHandler")) {
                tickHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"tickHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("fightOrFlight")) {
                fightOrFlightIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"fightOrFlight\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStart")) {
                onChargingStartIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStart\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStop")) {
                onChargingStopIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStop\"!");
              };
              if (moduleInit.hasOwnProperty("onSleep")) {
                onSleepIndexes.push(modules.length - 1);
                onSleepActions.push(moduleInit["onSleep"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onSleep\"!");
              };
              if (moduleInit.hasOwnProperty("onWake")) {
                onWakeIndexes.push(modules.length - 1);
                onWakeActions.push(moduleInit["onWake"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onWake\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          case 12:
            type12Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              commandIndexes.push(modules.length-1);
              cyberneticModules.push(moduleInit.name);
              modifierIndexes.push(modules.length-1);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("tickHandler")) {
                tickHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"tickHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("fightOrFlight")) {
                fightOrFlightIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"fightOrFlight\"!");
              };
              if (moduleInit.hasOwnProperty("armHandler")) {
                armHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"armHandler\"!");
              };
              if (moduleInit.hasOwnProperty("disarmHandler")) {
                disarmHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"disarmHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStart")) {
                onChargingStartIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStart\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStop")) {
                onChargingStopIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStop\"!");
              };
              if (moduleInit.hasOwnProperty("onSleep")) {
                onSleepIndexes.push(modules.length - 1);
                onSleepActions.push(moduleInit["onSleep"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onSleep\"!");
              };
              if (moduleInit.hasOwnProperty("onWake")) {
                onWakeIndexes.push(modules.length - 1);
                onWakeActions.push(moduleInit["onWake"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onWake\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          case 13:
            type13Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              commandIndexes.push(modules.length-1);
              cyberneticModules.push(moduleInit.name);
              keyBindIndexes.push(modules.length-1);
              modifierIndexes.push(modules.length-1);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("tickHandler")) {
                tickHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"tickHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("fightOrFlight")) {
                fightOrFlightIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"fightOrFlight\"!");
              };
              if (moduleInit.hasOwnProperty("armHandler")) {
                armHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"armHandler\"!");
              };
              if (moduleInit.hasOwnProperty("disarmHandler")) {
                disarmHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"disarmHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStart")) {
                onChargingStartIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStart\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStop")) {
                onChargingStopIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStop\"!");
              };
              if (moduleInit.hasOwnProperty("onSleep")) {
                onSleepIndexes.push(modules.length - 1);
                onSleepActions.push(moduleInit["onSleep"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onSleep\"!");
              };
              if (moduleInit.hasOwnProperty("onWake")) {
                onWakeIndexes.push(modules.length - 1);
                onWakeActions.push(moduleInit["onWake"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onWake\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to existing menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          case 14:
            type14Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              commands.push(moduleInit.command);
              commandIndexes.push(modules.length-1);
              cyberneticModules.push(moduleInit.name);
              attributeProfileIndexes.push(modules.length-1);
              damageProfileIndexes.push(modules.length-1);
              keyBindIndexes.push(modules.length-1);
              modifierIndexes.push(modules.length-1);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on cybernetic body " + cyberName + "!");
              if (moduleInit.hasOwnProperty("tickHandler")) {
                tickHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"tickHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("fightOrFlight")) {
                fightOrFlightIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"fightOrFlight\"!");
              };
              if (moduleInit.hasOwnProperty("armHandler")) {
                armHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"armHandler\"!");
              };
              if (moduleInit.hasOwnProperty("disarmHandler")) {
                disarmHandlerIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"disarmHandler\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStart")) {
                onChargingStartIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStart\"!");
              };
              if (moduleInit.hasOwnProperty("onChargingStop")) {
                onChargingStopIndexes.push(modules.length - 1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onChargingStop\"!");
              };
              if (moduleInit.hasOwnProperty("onSleep")) {
                onSleepIndexes.push(modules.length - 1);
                onSleepActions.push(moduleInit["onSleep"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onSleep\"!");
              };
              if (moduleInit.hasOwnProperty("onWake")) {
                onWakeIndexes.push(modules.length - 1);
                onWakeActions.push(moduleInit["onWake"]);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onWake\"!");
              };
              if (moduleInit.hasOwnProperty("cyberMainButton")) {
                var button = moduleInit.cyberMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("cyberMenus")) {
                var menuList = moduleInit.cyberMenus;
                var menuIDList = Object.keys(menuList);
                menuIDList.forEach(menuID => {
                  var menu = menuList[menuID];
                  if (menuIDs.indexOf(menuID) > -1) {
                    logMessage("Adding to menu: " + menuID);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  } else {
                    logMessage("Creating menu: " + menuID);
                    menuIDs.push(menuID);
                    parentMenuIDs.push(menu.parent);
                    prevButtons.push(menu.prevButton);
                    var buttons = menu.buttons;
                    var buttonIDList = Object.keys(buttons);
                    buttonIDList.forEach(buttonID => {
                      var button = buttons[buttonID];
                      buttonIDs.push(buttonID);
                      buttonProperties.push(button.properties);
                      buttonBorders.push(button.borderingButtons);
                      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
                    });
                  };
                });
              };
              if (moduleInit.hasOwnProperty("cyberOverviewButtons")) {
                tempOverviewButtons.push(moduleInit.cyberOverviewButtons);
              };
            };
            hasError = false;
            break;
          default:
            logMessage("Module at position " + moduleList.indexOf(module) + " does not have a valid type value!");
        };
      } else {
        logMessage("Module at position " + moduleList.indexOf(module) + " does not have a valid type value!");
      };
    } else {
      logMessage("Module at position " + moduleList.indexOf(module) + " cannot be initialized!");
    };
  });
  var defaultOverviewButtons = {
    "system_core_open": {
      borderingButtons: {
        top: "cannon_body_left_deploy",
        left: "wing_right_deploy",
        right: "wing_left_deploy",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/system_core_open", !entity.getData("skyhighheroes:dyn/system_core_open"));
          if (entity.getData("skyhighheroes:dyn/system_core_open")) {
            systemMessage(entity, "<n>Opening core!");
          } else {
            systemMessage(entity, "<n>Closing core!");
          };
        },
        backAction: (entity, manager) => {
          setButton(entity, manager, "main_overview");
          setMenu(entity, manager, "main");
        },
      }
    },
    "optics_enabled": {
      borderingButtons: {
        top: "antenna_deploy",
        bottom: "intake_head_left_open",
        left: "cannon_head_right_deploy",
        right: "cannon_head_left_deploy",
      },
      properties: {
        confirmAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/optics_enabled", !entity.getData("skyhighheroes:dyn/optics_enabled"));
          if (entity.getData("skyhighheroes:dyn/system_core_open")) {
            systemMessage(entity, "<n>Enabling optics!");
          } else {
            systemMessage(entity, "<n>Disabling optics!");
          };
        },
        backAction: (entity, manager) => {
          setButton(entity, manager, "main_overview");
          setMenu(entity, manager, "main");
        },
      }
    },
  };
  tempOverviewButtons.push(defaultOverviewButtons);
  var menuList = defaultMenus;
  var menuIDList = Object.keys(menuList);
  menuIDList.forEach(menuID => {
    logMessage("Creating menu: " + menuID);
    menuIDs.push(menuID);
    var menu = menuList[menuID];
    parentMenuIDs.push(menu.parent);
    prevButtons.push(menu.prevButton);
    var buttons = menu.buttons;
    var buttonIDList = Object.keys(buttons);
    buttonIDList.forEach(buttonID => {
      var button = buttons[buttonID];
      buttonIDs.push(buttonID);
      buttonProperties.push(button.properties);
      if (button.properties.hasOwnProperty("usesTelekinesis")) {
        telekinesisButtons.push(buttonID);
      };
      buttonBorders.push(button.borderingButtons);
      logMessage("Added button \"" + buttonID + "\" to menu \"" + menuID + "\"!");
    });
  });
  logMessage("Creating menu: overview");
  menuIDs.push("overview");
  parentMenuIDs.push("main");
  tempOverviewButtons.forEach(entry => {
    var buttons = entry;
    var buttonIDList = Object.keys(entry);
    buttonIDList.forEach(buttonID => {
      var button = buttons[buttonID];
      buttonIDs.push(buttonID);
      buttonProperties.push(button.properties);
      buttonBorders.push(button.borderingButtons);
      logMessage("Added button \"" + buttonID + "\" to menu \"overview\"!");
    });
  });
  tempOverviewButtons = [];
  logMessage("Creating menu: main");
  menuIDs.push("main");
  parentMenuIDs.push("main");
  mainButtons.forEach(button => {
    var buttonID = button.buttonID;
    if (buttonIDs.indexOf(buttonID) == -1) {
      buttonIDs.push(button.buttonID);
      buttonProperties.push(button.properties);
      buttonBorders.push(button.borderingButtons);
      logMessage("Added button \"" + button.buttonID + "\" to menu \"main\"!");
    };
  });
  logMessage("Successfully initialized " + modules.length + " out of " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on " + cyberName + "!");
  function switchChatModes(entity, manager, mode) {
    var nbt = mainNBT(entity);
    var chatMode = chatModes.indexOf(mode);
    if (chatMode > -1) {
      var chatModule = modules[messagingIndexes[chatMode]];
      manager.setData(entity, "skyhighheroes:dyn/chat_mode", chatModule.modeID);
      manager.setString(nbt, "chatMode", chatModule.modeID);
      systemMessage(entity, chatModule.chatModeMessage);
      chatModule.chatModeInfo(entity);
    } else {
      systemMessage(entity, "<n>Unable to find <nh>" + mode + "<n> chat mode!");
    };
  };
  function switchChats(entity, manager, chat) {
    var modeID = entity.getData("skyhighheroes:dyn/chat_mode");
    var chatMode = chatModes.indexOf(modeID);
    modules[messagingIndexes[chatMode]].chatInfo(entity, manager, chat);
  };
  function systemInfo(entity) {
    var normalModulesMessage = (normalModules.length > 1) ? "<n>Loaded " + normalModules.length + " modules: " : "<n>Loaded " + normalModules.length + " module: ";
    normalModules.forEach(moduleName => {
      if (normalModules.indexOf(moduleName) == 0) {
        normalModulesMessage = normalModulesMessage + ((isModuleDisabled(entity, moduleName))?"<eh>":"<nh>") + moduleName;
      } else {
        normalModulesMessage = normalModulesMessage + ((isModuleDisabled(entity, moduleName))?"<n>, <eh>":"<n>, <nh>") + moduleName;
      };
    });
    var cyberneticModulesMessage = (cyberneticModules.length > 1) ? "<n>Loaded " + cyberneticModules.length + " cybernetic systems: " : "<n>Loaded " + cyberneticModules.length + " cyber system: ";
    cyberneticModules.forEach(moduleName => {
      if (cyberneticModules.indexOf(moduleName) == 0) {
        cyberneticModulesMessage = cyberneticModulesMessage + ((isModuleDisabled(entity, moduleName))?"<eh>":"<nh>") + moduleName;
      } else {
        cyberneticModulesMessage = cyberneticModulesMessage + ((isModuleDisabled(entity, moduleName))?"<n>, <eh>":"<n>, <nh>") + moduleName;
      };
    });
    systemMessage(entity, "<n>cyberOS");
    systemMessage(entity, normalModulesMessage);
    systemMessage(entity, cyberneticModulesMessage);
    systemMessage(entity, "<n>computerID: <nh>" + mainNBT(entity).getString("computerID"));
    systemMessage(entity, "<n>Model: <nh>" + getModelID(entity));
  };
  function status(entity) {
    var date = new Date();
    systemMessage(entity, "<n>Date: <nh>" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear());
    systemMessage(entity, "<n>Time: <nh>" + date.getHours() + ":" + ((date.getMinutes() > 9) ? date.getMinutes() : "0"+date.getMinutes()));
    systemMessage(entity, "<n>Current location: <nh>" + entity.posX().toFixed(0) + "<n>, <nh>" + entity.posY().toFixed(0) + "<n>, <nh>" + entity.posZ().toFixed(0));
    systemMessage(entity, "<n>Biome: <nh>" + entity.world().getLocation(entity.pos()).biome());
    systemMessage(entity, "<n>Do <nh>!help<n> for available commands!");
  };
  function startCharging(entity, manager) {
    systemMessage(entity, "Starting charging!");
    manager.setData(entity, "skyhighheroes:dyn/charging", true);
    manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", false);
    manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", true);
    manager.setData(entity, "skyhighheroes:dyn/night_vision", false);
    manager.setData(entity, "skyhighheroes:dyn/optics_enabled", false);
    onChargingStartIndexes.forEach(index => {
      modules[index].onChargingStart(entity, manager);
    });
  };
  function stopCharging(entity, manager) {
    systemMessage(entity, "Stopped charging!");
    var nbt = mainNBT(entity);
    manager.setData(entity, "skyhighheroes:dyn/charging", false);
    manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
    manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", nbt.getBoolean("statueMode"));
    manager.setData(entity, "skyhighheroes:dyn/night_vision", nbt.getBoolean("nightVision"));
    manager.setData(entity, "skyhighheroes:dyn/optics_enabled", true);
    onChargingStopIndexes.forEach(index => {
      modules[index].onChargingStop(entity, manager);
    });
  };
  function confirmAction(entity, manager) {
    var selectedButton = entity.getData("skyhighheroes:dyn/selected_button");
    var buttonIndex = buttonIDs.indexOf(selectedButton);
    if (buttonIndex > -1) {
      var properties = buttonProperties[buttonIndex];
      if (properties.hasOwnProperty("confirmAction")) {
        properties.confirmAction(entity, manager);
      };
    };
  };
  function backAction(entity, manager) {
    var selectedButton = entity.getData("skyhighheroes:dyn/selected_button");
    var buttonIndex = buttonIDs.indexOf(selectedButton);
    if (buttonIndex > -1) {
      var properties = buttonProperties[buttonIndex];
      if (properties.hasOwnProperty("backAction")) {
        properties.backAction(entity, manager);
      } else {
        var currentMenu = entity.getData("skyhighheroes:dyn/current_menu");
        var menuIndex = menuIDs.indexOf(currentMenu);
        if (menuIndex > -1) {
          var newMenu = parentMenuIDs[menuIndex];
          setMenu(entity, manager, newMenu);
          if (currentMenu != "main") {
            var prevButton = prevButtons[menuIndex];
            setButton(entity, manager, prevButton);
          };
        };
      };
    };
  };
  function hasTextAction(entity, manager) {
    var selectedButton = entity.getData("skyhighheroes:dyn/selected_button");
    var buttonIndex = buttonIDs.indexOf(selectedButton);
    if (buttonIndex > -1) {
      var properties = buttonProperties[buttonIndex];
      if (properties.hasOwnProperty("textAction")) {
        return true;
      };
    };
    return false;
  };
  function textAction(entity, manager, entry) {
    var selectedButton = entity.getData("skyhighheroes:dyn/selected_button");
    var buttonIndex = buttonIDs.indexOf(selectedButton);
    if (buttonIndex > -1) {
      var properties = buttonProperties[buttonIndex];
      if (properties.hasOwnProperty("textAction")) {
        properties.textAction(entity, manager, entry);
      };
    };
  };
  /**
   * Silently enables module
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {integer} moduleName - Name of module to enable
   **/
  function silentEnableModule(entity, manager, moduleName) {
    if (moduleNames.indexOf(moduleName) > -1) {
      if (!mainNBT(entity).hasKey("disabledModules")) {
      } else {
        var disabledModules = mainNBT(entity).getStringList("disabledModules");
        if (disabledModules.tagCount() == 0) {
        } else {
          var index = getStringArray(disabledModules).indexOf(moduleName);
          if (index < 0) {
          } else {
            manager.removeTag(disabledModules, index);
          };
        };
      };
    };
  };
  /**
   * Enables module
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   * @param {Array} moduleList - List of available module names
   * @param {integer} moduleName - Name of module to enable
   **/
  function enableModule(entity, manager, moduleName) {
    if (moduleNames.indexOf(moduleName) > -1) {
      if (!mainNBT(entity).hasKey("disabledModules")) {
        systemMessage(entity, "<e>You have no disabled modules to enable!");
      } else {
        var disabledModules = mainNBT(entity).getStringList("disabledModules");
        if (disabledModules.tagCount() == 0) {
          systemMessage(entity, "<e>You have no disabled modules to enable!");
        } else {
          var index = getStringArray(disabledModules).indexOf(moduleName);
          if (index < 0) {
            systemMessage(entity, "<e>Module <eh>" + moduleName + "<e> is already enabled!");
          } else {
            systemMessage(entity, "<s>Successfully enabled <sh>" + moduleName + "<s> module!");
            manager.removeTag(disabledModules, index);
          };
        };
      };
    } else {
      systemMessage(entity, "<e>Unknown module of name <eh>" + moduleName + "<e>!");
    };
  };
  function disableModule(entity, manager, moduleName) {
    var moduleIndex = moduleNames.indexOf(moduleName);
    if (moduleIndex > -1) {
      if (!mainNBT(entity).hasKey("disabledModules")) {
        var disabledModules = manager.newTagList();
        manager.appendString(disabledModules, moduleName);
        manager.setTagList(mainNBT(entity), "disabledModules", disabledModules);
        systemMessage(entity, "<s>Module <sh>" + moduleName + "<s> disabled!");
      } else {
        var disabledModules = mainNBT(entity).getStringList("disabledModules");
        var disabledModulesIndex = getStringArray(disabledModules).indexOf(moduleName);
        if (disabledModulesIndex > -1) {
          systemMessage(entity, "<e>You have already disabled module <eh>" + moduleName + "<e>!");
        } else {
          systemMessage(entity, "<s>Module <sh>" + moduleName + "<s> disabled!");
          manager.appendString(disabledModules, moduleName);
          if (modules[moduleIndex].hasOwnProperty("whenDisabled")) {
            modules[moduleIndex].whenDisabled(entity, manager);
          };
        };
      };
    } else {
      systemMessage(entity, "<e>Unknown module of name <eh>" + moduleName + "<e>!");
    };
  };
  /**
   * Modifier enabled stuff for cybernetics
   * @param {JSEntity} entity - Required
   * @param {string} modifier - Required
   **/
  function cyberneticModifierEnabled(entity, modifier) {
    if ((modifier.name() == "fiskheroes:transformation") && (modifier.id() == "interface")) {
      return true;
    };
    if (entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") > 0) {
      return false;
    };
    if (modifier.name() == "fiskheroes:shape_shifting") {
      return true;
    };
    if (modifier.name() == "fiskheroes:potion_immunity") {
      return entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0;
    };
    if (modifier.name() == "fiskheroes:regeneration") {
      return true;
    };
    if (modifier.name() == "fiskheroes:healing_factor") {
      return true;
    };
    if (modifier.name() == "fiskheroes:water_breathing") {
      return true;
    };
    if (modifier.name() == "fiskheroes:fire_immunity") {
      return entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0;
    };
    if (modifier.name() == "fiskheroes:damage_immunity") {
      return entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0;
    };
    if (modifier.name() == "fiskheroes:projectile_immunity") {
      return entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0;
    };
    if (modifier.name() == "fiskheroes:transformation") {
      return true;
    };
    if (modifier.name() == "fiskheroes:metal_skin") {
      return entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0 && entity.getData("fiskheroes:metal_heat") < 1.0;
    };
    if (modifierIndexes.length == 1) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 2) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 3) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 4) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 5) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 6) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 7) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 8) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 9) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 10) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 11) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 12) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[11]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 13) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[11]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[12]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 14) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[11]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[12]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[13]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length == 15) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[11]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[12]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[13]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[14]].isModifierEnabled(entity, modifier);
    };
    if (modifierIndexes.length >= 16) {
      return modules[modifierIndexes[0]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[1]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[2]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[3]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[4]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[5]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[6]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[7]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[8]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[9]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[10]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[11]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[12]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[13]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[14]].isModifierEnabled(entity, modifier) || modules[modifierIndexes[15]].isModifierEnabled(entity, modifier);
    };
  };
  /**
   * Power stuff
   * @param {JSHero} hero - Required
   **/
  function addPowers(hero) {
    var name = formatAlias(cyberName);
    var hud = "skyhighheroes:" + name + "_hud";
    hero.addPowers("skyhighheroes:cybernetic_os", "skyhighheroes:cybernetic_body", hud);
  };
  /**
   * Basic keybinds
   * @param {JSHero} hero - Required
   **/
  function keyBinds(hero) {
    hero.addKeyBindFunc("BYPASS", (entity, manager) => {
      var nbt = mainNBT(entity);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/optics_enabled", true);
      manager.setBoolean(nbt, "bodyLights", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_body_lights", false);
      manager.setBoolean(nbt, "convertedToCyber", true);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/converted_cyber", true);
      manager.setBoolean(nbt, "disguiseClothing", true);
      manager.setData(entity, "skyhighheroes:dyn/thermoptic_disguise_clothing", true);
      manager.setData(entity, "skyhighheroes:dyn/thermoptic_disguise", true);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion_timer", 0.0);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion_sleep", false);
      return true;
    }, "Bypass Cybernetic Conversion", 5);
    hero.addKeyBindFunc("WAKE_UP", (entity, manager) => {
      var nbt = mainNBT(entity);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/optics_enabled", true);
      manager.setBoolean(nbt, "bodyLights", true);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_body_lights", true);
      manager.setBoolean(nbt, "convertedToCyber", true);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/converted_cyber", true);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion", false);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion_timer", 0.0);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_conversion_sleep", false);
      return true;
    }, "Wake Up", 4);
    hero.addKeyBindFunc("BATTLE_MODE", (entity, manager) => {
      manager.setData(entity, "skyhighheroes:dyn/battle_mode", !entity.getData("skyhighheroes:dyn/battle_mode"));
      if (!entity.getData("skyhighheroes:dyn/battle_mode")) {
        manager.setData(entity, "skyhighheroes:dyn/external_arms", false);
      };
      return true;
    }, "\u00A7" + color + "Toggle Battle Mode", 5);
    hero.addKeyBind("SHAPE_SHIFT", "\u00A7" + color + "Enter command/value", 2);
    hero.addKeyBind("INTERFACE", "\u00A7" + color + "Open/Close Interface", 5);
    hero.addKeyBindFunc("START_CHARGING", (entity, manager) => {
      startCharging(entity, manager);
      return true;
    }, "\u00A7" + color + "Start Charging", 3);
    hero.addKeyBindFunc("STOP_CHARGING", (entity, manager) => {
      stopCharging(entity, manager);
      return true;
    }, "\u00A7" + color + "Stop Charging", 4);
    hero.addKeyBindFunc("CONFIRM", (entity, manager) => {
      confirmAction(entity, manager);
      return true;
    }, "\u00A7" + color + "Confirm", 1);
    hero.addKeyBindFunc("BACK", (entity, manager) => {
      backAction(entity, manager);
      return true;
    }, "\u00A7" + color + "Back", 3);
    modules.forEach(module => {
      if (module.hasOwnProperty("keyBinds")) {
        module.keyBinds(hero, color);
      };
    });
  };
  /**
   * Attribute profile stuff for cybernetics
   * @param {JSEntity} entity - Required
   * @returns attribute profile
   **/
  function cyberneticAttributeProfile(entity) {
    var result = null;
    if (entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") > 0) {
      result = "SHUT_DOWN";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_interface") && entity.getData("skyhighheroes:dyn/charging_timer") == 0 && entity.getData("skyhighheroes:dyn/cybernetic_sleep_timer") == 0) {
      result = "INTERFACE";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_sleep_timer") == 1) {
      result = "SLEEPING";
    };
    if (entity.getData("skyhighheroes:dyn/charging_timer") > 0) {
      result = "CHARGING";
    };
    if (attributeProfileIndexes.length == 1) {
      if (typeof modules[attributeProfileIndexes[0]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[0]].getAttributeProfile(entity);
      };
    };
    if (attributeProfileIndexes.length == 2) {
      if (typeof modules[attributeProfileIndexes[0]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[0]].getAttributeProfile(entity);
      };
      if (typeof modules[attributeProfileIndexes[1]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[1]].getAttributeProfile(entity);
      };
    };
    if (attributeProfileIndexes.length >= 3) {
      if (typeof modules[attributeProfileIndexes[0]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[0]].getAttributeProfile(entity);
      };
      if (typeof modules[attributeProfileIndexes[1]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[1]].getAttributeProfile(entity);
      };
      if (typeof modules[attributeProfileIndexes[2]].getAttributeProfile(entity) === "string") {
        result = modules[attributeProfileIndexes[2]].getAttributeProfile(entity);
      };
    };
    return result;
  };
  /**
   * Damage profile stuff for cybernetics
   * @param {JSEntity} entity - Required
   * @returns damage profile
   **/
  function cyberneticDamageProfile(entity) {
    var result = null;
    if (entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") > 0) {
      result = null;
    };
    if (damageProfileIndexes.length == 1) {
      if (typeof modules[damageProfileIndexes[0]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[0]].getDamageProfile(entity);
      };
    };
    if (damageProfileIndexes.length == 2) {
      if (typeof modules[damageProfileIndexes[0]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[0]].getDamageProfile(entity);
      };
      if (typeof modules[damageProfileIndexes[1]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[1]].getDamageProfile(entity);
      };
    };
    if (damageProfileIndexes.length >= 3) {
      if (typeof modules[damageProfileIndexes[0]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[0]].getDamageProfile(entity);
      };
      if (typeof modules[damageProfileIndexes[1]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[1]].getDamageProfile(entity);
      };
      if (typeof modules[damageProfileIndexes[2]].getDamageProfile(entity) === "string") {
        result = modules[damageProfileIndexes[2]].getDamageProfile(entity);
      };
    };
    return result;
  };
  function initProfiles(hero) {
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 1.0, 1);
    hero.addAttribute("ARROW_DAMAGE", 1.0, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.99, 1);
    hero.addAttribute("REACH_DISTANCE", 5.0, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 50.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttributeProfile("INTERFACE", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.75, 1);
      profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    });
    hero.addAttributeProfile("SHUT_DOWN", function (profile) {
      profile.addAttribute("BASE_SPEED", -1.0, 1);
      profile.addAttribute("SPRINT_SPEED", -1.0, 1);
      profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
      profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
      profile.addAttribute("STEP_HEIGHT", -1.0, 1);
      profile.addAttribute("KNOCKBACK", -1.0, 1);
      profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
    });
    hero.addAttributeProfile("CHARGING", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.9, 1);
      profile.addAttribute("SPRINT_SPEED", -1.0, 1);
      profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
      profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
      profile.addAttribute("STEP_HEIGHT", -1.0, 1);
      profile.addAttribute("KNOCKBACK", -1.0, 1);
      profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
    });
    hero.addAttributeProfile("SLEEPING", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.9, 1);
      profile.addAttribute("SPRINT_SPEED", -1.0, 1);
      profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
      profile.addAttribute("STEP_HEIGHT", -1.0, 1);
    });
    hero.addAttributeProfile("BEFORE_CONVERSION", function (profile) {
    });
    hero.addAttributeProfile("CONVERSION_1", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.05, 1);
      profile.addAttribute("SPRINT_SPEED", -0.05, 1);
      profile.addAttribute("WEAPON_DAMAGE", -0.05, 1);
      profile.addAttribute("JUMP_HEIGHT", -0.05, 1);
      profile.addAttribute("STEP_HEIGHT", -0.05, 1);
      profile.addAttribute("KNOCKBACK", -0.05, 1);
      profile.addAttribute("PUNCH_DAMAGE", -0.05, 1);
    });
    hero.addAttributeProfile("CONVERSION_2", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.1, 1);
      profile.addAttribute("SPRINT_SPEED", -0.1, 1);
      profile.addAttribute("WEAPON_DAMAGE", -0.1, 1);
      profile.addAttribute("JUMP_HEIGHT", -0.1, 1);
      profile.addAttribute("STEP_HEIGHT", -0.1, 1);
      profile.addAttribute("KNOCKBACK", -0.1, 1);
      profile.addAttribute("PUNCH_DAMAGE", -0.1, 1);
    });
    hero.addAttributeProfile("CONVERSION_3", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.25, 1);
      profile.addAttribute("SPRINT_SPEED", -0.25, 1);
      profile.addAttribute("WEAPON_DAMAGE", -0.25, 1);
      profile.addAttribute("JUMP_HEIGHT", -0.25, 1);
      profile.addAttribute("STEP_HEIGHT", -0.25, 1);
      profile.addAttribute("KNOCKBACK", -0.25, 1);
      profile.addAttribute("PUNCH_DAMAGE", -0.25, 1);
    });
    hero.addAttributeProfile("CONVERSION_4", function (profile) {
      profile.addAttribute("BASE_SPEED", -0.6, 1);
      profile.addAttribute("SPRINT_SPEED", -0.6, 1);
      profile.addAttribute("WEAPON_DAMAGE", -0.6, 1);
      profile.addAttribute("JUMP_HEIGHT", -0.6, 1);
      profile.addAttribute("STEP_HEIGHT", -0.6, 1);
      profile.addAttribute("KNOCKBACK", -0.6, 1);
      profile.addAttribute("PUNCH_DAMAGE", -0.6, 1);
    });
    hero.addAttributeProfile("CONVERSION_5", function (profile) {
      profile.addAttribute("BASE_SPEED", -1.0, 1);
      profile.addAttribute("SPRINT_SPEED", -1.0, 1);
      profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
      profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
      profile.addAttribute("STEP_HEIGHT", -1.0, 1);
      profile.addAttribute("KNOCKBACK", -1.0, 1);
      profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
    });
    damageProfileIndexes.forEach(index => {
      hero.addDamageProfile("CONVERSION", {
        "types": {
          "CYBERNETIC_CONVERSION": 1.0
        }
      });
      modules[index].initDamageProfiles(hero);
    });
    attributeProfileIndexes.forEach(index => {
      modules[index].initAttributeProfiles(hero);
    });
  };
  /**
   * Keybind enabled stuff for cybernetics
   * @param {JSEntity} entity - Required
   * @param {string} keyBind - Required
   **/
  function cyberneticKeyBindEnabled(entity, keyBind) {
    if (entity.getData("skyhighheroes:dyn/charging_timer") == 0) {
      if (keyBind == "START_CHARGING") {
        return (entity.getData("skyhighheroes:dyn/charging_timer") == 0) && onChargingBlock(entity) && !entity.getData("skyhighheroes:dyn/cybernetic_interface");
      };
      if (keyBind == "INTERFACE") {
        return (entity.getData("skyhighheroes:dyn/cybernetic_interface")) ? true : !entity.isSneaking();
      };
      if (entity.getData("skyhighheroes:dyn/cybernetic_interface_timer") == 0) {
        if (keyBind == "BATTLE_MODE") {
          return entity.isSneaking();
        };
        if (keyBindIndexes.length == 1) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 2) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 3) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 4) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 5) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 6) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 7) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 8) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 9) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 10) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 11) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 12) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[11]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 13) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[11]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[12]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 14) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[11]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[12]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[13]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length == 15) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[11]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[12]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[13]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[14]].isKeyBindEnabled(entity, keyBind);
        };
        if (keyBindIndexes.length >= 16) {
          return modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[9]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[10]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[11]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[12]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[13]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[14]].isKeyBindEnabled(entity, keyBind) || modules[keyBindIndexes[15]].isKeyBindEnabled(entity, keyBind);
        };
      } else {
        if (keyBind == "SHAPE_SHIFT" || keyBind == "CONFIRM" || keyBind == "BACK") {
          return entity.getData("skyhighheroes:dyn/cybernetic_interface_timer") == 1;
        } else {
          return false;
        };
      };
    } else {
      if (keyBind == "STOP_CHARGING") {
        return (entity.getData("skyhighheroes:dyn/charging_timer") == 1) && onChargingBlock(entity);
      };
      if (keyBind == "INTERFACE") {
        return true;
      };
      if (keyBind == "SHAPE_SHIFT" || keyBind == "CONFIRM" || keyBind == "BACK") {
        return entity.getData("skyhighheroes:dyn/cybernetic_interface_timer") == 1;
      } else {
        return false;
      };
    };
  };
  /**
   * Tick handler for cybernetics
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function cyberneticsHandler(entity, manager) {
    var nbt = mainNBT(entity);
    if ((!entity.getDataOrDefault("skyhighheroes:dyn/system_init", true))) {
      if (entity.getData("skyhighheroes:dyn/selected_button") == "") {
        setButton(entity, manager, "main_overview");
      };
      if (entity.getData("skyhighheroes:dyn/current_menu") == "") {
        setMenu(entity, manager, "main");
      };
      manager.setData(entity, "skyhighheroes:dyn/optics_enabled", true);
      manager.setBoolean(nbt, "Unbreakable", true);
      assignID(entity, manager);
      manager.setString(nbt, "cyberModelID", cyberModelID);
      manager.setData(entity, "skyhighheroes:dyn/model_id", nbt.getString("cyberModelID"));
      manager.setString(nbt, "cyberAliasName", cyberName);
      manager.setData(entity, "skyhighheroes:dyn/alias", nbt.getString("cyberAliasName"));
      if (!nbt.hasKey("hudSelectedSide")) {
        manager.setInteger(nbt, "hudSelectedSide", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_selected_side", nbt.getInteger("hudSelectedSide"));
      if (!nbt.hasKey("hudLeftSide")) {
        manager.setInteger(nbt, "hudLeftSide", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_side_left", nbt.getInteger("hudLeftSide"));
      if (!nbt.hasKey("hudTopSide")) {
        manager.setInteger(nbt, "hudTopSide", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_side_top", nbt.getInteger("hudTopSide"));
      if (!nbt.hasKey("hudRightSide")) {
        manager.setInteger(nbt, "hudRightSide", 0);
      };
      manager.setData(entity, "skyhighheroes:dyn/hud_side_right", nbt.getInteger("hudRightSide"));
      if (!nbt.hasKey("chatMode")) {
        manager.setString(nbt, "chatMode", "");
      };
      manager.setData(entity, "skyhighheroes:dyn/chat_mode", nbt.getString("chatMode"));
      if (!nbt.hasKey("trackedWaypoint")) {
        manager.setString(nbt, "trackedWaypoint", "");
      };
      manager.setData(entity, "skyhighheroes:dyn/tracked_waypoint", nbt.getString("trackedWaypoint"));
      if (!nbt.hasKey("energy")) {
        manager.setDouble(nbt, "energy", energyConfig.maxEnergy);
      };
      if (nbt.getDouble("energy") > energyConfig.maxEnergy) {
        manager.setDouble(nbt, "energy", energyConfig.maxEnergy);
      };
      manager.setData(entity, "skyhighheroes:dyn/energy", nbt.getDouble("energy"));
      var hexColor = hexColors[getModelID(entity)];
      manager.setString(nbt, "hudColorSkyHigh", hexColor);
      manager.setData(entity, "skyhighheroes:dyn/color", color);
      onInitSystemIndexes.forEach(index => {
        var module = modules[index];
        module.onInitSystem(entity, manager);
      });
      manager.setData(entity, "skyhighheroes:dyn/system_init", true);
      manager.setData(entity, "fiskheroes:penetrate_martian_invis", false);
    };
    if ((Math.floor(entity.getHealth()) <= entity.getData("skyhighheroes:dyn/fight_or_flight_min_health")) && (entity.getData("fiskheroes:time_since_damaged") <= entity.getData("skyhighheroes:dyn/fight_or_flight_duration"))) {
      if (!entity.getDataOrDefault("skyhighheroes:dyn/fight_or_flight", true)) {
        systemMessage(entity, "<n>FIGHT OR FLIGHT MODE ACTIVATED!");
        manager.setData(entity, "skyhighheroes:dyn/fight_or_flight", true);
      };
      manager.setData(entity, "skyhighheroes:dyn/system_core_open", false);
      fightOrFlightIndexes.forEach(index => {
        var module = modules[index];
        silentEnableModule(entity, manager, module.name);
        module.fightOrFlight(entity, manager);
      });
      if (entity.getData("fiskheroes:time_since_damaged") == entity.getData("skyhighheroes:dyn/fight_or_flight_duration")) {
        systemMessage(entity, "<n>FIGHT OR FLIGHT MODE DEACTIVATED!");
      };
    } else {
      manager.setData(entity, "skyhighheroes:dyn/fight_or_flight", false);
    };
    if (entity.getDataOrDefault("skyhighheroes:dyn/system_init", false)) {
      if (typeof entity.getData("fiskheroes:disguise") === "string") {
        if (!((entity.getData("fiskheroes:disguise") == getAliasName(entity) || entity.getData("fiskheroes:disguise") == getModelID(entity)) || entity.getData("fiskheroes:disguise") == null)) {
          if (entity.getData("skyhighheroes:dyn/thermoptic_disguise_timer") == 1) {
            manager.setData(entity, "skyhighheroes:dyn/entry", entity.getData("fiskheroes:disguise"));
            manager.setData(entity, "fiskheroes:disguise", null);
          } else {
            manager.setData(entity, "skyhighheroes:dyn/entry", entity.getData("fiskheroes:disguise"));
            manager.setData(entity, "fiskheroes:disguise", ((entity.getData("skyhighheroes:dyn/alias_active")) ? getAliasName(entity) : getModelID(entity)));
          };
          manager.setData(entity, "fiskheroes:shape_shifting_to", null);
          manager.setData(entity, "fiskheroes:shape_shifting_from", null);
          manager.setData(entity, "fiskheroes:shape_shift_timer", 0);
          var entry = entity.getDataOrDefault("skyhighheroes:dyn/entry", "");
          if (entry.startsWith("!")) {
            manager.setData(entity, "skyhighheroes:dyn/entry", entry.substring(1));
            var args = entity.getDataOrDefault("skyhighheroes:dyn/entry", "").split(" ");
            switch (args[0]) {
              case "systemInfo":
                systemInfo(entity);
                break;
              case "status":
                status(entity);
                break;
              case "powerOff":
                manager.setData(entity, "skyhighheroes:dyn/cybernetics_offline", true);
                systemMessage(entity, "<n>Powering down!");
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", false);
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", true);
                manager.setData(entity, "skyhighheroes:dyn/night_vision", false);
                manager.setData(entity, "skyhighheroes:dyn/optics_enabled", false);
                onChargingStartIndexes.forEach(index => {
                  modules[index].onChargingStart(entity, manager);
                });
                break;
              case "powerOn":
                manager.setData(entity, "skyhighheroes:dyn/cybernetics_offline", false);
                systemMessage(entity, "<n>Powering on!");
                var nbt = mainNBT(entity);
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
                manager.setData(entity, "skyhighheroes:dyn/cybernetic_statue_mode", nbt.getBoolean("statueMode"));
                manager.setData(entity, "skyhighheroes:dyn/night_vision", nbt.getBoolean("nightVision"));
                manager.setData(entity, "skyhighheroes:dyn/optics_enabled", true);
                onChargingStopIndexes.forEach(index => {
                  modules[index].onChargingStop(entity, manager);
                });
                break;
              case "openCore":
                manager.setData(entity, "skyhighheroes:dyn/system_core_open", true);
                systemMessage(entity, "<n>Opening core!");
                break;
              case "closeCore":
                manager.setData(entity, "skyhighheroes:dyn/system_core_open", false);
                systemMessage(entity, "<n>Closing core!");
                break;
              case "enableOptics":
                manager.setData(entity, "skyhighheroes:dyn/optics_enabled", true);
                systemMessage(entity, "<n>Enabling optics!");
                break;
              case "disableOptics":
                manager.setData(entity, "skyhighheroes:dyn/optics_enabled", false);
                systemMessage(entity, "<n>Disabling optics!");
                break;
              case "help":
                systemMessage(entity, "<n>Available commands:");
                commandIndexes.forEach(index => {
                  var module = modules[index];
                  if (!isModuleDisabled(entity, module.name) && entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") == 0) {
                    systemMessage(entity, module.helpMessage);
                  };
                });
                systemMessage(entity, "<n>!status <nh>-<n> Shows your current status");
                systemMessage(entity, "<n>!systemInfo <nh>-<n> Shows your system info");
                systemMessage(entity, "<n>!arm <ability> <nh>-<n> Arms an ability");
                systemMessage(entity, "<n>!disarm <ability> <nh>-<n> Disarms an ability");
                systemMessage(entity, "<n>!powerOn <nh>-<n> Powers you up");
                systemMessage(entity, "<n>!powerOff <nh>-<n> Powers you down");
                systemMessage(entity, "<n>!help <nh>-<n> Shows this list");
                break;
              case "disable":
                disableModule(entity, manager, args[1]);
                break;
              case "enable":
                enableModule(entity, manager, args[1]);
                break;
              case "idSet":
                maybeGetID(entity, manager, args[1])
                break;
              case "cv":
                entity.as("PLAYER").addChatMessage(PackLoader.getSide() + ": " + entity.getDataOrDefault("skyhighheroes:dyn/" + args[1], 0));
                break;
              case "nbtStringList":
                entity.as("PLAYER").addChatMessage(nbt.getStringList(args[1]));
                break;
              case "nbtInt":
                entity.as("PLAYER").addChatMessage(nbt.getInteger(args[1]));
                break;
              case "nbtShort":
                entity.as("PLAYER").addChatMessage(nbt.getShort(args[1]));
                break;
              case "chatMode":
                switchChatModes(entity, manager, args[1]);
                break;
              case "msg":
                switchChats(entity, manager, args[1]);
                break;
              case "arm":
                if (args[1] == "*") {
                  manager.setBoolean(nbt, "rocketsArms", true);
                  manager.setBoolean(nbt, "rocketsBody", true);
                  manager.setBoolean(nbt, "rocketsLegs", true);
                  manager.setBoolean(nbt, "rocketsWings", true);
                  manager.setBoolean(nbt, "cannonsHead", true);
                  manager.setBoolean(nbt, "cannonsBody", true);
                  manager.setBoolean(nbt, "cannonsArms", true);
                  manager.setBoolean(nbt, "shieldsLeft", true);
                  manager.setBoolean(nbt, "shieldsRight", true);
                  manager.setBoolean(nbt, "bladesLeft", true);
                  manager.setBoolean(nbt, "bladesRight", true);
                  manager.setBoolean(nbt, "wings", false);
                  systemMessage(entity, "<s>Armed <sh>everything<s>!");
                } else {
                  armHandlerIndexes.forEach((index) => {
                    var module = modules[index];
                    module.armHandler(entity, manager, args[1]);
                  });
                };
                break;
              case "disarm":
                if (args[1] == "*") {
                  manager.setBoolean(nbt, "rocketsArms", false);
                  manager.setBoolean(nbt, "rocketsBody", false);
                  manager.setBoolean(nbt, "rocketsLegs", false);
                  manager.setBoolean(nbt, "rocketsWings", false);
                  manager.setBoolean(nbt, "cannonsHead", false);
                  manager.setBoolean(nbt, "cannonsBody", false);
                  manager.setBoolean(nbt, "cannonsArms", false);
                  manager.setBoolean(nbt, "shieldsLeft", false);
                  manager.setBoolean(nbt, "shieldsRight", false);
                  manager.setBoolean(nbt, "bladesLeft", false);
                  manager.setBoolean(nbt, "bladesRight", false);
                  manager.setBoolean(nbt, "wings", false);
                  systemMessage(entity, "<s>Disarmed <sh>everything<s>!");
                } else {
                  disarmHandlerIndexes.forEach((index) => {
                    var module = modules[index];
                    module.disarmHandler(entity, manager, args[1]);
                  });
                };
                break;
              default:
                var index = commands.indexOf(args[0]);
                if (index > -1 && entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") == 0) {
                  var module = modules[commandIndexes[index]];
                  if (!isModuleDisabled(entity, module.name)) {
                    module.commandHandler(entity, manager, args);
                  } else {
                    systemMessage(entity, "<e>Module <eh>" + module.name +"<e> is disabled!");
                  };
                } else {
                  systemMessage(entity, "<e>Unknown command! Try <eh>!help<e> for a list of commands!");
                };
                break;
            };
          } else {
            if (hasTextAction(entity, manager) && entity.getData("skyhighheroes:dyn/entering_value")) {
              textAction(entity, manager, entity.getData("skyhighheroes:dyn/entry"));
            } else {
              var chatMode = chatModes.indexOf(entity.getData("skyhighheroes:dyn/chat_mode"));
              if (chatMode > -1) {
                var chatModule = modules[messagingIndexes[chatMode]];
                chatModule.messageHandler(entity, name, 32);
              };
            };
          };
        };
      };
      if (entity.getData("skyhighheroes:dyn/thermoptic_disguise_timer") < 1) {
        manager.setData(entity, "fiskheroes:disguise", ((entity.getData("skyhighheroes:dyn/alias_active")) ? getAliasName(entity) : getModelID(entity)));
      };
      if (entity.getData("skyhighheroes:dyn/thermoptic_disguise_timer") == 1) {
        manager.setData(entity, "fiskheroes:disguise", null);
      };
      tickHandlerIndexes.forEach(index => {
        var module = modules[index];
        if (!isModuleDisabled(entity, module.name) && entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") == 0) {
          module.tickHandler(entity, manager);
        };
      });
      var trackedWaypoint = entity.getData("skyhighheroes:dyn/tracked_waypoint").split(";:");
      if (trackedWaypoint.length == 5) {
        var waypointX = parseFloat(trackedWaypoint[1]);
        var waypointZ = parseFloat(trackedWaypoint[3]);
        var sameDim = (entity.world().getDimension() == parseInt(trackedWaypoint[4]));
        if (sameDim) {
          var waypointRotation = (entity.rotYaw() - (Math.atan2((waypointZ - entity.eyePos().z()), (waypointX - entity.eyePos().x())) / Math.PI) * 180) % 360;
          var waypointBearing = ((Math.abs((waypointRotation < 0) ? (waypointRotation + 360) : waypointRotation) + 90) % 360);
          manager.setDataWithNotify(entity, "skyhighheroes:dyn/tracked_waypoint_bearing", waypointBearing);
        };
      } else {
        if (entity.getData('skyhighocs:dyn/tracked_waypoint_bearing') != 0) {
          manager.setDataWithNotify(entity, "skyhighheroes:dyn/tracked_waypoint_bearing", 0.0);
        };
      };
      var rotation = entity.rotYaw()%360;
      var bearing = ((Math.abs((rotation < 0) ? (rotation+360) : rotation)+180) % 360);
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/bearing", bearing);
      if (entity.getData("fiskheroes:grab_id") > -1) {
        maybeGetID(entity, manager, entity.getData("fiskheroes:grab_id"));
      };
      if (entity.getData("fiskheroes:grabbed_by") > -1) {
        maybeGetID(entity, manager, entity.getData("fiskheroes:grabbed_by"));
      };
    };
    if (entity.getData("skyhighheroes:dyn/energy") <= 0) {
      manager.setData(entity, "skyhighheroes:dyn/cybernetics_offline", true);
    } else {
      if (entity.getData("skyhighheroes:dyn/charging_timer") == 1 && entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") == 1) {
        manager.setData(entity, "skyhighheroes:dyn/cybernetics_offline", false);
      };
    };
    if (entity.getData("skyhighheroes:dyn/cybernetics_offline_timer") == 0) {
      useEnergy(entity, manager, "base");
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_body_lights")) {
      useEnergy(entity, manager, "bodyLights");
    };
    if (!entity.getData("skyhighheroes:dyn/cybernetic_statue_mode")) {
      useEnergy(entity, manager, "motorControl");
    };
    if (entity.getData("skyhighheroes:dyn/night_vision")) {
      useEnergy(entity, manager, "nightVision");
    };
    if (entity.getData("fiskheroes:moving")) {
      useEnergy(entity, manager, "movement");
    };
    if (entity.getData("skyhighheroes:dyn/optics_enabled")) {
      useEnergy(entity, manager, "opticsEnabled");
    };
    if (entity.getData("fiskheroes:time_since_damaged") == 0) {
      useEnergy(entity, manager, "damageTaken");
    };
    if (entity.getData("skyhighheroes:dyn/charging_timer") == 1) {
      if (!onChargingBlock(entity)) {
        stopCharging(entity, manager);
      } else {
        chargeEnergy(entity, manager);
      };
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_sleep_timer") == 1) {
      if ((entity.getPunchTimer() > 0.9)) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("skyhighheroes:dyn/thermoptic_camouflage") || entity.getData("skyhighheroes:dyn/thermoptic_disguise")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("fiskheroes:shield") || entity.getData("skyhighheroes:dyn/shield_left") || entity.getData("skyhighheroes:dyn/shield_right")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("fiskheroes:flying") || entity.getData("skyhighheroes:dyn/rockets_body") || entity.getData("skyhighheroes:dyn/rockets_arms") || entity.getData("skyhighheroes:dyn/rockets_legs")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("fiskheroes:gliding") || entity.getData("skyhighheroes:dyn/wings")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("fiskheroes:blade") || entity.getData("skyhighheroes:dyn/blade_left") || entity.getData("skyhighheroes:dyn/blade_right")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (entity.getData("skyhighheroes:dyn/cannons_body") || entity.getData("skyhighheroes:dyn/cannons_arms") || entity.getData("skyhighheroes:dyn/cannons_head")) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_sleep", false);
      };
      if (!entity.getData("skyhighheroes:dyn/cybernetic_sleep")) {
        systemMessage(entity, "<n>Sleep mode canceled!");
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/cybernetic_body_lights", nbt.getBoolean("bodyLights"));
        onWakeIndexes.forEach(index => {
          modules[index].onWake(entity, manager);
        });
      };
    };
    //Eyes
    //Lid
    /* if ((nbt.getShort("eyeLeftLid")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_left_lid_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_left_lid_timer", round(entity.getData("skyhighheroes:dyn/eye_left_lid_timer")));
    };
    if ((nbt.getShort("eyeLeftLid")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_left_lid_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeLeftLid")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_left_lid_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_left_lid_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_left_lid_timer")) + round(diff)), Math.min((nbt.getShort("eyeLeftLid")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_lid_timer")), Math.max((nbt.getShort("eyeLeftLid")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_lid_timer"))));
    };
    if ((nbt.getShort("eyeRightLid")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_right_lid_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_right_lid_timer", round(entity.getData("skyhighheroes:dyn/eye_right_lid_timer")));
    };
    if ((nbt.getShort("eyeRightLid")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_right_lid_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeRightLid")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_right_lid_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_right_lid_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_right_lid_timer")) + round(diff)), Math.min((nbt.getShort("eyeRightLid")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_lid_timer")), Math.max((nbt.getShort("eyeRightLid")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_lid_timer"))));
    };
    //X
    if ((nbt.getShort("eyeLeftX")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_left_X_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_left_X_timer", round(entity.getData("skyhighheroes:dyn/eye_left_X_timer")));
    };
    if ((nbt.getShort("eyeLeftX")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_left_X_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeLeftX")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_left_X_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_left_X_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_left_X_timer")) + round(diff)), Math.min((nbt.getShort("eyeLeftX")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_X_timer")), Math.max((nbt.getShort("eyeLeftX")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_X_timer"))));
    };
    if ((nbt.getShort("eyeRightX")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_right_X_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_right_X_timer", round(entity.getData("skyhighheroes:dyn/eye_right_X_timer")));
    };
    if ((nbt.getShort("eyeRightX")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_right_X_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeRightX")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_right_X_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_right_X_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_right_X_timer")) + round(diff)), Math.min((nbt.getShort("eyeRightX")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_X_timer")), Math.max((nbt.getShort("eyeRightX")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_X_timer"))));
    };
    //Y
    if ((nbt.getShort("eyeLeftY")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_left_Y_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_left_Y_timer", round(entity.getData("skyhighheroes:dyn/eye_left_Y_timer")));
    };
    if ((nbt.getShort("eyeLeftY")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_left_Y_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeLeftY")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_left_Y_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_left_Y_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_left_Y_timer")) + round(diff)), Math.min((nbt.getShort("eyeLeftY")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_Y_timer")), Math.max((nbt.getShort("eyeLeftY")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_left_Y_timer"))));
    };
    if ((nbt.getShort("eyeRightY")/100.0) == round(entity.getData("skyhighheroes:dyn/eye_right_Y_timer"))) {
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/prev_eye_right_Y_timer", round(entity.getData("skyhighheroes:dyn/eye_right_Y_timer")));
    };
    if ((nbt.getShort("eyeRightY")/100.0) != round(entity.getData("skyhighheroes:dyn/eye_right_Y_timer"))) {
      var diff = Math.ceil(((nbt.getShort("eyeRightY")/100.0) - entity.getData("skyhighheroes:dyn/prev_eye_right_Y_timer"))*100.0)/2000.0;
      manager.setInterpolatedData(entity, "skyhighheroes:dyn/eye_right_Y_timer", clamp((round(entity.getData("skyhighheroes:dyn/eye_right_Y_timer")) + round(diff)), Math.min((nbt.getShort("eyeRightY")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_Y_timer")), Math.max((nbt.getShort("eyeRightY")/100.0), entity.getData("skyhighheroes:dyn/prev_eye_right_Y_timer"))));
    }; */
    if (sneakMultiTap.conditionalMultiTap(entity, manager, 2, 10, 1, entity.isSneaking())) {
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/thermoptic_disguise", !entity.getData("skyhighheroes:dyn/thermoptic_disguise"));
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_interface_timer") == 1 && !entity.getData("skyhighheroes:dyn/entering_value")) {
      if (PackLoader.getSide() == "SERVER") {
        syncMotion(entity, manager);
        var motion_x = entity.getData("skyhighheroes:dyn/motion_x");
        var motion_z = entity.getData("skyhighheroes:dyn/motion_z");
        var yaw = (entity.rotation().y() / 180) * Math.PI;
        var cosa = Math.cos(yaw);
        var sina = Math.sin(yaw);
        var strafe = (motion_x * cosa) + (motion_z * sina);
        var forward = (motion_z * cosa) - (motion_x * sina);
        var positive_threshold = 0.015;
        var negative_threshold = -0.015;
        manager.incrementData(entity, "skyhighheroes:dyn/button_cooldown", 6, 0, entity.getData("skyhighheroes:dyn/button_coolingdown"));
        if (entity.getData("skyhighheroes:dyn/button_cooldown") == 1) {
          manager.setDataWithNotify(entity, "skyhighheroes:dyn/button_coolingdown", false);
        };
        if (entity.getData("skyhighheroes:dyn/button_cooldown") == 0) {
          var buttonIndex = buttonIDs.indexOf(entity.getData("skyhighheroes:dyn/selected_button"));
          if (buttonIndex > -1) {
            var borderingButtons = buttonBorders[buttonIndex];
            var properties = buttonProperties[buttonIndex];
            //Up
            if (forward < negative_threshold) {
              if (properties.hasOwnProperty("upAction")) {
                properties.upAction(entity, manager);
              };
              if (borderingButtons.hasOwnProperty("top")) {
                setButton(entity, manager, borderingButtons["top"]);
              };
              manager.setDataWithNotify(entity, "skyhighheroes:dyn/button_coolingdown", true);
            };
            //Down
            if (forward > positive_threshold) {
              if (properties.hasOwnProperty("downAction")) {
                properties.downAction(entity, manager);
              };
              if (borderingButtons.hasOwnProperty("bottom")) {
                setButton(entity, manager, borderingButtons["bottom"]);
              };
              manager.setDataWithNotify(entity, "skyhighheroes:dyn/button_coolingdown", true);
            };
            //Left
            if (strafe < negative_threshold) {
              if (properties.hasOwnProperty("leftAction")) {
                properties.leftAction(entity, manager);
              };
              if (borderingButtons.hasOwnProperty("left")) {
                setButton(entity, manager, borderingButtons["left"]);
              };
              manager.setDataWithNotify(entity, "skyhighheroes:dyn/button_coolingdown", true);
            };
            //Right
            if (strafe > positive_threshold) {
              if (properties.hasOwnProperty("rightAction")) {
                properties.rightAction(entity, manager);
              };
              if (borderingButtons.hasOwnProperty("right")) {
                setButton(entity, manager, borderingButtons["right"]);
              };
              manager.setDataWithNotify(entity, "skyhighheroes:dyn/button_coolingdown", true);
            };
          };
          var newButtonIndex = buttonIDs.indexOf(entity.getData("skyhighheroes:dyn/selected_button"));
          if (newButtonIndex > -1) {
            var properties = buttonProperties[newButtonIndex];
            if (properties.hasOwnProperty("selectAction")) {
              properties.selectAction(entity, manager);
            };
          };
        };
      };
    };
  };
  /**
   * Damage profile stuff for normal player
   * @param {JSEntity} entity - Required
   * @param {string} modifier - Required
   **/
  function normalDamageProfile(entity) {
    return null;
  };
  /**
   * Attribute profile stuff for normal player
   * @param {JSEntity} entity - Required
   * @param {string} modifier - Required
   **/
  function normalAttributeProfile(entity) {
    var result = null;
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") == 0) {
      result = "BEFORE_CONVERSION";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0) {
      result = "CONVERSION_1";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0.2) {
      result = "CONVERSION_2";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0.4) {
      result = "CONVERSION_3";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0.6) {
      result = "CONVERSION_4";
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0.8) {
      result = "CONVERSION_5";
    };
    return result;
  };
  /**
   * Modifier enabled stuff for normal player
   * @param {JSEntity} entity - Required
   * @param {string} modifier - Required
   **/
  function normalModifierEnabled(entity, modifier) {
    if ((modifier.name() == "fiskheroes:transformation")) {
      return ((modifier.id() == "cybernetic_conversion") || (modifier.id() == "cybernetic_conversion_sleep"));
    } else {
      return false;
    };
  };
  /**
   * Keybind enabled stuff for normal player
   * @param {JSEntity} entity - Required
   * @param {string} keyBind - Required
   **/
  function normalKeyBindEnabled(entity, keyBind) {
    if (keyBind == "BYPASS") {
      return entity.as("PLAYER").isCreativeMode() && entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0;
    };
    if (keyBind == "WAKE_UP") {
      return entity.getData("skyhighheroes:dyn/cybernetic_conversion_timer") == 1;
    };
    return false;
  };
  /**
   * Handler for doing cybernetic conversion
   * @param {JSEntity} entity - Required
   * @param {JSDataManager} manager - Required
   **/
  function cyberneticConversionHandler(entity, manager, hero) {
    var nbt = mainNBT(entity);
    var conversionTimer = entity.getData("skyhighheroes:dyn/cybernetic_conversion_timer");
    var activationVariables = ["", "", "", "", "", "", "", "", "", "", "", "rockets", "cannons", "blades", "shields", "satellite", "antenna", "wings", "thermoptics", "optics"];
    var numActivationVariables = activationVariables.length;
    var numActivationVariableUsed = Math.ceil(conversionTimer*numActivationVariables);
    var rockets = (activationVariables[numActivationVariableUsed] == "rockets");
    var cannons = (activationVariables[numActivationVariableUsed] == "cannons");
    var blades = (activationVariables[numActivationVariableUsed] == "blades");
    var shields = (activationVariables[numActivationVariableUsed] == "shields");
    var satellite = (activationVariables[numActivationVariableUsed] == "satellite");
    var antenna = (activationVariables[numActivationVariableUsed] == "antenna");
    var wings = (activationVariables[numActivationVariableUsed] == "wings");
    var thermoptics = (activationVariables[numActivationVariableUsed] == "thermoptics");
    var optics = (activationVariables[numActivationVariableUsed] == "optics");
    
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_outer_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_front_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_arm_back_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_outer_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_front_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_arm_back_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_outer_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_inner_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_front_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_back_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_outer_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_inner_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_front_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_back_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_left_leg_main_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_right_leg_main_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_body_left_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_body_right_deployed", rockets);
    manager.setData(entity, "skyhighheroes:dyn/rocket_inner_legs_enabled", rockets);
    
    manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_bottom_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_front_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_left_arm_back_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_bottom_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_front_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_right_arm_back_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_head_left_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_head_right_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_body_left_deployed", cannons);
    manager.setData(entity, "skyhighheroes:dyn/cannon_body_right_deployed", cannons);
    
    manager.setData(entity, "skyhighheroes:dyn/blade_left_deployed", blades);
    manager.setData(entity, "skyhighheroes:dyn/blade_right_deployed", blades);

    manager.setData(entity, "skyhighheroes:dyn/shield_left_deployed", shields);
    manager.setData(entity, "skyhighheroes:dyn/shield_right_deployed", shields);
    
    manager.setData(entity, "skyhighheroes:dyn/satellite_deployed", satellite);

    manager.setData(entity, "skyhighheroes:dyn/antenna_deployed", antenna);
    
    manager.setData(entity, "skyhighheroes:dyn/wing_left_deployed", wings);
    manager.setData(entity, "skyhighheroes:dyn/wing_right_deployed", wings);

    if (thermoptics) {
      manager.setBoolean(nbt, "disguiseClothing", true);
      manager.setData(entity, "skyhighheroes:dyn/thermoptic_disguise_clothing", true);
      manager.setData(entity, "skyhighheroes:dyn/thermoptic_disguise", true);
    };
    
    if (optics) {
      manager.setData(entity, "skyhighheroes:dyn/optics_enabled", true);
    };
    
    var nbt = mainNBT(entity);
    var timer = entity.getData("skyhighheroes:dyn/cybernetic_conversion_timer");
    if (timer > 0 && timer < 1 && (Math.ceil(timer*150) % 30) == 0) {
      entity.hurt(hero, "CONVERSION", "%1$s died from cybernetic conversion", 0.5 + timer*10.0);
    };
    if (!nbt.getBoolean("convertedToCyber") && entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") == 0) {
      manager.setData(entity, "skyhighheroes:dyn/cybernetic_conversion_sleep", true);
    };
    if (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") == 1) {
      manager.setData(entity, "skyhighheroes:dyn/cybernetic_conversion", true);
    };
  };
  return {
    /**
     * Handles all cyber stuff
     * @param {JSHero} hero - Required
     **/
    initCybernetics: (hero) => {
      hero.setAliases(formatAlias(cyberName));
      hero.setName(cyberName + "/Model " + cyberModelID + " Cybernetic Body");
      hero.setTier(9);
      hero.setChestplate("System Core");
      hero.setVersion("OC");
    
      hero.addPrimaryEquipment("fiskheroes:suit_data_drive@" + colorDamage[color] + "{display:{Name:\u00A7" + color + cyberName + "'s Data Drive}}", true, item => (item.damage() == colorDamage[color]));
    
      keyBinds(hero);
      initProfiles(hero);
      addPowers(hero);
      
      hero.setHasProperty((entity, property) => {
        return (property == "BREATHE_SPACE" || property == "MASK_TOGGLE") && entity.getData("skyhighheroes:dyn/converted_cyber");
      });
      hero.setTierOverride(entity => {
        return (entity.getData("skyhighheroes:dyn/converted_cyber")) ? ((entity.getData("skyhighheroes:dyn/system_core_open_timer") == 0) ? 9 : 1) : 0;
      });
      hero.setDefaultScale(1.0);
      hero.setModifierEnabled((entity, modifier) => {
        return (entity.getData("skyhighheroes:dyn/converted_cyber")) ? cyberneticModifierEnabled(entity, modifier) : normalModifierEnabled(entity, modifier);
      });
      hero.setKeyBindEnabled((entity, keyBind) => {
        return (entity.getData("skyhighheroes:dyn/converted_cyber")) ? cyberneticKeyBindEnabled(entity, keyBind) : normalKeyBindEnabled(entity, keyBind);
      });
      hero.setDamageProfile((entity) => {
        return (entity.getData("skyhighheroes:dyn/converted_cyber")) ? cyberneticDamageProfile(entity) : normalDamageProfile(entity);
      });
      hero.setAttributeProfile((entity) => {
        return (entity.getData("skyhighheroes:dyn/converted_cyber")) ? cyberneticAttributeProfile(entity) : normalAttributeProfile(entity);
      });
      hero.setTickHandler((entity, manager) => {
        var nbt = mainNBT(entity);
        if (!nbt.hasKey("convertedToCyber")) {
          manager.setBoolean(nbt, "convertedToCyber", false);
        };
        manager.setData(entity, "skyhighheroes:dyn/converted_cyber", nbt.getBoolean("convertedToCyber"));
        if (!entity.getData("skyhighheroes:dyn/converted_cyber")) {
          cyberneticConversionHandler(entity, manager, hero);
        } else {
          cyberneticsHandler(entity, manager);
        };
      });
    }
  };
};