var cybernetics = implement("skyhighheroes:external/cybernetics");
var cybernetic_boosters = implement("skyhighheroes:external/cybernetic_boosters");
var cybernetic_beams = implement("skyhighheroes:external/cybernetic_beams");
var stuff = implement("skyhighheroes:external/stuff");

var darkness_model;
var metal_heat;
var text_renderer;

//Display models
var display_model;
var head_display_model;
var body_display_model;
var left_arm_display_model;
var right_arm_display_model;
var left_leg_display_model;
var right_leg_display_model;

//Stuff models
var head_model;
var body_model;
var left_arm_model;
var left_arm_shield_model;
var left_arm_blade_model;
var right_arm_model;
var right_arm_shield_model;
var right_arm_blade_model;
var left_leg_model;
var right_leg_model;

//Base skin models
var head_base_model;
var head_hair_base_model;
var body_base_model;
var left_arm_base_model;
var right_arm_base_model;
var left_leg_base_model;
var right_leg_base_model;

//Disguise models
var head_disguise_model;
var head_hair_disguise_model;
var body_disguise_model;
var left_arm_disguise_model;
var right_arm_disguise_model;
var left_leg_disguise_model;
var right_leg_disguise_model;

//Lights off models
var head_lights_off_model;
var head_hair_lights_off_model;
var body_lights_off_model;
var left_arm_lights_off_model;
var right_arm_lights_off_model;
var left_leg_lights_off_model;
var right_leg_lights_off_model;

//Lights on models
var head_lights_on_model;
var head_hair_lights_on_model;
var body_lights_on_model;
var left_arm_lights_on_model;
var right_arm_lights_on_model;
var left_leg_lights_on_model;
var right_leg_lights_on_model;

//Beams and boosters
var satellite_beams;
var body_boosters;
var left_arm_boosters;
var right_arm_boosters;
var left_leg_boosters;
var right_leg_boosters;

loadTextures({
  "null": "skyhighheroes:null",
  "darkness": "skyhighheroes:darkness",
  "arm": "skyhighheroes:cybernetic_arm_base",
  "claw": "skyhighheroes:cybernetic_claw_base",
  "head": "skyhighheroes:cybernetic_head_base",
  "body": "skyhighheroes:cybernetic_body_base",
  "left_arm": "skyhighheroes:cybernetic_left_arm_base",
  "right_arm": "skyhighheroes:cybernetic_right_arm_base",
  "left_leg": "skyhighheroes:cybernetic_left_leg_base",
  "right_leg": "skyhighheroes:cybernetic_right_leg_base",
  "head_base": "skyhighheroes:cyber/cyber_head_base.tx.json",
  "head_hair_base": "skyhighheroes:cyber/cyber_head_hair_base.tx.json",
  "body_base": "skyhighheroes:cyber/cyber_body_base.tx.json",
  "left_arm_base": "skyhighheroes:cyber/cyber_left_arm_base.tx.json",
  "right_arm_base": "skyhighheroes:cyber/cyber_right_arm_base.tx.json",
  "left_leg_base": "skyhighheroes:cyber/cyber_left_leg_base.tx.json",
  "right_leg_base": "skyhighheroes:cyber/cyber_right_leg_base.tx.json",
  "screen_active_menu": "skyhighheroes:cybers/active_menu",
  "screen_inactive_menu": "skyhighheroes:cybers/inactive_menu",
  "screen_status_on": "skyhighheroes:cybers/status_on",
  "screen_status_off": "skyhighheroes:cybers/status_off",
  "screen_status_in_progress": "skyhighheroes:cybers/status_in_progress",
  "screen_scroll_bar_middle": "skyhighheroes:cybers/inactive_menu",
  "screen_scroll_bar_bar_outer": "skyhighheroes:cybers/active_menu",
  "display_status": "skyhighheroes:cybers/cyber_status_display.tx.json",
});

function init(renderer) {
  renderer.setTexture((entity, renderLayer) => {
    return "null";
  });
  renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
  renderer.fixHatLayer("CHESTPLATE");
  renderer.setItemIcon("CHESTPLATE", "%s_system_core");
  initEffects(renderer);
  initAnimations(renderer);
};

