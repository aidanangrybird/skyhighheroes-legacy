//Beam setup
function bindBeam(renderer, propertyName, beam, anchor, color, entries) {
  var prop = renderer.bindProperty(propertyName).setAnchor(anchor);
  var constln = renderer.createResource("BEAM_CONSTELLATION", null);

  for (var i = 0; i < entries.length; ++i) {
    constln.bindBeam(entries[i]);
  };

  if (typeof beam === "string") {
    beam = renderer.createResource("BEAM_RENDERER", beam);
  };

  prop.setConstellation(constln);
  prop.setRenderer(beam);
  prop.color.set((typeof color === "object" && color.length == 3) ? color[0] : color);
  return prop;
};

//Animation stuff
function parseAnimationEntry(renderer, value) {
  if (typeof value === "string") {
    return {
      "anim": renderer.createResource("ANIMATION", value),
      "weight": 1
    };
  };
  return {
    "anim": renderer.createResource("ANIMATION", value.key),
    "weight": value.hasOwnProperty("weight") ? value.weight : 1
  };
};
function addAnimationEvent(renderer, key, value) {
  var event = renderer.createResource("ANIMATION_EVENT", null);

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; ++i) {
      var e = parseAnimationEntry(renderer, value[i]);
      event.bindAnimation(e.anim, e.weight);
    };
  } else {
    var e = parseAnimationEntry(renderer, value);
    event.bindAnimation(e.anim, e.weight);
  };

  renderer.addAnimationEvent(key, event);
  return event;
};
function addAnimation(renderer, key, anim) {
  if (typeof anim === "string") {
    anim = renderer.createResource("ANIMATION", anim);
  };

  renderer.addCustomAnimation(key, anim);
  return anim;
};
function addAnimationWithData(renderer, key, anim, dataVar) {
  return addAnimation(renderer, key, anim).setData((entity, data) => data.load(entity.getInterpolatedData(dataVar)));
};
function addFlightAnimation(renderer, name, value, dataLoader) {
  var anim = renderer.createResource("ANIMATION", value);
  renderer.addCustomAnimation(name, anim);

  if (typeof dataLoader === "undefined") {
    anim.setData((entity, data) => {
      data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
      data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
  } else {
    anim.setData((entity, data) => dataLoader(entity, data));
  };

  anim.priority = -10;
  renderer.reprioritizeDefaultAnimation("PUNCH", -9);
  renderer.reprioritizeDefaultAnimation("HOLD_CHRONOS_RIFLE", -9);
  renderer.reprioritizeDefaultAnimation("HOLD_PIZZA", -9);
  renderer.reprioritizeDefaultAnimation("BLOCK_CAPS_SHIELD", -9);
  renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
};
function addFlightAnimationWithLanding(renderer, name, value) {
  addFlightAnimation(renderer, name, value, (entity, data) => {
    data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("skyhighheroes:dyn/superhero_boosting_landing_timer") - entity.getInterpolatedData("skyhighheroes:dyn/superhero_landing_timer")));
    data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
  });
};

function addFlightIdleAnimation(renderer, name, value, dataLoader) {
  var anim = renderer.createResource("ANIMATION", value);
  renderer.addCustomAnimation(name, anim);

  if (typeof dataLoader === "undefined") {
    anim.setData((entity, data) => {
      data.load(0, entity.getInterpolatedData("fiskheroes:levitate_timer"));
      data.load(1, entity.loop(20 * Math.PI) + 0.4);
    });
  } else {
    anim.setData((entity, data) => dataLoader(entity, data));
  };

  anim.priority = -9.5;
  return anim;
};

