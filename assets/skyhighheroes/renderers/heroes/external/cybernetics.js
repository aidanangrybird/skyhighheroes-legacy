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
  prop.color.set(color);
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

//Cyber Animations
function initCyberneticAnimations(renderer) {
  addAnimation(renderer, "cybernetic.LEFT_ARM_BLADE", "skyhighheroes:cybernetic_left_arm_blade").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/blade_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") + getHoloBooleans(entity, "holoBlades", "bladesLeft"));
    data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/blade_left_stealth_timer") + getHoloBooleans(entity, "holoBlades", "bladesLeftStealth"));
  });
  addAnimation(renderer, "cybernetic.RIGHT_ARM_BLADE", "skyhighheroes:cybernetic_right_arm_blade").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/blade_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") + getHoloBooleans(entity, "holoBlades", "bladesRight"));
    data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/blade_right_stealth_timer") + getHoloBooleans(entity, "holoBlades", "bladesRightStealth"));
  });
  addAnimation(renderer, "cybernetic.LEFT_LEG_ROCKETS", "skyhighheroes:cybernetic_left_leg_rockets").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
    data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer") + getHoloBooleans(entity, "holoFlight", "innerRockets"));
  });
  addAnimation(renderer, "cybernetic.RIGHT_LEG_ROCKETS", "skyhighheroes:cybernetic_right_leg_rockets").setData((entity, data) => {
    data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
    data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer") + getHoloBooleans(entity, "holoFlight", "innerRockets"));
  });
  addAnimation(renderer, "cybernetic.WING_LEFT", "skyhighheroes:cybernetic_wing_left").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/wing_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") + getHoloBooleans(entity, "holoFlight", "rocketsWings") + getHoloBoolean(entity, "holoGlide"));
  });
  addAnimation(renderer, "cybernetic.WING_RIGHT", "skyhighheroes:cybernetic_wing_right").setData((entity, data) => {
    data.load( entity.getInterpolatedData("skyhighheroes:dyn/wing_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") + getHoloBooleans(entity, "holoFlight", "rocketsWings") + getHoloBoolean(entity, "holoGlide"));
  });
  addAnimation(renderer, "cybernetic.LEFT_ARM_AIM", "skyhighheroes:cybernetic_left_arm_aim").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  });
  addAnimation(renderer, "cybernetic.RIGHT_ARM_AIM", "skyhighheroes:cybernetic_right_arm_aim").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  });
  addAnimation(renderer, "cybernetic.LEFT_ARM_SHIELD", "skyhighheroes:cybernetic_left_arm_shield").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/shield_left_timer") * entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * (1 - entity.getInterpolatedData("fiskheroes:beam_charge")));
  });
  addAnimation(renderer, "cybernetic.RIGHT_ARM_SHIELD", "skyhighheroes:cybernetic_right_arm_shield").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/shield_right_timer") * entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * (1 - entity.getInterpolatedData("fiskheroes:beam_charge")));
  });
  addAnimation(renderer, "cybernetic.CONVERSION", "skyhighheroes:cybernetic_base").setData((entity, data) => {
    data.load(entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_conversion_sleep_timer"));
  })
  .priority = -11;
  addAnimation(renderer, "cybernetic.STATUE", "skyhighheroes:cybernetic_base").setData((entity, data) => {
    data.load(entity.getData("skyhighheroes:dyn/cybernetic_statue_mode_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cybernetics_offline_timer") + entity.getInterpolatedData("skyhighheroes:dyn/charging_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cybernetic_sleep_timer"));
  })
  .setCondition(entity => !entity.is("DISPLAY"))
  .priority = -11;/*
  addAnimation(renderer, "cybernetic.LEFT_ARM_PUNCH", "skyhighheroes:cybernetic_left_arm_punch").setData((entity, data) => {
    data.load(entity.getPunchTimerInterpolated());
  })
  .setCondition(entity => (entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") == 1))
  .priority = -8;
  addAnimation(renderer, "cybernetic.RIGHT_ARM_PUNCH", "skyhighheroes:cybernetic_right_arm_punch").setData((entity, data) => {
    data.load(entity.getPunchTimerInterpolated());
  })
  .setCondition(entity => (entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") == 1))
  .priority = -8; */
  addAnimation(renderer, "cybernetic.DUAL_PUNCH", "skyhighheroes:cybernetic_dual_punch").setData((entity, data) => {
    data.load(1.0);
  })
  .setCondition(entity => ((entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") == 1) && (entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") == 1)))
  .priority = -8;
  //Flight
  addFlightAnimationWithLanding(renderer, "cybernetic.FLIGHT", "skyhighheroes:flight/cybernetic_flight.anim.json");
  //Landing
  addAnimationWithData(renderer, "cybernetic.LAND", "skyhighheroes:cybernetic_landing", "skyhighheroes:dyn/superhero_landing_timer")
    .priority = -8;
  addAnimationWithData(renderer, "cybernetic.LAND_BOOST", "skyhighheroes:cybernetic_boosting_landing", "skyhighheroes:dyn/superhero_boosting_landing_timer")
    .priority = -8;
  addAnimationWithData(renderer, "cybernetic.ROLL", "skyhighheroes:flight/cybernetic_barrel_roll", "fiskheroes:barrel_roll_timer")
  addFlightIdleAnimation(renderer, "cybernetic.IDLE", "skyhighheroes:flight/cybernetic_idle");
  addAnimationWithData(renderer, "cybernetic.OFFLINE", "skyhighheroes:cybernetic_base", "skyhighheroes:dyn/cybernetics_offline_timer")
    .setCondition(entity => (!entity.is("DISPLAY") && entity.getInterpolatedData("skyhighheroes:dyn/cybernetics_offline_timer") > 0))
    .priority = -10;

  addAnimation(renderer, "cybernetic.HOLOGRAM_FLIGHT", "skyhighheroes:cybernetic_holo_flight").setData((entity, data) => {
    data.load(0, 0.0 + getHoloBooleans(entity, "holoFlight", "rocketsArms") + getHoloBooleans(entity, "holoFlight", "rocketsBody") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
    data.load(1, 0.0 + getHoloBoolean(entity, "holoBoostFlight"));
    data.load(2, entity.loop(20 * Math.PI) + 0.4);
    data.load(3, 0.0 + getHoloBooleans2(entity, "holoFlight", "rocketsArms", "holoFlightMotion") + getHoloBooleans2(entity, "holoFlight", "rocketsBody", "holoFlightMotion") + getHoloBooleans2(entity, "holoFlight", "rocketsLegs", "holoFlightMotion"));
  }).priority = -9;

  addAnimation(renderer, "cybernetic.HOLOGRAM_GLIDE", "skyhighheroes:cybernetic_holo_glide").setData((entity, data) => {
    data.load(0.0 + getHoloBoolean(entity, "holoGlide"));
  }).priority = -9;
};

