var overrides = {
};

//Beam setup
function bindBeam(renderer, propertyName, anchor, color, entries) {
  var prop = renderer.bindProperty(propertyName).setAnchor(anchor);
  var constln = renderer.createResource("BEAM_CONSTELLATION", null);

  for (var i = 0; i < entries.length; ++i) {
    constln.bindBeam(entries[i]);
  };

  var beamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:cybernetic_cannons");

  if (overrides.hasOwnProperty(color)) {
    beamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:" + overrides[color] + "_cannons");
  };

  prop.setConstellation(constln);
  prop.setRenderer(beamRenderer);
  prop.color.set(color);
  return prop;
};

//Init
//Beams
function initLeftArmBeams(renderer, color) {
  var position = [
    { "firstPerson": [4.5, 3.75, -11.4], "offset": [0.5, 12.9, 0.0], "size": [2.0, 2.0] },
    { "firstPerson": [0.9, 3.75, -11.4], "offset": [0.5, 8.0, -3.6], "size": [2.0, 2.0] },
    { "firstPerson": [8.1, 3.75, -11.4], "offset": [0.5, 8.0, 3.6], "size": [2.0, 2.0] }
  ];
  var chargedBeam = bindBeam(renderer, "fiskheroes:charged_beam", "leftArm", color, position);
  chargedBeam.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeam.setCondition(entity => mainNBT(entity).getBoolean("cannonsArms") && !mainNBT(entity).getBoolean("flushLeftArmCannons"));
  var positionFlush = [
    { "firstPerson": [4.5, 3.75, -11.4], "offset": [0.5, 10.0, 0.0], "size": [2.0, 2.0] },
    { "firstPerson": [7.0, 3.75, -11.4], "offset": [0.5, 8.0, -2.5], "size": [2.0, 2.0] },
    { "firstPerson": [2.0, 3.75, -11.4], "offset": [0.5, 8.0, 2.5], "size": [2.0, 2.0] }
  ];
  var chargedBeamFlush = bindBeam(renderer, "fiskheroes:charged_beam", "leftArm", color, positionFlush);
  chargedBeamFlush.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeamFlush.setCondition(entity => mainNBT(entity).getBoolean("cannonsArms") && mainNBT(entity).getBoolean("flushLeftArmCannons"));
};
function initRightArmBeams(renderer, color) {
  var position = [
    { "firstPerson": [-4.5, 3.75, -11.4], "offset": [-0.5, 12.9, 0.0], "size": [2.0, 2.0] },
    { "firstPerson": [-0.9, 3.75, -11.4], "offset": [-0.5, 8.0, -3.6], "size": [2.0, 2.0] },
    { "firstPerson": [-8.1, 3.75, -11.4], "offset": [-0.5, 8.0, 3.6], "size": [2.0, 2.0] }
  ];
  var chargedBeam = bindBeam(renderer, "fiskheroes:charged_beam", "rightArm", color, position);
  chargedBeam.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeam.setCondition(entity => mainNBT(entity).getBoolean("cannonsArms") && !mainNBT(entity).getBoolean("flushRightArmCannons"));
  var positionFlush = [
    { "firstPerson": [-4.5, 3.75, -11.4], "offset": [-0.5, 10.0, 0.0], "size": [2.0, 2.0] },
    { "firstPerson": [-7.0, 3.75, -11.4], "offset": [-0.5, 8.0, -2.5], "size": [2.0, 2.0] },
    { "firstPerson": [-2.0, 3.75, -11.4], "offset": [-0.5, 8.0, 2.5], "size": [2.0, 2.0] }
  ];
  var chargedBeamFlush = bindBeam(renderer, "fiskheroes:charged_beam", "rightArm", color, positionFlush);
  chargedBeamFlush.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeamFlush.setCondition(entity => mainNBT(entity).getBoolean("cannonsArms") && mainNBT(entity).getBoolean("flushRightArmCannons"));
};