var panels = [
  "skyhighheroes:dyn/head_top_front_open_timer",
  "skyhighheroes:dyn/head_top_back_open_timer",
  "skyhighheroes:dyn/head_bottom_front_open_timer",
  "skyhighheroes:dyn/head_bottom_back_open_timer",
  "skyhighheroes:dyn/torso_front_open_timer",
  "skyhighheroes:dyn/torso_back_open_timer",
  "skyhighheroes:dyn/shorts_front_open_timer",
  "skyhighheroes:dyn/shorts_back_open_timer",
  "skyhighheroes:dyn/machine_gun_open_timer",
  "skyhighheroes:dyn/core_open_timer",
  "skyhighheroes:dyn/left_arm_outer_open_timer",
  "skyhighheroes:dyn/left_cannon_outer_open_timer",
  "skyhighheroes:dyn/left_cannon_inner_open_timer",
  "skyhighheroes:dyn/right_arm_outer_open_timer",
  "skyhighheroes:dyn/right_cannon_outer_open_timer",
  "skyhighheroes:dyn/right_cannon_inner_open_timer",
  "skyhighheroes:dyn/left_leg_front_open_timer",
  "skyhighheroes:dyn/left_leg_back_open_timer",
  "skyhighheroes:dyn/left_boot_front_open_timer",
  "skyhighheroes:dyn/left_boot_back_open_timer",
  "skyhighheroes:dyn/left_boot_open_timer",
  "skyhighheroes:dyn/right_leg_front_open_timer",
  "skyhighheroes:dyn/right_leg_back_open_timer",
  "skyhighheroes:dyn/right_boot_front_open_timer",
  "skyhighheroes:dyn/right_boot_back_open_timer",
  "skyhighheroes:dyn/right_boot_open_timer"
];

//Astro Animations
function initAstroAnimations(renderer) {
  //Aiming
  addAnimation(renderer, "astro.CANNON", "skyhighheroes:astro_aim").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/arm_cannon_timer") + getHoloBoolean(entity, "holoArmCannon"));
  })
    .setCondition(entity => !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
    .priority = 5;
  //Dual Cannons
  addAnimation(renderer, "astro.DUAL_CANNONS", "skyhighheroes:astro_dual_aim").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/dual_arm_cannon_timer") + getHoloBoolean(entity, "holoDualCannons"));
  })
    .setCondition(entity => !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
    .priority = 5;
  //Flight
  addFlightAnimationWithLanding(renderer, "astro.FLIGHT", "skyhighheroes:flight/astro_flight.anim.json");
  addAnimation(renderer, "astro.FLIGHT_FP", "skyhighheroes:flight/astro_fp")
    .setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_boost_timer")*(1-entity.getInterpolatedData("fiskheroes:energy_projection_timer"))*(1-entity.getInterpolatedData("fiskheroes:aiming_timer"))))
    .priority = -9.5;
  //Landing
  addAnimationWithData(renderer, "astro.LAND", "skyhighheroes:astro_landing", "skyhighheroes:dyn/superhero_landing_timer")
    .priority = -8;
  addAnimationWithData(renderer, "astro.LAND_BOOST", "skyhighheroes:astro_boosting_landing", "skyhighheroes:dyn/superhero_boosting_landing_timer")
    .priority = -8;
  addAnimationWithData(renderer, "astro.ROLL", "skyhighheroes:flight/astro_barrel_roll", "fiskheroes:barrel_roll_timer")
  addFlightIdleAnimation(renderer, "astro.IDLE", "skyhighheroes:flight/astro_idle");
  addAnimationWithData(renderer, "astro.POWER", "skyhighheroes:astro_power_state", "skyhighheroes:dyn/powering_down_timer")
    .setCondition(entity => (!entity.is("DISPLAY") && entity.getInterpolatedData("skyhighheroes:dyn/powering_down_timer") > 0))
    .priority = -10;
  addAnimation(renderer, "astro.POWERED_DOWN", "skyhighheroes:astro_powered_down")
    .setData((entity, data) => data.load(1.0))
    .setCondition(entity => (!entity.is("DISPLAY") && entity.getInterpolatedData("skyhighheroes:dyn/powering_down_timer") == 1))
    .priority = -10;
    
  addAnimation(renderer, "astro.HOLOGRAM_FLIGHT", "skyhighheroes:astro_holo_flight").setData((entity, data) => {
    data.load(0, 0.0 + getHoloBoolean(entity, "holoFlight"));
    data.load(1, 0.0 + getHoloBoolean(entity, "holoBoostFlight"));
    data.load(2, entity.loop(20 * Math.PI) + 0.4);
    data.load(3, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  }).setCondition(entity => entity.is("DISPLAY")).priority = -9;
};

function initNV(renderer, uuid) {
  nv = renderer.bindProperty("fiskheroes:night_vision");
  nv.fogStrength = 0.0;
  nv.factor = 1.0;
  nv.setCondition(entity => entity.getUUID() == uuid);
};

//Cannon
function initCannon(renderer) {
  var light_thing = renderer.createEffect("fiskheroes:overlay");
  light_thing.texture.set("cannon", "cannon_lights");
  var obj = {
    light_thing: light_thing,
    render: (entity, renderLayer) => {
      if (entity.getHeldItem().isEmpty() && entity.getData("skyhighheroes:dyn/astro_clothes") == 3) {
        light_thing.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer");
        light_thing.render();
      };
    }
  };
  return obj;
};

//Init
//Beams
function initBodyBeams(renderer, color) {
  var machineGun = bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", color, [
  ])
  machineGun.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
};

