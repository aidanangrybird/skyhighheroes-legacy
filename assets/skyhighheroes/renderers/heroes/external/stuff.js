//Flight Trail
function bindFlightTrail(renderer, trailType) {
  var prop = renderer.bindProperty("fiskheroes:trail");
  prop.setTrail(renderer.createResource("TRAIL", trailType));
  prop.setCondition(entity => entity.getData("fiskheroes:flight_boost_timer") > 0);
  return prop;
};

//Speed Trail
function bindSpeedTrail(renderer, trailType) {
  var prop = renderer.bindProperty("fiskheroes:trail");
  prop.setTrail(renderer.createResource("TRAIL", trailType));
  prop.setCondition(entity => entity.getData("fiskheroes:speeding"));
  return prop;
};

function bindCloud(renderer, propertyName, cloudType) {
  return renderer.bindProperty(propertyName).setCloud(renderer.createResource("PARTICLE_CLOUD", cloudType));
}

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

function setOpacityWithData(renderer, min, max, data) {
  renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
    return max + (min - max) * entity.getInterpolatedData(data);
  });
};

//Useful Stuff
function waveWorldCeilingAnimation(renderer) {
  addAnimationEvent(renderer, "CEILING_CRAWL", "skyhighheroes:wave_world_wall_ceiling_stand");
};

function emTeleport(renderer) {
  setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:teleport_timer");
};

function initHoloFlightAnim(renderer, name, value) {
  var anim = renderer.createResource("ANIMATION", value);
  renderer.addCustomAnimation(name, anim);
  anim.setData((entity, data) => data.load(entity.loop(20 * Math.PI) + 0.4));
  anim.priority = -9.5;
  anim.setCondition(entity => (entity.as("DISPLAY").getDisplayType() == "HOLOGRAM"));
  renderer.reprioritizeDefaultAnimation("PUNCH", -9);
  renderer.reprioritizeDefaultAnimation("HOLD_CHRONOS_RIFLE", -9);
  renderer.reprioritizeDefaultAnimation("HOLD_PIZZA", -9);
  renderer.reprioritizeDefaultAnimation("BLOCK_CAPS_SHIELD", -9);
  renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
  return anim;
};

function bindBeam(renderer, propertyName, beam, anchor, color, entries) {
  var prop = renderer.bindProperty(propertyName).setAnchor(anchor);
  var constln = renderer.createResource("BEAM_CONSTELLATION", null);

  for (var i = 0; i < entries.length; ++i) {
      constln.bindBeam(entries[i]);
  }

  if (typeof beam === "string") {
      beam = renderer.createResource("BEAM_RENDERER", beam);
  }

  prop.setConstellation(constln);
  prop.setRenderer(beam);
  prop.color.set(color);
  return prop;
};

/**
 * clamp as in FSK
 * @param timer - input timer
 * @param min - minimum value
 * @param max - maximum
 **/
function clamp(timer, min, max) {
  return Math.min(Math.max(timer, min), max);
};
/**
 * animate as in FSK
 * @param timer - input timer
 * @param duration - duration of frame
 * @param start - start of frame
 **/
function animate(timer, duration, start) {
  return (timer > start && timer <= start + duration) ? ((timer - start) / duration) : 0.0;
};
/**
 * animate2 as in FSK
 * @param timer - input timer
 * @param duration - duration of frame
 * @param start - start of frame
 * @param fadeIn - how long to fade in
 * @param fadeOut - how long to fade out
 **/
function animate2(timer, duration, start, fadeIn, fadeOut) {
  fadeIn = clamp(fadeIn, 0.0, duration);
  fadeOut = clamp(fadeOut, 0.0, duration - fadeIn);
  if (timer >= start && timer <= start + duration) {
    pos = timer - start;
    if (pos < fadeIn) {
      return animate(pos, fadeIn, 0.0);
    };
    if (pos >= duration - fadeOut) {
      return 1.0 - animate(pos, fadeOut, duration - fadeOut);
    };
    return 1.0;
  };
  return 0.0;
};

function formatSuitName(input) {
  var suitID = input.split(":")[1];
  var suitNameParts = suitID.split("_");
  var suitName = "";
  suitNameParts.forEach(part => {
    unit = part.substring(0, 1).toUpperCase() + part.substring(1);
    suitName = suitName + unit + " ";
  });
  return suitName;
};

var hostileEntities = [
  "fiskheroes.Creetle",
  "fiskheroes.Cactus",
  "Zombie",
  "Skeleton",
  "Spider",
  "Creeper",
  "Ghast",
  "Enderman",
  "Slime",
  "Witch",
  "Cave Spider",
  "Silverfish",
  "Blaze",
  "Magma Cube",
  "Zombie Pigman"
];

var friendlyEntities = [
  "Pig",
  "Sheep",
  "Cow",
  "Bat",
  "Squid",
  "Chicken",
  "Villager",
  "Wolf",
  "Mooshroom",
  "Ocelot",
  "Horse",
  "Snow Golem",
  "Iron Golem"
];

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

function entityLocation(renderer) {
  var beamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:entity_location");
  var shapeEntityLocation = renderer.createResource("SHAPE", null);
  var lineEntityLocation = shapeEntityLocation.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [100.0, 100.0] });
  var beamEntityLocation = renderer.createEffect("fiskheroes:lines").setRenderer(beamRenderer).setShape(shapeEntityLocation).setOffset(0.0, 0.0, 0.0);
  beamEntityLocation.mirror = false;
  beamEntityLocation.setScale(16.0);
  beamEntityLocation.anchor.set("head");
  beamEntityLocation.anchor.ignoreAnchor(true);
  beamEntityLocation.color.set(0x000000);

  return {
    render: function (isFirstPersonArm, entity, otherEntity, color) {
      if (isFirstPersonArm) {
        beamEntityLocation.color.set(color);
        var distance = entity.eyePos().distanceTo(otherEntity.pos().x(), otherEntity.pos().y(), otherEntity.pos().z());
        var pitch = (entity.rotationInterpolated().y()/180)*Math.PI + Math.atan2((otherEntity.pos().y()-entity.eyePos().y()), (Math.sqrt(otherEntity.pos().x()^2 + otherEntity.pos().z()^2)-entity.eyePos().xz().distanceTo(otherEntity.pos().x(), otherEntity.pos().z())));
        var yaw = (entity.rotationInterpolated().x()/180)*Math.PI - Math.atan2((otherEntity.pos().z()-entity.eyePos().z()), (otherEntity.pos().x()-entity.eyePos().x()));
        var distanceXZ = entity.eyePos().multiply(1, 0, 1).distanceTo(otherEntity.pos().x(), 0, otherEntity.pos().z());
        var x = distanceXZ*Math.cos(yaw);
        var y = (entity.eyePos().y()-otherEntity.pos().y());
        var z = distanceXZ*Math.sin(yaw);
        lineEntityLocation.start.x = lineEntityLocation.end.x = x;
        lineEntityLocation.start.y = y;
        lineEntityLocation.end.y = y - 3;
        lineEntityLocation.start.z = lineEntityLocation.end.z = z;
        lineEntityLocation.size.x = clamp(distance, 16.0, 1024.0);
        lineEntityLocation.size.y = clamp(distance, 16.0, 1024.0);
        beamEntityLocation.setRotation(-1*entity.rotationInterpolated().y(), 0, 0);
        beamEntityLocation.render();
      };
    }
  };
};

