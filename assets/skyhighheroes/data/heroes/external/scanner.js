var tmfAliens = [
  "Heatblast",
  "Wildmutt",
  "Diamondhead",
  "XLR8",
  "Grey Matter",
  "Four Arms",
  "Stinkfly",
  "Ripjaws",
  "Upgrade",
  "Ghostfreak",
  "Heatjaws",
  "Stinkarms",
  "Diamondmatter",
  "13",
  "14",
  "15",
  "Cannonbolt",
  "Wildvine",
  "Blitzwolfer",
  "Snare-oh",
  "Frankenstrike",
  "Zs'Skayr",
  "Upchuck",
  "Ditto",
  "Eyeguy",
  "Waybig"
];

var transformedVars = [
  "fiskheroes:dyn/nanite_timer",
  "dhhp:dyn/helmet_timer",
  "nameless:dyn/backpack_timer",
  "nameless:dyn/symbiote_timer",
  "sabri:dyn/vibranium_nanite_timer",
  "secretheroes:dyn/hulk_timer",
  "stellar:dyn/danny_phantom_transform_timer",
  "tmf:dyn/transform_timer",
  "jmctheroes:dyn/fate_timer",
  "jmctheroes:dyn/beetle_timer",
  "jmctheroes:dyn/suit_timer",
  "stellar:dyn/suit_timer",
  "pwt:dyn/symbiot_timer",
  "jmctheroes:dyn/symbiote_timer",
  "skarredheroes:dyn/scarab_timer",
  "sind:dyn/b_timer_model",
  "sind:dyn/b_timer",
  "sind:dyn/mark42_full_timer",
  "sind:dyn/mark42_full_timer2",
  "sind:dyn/nanite_timer",
  "ironmaniac:dyn/mk5_timer",
  "secretheroes:dyn/moonknight_timer",
  "secretheroes:dyn/mrknight_timer",
  "skyhighocs:dyn/wave_changing_timer",
  "skyhighheroes:dyn/wave_changing_timer",
];

function isTransformed(entity) {
  var transformed = false;
  transformedVars.forEach(variable => {
    if (!transformed) {
      transformed = (entity.getDataOrDefault(variable, 1) == 1);
    };
  });
  return transformed;
};

/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  /**
   * Scans for nearby entities
   * @param {JSEntity} entity - Player initiating the scan
   **/
  function entityScan(entity, range) {
    var maxRange = 64;
    var minRange = 1;
    var defaultRange = 32;
    var radius = 0;
    if (typeof range === "undefined") {
      radius = defaultRange;
    } else {
      radius = range;
    };
    if ((minRange <= radius) && (radius <= maxRange)) {
      system.moduleMessage(this, entity, "<n>Scanning for entities at a range of <nh>" + radius + "<n>!");
      var entityList = entity.world().getEntitiesInRangeOf(entity.pos(), radius);
      var entities = [];
      entityList.forEach(thing => {
        if (!thing.getName().startsWith("item.") && !(thing.getName() == "Experience Orb")) {
          entities.push(thing);
        };
      });
      system.moduleMessage(this, entity, "<n>There " + ((entities.length == 1)?"is <nh>":"are <nh>") + entities.length + ((entities.length == 1)?"<n> entity ":"<n> entities ") + "nearby:");
      entities.forEach(scannedEntity => {
        if (scannedEntity.isAlive()) {
          var beingName = scannedEntity.getName();
          if (scannedEntity.isWearingFullSuit()) {
            if (!scannedEntity.getWornHelmet().isEmpty()) {
              var itemName = scannedEntity.getWornHelmet().displayName().split("'s");
              beingName = itemName[0];
            };
            if (!scannedEntity.getWornChestplate().isEmpty()) {
              var itemName = scannedEntity.getWornChestplate().displayName().split("'s");
              beingName = itemName[0];
            };
            if (!scannedEntity.getWornLeggings().isEmpty()) {
              var itemName = scannedEntity.getWornLeggings().displayName().split("'s");
              beingName = itemName[0];
            };
            if (!scannedEntity.getWornBoots().isEmpty()) {
              var itemName = scannedEntity.getWornBoots().displayName().split("'s");
              beingName = itemName[0];
            };
            if (!isTransformed(scannedEntity)) {
              beingName = scannedEntity.getName();
            };
            if (entity.getDataOrDefault("secretheroes:dyn/moonknight_timer", 0) == 1) {
              beingName = "Moon Knight";
            };
            if (entity.getDataOrDefault("secretheroes:dyn/mrknight_timer", 0) == 1) {
              beingName = "Mr Knight";
            };
            if (scannedEntity.getWornChestplate().suitType() == "tmf:omnitrix" && scannedEntity.getDataOrDefault("tmf:dyn/transformed", -1) > -1) {
              var alien = scannedEntity.getData("tmf:dyn/transformed") + 0;
              system.moduleMessage(this, entity, alien);
              beingName = tmfAliens[alien];
            };
            if (isTransformed(scannedEntity) && ((scannedEntity.getData("fiskheroes:mask_open_timer2") == 1) || (scannedEntity.getData("fiskheroes:mask_open_timer") == 5))) {
              beingName = scannedEntity.getName();
            };
            if (scannedEntity.getData("fiskheroes:disguise") != null) {
              beingName = scannedEntity.getData("fiskheroes:disguise");
            };
          };
        };
        system.moduleMessage(this, entity, "<nh>" + beingName + " <n>(<nh>" + scannedEntity.getHealth() + "<n>)");
      });
    } else {
      if (radius > maxRange) {
        system.moduleMessage(this, entity, "<e>Range of <eh>" + radius + " <e>is too large! Must be at most <eh>64<e>!");
      };
      if (radius <= minRange) {
        system.moduleMessage(this, entity, "<e>Range of <eh>" + radius + " <e>is too small! Must be at least <eh>1<e>!");
      };
    };
  };
  return {
    name: "scanner",
    moduleMessageName: "Scanner",
    type: 1,
    command: "sc",
    helpMessage: "<n>!sc <nh>-<n> Scanner",
    disabledMessage: "<e>Module <eh>scanner<e> is disabled!",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch(argList[1]) {
          case "entity":
            (argList.length == 3) ? entityScan(entity, argList[2]) : entityScan(entity);
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Scanner commands:");
            system.moduleMessage(this, entity, "<n>!sc entity <nh><range><n> <nh>-<n> Scans for entities around you");
            system.moduleMessage(this, entity, "<n>!sc help <nh>-<n> Shows scanner commands");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>scanner<e> command! Try <eh>!sc help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>scanner<e> command! Try <eh>!sc help<e> for a list of commands!");
      };
    },
  };
};