function initLeftArmBeams(renderer, color) {
  var cannon = bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "leftArm", color, [
    { "firstPerson": [4.5, 3.75, -5.0], "offset": [0.5, 4.0, 0.0], "size": [2.0, 2.0] }
  ]);/* 
  cannon.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("skyhighheroes:dyn/astro_clothes") != 3);

  var cannonNoraml = bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "leftArm", color, [
    { "firstPerson": [4.5, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [2.0, 2.0] }
  ])
  cannonNoraml.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("skyhighheroes:dyn/astro_clothes") == 3); */
};

function initRightArmBeams(renderer, color) {
  renderer.bindProperty("fiskheroes:energy_bolt").color.set(color);

  var cannon = bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "rightArm", color, [
    { "firstPerson": [-4.5, 3.75, -5.0], "offset": [-0.5, 4.0, 0.0], "size": [2.0, 2.0] }
  ]);/* 
  cannon.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("skyhighheroes:dyn/astro_clothes") != 3);

  var cannonNormal = bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "rightArm", color, [
    { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] }
  ]);
  cannonNormal.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam")).setCondition(entity => entity.getData("skyhighheroes:dyn/astro_clothes") == 3); */
};

function headAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") + getHoloBoolean(entity, "holoFlight"));
  data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer") + getHoloBooleans(entity, "holoFlight", "holoBoostFlight"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/arm_cannon_timer") + getHoloBoolean(entity, "holoArmCannon"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/dual_arm_cannon_timer") + getHoloBoolean(entity, "holoDualCannons"));
  data.load(4, entity.getInterpolatedData("fiskheroes:beam_charge") + getHoloBoolean(entity, "holoDualCannons"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/head_top_front_open_timer"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/head_top_back_open_timer"));
  data.load(7, entity.getInterpolatedData("skyhighheroes:dyn/head_bottom_front_open_timer"));
  data.load(8, entity.getInterpolatedData("skyhighheroes:dyn/head_bottom_back_open_timer"));
  data.load(9, entity.loop(20));
};

function bodyAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("fiskheroes:beam_charge") + entity.getInterpolatedData("skyhighheroes:dyn/machine_gun_open_timer"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/torso_front_open_timer"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/torso_back_open_timer"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/shorts_front_open_timer"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/shorts_back_open_timer"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/core_open_timer"));
};

function leftArmAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/dual_arm_cannon_timer") + getHoloBoolean(entity, "holoDualCannons"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/left_arm_outer_open_timer"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/left_cannon_outer_open_timer"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/left_cannon_inner_open_timer"));
};

function rightArmAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/arm_cannon_timer") + entity.getInterpolatedData("skyhighheroes:dyn/dual_arm_cannon_timer") + getHoloBoolean(entity, "holoArmCannon") + getHoloBoolean(entity, "holoDualCannons"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/right_arm_outer_open_timer"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/right_cannon_outer_open_timer"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/right_cannon_inner_open_timer"));
};

function leftLegAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") + getHoloBoolean(entity, "holoFlight"));
  data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer") + getHoloBooleans(entity, "holoFlight", "holoBoostFlight"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/left_boot_front_open_timer"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/left_boot_back_open_timer"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/left_leg_front_open_timer"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/left_leg_back_open_timer"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/left_boot_open_timer"));
};

function rightLegAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") + getHoloBoolean(entity, "holoFlight"));
  data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer") + getHoloBooleans(entity, "holoFlight", "holoBoostFlight"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/right_boot_front_open_timer"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/right_boot_back_open_timer"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/right_leg_front_open_timer"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/right_leg_back_open_timer"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/right_boot_open_timer"));
};