function initNV(renderer, uuid) {
  nv = renderer.bindProperty("fiskheroes:night_vision");
  nv.fogStrength = 0.0;
  nv.factor = 1.0;
  nv.setCondition(entity => entity.getUUID() == uuid);
};

function initTentacles(renderer, model) {
  var tentacleBase = model.getCubeOffset("body_ext_arm_left");
  var arm = renderer.createResource("MODEL", "skyhighheroes:CyberneticArm");
  arm.texture.set("arm", "arm_lights");
  var claw = renderer.createResource("MODEL", "skyhighheroes:CyberneticClaw");
  claw.texture.set("claw", "claw_lights");
  claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
      var t = entity.as("TENTACLE");
      data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
      data.load(1, t.getIndex());
      data.load(2, t.getGrabTimer());
      data.load(3, t.getStrikeTimer());
  });

  var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
      { "offset": [2.0, -7.5, -4.65], "direction": [2.0, 15.0, -25.0] },
      { "offset": [-2.0, -7.5, -4.65], "direction": [-2.0, 15.0, -25.0] }
  ]);
  tentacles.anchor.set("body", tentacleBase);
  tentacles.setSegmentModel(arm);
  tentacles.setHeadModel(claw);
  tentacles.segmentLength = 1.8;
  tentacles.segments = 16;
  tentacles.setCondition(entity => entity.getInterpolatedData("skyhighheroes:dyn/thermoptic_camouflage_timer") == 0)
};