function location(renderer) {
  var beamRenderer = renderer.createResource("BEAM_RENDERER", "skyhighheroes:location");
  var shapeLocation = renderer.createResource("SHAPE", null);
  var lineLocation = shapeLocation.bindLine({ "start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [1.0, 1.0] });
  var beamLocation = renderer.createEffect("fiskheroes:lines").setRenderer(beamRenderer).setShape(shapeLocation).setOffset(0.0, 0.0, 0.0);
  beamLocation.mirror = false;
  beamLocation.setScale(16.0);
  beamLocation.anchor.set("head");
  beamLocation.anchor.ignoreAnchor(true);
  beamLocation.color.set(0x000000);

  return {
    render: function (isFirstPersonArm, entity, posX, posY, posZ, color) {
      if (isFirstPersonArm) {
        beamLocation.color.set(color);
        var distance = entity.eyePos().distanceTo(posX, posY, posZ);
        var pitch = (entity.rotationInterpolated().y()/180)*Math.PI + Math.atan2((posY-entity.eyePos().y()), (Math.sqrt(posX^2 + posZ^2)-entity.eyePos().xz().distanceTo(posX, posZ)));
        var yaw = (entity.rotationInterpolated().x()/180)*Math.PI - Math.atan2((posZ-entity.eyePos().z()), (posX-entity.eyePos().x()));
        var distanceXZ = entity.eyePos().multiply(1, 0, 1).distanceTo(posX, 0, posZ);
        var x = distanceXZ*Math.cos(yaw);
        var y = (entity.eyePos().y()-posY);
        var z = distanceXZ*Math.sin(yaw);
        beamLocation.setRotation(-1*entity.rotationInterpolated().y(), 0, 0); 
        lineLocation.start.x = lineLocation.end.x = x;
        lineLocation.start.y = y + 1;
        lineLocation.end.y = y - 0.0625*clamp(distance, 1.0, 1024.0);;
        lineLocation.start.z = lineLocation.end.z = z;
        lineLocation.size.x = clamp(distance, 16.0, 1024.0);
        lineLocation.size.y = clamp(distance, 16.0, 1024.0);
        beamLocation.render();
      };
    }
  };
};

function getBearing(entity) {
  var rotation = entity.rotationInterpolated().x()%360;
  var bearing = ((Math.abs((rotation < 0) ? (rotation+360) : rotation)+180) % 360);
  return bearing;
};

/**
 * Gets direction from one vector to another
 * @param {JSVector3} base - Base vector
 * @param {JSVector3} other - Vector to measure to
 * @returns Direction
 **/
function direction(base, other) {
  var angle = (((Math.atan2(-1*(other.z()-base.z()), -1*(other.x()-base.x())) * 180) / Math.PI) + 270) % 360;
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

function elevation(entity, posX, posY, posZ) {
  var distance = entity.pos().xz().distanceTo(posX, posZ);
  var vector = PackLoader.asVec2(0, entity.pos().y());
  var angle = 90-vector.angleTo(distance, posY);
  return angle;
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

var chars = ["!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~"];

var charWidths = {
  "!": 1.0,
  "\"": 3.0,
  "#": 5.0,
  "$": 5.0,
  "%": 5.0,
  "&": 5.0,
  "'": 1.0,
  "(": 4.0,
  ")": 4.0,
  "*": 5.0,
  "+": 5.0,
  ",": 1.0,
  "-": 5.0,
  ".": 1.0,
  "/": 5.0,
  "0": 5.0,
  "1": 5.0,
  "2": 5.0,
  "3": 5.0,
  "4": 5.0,
  "5": 5.0,
  "6": 5.0,
  "7": 5.0,
  "8": 5.0,
  "9": 5.0,
  ":": 1.0,
  ";": 1.0,
  "<": 5.0,
  "=": 5.0,
  ">": 5.0,
  "?": 5.0,
  "@": 6.0,
  "A": 5.0,
  "B": 5.0,
  "C": 5.0,
  "D": 5.0,
  "E": 5.0,
  "F": 5.0,
  "G": 5.0,
  "H": 5.0,
  "I": 3.0,
  "J": 5.0,
  "K": 5.0,
  "L": 5.0,
  "M": 5.0,
  "N": 5.0,
  "O": 5.0,
  "P": 5.0,
  "Q": 5.0,
  "R": 5.0,
  "S": 5.0,
  "T": 5.0,
  "U": 5.0,
  "V": 5.0,
  "W": 5.0,
  "X": 5.0,
  "Y": 5.0,
  "Z": 5.0,
  "[": 5.0,
  "\\": 5.0,
  "]": 3.0,
  "^": 5.0,
  "_": 5.0,
  "`": 2.0,
  "a": 5.0,
  "b": 5.0,
  "c": 5.0,
  "d": 5.0,
  "e": 5.0,
  "f": 4.0,
  "g": 5.0,
  "h": 5.0,
  "i": 1.0,
  "j": 5.0,
  "k": 4.0,
  "l": 2.0,
  "m": 5.0,
  "n": 5.0,
  "o": 5.0,
  "p": 5.0,
  "q": 5.0,
  "r": 5.0,
  "s": 5.0,
  "t": 3.0,
  "u": 5.0,
  "v": 5.0,
  "w": 5.0,
  "x": 5.0,
  "y": 5.0,
  "z": 5.0,
  "{": 3.0,
  "|": 1.0,
  "}": 3.0,
  "~": 6.0,
  " ": 4.0,
};

function text(renderer, name) {
  var characterModels = [];
  var index = 0;
  /* if (chars.length != charWidths.length) {
    return;
  }; */
  var texture_name;
  if (typeof name === "string") {
    texture_name = name + "_character";
  } else {
    texture_name = "character"
  };
  for (var char in chars) {
    var character_texture = texture_name + "_" + index.toString();
    var character_model = renderer.createResource("MODEL", "skyhighheroes:Character");
    character_model.texture.set(null, character_texture);
    var character = renderer.createEffect("fiskheroes:model").setModel(character_model);
    character.anchor.set("head");
    character.anchor.ignoreAnchor(true);
    character.setScale(1.0);
    character.setOffset(0.0, 0.0, 0.0);
    characterModels.push(character);
    index = index + 1;
  };
  return {
    renderLine: (isFirstPersonArm, horizontalAlignment, verticalAlignment, text, posX, posY, posZ, scale) => {
      if (isFirstPersonArm && text != null && typeof text === "string") {
        var lines = text.split("\n");
        if (lines.length > 1) {
          this.renderLines(isFirstPersonArm, horizontalAlignment, verticalAlignment, lines, posX, posY, posZ, scale)
        } else {
          var textCharacters = text.toString().split("");
          var currentPosX = 0.0;
          var overallOffsetPosX = 0.0;
          var overallOffsetPosY = 0.0;
          textCharacters.forEach(textCharacter => {
            if (charWidths.hasOwnProperty(textCharacter)) {
              overallOffsetPosX = overallOffsetPosX + charWidths[textCharacter]*scale + 1.0*scale;
            };
          });
          switch (horizontalAlignment.toLowerCase()) {
            case "center":
              overallOffsetPosX = overallOffsetPosX/2;
              break;
            case "left":
              overallOffsetPosX = 0.0;
              break;
            case "right":
              overallOffsetPosX = overallOffsetPosX;
              break;
          };
          switch (verticalAlignment.toLowerCase()) {
            case "center":
              overallOffsetPosY = 0.0;
              break;
            case "top":
              overallOffsetPosY = 5.5;
              break;
            case "bottom":
              overallOffsetPosY = -5.5;
              break;
          };
          textCharacters.forEach(textCharacter => {
            var index = chars.indexOf(textCharacter);
            if (index > -1) {
              var model = characterModels[index];
              model.setRotation(0, 0, 0);
              model.setOffset(posX+currentPosX-overallOffsetPosX, posY+overallOffsetPosY, posZ);
              model.setScale(scale);
              model.render();
              currentPosX = currentPosX + charWidths[textCharacter]*scale + 1.0*scale;
            };
            if (textCharacter == " ") {
              currentPosX = currentPosX + charWidths[textCharacter]*scale + 1.0*scale;
            };
          });
        };
      };
    },
    renderLines: (isFirstPersonArm, horizontalAlignment, verticalAlignment, textArray, posX, posY, posZ, scale) => {
      if (isFirstPersonArm && typeof textArray !== "string") {
        var overallPosY = 0.0;
        var totalHeight = 11.0*((textArray.length-1)*1.0)*scale;
        var overallPosX = 0.0;
        var largestLineLength = 0.0;
        //Overall X position
        textArray.forEach(line => {
          if (line != null) {
            var textCharacters = line.toString().split("");
            var lineLength = 0.0;
            textCharacters.forEach(textCharacter => {
              if (charWidths.hasOwnProperty(textCharacter)) {
                lineLength = lineLength + charWidths[textCharacter]*scale + 1.0*scale;
              };
              if (largestLineLength < lineLength) {
                largestLineLength = lineLength;
              };
            });
          };
        });
        switch (horizontalAlignment.toLowerCase()) {
          case "center":
            overallPosX = largestLineLength/2;
            break;
          case "left":
            overallPosX = 0.0;
            break;
          case "right":
            overallPosX = largestLineLength;
            break;
          default:
            overallPosX = 0.0;
            break;
        };
        switch (verticalAlignment.toLowerCase()) {
          case "center":
            overallPosY = totalHeight/2;
            break;
          case "top":
            overallPosY = 0.0;
            break;
          case "bottom":
            overallPosY = -1*totalHeight;
            break;
          default:
            overallPosY = 0.0;
            break;
        };
        //Per line X position
        var currentPosY = 0.0;
        textArray.forEach(line => {
          if (line != null) {
            var textCharacters = line.toString().split("");
            var currentPosX = 0.0;
            var lineLength = 0.0;
            var linePosX = 0.0;
            textCharacters.forEach(textCharacter => {
              if (charWidths.hasOwnProperty(textCharacter)) {
                lineLength = lineLength + charWidths[textCharacter]*scale + 1.0*scale;
              };
            });
            switch (horizontalAlignment.toLowerCase()) {
              case "center":
                var difference = largestLineLength - lineLength;
                linePosX = difference/2;
                break;
              case "left":
                linePosX = 0.0;
                break;
              case "right":
                var difference = lineLength - largestLineLength;
                linePosX = -1*difference;
                break;
              default:
                linePosX = 0.0;
                break;
            };
            textCharacters.forEach(textCharacter => {
              var index = chars.indexOf(textCharacter);
              if (index > -1) {
                var model = characterModels[index];
                model.setRotation(0, 0, 0);
                model.setOffset(posX+currentPosX-overallPosX+linePosX, posY+currentPosY-overallPosY, posZ);
                model.setScale(scale);
                model.render();
                currentPosX = currentPosX + charWidths[textCharacter]*scale + 1.0*scale;
              };
              if (textCharacter == " ") {
                currentPosX = currentPosX + charWidths[textCharacter]*scale + 1.0*scale;
              };
            });
          };
          currentPosY = currentPosY + 11.0*scale;
        });
      };
    },
    renderLocation: (entity, isFirstPersonArm, text, posX, posY, posZ) => {
      if (isFirstPersonArm && text != null) {
        var textCharacters = text.toString().split("");
        var overallPosX = 0.0;
        var distance = entity.eyePos().distanceTo(posX, posY, posZ);
        var pitch = (entity.rotationInterpolated().y()/180)*Math.PI + Math.atan2((posY-entity.eyePos().y()), (Math.sqrt(posX^2 + posZ^2)-entity.eyePos().xz().distanceTo(posX, posZ)));
        var yaw = (entity.rotationInterpolated().x()/180)*Math.PI - Math.atan2((posZ-entity.eyePos().z()), (posX-entity.eyePos().x()));
        var distanceXZ = entity.eyePos().multiply(1, 0, 1).distanceTo(posX, 0, posZ);
        var x = distanceXZ*Math.cos(yaw);
        var y = (entity.eyePos().y()-posY);
        var z = distanceXZ*Math.sin(yaw);
        var overallOffsetPosX = 0.0;
        var overallPosX = 0.0;
        textCharacters.forEach(textCharacter => {
          if (charWidths.hasOwnProperty(textCharacter)) {
            overallOffsetPosX = overallOffsetPosX + charWidths[textCharacter] + 0.5;
          };
        });
        overallOffsetPosX = overallOffsetPosX/2;
        textCharacters.forEach(textCharacter => {
          var index = chars.indexOf(textCharacter);
          if (index > -1) {
            var model = characterModels[index];
            model.setRotation(0, 0, 0);
            model.setOffset(x+overallPosX-overallOffsetPosX, y, z);
            model.render();
            overallPosX = overallPosX + charWidths[textCharacter] + 0.5;
          };
        });
      };
    },
    renderEntity: (entity, isFirstPersonArm, otherEntity, horizontalAlignment, verticalAlignment, scale) => {
      if (isFirstPersonArm) {
        if (otherEntity.isAlive() && otherEntity.getUUID() != entity.getUUID()) {
          var data = []
          var angle = entity.rotationInterpolated().x()%360;
          var bearing = ((Math.abs((angle < 0) ? (angle+360) : angle)) % 360);
          data.push(otherEntity.getName());
          data.push("Health: " + otherEntity.getHealth());
          var distance = entity.eyePos().distanceTo(otherEntity.pos().x(), otherEntity.pos().y(), otherEntity.pos().z());
          //Yaw difference
          var yaw = (entity.rotationInterpolated().x()/180)*Math.PI - Math.atan2((otherEntity.pos().z()-entity.eyePos().z()), (otherEntity.pos().x()-entity.eyePos().x()));
          //Test yaw difference
          var entityAngle = entity.eyePos().xz().angleTo(otherEntity.pos().xz())+90;
          //var entityBearing = ((Math.abs((entityAngle < 0) ? (entityAngle+360) : entityAngle)) % 360);
          var entityBearing = entityAngle % 360;
          var yawTest = ((bearing - entityBearing) + 360)%180;
          var yawTestRadians = -1*(yawTest/360)*Math.PI;
          //Old Pitch
          var pitch = (entity.rotationInterpolated().y()/180)*Math.PI + Math.atan2((otherEntity.pos().y()-entity.eyePos().y()), (Math.sqrt(otherEntity.pos().x()^2 + otherEntity.pos().z()^2)-entity.eyePos().xz().distanceTo(otherEntity.pos().x(), otherEntity.pos().z())));
          //New Pitch
          //var pitch = (entity.rotationInterpolated().y()/180)*Math.PI - ((Math.cos(yaw)*Math.atan2((otherEntity.pos().y()-entity.eyePos().y()), (otherEntity.pos().x()-entity.eyePos().x()))) - (Math.sin(yaw)*Math.atan2((otherEntity.pos().y()-entity.eyePos().y()), (otherEntity.pos().z()-entity.eyePos().z()))));
          var distanceXZ = entity.eyePos().multiply(1, 0, 1).distanceTo(otherEntity.pos().x(), 0, otherEntity.pos().z());
          var distanceY = entity.eyePos().y()-otherEntity.pos().y();
          var x = -1*(distanceXZ+180)*Math.cos(yaw);
          var y = -1*(180)*Math.sin(pitch);
          var z = (distanceXZ+180)*Math.sin(yaw);
          //data.push("Hud Pos: " + x.toFixed(2) + "," + y.toFixed(2) + "," + z.toFixed(2));
          data.push("Radians yaw difference: " + yaw.toFixed(2));
          data.push("Yaw difference: " + yaw.toFixed(2));
          data.push("Angle to entity: " + entityBearing.toFixed(2));
          //data.push("Pitch difference: " + pitch.toFixed(2));
          var distanceScale = scale + (1/clamp(distance, 1.0, 1024.0))*scale;
          this.renderLines(isFirstPersonArm, horizontalAlignment, verticalAlignment, data, x, y, z, distanceScale);
        };
      };
    }
  };
};

/**
 * Creates screen element
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {string} verticalAlignment - Vertical alignment of element
 * @param {string} horizontalAlignment - Horizontal alignment of element
 * @param {number} sizeX - X value of padding
 * @param {number} sizeY - Y value of padding
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 * @param {object} parentElement - Parent element
 * @param {object} parentElementAnchor - Anchor point from parent element
 **/
function screenElement(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var baseX = 0.0;
  var baseY = 0.0;
  var baseZ = 0.0;
  var baseSizeX = 0.0;
  var baseSizeY = 0.0;
  var parentX = 0.0;
  var parentY = 0.0;
  var parentZ = 0.0;
  var parentAnchorX = 0.0;
  var parentAnchorY = 0.0;
  var sizeCorrectionX = 0.0;
  var sizeCorrectionY = 0.0;
  var parentSizeX = 0.0;
  var parentSizeY = 0.0;
  var parentScreenElement = null;
  var parentAnchor = null;
  var parentCubeOffset = null;
  if (typeof parentElement === "object") {
    parentScreenElement = parentElement;
  };
  if (parentScreenElement != null) {
    parentX = parentScreenElement.x;
    parentY = parentScreenElement.y;
    parentZ = parentScreenElement.z;
    parentSizeX = parentScreenElement.sizeX;
    parentSizeY = parentScreenElement.sizeY;
    var parentAnchor = parentElementAnchor;
    var parentCubeOffset = parentScreenElement.modelResource.getCubeOffset("base");
  };
  if (parentAnchor != null) {
    switch (parentAnchor.toLowerCase()) {
      case "topleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "centerleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "center":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "centerright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "bottomleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
    };
  };
  if (typeof sizeX === "string") {
    if (sizeX.endsWith("pw")) {
      var value = sizeX.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeX*(percent/100.0);
    };
    if (sizeX.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeY*(percent/100.0);
    };
    if (sizeX.endsWith("pmw")) {
      var margin = parseFloat(sizeX.split("pmw")[0])*2;
      baseSizeX = parentSizeX-margin;
    };
    if (sizeX.endsWith("pmh")) {
      var margin = parseFloat(sizeX.split("pmh")[0])*2;
      baseSizeX = parentSizeY-margin;
    };
  } else {
    baseSizeX = sizeX;
  };
  if (typeof sizeY === "string") {
    if (sizeY.endsWith("pw")) {
      var value = sizeY.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeX*(percent/100.0);
    };
    if (sizeY.endsWith("ph")) {
      var value = sizeY.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeY*(percent/100.0);
    };
    if (sizeY.endsWith("pmw")) {
      var margin = parseFloat(sizeY.split("pmw")[0])*2;
      baseSizeY = parentSizeX-margin;
    };
    if (sizeY.endsWith("pmh")) {
      var margin = parseFloat(sizeY.split("pmh")[0])*2;
      baseSizeY = parentSizeY-margin;
    };
  } else {
    baseSizeY = sizeY;
  };
  switch (horizontalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionX = 0.0;
      break;
    case "left":
      sizeCorrectionX = 1*(baseSizeX/2);
      break;
    case "right":
      sizeCorrectionX = -1*(baseSizeX/2);
      break;
  };
  switch (verticalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionY = 0.0;
      break;
    case "top":
      sizeCorrectionY = 1*(baseSizeY/2);
      break;
    case "bottom":
      sizeCorrectionY = -1*(baseSizeY/2);
      break;
  };
  var screen_element = renderer.createResource("MODEL", "skyhighheroes:Pixel");
  screen_element.texture.set(null, "screen_" + elementName);
  var screen_element_model = renderer.createEffect("fiskheroes:model").setModel(screen_element);
  if (parentCubeOffset != null) {
    screen_element_model.anchor.set("head", parentCubeOffset);
  } else {
    screen_element_model.anchor.set("head");
  };
  screen_element_model.anchor.ignoreAnchor(true);
  screen_element_model.setRotation(0, 0, 0);
  screen_element_model.setScale(baseSizeX, baseSizeY, 1.0);
  if (typeof offsetX === "string") {
    var fraction = offsetX.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetX = parentSizeX*(percent/100.0);
  };
  if (typeof offsetY === "string") {
    var fraction = offsetY.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetY = parentSizeY*(percent/100.0);
  };
  baseX = offsetX+sizeCorrectionX+parentAnchorX;
  baseY = offsetY+sizeCorrectionY+parentAnchorY;
  baseZ = offsetZ+parentZ;
  screen_element_model.setOffset(baseX, baseY, baseZ);
  baseZ = offsetZ+parentZ+0.02;
  var leftXBound = baseX-(baseSizeX/2);
  var centerX = baseX;
  var rightXBound = baseX+(baseSizeX/2);
  var topYBound = baseY-(baseSizeY/2);
  var centerY = baseY;
  var bottomYBound = baseY+(baseSizeY/2);
  return {
    modelResource: screen_element,
    modelEffect: screen_element_model,
    x: baseX,
    y: baseY,
    z: baseZ,
    sizeX: baseSizeX,
    sizeY: baseSizeY,
    leftX: leftXBound,
    centerX: centerX,
    rightX: rightXBound,
    topY: topYBound,
    centerY: centerY,
    bottomY: bottomYBound,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        screen_element_model.render();
      };
    }
  };
};

/**
 * Creates screen element
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {string} verticalAlignment - Vertical alignment of element
 * @param {string} horizontalAlignment - Horizontal alignment of element
 * @param {number} sizeX - X value of padding
 * @param {number} sizeY - Y value of padding
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 * @param {object} parentElement - Parent element
 * @param {object} parentElementAnchor - Anchor point from parent element
 **/
function screenElementAvatar(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var baseX = 0.0;
  var baseY = 0.0;
  var baseZ = 0.0;
  var baseSizeX = 0.0;
  var baseSizeY = 0.0;
  var parentX = 0.0;
  var parentY = 0.0;
  var parentZ = 0.0;
  var parentAnchorX = 0.0;
  var parentAnchorY = 0.0;
  var sizeCorrectionX = 0.0;
  var sizeCorrectionY = 0.0;
  var parentSizeX = 0.0;
  var parentSizeY = 0.0;
  var parentScreenElement = null;
  var parentAnchor = null;
  var parentCubeOffset = null;
  if (typeof parentElement === "object") {
    parentScreenElement = parentElement;
  };
  if (parentScreenElement != null) {
    parentX = parentScreenElement.x;
    parentY = parentScreenElement.y;
    parentZ = parentScreenElement.z;
    parentSizeX = parentScreenElement.sizeX;
    parentSizeY = parentScreenElement.sizeY;
    var parentAnchor = parentElementAnchor;
    var parentCubeOffset = parentScreenElement.modelResource.getCubeOffset("base");
  };
  if (parentAnchor != null) {
    switch (parentAnchor.toLowerCase()) {
      case "topleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "centerleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "center":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "centerright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "bottomleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
    };
  };
  if (typeof sizeX === "string") {
    if (sizeX.endsWith("pw")) {
      var value = sizeX.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeX*(percent/100.0);
    };
    if (sizeX.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeY*(percent/100.0);
    };
    if (sizeX.endsWith("pmw")) {
      var margin = parseFloat(sizeX.split("pmw")[0]);
      baseSizeX = parentSizeX-margin;
    };
    if (sizeX.endsWith("pmh")) {
      var margin = parseFloat(sizeX.split("pmh")[0]);
      baseSizeX = parentSizeY-margin;
    };
  } else {
    baseSizeX = sizeX;
  };
  if (typeof sizeY === "string") {
    if (sizeY.endsWith("pw")) {
      var value = sizeY.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeX*(percent/100.0);
    };
    if (sizeY.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeY*(percent/100.0);
    };
    if (sizeY.endsWith("pmw")) {
      var margin = parseFloat(sizeY.split("pmw")[0]);
      baseSizeY = parentSizeX-margin;
    };
    if (sizeY.endsWith("pmh")) {
      var margin = parseFloat(sizeY.split("pmh")[0]);
      baseSizeY = parentSizeY-margin;
    };
  } else {
    baseSizeY = sizeY;
  };
  baseSizeX = baseSizeX/8.0;
  baseSizeY = baseSizeY/8.0;
  switch (horizontalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionX = 0.0;
      break;
    case "left":
      sizeCorrectionX = 1*(baseSizeX/2);
      break;
    case "right":
      sizeCorrectionX = -1*(baseSizeX/2);
      break;
  };
  switch (verticalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionY = 0.0;
      break;
    case "top":
      sizeCorrectionY = 1*(baseSizeY/2);
      break;
    case "bottom":
      sizeCorrectionY = -1*(baseSizeY/2);
      break;
  };
  var screen_element = renderer.createResource("MODEL", "skyhighheroes:PixelAvatar");
  screen_element.texture.set(null, "avatar_" + elementName);
  var screen_element_model = renderer.createEffect("fiskheroes:model").setModel(screen_element);
  if (parentCubeOffset != null) {
    screen_element_model.anchor.set("head", parentCubeOffset);
  } else {
    screen_element_model.anchor.set("head");
  };
  screen_element_model.anchor.ignoreAnchor(true);
  screen_element_model.setRotation(0, 0, 0);
  screen_element_model.setScale(baseSizeX, baseSizeY, 1.0);
  if (typeof offsetX === "string") {
    var fraction = offsetX.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetX = parentSizeX*(percent/100.0);
  };
  if (typeof offsetY === "string") {
    var fraction = offsetY.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetY = parentSizeY*(percent/100.0);
  };
  baseX = offsetX+sizeCorrectionX+parentAnchorX;
  baseY = offsetY+sizeCorrectionY+parentAnchorY;
  baseZ = offsetZ+parentZ;
  screen_element_model.setOffset(baseX, baseY, baseZ);
  baseZ = offsetZ+parentZ+0.02;
  var leftXBound = baseX-(baseSizeX/2);
  var centerX = baseX;
  var rightXBound = baseX+(baseSizeX/2);
  var topYBound = baseY-(baseSizeY/2);
  var centerY = baseY;
  var bottomYBound = baseY+(baseSizeY/2);
  return {
    modelResource: screen_element,
    modelEffect: screen_element_model,
    x: baseX,
    y: baseY,
    z: baseZ,
    sizeX: baseSizeX,
    sizeY: baseSizeY,
    leftX: leftXBound,
    centerX: centerX,
    rightX: rightXBound,
    topY: topYBound,
    centerY: centerY,
    bottomY: bottomYBound,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        screen_element_model.render();
      };
    }
  };
};