function initLeftLegBooster(renderer, model, colors) {

  var cubeOffset = model.getCubeOffset("left_leg_booster");

  var color;

  if (typeof colors !== "object") {
    color = colors;
  } else {
    color = 0x000000;
  };

  var icon = renderer.createResource("ICON", "skyhighheroes:null");
  
  var booster = renderer.createEffect("fiskheroes:booster");
  booster.setIcon(icon).setOffset(0.0, 2.18, 0.0).setSize(4.0, 2.0);
  booster.anchor.set("leftLeg", cubeOffset);
  booster.mirror = false;
  
  var boosterNormal = renderer.createEffect("fiskheroes:booster");
  boosterNormal.setIcon(icon).setOffset(0.0, 12.0, 0.0).setSize(4.0, 2.0);
  boosterNormal.anchor.set("leftLeg");
  boosterNormal.mirror = false;

  beam = renderer.createResource("BEAM_RENDERER", "skyhighheroes:astro_booster");

  //Edge
  var shapeEdge = renderer.createResource("SHAPE", null);
  var lineEdge = shapeEdge.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [3.5, 3.5] });
  var bloomEdge = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeEdge).setOffset(0.0, 2.18, 0.0);
  bloomEdge.anchor.set("leftLeg", cubeOffset);
  bloomEdge.color.set((typeof colors === "object" && colors.length == 3) ? colors[2] : color);
  bloomEdge.mirror = false;
  bloomEdge.setScale(16.0);
