extend("skyhighheroes:base_transer");

loadTextures({
  "santa_hat": "skyhighheroes:santa_hat",
  "head_human": "skyhighheroes:transer/base_head",
});

var date = new Date();
var isChristmasSeason = (date.getDate() < 26 && date.getDate() > 0 && date.getMonth() == 11);
var santaHat;

function init(renderer) {
  parent.init(renderer);
  renderer.setTexture((entity, renderLayer) => {
    if (renderLayer == "CHESTPLATE") {
      return "transer";
    };
  });
  renderer.setLights((entity, renderLayer) => {
    if (renderLayer == "CHESTPLATE") {
      return null;
    };
  });
  renderer.setItemIcon("CHESTPLATE", "%s");
  renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "leftLeg", "rightLeg");
  initEffects(renderer);
};

function initEffects(renderer) {
  parent.initEffects(renderer);
  if (isChristmasSeason) {
    var santa_hat_model = renderer.createResource("MODEL", "skyhighheroes:SantaHat");
    santa_hat_model.texture.set("santa_hat");
    santaHat = renderer.createEffect("fiskheroes:model").setModel(santa_hat_model);
    santaHat.anchor.set("head");
    santaHat.setScale(1.05);
    santaHat.setOffset(0.0, -5.25, 1.25);
    santaHat.setRotation(-45.0, 0.0, 0.0);
  };
};

function render(entity, renderLayer, isFirstPersonArm) {
  parent.render(entity, renderLayer, isFirstPersonArm);
  if (isChristmasSeason) {
    santaHat.render();
  };
};