function initEffects(renderer) {
  //Interface
  border = stuff.screenElement(renderer, "color", "center", "center", 520.0, 260.0, 0.0, 0.0, -250.0);
  baseMenu = stuff.screenElement(renderer, "active_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, border, "center");
  mainMenu = stuff.screenElement(renderer, "active_menu", "center", "right", "80pw", "100ph", 0.0, 0.0, 0.0, baseMenu, "centerright");
  sideMenu = stuff.screenElement(renderer, "inactive_menu", "center", "left", "20pw", "100ph", 0.0, 0.0, 0.0, baseMenu, "centerleft");
  overviewSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "0/11", 0.0, sideMenu, "topleft");
  rocketsWingsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "1/11", 0.0, sideMenu, "topleft");
  cannonsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "2/11", 0.0, sideMenu, "topleft");
  bladesShieldsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "3/11", 0.0, sideMenu, "topleft");
  suitsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "4/11", 0.0, sideMenu, "topleft");
  commsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "5/11", 0.0, sideMenu, "topleft");
  thermopticsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "6/11", 0.0, sideMenu, "topleft");
  settingsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "7/11", 0.0, sideMenu, "topleft");
  contactsGroupsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "8/11", 0.0, sideMenu, "topleft");
  waypointsSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "9/11", 0.0, sideMenu, "topleft");
  chatSelected = stuff.screenElement(renderer, "active_menu", "top", "left", "100pw", "1/11ph", 0.0, "10/11", 0.0, sideMenu, "topleft");

  //Overview
  displayHead = stuff.screenElementHead(renderer, "head", "top", "center", "25ph", 0.0, 80.0, 0.0, mainMenu, "topcenter");
  displayHeadHair = stuff.screenElementHead(renderer, "head_hair", "top", "center", "25ph", 0.0, 80.0, 0.0, mainMenu, "topcenter");
  displayBody = stuff.screenElementBody(renderer, "body", "bottom", "center", "25ph", 0.0, -55.0, 0.0, mainMenu, "bottomcenter");
  displayLeftArm = stuff.screenElementLimb(renderer, "left_arm", "center", "center", "25ph", "1/3", -30.0, 0.0, mainMenu, "center");
  displayRightArm = stuff.screenElementLimb(renderer, "right_arm", "center", "center", "25ph", "-1/3", -30.0, 0.0, mainMenu, "center");
  displayLeftLeg = stuff.screenElementLimb(renderer, "left_leg", "center", "center", "25ph", "1/3", 55.0, 0.0, mainMenu, "center");
  displayRightLeg = stuff.screenElementLimb(renderer, "right_leg", "center", "center", "25ph", "-1/3", 55.0, 0.0, mainMenu, "center");
  //Rocket status lights
  rocketBodyLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 40.0, -14.0, 0.0, displayBody, "center");
  rocketBodyLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketBodyLeftDeployStatus, 1.725, 1.725);
  rocketBodyRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -40.0, -14.0, 0.0, displayBody, "center");
  rocketBodyRightDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketBodyRightDeployStatus, 1.725, 1.725);
  rocketLeftArmOuterDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -16.0, 0.0, displayLeftArm, "center");
  rocketLeftArmOuterDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftArmOuterDeployStatus, 1.725, 1.725);
  rocketLeftArmFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, -16.0, 0.0, displayLeftArm, "center");
  rocketLeftArmFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftArmFrontDeployStatus, 1.725, 1.725);
  rocketLeftArmBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, -16.0, 0.0, displayLeftArm, "center");
  rocketLeftArmBackDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftArmBackDeployStatus, 1.725, 1.725);
  rocketRightArmOuterDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -16.0, 0.0, displayRightArm, "center");
  rocketRightArmOuterDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightArmOuterDeployStatus, 1.725, 1.725);
  rocketRightArmFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, -16.0, 0.0, displayRightArm, "center");
  rocketRightArmFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightArmFrontDeployStatus, 1.725, 1.725);
  rocketRightArmBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, -16.0, 0.0, displayRightArm, "center");
  rocketRightArmBackDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightArmBackDeployStatus, 1.725, 1.725);
  rocketLeftLegMainDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 32.0, 0.0, displayLeftLeg, "center");
  rocketLeftLegMainDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftLegMainDeployStatus, 1.725, 1.725);
  rocketLeftLegOuterDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, 12.0, 0.0, displayLeftLeg, "center");
  rocketLeftLegOuterDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftLegOuterDeployStatus, 1.725, 1.725);
  rocketLeftLegInnerDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, 12.0, 0.0, displayLeftLeg, "center");
  rocketLeftLegInnerDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftLegInnerDeployStatus, 1.725, 1.725);
  rocketLeftLegFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 12.0, 0.0, displayLeftLeg, "center");
  rocketLeftLegFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftLegFrontDeployStatus, 1.725, 1.725);
  rocketLeftLegBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -32.0, 12.0, 0.0, displayLeftLeg, "center");
  rocketLeftLegBackDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketLeftLegBackDeployStatus, 1.725, 1.725);
  rocketRightLegMainDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 32.0, 0.0, displayRightLeg, "center");
  rocketRightLegMainDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightLegMainDeployStatus, 1.725, 1.725);
  rocketRightLegOuterDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, 12.0, 0.0, displayRightLeg, "center");
  rocketRightLegOuterDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightLegOuterDeployStatus, 1.725, 1.725);
  rocketRightLegInnerDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, 12.0, 0.0, displayRightLeg, "center");
  rocketRightLegInnerDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightLegInnerDeployStatus, 1.725, 1.725);
  rocketRightLegFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 12.0, 0.0, displayRightLeg, "center");
  rocketRightLegFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightLegFrontDeployStatus, 1.725, 1.725);
  rocketRightLegBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 32.0, 12.0, 0.0, displayRightLeg, "center");
  rocketRightLegBackDeploySelector = stuff.screenCornerSelector(renderer, "color", rocketRightLegBackDeployStatus, 1.725, 1.725);
  //Cannon status lights
  cannonLeftArmBottomDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 32.0, 0.0, displayLeftArm, "center");
  cannonLeftArmBottomDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonLeftArmBottomDeployStatus, 1.725, 1.725);
  cannonLeftArmFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, 12.0, 0.0, displayLeftArm, "center");
  cannonLeftArmFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonLeftArmFrontDeployStatus, 1.725, 1.725);
  cannonLeftArmBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, 12.0, 0.0, displayLeftArm, "center");
  cannonLeftArmBackDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonLeftArmBackDeployStatus, 1.725, 1.725);
  cannonRightArmBottomDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 32.0, 0.0, displayRightArm, "center");
  cannonRightArmBottomDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonRightArmBottomDeployStatus, 1.725, 1.725);
  cannonRightArmFrontDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, 12.0, 0.0, displayRightArm, "center");
  cannonRightArmFrontDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonRightArmFrontDeployStatus, 1.725, 1.725);
  cannonRightArmBackDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, 12.0, 0.0, displayRightArm, "center");
  cannonRightArmBackDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonRightArmBackDeployStatus, 1.725, 1.725);
  cannonBodyLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 8.0, -14.0, 0.0, displayBody, "center");
  cannonBodyLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonBodyLeftDeployStatus, 1.725, 1.725);
  cannonBodyRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -8.0, -14.0, 0.0, displayBody, "center");
  cannonBodyRightDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonBodyRightDeployStatus, 1.725, 1.725);
  cannonHeadLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 32.0, 16.0, 0.0, displayHead, "center");
  cannonHeadLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonHeadLeftDeployStatus, 1.725, 1.725);
  cannonHeadRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -32.0, 16.0, 0.0, displayHead, "center");
  cannonHeadRightDeploySelector = stuff.screenCornerSelector(renderer, "color", cannonHeadRightDeployStatus, 1.725, 1.725);
  //Comms status lights
  satelliteRainModeStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -48.0, 0.0, displayHead, "center");
  satelliteRainModeSelector = stuff.screenCornerSelector(renderer, "color", satelliteRainModeStatus, 1.725, 1.725);
  satelliteDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -40.0, 0.0, displayHead, "center");
  satelliteDeploySelector = stuff.screenCornerSelector(renderer, "color", satelliteDeployStatus, 1.725, 1.725);
  antennaDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -26.0, 0.0, displayHead, "center");
  antennaDeploySelector = stuff.screenCornerSelector(renderer, "color", antennaDeployStatus, 1.725, 1.725);
  //Wings status lights
  wingLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 24.0, 0.0, 0.0, displayBody, "center");
  wingLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", wingLeftDeployStatus, 1.725, 1.725);
  wingRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -24.0, 0.0, 0.0, displayBody, "center");
  wingRightDeploySelector = stuff.screenCornerSelector(renderer, "color", wingRightDeployStatus, 1.725, 1.725);
  //External arms status lights
  externalArmLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 40.0, 6.0, 0.0, displayBody, "center");
  externalArmLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", externalArmLeftDeployStatus, 1.725, 1.725);
  externalArmRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -40.0, 6.0, 0.0, displayBody, "center");
  externalArmRightDeploySelector = stuff.screenCornerSelector(renderer, "color", externalArmRightDeployStatus, 1.725, 1.725);
  //Blades status lights
  bladeLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -32.0, 12.0, 0.0, displayLeftArm, "center");
  bladeLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", bladeLeftDeployStatus, 1.725, 1.725);
  bladeRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 32.0, 12.0, 0.0, displayRightArm, "center");
  bladeRightDeploySelector = stuff.screenCornerSelector(renderer, "color", bladeRightDeployStatus, 1.725, 1.725);
  //Shields status lights
  shieldLeftDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 12.0, 0.0, displayLeftArm, "center");
  shieldLeftDeploySelector = stuff.screenCornerSelector(renderer, "color", shieldLeftDeployStatus, 1.725, 1.725);
  shieldRightDeployStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 12.0, 0.0, displayRightArm, "center");
  shieldRightDeploySelector = stuff.screenCornerSelector(renderer, "color", shieldRightDeployStatus, 1.725, 1.725);
  //Intakes open status lights
  intakeHeadLeftOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 8.0, 52.0, 0.0, displayHead, "center");
  intakeHeadLeftOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeHeadLeftOpenStatus, 1.725, 1.725);
  intakeHeadRightOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -8.0, 52.0, 0.0, displayHead, "center");
  intakeHeadRightOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeHeadRightOpenStatus, 1.725, 1.725);
  intakeBodyLeftOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 8.0, -32.0, 0.0, displayBody, "center");
  intakeBodyLeftOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeBodyLeftOpenStatus, 1.725, 1.725);
  intakeBodyRightOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -8.0, -32.0, 0.0, displayBody, "center");
  intakeBodyRightOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeBodyRightOpenStatus, 1.725, 1.725);
  intakeLeftArmOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -32.0, 0.0, displayLeftArm, "center");
  intakeLeftArmOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeLeftArmOpenStatus, 1.725, 1.725);
  intakeRightArmOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -32.0, 0.0, displayRightArm, "center");
  intakeRightArmOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeRightArmOpenStatus, 1.725, 1.725);
  intakeLeftLegOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -32.0, 0.0, displayLeftLeg, "center");
  intakeLeftLegOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeLeftLegOpenStatus, 1.725, 1.725);
  intakeRightLegOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, -32.0, 0.0, displayRightLeg, "center");
  intakeRightLegOpenSelector = stuff.screenCornerSelector(renderer, "color", intakeRightLegOpenStatus, 1.725, 1.725);
  //Intakes starting up status lights
  intakeHeadLeftStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 24.0, 52.0, 0.0, displayHead, "center");
  intakeHeadLeftStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeHeadLeftStartUpStatus, 1.725, 1.725);
  intakeHeadRightStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -24.0, 52.0, 0.0, displayHead, "center");
  intakeHeadRightStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeHeadRightStartUpStatus, 1.725, 1.725);
  intakeBodyLeftStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 24.0, -32.0, 0.0, displayBody, "center");
  intakeBodyLeftStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeBodyLeftStartUpStatus, 1.725, 1.725);
  intakeBodyRightStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -24.0, -32.0, 0.0, displayBody, "center");
  intakeBodyRightStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeBodyRightStartUpStatus, 1.725, 1.725);
  intakeLeftArmStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, -32.0, 0.0, displayLeftArm, "center");
  intakeLeftArmStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeLeftArmStartUpStatus, 1.725, 1.725);
  intakeRightArmStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, -32.0, 0.0, displayRightArm, "center");
  intakeRightArmStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeRightArmStartUpStatus, 1.725, 1.725);
  intakeLeftLegStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, -16.0, -32.0, 0.0, displayLeftLeg, "center");
  intakeLeftLegStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeLeftLegStartUpStatus, 1.725, 1.725);
  intakeRightLegStartUpStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 16.0, -32.0, 0.0, displayRightLeg, "center");
  intakeRightLegStartUpSelector = stuff.screenCornerSelector(renderer, "color", intakeRightLegStartUpStatus, 1.725, 1.725);
  //System core status lights
  systemCoreOpenStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 6.0, 0.0, displayBody, "center");
  systemCoreOpenSelector = stuff.screenCornerSelector(renderer, "color", systemCoreOpenStatus, 1.725, 1.725);
  //Optics enabled status lights
  opticsEnabledStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 8.0, 8.0, 0.0, 20.0, 0.0, displayHead, "center");
  opticsEnabledSelector = stuff.screenCornerSelector(renderer, "color", opticsEnabledStatus, 1.725, 1.725);

  //List
  listBox = stuff.screenElement(renderer, "color", "center", "center", 220.0, 177.0, 0.0, -15.0, 0.0, mainMenu, "center");
  listBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, listBox, "center");
  listButton0 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 2.0, 0.0, listBoxInner, "topcenter");
  listButton0Selected = stuff.screenCornerSelector(renderer, "color", listButton0, 1.725, 1.725);
  listButton1 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 19.0, 0.0, listBoxInner, "topcenter");
  listButton1Selected = stuff.screenCornerSelector(renderer, "color", listButton1, 1.725, 1.725);
  listButton2 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 36.0, 0.0, listBoxInner, "topcenter");
  listButton2Selected = stuff.screenCornerSelector(renderer, "color", listButton2, 1.725, 1.725);
  listButton3 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 53.0, 0.0, listBoxInner, "topcenter");
  listButton3Selected = stuff.screenCornerSelector(renderer, "color", listButton3, 1.725, 1.725);
  listButton4 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 70.0, 0.0, listBoxInner, "topcenter");
  listButton4Selected = stuff.screenCornerSelector(renderer, "color", listButton4, 1.725, 1.725);
  listButton5 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 87.0, 0.0, listBoxInner, "topcenter");
  listButton5Selected = stuff.screenCornerSelector(renderer, "color", listButton5, 1.725, 1.725);
  listButton6 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 104.0, 0.0, listBoxInner, "topcenter");
  listButton6Selected = stuff.screenCornerSelector(renderer, "color", listButton6, 1.725, 1.725);
  listButton7 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 121.0, 0.0, listBoxInner, "topcenter");
  listButton7Selected = stuff.screenCornerSelector(renderer, "color", listButton7, 1.725, 1.725);
  listButton8 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 138.0, 0.0, listBoxInner, "topcenter");
  listButton8Selected = stuff.screenCornerSelector(renderer, "color", listButton8, 1.725, 1.725);
  listButton9 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 155.0, 0.0, listBoxInner, "topcenter");
  listButton9Selected = stuff.screenCornerSelector(renderer, "color", listButton9, 1.725, 1.725);
  listScrollBar = stuff.screenVerticalScrollBar(renderer, "scroll_bar", 10.0, "100ph", 6.0, 0.0, 0.0, listBox, "centerright");

  //List base for queue stuff
  listBaseBox = stuff.screenElement(renderer, "color", "center", "right", 170.0, 177.0, -15.0, -20.0, 0.0, mainMenu, "center");
  listBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, listBaseBox, "center");
  listBaseButton0 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 2.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton0Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton0, 1.725, 1.725);
  listBaseButton1 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 19.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton1Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton1, 1.725, 1.725);
  listBaseButton2 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 36.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton2Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton2, 1.725, 1.725);
  listBaseButton3 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 53.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton3Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton3, 1.725, 1.725);
  listBaseButton4 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 70.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton4Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton4, 1.725, 1.725);
  listBaseButton5 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 87.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton5Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton5, 1.725, 1.725);
  listBaseButton6 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 104.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton6Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton6, 1.725, 1.725);
  listBaseButton7 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 121.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton7Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton7, 1.725, 1.725);
  listBaseButton8 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 138.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton8Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton8, 1.725, 1.725);
  listBaseButton9 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 155.0, 0.0, listBaseBoxInner, "topcenter");
  listBaseButton9Selected = stuff.screenCornerSelector(renderer, "color", listBaseButton9, 1.725, 1.725);
  listBaseScrollBar = stuff.screenVerticalScrollBar(renderer, "scroll_bar", 10.0, "100ph", 6.0, 0.0, 0.0, listBaseBox, "centerright");
  //List queue for queue stuff
  listQueueBox = stuff.screenElement(renderer, "color", "center", "left", 170.0, 177.0, 15.0, -20.0, 0.0, mainMenu, "center");
  listQueueBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, listQueueBox, "center");
  listQueueButton0 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 2.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton0Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton0, 1.725, 1.725);
  listQueueButton1 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 19.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton1Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton1, 1.725, 1.725);
  listQueueButton2 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 36.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton2Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton2, 1.725, 1.725);
  listQueueButton3 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 53.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton3Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton3, 1.725, 1.725);
  listQueueButton4 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 70.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton4Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton4, 1.725, 1.725);
  listQueueButton5 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 87.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton5Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton5, 1.725, 1.725);
  listQueueButton6 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 104.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton6Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton6, 1.725, 1.725);
  listQueueButton7 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 121.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton7Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton7, 1.725, 1.725);
  listQueueButton8 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 138.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton8Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton8, 1.725, 1.725);
  listQueueButton9 = stuff.screenElement(renderer, "active_menu", "top", "center", "2pmw", 15.0, 0.0, 155.0, 0.0, listQueueBoxInner, "topcenter");
  listQueueButton9Selected = stuff.screenCornerSelector(renderer, "color", listQueueButton9, 1.725, 1.725);
  listQueueScrollBar = stuff.screenVerticalScrollBar(renderer, "scroll_bar", 10.0, "100ph", -6.0, 0.0, 0.0, listQueueBox, "centerleft");
  queueActionButtonBorder = stuff.screenElement(renderer, "inactive_menu", "center", "center", 140.0, 22.0, 0.0, -20.0, 0.0, mainMenu, "bottomcenter");
  queueActionButton = stuff.screenElement(renderer, "active_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, queueActionButtonBorder, "center");
  queueActionButtonSelected = stuff.screenCornerSelector(renderer, "color", queueActionButtonBorder, 1.725, 1.725);


  //Rockets and wings menu
  rocketsArmsArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "-1/4", 0.0, mainMenu, "center");
  rocketsArmsArmedSelector = stuff.screenCornerSelector(renderer, "color", rocketsArmsArmedStatus, 1.725, 1.725);
  rocketsBodyArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", 0.0, 0.0, mainMenu, "center");
  rocketsBodyArmedSelector = stuff.screenCornerSelector(renderer, "color", rocketsBodyArmedStatus, 1.725, 1.725);
  rocketsLegsArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/3", "1/4", 0.0, mainMenu, "center");
  rocketsLegsArmedSelector = stuff.screenCornerSelector(renderer, "color", rocketsLegsArmedStatus, 1.725, 1.725);
  rocketsWingsArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "-1/4", 0.0, mainMenu, "center");
  rocketsWingsArmedSelector = stuff.screenCornerSelector(renderer, "color", rocketsWingsArmedStatus, 1.725, 1.725);
  rocketsInnerLegsStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, 0.0, "1/4", 0.0, mainMenu, "center");
  rocketsInnerLegsSelector = stuff.screenCornerSelector(renderer, "color", rocketsInnerLegsStatus, 1.725, 1.725);
  wingsArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", 0.0, 0.0, mainMenu, "center");
  wingsArmedSelector = stuff.screenCornerSelector(renderer, "color", wingsArmedStatus, 1.725, 1.725);
  onFallProtectionStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/3", "1/4", 0.0, mainMenu, "center");
  onFallProtectionSelector = stuff.screenCornerSelector(renderer, "color", onFallProtectionStatus, 1.725, 1.725);

  //Cannons menu
  cannnonsHeadFlushStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "-1/4", 0.0, mainMenu, "center");
  cannnonsHeadFlushSelector = stuff.screenCornerSelector(renderer, "color", cannnonsHeadFlushStatus, 1.725, 1.725);
  cannnonsBodyFlushStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", 0.0, 0.0, mainMenu, "center");
  cannnonsBodyFlushSelector = stuff.screenCornerSelector(renderer, "color", cannnonsBodyFlushStatus, 1.725, 1.725);
  cannnonsLeftArmFlushStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/3", "1/4", 0.0, mainMenu, "center");
  cannnonsLeftArmFlushSelector = stuff.screenCornerSelector(renderer, "color", cannnonsLeftArmFlushStatus, 1.725, 1.725);
  cannnonsHeadArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "-1/4", 0.0, mainMenu, "center");
  cannnonsHeadArmedSelector = stuff.screenCornerSelector(renderer, "color", cannnonsHeadArmedStatus, 1.725, 1.725);
  cannnonsBodyArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", 0.0, 0.0, mainMenu, "center");
  cannnonsBodyArmedSelector = stuff.screenCornerSelector(renderer, "color", cannnonsBodyArmedStatus, 1.725, 1.725);
  cannnonsArmsArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, 0.0, "1/4", 0.0, mainMenu, "center");
  cannnonsArmsArmedSelector = stuff.screenCornerSelector(renderer, "color", cannnonsArmsArmedStatus, 1.725, 1.725);
  cannnonsRightArmFlushStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/3", "1/4", 0.0, mainMenu, "center");
  cannnonsRightArmFlushSelector = stuff.screenCornerSelector(renderer, "color", cannnonsRightArmFlushStatus, 1.725, 1.725);

  //Blades and shields menu
  bladeLeftArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "-1/4", 0.0, mainMenu, "center");
  bladeLeftArmedSelector = stuff.screenCornerSelector(renderer, "color", bladeLeftArmedStatus, 1.725, 1.725);
  bladeLeftStealthStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", 0.0, 0.0, mainMenu, "center");
  bladeLeftStealthSelector = stuff.screenCornerSelector(renderer, "color", bladeLeftStealthStatus, 1.725, 1.725);
  shieldLeftArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "1/4", 0.0, mainMenu, "center");
  shieldLeftArmedSelector = stuff.screenCornerSelector(renderer, "color", shieldLeftArmedStatus, 1.725, 1.725);
  bladeRightArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "-1/4", 0.0, mainMenu, "center");
  bladeRightArmedSelector = stuff.screenCornerSelector(renderer, "color", bladeRightArmedStatus, 1.725, 1.725);
  bladeRightStealthStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", 0.0, 0.0, mainMenu, "center");
  bladeRightStealthSelector = stuff.screenCornerSelector(renderer, "color", bladeRightStealthStatus, 1.725, 1.725);
  shieldRightArmedStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "1/4", 0.0, mainMenu, "center");
  shieldRightArmedSelector = stuff.screenCornerSelector(renderer, "color", shieldRightArmedStatus, 1.725, 1.725);

  //Comms menu
  commsBaseBox = stuff.screenElement(renderer, "color", "center", "center", 100.0, 48.0, 0.0, 0.0, 0.0, mainMenu, "center");
  commsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, commsBaseBox, "center");
  commsStatusSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -12.0, 0.0, commsBaseBoxInner, "centerleft");
  commsSuitsSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 0.0, 0.0, commsBaseBoxInner, "centerleft");
  commsWaypointsSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 12.0, 0.0, commsBaseBoxInner, "centerleft");

  //Suits menu
  suitsBaseBox = stuff.screenElement(renderer, "color", "center", "center", 100.0, 48.0, 0.0, 0.0, 0.0, mainMenu, "center");
  suitsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, suitsBaseBox, "center");
  suitsEditSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -12.0, 0.0, suitsBaseBoxInner, "centerleft");
  suitsUploadSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 0.0, 0.0, suitsBaseBoxInner, "centerleft");
  suitsDownloadSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 12.0, 0.0, suitsBaseBoxInner, "centerleft");
  suitsEditBox = stuff.screenElement(renderer, "color", "center", "center", 75.0, 22.0, 0.0, -20.0, 0.0, mainMenu, "bottomcenter");
  suitsEditBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, suitsEditBox, "center");
  suitsDeleteSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 0.0, 0.0, suitsEditBoxInner, "centerleft");

  //Thermoptics menu
  thermopticsDisguiseStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 20.0, 20.0, "-1/3", 0.0, 0.0, mainMenu, "center");
  thermopticsDisguiseSelector = stuff.screenCornerSelector(renderer, "color", thermopticsDisguiseStatus, 1.725, 1.725);
  thermopticsDisguiseClothingStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, 0.0, 0.0, 0.0, mainMenu, "center");
  thermopticsDisguiseClothingSelector = stuff.screenCornerSelector(renderer, "color", thermopticsDisguiseClothingStatus, 1.725, 1.725);
  thermopticsCamouflageStatus = stuff.screenStatusLightWithProgress(renderer, "status", "center", "center", 20.0, 20.0, "1/3", 0.0, 0.0, mainMenu, "center");
  thermopticsCamouflageSelector = stuff.screenCornerSelector(renderer, "color", thermopticsCamouflageStatus, 1.725, 1.725);

  //Contacts and groups menu
  contactsGroupsBaseBox = stuff.screenElement(renderer, "color", "center", "center", 100.0, 36.0, 0.0, 0.0, 0.0, mainMenu, "center");
  contactsGroupsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, contactsGroupsBaseBox, "center");
  contactsGroupsContactsSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, contactsGroupsBaseBoxInner, "centerleft");
  contactsGroupsGroupsSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, contactsGroupsBaseBoxInner, "centerleft");
  //Groups base submenu
  groupsBaseBox = stuff.screenElement(renderer, "color", "top", "left", 100.0, 36.0, 0.0, 5.0, 0.0, listBox, "bottomleft");
  groupsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, groupsBaseBox, "center");
  groupsAddSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, groupsBaseBoxInner, "centerleft");
  groupsEditSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, groupsBaseBoxInner, "centerleft");
  groupsEditBox = stuff.screenElement(renderer, "color", "top", "right", 100.0, 36.0, 0.0, 2.5, 0.0, listBox, "bottomright");
  groupsEditBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, groupsEditBox, "center");
  groupsMembersSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, groupsEditBoxInner, "centerleft");
  groupsDeleteSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, groupsEditBoxInner, "centerleft");
  //Groups members submenu
  groupsMembersBaseBox = stuff.screenElement(renderer, "color", "top", "left", 100.0, 36.0, 0.0, 5.0, 0.0, listBox, "bottomleft");
  groupsMembersBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, groupsMembersBaseBox, "center");
  groupsMembersEditSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, groupsMembersBaseBoxInner, "centerleft");
  groupsMembersAddSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, groupsMembersBaseBoxInner, "centerleft");
  groupsMembersEditBox = stuff.screenElement(renderer, "color", "top", "right", 100.0, 22.0, 0.0, -5.0, 0.0, listBox, "bottomright");
  groupsMembersEditBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, groupsMembersEditBox, "center");
  groupsMembersDeleteSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 0.0, 0.0, groupsMembersEditBoxInner, "centerleft");
  //Contacts submenu
  contactsBaseBox = stuff.screenElement(renderer, "color", "top", "left", 100.0, 36.0, 0.0, 5.0, 0.0, listBox, "bottomleft");
  contactsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, contactsBaseBox, "center");
  contactsEditSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, contactsBaseBoxInner, "centerleft");
  contactsAddSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, contactsBaseBoxInner, "centerleft");
  contactsEditBox = stuff.screenElement(renderer, "color", "top", "right", 100.0, 22.0, 0.0, 5.0, 0.0, listBox, "bottomright");
  contactsEditBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, contactsEditBox, "center");
  contactsDeleteSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 0.0, 0.0, contactsEditBoxInner, "centerleft");

  //Waypoints menu
  waypointsBaseBox = stuff.screenElement(renderer, "color", "top", "left", 100.0, 36.0, 0.0, 5.0, 0.0, listBox, "bottomleft");
  waypointsBaseBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, waypointsBaseBox, "center");
  waypointsAddSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, waypointsBaseBoxInner, "centerleft");
  waypointsEditSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, waypointsBaseBoxInner, "centerleft");
  waypointsEditBox = stuff.screenElement(renderer, "color", "top", "right", 75.0, 36.0, 0.0, 5.0, 0.0, listBox, "bottomright");
  waypointsEditBoxInner = stuff.screenElement(renderer, "inactive_menu", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, waypointsEditBox, "center");
  waypointsTrackSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, -6.0, 0.0, waypointsEditBoxInner, "centerleft");
  waypointsDeleteSelected = stuff.screenSelector(renderer, "color", "center", "center", 10.0, 10.0, 8.0, 6.0, 0.0, waypointsEditBoxInner, "centerleft");

  //Settings menu
  statueModeStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "-1/4", 0.0, mainMenu, "center");
  statueModeSelector = stuff.screenCornerSelector(renderer, "color", statueModeStatus, 1.725, 1.725);
  bodyLightsStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "-1/4", 0.0, mainMenu, "center");
  bodyLightsSelector = stuff.screenCornerSelector(renderer, "color", bodyLightsStatus, 1.725, 1.725);
  aliasActiveStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "-1/4", "1/4", 0.0, mainMenu, "center");
  aliasActiveSelector = stuff.screenCornerSelector(renderer, "color", aliasActiveStatus, 1.725, 1.725);
  nightVisionStatus = stuff.screenStatusLight(renderer, "status", "center", "center", 20.0, 20.0, "1/4", "1/4", 0.0, mainMenu, "center");
  nightVisionSelector = stuff.screenCornerSelector(renderer, "color", nightVisionStatus, 1.725, 1.725);


  var darkness = renderer.createResource("MODEL", "skyhighheroes:Darkness");
  darkness.texture.set("darkness");
  darkness_model = renderer.createEffect("fiskheroes:model").setModel(darkness);
  darkness_model.anchor.set("head");
  darkness_model.anchor.ignoreAnchor(true);
  darkness_model.setOffset(0.0, 0.0, 0.0);
  darkness_model.setScale(200.0);
  /* if (isChristmasSeason) {
    var santa_hat_model = renderer.createResource("MODEL", "skyhighheroes:SantaHat");
    santa_hat_model.texture.set("santa_hat");
    santaHat = renderer.createEffect("fiskheroes:model").setModel(santa_hat_model);
    santaHat.anchor.set("head");
    santaHat.setScale(1.13);
    santaHat.setOffset(0.0, -5.75, 1.25);
    santaHat.setRotation(-45.0, 0.0, 0.0);
    var santa_hat_cyber_model = renderer.createResource("MODEL", "skyhighheroes:SantaHat");
    santa_hat_cyber_model.texture.set("santa_hat_cyber", "santa_hat_cyber_lights");
    santaHatCyber = renderer.createEffect("fiskheroes:model").setModel(santa_hat_cyber_model);
    santaHatCyber.anchor.set("head");
    santaHatCyber.setScale(1.13);
    santaHatCyber.setOffset(0.0, -7.25, -0.25);
    santaHatCyber.setRotation(-10.0, 0.0, 0.0);
  }; */
  text_renderer = stuff.text(renderer);
  //Deploy + base
  //Add a clamp thing to the inner rockets so I can supress them with a timer instead of just a nbt boolean
  //Use motion and look in these animations
  //Mechanical parts
  var head = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL1");
  head.texture.set("head", "head_lights");
  head.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_model = renderer.createEffect("fiskheroes:model").setModel(head);
  head_model.anchor.set("head");
  head_model.setScale(1.0);
  satellite_beams = cybernetic_beams.initSatelliteBeams(renderer, head, getColor());
  cybernetic_beams.initHeadBeams(renderer, getColor());
  var body = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL1");
  body.texture.set("body", "body_lights");
  body.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => cybernetics.bodyAnimations(entity, data));
  body_model = renderer.createEffect("fiskheroes:model").setModel(body);
  body_model.anchor.set("body");
  body_model.setScale(1.0);
  cybernetics.initTentacles(renderer, body);
  body_boosters = cybernetic_boosters.initBodyBoosters(renderer, body, getColor());
  cybernetic_beams.initBodyBeams(renderer, getColor());
  var left_arm = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL1");
  left_arm.texture.set("left_arm", "left_arm_lights");
  left_arm.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => cybernetics.leftArmAnimations(entity, data));
  left_arm_model = renderer.createEffect("fiskheroes:model").setModel(left_arm);
  left_arm_model.anchor.set("leftArm");
  left_arm_model.setScale(1.0);
  left_arm_boosters = cybernetic_boosters.initLeftArmBoosters(renderer, left_arm, getColor());
  cybernetic_beams.initLeftArmBeams(renderer, getColor());
  var left_arm_shield = renderer.createResource("MODEL", "skyhighheroes:CyberneticShield");
  left_arm_shield.texture.set(null, "shield");
  left_arm_shield_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_shield);
  left_arm_shield_model.anchor.set("leftArm", left_arm.getCubeOffset("left_arm_shield_base"));
  left_arm_shield_model.setScale(1.0);
  left_arm_shield_model.setOffset(0.0, 1.02, 0.0);
  var left_arm_blade = renderer.createResource("MODEL", "skyhighheroes:CyberneticBlade");
  left_arm_blade.texture.set(null, "blade");
  left_arm_blade_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_blade);
  left_arm_blade_model.anchor.set("leftArm", left_arm.getCubeOffset("left_arm_blade_base"));
  left_arm_blade_model.setScale(1.0);
  left_arm_blade_model.setOffset(0.0, 0.7, 0.0);
  var right_arm = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL1");
  right_arm.texture.set("right_arm", "right_arm_lights");
  right_arm.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => cybernetics.rightArmAnimations(entity, data));
  right_arm_model = renderer.createEffect("fiskheroes:model").setModel(right_arm);
  right_arm_model.anchor.set("rightArm");
  right_arm_model.setScale(1.0);
  right_arm_boosters = cybernetic_boosters.initRightArmBoosters(renderer, right_arm, getColor());
  cybernetic_beams.initRightArmBeams(renderer, getColor());
  var right_arm_shield = renderer.createResource("MODEL", "skyhighheroes:CyberneticShield");
  right_arm_shield.texture.set(null, "shield");
  right_arm_shield_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_shield);
  right_arm_shield_model.anchor.set("rightArm", right_arm.getCubeOffset("right_arm_shield_base"));
  right_arm_shield_model.setScale(1.0);
  right_arm_shield_model.setOffset(0.0, 1.02, 0.0);
  var right_arm_blade = renderer.createResource("MODEL", "skyhighheroes:CyberneticBlade");
  right_arm_blade.texture.set(null, "blade");
  right_arm_blade_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_blade);
  right_arm_blade_model.anchor.set("rightArm", right_arm.getCubeOffset("right_arm_blade_base"));
  right_arm_blade_model.setScale(1.0);
  right_arm_blade_model.setOffset(0.0, 0.7, 0.0);
  var left_leg = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL1");
  left_leg.texture.set("left_leg", "left_leg_lights");
  left_leg.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => cybernetics.leftLegAnimations(entity, data));
  left_leg_model = renderer.createEffect("fiskheroes:model").setModel(left_leg);
  left_leg_model.anchor.set("leftLeg");
  left_leg_model.setScale(1.0);
  left_leg_boosters = cybernetic_boosters.initLeftLegBoosters(renderer, left_leg, getColor());
  var right_leg = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL1");
  right_leg.texture.set("right_leg", "right_leg_lights");
  right_leg.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => cybernetics.rightLegAnimations(entity, data));
  right_leg_model = renderer.createEffect("fiskheroes:model").setModel(right_leg);
  right_leg_model.anchor.set("rightLeg");
  right_leg_model.setScale(1.0);
  right_leg_boosters = cybernetic_boosters.initRightLegBoosters(renderer, right_leg, getColor());

  //Base skin
  var head_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_base.texture.set("head_base");
  head_base.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_base_model = renderer.createEffect("fiskheroes:model").setModel(head_base);
  head_base_model.anchor.set("head");
  head_base_model.setScale(1.0);
  var head_hair_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hair_base.texture.set("head_hair_base");
  head_hair_base.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_hair_base_model = renderer.createEffect("fiskheroes:model").setModel(head_hair_base);
  head_hair_base_model.anchor.set("head");
  head_hair_base_model.setOffset(0.0, 0.5, 0.0);
  head_hair_base_model.setScale(1.125);
  var body_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL2");
  body_base.texture.set("body_base");
  body_base.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => cybernetics.bodyAnimations(entity, data));
  body_base_model = renderer.createEffect("fiskheroes:model").setModel(body_base);
  body_base_model.anchor.set("body");
  body_base_model.setScale(1.0);
  var left_arm_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL2");
  left_arm_base.texture.set("left_arm_base");
  left_arm_base.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => cybernetics.leftArmAnimations(entity, data));
  left_arm_base_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_base);
  left_arm_base_model.anchor.set("leftArm");
  left_arm_base_model.setScale(1.0);
  var right_arm_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL2");
  right_arm_base.texture.set("right_arm_base");
  right_arm_base.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => cybernetics.rightArmAnimations(entity, data));
  right_arm_base_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_base);
  right_arm_base_model.anchor.set("rightArm");
  right_arm_base_model.setScale(1.0);
  var left_leg_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL2");
  left_leg_base.texture.set("left_leg_base");
  left_leg_base.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => cybernetics.leftLegAnimations(entity, data));
  left_leg_base_model = renderer.createEffect("fiskheroes:model").setModel(left_leg_base);
  left_leg_base_model.anchor.set("leftLeg");
  left_leg_base_model.setScale(1.0);
  var right_leg_base = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL2");
  right_leg_base.texture.set("right_leg_base");
  right_leg_base.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => cybernetics.rightLegAnimations(entity, data));
  right_leg_base_model = renderer.createEffect("fiskheroes:model").setModel(right_leg_base);
  right_leg_base_model.anchor.set("rightLeg");
  right_leg_base_model.setScale(1.0);

  //Disguise
  var head_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_disguise.texture.set("head_disguise");
  head_disguise.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_disguise_model = renderer.createEffect("fiskheroes:model").setModel(head_disguise);
  head_disguise_model.anchor.set("head");
  head_disguise_model.setScale(1.0);
  var head_hair_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hair_disguise.texture.set("head_hair_disguise");
  head_hair_disguise.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_hair_disguise_model = renderer.createEffect("fiskheroes:model").setModel(head_hair_disguise);
  head_hair_disguise_model.anchor.set("head");
  head_hair_disguise_model.setOffset(0.0, 0.5, 0.0);
  head_hair_disguise_model.setScale(1.125);
  var body_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL2");
  body_disguise.texture.set("body_disguise");
  body_disguise.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => cybernetics.bodyAnimations(entity, data));
  body_disguise_model = renderer.createEffect("fiskheroes:model").setModel(body_disguise);
  body_disguise_model.anchor.set("body");
  body_disguise_model.setScale(1.0);
  var left_arm_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL2");
  left_arm_disguise.texture.set("left_arm_disguise");
  left_arm_disguise.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => cybernetics.leftArmAnimations(entity, data));
  left_arm_disguise_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_disguise);
  left_arm_disguise_model.anchor.set("leftArm");
  left_arm_disguise_model.setScale(1.0);
  var right_arm_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL2");
  right_arm_disguise.texture.set("right_arm_disguise");
  right_arm_disguise.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => cybernetics.rightArmAnimations(entity, data));
  right_arm_disguise_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_disguise);
  right_arm_disguise_model.anchor.set("rightArm");
  right_arm_disguise_model.setScale(1.0);
  var left_leg_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL2");
  left_leg_disguise.texture.set("left_leg_disguise");
  left_leg_disguise.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => cybernetics.leftLegAnimations(entity, data));
  left_leg_disguise_model = renderer.createEffect("fiskheroes:model").setModel(left_leg_disguise);
  left_leg_disguise_model.anchor.set("leftLeg");
  left_leg_disguise_model.setScale(1.0);
  var right_leg_disguise = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL2");
  right_leg_disguise.texture.set("right_leg_disguise");
  right_leg_disguise.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => cybernetics.rightLegAnimations(entity, data));
  right_leg_disguise_model = renderer.createEffect("fiskheroes:model").setModel(right_leg_disguise);
  right_leg_disguise_model.anchor.set("rightLeg");
  right_leg_disguise_model.setScale(1.0);

  //Lights off  
  var head_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_lights_off.texture.set("head_base_lights");
  head_lights_off.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(head_lights_off);
  head_lights_off_model.anchor.set("head");
  head_lights_off_model.setScale(1.0);
  var head_hair_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hair_lights_off.texture.set("head_hair_base_lights");
  head_hair_lights_off.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_hair_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(head_hair_lights_off);
  head_hair_lights_off_model.anchor.set("head");
  head_hair_lights_off_model.setOffset(0.0, 0.5, 0.0);
  head_hair_lights_off_model.setScale(1.125);
  var body_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL2");
  body_lights_off.texture.set("body_base_lights");
  body_lights_off.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => cybernetics.bodyAnimations(entity, data));
  body_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(body_lights_off);
  body_lights_off_model.anchor.set("body");
  body_lights_off_model.setScale(1.0);
  var left_arm_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL2");
  left_arm_lights_off.texture.set("left_arm_base_lights");
  left_arm_lights_off.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => cybernetics.leftArmAnimations(entity, data));
  left_arm_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_lights_off);
  left_arm_lights_off_model.anchor.set("leftArm");
  left_arm_lights_off_model.setScale(1.0);
  var right_arm_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL2");
  right_arm_lights_off.texture.set("right_arm_base_lights");
  right_arm_lights_off.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => cybernetics.rightArmAnimations(entity, data));
  right_arm_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_lights_off);
  right_arm_lights_off_model.anchor.set("rightArm");
  right_arm_lights_off_model.setScale(1.0);
  var left_leg_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL2");
  left_leg_lights_off.texture.set("left_leg_base_lights");
  left_leg_lights_off.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => cybernetics.leftLegAnimations(entity, data));
  left_leg_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(left_leg_lights_off);
  left_leg_lights_off_model.anchor.set("leftLeg");
  left_leg_lights_off_model.setScale(1.0);
  var right_leg_lights_off = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL2");
  right_leg_lights_off.texture.set("right_leg_base_lights");
  right_leg_lights_off.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => cybernetics.rightLegAnimations(entity, data));
  right_leg_lights_off_model = renderer.createEffect("fiskheroes:model").setModel(right_leg_lights_off);
  right_leg_lights_off_model.anchor.set("rightLeg");
  right_leg_lights_off_model.setScale(1.0);

  //Lights on
  var head_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_lights_on.texture.set(null, "head_base_lights");
  head_lights_on.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(head_lights_on);
  head_lights_on_model.anchor.set("head");
  head_lights_on_model.setScale(1.0);
  var head_hair_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hair_lights_on.texture.set(null, "head_hair_base_lights");
  head_hair_lights_on.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => cybernetics.headAnimations(entity, data));
  head_hair_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(head_hair_lights_on);
  head_hair_lights_on_model.anchor.set("head");
  head_hair_lights_on_model.setOffset(0.0, 0.5, 0.0);
  head_hair_lights_on_model.setScale(1.125);
  var body_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL2");
  body_lights_on.texture.set(null, "body_base_lights");
  body_lights_on.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => cybernetics.bodyAnimations(entity, data));
  body_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(body_lights_on);
  body_lights_on_model.anchor.set("body");
  body_lights_on_model.setScale(1.0);
  var left_arm_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL2");
  left_arm_lights_on.texture.set(null, "left_arm_base_lights");
  left_arm_lights_on.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => cybernetics.leftArmAnimations(entity, data));
  left_arm_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_lights_on);
  left_arm_lights_on_model.anchor.set("leftArm");
  left_arm_lights_on_model.setScale(1.0);
  var right_arm_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL2");
  right_arm_lights_on.texture.set(null, "right_arm_base_lights");
  right_arm_lights_on.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => cybernetics.rightArmAnimations(entity, data));
  right_arm_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_lights_on);
  right_arm_lights_on_model.anchor.set("rightArm");
  right_arm_lights_on_model.setScale(1.0);
  var left_leg_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL2");
  left_leg_lights_on.texture.set(null, "left_leg_base_lights");
  left_leg_lights_on.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => cybernetics.leftLegAnimations(entity, data));
  left_leg_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(left_leg_lights_on);
  left_leg_lights_on_model.anchor.set("leftLeg");
  left_leg_lights_on_model.setScale(1.0);
  var right_leg_lights_on = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL2");
  right_leg_lights_on.texture.set(null, "right_leg_base_lights");
  right_leg_lights_on.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => cybernetics.rightLegAnimations(entity, data));
  right_leg_lights_on_model = renderer.createEffect("fiskheroes:model").setModel(right_leg_lights_on);
  right_leg_lights_on_model.anchor.set("rightLeg");
  right_leg_lights_on_model.setScale(1.0);

  metal_heat = renderer.createEffect("fiskheroes:metal_heat");
  metal_heat.includeEffects(head_model, body_model, left_arm_model, right_arm_model, left_leg_model, right_leg_model, head_base_model, head_hair_base_model, body_base_model, left_arm_base_model, right_arm_base_model, left_leg_base_model, right_leg_base_model, head_disguise_model, head_hair_disguise_model, body_disguise_model, left_arm_disguise_model, right_arm_disguise_model, left_leg_disguise_model, right_leg_disguise_model, head_lights_off_model, head_hair_lights_off_model, body_lights_off_model, left_arm_lights_off_model, right_arm_lights_off_model, left_leg_lights_off_model, right_leg_lights_off_model, head_lights_on_model, head_hair_lights_on_model, body_lights_on_model, left_arm_lights_on_model, right_arm_lights_on_model, left_leg_lights_on_model, right_leg_lights_on_model);
  renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
    return 0.999999;
  }).setCondition(entity => (entity.isWearingFullSuit()));

  var nv = renderer.bindProperty("fiskheroes:night_vision");
  nv.fogStrength = 0.0;
  nv.firstPersonOnly = false;
  nv.factor = 1.0;
  nv.setCondition(entity => (entity.isWearingFullSuit() && entity.getData("skyhighheroes:dyn/night_vision") && entity.getData("skyhighheroes:dyn/converted_cyber")));

  var display = renderer.createResource("MODEL", "skyhighheroes:CyberneticDisplay");
  display.texture.set(null, "display_status");
  display_model = renderer.createEffect("fiskheroes:model").setModel(display);
  display_model.anchor.set("head");
  display_model.anchor.ignoreAnchor(true);
  display_model.setOffset(mainMenu.centerX, mainMenu.centerY, mainMenu.z+30.0);
  display_model.setRotation(0.0, 180.0, 0.0);
  display_model.setScale(4.0);
};