/* 
  var bloomNormalEdge = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeEdge).setOffset(0.0, 12.0, 0.0);
  bloomNormalEdge.anchor.set("leftLeg");
  bloomNormalEdge.color.set((typeof colors === "object" && colors.length == 3) ? colors[2] : color);
  bloomNormalEdge.mirror = false;
  bloomNormalEdge.setScale(16.0); */

  //Middle
  var shapeMiddle = renderer.createResource("SHAPE", null);
  var lineMiddle = shapeMiddle.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [1.75, 1.75] });
  var bloomMiddle = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeMiddle).setOffset(0.0, 2.18, 0.0);
  bloomMiddle.anchor.set("leftLeg", cubeOffset);
  bloomMiddle.color.set((typeof colors === "object" && colors.length == 3) ? colors[1] : color);
  bloomMiddle.mirror = false;
  bloomMiddle.setScale(16.0);
  /* 
  var bloomNormalMiddle = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeMiddle).setOffset(0.0, 12.0, 0.0);
  bloomNormalMiddle.anchor.set("leftLeg");
  bloomNormalMiddle.color.set((typeof colors === "object" && colors.length == 3) ? colors[1] : color);
  bloomNormalMiddle.mirror = false;
  bloomNormalMiddle.setScale(16.0); */

  //Center
  var shapeCenter = renderer.createResource("SHAPE", null);
  var lineCenter = shapeCenter.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [0.875, 0.875] });
  var bloomCenter = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeCenter).setOffset(0.0, 2.18, 0.0);
  bloomCenter.anchor.set("leftLeg", cubeOffset);
  bloomCenter.color.set((typeof colors === "object" && colors.length == 3) ? colors[0] : color);
  bloomCenter.mirror = false;
  bloomCenter.setScale(16.0);
  /* 
  var bloomNormalCenter = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeCenter).setOffset(0.0, 12.0, 0.0);
  bloomNormalCenter.anchor.set("leftLeg");
  bloomNormalCenter.color.set((typeof colors === "object" && colors.length == 3) ? colors[0] : color);
  bloomNormalCenter.mirror = false;
  bloomNormalCenter.setScale(16.0); */

  var obj = {
    booster: booster,
    bloomEdge: bloomEdge,
    bloomMiddle: bloomMiddle,
    bloomCenter: bloomCenter,
    /* boosterNormal: boosterNormal,
    bloomNormalEdge: bloomNormalEdge,
    bloomNormalMiddle: bloomNormalMiddle,
    bloomNormalCenter: bloomNormalCenter, */
    render: (entity, renderLayer, isFirstPersonArm) => {
      //Boots
      //Equations
      var data_0 = getHoloBoolean(entity, "holoFlight") + (Math.sin(((5*Math.min(Math.max(entity.getInterpolatedData("fiskheroes:flight_timer"), 0.8), 1.0) - 4) * 2.0 - 1.0) * Math.PI / 2.0) + 1.0) / 2.0;
      var data_1 = getHoloBooleans(entity, "holoFlight", "holoBoostFlight") + entity.getInterpolatedData("fiskheroes:flight_boost_timer");
      var boost = data_1;
      var flight = data_0;
      var b = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
      b = entity.isSprinting() ? 0.5 - Math.cos(2 * b * Math.PI) / 2 : 0;
      var f = Math.PI * 2;
      f = Math.sin((entity.loop(f) * f) % f * 3) / 5;

      booster.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomEdge.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomMiddle.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomCenter.setOffset(0.0, 2.18+0.65*boost, 0.0);

      //Default
      //Booster
      booster.progress = boost;
      booster.speedScale = 0.5 * boost;
      booster.flutter = 1 + boost;
      booster.setSize(4.0 + b * 4, 2.0 - b * 3.9);
      //Beams
      lineEdge.end.y = lineMiddle.end.y = lineCenter.end.y = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.5 * 1.5 / 8);
      //lineMiddle = (2 * boost) + ((1 + f * booster.flutter / 4) * 1.25 * 1.25 / 8);
      //lineCenter = (2 * boost) + ((1 + f * booster.flutter / 4) * 1 * 1 / 8);
      //Edge
      bloomEdge.progress = bloomEdge.opacity = flight;
      //Middle
      bloomMiddle.progress = bloomMiddle.opacity = flight;
      //Center
      bloomCenter.progress = bloomCenter.opacity = flight;

      //Normal
      /* var data_0 = entity.getInterpolatedData("fiskheroes:flight_timer");
      var data_1 = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
      var boost = data_1;
      var b = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
      b = entity.isSprinting() ? 0.5 - Math.cos(2 * b * Math.PI) / 2 : 0;
      var f = Math.PI * 2;
      f = Math.sin((entity.loop(f) * f) % f * 3) / 5;

      //Booster
      boosterNormal.progress = boost;
      boosterNormal.speedScale = 0.5 * boost;
      boosterNormal.flutter = 1 + boost;
      boosterNormal.setSize(4.0 + b * 4, 2.0 - b * 3.9);
      //Beam
      lineEdge.end.y = lineMiddle.end.y = lineCenter.end.y = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.5 * 1.5 / 8);
      //lineMiddle = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.25 * 1.25 / 8);
      //lineCenter = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1 * 1 / 8);
      //Edge
      bloomNormalEdge.progress = bloomNormalEdge.opacity = flight;
      //Middle
      bloomNormalMiddle.progress = bloomNormalMiddle.opacity = flight;
      //Center
      bloomNormalCenter.progress = bloomNormalCenter.opacity = flight; */

      lineCenter.size.x = 0.025 + boost*0.85;
      lineCenter.size.y = 0.025 + boost*0.85;
      
      lineMiddle.size.x = 0.05 + boost*1.7;
      lineMiddle.size.y = 0.05 + boost*1.7;

      lineEdge.size.x = 0.1 + boost*3.4;
      lineEdge.size.y = 0.1 + boost*3.4;

      if (!isFirstPersonArm && (data_0 > 0.0)) {
        booster.render();
        bloomEdge.render();
        bloomMiddle.render();
        bloomCenter.render();/* 
        if (entity.getData("skyhighheroes:dyn/astro_clothes") != 3) {
          booster.render();
          bloomEdge.render();
          bloomMiddle.render();
          bloomCenter.render();
        } else {
          boosterNormal.render();
          bloomNormalEdge.render();
          bloomNormalMiddle.render();
          bloomNormalCenter.render();
        }; */
      };
    }
  };
  return obj;
};