/**
 * Creates screen element
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {string} verticalAlignment - Vertical alignment of element
 * @param {string} horizontalAlignment - Horizontal alignment of element
 * @param {number} sizeX - X value of padding
 * @param {number} sizeY - Y value of padding
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 * @param {object} parentElement - Parent element
 * @param {object} parentElementAnchor - Anchor point from parent element
 **/
function screenElementHead(renderer, elementName, verticalAlignment, horizontalAlignment, size, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var sizeX = size;
  var sizeY = size;
  var baseX = 0.0;
  var baseY = 0.0;
  var baseZ = 0.0;
  var baseSizeX = 0.0;
  var baseSizeY = 0.0;
  var parentX = 0.0;
  var parentY = 0.0;
  var parentZ = 0.0;
  var parentAnchorX = 0.0;
  var parentAnchorY = 0.0;
  var sizeCorrectionX = 0.0;
  var sizeCorrectionY = 0.0;
  var parentSizeX = 0.0;
  var parentSizeY = 0.0;
  var parentScreenElement = null;
  var parentAnchor = null;
  var parentCubeOffset = null;
  if (typeof parentElement === "object") {
    parentScreenElement = parentElement;
  };
  if (parentScreenElement != null) {
    parentX = parentScreenElement.x;
    parentY = parentScreenElement.y;
    parentZ = parentScreenElement.z;
    parentSizeX = parentScreenElement.sizeX;
    parentSizeY = parentScreenElement.sizeY;
    var parentAnchor = parentElementAnchor;
    var parentCubeOffset = parentScreenElement.modelResource.getCubeOffset("base");
  };
  if (parentAnchor != null) {
    switch (parentAnchor.toLowerCase()) {
      case "topleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "centerleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "center":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "centerright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "bottomleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
    };
  };
  if (typeof sizeX === "string") {
    if (sizeX.endsWith("pw")) {
      var value = sizeX.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeX*(percent/100.0);
    };
    if (sizeX.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeY*(percent/100.0);
    };
    if (sizeX.endsWith("pmw")) {
      var margin = parseFloat(sizeX.split("pmw")[0]);
      baseSizeX = parentSizeX-margin;
    };
    if (sizeX.endsWith("pmh")) {
      var margin = parseFloat(sizeX.split("pmh")[0]);
      baseSizeX = parentSizeY-margin;
    };
  } else {
    baseSizeX = sizeX;
  };
  if (typeof sizeY === "string") {
    if (sizeY.endsWith("pw")) {
      var value = sizeY.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeX*(percent/100.0);
    };
    if (sizeY.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeY*(percent/100.0);
    };
    if (sizeY.endsWith("pmw")) {
      var margin = parseFloat(sizeY.split("pmw")[0]);
      baseSizeY = parentSizeX-margin;
    };
    if (sizeY.endsWith("pmh")) {
      var margin = parseFloat(sizeY.split("pmh")[0]);
      baseSizeY = parentSizeY-margin;
    };
  } else {
    baseSizeY = sizeY;
  };
  baseSizeX = baseSizeX/16.0;
  baseSizeY = baseSizeY/16.0;
  switch (horizontalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionX = 0.0;
      break;
    case "left":
      sizeCorrectionX = 1*(baseSizeX/2);
      break;
    case "right":
      sizeCorrectionX = -1*(baseSizeX/2);
      break;
  };
  switch (verticalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionY = 0.0;
      break;
    case "top":
      sizeCorrectionY = 1*(baseSizeY/2);
      break;
    case "bottom":
      sizeCorrectionY = -1*(baseSizeY/2);
      break;
  };
  var screen_element = renderer.createResource("MODEL", "skyhighheroes:PixelHead");
  screen_element.texture.set(null, "display_" + elementName);
  var screen_element_model = renderer.createEffect("fiskheroes:model").setModel(screen_element);
  if (parentCubeOffset != null) {
    screen_element_model.anchor.set("head", parentCubeOffset);
  } else {
    screen_element_model.anchor.set("head");
  };
  screen_element_model.anchor.ignoreAnchor(true);
  screen_element_model.setRotation(0, 0, 0);
  screen_element_model.setScale(baseSizeX, baseSizeY, 1.0);
  if (typeof offsetX === "string") {
    var fraction = offsetX.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetX = parentSizeX*(percent/100.0);
  };
  if (typeof offsetY === "string") {
    var fraction = offsetY.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetY = parentSizeY*(percent/100.0);
  };
  baseX = offsetX+sizeCorrectionX+parentAnchorX;
  baseY = offsetY+sizeCorrectionY+parentAnchorY;
  baseZ = offsetZ+parentZ;
  screen_element_model.setOffset(baseX, baseY, baseZ);
  baseZ = offsetZ+parentZ+0.02;
  var leftXBound = baseX-(baseSizeX/2);
  var centerX = baseX;
  var rightXBound = baseX+(baseSizeX/2);
  var topYBound = baseY-(baseSizeY/2);
  var centerY = baseY;
  var bottomYBound = baseY+(baseSizeY/2);
  return {
    modelResource: screen_element,
    modelEffect: screen_element_model,
    x: baseX,
    y: baseY,
    z: baseZ,
    sizeX: baseSizeX,
    sizeY: baseSizeY,
    leftX: leftXBound,
    centerX: centerX,
    rightX: rightXBound,
    topY: topYBound,
    centerY: centerY,
    bottomY: bottomYBound,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        screen_element_model.render();
      };
    }
  };
};

