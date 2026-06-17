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

var hexColors = {
  "Ares": "0xFF0000",
  "Aero": "0xFF8900",
  "Artemis": "0xFF0000",
  "Apollo": "0x55FF00",
  "Vulcan": "0x8000FF"
};

function asssignID(entity, manager) {
  var nbt = mainNBT(entity);
  if (!nbt.hasKey("computerID")) {
    if (PackLoader.getSide() == "SERVER") {
      var computerID = Math.random().toFixed(8).toString().substring(2);
      manager.setString(nbt, "computerID", computerID);
    };
  };
};

/**
 * Checks if an entity is wearing a robot
 * @param {JSEntity} entity - Entity getting checked
 * @returns If the entity is wearing a robot
 **/
function isRobot(entity) {
  return mainNBT(entity).hasKey("robotModelID");
};

/**
 * Gets the satellite a robot is assigned to
 * @param {JSEntity} entity - Entity getting checked
 * @returns The satellite a robot is assigned to
 **/
function getModel(entity) {
  return entity.getData("skyhighheroes:dyn/model_id");
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

/**
 * Number degree to a cardinal direction
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Cardinal direction
 **/
function angleToDirection(angle) {
  var direction = angle;
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

function mainNBT(entity) {
  return entity.getWornLeggings().nbt();
};

function getMainNBT(entity) {
  if (entity.isWearingFullSuit()) {
    if (entity.getWornHelmet().nbt().hasKey("computerID")) {
      return entity.getWornHelmet().nbt();
    };
    if (entity.getWornChestplate().nbt().hasKey("computerID")) {
      return entity.getWornChestplate().nbt();
    };
    if (entity.getWornLeggings().nbt().hasKey("computerID")) {
      return entity.getWornLeggings().nbt();
    };
    if (entity.getWornBoots().nbt().hasKey("computerID")) {
      return entity.getWornBoots().nbt();
    };
  };
  return null;
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
      systemMessage(entity, "<s>Module <sh>" + moduleName + "<s> disabled!");
    } else {
      var disabledModules = nbt.getStringList("disabledModules");
      var disabledModulesIndex = getStringArray(disabledModules).indexOf(moduleName);
      if (disabledModulesIndex > -1) {
        systemMessage(entity, "<e>You have already disabled module <eh>" + moduleName + "<e>!");
      } else {
        systemMessage(entity, "<s>Module <sh>" + moduleName + "<s> disabled!");
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
  chatMessage(entity, formatSystem("\u00A7" + color + "\u00A7lastrOS<r>> " + message));
};
/**
 * Sends message from module
 * @param {object} module - Reference 'this' module
 * @param {JSEntity} entity - Entity recieving message
 * @param {string} message - Message content
 **/
function moduleMessage(module, entity, message) {
  var messageName = "\u00A7lastrOS";
  if (module.hasOwnProperty("moduleMessageName")) {
    messageName = module.moduleMessageName;
  };
  var color = entity.getData("skyhighheroes:dyn/color");
  chatMessage(entity, formatSystem("\u00A7" + color + messageName + "<r>> " + message));
};
/**
 * Sends message in group format
 * @param {string} message - Entity recieving message
 **/
function logMessage(message) {
  if (logMessages) {
    PackLoader.print("skyhighheroes: " + message);
  };
};

/**
 * Initializes robot system
 * @param {object} moduleList - robot system modules
 * @param {string} name - Required, you'll be happy that is a thing or else debugging is painful
 * @param {string} colorCode - Required, or other robots will not recognize this robot as a robot
 **/
function initSystem(moduleList, name, colorCode) {
  var robotInstance = this;
  //Type 1 - commands (can have data management)
  var type1Specs = ["command", "commandHandler", "helpMessage"];
  //Type 2 - messaging only
  var type2Specs = ["messageHandler", "chatModeInfo", "chatInfo", "modeID"];
  //Type 3 - commands messaging and data management
  var type3Specs = ["command", "messageHandler", "commandHandler", "chatModeInfo", "chatInfo", "helpMessage", "modeID"];
  //Type 5 - Robot module
  var type5Specs = ["isModifierEnabled", "isModifierDisabled", "powers"];
  //Type 6 - Robot module
  var type6Specs = ["keyBinds", "isKeyBindEnabled", "isKeyBindDisabled", "isModifierEnabled", "isModifierDisabled", "powers"];
  /** @var modules - Array of modules */
  var modules = [];
  /** @var moduleNames - Module names */
  var moduleNames = [];
  /** @var robotModules - Robot module names */
  var robotModules = [];
  /** @var commands - Command prefixes */
  var commands = [];
  /** @var commandIndexes - Indexes of command handlers */
  var commandIndexes = [];
  /** @var onInitSystemIndexes - Indexes of system init capable modules */
  var onInitSystemIndexes = [];
  /** @var messagingIndexes - Indexes of messaging handlers */
  var messagingIndexes = [];
  /** @var chatModes - Chat modes */
  var chatModes = [];
  /** @var modifierIndexes - Indexes of power modules */
  var modifierIndexes = [];
  /** @var keyBindIndexes - Indexes of power modules */
  var keyBindIndexes = [];
  /** @var powerArray - Array of powers to add */
  var powerArray = [];
  /** @var robotName - Name of robot */
  var robotName = name;
  /** @var color - Color of robot */
  var color = colorCode;
  /** @var robotModelID - robot model name */
  var robotModelID = name+"-"+colorCode;
  var hasError = false;
  var errors = [];
  logMessage("Attempting to initialize " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on robot " + robotName + "!");
  moduleList.forEach(module => {
    if (module.hasOwnProperty("initModule")) {
      var moduleInit = module.initModule(robotInstance);
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on robot " + robotName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on robot " + robotName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
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
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on robot " + robotName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
            };
            hasError = false;
            break;
          case 5:
            type5Specs.forEach(spec => {
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
              robotModules.push(moduleInit.name);
              var modulePowers = moduleInit.powers;
              modulePowers.forEach(power => {
                powerArray.push(power);
              });
              modifierIndexes.push(modules.length-1);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on robot " + robotName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
              };
            };
            hasError = false;
            break;
          case 6:
            type6Specs.forEach(spec => {
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
              robotModules.push(moduleInit.name);
              var modulePowers = moduleInit.powers;
              modulePowers.forEach(power => {
                powerArray.push(power);
              });
              keyBindIndexes.push(modules.length-1);
              modifierIndexes.push(modules.length-1);
              logMessage("Module \"" + moduleInit.name + "\" was initialized successfully on robot " + robotName + "!");
              if (moduleInit.hasOwnProperty("onInitSystem")) {
                onInitSystemIndexes.push(modules.length-1);
                logMessage("Module \"" + moduleInit.name + "\" has optional spec \"onInitSystem\"!");
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
  logMessage("Successfully initialized " + modules.length + " out of " + ((moduleList.length > 1) ? moduleList.length + " modules" : moduleList.length + " module") + " on robot " + robotName + "!");
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
    systemMessage(entity, "<n>astrOS");
    systemMessage(entity, modulesMessage);
    systemMessage(entity, "<n>computerID: <nh>" + getMainNBT(entity).getString("computerID"));
  };
  function status(entity) {
    var date = new Date();
    systemMessage(entity, "<n>Date: <nh>" + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear());
    systemMessage(entity, "<n>Time: <nh>" + date.getHours() + ":" + ((date.getMinutes() > 9) ? date.getMinutes() : "0"+date.getMinutes()));
    systemMessage(entity, "<n>Current location: <nh>" + entity.posX().toFixed(0) + "<n>, <nh>" + entity.posY().toFixed(0) + "<n>, <nh>" + entity.posZ().toFixed(0));
    systemMessage(entity, "<n>Biome: <nh>" + entity.world().getLocation(entity.pos()).biome());
    systemMessage(entity, "<n>Do <nh>!help<n> for available commands!");
  };
  return {
    /**
     * Power stuff (I hate that I had to do it this way)
     * @param {JSHero} hero - Required
     **/
    addPowers: (hero) => {
      if (powerArray.length == 1) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine");
      };
      if (powerArray.length == 1) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0]);
      };
      if (powerArray.length == 2) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1]);
      };
      if (powerArray.length == 3) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2]);
      };
      if (powerArray.length == 4) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3]);
      };
      if (powerArray.length == 5) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4]);
      };
      if (powerArray.length == 6) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5]);
      };
      if (powerArray.length == 7) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6]);
      };
      if (powerArray.length == 8) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7]);
      };
      if (powerArray.length == 9) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7], powerArray[8]);
      };
      if (powerArray.length == 10) {
        hero.addPowers("skyhighheroes:astro_system", "skyhighheroes:astro_body", "skyhighheroes:astro_engine", powerArray[0], powerArray[1], powerArray[2], powerArray[3], powerArray[4], powerArray[5], powerArray[6], powerArray[7], powerArray[8], powerArray[9]);
      };
    },
    /**
     * Basic keybinds
     * @param {JSHero} hero - Required
     **/
    keyBinds: (hero) => {
      hero.addKeyBind("SHAPE_SHIFT", "Send message/Enter command", 5);
      modules.forEach(module => {
        if (module.hasOwnProperty("keyBinds")) {
          module.keyBinds(hero);
        };
      });
    },
    profiles: function (hero) {
      hero.addAttributeProfile("SHUT_DOWN", function (profile) {
        profile.addAttribute("BASE_SPEED", -1.0, 1);
        profile.addAttribute("SPRINT_SPEED", -1.0, 1);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("STEP_HEIGHT", -1.0, 1);
        profile.addAttribute("KNOCKBACK", -1.0, 1);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
      hero.setAttributeProfile(entity => {
        return (entity.getData("skyhighheroes:dyn/powering_down_timer") > 0) ? "SHUT_DOWN" : null;
      });
    },
    /**
     * Keybind enabled stuff for em
     * @param {JSEntity} entity - Required
     * @param {string} keyBind - Required
     **/
    isKeyBindEnabled: function (entity, keyBind) {
      if (entity.getData("skyhighheroes:dyn/powering_down_timer") > 0) {
        return false;
      };
      if (keyBindIndexes.length == 1) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 2) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 3) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 4) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 5) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[4]].name)) ? modules[keyBindIndexes[4]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 6) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[4]].name)) ? modules[keyBindIndexes[4]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[5]].name)) ? modules[keyBindIndexes[5]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 7) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[4]].name)) ? modules[keyBindIndexes[4]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[5]].name)) ? modules[keyBindIndexes[5]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[6]].name)) ? modules[keyBindIndexes[6]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 8) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[4]].name)) ? modules[keyBindIndexes[4]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[5]].name)) ? modules[keyBindIndexes[5]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[6]].name)) ? modules[keyBindIndexes[6]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[7]].name)) ? modules[keyBindIndexes[7]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind));
      };
      if (keyBindIndexes.length == 9) {
        return ((isModuleDisabled(entity, modules[keyBindIndexes[0]].name)) ? modules[keyBindIndexes[0]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[0]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[1]].name)) ? modules[keyBindIndexes[1]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[1]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[2]].name)) ? modules[keyBindIndexes[2]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[2]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[3]].name)) ? modules[keyBindIndexes[3]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[3]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[4]].name)) ? modules[keyBindIndexes[4]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[4]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[5]].name)) ? modules[keyBindIndexes[5]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[5]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[6]].name)) ? modules[keyBindIndexes[6]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[6]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[7]].name)) ? modules[keyBindIndexes[7]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[7]].isKeyBindEnabled(entity, keyBind)) || ((isModuleDisabled(entity, modules[keyBindIndexes[8]].name)) ? modules[keyBindIndexes[8]].isKeyBindDisabled(entity, keyBind) : modules[keyBindIndexes[8]].isKeyBindEnabled(entity, keyBind));
      };
    },
    /**
     * Modifier enabled stuff for em
     * @param {JSEntity} entity - Required
     * @param {string} modifier - Required
     **/
    isModifierEnabled: function (entity, modifier) {
      if (entity.getData("skyhighheroes:dyn/powering_down_timer") > 0) {
        return false;
      };
      if (modifierIndexes.length == 1) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 2) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 3) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 4) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 5) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[4]].name)) ? modules[modifierIndexes[4]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[4]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 6) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[4]].name)) ? modules[modifierIndexes[4]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[4]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[5]].name)) ? modules[modifierIndexes[5]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[5]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 7) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[4]].name)) ? modules[modifierIndexes[4]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[4]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[5]].name)) ? modules[modifierIndexes[5]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[5]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[6]].name)) ? modules[modifierIndexes[6]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[6]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 8) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[4]].name)) ? modules[modifierIndexes[4]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[4]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[5]].name)) ? modules[modifierIndexes[5]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[5]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[6]].name)) ? modules[modifierIndexes[6]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[6]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[7]].name)) ? modules[modifierIndexes[7]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[7]].isModifierEnabled(entity, modifier));
      };
      if (modifierIndexes.length == 9) {
        return ((isModuleDisabled(entity, modules[modifierIndexes[0]].name)) ? modules[modifierIndexes[0]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[0]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[1]].name)) ? modules[modifierIndexes[1]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[1]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[2]].name)) ? modules[modifierIndexes[2]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[2]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[3]].name)) ? modules[modifierIndexes[3]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[3]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[4]].name)) ? modules[modifierIndexes[4]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[4]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[5]].name)) ? modules[modifierIndexes[5]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[5]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[6]].name)) ? modules[modifierIndexes[6]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[6]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[7]].name)) ? modules[modifierIndexes[7]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[7]].isModifierEnabled(entity, modifier)) || ((isModuleDisabled(entity, modules[modifierIndexes[8]].name)) ? modules[modifierIndexes[8]].isModifierDisabled(entity, modifier) : modules[modifierIndexes[8]].isModifierEnabled(entity, modifier));
      };
    },
    /**
     * Handles all robot stuff
     * @param {JSEntity} entity - Required
     * @param {JSDataManager} manager - Required
     **/
    systemHandler: (entity, manager) => {
      var nbt = mainNBT(entity);
      if (!entity.getDataOrDefault("skyhighheroes:dyn/system_init", true) && entity.getData("skyhighheroes:dyn/powering_down_timer") == 0) {
        manager.setData(entity, "skyhighheroes:dyn/color", color);
        asssignID(entity, manager);
        status(entity);
        var hexColor = hexColors[robotName];
        manager.setString(nbt, "hudColorSkyHigh", hexColor);
        if (!nbt.hasKey("chatMode")) {
          manager.setString(nbt, "chatMode", "");
        };
        manager.setData(entity, "skyhighheroes:dyn/chat_mode", nbt.getString("chatMode"));
        manager.setString(nbt, "robotModelID", robotModelID);
        manager.setData(entity, "skyhighheroes:dyn/model_id", nbt.getString("robotModelID"));
        onInitSystemIndexes.forEach(index => {
          var module = modules[index];
          module.onInitSystem(entity, manager);
        });
        manager.setData(entity, "skyhighheroes:dyn/system_init", true);
        manager.setData(entity, "fiskheroes:penetrate_martian_invis", false);
      };
      if (entity.getDataOrDefault("skyhighheroes:dyn/system_init", false)) {
        if (typeof entity.getData("fiskheroes:disguise") === "string") {
          if (!(entity.getData("fiskheroes:disguise") == robotName)) {
            manager.setData(entity, "skyhighheroes:dyn/entry", entity.getData("fiskheroes:disguise"));
            manager.setData(entity, "fiskheroes:disguise", robotName);
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
                case "powerOff":
                  manager.setData(entity, "skyhighheroes:dyn/powered_down", true);
                  systemMessage(entity, "<n>Powering down!");
                  break;
                case "powerOn":
                  manager.setData(entity, "skyhighheroes:dyn/powered_down", false);
                  systemMessage(entity, "<n>Powering on!");
                  break;
                case "help":
                  systemMessage(entity, "<n>Available commands:");
                  commandIndexes.forEach(index => {
                    var module = modules[index];
                    if (!isModuleDisabled(entity, module.name) && entity.getData("skyhighheroes:dyn/powering_down_timer") == 0) {
                      systemMessage(entity, module.helpMessage);
                    };
                  });
                  systemMessage(entity, "<n>!status <nh>-<n> Shows your current status");
                  systemMessage(entity, "<n>!systemInfo <nh>-<n> Shows your system info");
                  systemMessage(entity, "<n>!powerOn <nh>-<n> Powers you up");
                  systemMessage(entity, "<n>!powerOff <nh>-<n> Powers you down");
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
                  if (index > -1 && entity.getData("skyhighheroes:dyn/powering_down_timer") == 0) {
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
              }
            } else {
              var chatMode = chatModes.indexOf(nbt.getString("chatMode"));
              if (chatMode > -1) {
                var chatModule = modules[messagingIndexes[chatMode]];
                chatModule.messageHandler(entity, name, 32);
              };
            };
          };
        };
        manager.setData(entity, "fiskheroes:disguise", robotName);
      };
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
      if (PackLoader.getSide() == "SERVER" && entity.getData("skyhighheroes:dyn/powering_down_timer") < 1 && entity.getData("skyhighheroes:dyn/powering_down_timer") > 0) {
        var moduleTotal = robotModules.length;
        var moduleTime = (200/moduleTotal).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/powering_down_timer")*200);
        if (currentTime % moduleTime == 0) {
          var moduleName = robotModules[(currentTime/moduleTime)-1];
          var message = entity.getData("skyhighheroes:dyn/powered_down") ? "<n>Shutting down <nh>" + moduleName + "<n>!" : "<n>Starting up <nh>" + moduleName + "<n>!";
          systemMessage(entity, message);
        };
      };
    }
  };
};