function initRightLegBooster(renderer, model, colors) {

  var cubeOffset = model.getCubeOffset("right_leg_booster");

  var color;

  if (typeof colors !== "object") {
    color = colors;
  } else {
    color = 0x000000;
  };

  var icon = renderer.createResource("ICON", "skyhighheroes:null");
  
  var booster = renderer.createEffect("fiskheroes:booster");
  booster.setIcon(icon).setOffset(0.0, 2.18, 0.0).setSize(4.0, 2.0);
  booster.anchor.set("rightLeg", cubeOffset);
  booster.mirror = false;
  
  var boosterNormal = renderer.createEffect("fiskheroes:booster");
  boosterNormal.setIcon(icon).setOffset(0.0, 12.0, 0.0).setSize(4.0, 2.0);
  boosterNormal.anchor.set("rightLeg");
  boosterNormal.mirror = false;

  beam = renderer.createResource("BEAM_RENDERER", "skyhighheroes:astro_booster");

  //Edge
  var shapeEdge = renderer.createResource("SHAPE", null);
  var lineEdge = shapeEdge.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [3.5, 3.5] });
  var bloomEdge = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeEdge).setOffset(0.0, 2.18, 0.0);
  bloomEdge.anchor.set("rightLeg", cubeOffset);
  bloomEdge.color.set((typeof colors === "object" && colors.length == 3) ? colors[2] : color);
  bloomEdge.mirror = false;
  bloomEdge.setScale(16.0);