/**
 * Creates screen element
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {string} verticalAlignment - Vertical alignment of element
 * @param {string} horizontalAlignment - Horizontal alignment of element
 * @param {number} sizeX - X value of padding
 * @param {number} sizeY - Y value of padding
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 * @param {object} parentElement - Parent element
 * @param {object} parentElementAnchor - Anchor point from parent element
 **/
function screenElementBody(renderer, elementName, verticalAlignment, horizontalAlignment, size, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var sizeX = size;
  var sizeY = size;
  var baseX = 0.0;
  var baseY = 0.0;
  var baseZ = 0.0;
  var baseSizeX = 0.0;
  var baseSizeY = 0.0;
  var parentX = 0.0;
  var parentY = 0.0;
  var parentZ = 0.0;
  var parentAnchorX = 0.0;
  var parentAnchorY = 0.0;
  var sizeCorrectionX = 0.0;
  var sizeCorrectionY = 0.0;
  var parentSizeX = 0.0;
  var parentSizeY = 0.0;
  var parentScreenElement = null;
  var parentAnchor = null;
  var parentCubeOffset = null;
  if (typeof parentElement === "object") {
    parentScreenElement = parentElement;
  };
  if (parentScreenElement != null) {
    parentX = parentScreenElement.x;
    parentY = parentScreenElement.y;
    parentZ = parentScreenElement.z;
    parentSizeX = parentScreenElement.sizeX;
    parentSizeY = parentScreenElement.sizeY;
    var parentAnchor = parentElementAnchor;
    var parentCubeOffset = parentScreenElement.modelResource.getCubeOffset("base");
  };
  if (parentAnchor != null) {
    switch (parentAnchor.toLowerCase()) {
      case "topleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "centerleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "center":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "centerright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "bottomleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
    };
  };
  if (typeof sizeX === "string") {
    if (sizeX.endsWith("pw")) {
      var value = sizeX.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeX*(percent/100.0);
    };
    if (sizeX.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeY*(percent/100.0);
    };
    if (sizeX.endsWith("pmw")) {
      var margin = parseFloat(sizeX.split("pmw")[0]);
      baseSizeX = parentSizeX-margin;
    };
    if (sizeX.endsWith("pmh")) {
      var margin = parseFloat(sizeX.split("pmh")[0]);
      baseSizeX = parentSizeY-margin;
    };
  } else {
    baseSizeX = sizeX;
  };
  if (typeof sizeY === "string") {
    if (sizeY.endsWith("pw")) {
      var value = sizeY.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeX*(percent/100.0);
    };
    if (sizeY.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeY*(percent/100.0);
    };
    if (sizeY.endsWith("pmw")) {
      var margin = parseFloat(sizeY.split("pmw")[0]);
      baseSizeY = parentSizeX-margin;
    };
    if (sizeY.endsWith("pmh")) {
      var margin = parseFloat(sizeY.split("pmh")[0]);
      baseSizeY = parentSizeY-margin;
    };
  } else {
    baseSizeY = sizeY;
  };
  baseSizeX = baseSizeX/16.0;
  baseSizeY = baseSizeY/16.0;
  switch (horizontalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionX = 0.0;
      break;
    case "left":
      sizeCorrectionX = 1*(baseSizeX/2);
      break;
    case "right":
      sizeCorrectionX = -1*(baseSizeX/2);
      break;
  };
  switch (verticalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionY = 0.0;
      break;
    case "top":
      sizeCorrectionY = 1*(baseSizeY/2);
      break;
    case "bottom":
      sizeCorrectionY = -1*(baseSizeY/2);
      break;
  };
  var screen_element = renderer.createResource("MODEL", "skyhighheroes:PixelBody");
  screen_element.texture.set(null, "display_" + elementName);
  var screen_element_model = renderer.createEffect("fiskheroes:model").setModel(screen_element);
  if (parentCubeOffset != null) {
    screen_element_model.anchor.set("head", parentCubeOffset);
  } else {
    screen_element_model.anchor.set("head");
  };
  screen_element_model.anchor.ignoreAnchor(true);
  screen_element_model.setRotation(0, 0, 0);
  screen_element_model.setScale(baseSizeX, baseSizeY, 1.0);
  if (typeof offsetX === "string") {
    var fraction = offsetX.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetX = parentSizeX*(percent/100.0);
  };
  if (typeof offsetY === "string") {
    var fraction = offsetY.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetY = parentSizeY*(percent/100.0);
  };
  baseX = offsetX+sizeCorrectionX+parentAnchorX;
  baseY = offsetY+sizeCorrectionY+parentAnchorY;
  baseZ = offsetZ+parentZ;
  screen_element_model.setOffset(baseX, baseY, baseZ);
  baseZ = offsetZ+parentZ+0.02;
  var leftXBound = baseX-(baseSizeX/2);
  var centerX = baseX;
  var rightXBound = baseX+(baseSizeX/2);
  var topYBound = baseY-(baseSizeY/2);
  var centerY = baseY;
  var bottomYBound = baseY+(baseSizeY/2);
  return {
    modelResource: screen_element,
    modelEffect: screen_element_model,
    x: baseX,
    y: baseY,
    z: baseZ,
    sizeX: baseSizeX,
    sizeY: baseSizeY,
    leftX: leftXBound,
    centerX: centerX,
    rightX: rightXBound,
    topY: topYBound,
    centerY: centerY,
    bottomY: bottomYBound,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        screen_element_model.render();
      };
    }
  };
};
/**
 * Creates screen element
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {string} verticalAlignment - Vertical alignment of element
 * @param {string} horizontalAlignment - Horizontal alignment of element
 * @param {number} sizeX - X value of padding
 * @param {number} sizeY - Y value of padding
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 * @param {object} parentElement - Parent element
 * @param {object} parentElementAnchor - Anchor point from parent element
 **/