function initAnimations(renderer) {
  cybernetics.initCyberneticAnimations(renderer);
  stuff.addAnimationEvent(renderer, "FLIGHT_DIVE", "skyhighheroes:cybernetic_dive");
  stuff.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "skyhighheroes:cybernetic_dive_roll");
};

function render(entity, renderLayer, isFirstPersonArm) {
  var nbt = cybernetics.mainNBT(entity);
  var leftShield = stuff.clamp(entity.getInterpolatedData("skyhighheroes:dyn/shield_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_left_timer") + cybernetics.getHoloBooleans(entity, "holoShields", "shieldsLeft"), 0, 1);
  left_arm_shield_model.opacity = stuff.animate2(leftShield, 1.0, 0.6, 0.4, 0.0);
  var rightShield = stuff.clamp(entity.getInterpolatedData("skyhighheroes:dyn/shield_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_right_timer") + cybernetics.getHoloBooleans(entity, "holoShields", "shieldsright"), 0, 1);
  right_arm_shield_model.opacity = stuff.animate2(rightShield, 1.0, 0.6, 0.4, 0.0);
  var leftBlade = stuff.clamp(entity.getInterpolatedData("skyhighheroes:dyn/blade_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") + cybernetics.getHoloBooleans(entity, "holoBlades", "bladesLeft"), 0, 1);
  left_arm_blade_model.opacity = stuff.animate2(leftBlade, 1.0, 0.9, 0.1, 0.0);
  var rightBlade = stuff.clamp(entity.getInterpolatedData("skyhighheroes:dyn/blade_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") + cybernetics.getHoloBooleans(entity, "holoBlades", "bladesright"), 0, 1);
  right_arm_blade_model.opacity = stuff.animate2(rightBlade, 1.0, 0.9, 0.1, 0.0);
  if (entity.is("DISPLAY")) {
    if (nbt.getBoolean("disguiseOnStand")) {
      head_disguise_model.render();
      head_hair_disguise_model.render();
      body_disguise_model.render();
      left_arm_disguise_model.render();
      right_arm_disguise_model.render();
      left_leg_disguise_model.render();
      right_leg_disguise_model.render();
    };
    if (!nbt.getBoolean("disguiseOnStand")) {
      head_base_model.render();
      head_hair_base_model.render();
      body_base_model.render();
      left_arm_base_model.render();
      right_arm_base_model.render();
      left_leg_base_model.render();
      right_leg_base_model.render();
      if (!nbt.getBoolean("bodyLights")) {
        head_lights_off_model.render();
        head_hair_lights_off_model.render();
        body_lights_off_model.render();
        left_arm_lights_off_model.render();
        right_arm_lights_off_model.render();
        left_leg_lights_off_model.render();
        right_leg_lights_off_model.render();
      } else {
        head_lights_on_model.render();
        head_hair_lights_on_model.render();
        body_lights_on_model.render();
        left_arm_lights_on_model.render();
        right_arm_lights_on_model.render();
        left_leg_lights_on_model.render();
        right_leg_lights_on_model.render();
      };
    };
    head_model.render();
    body_model.render();
    left_arm_model.render();
    left_arm_shield_model.render();
    left_arm_blade_model.render();
    right_arm_model.render();
    right_arm_shield_model.render();
    right_arm_blade_model.render();
    left_leg_model.render();
    right_leg_model.render();
  };
  if (entity.getData("skyhighheroes:dyn/converted_cyber")) {
    head_model.opacity = 1.0;
    body_model.opacity = 1.0;
    left_arm_model.opacity = 1.0;
    right_arm_model.opacity = 1.0;
    left_leg_model.opacity = 1.0;
    right_leg_model.opacity = 1.0;
    if (entity.isWearingFullSuit()) {
      if (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_camouflage_timer") < 1) {
        if (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_disguise_timer") > 0) {
          head_disguise_model.render();
          head_hair_disguise_model.render();
          body_disguise_model.render();
          left_arm_disguise_model.render();
          right_arm_disguise_model.render();
          left_leg_disguise_model.render();
          right_leg_disguise_model.render();
        };
        if (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_disguise_timer") < 1) {
          head_base_model.render();
          head_hair_base_model.render();
          body_base_model.render();
          left_arm_base_model.render();
          right_arm_base_model.render();
          left_leg_base_model.render();
          right_leg_base_model.render();
          if (!entity.getData("skyhighheroes:dyn/cybernetic_body_lights") || entity.getInterpolatedData("skyhighheroes:dyn/powering_down_timer") == 1) {
            head_lights_off_model.render();
            head_hair_lights_off_model.render();
            body_lights_off_model.render();
            left_arm_lights_off_model.render();
            right_arm_lights_off_model.render();
            left_leg_lights_off_model.render();
            right_leg_lights_off_model.render();
          } else {
            head_lights_on_model.render();
            head_hair_lights_on_model.render();
            body_lights_on_model.render();
            left_arm_lights_on_model.render();
            right_arm_lights_on_model.render();
            left_leg_lights_on_model.render();
            right_leg_lights_on_model.render();
          };
        };
      };
      if (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_camouflage_timer") == 0) {
        head_model.render();
        body_model.render();
        left_arm_model.render();
        left_arm_shield_model.render();
        left_arm_blade_model.render();
        right_arm_model.render();
        right_arm_shield_model.render();
        right_arm_blade_model.render();
        left_leg_model.render();
        right_leg_model.render();
      };
      satellite_beams.render(entity, isFirstPersonArm);
      body_boosters.render(entity, renderLayer, isFirstPersonArm);
      left_arm_boosters.render(entity, renderLayer, isFirstPersonArm);
      right_arm_boosters.render(entity, renderLayer, isFirstPersonArm);
      left_leg_boosters.render(entity, renderLayer, isFirstPersonArm);
      right_leg_boosters.render(entity, renderLayer, isFirstPersonArm);
      
      metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
      metal_heat.render();
    };
    if (entity.isWearingFullSuit() && isFirstPersonArm) {
      if (entity.getData("skyhighheroes:dyn/interface")) {
        border.render(isFirstPersonArm);
        baseMenu.render(isFirstPersonArm);
        mainMenu.render(isFirstPersonArm);
        sideMenu.render(isFirstPersonArm);
        text_renderer.renderLine(isFirstPersonArm, "center", "top", ((entity.getInterpolatedData("skyhighheroes:dyn/charging_timer") == 1) ? "Charging... " : "") + (((entity.getInterpolatedData("skyhighheroes:dyn/energy") / 1000000000) * 100).toFixed(0) + "%"), mainMenu.centerX, mainMenu.topY, mainMenu.z, 1.0);
        var currentDate = new Date();
        text_renderer.renderLine(isFirstPersonArm, "left", "top", currentDate.getDate() + " " + stuff.months[currentDate.getMonth()] + " " + currentDate.getFullYear(), mainMenu.leftX + 3.0, mainMenu.topY, mainMenu.z, 1.0);
        text_renderer.renderLine(isFirstPersonArm, "right", "top", currentDate.getHours() + ":" + ((currentDate.getMinutes() > 9) ? currentDate.getMinutes() : "0" + currentDate.getMinutes()) + ":" + ((currentDate.getSeconds() > 9) ? currentDate.getSeconds() : "0" + currentDate.getSeconds()), mainMenu.rightX - 3.0, mainMenu.topY, mainMenu.z, 1.0);
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Overview", overviewSelected.centerX, overviewSelected.centerY, overviewSelected.z, 1.0);
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_overview" || entity.getData("skyhighheroes:dyn/current_menu") == "overview") {
          overviewSelected.render(isFirstPersonArm);
          displayHead.render(isFirstPersonArm);
          displayHeadHair.render(isFirstPersonArm);
          displayBody.render(isFirstPersonArm);
          displayLeftArm.render(isFirstPersonArm);
          displayLeftLeg.render(isFirstPersonArm);
          displayRightArm.render(isFirstPersonArm);
          displayRightLeg.render(isFirstPersonArm);
          rocketBodyLeftDeployStatus.render2(entity, isFirstPersonArm, "rocket_body_left_deploy_timer", "rockets_body_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_body_left_deploy") {
            rocketBodyLeftDeploySelector.render(isFirstPersonArm);
          };
          rocketBodyRightDeployStatus.render2(entity, isFirstPersonArm, "rocket_body_right_deploy_timer", "rockets_body_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_body_right_deploy") {
            rocketBodyRightDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftArmOuterDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_arm_outer_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_arm_outer_deploy") {
            rocketLeftArmOuterDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftArmFrontDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_arm_front_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_arm_front_deploy") {
            rocketLeftArmFrontDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftArmBackDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_arm_back_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_arm_back_deploy") {
            rocketLeftArmBackDeploySelector.render(isFirstPersonArm);
          };
          rocketRightArmOuterDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_arm_outer_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_arm_outer_deploy") {
            rocketRightArmOuterDeploySelector.render(isFirstPersonArm);
          };
          rocketRightArmFrontDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_arm_front_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_arm_front_deploy") {
            rocketRightArmFrontDeploySelector.render(isFirstPersonArm);
          };
          rocketRightArmBackDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_arm_back_deploy_timer", "rockets_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_arm_back_deploy") {
            rocketRightArmBackDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftLegMainDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_leg_main_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_leg_main_deploy") {
            rocketLeftLegMainDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftLegInnerDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_leg_inner_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_leg_inner_deploy") {
            rocketLeftLegInnerDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftLegOuterDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_leg_outer_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_leg_outer_deploy") {
            rocketLeftLegOuterDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftLegFrontDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_leg_front_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_leg_front_deploy") {
            rocketLeftLegFrontDeploySelector.render(isFirstPersonArm);
          };
          rocketLeftLegBackDeployStatus.render2(entity, isFirstPersonArm, "rocket_left_leg_back_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_left_leg_back_deploy") {
            rocketLeftLegBackDeploySelector.render(isFirstPersonArm);
          };
          rocketRightLegMainDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_leg_main_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_leg_main_deploy") {
            rocketRightLegMainDeploySelector.render(isFirstPersonArm);
          };
          rocketRightLegInnerDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_leg_inner_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_leg_inner_deploy") {
            rocketRightLegInnerDeploySelector.render(isFirstPersonArm);
          };
          rocketRightLegOuterDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_leg_outer_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_leg_outer_deploy") {
            rocketRightLegOuterDeploySelector.render(isFirstPersonArm);
          };
          rocketRightLegFrontDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_leg_front_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_leg_front_deploy") {
            rocketRightLegFrontDeploySelector.render(isFirstPersonArm);
          };
          rocketRightLegBackDeployStatus.render2(entity, isFirstPersonArm, "rocket_right_leg_back_deploy_timer", "rockets_legs_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rocket_right_leg_back_deploy") {
            rocketRightLegBackDeploySelector.render(isFirstPersonArm);
          };
          cannonLeftArmBottomDeployStatus.render2(entity, isFirstPersonArm, "cannon_left_arm_bottom_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_left_arm_bottom_deploy") {
            cannonLeftArmBottomDeploySelector.render(isFirstPersonArm);
          };
          cannonLeftArmFrontDeployStatus.render2(entity, isFirstPersonArm, "cannon_left_arm_front_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_left_arm_front_deploy") {
            cannonLeftArmFrontDeploySelector.render(isFirstPersonArm);
          };
          cannonLeftArmBackDeployStatus.render2(entity, isFirstPersonArm, "cannon_left_arm_back_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_left_arm_back_deploy") {
            cannonLeftArmBackDeploySelector.render(isFirstPersonArm);
          };
          cannonRightArmBottomDeployStatus.render2(entity, isFirstPersonArm, "cannon_right_arm_bottom_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_right_arm_bottom_deploy") {
            cannonRightArmBottomDeploySelector.render(isFirstPersonArm);
          };
          cannonRightArmFrontDeployStatus.render2(entity, isFirstPersonArm, "cannon_right_arm_front_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_right_arm_front_deploy") {
            cannonRightArmFrontDeploySelector.render(isFirstPersonArm);
          };
          cannonRightArmBackDeployStatus.render2(entity, isFirstPersonArm, "cannon_right_arm_back_deploy_timer", "cannons_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_right_arm_back_deploy") {
            cannonRightArmBackDeploySelector.render(isFirstPersonArm);
          };
          cannonBodyLeftDeployStatus.render2(entity, isFirstPersonArm, "cannon_body_left_deploy_timer", "cannons_body_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_body_left_deploy") {
            cannonBodyLeftDeploySelector.render(isFirstPersonArm);
          };
          cannonBodyRightDeployStatus.render2(entity, isFirstPersonArm, "cannon_body_right_deploy_timer", "cannons_body_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_body_right_deploy") {
            cannonBodyRightDeploySelector.render(isFirstPersonArm);
          };
          cannonHeadLeftDeployStatus.render2(entity, isFirstPersonArm, "cannon_head_left_deploy_timer", "cannons_head_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_head_left_deploy") {
            cannonHeadLeftDeploySelector.render(isFirstPersonArm);
          };
          cannonHeadRightDeployStatus.render2(entity, isFirstPersonArm, "cannon_head_right_deploy_timer", "cannons_head_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannon_head_right_deploy") {
            cannonHeadRightDeploySelector.render(isFirstPersonArm);
          };
          satelliteRainModeStatus.render(entity, isFirstPersonArm, "satellite_rain_mode_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "satellite_rain_mode") {
            satelliteRainModeSelector.render(isFirstPersonArm);
          };
          satelliteDeployStatus.render(entity, isFirstPersonArm, "satellite_deploy_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "satellite_deploy") {
            satelliteDeploySelector.render(isFirstPersonArm);
          };
          antennaDeployStatus.render(entity, isFirstPersonArm, "antenna_deploy_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "antenna_deploy") {
            antennaDeploySelector.render(isFirstPersonArm);
          };
          wingLeftDeployStatus.render2(entity, isFirstPersonArm, "wing_left_deploy_timer", "wings_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "wing_left_deploy") {
            wingLeftDeploySelector.render(isFirstPersonArm);
          };
          wingRightDeployStatus.render2(entity, isFirstPersonArm, "wing_right_deploy_timer", "wings_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "wing_right_deploy") {
            wingRightDeploySelector.render(isFirstPersonArm);
          };
          externalArmLeftDeployStatus.render2(entity, isFirstPersonArm, "external_arm_left_deploy_timer", "external_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "external_arm_left_deploy") {
            externalArmLeftDeploySelector.render(isFirstPersonArm);
          };
          externalArmRightDeployStatus.render2(entity, isFirstPersonArm, "external_arm_right_deploy_timer", "external_arms_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "external_arm_right_deploy") {
            externalArmRightDeploySelector.render(isFirstPersonArm);
          };
          bladeLeftDeployStatus.render2(entity, isFirstPersonArm, "blade_left_deploy_timer", "blade_left_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_left_deploy") {
            bladeLeftDeploySelector.render(isFirstPersonArm);
          };
          bladeRightDeployStatus.render2(entity, isFirstPersonArm, "blade_right_deploy_timer", "blade_right_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_right_deploy") {
            bladeRightDeploySelector.render(isFirstPersonArm);
          };
          shieldLeftDeployStatus.render2(entity, isFirstPersonArm, "shield_left_deploy_timer", "shield_left_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "shield_left_deploy") {
            shieldLeftDeploySelector.render(isFirstPersonArm);
          };
          shieldRightDeployStatus.render2(entity, isFirstPersonArm, "shield_right_deploy_timer", "shield_right_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "shield_right_deploy") {
            shieldRightDeploySelector.render(isFirstPersonArm);
          };
          intakeHeadLeftOpenStatus.render(entity, isFirstPersonArm, "intake_head_left_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_head_left_open") {
            intakeHeadLeftOpenSelector.render(isFirstPersonArm);
          };
          intakeHeadRightOpenStatus.render(entity, isFirstPersonArm, "intake_head_right_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_head_right_open") {
            intakeHeadRightOpenSelector.render(isFirstPersonArm);
          };
          intakeBodyLeftOpenStatus.render(entity, isFirstPersonArm, "intake_body_left_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_body_left_open") {
            intakeBodyLeftOpenSelector.render(isFirstPersonArm);
          };
          intakeBodyRightOpenStatus.render(entity, isFirstPersonArm, "intake_body_right_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_body_right_open") {
            intakeBodyRightOpenSelector.render(isFirstPersonArm);
          };
          intakeLeftArmOpenStatus.render(entity, isFirstPersonArm, "intake_left_arm_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_left_arm_open") {
            intakeLeftArmOpenSelector.render(isFirstPersonArm);
          };
          intakeRightArmOpenStatus.render(entity, isFirstPersonArm, "intake_right_arm_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_right_arm_open") {
            intakeRightArmOpenSelector.render(isFirstPersonArm);
          };
          intakeLeftLegOpenStatus.render(entity, isFirstPersonArm, "intake_left_leg_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_left_leg_open") {
            intakeLeftLegOpenSelector.render(isFirstPersonArm);
          };
          intakeRightLegOpenStatus.render(entity, isFirstPersonArm, "intake_right_leg_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_right_leg_open") {
            intakeRightLegOpenSelector.render(isFirstPersonArm);
          };
          intakeHeadLeftStartUpStatus.render(entity, isFirstPersonArm, "intake_head_left_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_head_left_start_up") {
            intakeHeadLeftStartUpSelector.render(isFirstPersonArm);
          };
          intakeHeadRightStartUpStatus.render(entity, isFirstPersonArm, "intake_head_right_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_head_right_start_up") {
            intakeHeadRightStartUpSelector.render(isFirstPersonArm);
          };
          intakeBodyLeftStartUpStatus.render(entity, isFirstPersonArm, "intake_body_left_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_body_left_start_up") {
            intakeBodyLeftStartUpSelector.render(isFirstPersonArm);
          };
          intakeBodyRightStartUpStatus.render(entity, isFirstPersonArm, "intake_body_right_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_body_right_start_up") {
            intakeBodyRightStartUpSelector.render(isFirstPersonArm);
          };
          intakeLeftArmStartUpStatus.render(entity, isFirstPersonArm, "intake_left_arm_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_left_arm_start_up") {
            intakeLeftArmStartUpSelector.render(isFirstPersonArm);
          };
          intakeRightArmStartUpStatus.render(entity, isFirstPersonArm, "intake_right_arm_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_right_arm_start_up") {
            intakeRightArmStartUpSelector.render(isFirstPersonArm);
          };
          intakeLeftLegStartUpStatus.render(entity, isFirstPersonArm, "intake_left_leg_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_left_leg_start_up") {
            intakeLeftLegStartUpSelector.render(isFirstPersonArm);
          };
          intakeRightLegStartUpStatus.render(entity, isFirstPersonArm, "intake_right_leg_start_up_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "intake_right_leg_start_up") {
            intakeRightLegStartUpSelector.render(isFirstPersonArm);
          };
          systemCoreOpenStatus.render(entity, isFirstPersonArm, "system_core_open_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "system_core_open") {
            systemCoreOpenSelector.render(isFirstPersonArm);
          };
          opticsEnabledStatus.render(entity, isFirstPersonArm, "optics_enabling_timer");
          if (entity.getData("skyhighheroes:dyn/selected_button") == "optics_enabled") {
            opticsEnabledSelector.render(isFirstPersonArm);
          };
        };
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_rockets_wings" || entity.getData("skyhighheroes:dyn/current_menu") == "rockets_wings") {
          rocketsWingsSelected.render(isFirstPersonArm);
          //
          rocketsArmsArmedStatus.render(entity, isFirstPersonArm, "rockets_arms_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Arms Rockets Armed", rocketsArmsArmedStatus.centerX, rocketsArmsArmedStatus.bottomY + 8.0, rocketsArmsArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_arms_armed") {
            rocketsArmsArmedSelector.render(isFirstPersonArm);
          };
          //
          rocketsBodyArmedStatus.render(entity, isFirstPersonArm, "rockets_body_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Body Rockets Armed", rocketsBodyArmedStatus.centerX, rocketsBodyArmedStatus.bottomY + 8.0, rocketsBodyArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_body_armed") {
            rocketsBodyArmedSelector.render(isFirstPersonArm);
          };
          //
          rocketsLegsArmedStatus.render(entity, isFirstPersonArm, "rockets_legs_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Legs Rockets Armed", rocketsLegsArmedStatus.centerX, rocketsLegsArmedStatus.bottomY + 8.0, rocketsLegsArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_legs_armed") {
            rocketsLegsArmedSelector.render(isFirstPersonArm);
          };
          //
          rocketsWingsArmedStatus.render(entity, isFirstPersonArm, "rockets_wings_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Wings Rockets Armed", rocketsWingsArmedStatus.centerX, rocketsWingsArmedStatus.bottomY + 8.0, rocketsWingsArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_wings_armed") {
            rocketsWingsArmedSelector.render(isFirstPersonArm);
          };
          //
          wingsArmedStatus.render(entity, isFirstPersonArm, "wings_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Wings Armed", wingsArmedStatus.centerX, wingsArmedStatus.bottomY + 8.0, wingsArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "wings_armed") {
            wingsArmedSelector.render(isFirstPersonArm);
          };
          //
          onFallProtectionStatus.render(entity, isFirstPersonArm, "rockets_on_fall");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Rockets On Fall", onFallProtectionStatus.centerX, onFallProtectionStatus.bottomY + 8.0, onFallProtectionStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_on_fall") {
            onFallProtectionSelector.render(isFirstPersonArm);
          };
          //
          rocketsInnerLegsStatus.render(entity, isFirstPersonArm, "rocket_inner_legs_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Inner Leg Rockets", rocketsInnerLegsStatus.centerX, rocketsInnerLegsStatus.bottomY + 8.0, rocketsInnerLegsStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "rockets_inner_legs") {
            rocketsInnerLegsSelector.render(isFirstPersonArm);
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Rockets & Wings", rocketsWingsSelected.centerX, rocketsWingsSelected.centerY, rocketsWingsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_cannons" || entity.getData("skyhighheroes:dyn/current_menu") == "cannons") {
          cannonsSelected.render(isFirstPersonArm);
          //
          cannnonsHeadFlushStatus.render(entity, isFirstPersonArm, "cannon_head_flush_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Head Cannons Flush", cannnonsHeadFlushStatus.centerX, cannnonsHeadFlushStatus.bottomY + 8.0, cannnonsHeadFlushStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_head_flush") {
            cannnonsHeadFlushSelector.render(isFirstPersonArm);
          };
          //
          cannnonsBodyFlushStatus.render(entity, isFirstPersonArm, "cannon_body_flush_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Body Cannons Flush", cannnonsBodyFlushStatus.centerX, cannnonsBodyFlushStatus.bottomY + 8.0, cannnonsBodyFlushStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_body_flush") {
            cannnonsBodyFlushSelector.render(isFirstPersonArm);
          };
          //
          cannnonsLeftArmFlushStatus.render(entity, isFirstPersonArm, "cannon_left_arm_flush_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Left Arm Cannons Flush", cannnonsLeftArmFlushStatus.centerX, cannnonsLeftArmFlushStatus.bottomY + 8.0, cannnonsLeftArmFlushStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_left_arm_flush") {
            cannnonsLeftArmFlushSelector.render(isFirstPersonArm);
          };
          //
          cannnonsHeadArmedStatus.render(entity, isFirstPersonArm, "cannons_head_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Head Cannons Armed", cannnonsHeadArmedStatus.centerX, cannnonsHeadArmedStatus.bottomY + 8.0, cannnonsHeadArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_head_armed") {
            cannnonsHeadArmedSelector.render(isFirstPersonArm);
          };
          //
          cannnonsBodyArmedStatus.render(entity, isFirstPersonArm, "cannons_body_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Body Cannons Armed", cannnonsBodyArmedStatus.centerX, cannnonsBodyArmedStatus.bottomY + 8.0, cannnonsBodyArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_body_armed") {
            cannnonsBodyArmedSelector.render(isFirstPersonArm);
          };
          //
          cannnonsArmsArmedStatus.render(entity, isFirstPersonArm, "cannons_arms_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Arms Cannons Armed", cannnonsArmsArmedStatus.centerX, cannnonsArmsArmedStatus.bottomY + 8.0, cannnonsArmsArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_arms_armed") {
            cannnonsArmsArmedSelector.render(isFirstPersonArm);
          };
          //
          cannnonsRightArmFlushStatus.render(entity, isFirstPersonArm, "cannon_right_arm_flush_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Right Arm Cannons Flush", cannnonsRightArmFlushStatus.centerX, cannnonsRightArmFlushStatus.bottomY + 8.0, cannnonsRightArmFlushStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "cannons_right_arm_flush") {
            cannnonsRightArmFlushSelector.render(isFirstPersonArm);
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Cannons", cannonsSelected.centerX, cannonsSelected.centerY, cannonsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_blades_shields" || entity.getData("skyhighheroes:dyn/current_menu") == "blades_shields") {
          bladesShieldsSelected.render(isFirstPersonArm);
          //
          bladeLeftArmedStatus.render(entity, isFirstPersonArm, "blade_left_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Left Blade Armed", bladeLeftArmedStatus.centerX, bladeLeftArmedStatus.bottomY+8.0, bladeLeftArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_left_armed") {
            bladeLeftArmedSelector.render(isFirstPersonArm);
          };
          //
          bladeLeftStealthStatus.render(entity, isFirstPersonArm, "blade_left_stealth_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Left Blade Stealth", bladeLeftStealthStatus.centerX, bladeLeftStealthStatus.bottomY+8.0, bladeLeftStealthStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_left_stealth") {
            bladeLeftStealthSelector.render(isFirstPersonArm);
          };
          //
          shieldLeftArmedStatus.render(entity, isFirstPersonArm, "shield_left_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Left Shield Armed", shieldLeftArmedStatus.centerX, shieldLeftArmedStatus.bottomY+8.0, shieldLeftArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "shield_left_armed") {
            shieldLeftArmedSelector.render(isFirstPersonArm);
          };
          //
          bladeRightArmedStatus.render(entity, isFirstPersonArm, "blade_right_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Right Blade Armed", bladeRightArmedStatus.centerX, bladeRightArmedStatus.bottomY+8.0, bladeRightArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_right_armed") {
            bladeRightArmedSelector.render(isFirstPersonArm);
          };
          //
          bladeRightStealthStatus.render(entity, isFirstPersonArm, "blade_right_stealth_enabled");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Right Blade Stealth", bladeRightStealthStatus.centerX, bladeRightStealthStatus.bottomY+8.0, bladeRightStealthStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "blade_right_stealth") {
            bladeRightStealthSelector.render(isFirstPersonArm);
          };
          //
          shieldRightArmedStatus.render(entity, isFirstPersonArm, "shield_right_armed");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Right Shield Armed", shieldRightArmedStatus.centerX, shieldRightArmedStatus.bottomY+8.0, shieldRightArmedStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "shield_right_armed") {
            shieldRightArmedSelector.render(isFirstPersonArm);
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Blades & Shields", bladesShieldsSelected.centerX, bladesShieldsSelected.centerY, bladesShieldsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_suits" || entity.getData("skyhighheroes:dyn/current_menu") == "suits") {
          suitsSelected.render(isFirstPersonArm);
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "") {
            suitsBaseBox.render(isFirstPersonArm);
            suitsBaseBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Edit", suitsEditSelected.leftX + 14.0, suitsEditSelected.centerY, suitsEditSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_edit") {
              suitsEditSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Upload", suitsUploadSelected.leftX + 14.0, suitsUploadSelected.centerY, suitsUploadSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_upload") {
              suitsUploadSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Download", suitsDownloadSelected.leftX + 14.0, suitsDownloadSelected.centerY, suitsDownloadSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_download") {
              suitsDownloadSelected.render(isFirstPersonArm);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_edit") {
            suitsEditBox.render(isFirstPersonArm);
            suitsEditBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Delete", suitsDeleteSelected.leftX + 14.0, suitsDeleteSelected.centerY, suitsDeleteSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_delete") {
              suitsDeleteSelected.render(isFirstPersonArm);
            };
            listBox.render(isFirstPersonArm);
            listBoxInner.render(isFirstPersonArm);
            listScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll_value"), entity.getData("skyhighheroes:dyn/scroll_total"));
            listButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_0"), listButton0.leftX + 3.0, listButton0.centerY, listButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_0") {
              listButton0Selected.render(entity, isFirstPersonArm);
            };
            listButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_1"), listButton1.leftX + 3.0, listButton1.centerY, listButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_1") {
              listButton1Selected.render(entity, isFirstPersonArm);
            };
            listButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_2"), listButton2.leftX + 3.0, listButton2.centerY, listButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_2") {
              listButton2Selected.render(entity, isFirstPersonArm);
            };
            listButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_3"), listButton3.leftX + 3.0, listButton3.centerY, listButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_3") {
              listButton3Selected.render(entity, isFirstPersonArm);
            };
            listButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_4"), listButton4.leftX + 4.0, listButton4.centerY, listButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_4") {
              listButton4Selected.render(entity, isFirstPersonArm);
            };
            listButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_5"), listButton5.leftX + 3.0, listButton5.centerY, listButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_5") {
              listButton5Selected.render(entity, isFirstPersonArm);
            };
            listButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_6"), listButton6.leftX + 4.0, listButton6.centerY, listButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_6") {
              listButton6Selected.render(entity, isFirstPersonArm);
            };
            listButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_7"), listButton7.leftX + 4.0, listButton7.centerY, listButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_7") {
              listButton7Selected.render(entity, isFirstPersonArm);
            };
            listButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_8"), listButton8.leftX + 4.0, listButton8.centerY, listButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_8") {
              listButton8Selected.render(entity, isFirstPersonArm);
            };
            listButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_9"), listButton9.leftX + 4.0, listButton9.centerY, listButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_select_9") {
              listButton9Selected.render(entity, isFirstPersonArm);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload" || entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
            if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Suits", listBaseBox.centerX, listBaseBox.topY - 7.0, listBaseBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Upload Queue", listQueueBox.centerX, listQueueBox.topY - 7.0, listQueueBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Start Upload", queueActionButton.centerX, queueActionButton.centerY, queueActionButton.z, 1.0);
            };
            if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Data Drive", listBaseBox.centerX, listBaseBox.topY - 7.0, listBaseBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Download Queue", listQueueBox.centerX, listQueueBox.topY - 7.0, listQueueBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Start Download", queueActionButton.centerX, queueActionButton.centerY, queueActionButton.z, 1.0);
            };
            queueActionButton.render(isFirstPersonArm);
            queueActionButtonBorder.render(isFirstPersonArm);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_run_queue") {
              queueActionButtonSelected.render(entity, isFirstPersonArm);
            };
            listBaseBox.render(isFirstPersonArm);
            listBaseBoxInner.render(isFirstPersonArm);
            listBaseScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll_value"), entity.getData("skyhighheroes:dyn/scroll_total"));
            listBaseButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_0"), listBaseButton0.leftX + 3.0, listBaseButton0.centerY, listBaseButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_0") {
              listBaseButton0Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_1"), listBaseButton1.leftX + 3.0, listBaseButton1.centerY, listBaseButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_1") {
              listBaseButton1Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_2"), listBaseButton2.leftX + 3.0, listBaseButton2.centerY, listBaseButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_2") {
              listBaseButton2Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_3"), listBaseButton3.leftX + 3.0, listBaseButton3.centerY, listBaseButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_3") {
              listBaseButton3Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_4"), listBaseButton4.leftX + 4.0, listBaseButton4.centerY, listBaseButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_4") {
              listBaseButton4Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_5"), listBaseButton5.leftX + 3.0, listBaseButton5.centerY, listBaseButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_5") {
              listBaseButton5Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_6"), listBaseButton6.leftX + 4.0, listBaseButton6.centerY, listBaseButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_6") {
              listBaseButton6Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_7"), listBaseButton7.leftX + 4.0, listBaseButton7.centerY, listBaseButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_7") {
              listBaseButton7Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_8"), listBaseButton8.leftX + 4.0, listBaseButton8.centerY, listBaseButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_8") {
              listBaseButton8Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_9"), listBaseButton9.leftX + 4.0, listBaseButton9.centerY, listBaseButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_base_select_9") {
              listBaseButton9Selected.render(entity, isFirstPersonArm);
            };
            listQueueBox.render(isFirstPersonArm);
            listQueueBoxInner.render(isFirstPersonArm);
            listQueueScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll2_value"), entity.getData("skyhighheroes:dyn/scroll2_total"));
            listQueueButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_0"), listQueueButton0.leftX + 3.0, listQueueButton0.centerY, listQueueButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_0") {
              listQueueButton0Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_1"), listQueueButton1.leftX + 3.0, listQueueButton1.centerY, listQueueButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_1") {
              listQueueButton1Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_2"), listQueueButton2.leftX + 3.0, listQueueButton2.centerY, listQueueButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_2") {
              listQueueButton2Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_3"), listQueueButton3.leftX + 3.0, listQueueButton3.centerY, listQueueButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_3") {
              listQueueButton3Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_4"), listQueueButton4.leftX + 4.0, listQueueButton4.centerY, listQueueButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_4") {
              listQueueButton4Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_5"), listQueueButton5.leftX + 3.0, listQueueButton5.centerY, listQueueButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_5") {
              listQueueButton5Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_6"), listQueueButton6.leftX + 4.0, listQueueButton6.centerY, listQueueButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_6") {
              listQueueButton6Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_7"), listQueueButton7.leftX + 4.0, listQueueButton7.centerY, listQueueButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_7") {
              listQueueButton7Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_8"), listQueueButton8.leftX + 4.0, listQueueButton8.centerY, listQueueButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_8") {
              listQueueButton8Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_9"), listQueueButton9.leftX + 4.0, listQueueButton9.centerY, listQueueButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "suits_queue_select_9") {
              listQueueButton9Selected.render(entity, isFirstPersonArm);
            };
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Suits", suitsSelected.centerX, suitsSelected.centerY, suitsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_comms" || entity.getData("skyhighheroes:dyn/current_menu") == "comms") {
          commsSelected.render(isFirstPersonArm);
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "") {
            commsBaseBox.render(isFirstPersonArm);
            commsBaseBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Status", commsStatusSelected.leftX + 14.0, commsStatusSelected.centerY, commsStatusSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_status") {
              commsStatusSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Suits", commsSuitsSelected.leftX + 14.0, commsSuitsSelected.centerY, commsSuitsSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_suits") {
              commsSuitsSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Waypoints", commsWaypointsSelected.leftX + 14.0, commsWaypointsSelected.centerY, commsWaypointsSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_waypoints") {
              commsWaypointsSelected.render(isFirstPersonArm);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_status") {
            if (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) {
              var entry = entity.getData("skyhighheroes:dyn/scroll_entry_0").split(";:");
              var id = entry[0];
              if (cybernetics.isStillCyber(entity, id)) {
                var cyberEntity = entity.world().getEntityById(id);
                var modelID = cybernetics.getModelID(cyberEntity);
                var aliasName = cybernetics.getAliasName(cyberEntity);
                var sameSatellite = cybernetics.checkSatellite(entity, cyberEntity);
                var sameFrequency = cybernetics.checkFrequency(entity, cyberEntity);
                var sameUUID = true;
                if (entry.length > 2) {
                  var uuid = entry[2];
                  if (cyberEntity.getUUID() == uuid) {
                    sameUUID = true;
                  } else {
                    sameUUID = false;
                  };
                };
                if (sameFrequency && sameSatellite && sameUUID) {
                  var cyberDomain = cyberEntity.getWornChestplate().suitType().split(":")[0];
                  display_model.render();
                  text_renderer.renderLine(isFirstPersonArm, "center", "top", modelID + " (" + aliasName + ")", mainMenu.centerX, mainMenu.topY + 12.0, mainMenu.z, 1.0);
                  var leftLines = [];
                  var chargeStatus = "Charge: " + ((cyberEntity.getInterpolatedData(cyberDomain + ":dyn/charging_timer") == 1) ? "Charging... " : "") + (((cyberEntity.getInterpolatedData(cyberDomain + ":dyn/energy") / 1000000000) * 100).toFixed(0) + "%");
                  var cyberX = "X: " + cyberEntity.posX().toFixed(0);
                  var cyberY = "Y: " + cyberEntity.posY().toFixed(0);
                  var cyberZ = "Z: " + cyberEntity.posZ().toFixed(0);
                  leftLines.push(chargeStatus);
                  leftLines.push(cyberX);
                  leftLines.push(cyberY);
                  leftLines.push(cyberZ);
                  text_renderer.renderLines(isFirstPersonArm, "left", "center", leftLines, mainMenu.leftX + 8.0, mainMenu.centerY, mainMenu.z, 1.0);
                  
                  var rightLines = [];
                  var distanceTo = "Distance"
                  var distanceX = "X: " + (cyberEntity.posX()-entity.posX()).toFixed(0);
                  var distanceY = "Y: " + (cyberEntity.posY()-entity.posY()).toFixed(0);
                  var distanceZ = "Z: " + (cyberEntity.posZ()-entity.posZ()).toFixed(0);
                  rightLines.push(distanceTo);
                  rightLines.push(distanceX);
                  rightLines.push(distanceY);
                  rightLines.push(distanceZ);
                  text_renderer.renderLines(isFirstPersonArm, "right", "center", rightLines, mainMenu.rightX - 8.0, mainMenu.centerY, mainMenu.z, 1.0);
                } else {
                  var errors = ["Unable to establish connection with " + modelID + " (" + aliasName + ")"];
                  if (!sameFrequency) {
                    errors.push("Not available on current frequency!");
                  };
                  if (!sameSatellite) {
                    errors.push("Not available on current satellite!");
                  };
                  if (!sameUUID) {
                    errors.push("Connection must be reestablished!");
                  };
                  text_renderer.renderLines(isFirstPersonArm, "center", "center", errors, mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
                };
              } else {
                text_renderer.renderLine(isFirstPersonArm, "center", "center", "Unable to find Cyber", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
              };
            } else {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Satellite not deployed", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints" || entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
            if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_waypoints") {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Waypoints", listBaseBox.centerX, listBaseBox.topY - 7.0, listBaseBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Transmit Queue", listQueueBox.centerX, listQueueBox.topY - 7.0, listQueueBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Start Transmitting", queueActionButton.centerX, queueActionButton.centerY, queueActionButton.z, 1.0);
            };
            if (entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Suits", listBaseBox.centerX, listBaseBox.topY - 7.0, listBaseBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Transmit Queue", listQueueBox.centerX, listQueueBox.topY - 7.0, listQueueBox.z, 1.0);
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Start Transmitting", queueActionButton.centerX, queueActionButton.centerY, queueActionButton.z, 1.0);
            };
            queueActionButton.render(isFirstPersonArm);
            queueActionButtonBorder.render(isFirstPersonArm);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_run_queue") {
              queueActionButtonSelected.render(entity, isFirstPersonArm);
            };
            listBaseBox.render(isFirstPersonArm);
            listBaseBoxInner.render(isFirstPersonArm);
            listBaseScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll_value"), entity.getData("skyhighheroes:dyn/scroll_total"));
            listBaseButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_0"), listBaseButton0.leftX + 3.0, listBaseButton0.centerY, listBaseButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_0") {
              listBaseButton0Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_1"), listBaseButton1.leftX + 3.0, listBaseButton1.centerY, listBaseButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_1") {
              listBaseButton1Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_2"), listBaseButton2.leftX + 3.0, listBaseButton2.centerY, listBaseButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_2") {
              listBaseButton2Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_3"), listBaseButton3.leftX + 3.0, listBaseButton3.centerY, listBaseButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_3") {
              listBaseButton3Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_4"), listBaseButton4.leftX + 4.0, listBaseButton4.centerY, listBaseButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_4") {
              listBaseButton4Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_5"), listBaseButton5.leftX + 3.0, listBaseButton5.centerY, listBaseButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_5") {
              listBaseButton5Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_6"), listBaseButton6.leftX + 4.0, listBaseButton6.centerY, listBaseButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_6") {
              listBaseButton6Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_7"), listBaseButton7.leftX + 4.0, listBaseButton7.centerY, listBaseButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_7") {
              listBaseButton7Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_8"), listBaseButton8.leftX + 4.0, listBaseButton8.centerY, listBaseButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_8") {
              listBaseButton8Selected.render(entity, isFirstPersonArm);
            };
            listBaseButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_9"), listBaseButton9.leftX + 4.0, listBaseButton9.centerY, listBaseButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_base_select_9") {
              listBaseButton9Selected.render(entity, isFirstPersonArm);
            };
            listQueueBox.render(isFirstPersonArm);
            listQueueBoxInner.render(isFirstPersonArm);
            listQueueScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll2_value"), entity.getData("skyhighheroes:dyn/scroll2_total"));
            listQueueButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_0"), listQueueButton0.leftX + 3.0, listQueueButton0.centerY, listQueueButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_0") {
              listQueueButton0Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_1"), listQueueButton1.leftX + 3.0, listQueueButton1.centerY, listQueueButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_1") {
              listQueueButton1Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_2"), listQueueButton2.leftX + 3.0, listQueueButton2.centerY, listQueueButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_2") {
              listQueueButton2Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_3"), listQueueButton3.leftX + 3.0, listQueueButton3.centerY, listQueueButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_3") {
              listQueueButton3Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_4"), listQueueButton4.leftX + 4.0, listQueueButton4.centerY, listQueueButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_4") {
              listQueueButton4Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_5"), listQueueButton5.leftX + 3.0, listQueueButton5.centerY, listQueueButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_5") {
              listQueueButton5Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_6"), listQueueButton6.leftX + 4.0, listQueueButton6.centerY, listQueueButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_6") {
              listQueueButton6Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_7"), listQueueButton7.leftX + 4.0, listQueueButton7.centerY, listQueueButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_7") {
              listQueueButton7Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_8"), listQueueButton8.leftX + 4.0, listQueueButton8.centerY, listQueueButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_8") {
              listQueueButton8Selected.render(entity, isFirstPersonArm);
            };
            listQueueButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll2_entry_9"), listQueueButton9.leftX + 4.0, listQueueButton9.centerY, listQueueButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "comms_queue_select_9") {
              listQueueButton9Selected.render(entity, isFirstPersonArm);
            };
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Comms", commsSelected.centerX, commsSelected.centerY, commsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_thermoptics" || entity.getData("skyhighheroes:dyn/current_menu") == "thermoptics") {
          thermopticsSelected.render(isFirstPersonArm);
          //
          thermopticsDisguiseStatus.render(entity, isFirstPersonArm, "thermoptic_disguise_timer");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Disguise", thermopticsDisguiseStatus.centerX, thermopticsDisguiseStatus.bottomY + 8.0, thermopticsDisguiseStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "thermoptics_disguise") {
            thermopticsDisguiseSelector.render(isFirstPersonArm);
          };
          //
          thermopticsDisguiseClothingStatus.render(entity, isFirstPersonArm, "thermoptic_disguise_clothing");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Disguise Clothing", thermopticsDisguiseClothingStatus.centerX, thermopticsDisguiseClothingStatus.bottomY + 8.0, thermopticsDisguiseClothingStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "thermoptics_disguise_clothing") {
            thermopticsDisguiseClothingSelector.render(isFirstPersonArm);
          };
          //
          thermopticsCamouflageStatus.render(entity, isFirstPersonArm, "thermoptic_camouflage_timer");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Camouflage", thermopticsCamouflageStatus.centerX, thermopticsCamouflageStatus.bottomY + 8.0, thermopticsCamouflageStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "thermoptics_camouflage") {
            thermopticsCamouflageSelector.render(isFirstPersonArm);
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Thermoptics", thermopticsSelected.centerX, thermopticsSelected.centerY, thermopticsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_settings" || entity.getData("skyhighheroes:dyn/current_menu") == "settings") {
          settingsSelected.render(isFirstPersonArm);
          //
          statueModeStatus.render(entity, isFirstPersonArm, "cybernetic_statue_mode");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Statue", statueModeStatus.centerX, statueModeStatus.bottomY + 8.0, statueModeStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "settings_statue_mode") {
            statueModeSelector.render(isFirstPersonArm);
          };
          //
          bodyLightsStatus.render(entity, isFirstPersonArm, "cybernetic_body_lights");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Body Lights", bodyLightsStatus.centerX, bodyLightsStatus.bottomY + 8.0, bodyLightsStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "settings_body_lights") {
            bodyLightsSelector.render(isFirstPersonArm);
          };
          //
          aliasActiveStatus.render(entity, isFirstPersonArm, "alias_active");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Alias Active", aliasActiveStatus.centerX, aliasActiveStatus.bottomY + 8.0, aliasActiveStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "settings_alias_active") {
            aliasActiveSelector.render(isFirstPersonArm);
          };
          //
          nightVisionStatus.render(entity, isFirstPersonArm, "night_vision");
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Night Vision", nightVisionStatus.centerX, nightVisionStatus.bottomY + 8.0, nightVisionStatus.z, 1.0);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "settings_night_vision") {
            nightVisionSelector.render(isFirstPersonArm);
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Settings", settingsSelected.centerX, settingsSelected.centerY, settingsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_contacts_groups" || entity.getData("skyhighheroes:dyn/current_menu") == "contacts_groups" || entity.getData("skyhighheroes:dyn/current_menu") == "groups" || entity.getData("skyhighheroes:dyn/current_menu") == "group_members" || entity.getData("skyhighheroes:dyn/current_menu") == "contacts") {
          contactsGroupsSelected.render(isFirstPersonArm);
          if (entity.getData("skyhighheroes:dyn/selected_button") == "main_contacts_groups" || entity.getData("skyhighheroes:dyn/current_menu") == "contacts_groups") {
            contactsGroupsBaseBox.render(isFirstPersonArm);
            contactsGroupsBaseBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Contacts", contactsGroupsContactsSelected.leftX + 14.0, contactsGroupsContactsSelected.centerY, contactsGroupsContactsSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_groups_contacts") {
              contactsGroupsContactsSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Groups", contactsGroupsGroupsSelected.leftX + 14.0, contactsGroupsGroupsSelected.centerY, contactsGroupsGroupsSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_groups_groups") {
              contactsGroupsGroupsSelected.render(isFirstPersonArm);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_menu") == "groups") {
            if (!entity.getData("skyhighheroes:dyn/entering_value")) {
              groupsBaseBox.render(isFirstPersonArm);
              groupsBaseBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Edit", groupsEditSelected.leftX + 14.0, groupsEditSelected.centerY, groupsEditSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_edit") {
                groupsEditSelected.render(entity, isFirstPersonArm);
              };
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Add", groupsAddSelected.leftX + 14.0, groupsAddSelected.centerY, groupsAddSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_add") {
                groupsAddSelected.render(entity, isFirstPersonArm);
              };
              groupsEditBox.render(isFirstPersonArm);
              groupsEditBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Members", groupsMembersSelected.leftX + 14.0, groupsMembersSelected.centerY, groupsMembersSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_members") {
                groupsMembersSelected.render(entity, isFirstPersonArm);
              };
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Delete", groupsDeleteSelected.leftX + 14.0, groupsDeleteSelected.centerY, groupsDeleteSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_delete") {
                groupsDeleteSelected.render(entity, isFirstPersonArm);
              };
            } else {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Enter group name", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_menu") == "group_members") {
            if (!entity.getData("skyhighheroes:dyn/entering_value")) {
              groupsMembersBaseBox.render(isFirstPersonArm);
              groupsMembersBaseBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Edit", groupsMembersEditSelected.leftX + 14.0, groupsMembersEditSelected.centerY, groupsMembersEditSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_edit") {
                groupsMembersEditSelected.render(entity, isFirstPersonArm);
              };
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Add", groupsMembersAddSelected.leftX + 14.0, groupsMembersAddSelected.centerY, groupsMembersAddSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_add") {
                groupsMembersAddSelected.render(entity, isFirstPersonArm);
              };
              groupsMembersEditBox.render(isFirstPersonArm);
              groupsMembersEditBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Delete", groupsMembersDeleteSelected.leftX + 14.0, groupsMembersDeleteSelected.centerY, groupsMembersDeleteSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_delete") {
                groupsMembersDeleteSelected.render(entity, isFirstPersonArm);
              };
            } else {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Enter username to add to group", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_menu") == "contacts") {
            if (!entity.getData("skyhighheroes:dyn/entering_value")) {
              contactsBaseBox.render(isFirstPersonArm);
              contactsBaseBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Edit", contactsEditSelected.leftX + 14.0, contactsEditSelected.centerY, contactsEditSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_edit") {
                contactsEditSelected.render(entity, isFirstPersonArm);
              };
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Add", contactsAddSelected.leftX + 14.0, contactsAddSelected.centerY, contactsAddSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_add") {
                contactsAddSelected.render(entity, isFirstPersonArm);
              };
              contactsEditBox.render(isFirstPersonArm);
              contactsEditBoxInner.render(isFirstPersonArm);
              text_renderer.renderLine(isFirstPersonArm, "left", "center", "Delete", contactsDeleteSelected.leftX + 14.0, contactsDeleteSelected.centerY, contactsDeleteSelected.z, 1.0);
              if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_delete") {
                contactsDeleteSelected.render(entity, isFirstPersonArm);
              };
            } else {
              text_renderer.renderLine(isFirstPersonArm, "center", "center", "Enter username to add as contact", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
            };
          };
          if (entity.getData("skyhighheroes:dyn/current_menu") == "groups" || entity.getData("skyhighheroes:dyn/current_menu") == "group_members" || entity.getData("skyhighheroes:dyn/current_menu") == "contacts") {
            listBox.render(isFirstPersonArm);
            listBoxInner.render(isFirstPersonArm);
            listScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll_value"), entity.getData("skyhighheroes:dyn/scroll_total"));
            listButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_0"), listButton0.leftX + 3.0, listButton0.centerY, listButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_0" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_0" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_0") {
              listButton0Selected.render(entity, isFirstPersonArm);
            };
            listButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_1"), listButton1.leftX + 3.0, listButton1.centerY, listButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_1" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_1" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_1") {
              listButton1Selected.render(entity, isFirstPersonArm);
            };
            listButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_2"), listButton2.leftX + 3.0, listButton2.centerY, listButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_2" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_2" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_2") {
              listButton2Selected.render(entity, isFirstPersonArm);
            };
            listButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_3"), listButton3.leftX + 3.0, listButton3.centerY, listButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_3" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_3" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_3") {
              listButton3Selected.render(entity, isFirstPersonArm);
            };
            listButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_4"), listButton4.leftX + 4.0, listButton4.centerY, listButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_4" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_4" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_4") {
              listButton4Selected.render(entity, isFirstPersonArm);
            };
            listButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_5"), listButton5.leftX + 3.0, listButton5.centerY, listButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_5" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_5" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_5") {
              listButton5Selected.render(entity, isFirstPersonArm);
            };
            listButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_6"), listButton6.leftX + 4.0, listButton6.centerY, listButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_6" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_6" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_6") {
              listButton6Selected.render(entity, isFirstPersonArm);
            };
            listButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_7"), listButton7.leftX + 4.0, listButton7.centerY, listButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_7" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_7" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_7") {
              listButton7Selected.render(entity, isFirstPersonArm);
            };
            listButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_8"), listButton8.leftX + 4.0, listButton8.centerY, listButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_8" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_8" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_8") {
              listButton8Selected.render(entity, isFirstPersonArm);
            };
            listButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_9"), listButton9.leftX + 4.0, listButton9.centerY, listButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "contacts_select_9" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_select_9" || entity.getData("skyhighheroes:dyn/selected_button") == "groups_members_select_9") {
              listButton9Selected.render(entity, isFirstPersonArm);
            };
          };
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Contacts\n & Groups", contactsGroupsSelected.centerX, contactsGroupsSelected.centerY, contactsGroupsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_waypoints" || entity.getData("skyhighheroes:dyn/current_menu") == "waypoints") {
          if (!entity.getData("skyhighheroes:dyn/entering_value")) {
            waypointsBaseBox.render(isFirstPersonArm);
            waypointsBaseBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Edit", waypointsEditSelected.leftX + 14.0, waypointsEditSelected.centerY, waypointsEditSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_edit") {
              waypointsEditSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Add", waypointsAddSelected.leftX + 14.0, waypointsAddSelected.centerY, waypointsAddSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_add") {
              waypointsAddSelected.render(isFirstPersonArm);
            };
            waypointsEditBox.render(isFirstPersonArm);
            waypointsEditBoxInner.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Delete", waypointsDeleteSelected.leftX + 14.0, waypointsDeleteSelected.centerY, waypointsDeleteSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_delete") {
              waypointsDeleteSelected.render(isFirstPersonArm);
            };
            text_renderer.renderLine(isFirstPersonArm, "left", "center", "Track", waypointsTrackSelected.leftX + 14.0, waypointsTrackSelected.centerY, waypointsTrackSelected.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_track") {
              waypointsTrackSelected.render(isFirstPersonArm);
            };
            listBox.render(isFirstPersonArm);
            listBoxInner.render(isFirstPersonArm);
            listScrollBar.render(isFirstPersonArm, entity.getData("skyhighheroes:dyn/scroll_value"), entity.getData("skyhighheroes:dyn/scroll_total"));
            listButton0.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_0"), listButton0.leftX + 3.0, listButton0.centerY, listButton0.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_0") {
              listButton0Selected.render(entity, isFirstPersonArm);
            };
            listButton1.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_1"), listButton1.leftX + 3.0, listButton1.centerY, listButton1.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_1") {
              listButton1Selected.render(entity, isFirstPersonArm);
            };
            listButton2.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_2"), listButton2.leftX + 3.0, listButton2.centerY, listButton2.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_2") {
              listButton2Selected.render(entity, isFirstPersonArm);
            };
            listButton3.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_3"), listButton3.leftX + 3.0, listButton3.centerY, listButton3.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_3") {
              listButton3Selected.render(entity, isFirstPersonArm);
            };
            listButton4.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_4"), listButton4.leftX + 4.0, listButton4.centerY, listButton4.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_4") {
              listButton4Selected.render(entity, isFirstPersonArm);
            };
            listButton5.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_5"), listButton5.leftX + 3.0, listButton5.centerY, listButton5.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_5") {
              listButton5Selected.render(entity, isFirstPersonArm);
            };
            listButton6.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_6"), listButton6.leftX + 4.0, listButton6.centerY, listButton6.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_6") {
              listButton6Selected.render(entity, isFirstPersonArm);
            };
            listButton7.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_7"), listButton7.leftX + 4.0, listButton7.centerY, listButton7.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_7") {
              listButton7Selected.render(entity, isFirstPersonArm);
            };
            listButton8.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_8"), listButton8.leftX + 4.0, listButton8.centerY, listButton8.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_8") {
              listButton8Selected.render(entity, isFirstPersonArm);
            };
            listButton9.render(isFirstPersonArm);
            text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getData("skyhighheroes:dyn/scroll_entry_9"), listButton9.leftX + 4.0, listButton9.centerY, listButton9.z, 1.0);
            if (entity.getData("skyhighheroes:dyn/selected_button") == "waypoints_select_9") {
              listButton9Selected.render(entity, isFirstPersonArm);
            };
          } else {
            text_renderer.renderLine(isFirstPersonArm, "center", "center", "Enter name for waypoint at current location", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
          };
          waypointsSelected.render(isFirstPersonArm);
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Waypoints", waypointsSelected.centerX, waypointsSelected.centerY, waypointsSelected.z, 1.0);
        //
        if (entity.getData("skyhighheroes:dyn/selected_button") == "main_chat" || entity.getData("skyhighheroes:dyn/current_menu") == "chat") {
          chatSelected.render(isFirstPersonArm);
          text_renderer.renderLine(isFirstPersonArm, "center", "center", "Not available yet!", mainMenu.centerX, mainMenu.centerY, mainMenu.z, 1.0);
        };
        text_renderer.renderLine(isFirstPersonArm, "center", "center", "Chat", chatSelected.centerX, chatSelected.centerY, chatSelected.z, 1.0);
      };
      if (!entity.getData("skyhighheroes:dyn/interface") && entity.getData("skyhighheroes:dyn/tracked_waypoint") != "") {
        var trackedWaypoint = entity.getData("skyhighheroes:dyn/tracked_waypoint").split(";:");
        var waypointTracking = [];
        var xDiff = entity.posX() - parseFloat(trackedWaypoint[1]);
        var yDiff = entity.posY() - parseFloat(trackedWaypoint[2]);
        var zDiff = entity.posZ() - parseFloat(trackedWaypoint[3]);
        var sameDim = (entity.world().getDimension() == parseInt(trackedWaypoint[4]));
        var name = "Tracking: " + trackedWaypoint[0];
        var coordsDiff = xDiff.toFixed(0) + ", " + yDiff.toFixed(0) + ", " + zDiff.toFixed(0);
        var coords = "" + (sameDim ? coordsDiff : "Not in current dimension");
        waypointTracking.push(name);
        waypointTracking.push(coords);
        text_renderer.renderLines(isFirstPersonArm, "center", "center", waypointTracking, 0.0, -1 * entity.getData("skyhighheroes:dyn/hud_top_border"), -180.0, 1.0 * entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      //text_renderer.renderLine(isFirstPersonArm, "left", "center", entity.getInterpolatedData("skyhighheroes:dyn/energy") + "/1000000000", -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0 * entity.getData("skyhighheroes:dyn/hud_scale"));

      if (!entity.getData("skyhighheroes:dyn/interface") && entity.getInterpolatedData("skyhighheroes:dyn/charging_timer") == 1) {
        var chargingLines = ["Charging...", (((entity.getInterpolatedData("skyhighheroes:dyn/energy") / 1000000000) * 100).toFixed(0) + "%")];
        text_renderer.renderLines(isFirstPersonArm, "center", "center", chargingLines, 0.0, 0.0, -180.0, 2.0);
      };
      /* var entities = entity.world().getEntitiesInRangeOf(entity.pos(), 60)
      entities.forEach(otherEntity => {
        if (!entity.equals(otherEntity) && otherEntity.isLivingEntity() && otherEntity.isAlive() && otherEntity.getHealth() > 0 && entity.canSee(otherEntity) && isLookingAtTarget(entity.eyePos(), entity.getLookVector(), otherEntity.eyePos(), 70)) {
          text_renderer.renderEntity(entity, isFirstPersonArm, otherEntity, "center", "center", 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
      }); */
      /*
      var leftSide = "OFF";
      var topSide = "OFF";
      var rightSide = "OFF";
      //Left
      if (!entity.getData("skyhighheroes:dyn/battle_mode")) {
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 1) {
          leftSide = "Shields";
          var shieldsToRender = ["Shields:"];
          var leftShield = "Left: " + (entity.getData("skyhighheroes:dyn/shield_left_armed") ? "ARMED" : "DISARMED") + " (" + ((entity.getInterpolatedData("skyhighheroes:dyn/shield_left_deploy_timer") > 0 || entity.getInterpolatedData("skyhighheroes:dyn/shield_left_timer") > 0) ? "DEPLOYED" : "STOWED") + ")";
          var rightShield = "Right: " + (entity.getData("skyhighheroes:dyn/shield_right_armed") ? "ARMED" : "DISARMED") + " (" + ((entity.getInterpolatedData("skyhighheroes:dyn/shield_right_deploy_timer") > 0 || entity.getInterpolatedData("skyhighheroes:dyn/shield_right_timer") > 0) ? "DEPLOYED" : "STOWED") + ")";
          shieldsToRender.push(leftShield);
          shieldsToRender.push(rightShield);
          text_renderer.renderLines(isFirstPersonArm, "left", "center", shieldsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 2) {
          leftSide = "Blades";
          var bladesToRender = ["Blades:"];
          var leftBlade = "Left: " + (entity.getData("skyhighheroes:dyn/blade_left_armed") ? "ARMED" : "DISARMED") + " (" + ((entity.getInterpolatedData("skyhighheroes:dyn/blade_left_deploy_timer") > 0 || entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") > 0) ? "DEPLOYED" : "STOWED") + ")";
          var rightBlade = "Right: " + (entity.getData("skyhighheroes:dyn/blade_left_armed") ? "ARMED" : "DISARMED") + " (" + ((entity.getInterpolatedData("skyhighheroes:dyn/blade_right_deploy_timer") > 0 || entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") > 0) ? "DEPLOYED" : "STOWED") + ")";
          var leftBladeMode = "Left mode: " + (entity.getData("skyhighheroes:dyn/blade_left_stealth_enabled") ? "STEALTH" : "NORMAL");
          var rightBladeMode = "Right mode: " + (entity.getData("skyhighheroes:dyn/blade_right_stealth_enabled") ? "STEALTH" : "NORMAL");
          bladesToRender.push(leftBlade);
          bladesToRender.push(rightBlade);
          bladesToRender.push(leftBladeMode);
          bladesToRender.push(rightBladeMode);
          text_renderer.renderLines(isFirstPersonArm, "left", "center", bladesToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 3) {
          leftSide = "Rockets";
          var armsSet = (entity.getData("skyhighheroes:dyn/rockets_arms_timer") > 0);
          var bodySet = (entity.getData("skyhighheroes:dyn/rockets_body_timer") > 0);
          var legsSet = (entity.getData("skyhighheroes:dyn/rockets_legs_timer") > 0);
          var rocketsToRender = ["Rockets:"];
          var onFallRocket = "Activate on fall: " + (entity.getData("skyhighheroes:dyn/rockets_on_fall") ? "ENABLED" : "DISABLED");
          var armRocket = "Arms: " + (entity.getData("skyhighheroes:dyn/rockets_arms_armed") ? "ARMED" : "DISARMED");
          var bodyRocket = "Body: " + (entity.getData("skyhighheroes:dyn/rockets_body_armed") ? "ARMED" : "DISARMED");
          var legRocket = "Legs: " + (entity.getData("skyhighheroes:dyn/rockets_legs_armed") ? "ARMED" : "DISARMED");
          var wingRocket = "Wings: " + (entity.getData("skyhighheroes:dyn/rockets_wings_armed") ? "ARMED" : "DISARMED");

          var bodyRockets = "Body: " + ((bodySet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_left_deploy_timer") > 0) ? "L" : "-") + ((bodySet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_right_deploy_timer") > 0) ? "R" : "-");
          var leftArmRockets = "Left Arm: " + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_outer_deploy_timer") > 0) ? "O" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_front_deploy_timer") > 0) ? "F" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_back_deploy_timer") > 0) ? "B" : "-");
          var rightArmRockets = "Right Arm: " + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_outer_deploy_timer") > 0) ? "O" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_front_deploy_timer") > 0) ? "F" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_back_deploy_timer") > 0) ? "B" : "-");
          var leftLegRockets = "Left Leg: " + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_main_deploy_timer") > 0) ? "M" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_outer_deploy_timer") > 0) ? "O" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_front_deploy_timer") > 0) ? "F" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_back_deploy_timer") > 0) ? "B" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_inner_deploy_timer") > 0) ? "I" : "-");
          var rightLegRockets = "Right Leg: " + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_main_deploy_timer") > 0) ? "M" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_outer_deploy_timer") > 0) ? "O" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_front_deploy_timer") > 0) ? "F" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_back_deploy_timer") > 0) ? "B" : "-") + ((legsSet || entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_inner_deploy_timer") > 0) ? "I" : "-");

          rocketsToRender.push(onFallRocket);
          rocketsToRender.push(armRocket);
          rocketsToRender.push(bodyRocket);
          rocketsToRender.push(legRocket);
          rocketsToRender.push(wingRocket);
          rocketsToRender.push(bodyRockets);
          rocketsToRender.push(leftArmRockets);
          rocketsToRender.push(rightArmRockets);
          rocketsToRender.push(leftLegRockets);
          rocketsToRender.push(rightLegRockets);

          text_renderer.renderLines(isFirstPersonArm, "left", "center", rocketsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 4) {
          leftSide = "Cannons";
          var headSet = (entity.getData("skyhighheroes:dyn/cannons_head_timer") > 0);
          var bodySet = (entity.getData("skyhighheroes:dyn/cannons_body_timer") > 0);
          var armsSet = (entity.getData("skyhighheroes:dyn/cannons_arms_timer") > 0);
          var cannonsToRender = ["Cannons:"];
          var headCannon = "Head: " + (entity.getData("skyhighheroes:dyn/cannons_head_armed") ? "ARMED" : "DISARMED");
          var bodyCannon = "Body: " + (entity.getData("skyhighheroes:dyn/cannons_body_armed") ? "ARMED" : "DISARMED");
          var armCannon = "Arms: " + (entity.getData("skyhighheroes:dyn/cannons_arms_armed") ? "ARMED" : "DISARMED");

          var headCannons = "Head: " + ((headSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_left_deploy_timer") > 0) ? "L" : "-") + ((headSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_right_deploy_timer") > 0) ? "R" : "-");
          var bodyCannons = "Body: " + ((bodySet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_left_deploy_timer") > 0) ? "L" : "-") + ((bodySet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_right_deploy_timer") > 0) ? "R" : "-");
          var leftArmCannons = "Left Arm: " + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_bottom_deploy_timer") > 0) ? "M" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_front_deploy_timer") > 0) ? "F" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_back_deploy_timer") > 0) ? "B" : "-");
          var rightArmCannons = "Right Arm: " + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_bottom_deploy_timer") > 0) ? "M" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_front_deploy_timer") > 0) ? "F" : "-") + ((armsSet || entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_back_deploy_timer") > 0) ? "B" : "-");

          cannonsToRender.push(headCannon);
          cannonsToRender.push(bodyCannon);
          cannonsToRender.push(armCannon);
          cannonsToRender.push(headCannons);
          cannonsToRender.push(bodyCannons);
          cannonsToRender.push(leftArmCannons);
          cannonsToRender.push(rightArmCannons);
          text_renderer.renderLines(isFirstPersonArm, "left", "center", cannonsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 5) {
          leftSide = "Comms";
          var commsToRender = ["Comms:"];
          var satellite = "Satellite Dish: " + ((entity.getInterpolatedData("skyhighheroes:dyn/satellite_deploy_timer") > 0) ? "DEPLOYED" : "STOWED") + ((entity.getInterpolatedData("skyhighheroes:dyn/satellite_rain_mode_timer") > 0) ? " (RAIN MODE)" : "");
          var antenna = "Antenna: " + ((entity.getInterpolatedData("skyhighheroes:dyn/antenna_deploy_timer") > 0) ? "DEPLOYED" : "STOWED");
          var connectedSatellite = "Satellite: " + entity.getData("skyhighheroes:dyn/satellite_x") + ", " + entity.getData("skyhighheroes:dyn/satellite_y") + ", " + entity.getData("skyhighheroes:dyn/satellite_z");
          var frequency = "Frequency: " + entity.getData("skyhighheroes:dyn/frequency");
          commsToRender.push(satellite);
          commsToRender.push(antenna);
          commsToRender.push(connectedSatellite);
          commsToRender.push(frequency);
          var cybers = cybernetics.availableCybers(entity);
          if (cybers.length > 0) {
            cybers.forEach(cyber => {
              commsToRender.push(cyber);
            });
          };
          text_renderer.renderLines(isFirstPersonArm, "left", "center", commsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 6) {
          leftSide = "Wings";
          var wingsToRender = ["Wings:"];
          var wings = "Wings: " + (entity.getData("skyhighheroes:dyn/wings_armed") ? "ARMED" : "DISARMED");
          var leftWing = "Left wing: " + ((entity.getInterpolatedData("skyhighheroes:dyn/wing_left_deploy_timer") > 0) || (entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") > 0) ? "DEPLOYED" : "STOWED");
          var rightWing = "Right wing: " + ((entity.getInterpolatedData("skyhighheroes:dyn/wing_right_deploy_timer") > 0) || (entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") > 0) ? "DEPLOYED" : "STOWED");
          wingsToRender.push(wings);
          wingsToRender.push(leftWing);
          wingsToRender.push(rightWing);
          text_renderer.renderLines(isFirstPersonArm, "left", "center", wingsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
        if (entity.getData("skyhighheroes:dyn/hud_side_left") == 7) {
          leftSide = "Intakes";
          var rocketsToRender = ["Intakes:"];
          var leftHead = "Left Head: " + ((entity.getData("skyhighheroes:dyn/intake_head_left_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_head_left_open")) ? "OPEN" : "CLOSED"));
          var rightHead = "Right Head: " + ((entity.getData("skyhighheroes:dyn/intake_head_right_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_head_right_open")) ? "OPEN" : "CLOSED"));
          var leftBody = "Left Body: " + ((entity.getData("skyhighheroes:dyn/intake_body_left_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_body_left_open")) ? "OPEN" : "CLOSED"));
          var rightBody = "Right Body: " + ((entity.getData("skyhighheroes:dyn/intake_body_right_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_body_right_open")) ? "OPEN" : "CLOSED"));
          var leftArm = "Left Arm: " + ((entity.getData("skyhighheroes:dyn/intake_left_arm_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_left_arm_open")) ? "OPEN" : "CLOSED"));
          var rightArm = "Right Arm: " + ((entity.getData("skyhighheroes:dyn/intake_right_arm_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_right_arm_open")) ? "OPEN" : "CLOSED"));
          var leftLeg = "Left Leg: " + ((entity.getData("skyhighheroes:dyn/intake_left_leg_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_left_leg_open")) ? "OPEN" : "CLOSED"));
          var rightLeg = "Right Leg: " + ((entity.getData("skyhighheroes:dyn/intake_right_leg_starting_up") && entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer") > 0 && entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer") < 1) ? "STARTING UP" : ((entity.getData("skyhighheroes:dyn/intake_right_leg_open")) ? "OPEN" : "CLOSED"));

          rocketsToRender.push(leftHead);
          rocketsToRender.push(rightHead);
          rocketsToRender.push(leftBody);
          rocketsToRender.push(rightBody);
          rocketsToRender.push(leftArm);
          rocketsToRender.push(rightArm);
          rocketsToRender.push(leftLeg);
          rocketsToRender.push(rightLeg);

          text_renderer.renderLines(isFirstPersonArm, "left", "center", rocketsToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
        };
      };
      if (entity.getData("skyhighheroes:dyn/battle_mode")) {
        topSide = "Ext Arms";
        dataToRender = [];
        var heldEntityId = entity.getData("fiskheroes:grab_id");
        var heldEntity = entity.world().getEntityById(heldEntityId);
        if (heldEntityId > 0) {
          var heldEntityName = "Name: " + stuff.entitySuitName(heldEntity);
          var heldEntityHealth = "Health: " + heldEntity.getHealth() + "/" + heldEntity.getMaxHealth();

          dataToRender.push(heldEntityName);
          dataToRender.push(heldEntityHealth);

          if (!heldEntity.getWornHelmet().isEmpty()) {
            var armorPiece = heldEntity.getWornHelmet();
            var heldEntityArmorPiece = "Helmet: " + armorPiece.displayName() + " (" + (armorPiece.maxDamage() - armorPiece.damage()) + "/" + armorPiece.maxDamage() + ")";
            dataToRender.push(heldEntityArmorPiece);
          };
          if (!heldEntity.getWornChestplate().isEmpty()) {
            var armorPiece = heldEntity.getWornChestplate();
            var heldEntityArmorPiece = "Chestplate: " + armorPiece.displayName() + " (" + (armorPiece.maxDamage() - armorPiece.damage()) + "/" + armorPiece.maxDamage() + ")";
            dataToRender.push(heldEntityArmorPiece);
          };
          if (!heldEntity.getWornLeggings().isEmpty()) {
            var armorPiece = heldEntity.getWornLeggings();
            var heldEntityArmorPiece = "Leggings: " + armorPiece.displayName() + " (" + (armorPiece.maxDamage() - armorPiece.damage()) + "/" + armorPiece.maxDamage() + ")";
            dataToRender.push(heldEntityArmorPiece);
          };
          if (!heldEntity.getWornBoots().isEmpty()) {
            var armorPiece = heldEntity.getWornBoots();
            var heldEntityArmorPiece = "Boots: " + armorPiece.displayName() + " (" + (armorPiece.maxDamage() - armorPiece.damage()) + "/" + armorPiece.maxDamage() + ")";
            dataToRender.push(heldEntityArmorPiece);
          };
          if (!heldEntity.getHeldItem().isEmpty()) {
            var item = heldEntity.getHeldItem();
            var heldEntityHeldItem = "Holding: " + item.displayName() + " (" + (item.maxDamage() - item.damage()) + "/" + item.maxDamage() + ")";
            dataToRender.push(heldEntityHeldItem);
          };
        };
        if (heldEntityId < 0) {
          var noEntity = "None";
          dataToRender.push(noEntity);
        };

        text_renderer.renderLines(isFirstPersonArm, "left", "center", dataToRender, -1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      //Top
      if (entity.getData("skyhighheroes:dyn/hud_side_top") == 1) {
        topSide = "Thermoptics";
        var thermoToRender = [];
        var disguise = "" + (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_disguise_timer") == 1 ? "DISGUISED" : "UNDISGUISED");
        var clothing = "" + (entity.getData("skyhighheroes:dyn/thermoptic_disguise_clothing") ? "CLOTHED" : "UNCLOTHED");
        var camouflage = "" + (entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_camouflage_timer") == 1 ? "CAMOUFLAGED" : "UNCAMOUFLAGED");
        thermoToRender.push(disguise);
        thermoToRender.push(camouflage);
        thermoToRender.push(clothing);
        text_renderer.renderLines(isFirstPersonArm, "center", "center", thermoToRender, 0.0, -1*entity.getData("skyhighheroes:dyn/hud_top_border"), -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      if (entity.getData("skyhighheroes:dyn/hud_side_top") == 2) {
        topSide = "Coords";
        var coordsToRender = [];
        var coords = "" + Math.round(entity.posX()) + " " + Math.round(entity.posY()) + " " + Math.round(entity.posZ());
        var direction = stuff.angleToDirection(entity.getInterpolatedData("skyhighheroes:dyn/bearing"));
        coordsToRender.push(coords);
        coordsToRender.push(direction);
        text_renderer.renderLines(isFirstPersonArm, "center", "center", coordsToRender, 0.0, -1*entity.getData("skyhighheroes:dyn/hud_top_border"), -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      //Right
      if (entity.getData("skyhighheroes:dyn/hud_side_right") == 1) {
        rightSide = "Status";
        var statusToRender = [];
        var model = entity.getData("skyhighheroes:dyn/model_id");
        var name = "(" + entity.getData("skyhighheroes:dyn/alias") + ")";
        var health = "Health: " + entity.getHealth() + "/" + entity.getMaxHealth();
        var chatMode = "Chat Mode: " + entity.getData("skyhighheroes:dyn/chat_mode");
        statusToRender.push(model);
        statusToRender.push(name);
        statusToRender.push(health);
        statusToRender.push(chatMode);
        if (entity.getData("skyhighheroes:dyn/chat_mode") == "group") {
          var selectedGroup = "Group: " + entity.getData("skyhighheroes:dyn/group_selected");
          statusToRender.push(selectedGroup);
        };
        if (entity.getData("skyhighheroes:dyn/chat_mode") == "normal") {
          var selectedContact = "Contact: " + entity.getData("skyhighheroes:dyn/normal_selected");
          statusToRender.push(selectedContact);
        };
        text_renderer.renderLines(isFirstPersonArm, "right", "center", statusToRender, 1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      if (entity.getData("skyhighheroes:dyn/hud_side_right") == 2) {
        rightSide = "Coords";
        var locationToRender = [];
        var coords = "X: " + Math.round(entity.posX()) + " Y: " + Math.round(entity.posY()) + " Z: " + Math.round(entity.posZ());
        var dimension = "Dimension: " + entity.world().getDimension();
        var biome = "Biome: " + entity.world().getLocation(entity.pos()).biome();
        locationToRender.push(coords);
        locationToRender.push(dimension);
        locationToRender.push(biome);
        text_renderer.renderLines(isFirstPersonArm, "right", "center", locationToRender, 1*entity.getData("skyhighheroes:dyn/hud_sides_border"), 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      //Switcher
      if (entity.getData("fiskheroes:gravity_manip")) {
        var hudsToRender = [];
        if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 0) {
          hudsToRender.push("> Left: " + leftSide + " <");
        } else {
          hudsToRender.push("Left: " + leftSide);
        };
        if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 1) {
          hudsToRender.push("> Top: " + topSide + " <");
        } else {
          hudsToRender.push("Top: " + topSide);
        };
        if (entity.getData("skyhighheroes:dyn/hud_selected_side") == 2) {
          hudsToRender.push("> Right: " + rightSide + " <");
        } else {
          hudsToRender.push("Right: " + rightSide);
        };
        text_renderer.renderLines(isFirstPersonArm, "center", "center", hudsToRender, 0.0, 0.0, -180.0, 1.0*entity.getData("skyhighheroes:dyn/hud_scale"));
      };
      leftSide = "OFF";
      topSide = "OFF";
      rightSide = "OFF";*/
    };
    if (isFirstPersonArm && !entity.is("DISPLAY")) {
      darkness_model.opacity = (1.0 - entity.getInterpolatedData("skyhighheroes:dyn/optics_enabling_timer"));
      darkness_model.render();
    };
  } else {
    head_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
    head_model.render();
    head_base_model.render();
    head_lights_off_model.render();
    head_disguise_model.render();

    head_hair_base_model.render();
    head_hair_lights_off_model.render();
    head_hair_disguise_model.render();

    body_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
    body_model.render();
    body_base_model.render();
    body_lights_off_model.render();
    body_disguise_model.render();

    left_arm_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
    left_arm_model.render();
    left_arm_base_model.render();
    left_arm_lights_off_model.render();
    left_arm_disguise_model.render();
    left_arm_shield_model.render();
    left_arm_blade_model.render();

    if (!isFirstPersonArm) {
      right_arm_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
      right_arm_model.render();
      right_arm_base_model.render();
      right_arm_lights_off_model.render();
      right_arm_disguise_model.render();
      right_arm_shield_model.render();
      right_arm_blade_model.render();
    };
    if (isFirstPersonArm && ((entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep")) ? (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") < 0.5) : (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") < 1))) {
      right_arm_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
      right_arm_model.render();
      right_arm_base_model.render();
      right_arm_lights_off_model.render();
      right_arm_disguise_model.render();
      right_arm_shield_model.render();
      right_arm_blade_model.render();
    };

    left_leg_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
    left_leg_model.render();
    left_leg_base_model.render();
    left_leg_lights_off_model.render();
    left_leg_disguise_model.render();

    right_leg_model.opacity = stuff.clamp(2*entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer"), 0, 1);
    right_leg_model.render();
    right_leg_base_model.render();
    right_leg_lights_off_model.render();
    right_leg_disguise_model.render();

    var linesToRender = [];
    var conversionTimer = entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer");
    var upperProgressMessages = ["Conversion has started", "Disintegrating skeleton", "Preserving brain", "Depleting blood", "Ionizing lungs", "Removing remaining internal organs", "Ditching slow nervous system", "Discarding weak natural muscles", "Removing inferior eyes", "Shedding natural skin", "Initializing cyberOS", "Installing rockets drivers", "Installing cannons drivers", "Installing blades drivers", "Installing shields drivers", "Installing satellite dish drivers", "Installing antenna drivers", "Installing wings drivers", "Installing thermoptics drivers", "Installing optical sensor drivers"];
    var numUpperMessages = upperProgressMessages.length;
    var numUpperMessageShowing = Math.ceil(conversionTimer*numUpperMessages);
    var lastUpperMessage = "It is time";
    var lastUpperMessageStart = (numUpperMessages-1.0)/(numUpperMessages*1.0);
    var lowerProgressMessages = ["No turning back now", "Building lightweight and durable frame", "Installing nueral links", "Affixing hydraulic lines", "Installing voicebox", "Adding extremely dense power cells", "Improving reactions with fiber optics", "Adding powerful artficial muscles", "Enhancing vision with digital optics", "Substituting thermoptic armor plates", "Initializing cyberOS", "Calibrating rockets", "Boosting cannons", "Sharpening blades", "Adjusting shields", "Calibrating satellite dish", "Tuning antenna", "Stressing wings", "Simulating prior skin", "Starting optics"];
    var numLowerMessages = lowerProgressMessages.length;
    var numLowerMessageShowing = Math.ceil(conversionTimer*numLowerMessages);
    var lastLowerMessage = "to wake up";
    var lastLowerMessageStart = (numLowerMessages-1.0)/(numLowerMessages*1.0);
    if ((entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer") > 0) && (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer") < 1)) {
      var upperLine = upperProgressMessages[numUpperMessageShowing];
      if (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer") > lastUpperMessageStart) {
        upperLine = lastUpperMessage;
      };
      linesToRender.push(upperLine);
      var progress = (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer")*100).toFixed(0) + "%";
      linesToRender.push(progress);
      var lowerLine = lowerProgressMessages[numLowerMessageShowing];
      if (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer") > lastLowerMessageStart) {
        lowerLine = lastLowerMessage;
      };
      linesToRender.push(lowerLine);
    };
    if (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_timer") == 1) {
      if (entity.getUUID() == getBoundUUID(entity)) {
        var line = "Wake up";
        linesToRender.push(line);
      } else {
        var line = "Caution!";
        linesToRender.push(line);
        var line = "Brain not suitible for body";
        linesToRender.push(line);
        var line = "Wake up with caution";
        linesToRender.push(line);
      };
    };
    if (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") == 1) {
      text_renderer.renderLines(isFirstPersonArm, "center", "center", linesToRender, 0.0, 0.0, -180.0, 2.0);
    };
    if (isFirstPersonArm && !entity.is("DISPLAY") && (entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer") > 0)) {
      darkness_model.opacity = (entity.getData("skyhighheroes:dyn/cybernetic_conversion_sleep") ? stuff.clamp(entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer")*2, 0.0, 1.0) : entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer"));
      darkness_model.render();
    };
  };
};
function getBoundUUID(entity) {
  return cybernetics.mainNBT(entity).getString("boundUUID");
};
function getColor() {
  return "";
};