/* 
  var bloomNormalEdge = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeEdge).setOffset(0.0, 12.0, 0.0);
  bloomNormalEdge.anchor.set("rightLeg");
  bloomNormalEdge.color.set((typeof colors === "object" && colors.length == 3) ? colors[2] : color);
  bloomNormalEdge.mirror = false;
  bloomNormalEdge.setScale(16.0); */

  //Middle
  var shapeMiddle = renderer.createResource("SHAPE", null);
  var lineMiddle = shapeMiddle.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [1.75, 1.75] });
  var bloomMiddle = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeMiddle).setOffset(0.0, 2.18, 0.0);
  bloomMiddle.anchor.set("rightLeg", cubeOffset);
  bloomMiddle.color.set((typeof colors === "object" && colors.length == 3) ? colors[1] : color);
  bloomMiddle.mirror = false;
  bloomMiddle.setScale(16.0);
  /* 
  var bloomNormalMiddle = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeMiddle).setOffset(0.0, 12.0, 0.0);
  bloomNormalMiddle.anchor.set("rightLeg");
  bloomNormalMiddle.color.set((typeof colors === "object" && colors.length == 3) ? colors[1] : color);
  bloomNormalMiddle.mirror = false;
  bloomNormalMiddle.setScale(16.0); */

  //Center
  var shapeCenter = renderer.createResource("SHAPE", null);
  var lineCenter = shapeCenter.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [0.875, 0.875] });
  var bloomCenter = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeCenter).setOffset(0.0, 2.18, 0.0);
  bloomCenter.anchor.set("rightLeg", cubeOffset);
  bloomCenter.color.set((typeof colors === "object" && colors.length == 3) ? colors[0] : color);
  bloomCenter.mirror = false;
  bloomCenter.setScale(16.0);
  /* 
  var bloomNormalCenter = renderer.createEffect("fiskheroes:lines").setRenderer(beam).setShape(shapeCenter).setOffset(0.0, 12.0, 0.0);
  bloomNormalCenter.anchor.set("rightLeg");
  bloomNormalCenter.color.set((typeof colors === "object" && colors.length == 3) ? colors[0] : color);
  bloomNormalCenter.mirror = false;
  bloomNormalCenter.setScale(16.0); */

  var obj = {
    booster: booster,
    bloomEdge: bloomEdge,
    bloomMiddle: bloomMiddle,
    bloomCenter: bloomCenter,
    /* boosterNormal: boosterNormal,
    bloomNormalEdge: bloomNormalEdge,
    bloomNormalMiddle: bloomNormalMiddle,
    bloomNormalCenter: bloomNormalCenter, */
    render: (entity, renderLayer, isFirstPersonArm) => {
      //Boots
      //Equations
      var data_0 = getHoloBoolean(entity, "holoFlight") + (Math.sin(((5*Math.min(Math.max(entity.getInterpolatedData("fiskheroes:flight_timer"), 0.8), 1.0) - 4) * 2.0 - 1.0) * Math.PI / 2.0) + 1.0) / 2.0;
      var data_1 = getHoloBooleans(entity, "holoFlight", "holoBoostFlight") + entity.getInterpolatedData("fiskheroes:flight_boost_timer");
      var boost = data_1;
      var flight = data_0;
      var b = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
      b = entity.isSprinting() ? 0.5 - Math.cos(2 * b * Math.PI) / 2 : 0;
      var f = Math.PI * 2;
      f = Math.sin((entity.loop(f) * f) % f * 3) / 5;

      booster.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomEdge.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomMiddle.setOffset(0.0, 2.18+0.65*boost, 0.0);
      bloomCenter.setOffset(0.0, 2.18+0.65*boost, 0.0);

      //Default
      //Booster
      booster.progress = boost;
      booster.speedScale = 0.5 * boost;
      booster.flutter = 1 + boost;
      booster.setSize(4.0 + b * 4, 2.0 - b * 3.9);
      //Beams
      lineEdge.end.y = lineMiddle.end.y = lineCenter.end.y = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.5 * 1.5 / 8);
      //lineMiddle = (2 * boost) + ((1 + f * booster.flutter / 4) * 1.25 * 1.25 / 8);
      //lineCenter = (2 * boost) + ((1 + f * booster.flutter / 4) * 1 * 1 / 8);
      //Edge
      bloomEdge.progress = bloomEdge.opacity = flight;
      //Middle
      bloomMiddle.progress = bloomMiddle.opacity = flight;
      //Center
      bloomCenter.progress = bloomCenter.opacity = flight;

      //Normal
      /* var data_0 = entity.getInterpolatedData("fiskheroes:flight_timer");
      var data_1 = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
      var boost = data_1;
      var b = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
      b = entity.isSprinting() ? 0.5 - Math.cos(2 * b * Math.PI) / 2 : 0;
      var f = Math.PI * 2;
      f = Math.sin((entity.loop(f) * f) % f * 3) / 5;

      //Booster
      boosterNormal.progress = boost;
      boosterNormal.speedScale = 0.5 * boost;
      boosterNormal.flutter = 1 + boost;
      boosterNormal.setSize(4.0 + b * 4, 2.0 - b * 3.9);
      //Beam
      lineEdge.end.y = lineMiddle.end.y = lineCenter.end.y = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.5 * 1.5 / 8);
      //lineMiddle = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1.25 * 1.25 / 8);
      //lineCenter = (2 * boost) + ((1 + f * boosterNormal.flutter / 4) * 1 * 1 / 8);
      //Edge
      bloomNormalEdge.progress = bloomNormalEdge.opacity = flight;
      //Middle
      bloomNormalMiddle.progress = bloomNormalMiddle.opacity = flight;
      //Center
      bloomNormalCenter.progress = bloomNormalCenter.opacity = flight; */

      lineCenter.size.x = 0.025 + boost*0.85;
      lineCenter.size.y = 0.025 + boost*0.85;
      
      lineMiddle.size.x = 0.05 + boost*1.7;
      lineMiddle.size.y = 0.05 + boost*1.7;

      lineEdge.size.x = 0.1 + boost*3.4;
      lineEdge.size.y = 0.1 + boost*3.4;

      if (!isFirstPersonArm && (data_0 > 0.0)) {
        booster.render();
        bloomEdge.render();
        bloomMiddle.render();
        bloomCenter.render();/* 
        if (entity.getData("skyhighheroes:dyn/astro_clothes") != 3) {
          booster.render();
          bloomEdge.render();
          bloomMiddle.render();
          bloomCenter.render();
        } else {
          boosterNormal.render();
          bloomNormalEdge.render();
          bloomNormalMiddle.render();
          bloomNormalCenter.render();
        }; */
      };
    }
  };
  return obj;
};

function mainNBT(entity) {
  return entity.getWornLeggings().nbt();
};

/**
 * Checks a NBT boolean to be used on holographic display stand
 * @param {JSEntity} entity - required
 * @param {string} value - NBT boolean to check
 * @returns NBT boolean if the entity is a holographic display stand
 **/
function getHoloBoolean(entity, value) {
  return ((entity.is("DISPLAY") && (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) ? mainNBT(entity).getBoolean(value) : 0.0);
};

/**
 * Checks two NBT booleans to be used on holographic display stand
 * @param {JSEntity} entity - required
 * @param {string} condition - NBT boolean to use for condition
 * @param {string} value - NBT boolean to use for condition
 * @returns NBT boolean if the entity is a holographic display stand
 **/
function getHoloBooleans(entity, condition, value) {
  return ((entity.is("DISPLAY") && (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM")) ? (mainNBT(entity).getBoolean(condition) && mainNBT(entity).getBoolean(value)) : 0.0);
};