function screenElementLimb(renderer, elementName, verticalAlignment, horizontalAlignment, size, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var sizeX = size;
  var sizeY = size;
  var baseX = 0.0;
  var baseY = 0.0;
  var baseZ = 0.0;
  var baseSizeX = 0.0;
  var baseSizeY = 0.0;
  var parentX = 0.0;
  var parentY = 0.0;
  var parentZ = 0.0;
  var parentAnchorX = 0.0;
  var parentAnchorY = 0.0;
  var sizeCorrectionX = 0.0;
  var sizeCorrectionY = 0.0;
  var parentSizeX = 0.0;
  var parentSizeY = 0.0;
  var parentScreenElement = null;
  var parentAnchor = null;
  var parentCubeOffset = null;
  if (typeof parentElement === "object") {
    parentScreenElement = parentElement;
  };
  if (parentScreenElement != null) {
    parentX = parentScreenElement.x;
    parentY = parentScreenElement.y;
    parentZ = parentScreenElement.z;
    parentSizeX = parentScreenElement.sizeX;
    parentSizeY = parentScreenElement.sizeY;
    var parentAnchor = parentElementAnchor;
    var parentCubeOffset = parentScreenElement.modelResource.getCubeOffset("base");
  };
  if (parentAnchor != null) {
    switch (parentAnchor.toLowerCase()) {
      case "topleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "topright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.topY;
        break;
      case "centerleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "center":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "centerright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.centerY;
        break;
      case "bottomleft":
        parentAnchorX = parentScreenElement.leftX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomcenter":
        parentAnchorX = parentScreenElement.centerX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
      case "bottomright":
        parentAnchorX = parentScreenElement.rightX;
        parentAnchorY = parentScreenElement.bottomY;
        break;
    };
  };  if (typeof sizeX === "string") {
    if (sizeX.endsWith("pw")) {
      var value = sizeX.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeX*(percent/100.0);
    };
    if (sizeX.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeX = parentSizeY*(percent/100.0);
    };
    if (sizeX.endsWith("pmw")) {
      var margin = parseFloat(sizeX.split("pmw")[0]);
      baseSizeX = parentSizeX-margin;
    };
    if (sizeX.endsWith("pmh")) {
      var margin = parseFloat(sizeX.split("pmh")[0]);
      baseSizeX = parentSizeY-margin;
    };
  } else {
    baseSizeX = sizeX;
  };
  if (typeof sizeY === "string") {
    if (sizeY.endsWith("pw")) {
      var value = sizeY.split("pw")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeX*(percent/100.0);
    };
    if (sizeY.endsWith("ph")) {
      var value = sizeX.split("ph")[0];
      var fraction = value.split("/");
      var percent = 0.0;
      if (fraction.length > 1) {
        var numerator = parseInt(fraction[0]);
        var denominator = parseInt(fraction[1]);
        percent = (numerator/denominator)*100.0;
      } else {
        percent = parseFloat(fraction[0]);
      };
      baseSizeY = parentSizeY*(percent/100.0);
    };
    if (sizeY.endsWith("pmw")) {
      var margin = parseFloat(sizeY.split("pmw")[0]);
      baseSizeY = parentSizeX-margin;
    };
    if (sizeY.endsWith("pmh")) {
      var margin = parseFloat(sizeY.split("pmh")[0]);
      baseSizeY = parentSizeY-margin;
    };
  } else {
    baseSizeY = sizeY;
  };
  baseSizeX = baseSizeX/16.0;
  baseSizeY = baseSizeY/16.0;
  switch (horizontalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionX = 0.0;
      break;
    case "left":
      sizeCorrectionX = 1*(baseSizeX/2);
      break;
    case "right":
      sizeCorrectionX = -1*(baseSizeX/2);
      break;
  };
  switch (verticalAlignment.toLowerCase()) {
    case "center":
      sizeCorrectionY = 0.0;
      break;
    case "top":
      sizeCorrectionY = 1*(baseSizeY/2);
      break;
    case "bottom":
      sizeCorrectionY = -1*(baseSizeY/2);
      break;
  };
  var screen_element = renderer.createResource("MODEL", "skyhighheroes:PixelLimb");
  screen_element.texture.set(null, "display_" + elementName);
  var screen_element_model = renderer.createEffect("fiskheroes:model").setModel(screen_element);
  if (parentCubeOffset != null) {
    screen_element_model.anchor.set("head", parentCubeOffset);
  } else {
    screen_element_model.anchor.set("head");
  };
  screen_element_model.anchor.ignoreAnchor(true);
  screen_element_model.setRotation(0, 0, 0);
  screen_element_model.setScale(baseSizeX, baseSizeY, 1.0);
  if (typeof offsetX === "string") {
    var fraction = offsetX.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetX = parentSizeX*(percent/100.0);
  };
  if (typeof offsetY === "string") {
    var fraction = offsetY.split("/");
    var percent = 0.0;
    if (fraction.length > 1) {
      var numerator = parseInt(fraction[0]);
      var denominator = parseInt(fraction[1]);
      percent = (numerator/denominator)*100.0;
    } else {
      percent = parseFloat(fraction[0]);
    };
    offsetY = parentSizeY*(percent/100.0);
  };
  baseX = offsetX+sizeCorrectionX+parentAnchorX;
  baseY = offsetY+sizeCorrectionY+parentAnchorY;
  baseZ = offsetZ+parentZ;
  screen_element_model.setOffset(baseX, baseY, baseZ);
  baseZ = offsetZ+parentZ+0.02;
  var leftXBound = baseX-(baseSizeX/2);
  var centerX = baseX;
  var rightXBound = baseX+(baseSizeX/2);
  var topYBound = baseY-(baseSizeY/2);
  var centerY = baseY;
  var bottomYBound = baseY+(baseSizeY/2);
  return {
    modelResource: screen_element,
    modelEffect: screen_element_model,
    x: baseX,
    y: baseY,
    z: baseZ,
    sizeX: baseSizeX,
    sizeY: baseSizeY,
    leftX: leftXBound,
    centerX: centerX,
    rightX: rightXBound,
    topY: topYBound,
    centerY: centerY,
    bottomY: bottomYBound,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        screen_element_model.render();
      };
    }
  };
};