/**
 * Checks a NBT boolean to be used on holographic display stand
 * @param {JSEntity} entity - required
 * @param {string} value - NBT boolean to check
 * @returns NBT boolean if the entity is a holographic display stand
 **/
function getHoloBoolean(entity, value) {
  return entity.is("DISPLAY") && (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM") && mainNBT(entity).getBoolean(value);
};

/**
 * Checks two NBT booleans to be used on holographic display stand
 * @param {JSEntity} entity - required
 * @param {string} condition - NBT boolean to use for condition
 * @param {string} value - NBT boolean to use for condition
 * @returns NBT boolean if the entity is a holographic display stand
 **/
function getHoloBooleans(entity, condition, value) {
  return entity.is("DISPLAY") && (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM") && (mainNBT(entity).getBoolean(condition) && mainNBT(entity).getBoolean(value));
};

/**
 * Checks three NBT booleans to be used on holographic display stand
 * @param {JSEntity} entity - required
 * @param {string} condition1 - First NBT boolean to use for condition
 * @param {string} condition2 - Second NBT boolean to use for condition
 * @param {string} value - NBT boolean to use for condition
 * @returns NBT boolean if the entity is a holographic display stand
 **/
function getHoloBooleans2(entity, condition1, condition2, value) {
  return entity.is("DISPLAY") && (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM") && (mainNBT(entity).getBoolean(condition1) && mainNBT(entity).getBoolean(condition2) && mainNBT(entity).getBoolean(value));
};

function elevation(entity, posX, posY, posZ) {
  var distance = entity.pos().xz().distanceTo(posX, posZ);
  var vector = PackLoader.asVec2(0, entity.pos().y());
  var angle = 90-vector.angleTo(distance, posY);
  return angle;
};

/**
 * Gets direction from one vector to another
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Direction
 **/
function directionAngle(entity, posX, posZ) {
  var angle = (entity.eyePos().add(0,1,0).xz().angleTo(posX, posZ) + 90);
  return angle;
};

function crossProduct(vector, otherVector) {
  var i = (vector.y()*otherVector.z()-vector.z()*otherVector.y());
  var j = (vector.z()*otherVector.x()-vector.x()*otherVector.z());
  var k = (vector.x()*otherVector.y()-vector.y()*otherVector.x());
  var finalVector = PackLoader.asVec3(i,j,k);
  return finalVector;
};

function headAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_head_timer") + getHoloBooleans(entity, "holoCannons", "cannonsHead"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_head_timer") + getHoloBooleans(entity, "holoCannons", "cannonsHead"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/satellite_deploy_timer") + getHoloBoolean(entity, "holoSat"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/satellite_rain_mode_timer"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/antenna_deploy_timer") + getHoloBoolean(entity, "holoAnt"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_flush_timer"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_open_timer"));
  data.load(7, entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_open_timer"));
  data.load(8, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer") == 0)?0:1));
  data.load(9, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer") == 0)?0:1));
  data.load(10, ((!entity.getData("skyhighheroes:dyn/converted_cyber")) ? 0.0 : stuff.getBearing(entity)));
  data.load(11, ((!entity.getData("skyhighheroes:dyn/converted_cyber")) ? 0.0 : entity.rotationInterpolated().y()));
  data.load(12, ((!entity.getData("skyhighheroes:dyn/converted_cyber")) ? 0.0 : stuff.directionAngle(entity, entity.getData("skyhighheroes:dyn/satellite_x")+0.5, entity.getData("skyhighheroes:dyn/satellite_z")+0.5)));
  data.load(13, ((!entity.getData("skyhighheroes:dyn/converted_cyber")) ? 0.0 : stuff.elevation(entity, entity.getData("skyhighheroes:dyn/satellite_x")+0.5, entity.getData("skyhighheroes:dyn/satellite_y")+0.5, entity.getData("skyhighheroes:dyn/satellite_z")+0.5)));
};

function bodyAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_body_timer") + getHoloBooleans(entity, "holoFlight", "rocketsBody"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_body_timer") + getHoloBooleans(entity, "holoFlight", "rocketsBody"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_body_timer") + getHoloBooleans(entity, "holoCannons", "cannonsBody"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_body_timer") + getHoloBooleans(entity, "holoCannons", "cannonsBody"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/wing_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") + getHoloBooleans(entity, "holoFlight", "rocketsWings") + getHoloBoolean(entity, "holoGlide"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/wing_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer") + getHoloBooleans(entity, "holoFlight", "rocketsWings") + getHoloBoolean(entity, "holoGlide"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/external_arm_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/external_arms_timer"));
  data.load(7, entity.getInterpolatedData("skyhighheroes:dyn/external_arm_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/external_arms_timer"));
  data.load(8, entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_flush_timer"));
  data.load(9, entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_open_timer"));
  data.load(10, entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_open_timer"));
  data.load(11, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer") == 0)?0:1));
  data.load(12, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer") == 0)?0:1));
  data.load(13, entity.getInterpolatedData("skyhighheroes:dyn/system_core_open_timer"));
  data.load(14, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  data.load(15, entity.getInterpolatedData("fiskheroes:flight_timer"));
  data.load(16, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
};

function leftArmAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_bottom_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/blade_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer") + getHoloBooleans(entity, "holoBlades", "bladesLeft"));
  data.load(7, entity.getInterpolatedData("skyhighheroes:dyn/shield_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_left_timer") + getHoloBooleans(entity, "holoShields", "shieldsLeft"));
  data.load(8, entity.getInterpolatedData("skyhighheroes:dyn/blade_left_stealth_timer") + getHoloBooleans(entity, "holoBlades", "bladesLeftStealth"));
  data.load(9, entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_flush_timer"));
  data.load(10, entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_open_timer"));
  data.load(11, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer") == 0)?0:1));
  data.load(12, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  data.load(13, entity.getInterpolatedData("fiskheroes:flight_timer"));
  data.load(14, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
};

function rightArmAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_bottom_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer") + getHoloBooleans(entity, "holoCannons", "cannonsArms"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer") + getHoloBooleans(entity, "holoFlight", "rocketsArms"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/blade_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer") + getHoloBooleans(entity, "holoBlades", "bladesRight"));
  data.load(7, entity.getInterpolatedData("skyhighheroes:dyn/shield_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_right_timer") + getHoloBooleans(entity, "holoShields", "shieldsRight"));
  data.load(8, entity.getInterpolatedData("skyhighheroes:dyn/blade_left_stealth_timer") + getHoloBooleans(entity, "holoBlades", "bladesRightStealth"));
  data.load(9, entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_flush_timer"));
  data.load(10, entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_open_timer"));
  data.load(11, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer") == 0)?0:1));
  data.load(12, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  data.load(13, entity.getInterpolatedData("fiskheroes:flight_timer"));
  data.load(14, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
};

function leftLegAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_main_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer") + getHoloBooleans(entity, "holoFlight", "innerRockets"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_open_timer"));
  data.load(7, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer") == 0)?0:1));
  data.load(8, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  data.load(9, entity.getInterpolatedData("fiskheroes:flight_timer"));
  data.load(10, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
};

function rightLegAnimations(entity, data) {
  data.load(0, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_main_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(1, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(2, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(3, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(4, entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer") + getHoloBooleans(entity, "holoFlight", "rocketsLegs"));
  data.load(5, entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer") + getHoloBooleans(entity, "holoFlight", "innerRockets"));
  data.load(6, entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_open_timer"));
  data.load(7, entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer") == 0)?0:1));
  data.load(8, 0.0 + getHoloBooleans(entity, "holoFlight", "holoFlightMotion"));
  data.load(9, entity.getInterpolatedData("fiskheroes:flight_timer"));
  data.load(10, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
};

function hudPlayer(renderer) {
  //Body
  var body_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticBodyL2");
  body_hud.texture.set("body_disguise", "body_disguise");
  body_hud.bindAnimation("skyhighheroes:cybernetic_body").setData((entity, data) => bodyAnimations(entity, data));
  var body_hud_model = renderer.createEffect("fiskheroes:model").setModel(body_hud);
  body_hud_model.anchor.set("head");
  body_hud_model.anchor.ignoreAnchor(true);
  body_hud_model.setScale(1.0);
  var body_point = body_hud.getCubeOffset("body");
  //Head
  var head_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hud.texture.set("head_disguise", "head_disguise");
  head_hud.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => headAnimations(entity, data));
  var head_hud_model = renderer.createEffect("fiskheroes:model").setModel(head_hud);
  head_hud_model.anchor.set("head", body_point);
  head_hud_model.anchor.ignoreAnchor(true);
  head_hud_model.setScale(1.0);
  //Hair
  var head_hair_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticHeadL2");
  head_hair_hud.texture.set("head_hair_disguise", "head_hair_disguise");
  head_hair_hud.bindAnimation("skyhighheroes:cybernetic_head").setData((entity, data) => headAnimations(entity, data));
  var head_hair_hud_model = renderer.createEffect("fiskheroes:model").setModel(head_hair_hud);
  head_hair_hud_model.setOffset(0.0, 0.5, 0.0);
  head_hair_hud_model.anchor.set("head", body_point);
  head_hair_hud_model.anchor.ignoreAnchor(true);
  head_hair_hud_model.setScale(1.125);
  //Left arm
  var left_arm_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftArmL2");
  left_arm_hud.texture.set("left_arm_disguise", "left_arm_disguise");
  left_arm_hud.bindAnimation("skyhighheroes:cybernetic_left_arm").setData((entity, data) => leftArmAnimations(entity, data));
  var left_arm_hud_model = renderer.createEffect("fiskheroes:model").setModel(left_arm_hud);
  left_arm_hud_model.anchor.set("head", body_point);
  left_arm_hud_model.anchor.ignoreAnchor(true);
  //Right arm
  var right_arm_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightArmL2");
  right_arm_hud.texture.set("right_arm_disguise", "right_arm_disguise");
  right_arm_hud.bindAnimation("skyhighheroes:cybernetic_right_arm").setData((entity, data) => rightArmAnimations(entity, data));
  var right_arm_hud_model = renderer.createEffect("fiskheroes:model").setModel(right_arm_hud);
  right_arm_hud_model.anchor.set("head", body_point);
  right_arm_hud_model.anchor.ignoreAnchor(true);
  right_arm_hud_model.setScale(1.0);
  //Left leg
  var left_leg_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticLeftLegL2");
  left_leg_hud.texture.set("left_leg_disguise", "left_leg_disguise");
  left_leg_hud.bindAnimation("skyhighheroes:cybernetic_left_leg").setData((entity, data) => leftLegAnimations(entity, data));
  var left_leg_hud_model = renderer.createEffect("fiskheroes:model").setModel(left_leg_hud);
  left_leg_hud_model.anchor.set("head", body_point);
  left_leg_hud_model.anchor.ignoreAnchor(true);
  left_leg_hud_model.setScale(1.0);
  //Right leg
  var right_leg_hud = renderer.createResource("MODEL", "skyhighheroes:CyberneticRightLegL2");
  right_leg_hud.texture.set("right_leg_disguise", "right_leg_disguise");
  right_leg_hud.bindAnimation("skyhighheroes:cybernetic_right_leg").setData((entity, data) => rightLegAnimations(entity, data));
  var right_leg_hud_model = renderer.createEffect("fiskheroes:model").setModel(right_leg_hud);
  right_leg_hud_model.anchor.set("head", body_point);
  right_leg_hud_model.anchor.ignoreAnchor(true);
  right_leg_hud_model.setScale(1.0);
  return {
    render: (entity, isFirstPersonArm, posX, posY, posZ) => {
      if (isFirstPersonArm) {
        head_hud_model.setOffset(posX, posY, posZ);
        head_hud_model.render();
        head_hair_hud_model.setOffset(posX, posY, posZ);
        head_hair_hud_model.render();
        body_hud_model.setOffset(posX, posY, posZ);
        body_hud_model.render();
        left_arm_hud_model.setOffset(posX-5, posY+2, posZ);
        left_arm_hud_model.render();
        right_arm_hud_model.setOffset(posX+5, posY+2, posZ);
        right_arm_hud_model.render();
        left_leg_hud_model.setOffset(posX-2, posY+12, posZ);
        left_leg_hud_model.render();
        right_leg_hud_model.setOffset(posX+2, posY+12, posZ);
        right_leg_hud_model.render();
      };
    },
  };
};

/**
 * Gets the position of available cybers
 * @param {JSEntity} entity - Entity receiving data
 * @returns Position
 **/
function availableCybers(entity) {
  var range = 16;
  var foundPlayers = [];
  var foundPlayerNames = [];
  var data = [];
  var newRange = (range*1);
  var txAntennaDeployed = (entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
  var txSatelliteDeployed = (entity.getData("skyhighheroes:dyn/satellite_deploy_timer") == 1) && (entity.getData("skyhighheroes:dyn/satellite_rain_mode_timer") == 0);
  if (txAntennaDeployed) {
    newRange = (range*4);
  };
  var entities = entity.world().getEntitiesInRangeOf(entity.pos(), newRange);
  entities.forEach(otherEntity => {
    if (otherEntity.is("PLAYER") && (otherEntity.getUUID() != entity.getUUID())) {
      if (hasCyberneticBody(otherEntity) && checkFrequency(entity, otherEntity)) {
        if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
          foundPlayerNames.push(otherEntity.getName());
          foundPlayers.push(otherEntity);
        };
      };
    };
  });
  if (txSatelliteDeployed) {
    var idList = getSatIDList(entity);
    idList.forEach(id => {
      if (id > -1) {
        if (isStillCyber(entity, id)) {
          var otherEntity = entity.world().getEntityById(id)
          if (foundPlayerNames.indexOf(otherEntity.getName()) == -1) {
            if (checkSatellite(entity, otherEntity)) {
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
    //player = rx
    foundPlayers.forEach(otherEntity => {
      var rxDomain = otherEntity.getWornHelmet().suitType().split(":")[0];
      var rxAntennaDeployed = (otherEntity.getData(rxDomain + ":dyn/antenna_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
      var rxSatelliteDeployed = (otherEntity.getData(rxDomain + ":dyn/satellite_timer") == 1) && (otherEntity.getData(rxDomain + ":dyn/satellite_rain_mode_timer") == 0);
      if (entity.canSee(otherEntity) && entity.pos().distanceTo(otherEntity.pos()) <= range) {
        data.push(position(otherEntity));
      } else if (txAntennaDeployed && rxAntennaDeployed && checkFrequency(entity, otherEntity) && entity.canSee(otherEntity) && (entity.pos().distanceTo(otherEntity.pos()) <= range*4)) {
        data.push(position(otherEntity));
      } else if (txSatelliteDeployed && rxSatelliteDeployed && checkSatellite(entity, otherEntity)) {
        data.push(position(otherEntity));
      };
    });
  };
  return data;
};

/**
 * Gets the position of a cyber
 * @param {JSEntity} entity - Entity getting checked
 * @returns Position
 **/
function position(entity) {
  var otherName = getModelID(entity);
  var positionMessage = otherName + ": " + entity.posX().toFixed(0) + ", " + entity.posY().toFixed(0) + ", " + entity.posZ().toFixed(0);
  return positionMessage
};

/**
 * Gets the Cyber ID
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Cyber ID
 **/
function getModelID(entity) {
  var domain = entity.getWornChestplate().suitType().split(":")[0];
  return entity.getDataOrDefault(domain + ":dyn/model_id", "");
};
/**
 * Gets the Cyber name
 * @param {JSEntity} entity - Entity getting checked
 * @returns The Cyber alias
 **/
function getAliasName(entity) {
  var domain = entity.getWornChestplate().suitType().split(":")[0];
  return entity.getDataOrDefault(domain + ":dyn/alias", "");
};

/**
 * Gets satellite UUID list from entity 
 * @param {JSEntity} entity - Required
 **/
function getSatUUIDList(entity) {
  var list = mainNBT(entity).getTagList("playerInfoSat");
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
  var domain = entity.getWornChestplate().suitType().split(":")[0];
  var otherDomain = otherEntity.getWornChestplate().suitType().split(":")[0];
  if ((entity.getDataOrDefault(domain + ":dyn/satellite_x", -1) == otherEntity.getDataOrDefault(otherDomain + ":dyn/satellite_x", 1)) && (entity.getDataOrDefault(domain + ":dyn/satellite_y", -999) == otherEntity.getDataOrDefault(otherDomain + ":dyn/satellite_y", -1001)) && (entity.getDataOrDefault(domain + ":dyn/satellite_z", -1) == otherEntity.getDataOrDefault(otherDomain + ":dyn/satellite_z", 1))) {
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
  var domain = entity.getWornChestplate().suitType().split(":")[0];
  var otherDomain = otherEntity.getWornChestplate().suitType().split(":")[0];
  if (entity.getDataOrDefault(domain + ":dyn/frequency", -1) == otherEntity.getDataOrDefault(otherDomain + ":dyn/frequency", 1)) {
    return true;
  } else {
    return false;
  };
};

/**
 * Attempts to get model of a cybernetic player by id
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
 * Checks if an entity is cybernetic
 * @param {JSEntity} entity - Entity getting checked
 * @returns If the entity is cybernetic
 **/
function hasCyberneticBody(entity) {
  return (getModelID(entity) != "") && (getAliasName(entity) != "");
};

function headConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_head_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_head_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/satellite_deploy_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/satellite_rain_mode_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/antenna_deploy_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_head_flush_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_open_timer");
  var data_7 = entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_open_timer");
  var data_8 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_head_left_start_up_timer") == 0)?0:1);
  var data_9 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_head_right_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0 || data_8 > 0 || data_9 > 0);
};

function bodyConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_body_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_body_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_body_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_body_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_body_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_body_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/wing_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/wing_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/wings_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/external_arm_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/external_arms_timer");
  var data_7 = entity.getInterpolatedData("skyhighheroes:dyn/external_arm_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/external_arms_timer");
  var data_8 = entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_open_timer");
  var data_9 = entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_open_timer");
  var data_10 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_body_left_start_up_timer") == 0)?0:1);
  var data_11 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_body_right_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0 || data_8 > 0 || data_9 > 0 || data_10 > 0 || data_11 > 0);
};

function leftArmConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_bottom_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/blade_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_left_timer");
  var data_7 = entity.getInterpolatedData("skyhighheroes:dyn/shield_left_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_left_timer");
  var data_8 = entity.getInterpolatedData("skyhighheroes:dyn/blade_left_stealth_timer");
  var data_9 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_left_arm_flush_timer");
  var data_10 = entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_open_timer");
  var data_11 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_left_arm_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0 || data_8 > 0 || data_9 > 0 || data_10 > 0 || data_11 > 0);
};

function rightArmConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_bottom_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/cannons_arms_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_arm_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_arms_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/blade_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/blade_right_timer");
  var data_7 = entity.getInterpolatedData("skyhighheroes:dyn/shield_right_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/shield_right_timer");
  var data_8 = entity.getInterpolatedData("skyhighheroes:dyn/blade_left_stealth_timer");
  var data_9 = entity.getInterpolatedData("skyhighheroes:dyn/cannon_right_arm_flush_timer");
  var data_10 = entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_open_timer");
  var data_11 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_right_arm_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0 || data_8 > 0 || data_9 > 0 || data_10 > 0 || data_11 > 0);
};

function leftLegConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_main_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_left_leg_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_open_timer");
  var data_7 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_left_leg_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0);
};

function rightLegConditions(entity) {
  var data_0 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_main_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_1 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_outer_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_2 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_inner_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_3 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_front_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_4 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_right_leg_back_deploy_timer") + entity.getInterpolatedData("skyhighheroes:dyn/rockets_legs_timer");
  var data_5 = entity.getInterpolatedData("skyhighheroes:dyn/rocket_inner_legs_timer");
  var data_6 = entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_open_timer");
  var data_7 = entity.loop(500*(1-entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer"))+15)*((entity.getInterpolatedData("skyhighheroes:dyn/intake_right_leg_start_up_timer") == 0)?0:1);
  return (data_0 > 0 || data_1 > 0 || data_2 > 0 || data_3 > 0 || data_4 > 0 || data_5 > 0 || data_6 > 0 || data_7 > 0);
};

function mainNBT(entity) {
  return entity.getWornChestplate().nbt();
};