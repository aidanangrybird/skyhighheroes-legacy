//If I see anyone steal this, I will be very mad as I have spent a lot of time working on this to get it working well
//So please don't steal this, it will look very bad on you

//Encryption stuff
var possibleChars = ["!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~", " "];
var possibleNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var possibleLetters = ["A", "B", "C", "D", "E", "F"];

/**
 * Encrypts secret message
 * @param {JSEntity} entity - Entity getting randomness from
 * @param {string} message - Message to encrypt
 * @returns Object containing the encrypted message and key to decode encrypted message
 **/
function encryptSecretMessage(entity, message) {
  var nbt = mainNBT(entity);
  var computerID = nbt.getString("computerID");
  var offset = Math.floor(20*Math.random());
  var offsetComputerID = computerID.substring(offset) + computerID.substring(0, offset);
  var computerIDNumbers = offsetComputerID.split("");
  var messageChars = message.split("");
  var keyLength = 0;
  var encryptedMessage = "";
  var adjustments = [];
  var adjustmentDirections = [];
  messageChars.forEach(character => {
    var characterIndex = possibleChars.indexOf(character);
    var adjustmentDirection = Math.random();
    var adjustment = parseInt(computerIDNumbers[keyLength%20]);
    adjustments.push(adjustment);
    if (adjustmentDirection > 0.6) {
      var finalAdjustment = characterIndex - adjustment;
      finalAdjustment = (finalAdjustment < 0 ? (95 + finalAdjustment) : finalAdjustment);
      var newChar = possibleChars[finalAdjustment%95];
      encryptedMessage = encryptedMessage + newChar;
      adjustmentDirections.push((Math.random() > 0.5) ? "A" : "C");
    };
    if ((adjustmentDirection <= 0.6) && (adjustmentDirection >= 0.4)) {
      var finalAdjustment = characterIndex;
      var newChar = possibleChars[finalAdjustment%95];
      encryptedMessage = encryptedMessage + newChar;
      adjustmentDirections.push((Math.random() > 0.5) ? "D" : "E");
    };
    if (adjustmentDirection < 0.4) {
      var finalAdjustment = characterIndex + adjustment;
      finalAdjustment = (finalAdjustment < 0 ? (95 + finalAdjustment) : finalAdjustment);
      var newChar = possibleChars[finalAdjustment%95];
      encryptedMessage = encryptedMessage + newChar;
      adjustmentDirections.push((Math.random() > 0.5) ? "B" : "F");
    };
    keyLength = keyLength + 1;
  });
  var newOffsetFirst = "";
  var newOffsetSecond = "";
  if (offset < 10) {
    newOffsetFirst = "0";
    newOffsetSecond = "" + offset;
  } else {
    var newOffset = "" + offset;
    var offsetChars = newOffset.split("");
    newOffsetFirst = offsetChars[0];
    newOffsetSecond = offsetChars[1];
  };
  var scrambledKey = "";
  for (var i=0;i<adjustments.length;i++) {
    scrambledKey = scrambledKey + ((Math.random() > 0.5) ? (adjustments[i] + adjustmentDirections[i]) : (adjustmentDirections[i] + adjustments[i]));
  };
  var publicKey = newOffsetFirst + scrambledKey + newOffsetSecond;
  return {
    encryptedMessage: encryptedMessage,
    publicKey: publicKey,
  };
};

/**
 * Decrypts secret message
 * @param {string} message - Encrypted message
 * @param {string} publicKey - Key used to decrypt the encrypted message
 * @returns Decrypted secret message
 **/
function decryptSecretMessage(message, publicKey) {
  var offset = parseInt(publicKey.substring(0,1) + publicKey.substring(publicKey.length-1));
  var pubKey = publicKey.substring(1,publicKey.length-1);
  var messageChars = message.split("");
  var messageLength = messageChars.length;
  var publicKeyChars = pubKey.split("");
  var publicKeyLength = pubKey.length;
  var offsetComputerIDLong = "";
  var adjustmentDirections = [];
  publicKeyChars.forEach(character => {
    if (possibleNumbers.indexOf(character) > -1) {
      offsetComputerIDLong = offsetComputerIDLong + character;
    };
    if (possibleLetters.indexOf(character) > -1) {
      adjustmentDirections.push(character);
    };
  });
  var offsetComputerID = offsetComputerIDLong.substring(0, 49);
  var computerID = offsetComputerID.substring(20-offset, 49) + offsetComputerID.substring(0, 20-offset);
  var adjustments = offsetComputerID.split("");
  var pubKeyProgress = 0;
  var decryptedMessage = "";
  messageChars.forEach(character => {
    var adjustmentDirection = adjustmentDirections[pubKeyProgress];
    var adjustment = parseInt(adjustments[(pubKeyProgress)%20]);
    var characterIndex = possibleChars.indexOf(character);
    if ((adjustmentDirection == "A") || (adjustmentDirection == "C")) {
      var finalAdjustment = characterIndex + adjustment;
      finalAdjustment = (finalAdjustment < 0 ? (95 + finalAdjustment) : finalAdjustment);
      var newChar = possibleChars[finalAdjustment%95];
      decryptedMessage = decryptedMessage + newChar;
    };
    if ((adjustmentDirection == "D") || (adjustmentDirection == "E")) {
      var finalAdjustment = characterIndex;
      var newChar = possibleChars[finalAdjustment%95];
      decryptedMessage = decryptedMessage + newChar;
    };
    if ((adjustmentDirection == "B") || (adjustmentDirection == "F")) {
      var finalAdjustment = characterIndex - adjustment;
      finalAdjustment = (finalAdjustment < 0 ? (95 + finalAdjustment) : finalAdjustment);
      var newChar = possibleChars[finalAdjustment%95];
      decryptedMessage = decryptedMessage + newChar;
    };
    pubKeyProgress = pubKeyProgress + 1;
  });
  return decryptedMessage;
};