/**
 * Creates vertical scroll bar
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {number} paddingX - X value of padding
 * @param {number} paddingY - Y value of padding
 * @param {number} sizeX - X value of size
 * @param {number} sizeY - Y value of size
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 **/
function screenVerticalScrollBar(renderer, elementName, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var paddingX = 2.0;
  var paddingY = 2.0;
  var scrollBarBase = screenElement(renderer, elementName+"_outer", "center", "center", sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  var originalBarSizeX = scrollBarBase.sizeX-paddingX;
  var originalBarSizeY = scrollBarBase.sizeY-paddingY;
  var scrollBarBaseMiddle = screenElement(renderer, elementName+"_middle", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarBase, "center");
  var scrollBarBaseInner = screenElement(renderer, elementName+"_inner", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, scrollBarBaseMiddle, "center");
  //Bar
  var scrollBarOuter = screenElement(renderer, elementName+"_bar_outer", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarBaseMiddle, "center");
  var scrollBarInner = screenElement(renderer, elementName+"_bar_inner", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarOuter, "center");
  var originalBarX = scrollBarOuter.x;
  var originalBarY = scrollBarOuter.y;
  var originalBarTop = scrollBarOuter.topY;
  var originalBarBottom = scrollBarOuter.bottomY;
  return {
    baseModel: scrollBarBase.modelEffect,
    baseModelX: scrollBarBase.x,
    baseModelY: scrollBarBase.y,
    baseModelZ: scrollBarBase.z,
    baseModelSizeX: scrollBarBase.sizeX,
    baseModelSizeY: scrollBarBase.sizeY,
    barModel: scrollBarOuter.modelEffect,
    barModelX: scrollBarOuter.x,
    barModelY: scrollBarOuter.y,
    barModelZ: scrollBarOuter.z,
    barModelSizeX: scrollBarOuter.sizeX,
    barModelSizeY: scrollBarOuter.sizeY,
    render: (isFirstPersonArm, selected, total) => {
      if (isFirstPersonArm) {
        var selectedValue = selected;
        var totalValue = ((total == 0) ? 1 : total);
        var barSize = originalBarSizeY/((total == 0) ? 1 : (total+1));
        var barTopLimit = originalBarTop-(paddingY/2)+(barSize/2);
        var barBottomLimit = originalBarBottom+(paddingY/2)-(barSize/2);
        var barSpace = Math.abs(barTopLimit-barBottomLimit);
        scrollBarBase.render(isFirstPersonArm);
        scrollBarBaseMiddle.render(isFirstPersonArm);
        scrollBarBaseInner.render(isFirstPersonArm);
        scrollBarOuter.modelEffect.setScale(originalBarSizeX, barSize, 1.0);
        scrollBarInner.modelEffect.setScale(originalBarSizeX-3.0, barSize-3.0, 1.0);
        var progress = (barTopLimit)+(barSpace*(selectedValue/totalValue));
        scrollBarOuter.modelEffect.setOffset(originalBarX, progress, scrollBarOuter.z);
        scrollBarInner.modelEffect.setOffset(originalBarX, progress, scrollBarOuter.z+0.01);
        scrollBarOuter.render(isFirstPersonArm);
        scrollBarInner.render(isFirstPersonArm);
      };
    }
  };
};
/**
 * Creates vertical scroll bar
 * @param {JSHeroRenderer} renderer - Hero renderer
 * @param {string} elementName - Name of screen element
 * @param {number} paddingX - X value of padding
 * @param {number} paddingY - Y value of padding
 * @param {number} sizeX - X value of size
 * @param {number} sizeY - Y value of size
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @param {number} offsetZ - Z offset
 **/
function screenVerticalScrollBar(renderer, elementName, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var paddingX = 2.0;
  var paddingY = 2.0;
  var scrollBarBase = screenElement(renderer, elementName+"_outer", "center", "center", sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  var originalBarSizeX = scrollBarBase.sizeX-paddingX;
  var originalBarSizeY = scrollBarBase.sizeY-paddingY;
  var scrollBarBaseMiddle = screenElement(renderer, elementName+"_middle", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarBase, "center");
  var scrollBarBaseInner = screenElement(renderer, elementName+"_inner", "center", "center", "2.5pmw", "2.5pmh", 0.0, 0.0, 0.0, scrollBarBaseMiddle, "center");
  //Bar
  var scrollBarOuter = screenElement(renderer, elementName+"_bar_outer", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarBaseMiddle, "center");
  var scrollBarInner = screenElement(renderer, elementName+"_bar_inner", "center", "center", "1pmw", "1pmh", 0.0, 0.0, 0.0, scrollBarOuter, "center");
  var originalBarX = scrollBarOuter.x;
  var originalBarY = scrollBarOuter.y;
  var originalBarTop = scrollBarOuter.topY;
  var originalBarBottom = scrollBarOuter.bottomY;
  return {
    baseModel: scrollBarBase.modelEffect,
    baseModelX: scrollBarBase.x,
    baseModelY: scrollBarBase.y,
    baseModelZ: scrollBarBase.z,
    baseModelSizeX: scrollBarBase.sizeX,
    baseModelSizeY: scrollBarBase.sizeY,
    barModel: scrollBarOuter.modelEffect,
    barModelX: scrollBarOuter.x,
    barModelY: scrollBarOuter.y,
    barModelZ: scrollBarOuter.z,
    barModelSizeX: scrollBarOuter.sizeX,
    barModelSizeY: scrollBarOuter.sizeY,
    render: (isFirstPersonArm, selected, total) => {
      if (isFirstPersonArm) {
        var selectedValue = selected;
        var totalValue = ((total == 0) ? 1 : total);
        var barSize = originalBarSizeY/((total == 0) ? 1 : (total+1));
        var barTopLimit = originalBarTop-(paddingY/2)+(barSize/2);
        var barBottomLimit = originalBarBottom+(paddingY/2)-(barSize/2);
        var barSpace = Math.abs(barTopLimit-barBottomLimit);
        scrollBarBase.render(isFirstPersonArm);
        scrollBarBaseMiddle.render(isFirstPersonArm);
        scrollBarBaseInner.render(isFirstPersonArm);
        scrollBarOuter.modelEffect.setScale(originalBarSizeX, barSize, 1.0);
        scrollBarInner.modelEffect.setScale(originalBarSizeX-3.0, barSize-3.0, 1.0);
        var progress = (barTopLimit)+(barSpace*(selectedValue/totalValue));
        scrollBarOuter.modelEffect.setOffset(originalBarX, progress, scrollBarOuter.z);
        scrollBarInner.modelEffect.setOffset(originalBarX, progress, scrollBarOuter.z+0.01);
        scrollBarOuter.render(isFirstPersonArm);
        scrollBarInner.render(isFirstPersonArm);
      };
    }
  };
};

function screenSelectorTranser(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var selector = screenElement(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  return {
    modelResource: selector.modelResource,
    modelEffect: selector.modelEffect,
    x: selector.x,
    y: selector.y,
    z: selector.z,
    sizeX: selector.baseSizeX,
    sizeY: selector.baseSizeY,
    leftX: selector.leftX,
    centerX: selector.centerX,
    rightX: selector.rightX,
    topY: selector.topY,
    centerY: selector.centerY,
    bottomY: selector.bottomY,
    render: (entity, isFirstPersonArm, change) => {
      if (isFirstPersonArm) {
        var timer = entity.loop(10);
        var value = change*animate2(timer, 1.0, 0.0, 0.7, 0.3);
        selector.modelEffect.setOffset(selector.x+change-value, selector.y, selector.z);
        selector.render(isFirstPersonArm);
      };
    }
  };
};

function screenSelector(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var selector = screenElement(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  return {
    modelResource: selector.modelResource,
    modelEffect: selector.modelEffect,
    x: selector.x,
    y: selector.y,
    z: selector.z,
    sizeX: selector.baseSizeX,
    sizeY: selector.baseSizeY,
    leftX: selector.leftX,
    centerX: selector.centerX,
    rightX: selector.rightX,
    topY: selector.topY,
    centerY: selector.centerY,
    bottomY: selector.bottomY,
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        selector.render(isFirstPersonArm);
      };
    }
  };
};

function screenStatusLight(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var statusOn = screenElement(renderer, elementName + "_on", verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  var statusOff = screenElement(renderer, elementName + "_off", verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  return {
    modelResource: statusOff.modelResource,
    modelEffect: statusOff.modelEffect,
    x: statusOff.x,
    y: statusOff.y,
    z: statusOff.z,
    sizeX: statusOff.baseSizeX,
    sizeY: statusOff.baseSizeY,
    leftX: statusOff.leftX,
    centerX: statusOff.centerX,
    rightX: statusOff.rightX,
    topY: statusOff.topY,
    centerY: statusOff.centerY,
    bottomY: statusOff.bottomY,
    render: (entity, isFirstPersonArm, variable) => {
      if (isFirstPersonArm) {
        if (entity.getData("skyhighheroes:dyn/" + variable)) {
          statusOn.render(isFirstPersonArm);
        } else {
          statusOff.render(isFirstPersonArm);
        };
      };
    }
  };
};

function screenStatusLightWithProgress(renderer, elementName, verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor) {
  var statusOn = screenElement(renderer, elementName + "_on", verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  var statusInProgress = screenElement(renderer, elementName + "_in_progress", verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  var statusOff = screenElement(renderer, elementName + "_off", verticalAlignment, horizontalAlignment, sizeX, sizeY, offsetX, offsetY, offsetZ, parentElement, parentElementAnchor);
  return {
    modelResource: statusOff.modelResource,
    modelEffect: statusOff.modelEffect,
    x: statusOff.x,
    y: statusOff.y,
    z: statusOff.z,
    sizeX: statusOff.baseSizeX,
    sizeY: statusOff.baseSizeY,
    leftX: statusOff.leftX,
    centerX: statusOff.centerX,
    rightX: statusOff.rightX,
    topY: statusOff.topY,
    centerY: statusOff.centerY,
    bottomY: statusOff.bottomY,
    render: (entity, isFirstPersonArm, variable) => {
      if (isFirstPersonArm) {
        if (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) == 1) {
          statusOn.render(isFirstPersonArm);
        };
        if (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) == 0) {
          statusOff.render(isFirstPersonArm);
        };
        if ((entity.getInterpolatedData("skyhighheroes:dyn/" + variable) > 0) && (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) < 1)) {
          statusInProgress.render(isFirstPersonArm);
        };
      };
    },
    render2: (entity, isFirstPersonArm, variable, variable2) => {
      if (isFirstPersonArm) {
        if (((entity.getInterpolatedData("skyhighheroes:dyn/" + variable2) == 1) ? true : (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) == 1))) {
          statusOn.render(isFirstPersonArm);
        } else {
          if (((entity.getInterpolatedData("skyhighheroes:dyn/" + variable2) == 0) ? true : (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) == 0))) {
            statusOff.render(isFirstPersonArm);
          };
        };
        if (((entity.getInterpolatedData("skyhighheroes:dyn/" + variable2) > 0) && (entity.getInterpolatedData("skyhighheroes:dyn/" + variable2) < 1) ? true : ((entity.getInterpolatedData("skyhighheroes:dyn/" + variable) > 0) && (entity.getInterpolatedData("skyhighheroes:dyn/" + variable) < 1)))) {
          statusInProgress.render(isFirstPersonArm);
        };
      };
    }
  };
};

function screenCornerSelector(renderer, elementName, parentElement, thickness, length) {
  var topLeftBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "topLeft");
  var topLeftLeft = screenElement(renderer, elementName, "top", "center", thickness, length, 0.0, 0.0, 0.0, topLeftBase, "bottomCenter");
  var topLeftTop = screenElement(renderer, elementName, "center", "left", length, thickness, 0.0, 0.0, 0.0, topLeftBase, "centerRight");
  
  var topRightBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "topRight");
  var topRightRight = screenElement(renderer, elementName, "top", "center", thickness, length, 0.0, 0.0, 0.0, topRightBase, "bottomCenter");
  var topRightTop = screenElement(renderer, elementName, "center", "right", length, thickness, 0.0, 0.0, 0.0, topRightBase, "centerLeft");

  var bottomLeftBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "bottomLeft");
  var bottomLeftLeft = screenElement(renderer, elementName, "bottom", "center", thickness, length, 0.0, 0.0, 0.0, bottomLeftBase, "topCenter");
  var bottomLeftBottom = screenElement(renderer, elementName, "center", "left", length, thickness, 0.0, 0.0, 0.0, bottomLeftBase, "centerRight");
  
  var bottomRightBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "bottomRight");
  var bottomRightRight = screenElement(renderer, elementName, "bottom", "center", thickness, length, 0.0, 0.0, 0.0, bottomRightBase, "topCenter");
  var bottomRightBottom = screenElement(renderer, elementName, "center", "right", length, thickness, 0.0, 0.0, 0.0, bottomRightBase, "centerLeft");
  return {
    render: (isFirstPersonArm) => {
      if (isFirstPersonArm) {
        topLeftBase.render(isFirstPersonArm);
        topLeftLeft.render(isFirstPersonArm);
        topLeftTop.render(isFirstPersonArm);
        topRightBase.render(isFirstPersonArm);
        topRightRight.render(isFirstPersonArm);
        topRightTop.render(isFirstPersonArm);
        bottomLeftBase.render(isFirstPersonArm);
        bottomLeftLeft.render(isFirstPersonArm);
        bottomLeftBottom.render(isFirstPersonArm);
        bottomRightBase.render(isFirstPersonArm);
        bottomRightRight.render(isFirstPersonArm);
        bottomRightBottom.render(isFirstPersonArm);
      };
    }
  }
};

