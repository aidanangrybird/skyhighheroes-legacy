function initModule(system) {
  return {
    name: "Omega-Xis: The Fugitive",
    type: 7,
    human: "Geo Stelar",
    selfProfile: function (hero) {
      hero.addDamageProfile("SELF", {
        "types": {
          "ELEMENT_NONE": 1.0
        }
      });
    },
    otherProfile: function (hero) {
      hero.addDamageProfile("OTHER", {
        "types": {
          "ELEMENT_NONE": 1.0
        }
      });
    },
    waveCalling: function (entity, manager) {
      if (!entity.getData("skyhighheroes:dyn/calling") && entity.world().isUnobstructed(entity.eyePos(), entity.eyePos().add(0,1000,0)) && !entity.world().isRaining() && !entity.world().isThundering() && !entity.world().isDaytime() && (entity.world().getLocation(entity.pos().add(6, 0, 0)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(6, 0, 6)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(0, 0, 6)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(-6, 0, 6)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(-6, 0, 0)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(-6, 0, -6)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(0, 0, -6)).biome().startsWith("Beach") || entity.world().getLocation(entity.pos().add(6, 0, -6)).biome().startsWith("Beach")) && (entity.world().getLocation(entity.pos()).biome().startsWith("Plains") || entity.world().getLocation(entity.pos()).biome().startsWith("Sunflower Plains"))) {
        var value = Math.random();
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/calling_value", value);
        if (entity.getData("skyhighheroes:dyn/calling_value") < 0.05) {
          manager.setDataWithNotify(entity, "skyhighheroes:dyn/calling", true);
        };
      };
      if (entity.getData("skyhighheroes:dyn/calling_timer") == 1) {
        manager.setString(entity.getWornChestplate().nbt(), "emBeing", "Omega-Xis");
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/em_being", "Omega-Xis");
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/em_being_variable", system.formatEMBeing(entity.getData("skyhighheroes:dyn/em_being")));
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/calling", false);
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/calling_timer", 0.0);
      };
    },
    waveHandler: function (entity, hero) {
      if (entity.getData("skyhighheroes:dyn/calling_timer") > 0.3 && entity.getData("skyhighheroes:dyn/calling_timer") < 0.7) {
        var nearbyPlayers = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
        nearbyPlayers.forEach(other => {
          if (other.getName() != entity.getName()) {
            other.hurt(hero, "OTHER", "%1$s died by Omega-Xis", 10.0);
          };
        });
      };
      if (entity.getData("skyhighheroes:dyn/calling_timer") > 0.425 && entity.getData("skyhighheroes:dyn/calling_timer") < 0.475) {
        entity.hurt(hero, "SELF", "%1$s could not handle wave changing", 1.0);
      };
    }
  }
}