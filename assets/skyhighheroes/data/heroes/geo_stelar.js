var bodyTemp = implement("skyhighheroes:external/body_temperature");
var stelar = implement("skyhighheroes:external/stelar");
var transer = implement("skyhighheroes:external/transer_system");
var settings = implement("skyhighheroes:external/transer_settings");
var messaging = implement("skyhighheroes:external/messaging");
var groupMessaging = implement("skyhighheroes:external/group_messaging");
var transerBrotherBand = implement("skyhighheroes:external/transer_brotherband");
var groups = implement("skyhighheroes:external/groups");
var contacts = implement("skyhighheroes:external/contacts");
var scanner = implement("skyhighheroes:external/scanner");
var waypoints = implement("skyhighheroes:external/waypoint");
var theFugitive = implement("skyhighheroes:external/the_fugitive");
var megaMan = implement("skyhighheroes:external/mega_man");
var omegaXis = implement("skyhighheroes:external/omega_xis");
var transerOS = transer.initSystem([
  settings,
  messaging,
  groupMessaging,
  transerBrotherBand,
  groups,
  contacts,
  scanner,
  waypoints,
  theFugitive,
  megaMan,
  omegaXis
], "geoStelar", "pegasus");
function init(hero) {
  hero.setAliases("geo_stelar");
  hero.setName("Geo Stelar");
  hero.setTier(1);
  hero.setChestplate("Transer");
  hero.setTierOverride(entity => 0);

  transerOS.keyBinds(hero);
  transerOS.addPowers(hero);
  transerOS.profileWave(hero);
  transerOS.initEMWaveChange(hero);

  bodyTemp.initProfiles(hero);

  hero.addKeyBindFunc("CYCLE_CLOTHES", (player, manager) => stelar.cycleClothes(player, manager), "Change Clothes", 1);
  hero.addKeyBindFunc("VISUALIZER_TOGGLE", (player, manager) => stelar.visualizerToggle(player, manager), "Toggle Visualizer", 2);
  hero.addKeyBindFunc("HOOD_TOGGLE", (player, manager) => stelar.hoodToggle(player, manager), "Toggle Hood", 2);
  
  hero.setDefaultScale(1.0);
  hero.setAttributeProfile(entity => {
    if (entity.getData("skyhighheroes:dyn/wave_changing_timer") == 1) {
      return transerOS.getAttributeProfile(entity);
    } else {
      if (entity.getData("skyhighheroes:dyn/wave_calling_timer") == 0) {
        return bodyTemp.getAttributeProfile(entity); 
      } else {
        return transerOS.getWaveProfile(entity);
      };
    };
  });
  hero.setModifierEnabled((entity, modifier) => {
    if (modifier.name() == "fiskheroes:shape_shifting") {
      return true;
    };
    return transerOS.isModifierEnabled(entity, modifier);
  });
  hero.setKeyBindEnabled((entity, keyBind) => {
    if (keyBind == "TRANSER") {
      return transer.canUseTranser(entity);
    };
    if (keyBind == "VISUALIZER_TOGGLE") {
      return !entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 0 && ((entity.getData("skyhighheroes:dyn/stelar_clothes") == 3) ? !entity.isSneaking() : true);
    };
    if (keyBind == "CYCLE_CLOTHES") {
      return !entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 0;
    };
    if (keyBind == "HOOD_TOGGLE") {
      return !entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 0 && entity.isSneaking() && entity.getData("skyhighheroes:dyn/stelar_clothes") == 3;
    };
    if (keyBind == "WAVE_CALLING") {
      return !entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/wave_changing_timer") == 0 && entity.as("PLAYER").isCreativeMode() && transer.getEMBeing(entity) == "";
    };
    if (keyBind == "SHAPE_SHIFT") {
      return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && transer.canUseTranser(entity) && (!transerOS.isTelekinesisButton(entity) || (transerOS.isTelekinesisButton(entity) && !entity.getData("skyhighheroes:dyn/entering_value")));
    };
    if (keyBind == "TELEKINESIS") {
      return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && transer.canUseTranser(entity) && transerOS.isTelekinesisButton(entity) && entity.getData("skyhighheroes:dyn/entering_value");
    };
    if (keyBind == "CONFIRM") {
      return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && transer.canUseTranser(entity);
    };
    if (keyBind == "BACK") {
      return entity.getData("skyhighheroes:dyn/transer") && entity.getData("skyhighheroes:dyn/battle_card") == 0 && transer.canUseTranser(entity);
    };
    return transerOS.isKeyBindEnabled(entity, keyBind);
  });
  hero.setTickHandler((entity, manager) => {
    transerOS.systemHandler(entity, manager);
    transerOS.waveHandler(entity, hero);
    transerOS.emWaveHandler(entity, manager);
    bodyTemp.change(entity, manager, stelar.tempProfiles(), "skyhighheroes:dyn/body_temperature", 400.0, "skyhighheroes:dyn/stelar_clothes");
  });
};