function screenCornerSelectorTranser(renderer, elementName, parentElement, thickness) {
  var topLeftBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "topLeft");
  var topLeftBaseOff = screenElement(renderer, elementName+"_off", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, topLeftBase, "center");
  var topLeftBaseOn = screenElement(renderer, elementName+"_on", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, topLeftBase, "center");
  var topLeftLeft = screenElement(renderer, elementName, "top", "center", thickness, 5.0, 0.0, 0.0, 0.0, topLeftBase, "bottomCenter");
  var topLeftLeftOff = screenElement(renderer, elementName+"_off", "top", "center", "100pw", ((topLeftBase.sizeX-topLeftBaseOff.sizeX)/2)+5.0, 0.0, 0.0, 0.01, topLeftBaseOff, "bottomCenter");
  var topLeftLeftOn = screenElement(renderer, elementName+"_on", "top", "center", "100pw", ((topLeftBase.sizeX-topLeftBaseOn.sizeX)/2)+5.0, 0.0, 0.0, 0.01, topLeftBaseOn, "bottomCenter");
  var topLeftTop = screenElement(renderer, elementName, "center", "left", 5.0, thickness, 0.0, 0.0, 0.0, topLeftBase, "centerRight");
  var topLeftTopOff = screenElement(renderer, elementName+"_off", "center", "left", ((topLeftBase.sizeY-topLeftBaseOff.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, topLeftBaseOff, "centerRight");
  var topLeftTopOn = screenElement(renderer, elementName+"_on", "center", "left", ((topLeftBase.sizeY-topLeftBaseOn.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, topLeftBaseOn, "centerRight");
  
  var topRightBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "topRight");
  var topRightBaseOff = screenElement(renderer, elementName+"_off", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, topRightBase, "center");
  var topRightBaseOn = screenElement(renderer, elementName+"_on", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, topRightBase, "center");
  var topRightRight = screenElement(renderer, elementName, "top", "center", thickness, 5.0, 0.0, 0.0, 0.0, topRightBase, "bottomCenter");
  var topRightRightOff = screenElement(renderer, elementName+"_off", "top", "center", "100pw", ((topRightBase.sizeX-topRightBaseOff.sizeX)/2)+5.0, 0.0, 0.0, 0.01, topRightBaseOff, "bottomCenter");
  var topRightRightOn = screenElement(renderer, elementName+"_on", "top", "center", "100pw", ((topRightBase.sizeX-topRightBaseOn.sizeX)/2)+5.0, 0.0, 0.0, 0.01, topRightBaseOn, "bottomCenter");
  var topRightTop = screenElement(renderer, elementName, "center", "right", 5.0, thickness, 0.0, 0.0, 0.0, topRightBase, "centerLeft");
  var topRightTopOff = screenElement(renderer, elementName+"_off", "center", "right", ((topRightBase.sizeY-topRightBaseOff.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, topRightBaseOff, "centerLeft");
  var topRightTopOn = screenElement(renderer, elementName+"_on", "center", "right", ((topRightBase.sizeY-topRightBaseOn.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, topRightBaseOn, "centerLeft");

  var bottomLeftBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "bottomLeft");
  var bottomLeftBaseOff = screenElement(renderer, elementName+"_off", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, bottomLeftBase, "center");
  var bottomLeftBaseOn = screenElement(renderer, elementName+"_on", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, bottomLeftBase, "center");
  var bottomLeftLeft = screenElement(renderer, elementName, "bottom", "center", thickness, 5.0, 0.0, 0.0, 0.0, bottomLeftBase, "topCenter");
  var bottomLeftLeftOff = screenElement(renderer, elementName+"_off", "bottom", "center", "100pw", ((bottomLeftBase.sizeX-bottomLeftBaseOff.sizeX)/2)+5.0, 0.0, 0.0, 0.01, bottomLeftBaseOff, "topCenter");
  var bottomLeftLeftOn = screenElement(renderer, elementName+"_on", "bottom", "center", "100pw", ((bottomLeftBase.sizeX-bottomLeftBaseOn.sizeX)/2)+5.0, 0.0, 0.0, 0.01, bottomLeftBaseOn, "topCenter");
  var bottomLeftBottom = screenElement(renderer, elementName, "center", "left", 5.0, thickness, 0.0, 0.0, 0.0, bottomLeftBase, "centerRight");
  var bottomLeftBottomOff = screenElement(renderer, elementName+"_off", "center", "left", ((bottomLeftBase.sizeY-bottomLeftBaseOff.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, bottomLeftBaseOff, "centerRight");
  var bottomLeftBottomOn = screenElement(renderer, elementName+"_on", "center", "left", ((bottomLeftBase.sizeY-bottomLeftBaseOn.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, bottomLeftBaseOn, "centerRight");
  
  var bottomRightBase = screenElement(renderer, elementName, "center", "center", thickness, thickness, 0.0, 0.0, 0.0, parentElement, "bottomRight");
  var bottomRightBaseOff = screenElement(renderer, elementName+"_off", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, bottomRightBase, "center");
  var bottomRightBaseOn = screenElement(renderer, elementName+"_on", "center", "center", "60pw", "60ph", 0.0, 0.0, 0.0, bottomRightBase, "center");
  var bottomRightRight = screenElement(renderer, elementName, "bottom", "center", thickness, 5.0, 0.0, 0.0, 0.0, bottomRightBase, "topCenter");
  var bottomRightRightOff = screenElement(renderer, elementName+"_off", "bottom", "center", "100pw", ((bottomRightBase.sizeX-bottomRightBaseOff.sizeX)/2)+5.0, 0.0, 0.0, 0.01, bottomRightBaseOff, "topCenter");
  var bottomRightRightOn = screenElement(renderer, elementName+"_on", "bottom", "center", "100pw", ((bottomRightBase.sizeX-bottomRightBaseOn.sizeX)/2)+5.0, 0.0, 0.0, 0.01, bottomRightBaseOn, "topCenter");
  var bottomRightBottom = screenElement(renderer, elementName, "center", "right", 5.0, thickness, 0.0, 0.0, 0.0, bottomRightBase, "centerLeft");
  var bottomRightBottomOff = screenElement(renderer, elementName+"_off", "center", "right", ((bottomRightBase.sizeY-bottomRightBaseOff.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, bottomRightBaseOff, "centerLeft");
  var bottomRightBottomOn = screenElement(renderer, elementName+"_on", "center", "right", ((bottomRightBase.sizeY-bottomRightBaseOn.sizeY)/2)+5.0, "100ph", 0.0, 0.0, 0.01, bottomRightBaseOn, "centerLeft");
  return {
    render: (entity, isFirstPersonArm) => {
      if (isFirstPersonArm) {
        topLeftBase.render(isFirstPersonArm);
        topLeftLeft.render(isFirstPersonArm);
        topLeftTop.render(isFirstPersonArm);
        topRightBase.render(isFirstPersonArm);
        topRightRight.render(isFirstPersonArm);
        topRightTop.render(isFirstPersonArm);
        bottomLeftBase.render(isFirstPersonArm);
        bottomLeftLeft.render(isFirstPersonArm);
        bottomLeftBottom.render(isFirstPersonArm);
        bottomRightBase.render(isFirstPersonArm);
        bottomRightRight.render(isFirstPersonArm);
        bottomRightBottom.render(isFirstPersonArm);
        if (entity.loop(10) > 0.5) {
          topLeftBaseOn.render(isFirstPersonArm);
          topLeftLeftOn.render(isFirstPersonArm);
          topLeftTopOn.render(isFirstPersonArm);
          topRightBaseOn.render(isFirstPersonArm);
          topRightRightOn.render(isFirstPersonArm);
          topRightTopOn.render(isFirstPersonArm);
          bottomLeftBaseOn.render(isFirstPersonArm);
          bottomLeftLeftOn.render(isFirstPersonArm);
          bottomLeftBottomOn.render(isFirstPersonArm);
          bottomRightBaseOn.render(isFirstPersonArm);
          bottomRightRightOn.render(isFirstPersonArm);
          bottomRightBottomOn.render(isFirstPersonArm);
        } else {
          topLeftBaseOff.render(isFirstPersonArm);
          topLeftLeftOff.render(isFirstPersonArm);
          topLeftTopOff.render(isFirstPersonArm);
          topRightBaseOff.render(isFirstPersonArm);
          topRightRightOff.render(isFirstPersonArm);
          topRightTopOff.render(isFirstPersonArm);
          bottomLeftBaseOff.render(isFirstPersonArm);
          bottomLeftLeftOff.render(isFirstPersonArm);
          bottomLeftBottomOff.render(isFirstPersonArm);
          bottomRightBaseOff.render(isFirstPersonArm);
          bottomRightRightOff.render(isFirstPersonArm);
          bottomRightBottomOff.render(isFirstPersonArm);
        };
      };
    }
  }
};

function screenBoxSelectorTranser(renderer, elementName, parentElement, thickness) {
  var topOff = screenElement(renderer, elementName+"_off", "bottom", "center", parentElement.sizeX+(thickness*2.0), thickness, 0.0, 0.0, 0.0, parentElement, "topCenter");
  var topOn = screenElement(renderer, elementName+"_on", "bottom", "center", parentElement.sizeX+(thickness*2.0), thickness, 0.0, 0.0, 0.0, parentElement, "topCenter");

  var bottomOff = screenElement(renderer, elementName+"_off", "top", "center", parentElement.sizeX+(thickness*2.0), thickness, 0.0, 0.0, 0.0, parentElement, "bottomCenter");
  var bottomOn = screenElement(renderer, elementName+"_on", "top", "center", parentElement.sizeX+(thickness*2.0), thickness, 0.0, 0.0, 0.0, parentElement, "bottomCenter");
  
  var leftOff = screenElement(renderer, elementName+"_off", "center", "right", thickness, parentElement.sizeY+(thickness*2.0), 0.0, 0.0, 0.0, parentElement, "centerLeft");
  var leftOn = screenElement(renderer, elementName+"_on", "center", "right", thickness, parentElement.sizeY+(thickness*2.0), 0.0, 0.0, 0.0, parentElement, "centerLeft");
  
  var rightOff = screenElement(renderer, elementName+"_off", "center", "left", thickness, parentElement.sizeY+(thickness*2.0), 0.0, 0.0, 0.0, parentElement, "centerRight");
  var rightOn = screenElement(renderer, elementName+"_on", "center", "left", thickness, parentElement.sizeY+(thickness*2.0), 0.0, 0.0, 0.0, parentElement, "centerRight");
  return {
    render: (entity, isFirstPersonArm) => {
      if (isFirstPersonArm) {
        if (entity.loop(20) > 0.5) {
          topOn.render(isFirstPersonArm);
          bottomOn.render(isFirstPersonArm);
          leftOn.render(isFirstPersonArm);
          rightOn.render(isFirstPersonArm);
        } else {
          topOff.render(isFirstPersonArm);
          bottomOff.render(isFirstPersonArm);
          leftOff.render(isFirstPersonArm);
          rightOff.render(isFirstPersonArm);
        };
      };
    }
  }
};

function screenBox(renderer, elementName, parentElement, thickness, margin) {
  var top = screenElement(renderer, elementName, "top", "center", "5pmw", "5ph", 0.0, 0.0, 0.0, parentElement, "topCenter");

  var bottom = screenElement(renderer, elementName, "bottom", "center", "5pmw", "5ph", 0.0, 0.0, 0.0, parentElement, "bottomCenter");
  
  var left = screenElement(renderer, elementName, "center", "left", "5pw", "5pmh", 0.0, 0.0, 0.0, parentElement, "centerLeft");
  
  var right = screenElement(renderer, elementName, "center", "right", "5pw", "5pmh", 0.0, 0.0, 0.0, parentElement, "centerRight");
  return {
    render: (entity, isFirstPersonArm) => {
      if (isFirstPersonArm) {
        top.render(isFirstPersonArm);
        bottom.render(isFirstPersonArm);
        left.render(isFirstPersonArm);
        right.render(isFirstPersonArm);
      };
    }
  }
};

function entitySuitName(entity) {
  var beingName = entity.getName();
  if (entity.isWearingFullSuit()) {
    if (!entity.getWornHelmet().isEmpty()) {
      var itemName = entity.getWornHelmet().displayName().split("'s");
      beingName = itemName[0];
    };
    if (!entity.getWornChestplate().isEmpty()) {
      var itemName = entity.getWornChestplate().displayName().split("'s");
      beingName = itemName[0];
    };
    if (!entity.getWornLeggings().isEmpty()) {
      var itemName = entity.getWornLeggings().displayName().split("'s");
      beingName = itemName[0];
    };
    if (!entity.getWornBoots().isEmpty()) {
      var itemName = entity.getWornBoots().displayName().split("'s");
      beingName = itemName[0];
    };
    if (!isTransformed(entity)) {
      beingName = entity.getName();
    };
    if (entity.getDataOrDefault("secretheroes:dyn/moonknight_timer", 0) == 1) {
      beingName = "Moon Knight";
    };
    if (entity.getDataOrDefault("secretheroes:dyn/mrknight_timer", 0) == 1) {
      beingName = "Mr Knight";
    };
    if (entity.getWornChestplate().suitType() == "tmf:omnitrix" && entity.getDataOrDefault("tmf:dyn/transformed", -1) > -1) {
      var alien = entity.getData("tmf:dyn/transformed") + 0;
      system.moduleMessage(this, entity, alien);
      beingName = tmfAliens[alien];
    };
    if (isTransformed(entity) && ((entity.getData("fiskheroes:mask_open_timer2") == 1) || (entity.getData("fiskheroes:mask_open_timer") == 5))) {
      beingName = entity.getName();
    };
    if (entity.getData("fiskheroes:disguise") != null) {
      beingName = entity.getData("fiskheroes:disguise");
    };
  };
  return beingName;
};

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
  "skyhighheroes:dyn/wave_changing_timer",
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

function isLookingAtTarget(basePos, baseRot, targetPos, fov) {
    var directionToEntity = targetPos.subtract(basePos).normalized();
    var dotProduct = Math.max(-1, Math.min(1, baseRot.dot(directionToEntity)));
    var angle = Math.acos(dotProduct) * (180 / Math.PI);
    return Math.abs(angle) < fov;
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