regex = /((<ob>))|(<n>)|(<nh>)|(<s>)|(<sh>)|(<e>)|(<eh>)|(<r>)|(<dragon>)|(<leo>)|(<pegasus>)/gm;

variableRegex = /[\s-]/gm;

var formatting = {
  "<ob>": "\u00A7k",
  "<n>": "\u00A7b",
  "<nh>": "\u00A7a",
  "<s>": "\u00A7a",
  "<sh>": "\u00A7e",
  "<e>": "\u00A7c",
  "<eh>": "\u00A76",
  "<dragon>": "\u00A72Dragon \u00A77Sky\u00A7r",
  "<leo>": "\u00A76Leo \u00A74Kingdom\u00A7r",
  "<pegasus>": "\u00A7bPegasus \u00A79Magic\u00A7r",
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

var hexColors = {
  "Geo Stelar": "0x00FF00",
};

function assignTranser(entity, manager, satellite) {
  var nbt = mainNBT(entity);
  if (!nbt.hasKey("personalMessage")) {
    manager.setString(nbt, "personalMessage", "");
  };
  if (!nbt.hasKey("secretMessage")) {
    manager.setString(nbt, "secretMessage", "");
  };
  if (!nbt.hasKey("publicKey")) {
    manager.setString(nbt, "publicKey", "");
  };
  manager.setString(nbt, "satellite", satellite);
  manager.setData(entity, "skyhighheroes:dyn/satellite", satellite);
  manager.setBoolean(nbt, "Unbreakable", true);
  if (!nbt.hasKey("computerID")) {
    if (PackLoader.getSide() == "SERVER") {
      var computerID = Math.random().toFixed(20).toString().substring(2);
      manager.setString(nbt, "computerID", computerID);
    };
  };
};

/**
 * Checks if an entity is wearing a transer
 * @param {JSEntity} entity - Entity getting checked
 * @returns If the entity is wearing a transer
 **/
function isWearingTranser(entity) {
  return mainNBT(entity).hasKey("satellite");
};

/**
 * Gets the Compatible EM Being
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Compatible EM Being
 **/
function getEMBeing(entity) {
  return entity.getData("skyhighheroes:dyn/em_being");
};
/**
 * Gets the Compatible Human
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Compatible Human
 **/
function getCompatibleHuman(entity) {
  return entity.getData("skyhighheroes:dyn/compatible_human");
};
/**
 * Gets the Compatible UUID
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Compatible UUID
 **/
function getCompatibleUUID(entity) {
  return entity.getData("skyhighheroes:dyn/compatible_uuid");
};
/**
 * Gets the Wave Change name
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Wave Change name
 **/
function getWaveChange(entity) {
  return entity.getData("skyhighheroes:dyn/wave_change");
};
/**
 * Gets the Wave Color
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Wave Color
 **/
function getWaveColor(entity) {
  return entity.getData("skyhighheroes:dyn/wave_color");
};
/**
 * Gets the assigned Satellite
 * @param {JSEntity} entity - Entity getting checked
 * @returns The  assigned Satellite
 **/
function getAssignedSatellite(entity) {
  return entity.getData("skyhighheroes:dyn/satellite");
};
/**
 * Checks if player can use transer
 * @param {JSEntity} entity - Entity getting checked
 * @returns If transer can be used
 **/
function canUseTranser(entity) {
  var variable = entity.getData("skyhighheroes:dyn/em_being_variable");
  if (variable != null) {
    return ((entity.getData("skyhighheroes:dyn/wave_changing_timer") == 0) ? true : entity.getData("skyhighheroes:dyn/" + variable + "_timer") == 1);
  } else {
    return true;
  };
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
 * Gets the system color of a transer
 * @param {JSEntity} entity - Entity getting checked
 * @returns The system color of a transer
 **/
function getSystemColor(entity) {
  return entity.getData("skyhighheroes:dyn/system_color");
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
 * Formats EM Being name to variable format
 * @param {string} input - Name to format
 * @returns Formatted name
 **/
function formatEMBeing(input) {
  input = input.toLowerCase();
  output = input.replace(variableRegex, function(thing) {
    return "_";
  });
  return output;
};

/**
 * Number degree to a cardinal direction
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Cardinal direction
 **/
function angleToDirection(angle) {
  var direction = angle.toFixed(0);
  if (((angle >= 0) && (angle <= 11.25)) || ((angle > 348.75) && (angle <= 360))) {
    direction = "N";
  };
  if ((angle <= 33.75) && (angle > 11.25)) {
    direction = "NNE";
  };
  if ((angle <= 56.25) && (angle > 33.75)) {
    direction = "NE";
  };
  if ((angle <= 78.75) && (angle > 56.25)) {
    direction = "ENE";
  };
  if ((angle <= 101.25) && (angle > 78.75)) {
    direction = "E";
  };
  if ((angle <= 123.75) && (angle > 101.25)) {
    direction = "ESE";
  };
  if ((angle <= 146.25) && (angle > 123.75)) {
    direction = "SE";
  };
  if ((angle <= 168.75) && (angle > 146.25)) {
    direction = "SSE";
  };
  if ((angle <= 191.25) && (angle > 168.75)) {
    direction = "S";
  };
  if ((angle <= 213.75) && (angle > 191.25)) {
    direction = "SSW";
  };
  if ((angle <= 236.25) && (angle > 213.75)) {
    direction = "SW";
  };
  if ((angle <= 258.75) && (angle > 236.25)) {
    direction = "WSW";
  };
  if ((angle <= 281.25) && (angle > 258.75)) {
    direction = "W";
  };
  if ((angle <= 303.75) && (angle > 281.25)) {
    direction = "WNW";
  };
  if ((angle <= 326.25) && (angle > 303.75)) {
    direction = "NW";
  };
  if ((angle <= 348.75) && (angle > 326.25)) {
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
 * Disables a module
 * @param {JSEntity} entity - Required
 * @param {JSDataManager} manager - Required
 * @param {Array} moduleList - List of available module names
 * @param {string} moduleName - Module name to disable
 **/
function disableModule(entity, manager, moduleList, moduleName) {
  var nbt = mainNBT(entity);
  if (moduleList.indexOf(moduleName) > -1) {
    if (!nbt.hasKey("disabledModules")) {
      var disabledModules = manager.newTagList();
      manager.appendString(disabledModules, moduleName);
      manager.setTagList(nbt, "disabledModules", disabledModules);
      systemMessage(entity, "<s>Successfully disabled module <sh>" + moduleName + "<s>!");
    } else {
      var disabledModules = nbt.getStringList("disabledModules");
      var disabledModulesIndex = getStringArray(disabledModules).indexOf(moduleName);
      if (disabledModulesIndex > -1) {
        systemMessage(entity, "<e>You have already disabled module <eh>" + moduleName + "<e>!");
      } else {
        systemMessage(entity, "<s>Successfully disabled module <sh>" + moduleName + "<s>!");
        manager.appendString(disabledModules, moduleName);
      };
    };
  } else {
    systemMessage(entity, "<e>Unknown module of name <eh>" + moduleName + "<e>!");
  };
};
/**
 * Enables module
 * @param {JSEntity} entity - Required
 * @param {JSDataManager} manager - Required
 * @param {Array} moduleList - List of available module names
 * @param {integer} moduleName - Name of module to enable
 **/
function enableModule(entity, manager, moduleList, moduleName) {
  var nbt = mainNBT(entity);
  if (moduleList.indexOf(moduleName) > -1) {
    if (!nbt.hasKey("disabledModules")) {
      systemMessage(entity, "<e>You have no disabled modules to enable!");
    } else {
      var disabledModules = nbt.getStringList("disabledModules");
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
  var entities = entity.world().getEntitiesInRangeOf(entity.pos(), range)
  entities.forEach(player => {
    if (player.is("PLAYER") && entity.canSee(player)) {
      chatMessage(player, message);
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
 * "<dragon>": "\u00A72Dragon \u00A77Sky\u00A7r"
 * "<leo>": "\u00A76Leo \u00A74Kingdom\u00A7r"
 * "<pegasus>": "\u00A7bPegasus \u00A79Magic\u00A7r"
 * "<r>": "\u00A7r"
 * ```
 * @param {JSEntity} entity - Entity recieving message
 * @param {string} message - Message content
 **/
function systemMessage(entity, message) {
  chatMessage(entity, formatSystem(getSystemColor(entity) + "\u00A7ltranserOS\u00A7r> " + message));
};
/**
 * Sends message in log format
 * @param {string} message - Log message
 **/
function logMessage(message) {
  PackLoader.print("skyhighheroes: " + message);
};

/**
 * Sends message from module
 * @param {object} module - Reference 'this' module
 * @param {JSEntity} entity - Entity recieving message
 * @param {string} message - Message content
 **/
function moduleMessage(module, entity, message) {
  var messageName = "\u00A7ltranserOS";
  if (module.hasOwnProperty("moduleMessageName")) {
    messageName = module.moduleMessageName;
  };
  chatMessage(entity, formatSystem(getSystemColor(entity) + messageName + "<r>> " + message));
};
/**
 * Is the setKeyBind stuff for basic transers
 * @param {JSEntity} entity - Required
 * @param {string} keyBind - Required
 **/
function setKeyBind(entity, keyBind) {
  switch (keyBind) {
    default:
      return true;
  };
};

function basicTierOverride(entity) {
  return 0;
};

function addButtonToMenu(menuArray, button, buttonID) {
  var location = button.location;
  var locationX = location[0];
  var locationY = location[1];
  if ((menuArray.length-1) < locationY) {
    var rowArray = [];
    rowArray.splice(locationX, 0, buttonID);
    menuArray.splice(locationY, 0, rowArray);
  } else {
    var rowArray = menuArray[locationY];
    if ((rowArray.length-1) < locationX) {
      rowArray.push(buttonID);
    } else {
      rowArray.splice(locationX, 0, buttonID);
      menuArray[locationY] = rowArray;
    };
  };
};

function printMenuArray(menuArray) {
  var messages = [];
  var rowNum = 0;
  menuArray.forEach(row => {
    var rowMessage = "";
    row.forEach(element => {
      rowMessage = rowMessage + "\"" + element + "\",";
    });
    messages.push("Row " + rowNum + ": " + rowMessage);
    rowNum = rowNum + 1;
  });
  messages.forEach(message => {
    logMessage(message);
  });
};

function setActiveButton(entity, manager, menuButtons) {
  var x = entity.getData("skyhighheroes:dyn/menu_x");
  var y = entity.getData("skyhighheroes:dyn/menu_y");
  var row = menuButtons[y];
  var button = row[x];
  setButton(entity, manager, button);
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
    buttonID: "main_personal",
    borderingButtons: {
      bottom: "main_contacts",
      right: "main_Brother",
    },
    properties: {
      confirmAction: (entity, manager) => {
      },
      backAction: (entity, manager) => {
        manager.setData(entity, "skyhighheroes:dyn/transer", false);
      }
    }
  },
  {
    buttonID: "main_chat",
    borderingButtons: {
      top: "main_contacts",
      right: "main_settings",
    },
    properties: {
      confirmAction: (entity, manager) => {
        systemMessage(entity, "Not available yet!");
      },
      backAction: (entity, manager) => {
        manager.setData(entity, "skyhighheroes:dyn/transer", false);
      }
    }
  }
];

var defaultMenus = {
};

/**
 * Initializes transer system
 * @param {object} moduleList - Transer system modules
 * @param {string} transerName - Required, you'll be happy that is a thing or else debugging is painful
 * @param {string} satellite - Required, or other transers will not recognize this transer as a transer
 **/
function initSystem(moduleList, transerName, satellite) {
  var transerInstance = this;
  var assignedSatellite;
  if (typeof satellite === "string") {
    assignedSatellite = satellite;
  } else {
    assignedSatellite = "";
  };
  //Type 1 - commands (can have data management)
  var type1Specs = ["command", "commandHandler", "helpMessage"];
  //Type 2 - messaging only
  var type2Specs = ["messageHandler", "chatModeInfo", "chatInfo", "modeID"];
  //Type 3 - commands messaging and data management
  var type3Specs = ["command", "messageHandler", "commandHandler", "chatModeInfo", "chatInfo", "helpMessage", "modeID"];
  //Type 7 - EM Being calling signal
  var type7Specs = ["waveHandler", "waveCalling", "selfProfile", "otherProfile"];
  //Type 8 - EM Being
  var type8Specs = ["emBeing", "powers", "keyBinds", "isKeyBindEnabled", "isModifierEnabled", "tickHandler"];
  //Type 9 - EM Wave Change
  var type9Specs = ["waveChange", "powers", "keyBinds", "tierOverride", "properties", "initDamageProfiles", "damageProfiles", "initProfiles", "attributeProfiles", "isKeyBindEnabled", "isModifierEnabled", "tickHandler"];
  /** @var modules - Array of modules */
  var modules = [];
  /** @var moduleNames - Module names */
  var moduleNames = [];
  /** @var commands - Command prefixes */
  var commands = [];
  /** @var commandIndexes - Indexes of command handlers */
  var commandIndexes = [];
  /** @var onInitSystemIndexes - Indexes of system init capable modules */
  var onInitSystemIndexes = [];
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
  /** @var telekinesisButtons - Buttons that use telekinesis for getting a value */
  var telekinesisButtons = [];
  /** @var chatModes - Chat modes */
  var chatModes = [];
  /** @var waveIndex - Wave calling index */
  var waveIndex = -1;
  /** @var emBeingIndex - Index of EM Being */
  var emBeingIndex = -1;
  /** @var waveChangeIndex - Index of EM Wave Change */
  var waveChangeIndex = -1;
  /** @var powerArray - Array of powers to add */
  var powerArray = [];
  /** @var human - Untransformed name */
  var human = "";
  /** @var compatibleUUID - Compatible human UUID */
  var compatibleUUID = "";
  /** @var waveChange - Transformed name */
  var waveChange = "";
  /** @var waveColor - Transformd color */
  var waveColor = "";
  /** @var emBeing - EM Being name */
  var emBeing = "";
  var hasError = false;
  var errors = [];
  logMessage("Attempting to initialize " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on transer " + transerName + "!");
  defaultButtons.forEach(button => {
    mainButtons.push(button);
  });
  moduleList.forEach(module => {
    if (module.hasOwnProperty("initModule")) {
      var moduleInit = module.initModule(transerInstance);
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("transerMainButton")) {
                var button = moduleInit.transerMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("transerMenus")) {
                var menuList = moduleInit.transerMenus;
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
              };
            };
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("transerMainButton")) {
                var button = moduleInit.transerMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("transerMenus")) {
                var menuList = moduleInit.transerMenus;
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
              };
            };
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("transerMainButton")) {
                var button = moduleInit.transerMainButton;
                mainButtons.push(button);
              };
              if (moduleInit.hasOwnProperty("transerMenus")) {
                var menuList = moduleInit.transerMenus;
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
              };
            };
            break;
          case 7:
            type7Specs.forEach(spec => {
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
              waveIndex = modules.length-1;
              human = (moduleInit.hasOwnProperty("human")) ? moduleInit.human : "";
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
            };
            break;
          case 8:
            type8Specs.forEach(spec => {
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
              var modulePowers = moduleInit.powers;
              modulePowers.forEach(power => {
                powerArray.push(power);
              });
              emBeingIndex = modules.length-1;
              emBeing = moduleInit.emBeing;
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
              if (moduleInit.hasOwnProperty("compatibleHumanUUID")) {
                compatibleUUID = moduleInit.compatibleHumanUUID;
              };
            };
            break;
          case 9:
            type9Specs.forEach(spec => {
              if (!moduleInit.hasOwnProperty(spec)) {
                errors.push(spec);
                hasError = true;
              };
            });
            if (hasError) {
              logMessage("Module \"" + moduleInit.name + "\" cannot be initialized on transer " + transerName + "!");
              errors.forEach(error => {
                logMessage("Module is missing the \"" + error + "\" specification!");
              });
              errors = [];
            } else {
              modules.push(moduleInit);
              moduleNames.push(moduleInit.name);
              var modulePowers = moduleInit.powers;
              modulePowers.forEach(power => {
                powerArray.push(power);
              });
              waveChangeIndex = modules.length-1;
              waveColor = moduleInit.color;
              waveChange = moduleInit.waveChange;
              human = moduleInit.human;
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on transer " + transerName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
            };
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
  logMessage("Creating menu: main");
  menuIDs.push("main");
  parentMenuIDs.push("main");
  mainButtons.forEach(button => {
    buttonIDs.push(button.buttonID);
    buttonProperties.push(button.properties);
    buttonBorders.push(button.borderingButtons);
    logMessage("Added button \"" + button.buttonID + "\" to menu \"main\"!");
  });
  logMessage("Successfully initialized " + modules.length + " out of " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on transer " + transerName + "!");
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
    var modulesMessage = (moduleNames.length > 1) ? "<n>Loaded " + moduleNames.length + " modules: " : "<n>Loaded " + moduleNames.length + " module: ";
    moduleNames.forEach(moduleName => {
      if (moduleNames.indexOf(moduleName) == 0) {
        modulesMessage = modulesMessage + ((isModuleDisabled(entity, moduleName))?"<eh>":"<nh>") + moduleName;
      } else {
        modulesMessage = modulesMessage + ((isModuleDisabled(entity, moduleName))?"<n>, <eh>":"<n>, <nh>") + moduleName;
      };
    });
    systemMessage(entity, "<n>transerOS");
    systemMessage(entity, modulesMessage);
    systemMessage(entity, "<n>computerID: <nh>" + mainNBT(entity).getString("computerID"));
  };
  function status(entity) {
    var date = new Date();
    if (typeof human === "string") {
      systemMessage(entity, "<n>Hello <nh>" + human + "<n>!");
    } else {
      systemMessage(entity, "<n>Hello <nh>" + entity.getName() + "<n>!");
    };
    systemMessage(entity, "<n>It is <nh>" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear());
    systemMessage(entity, "<n>The current time is <nh>" + date.getHours() + ":" + ((date.getMinutes() > 9) ? date.getMinutes() : "0"+date.getMinutes()));
    systemMessage(entity, "<n>Your current location is<nh> " + entity.posX().toFixed(0) + "<n>, <nh>" + entity.posY().toFixed(0) + "<n>, <nh>" + entity.posZ().toFixed(0));
    systemMessage(entity, "<n>You are in <nh>" + entity.world().getLocation(entity.pos()).biome() + " <n>biome");
    systemMessage(entity, "<n>Do <nh>!help<n> for available commands!");
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
  return {
    isTelekinesisButton: (entity) => {
      return ((telekinesisButtons.indexOf(entity.getData("skyhighheroes:dyn/selected_button")) > -1) ? true : false);
    },
    /**
     * Power stuff (I hate that I had to do it this way)
     * @param {JSHero} hero - Required
     **/
    addPowers: (hero) => {
      if (powerArray.length == 0) {
        hero.addPowers("skyhighheroes:transer_system");
      };
      if (powerArray.length == 1) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0]);
      };
      if (powerArray.length == 2) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1]);
      };
      if (powerArray.length == 3) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2]);
      };
      if (powerArray.length == 4) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3]);
      };
      if (powerArray.length == 5) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4]);
      };
      if (powerArray.length == 6) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5]);
      };
      if (powerArray.length == 7) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6]);
      };
      if (powerArray.length == 8) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7]);
      };
      if (powerArray.length == 9) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7], powerArray[8]);
      };
      if (powerArray.length == 10) {
        hero.addPowers("skyhighheroes:transer_system", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7], powerArray[8], powerArray[9]);
      };
    },
    /**
     * Basic keybinds
     * @param {JSHero} hero - Required
     **/
    keyBinds: (hero) => {
      hero.addKeyBind("TRANSER", "Open/Close Transer", 4);
      hero.addKeyBind("TELEKINESIS", "BrotherBand", 2);
      hero.addKeyBindFunc("CONFIRM", (entity, manager) => {
        confirmAction(entity, manager);
        return true;
      }, "Confirm", 1);
      hero.addKeyBindFunc("BACK", (entity, manager) => {
        backAction(entity, manager);
        return true;
      }, "Back", 3);
      hero.addKeyBind("SHAPE_SHIFT", "Enter command/value", 2);
    },
    setKeyBind: (entity, keyBind) => {
      if (keyBind == "TRANSER") {
        return canUseTranser(entity);
      };
      if (keyBind == "SHAPE_SHIFT") {
        return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity) && (!this.isTelekinesisButton(entity) || (this.isTelekinesisButton(entity) && !entity.getData("skyhighheroes:dyn/entering_value")));
      };
      if (keyBind == "TELEKINESIS") {
        return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity) && this.isTelekinesisButton(entity) && entity.getData("skyhighheroes:dyn/entering_value");
      };
      if (keyBind == "CONFIRM") {
        return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity);
      };
      if (keyBind == "BACK") {
        return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity);
      };
      return true;
    },
    /**
     * EM wave change stuff
     * @param {JSHero} hero - Required
     **/
    initEMWaveChange: (hero) => {
      if (emBeingIndex > -1) {
        modules[emBeingIndex].keyBinds(hero);
      };
      if (emBeingIndex > -1 && modules[emBeingIndex].hasOwnProperty("canAim")) {
        hero.supplyFunction("canAim", entity => modules[emBeingIndex].canAim(entity));
      };
      if (waveChangeIndex > -1) {
        modules[waveChangeIndex].keyBinds(hero);
        modules[waveChangeIndex].initDamageProfiles(hero);
        modules[waveChangeIndex].initProfiles(hero);
        hero.addSoundEvent("STEP", "skyhighheroes:wave_footstep");
        hero.addSoundEvent("PUNCH", "skyhighheroes:wave_punch");
      };
    },
    /**
     * Property stuff
     * @param {JSEntity} entity - Required
     * @param {string} property - Required
     * @returns property
     **/
    getProperty: function (entity, property) {
      return ((waveChangeIndex == -1) ? null : (modules[waveChangeIndex].properties(entity, property)));
    },
    /**
     * Tier override stuff
     * @param {JSEntity} entity - Required
     * @returns tier
     **/
    getTierOverride: function (entity) {
      return ((waveChangeIndex == -1) ? basicTierOverride(entity) : ((entity.getData("skyhighheroes:dyn/em_being") != emBeing) ? basicTierOverride(entity) : modules[waveChangeIndex].tierOverride(entity)));
    },
    /**
     * Attribute profile stuff
     * @param {JSEntity} entity - Required
     * @returns attribute profile
     **/
    getAttributeProfile: function (entity) {
      return ((waveChangeIndex == -1) ? null : ((entity.getData("skyhighheroes:dyn/em_being") != emBeing) ? null : modules[waveChangeIndex].attributeProfiles(entity)));
    },
    /**
     * Damage profile stuff
     * @param {JSEntity} entity - Required
     * @returns damage profile
     **/
    getDamageProfile: function (entity) {
      return ((waveChangeIndex == -1) ? null : ((entity.getData("skyhighheroes:dyn/em_being") != emBeing) ? null : modules[waveChangeIndex].damageProfiles(entity)));
    },
    /**
     * Wave calling profile
     * @param {JSHero} hero - Required
     **/
    profileWave: function (hero) {
      hero.addAttributeProfile("WAVE_CALLING", (profile) => {
        profile.addAttribute("BASE_SPEED", -1.0, 1);
        profile.addAttribute("SPRINT_SPEED", -1.0, 1);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -2.0, 1);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
      if (waveIndex > -1) {
        modules[waveIndex].otherProfile(hero);
        modules[waveIndex].selfProfile(hero);
      };
    },
    /**
     * Sets wave calling profile
     * @param {JSEntity} entity - Required
     * @returns Profile for wave calling
     **/
    getWaveProfile: function (entity) {
      return ((entity.getData("skyhighheroes:dyn/calling_timer") > 0) ? "WAVE_CALLING" : null);
    },
    /**
     * Keybind enabled stuff for em
     * @param {JSEntity} entity - Required
     * @param {string} keyBind - Required
     **/
    isKeyBindEnabled: function (entity, keyBind) {
      return ((emBeingIndex == -1) ? false : ((entity.getData("skyhighheroes:dyn/em_being") != emBeing) ? false : modules[emBeingIndex].isKeyBindEnabled(entity, keyBind))) || ((waveChangeIndex == -1) ? false : (((entity.getDataOrDefault("skyhighheroes:dyn/wave_changing_timer", 0.0) < 1) || (entity.getData("skyhighheroes:dyn/em_being") != emBeing)) ? false : modules[waveChangeIndex].isKeyBindEnabled(entity, keyBind)));
    },
    /**
     * Modifier enabled stuff for em
     * @param {JSEntity} entity - Required
     * @param {string} modifier - Required
     **/
    isModifierEnabled: function (entity, modifier) {
      if (modifier.name() == "fiskheroes:telekinesis") {
        return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity) && this.isTelekinesisButton(entity) && entity.getData("skyhighheroes:dyn/entering_value");
      };
      if (modifier.name() == "fiskheroes:shape_shifting" || modifier.name() == "fiskheroes:transformation") {
        return true;
      } else {
        return ((emBeingIndex == -1) ? false : ((entity.getData("skyhighheroes:dyn/em_being") != emBeing) ? false : modules[emBeingIndex].isModifierEnabled(entity, modifier))) || ((waveChangeIndex == -1) ? false : (((entity.getDataOrDefault("skyhighheroes:dyn/wave_changing_timer", 0.0) < 1) || (entity.getData("skyhighheroes:dyn/em_being") != emBeing)) ? false : modules[waveChangeIndex].isModifierEnabled(entity, modifier)));
      };
    },
    /**
     * Handles all transer stuff
     * @param {JSEntity} entity - Required
     * @param {JSDataManager} manager - Required
     **/
    systemHandler: (entity, manager) => {
      var nbt = mainNBT(entity);
      if (!entity.getDataOrDefault("skyhighheroes:dyn/system_init", true)) {
        if (entity.getData("skyhighheroes:dyn/selected_button") == "") {
          setButton(entity, manager, "main_contacts");
        };
        if (entity.getData("skyhighheroes:dyn/current_menu") == "") {
          setMenu(entity, manager, "main");
        };
        assignTranser(entity, manager, assignedSatellite);
        //status(entity);
        if (human != "") {
          var hexColor = hexColors[human];
          manager.setString(nbt, "hudColorSkyHigh", hexColor);
        };
        if (!nbt.hasKey("chatMode")) {
          manager.setString(nbt, "chatMode", "");
        };
        manager.setData(entity, "skyhighheroes:dyn/chat_mode", nbt.getString("chatMode"));
        //
        if (!nbt.hasKey("emBeing")) {
          manager.setString(nbt, "emBeing", "");
        };
        manager.setData(entity, "skyhighheroes:dyn/em_being", nbt.getString("emBeing"));
        manager.setData(entity, "skyhighheroes:dyn/em_being_variable", formatEMBeing(nbt.getString("emBeing")));
        //
        manager.setString(nbt, "compatibleHuman", human);
        manager.setData(entity, "skyhighheroes:dyn/compatible_human", nbt.getString("compatibleHuman"));
        //
        manager.setString(nbt, "compatibleUUID", compatibleUUID);
        manager.setData(entity, "skyhighheroes:dyn/compatible_uuid", nbt.getString("compatibleUUID"));
        //
        manager.setString(nbt, "waveChange", waveChange);
        manager.setData(entity, "skyhighheroes:dyn/wave_change", nbt.getString("waveChange"));
        //
        manager.setString(nbt, "waveColor", waveColor);
        manager.setData(entity, "skyhighheroes:dyn/wave_color", nbt.getString("waveColor"));
        //
        onInitSystemIndexes.forEach(index => {
          var module = modules[index];
          module.onInitSystem(entity, manager);
        });
        manager.setData(entity, "skyhighheroes:dyn/system_init", true);
        manager.setData(entity, "fiskheroes:penetrate_martian_invis", false);
      };
      if (entity.getDataOrDefault("skyhighheroes:dyn/system_init", false)) {
        if (entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && canUseTranser(entity) && this.isTelekinesisButton(entity) && entity.getData("skyhighheroes:dyn/entering_value")) {
          if (entity.getData("fiskheroes:grab_id") > -1) {
            manager.setData(entity, "fiskheroes:disguise", "" + entity.getData("fiskheroes:grab_id") + "");
          };
        };
        if (typeof entity.getData("fiskheroes:disguise") === "string") {
          if (!(entity.getData("fiskheroes:disguise") == waveChange || entity.getData("fiskheroes:disguise") == human)) {
            if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
              manager.setData(entity, "skyhighheroes:dyn/entry", entity.getData("fiskheroes:disguise"));
              manager.setData(entity, "fiskheroes:disguise", waveChange);
            } else {
              manager.setData(entity, "skyhighheroes:dyn/entry", entity.getData("fiskheroes:disguise"));
              manager.setData(entity, "fiskheroes:disguise", null);
              if (typeof human === "string") {
                manager.setData(entity, "fiskheroes:disguise", human);
              };
            };
            manager.setData(entity, "fiskheroes:shape_shifting_to", null);
            manager.setData(entity, "fiskheroes:shape_shifting_from", null);
            manager.setData(entity, "fiskheroes:shape_shift_timer", 0);
            var entry = entity.getData("skyhighheroes:dyn/entry");
            if (entry.startsWith("!")) {
              manager.setData(entity, "skyhighheroes:dyn/entry", entry.substring(1));
              var args = entity.getData("skyhighheroes:dyn/entry").split(" ");
              switch (args[0]) {
                case "systemInfo":
                  systemInfo(entity);
                  break;
                case "status":
                  status(entity);
                  break;
                case "cv":
                  entity.as("PLAYER").addChatMessage(entity.getDataOrDefault("skyhighheroes:dyn/" + args[1], 0));
                  break;
                case "waveCalling":
                  if (entity.getUUID() == getCompatibleUUID(entity) && (emBeingIndex > -1 && waveChangeIndex > -1 && waveIndex > -1) && entity.as("PLAYER").isCreativeMode()) {
                    manager.setDataWithNotify(entity, "skyhighheroes:dyn/calling", true);
                  } else {
                    systemMessage(entity, "<e>Unknown command! Try <eh>!help<e> for a list of commands!");
                  };
                  break;
                case "help":
                  systemMessage(entity, "<n>Available commands:");
                  commandIndexes.forEach(index => {
                    var module = modules[index];
                    if (!isModuleDisabled(entity, module.name)) {
                      systemMessage(entity, module.helpMessage);
                    };
                  });
                  systemMessage(entity, "<n>!status <nh>-<n> Shows your current status");
                  systemMessage(entity, "<n>!systemInfo <nh>-<n> Shows your system info");
                  if (entity.getUUID() == getCompatibleUUID(entity) && (emBeingIndex > -1 && waveChangeIndex > -1 && waveIndex > -1) && entity.as("PLAYER").isCreativeMode()) {
                    systemMessage(entity, "<n>!waveCalling <nh>-<n> Calls down your em being");
                  };
                  systemMessage(entity, "<n>!help <nh>-<n> Shows this list");
                  break;
                case "disable":
                  disableModule(entity, manager, moduleNames, args[1]);
                  break;
                case "enable":
                  enableModule(entity, manager, moduleNames, args[1]);
                  break;
                case "chatMode":
                  switchChatModes(entity, manager, args[1]);
                  break;
                case "msg":
                  switchChats(entity, manager, args[1]);
                  break;
                default:
                  var index = commands.indexOf(args[0]);
                  if (index > -1) {
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
                var name = null;
                if ((typeof waveChangeIndex === "undefined") ? false : waveChangeIndex > -1) {
                  if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
                    name = waveColor+waveChange+"\u00A7r";
                  } else {
                    name = human;
                  };
                } else {
                  name = entity.getName();
                };
                var chatMode = chatModes.indexOf(nbt.getString("chatMode"));
                if (chatMode > -1) {
                  var chatModule = modules[messagingIndexes[chatMode]];
                  chatModule.messageHandler(entity, name, 32);
                };
              };
            };
          };
        };
        if (waveIndex > -1) {
          if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/em_being") != emBeing)) {
            modules[waveIndex].waveCalling(entity, manager);
          };
        };
        if (typeof human === "string" && entity.getData("skyhighheroes:dyn/wave_changing_timer") < 1) {
          manager.setData(entity, "fiskheroes:disguise", human);
        };
        if (typeof waveChange === "string" && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
          manager.setData(entity, "fiskheroes:disguise", waveChange);
        };
      };
      if (entity.getData("skyhighheroes:dyn/transer") && !entity.getData("skyhighheroes:dyn/entering_value")) {
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
            manager.setData(entity, "skyhighheroes:dyn/button_coolingdown", false);
          };
          if (entity.getData("skyhighheroes:dyn/button_cooldown") == 0) {
            var buttonIndex = buttonIDs.indexOf(entity.getData("skyhighheroes:dyn/selected_button"));
            if (buttonIndex > -1) {
              var borderingButtons = buttonBorders[buttonIndex];
              var properties = buttonProperties[buttonIndex];
              //Up
              if (forward < negative_threshold) {
                if (borderingButtons.hasOwnProperty("top")) {
                  setButton(entity, manager, borderingButtons["top"]);
                };
                if (properties.hasOwnProperty("upAction")) {
                  properties.upAction(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/button_coolingdown", true);
              };
              //Down
              if (forward > positive_threshold) {
                if (borderingButtons.hasOwnProperty("bottom")) {
                  setButton(entity, manager, borderingButtons["bottom"]);
                };
                if (properties.hasOwnProperty("downAction")) {
                  properties.downAction(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/button_coolingdown", true);
              };
              //Left
              if (strafe < negative_threshold) {
                if (borderingButtons.hasOwnProperty("left")) {
                  setButton(entity, manager, borderingButtons["left"]);
                };
                if (properties.hasOwnProperty("leftAction")) {
                  properties.leftAction(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/button_coolingdown", true);
              };
              //Right
              if (strafe > positive_threshold) {
                if (borderingButtons.hasOwnProperty("right")) {
                  setButton(entity, manager, borderingButtons["right"]);
                };
                if (properties.hasOwnProperty("rightAction")) {
                  properties.rightAction(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/button_coolingdown", true);
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
    },
    waveHandler: function (entity, hero) {
      if (entity.getDataOrDefault("skyhighheroes:dyn/system_init", false) && waveIndex > -1) {
        if (PackLoader.getSide() == "SERVER") {
          modules[waveIndex].waveHandler(entity, hero);
        };
      };
    },
    /**
     * Handles all em stuff
     * @param {JSEntity} entity - Required
     * @param {JSDataManager} manager - Required
     **/
    emWaveHandler: (entity, manager) => {
      if (entity.getDataOrDefault("skyhighheroes:dyn/system_init", false) && (entity.getDataOrDefault("skyhighheroes:dyn/em_being", "") == emBeing) && (waveChangeIndex > -1) && (emBeingIndex > -1)) {
        modules[waveChangeIndex].tickHandler(entity, manager);
        modules[emBeingIndex].tickHandler(entity, manager);
      };
    }
  };
};