function initHeadBeams(renderer, color) {
  var position = [
    { "firstPerson": [-8.15, 0.0, -1.0], "offset": [-8.15, -3.85, -1.0], "size": [2.0, 2.0] },
    { "firstPerson": [8.15, 0.0, -1.0], "offset": [8.15, -3.85, -1.0], "size": [2.0, 2.0] }
  ];
  var chargedBeam = bindBeam(renderer, "fiskheroes:charged_beam", "head", color, position);
  chargedBeam.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeam.setCondition(entity => mainNBT(entity).getBoolean("cannonsHead") && !mainNBT(entity).getBoolean("flushHeadCannons"));
  var positionFlush = [
    { "firstPerson": [-5.15, 0.0, -1.0], "offset": [-5.15, -3.85, -1.0], "size": [2.0, 2.0] },
    { "firstPerson": [5.15, 0.0, -1.0], "offset": [5.15, -3.85, -1.0], "size": [2.0, 2.0] }
  ];
  var chargedBeamFlush = bindBeam(renderer, "fiskheroes:charged_beam", "head", color, positionFlush);
  chargedBeamFlush.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeamFlush.setCondition(entity => mainNBT(entity).getBoolean("cannonsHead") && mainNBT(entity).getBoolean("flushHeadCannons"));
};

function initBodyBeams(renderer, color) {
  var position = [
    { "firstPerson": [-1.5, 2.5, 2.0], "offset": [-1.5, 2.5, -6.2], "size": [2.0, 2.0] },
    { "firstPerson": [1.5, 2.5, 2.0], "offset": [1.5, 2.5, -6.2], "size": [2.0, 2.0] }
  ];
  var chargedBeam = bindBeam(renderer, "fiskheroes:charged_beam", "body", color, position);
  chargedBeam.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeam.setCondition(entity => mainNBT(entity).getBoolean("cannonsBody") && !mainNBT(entity).getBoolean("flushBodyCannons"));
  var positionFlush = [
    { "firstPerson": [0.0, 3.0, 2.0], "offset": [0.0, 3.0, -2.0], "size": [4.0, 2.0] }
  ];
  var chargedBeamFlush = bindBeam(renderer, "fiskheroes:charged_beam", "body", color, positionFlush);
  chargedBeamFlush.setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
  chargedBeamFlush.setCondition(entity => mainNBT(entity).getBoolean("cannonsBody") && mainNBT(entity).getBoolean("flushBodyCannons"));
};

function mainNBT(entity) {
  return entity.getWornChestplate().nbt();
};

function initSatelliteBeams(renderer, model, color) {
  var receiveBase = model.getCubeOffset("head_satellite_dish_base");
  var transmitBase = model.getCubeOffset("head_satellite_dish_antenna");

  var transmitBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:cybernetic_transmit");
  if (overrides.hasOwnProperty(color)) {
    transmitBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:" + overrides[color] + "_transmit");
  };
  var transmitShape = renderer.createResource("SHAPE", null);
  var transmitLine = transmitShape.bindLine({ "start": [0.0, 0.1875, 0.0], "end": [0.0, 0.1875, 0.0], "size": [0.5, 0.5] });
  var transmitBeam = renderer.createEffect("fiskheroes:lines").setRenderer(transmitBeamRenderer).setShape(transmitShape).setOffset(0.0, 0.0, 0.0);
  transmitBeam.mirror = false;
  transmitBeam.setScale(16.0);
  transmitBeam.anchor.set("head", transmitBase);
  transmitBeam.color.set(color);

  var offset = 0.229351184;
  var yOffset = 300.0+offset;
  var receiveBeamRenderer;
  if (overrides.hasOwnProperty(color)) {
    receiveBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:" + overrides[color] + "_receive");
  } else {
    receiveBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:cybernetic_receive");
  };
  var receiveShape = renderer.createResource("SHAPE", null);
  var receiveLine = receiveShape.bindLine({ "start": [0.0, yOffset, 0.0], "end": [0.0, yOffset, 0.0], "size": [15.0, 15.0] });
  var receiveBeam = renderer.createEffect("fiskheroes:lines").setRenderer(receiveBeamRenderer).setShape(receiveShape).setOffset(0.0, 0.0, 0.0);
  receiveBeam.mirror = false;
  receiveBeam.setScale(16.0);
  receiveBeam.anchor.set("head", receiveBase);
  receiveBeam.color.set(color);
  return {
    render: function (entity, isFirstPersonArm) {
      var vector = PackLoader.asVec3(entity.getData("skyhighheroes:dyn/satellite_x")+0.5, entity.getData("skyhighocs:dyn/satellite_y")+0.5, entity.getData("skyhighocs:dyn/satellite_z")+0.5);
      var transmitTimer = entity.getInterpolatedData("skyhighheroes:dyn/transmit_beam_timer");
      var receiveTimer = entity.getInterpolatedData("skyhighocs:dyn/receive_beam_timer");
      var factor = entity.eyePos().add(0, 1, 0).distanceTo(vector);
      receiveLine.start.y = factor+offset;
      receiveLine.end.y = factor+offset;
      transmitLine.end.y = transmitLine.start.y+factor*transmitTimer;
      receiveLine.end.y = receiveLine.start.y-factor*receiveTimer;
      if (!isFirstPersonArm) {
        if (entity.world().isUnobstructed(entity.eyePos().add(0, 1, 0), vector) && entity.getData("skyhighheroes:dyn/satellite_deployed")) {
          if (transmitTimer > 0) {
            transmitBeam.render();
          };
          if (receiveTimer > 0) {
            receiveBeam.render();
          };
        };
      };
    }
  };
};

