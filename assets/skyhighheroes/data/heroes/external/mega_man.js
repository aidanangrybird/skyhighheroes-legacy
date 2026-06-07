/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  //All of the required functions and stuff go here
  return {
    name: "megaMan",
    type: 9,
    waveChange: "Mega Man",
    color: "\u00A7b",
    human: "Geo Stelar",
    powers: [
      "skyhighheroes:em_wave_being",
      "skyhighheroes:battle_cards_geo"
    ],
    keyBinds: function (hero) {
      hero.addKeyBind("TELEPORT", "Transmit", 1);
      hero.addKeyBind("BATTLE_CARD_0", "Return To Mega Buster", 2);
      hero.addKeyBind("BATTLE_CARD_1", "Battle Card! Barrier!", 2);
      hero.addKeyBind("BATTLE_CARD_2", "Battle Card! Sword!", 2);
      hero.addKeyBind("BATTLE_CARD_3", "Battle Card! Cannon!", 2);
      hero.addKeyBind("BATTLE_CARD_4", "Battle Card! Jet Attack!", 2);
      hero.addKeyBind("BATTLE_CARD_5", "Battle Card! Knuckle!", 2);
      hero.addKeyBind("INVISIBILITY", "Wave World", 3);
      hero.addKeyBind("AIM_CANNON", "Aim Cannon", 4);
      hero.addKeyBind("INTANGIBILITY", "Become in Phase", 5);
    },
    tierOverride: function (entity) {
      if ((entity.getData("skyhighheroes:dyn/wave_changing_timer") > 0) && (entity.getData("skyhighheroes:dyn/wave_changing_timer") < 1)) {
        return 1;
      };
      return (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) ? 10 : 0;
    },
    properties: function (entity, property) {
      return ((property == "BREATHE_SPACE") || (property == "MASK_TOGGLE")) && ((entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) || (entity.as("DISPLAY").getDisplayType() == "BOOK_PREVIEW") || (entity.as("DISPLAY").getDisplayType() == "DISPLAY_STAND"));
    },
    initDamageProfiles: function (hero) {
      hero.addDamageProfile("SWORD", {
        "types": {
          "ELEMENT_SWORD": 1.0
        }
      });
      hero.addDamageProfile("MAIN", {
        "types": {
          "ELEMENT_NONE": 1.0
        }
      });
    },
    damageProfiles: function (entity) {
      var result = null;
      if (entity.getData("skyhighheroes:dyn/sword_blade_timer") == 1 && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
        result = "SWORD";
      };
      return (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) ? "MAIN" : result;
    },
    initProfiles: function (hero) {
      hero.addAttribute("SPRINT_SPEED", 0.2, 1);
      hero.addAttribute("STEP_HEIGHT", 0.5, 0);
      hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
      hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
      hero.addAttribute("KNOCKBACK", 2.5, 0);
      hero.addAttribute("IMPACT_DAMAGE", 50.0, 0);
      hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
      hero.addAttributeProfile("SWORD", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 0.5, 1);
        profile.addAttribute("KNOCKBACK", 5.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", 14.5, 0);
      });
      hero.addAttributeProfile("SHIELD", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -0.75, 1);
        profile.addAttribute("SPRINT_SPEED", 0.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("STEP_HEIGHT", -1.0, 1);
        profile.addAttribute("KNOCKBACK", 0.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
      });
      hero.addAttributeProfile("KNUCKLE", function (profile) {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 0.5, 1);
        profile.addAttribute("KNOCKBACK", 20.0, 0);
        profile.addAttribute("PUNCH_DAMAGE", 14.5, 0);
      });
    },
    attributeProfiles: function (entity) {
      if (entity.getData("fiskheroes:shield_blocking")) {
        return "SHIELD";
      };
      if (entity.getData("skyhighheroes:dyn/sword_blade_timer") == 1) {
        return "SWORD";
      };
      if (entity.getData("skyhighheroes:dyn/knuckle_timer") == 1) {
        return "KNUCKLE";
      };
      if (entity.getData("skyhighheroes:dyn/sword_blade_timer") < 1 && !entity.getData("fiskheroes:shield_blocking")) {
        return null;
      };
    },
    isKeyBindEnabled: function (entity, keyBind) {
      var result = false;
      if (keyBind == "CYCLE_CHATS_EM") {
        result = !entity.isSneaking() && entity.getData("skyhighheroes:dyn/battle_card") == 0 && entity.getData("skyhighheroes:dyn/omega_xis_timer") == 1;
      };
      if (keyBind == "CYCLE_CHAT_MODES_EM") {
        result = entity.isSneaking() && entity.getData("skyhighheroes:dyn/battle_card") == 0 && entity.getData("skyhighheroes:dyn/omega_xis_timer") == 1;
      };
      if (keyBind == "INTANGIBILITY") {
        result = entity.getData("fiskheroes:flight_timer") > 0;
      };
      if (keyBind == "TELEPORT" || keyBind == "INVISIBILITY") {
        result = !entity.getData("skyhighheroes:dyn/transer");
      };
      if (keyBind == "BATTLE_CARD_0") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 0;
      };
      if (keyBind == "BATTLE_CARD_1") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 1;
      };
      if (keyBind == "BATTLE_CARD_2") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 2;
      };
      if (keyBind == "BATTLE_CARD_3") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 3;
      };
      if (keyBind == "BATTLE_CARD_4") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 4;
      };
      if (keyBind == "BATTLE_CARD_5") {
        result = entity.getData("fiskheroes:gravity_manip") && entity.getData("skyhighheroes:dyn/selected_battle_card") == 5;
      };
      if (keyBind == "AIM_CANNON") {
        result = entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/battle_card") == 3;
      };
      return result;
    },
    isModifierEnabled: function (entity, modifier) {
      var result = false;
      if (modifier.name() == "fiskheroes:potion_immunity") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:controlled_flight") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:teleportation") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:wall_crawling") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:intangibility") {
        if (modifier.id() == "not_absolute") {
          result = entity.getPunchTimer() > 0;
        };
        if (modifier.id() == "absolute") {
          result = entity.getPunchTimer() == 0;
        };
      };
      if (modifier.name() == "fiskheroes:regeneration") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:healing_factor") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:water_breathing") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:invisibility") {
        result = true;
      };
      if (modifier.name() == "fiskheroes:fire_immunity") {
        result = entity.getData("fiskheroes:invisible");
      };
      if (modifier.name() == "fiskheroes:damage_immunity") {/* 
        var invis = ["explosion", "magic", "shuriken", "sharp", "bullet", "blunt", "saitama"];
        var normal = ["fire","cactus", "cold", "energy", "electricity", "sound", "thorns", "radiation",
          "water", "hulk", "holy", "hellfire", "adamantium", "mineral", "shockwave", "atlantean_steel",
          "eternium", "cosmic", "kryptonite", "light", "cs", "force", "jv", "primordial", "gale", "bifrost",
          "ice", "positive", "cursed", "cancel"
        ];
        if (normal.indexOf(modifier.id()) > -1) {
          result = true;
        };
        if (invis.indexOf(modifier.id()) > -1) {
          result = entity.getData("fiskheroes:invisible");
        }; */
        result = entity.getData("fiskheroes:invisible");
      };
      if (modifier.name() == "fiskheroes:shield") {
        if (modifier.id() == "barrier") {
          result = entity.getData("skyhighheroes:dyn/battle_card") == 1 && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getHeldItem().isEmpty();
        };
        if (modifier.id() == "sword") {
          result = entity.getData("skyhighheroes:dyn/battle_card") == 2 && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getHeldItem().isEmpty();
        };
      };
      if (modifier.name() == "fiskheroes:blade") {
        result = entity.getData("skyhighheroes:dyn/battle_card") == 2 && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getHeldItem().isEmpty();
      };
      if (modifier.name() == "fiskheroes:repulsor_blast") {
        result = entity.getData("skyhighheroes:dyn/battle_card") == 3 && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getHeldItem().isEmpty();
      };
      if (modifier.name() == "fiskheroes:energy_projection") {
        result = entity.getData("skyhighheroes:dyn/battle_card") == 4 && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getHeldItem().isEmpty();
      };
      return result;
    },
    tickHandler: function (entity, manager) {
      if ((entity.getData("fiskheroes:flight_timer") < 1.0) && (entity.getData("fiskheroes:flight_timer") > 0.0) && !entity.getData("fiskheroes:flying")) {
        var entities = entity.world().getEntitiesInRangeOf(entity.pos(), 20);
        entities.forEach(other => {
          if (other.getDataOrDefault("sind:dyn/flares", false)) {
            manager.setDataWithNotify(entity, "fiskheroes:flying", true);
          };
        });
      };
      var item_holding = (!entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/wave_changing_timer") > 0);
      manager.incrementData(entity, "skyhighheroes:dyn/item_holding_timer", 10, item_holding);
      var sword = (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getData("skyhighheroes:dyn/battle_card") == 2 && (entity.getData("fiskheroes:flight_boost_timer") == 0 || (entity.getData("fiskheroes:flight_boost_timer") < 0.5 && !entity.isSprinting())));
      manager.setData(entity, "skyhighheroes:dyn/sword", sword);
      var sword_blade = entity.getData("skyhighheroes:dyn/sword_timer") == 1 && entity.getData("skyhighheroes:dyn/item_holding_timer") == 0;
      manager.setData(entity, "skyhighheroes:dyn/sword_blade", sword_blade);
      var cannon = (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getData("skyhighheroes:dyn/battle_card") == 3 && (entity.getData("fiskheroes:flight_boost_timer") == 0 || (entity.getData("fiskheroes:flight_boost_timer") < 0.5 && !entity.isSprinting())));
      manager.setData(entity, "skyhighheroes:dyn/cannon", cannon);
      var jet_attack = (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getData("skyhighheroes:dyn/battle_card") == 4 && (entity.getData("fiskheroes:flight_boost_timer") == 0 || (entity.getData("fiskheroes:flight_boost_timer") < 0.5 && !entity.isSprinting())));
      manager.setData(entity, "skyhighheroes:dyn/jet_attack", jet_attack);
      var knuckle = (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getData("skyhighheroes:dyn/battle_card") == 5 && (entity.getData("fiskheroes:flight_boost_timer") == 0 || (entity.getData("fiskheroes:flight_boost_timer") < 0.5 && !entity.isSprinting())));
      manager.setData(entity, "skyhighheroes:dyn/knuckle", knuckle);
      if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/predation_timer") > 0.0 && entity.getData("skyhighheroes:dyn/predation_timer") < 0.1) {
        manager.setData(entity, "skyhighheroes:dyn/battle_card", 0);
        manager.setData(entity, "skyhighheroes:dyn/omega_xis", false);
      };
      if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/predation_timer") > 0.6 && entity.getData("skyhighheroes:dyn/predation_timer") < 0.7) {
        manager.setData(entity, "skyhighheroes:dyn/battle_card", entity.getData("skyhighheroes:dyn/selected_battle_card"));
        if (entity.getData("skyhighheroes:dyn/battle_card") == 0) {
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", false);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 1) {
          entity.playSound("skyhighheroes:wave.equip", 1, 1);
          if (entity.getData("skyhighheroes:dyn/predation_timer") > 0.65) {
            system.shoutMessage(entity, "\u00A7r<\u00A7bMega Man\u00A7r> Battle Card Predation! \u00A7bBarrier\u00A7r!", 16);
            system.systemMessage(entity, "<n>Inserted <nh>Barrier<n> battle card!");
          };
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", false);
          manager.setData(entity, "fiskheroes:shield", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 2) {
          entity.playSound("skyhighheroes:wave.equip", 1, 1);
          if (entity.getData("skyhighheroes:dyn/predation_timer") > 0.65) {
            system.shoutMessage(entity, "\u00A7r<\u00A7bMega Man\u00A7r> Battle Card Predation! \u00A7bSword\u00A7r!", 16);
            system.systemMessage(entity, "<n>Inserted <nh>Sword<n> battle card!");
          };
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
          manager.setData(entity, "fiskheroes:shield", true);
          manager.setData(entity, "fiskheroes:blade", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 3) {
          entity.playSound("skyhighheroes:wave.equip", 1, 1);
          if (entity.getData("skyhighheroes:dyn/predation_timer") > 0.65) {
            system.shoutMessage(entity, "\u00A7r<\u00A7bMega Man\u00A7r> Battle Card Predation! \u00A7bCannon\u00A7r!", 16);
            system.systemMessage(entity, "<n>Inserted <nh>Cannon<n> battle card!");
          };
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 4) {
          entity.playSound("skyhighheroes:wave.equip", 1, 1);
          if (entity.getData("skyhighheroes:dyn/predation_timer") > 0.65) {
            system.shoutMessage(entity, "\u00A7r<\u00A7bMega Man\u00A7r> Battle Card Predation! \u00A7bJet Attack\u00A7r!", 16);
            system.systemMessage(entity, "<n>Inserted <nh>Jet Attack<n> battle card!");
          };
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 5) {
          entity.playSound("skyhighheroes:wave.equip", 1, 1);
          if (entity.getData("skyhighheroes:dyn/predation_timer") > 0.65) {
            system.shoutMessage(entity, "\u00A7r<\u00A7bMega Man\u00A7r> Battle Card Predation! \u00A7bKunckle\u00A7r!", 16);
            system.systemMessage(entity, "<n>Inserted <nh>Knuckle<n> battle card!");
          };
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
      };
      if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && ((entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.isSprinting()) || !entity.getHeldItem().isEmpty())) {
        manager.setData(entity, "skyhighheroes:dyn/omega_xis", false);
      };
      if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1 && (entity.getData("fiskheroes:flight_boost_timer") < 1 && !entity.isSprinting()) && entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/predation_timer") == 0) {
        if (entity.getData("skyhighheroes:dyn/battle_card") == 1) {
          manager.setData(entity, "fiskheroes:shield", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 2) {
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
          manager.setData(entity, "fiskheroes:shield", true);
          manager.setData(entity, "fiskheroes:blade", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 3) {
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 4) {
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
        if (entity.getData("skyhighheroes:dyn/battle_card") == 5) {
          manager.setData(entity, "skyhighheroes:dyn/omega_xis", true);
        };
      };
      manager.setData(entity, "fiskheroes:energy_projection", entity.isSprinting() && entity.getData("skyhighheroes:dyn/jet_attack_timer") == 1);
    }
  };
};