function initAntennaBeams(renderer, model, color) {
  var receiveBase = model.getCubeOffset("head_antenna_upper");
  var transmitBase = model.getCubeOffset("head_antenna_upper");

  var transmitBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:cybernetic_transmit");
  if (overrides.hasOwnProperty(color)) {
    transmitBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:" + overrides[color] + "_transmit");
  };
  var transmitShape = renderer.createResource("SHAPE", null);
  var transmitLine = transmitShape.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [0.5, 0.5] });
  var transmitBeam = renderer.createEffect("fiskheroes:lines").setRenderer(transmitBeamRenderer).setShape(transmitShape).setOffset(0.0, -6.0, 0.0);
  transmitBeam.mirror = false;
  transmitBeam.setScale(16.0);
  transmitBeam.anchor.set("head", transmitBase);
  transmitBeam.color.set(color);

  var receiveBeamRenderer;
  if (overrides.hasOwnProperty(color)) {
    receiveBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:" + overrides[color] + "_receive");
  } else {
    receiveBeamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:cybernetic_receive");
  };
  var receiveShape = renderer.createResource("SHAPE", null);
  var receiveLine = receiveShape.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [0.75, 0.75] });
  var receiveBeam = renderer.createEffect("fiskheroes:lines").setRenderer(receiveBeamRenderer).setShape(receiveShape).setOffset(0.0, -6.0, 0.0);
  receiveBeam.mirror = false;
  receiveBeam.setScale(16.0);
  receiveBeam.anchor.set("head", receiveBase);
  receiveBeam.color.set(color);
  
  return {
    render: function (entity, isFirstPersonArm) {
      if (!isFirstPersonArm) {
        var entities = entity.world().getEntitiesInRangeOf(entity.pos(), 6);
        entities.forEach(otherEntity => {
          var otherVector = otherEntity.eyePos().add(crossProduct(PackLoader.asVec3(0, 1, 0), otherEntity.getLookVector()));
          var factor = entity.eyePos().add(0, 1, 0).distanceTo(otherVector);
          receiveLine.start.y = factor;
          receiveLine.end.y = factor;
          transmitLine.end.y = transmitLine.start.y+factor;
          receiveLine.end.y = receiveLine.start.y-factor;
          var otherPitch = elevation(entity, otherVector.x(), otherVector.y(), otherVector.z());
          var otherYaw = directionAngle(entity, otherVector.x(), otherVector.z());
          transmitBeam.setRotation(-1*otherPitch, 0, entity.rotationInterpolated().x()-otherYaw);
          receiveBeam.setRotation(-1*otherPitch, 0, entity.rotationInterpolated().x()-otherYaw);
          if (factor > 0 && entity.getData("skyhighheroes:dyn/antenna_deploy_timer") == 1) {
            transmitBeam.render();
            receiveBeam.render();
          };
          /* if (hasCyberneticBody(otherEntity) && checkFrequency(entity, otherEntity)) {
            if (entity.world().isUnobstructed(entity.eyePos().add(0, 1, 0), otherEntity.eyePos().add(0, 1, 0)) && entity.getData("skyhighheroes:dyn/antenna_deployed") && otherEntity.getData("skyhighheroes:dyn/antenna_deployed")) {
            };
          }; */
        });
      };
    }
  };
};