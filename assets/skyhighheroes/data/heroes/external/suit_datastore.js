/**
 * You put all of the required functions in here
 * @param system - Required
 **/
function initModule(system) {
  /**
  * Checks if a suit drive is inserted
  * @param entity - Required
  **/
  function isSuitDriveInserted(entity) {
    var nbt = system.mainNBT(entity);
    var result = false;
    var equipment = nbt.getTagList("Equipment");
    if (equipment.tagCount() == 1) {
      var item = equipment.getCompoundTag(0).getCompoundTag("Item");
      if (item.getShort("id") == PackLoader.getNumericalItemId("fiskheroes:suit_data_drive")) {
        result = true;
      };
    };
    return result;
  };
  /**
  * Checks if a suit drive is inserted
  * @param entity - Required
  **/
  function suitDriveName(entity) {
    var nbt = system.mainNBT(entity);
    var result = "";
    var equipment = nbt.getTagList("Equipment");
    if (equipment.tagCount() == 1) {
      var item = equipment.getCompoundTag(0).getCompoundTag("Item");
      if (item.getShort("id") == PackLoader.getNumericalItemId("fiskheroes:suit_data_drive")) {
        result = item.getCompoundTag("tag").getCompoundTag("display").getString("Name");
      };
    };
    return result;
  };
  /**
  * Lists suits on suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  **/
  function listDriveSuits(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var dataDriveSuits = system.getStringArray(suitDrive.getStringList("Suits"));
      system.moduleMessage(module, entity, "<nh>" + ((dataDriveSuits.length == 1) ? ("<nh>" + dataDriveSuits.length + "<n> suit:") : ("<nh>" + dataDriveSuits.length + "<n> suits:")));
      dataDriveSuits.forEach(entry => {
        system.moduleMessage(module, entity, "<nh>" + dataDriveSuits.indexOf(entry) + "<n>> <nh>" + entry);
      });
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Downloads suits off of suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitList - List of suit indexes seperated by commas
  **/
  function downloadSuits(module, entity, manager, suitList) {
    if (typeof suitList === "undefined") {
      system.moduleMessage(module, entity, "<e>Suit list cannot be empty!");
      return;
    };
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("downloadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "downloadBuffer", newBuffer);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var dataDriveSuitsArray = system.getStringArray(suitDrive.getStringList("Suits"));
      var suitsToDownload = [];
      var suitDownloadBuffer = nbt.getStringList("downloadBuffer")
      var suitDownloadBufferArray = system.getStringArray(nbt.getStringList("downloadBuffer"));
      var suitDownloadDuration = 0;
      var downloadsBuffered = 0;
      if (suitList == "*") {
        for (var i = 0;i<dataDriveSuitsArray.length;i++) {
          suitsToDownload.push(i);
        };
      } else {
        suitsToDownload = suitList.split(",");
      };
      suitsToDownload.forEach(entry => {
        if ((entry < (dataDriveSuitsArray.length)) && (entry > -1)) {
          var currentSuit = dataDriveSuitsArray[entry];
          if (suitDownloadBufferArray.indexOf(currentSuit) == -1) {
            manager.appendString(suitDownloadBuffer, currentSuit);
            suitDownloadBufferArray.push(currentSuit);
            var downloadDuration = 0;
            if (PackLoader.getSide() == "SERVER") {
              downloadDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30)
            };
            suitDownloadDuration = suitDownloadDuration + downloadDuration;
            downloadsBuffered = downloadsBuffered + 1;
          };
        };
      });
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/download_duration", entity.getData("skyhighheroes:dyn/download_duration") + suitDownloadDuration);
      system.moduleMessage(module, entity, "<n>Attempting to download <nh>" + downloadsBuffered + "<n> " + ((downloadsBuffered == 1) ? "suit!" : "suits!"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/downloading", true);
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Downloads suits off of suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitList - List of suit indexes seperated by commas
  **/
  function startSuitsDownload(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("downloadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "downloadBuffer", newBuffer);
    };
    var suitDrive = null;
    system.systemMessage(entity, "Fooooosh");
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var suitDownloadBufferArray = system.getStringArray(nbt.getStringList("downloadBuffer"));
      var suitDownloadDuration = 0;
      var downloadsBuffered = 0;
      suitDownloadBufferArray.forEach(entry => {
        var downloadDuration = 0;
        if (PackLoader.getSide() == "SERVER") {
          downloadDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30);
        };
        suitDownloadDuration = suitDownloadDuration + downloadDuration;
        downloadsBuffered = downloadsBuffered + 1;
      });
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/download_duration", entity.getData("skyhighheroes:dyn/download_duration") + suitDownloadDuration);
      system.moduleMessage(module, entity, "<n>Attempting to download <nh>" + downloadsBuffered + "<n> " + ((downloadsBuffered == 1) ? "suit!" : "suits!"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/downloading", true);
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Queues a suit to download off of suit drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function addSuitToDownloadQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("downloadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "downloadBuffer", newBuffer);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var dataDriveSuitsArray = system.getStringArray(suitDrive.getStringList("Suits"));
      var suitDownloadBuffer = nbt.getStringList("downloadBuffer");
      var suitDownloadBufferArray = system.getStringArray(nbt.getStringList("downloadBuffer"));
      if (suitDownloadBufferArray.indexOf(suitEntry) == -1) {
        manager.appendString(suitDownloadBuffer, suitEntry);
        system.moduleMessage(module, entity, "<n>Added suit <nh>" + suitEntry + "<n> to download queue!");
      } else {
        system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> already in download queue!");
      };
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Removes a suit from download queue
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function removeSuitFromDownloadQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("downloadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "downloadBuffer", newBuffer);
    };
    var suitDownloadBuffer = nbt.getStringList("downloadBuffer");
    var suitDownloadBufferArray = system.getStringArray(nbt.getStringList("downloadBuffer"));
    var suitIndex = suitDownloadBufferArray.indexOf(suitEntry);
    if (suitIndex > -1) {
      manager.removeTag(suitDownloadBuffer, suitIndex);
      system.moduleMessage(module, entity, "<n>Removed suit <nh>" + suitEntry + "<n> from download queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> not in download queue!");
    };
  };
  /**
  * Downloads suits off of suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentDownload - Current suit being downloaded
  **/
  function downloadSuit(module, entity, manager, currentDownload) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (isSuitDriveInserted(entity)) {
      var downloadBuffer = nbt.getStringList("downloadBuffer");
      var suitDatastore = nbt.getStringList("suitDatastore");
      var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
      var currentSuit = downloadBuffer.getString(currentDownload);
      system.moduleMessage(module, entity, "<n>Downloading suit \"<nh>" + currentSuit + "<n>\"!");
      if (suitDatastoreArray.indexOf(currentSuit) == -1) {
        suitDatastoreArray.push(currentSuit);
        manager.appendString(suitDatastore, currentSuit);
        system.moduleMessage(module, entity, "<s>Successfully downloaded suit \"<sh>" + currentSuit + "<s>\" to " + system.getModelID(entity) + "!");
        if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
        };
        if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_edit") {
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
        };
        if (entity.getData("skyhighheroes:dyn/current_menu") == "comms" && entity.getData("skyhighheroes:dyn/current_submenu") == "comms_suits") {
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
        };
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.orb", 1.0, 1.0);
        };
      } else {
        system.moduleMessage(module, entity, "<e>Failed to download suit \"<eh>" + currentSuit + "<e>\"! Already exists in datastore!");
      };
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Uploads suits to suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitList - List of suit indexes seperated by commas
  **/
  function uploadSuits(module, entity, manager, suitList) {
    if (typeof suitList === "undefined") {
      system.moduleMessage(module, entity, "<e>Suit list cannot be empty!");
      return;
    };
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuits = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuits);
    };
    if (!nbt.hasKey("uploadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "uploadBuffer", newBuffer);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
      var suitsToUpload = suitList.split(","); //Indexes of suits
      var suitUploadBuffer = nbt.getStringList("uploadBuffer");
      var suitUploadBufferArray = system.getStringArray(nbt.getStringList("uploadBuffer"));
      var suitUploadDuration = 0;
      var uploadsBuffered = 0;
      suitsToUpload.forEach(entry => {
        if ((entry < (suitDatastoreArray.length)) && (entry > -1)) {
          var currentSuit = suitDatastoreArray[entry];
          if (suitUploadBufferArray.indexOf(currentSuit) == -1) {
            manager.appendString(suitUploadBuffer, currentSuit);
            suitUploadBufferArray.push(currentSuit);
            var uploadDuration = 0;
            if (PackLoader.getSide() == "SERVER") {
              uploadDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30)
            };
            suitUploadDuration = suitUploadDuration + uploadDuration;
            uploadsBuffered = uploadsBuffered + 1;
          };
        };
      });
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/upload_duration", entity.getData("skyhighheroes:dyn/upload_duration") + suitUploadDuration);
      system.moduleMessage(module, entity, "<n>Attempting to upload <nh>" + uploadsBuffered + "<n> " + ((uploadsBuffered == 1) ? "suit!" : "suits!"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/uploading", true);
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Uploads suits to suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  **/
  function startSuitsUpload(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuits = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuits);
    };
    if (!nbt.hasKey("uploadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "uploadBuffer", newBuffer);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var suitUploadBufferArray = system.getStringArray(nbt.getStringList("uploadBuffer"));
      var suitUploadDuration = 0;
      var uploadsBuffered = 0;
      suitUploadBufferArray.forEach(entry => {
        var uploadDuration = 0;
        if (PackLoader.getSide() == "SERVER") {
          uploadDuration = system.clamp(Math.floor(Math.random() * 30), 10, 30)
        };
        suitUploadDuration = suitUploadDuration + uploadDuration;
        uploadsBuffered = uploadsBuffered + 1;
      });
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/upload_duration", entity.getData("skyhighheroes:dyn/upload_duration") + suitUploadDuration);
      system.moduleMessage(module, entity, "<n>Attempting to upload <nh>" + uploadsBuffered + "<n> " + ((uploadsBuffered == 1) ? "suit!" : "suits!"));
      manager.setDataWithNotify(entity, "skyhighheroes:dyn/uploading", true);
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Queues a suit to upload to suit drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function addSuitToUploadQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("uploadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "uploadBuffer", newBuffer);
    };
    var suitDrive = null;
    if (isSuitDriveInserted(entity)) {
      suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    };
    if (suitDrive != null) {
      var dataDriveSuitsArray = system.getStringArray(suitDrive.getStringList("Suits"));
      var suitUploadBuffer = nbt.getStringList("uploadBuffer");
      var suitUploadBufferArray = system.getStringArray(nbt.getStringList("uploadBuffer"));
      if (suitUploadBufferArray.indexOf(suitEntry) == -1) {
        manager.appendString(suitUploadBuffer, suitEntry);
        system.moduleMessage(module, entity, "<n>Added suit <nh>" + suitEntry + "<n> to upload queue!");
      } else {
        system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> already in upload queue!");
      };
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Removes a suit from upload queue
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param suitEntry - suit
  **/
  function removeSuitFromUploadQueue(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    if (!nbt.hasKey("uploadBuffer")) {
      var newBuffer = manager.newTagList();
      manager.setTagList(nbt, "uploadBuffer", newBuffer);
    };
    var suitUploadBuffer = nbt.getStringList("uploadBuffer");
    var suitUploadBufferArray = system.getStringArray(nbt.getStringList("uploadBuffer"));
    var suitIndex = suitUploadBufferArray.indexOf(suitEntry);
    if (suitIndex > -1) {
      manager.removeTag(suitUploadBuffer, suitIndex);
      system.moduleMessage(module, entity, "<n>Removed suit <nh>" + suitEntry + "<n> from upload queue!");
    } else {
      system.moduleMessage(module, entity, "<n>Suit <nh>" + suitEntry + "<n> not in upload queue!");
    };
  };
  /**
  * Uploads suiit to suit data drive
  * @param module - module passthrough
  * @param entity - Required
  * @param manager - Required
  * @param currentUpload - Suit index
  **/
  function uploadSuit(module, entity, manager, currentUpload) {
    var nbt = system.mainNBT(entity);
    if (isSuitDriveInserted(entity)) {
      var uploadBuffer = nbt.getStringList("uploadBuffer");
      var suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
      var suitDriveArray = system.getStringArray(suitDrive.getStringList("Suits"));
      var currentSuit = uploadBuffer.getString(currentUpload);
      system.moduleMessage(module, entity, "<n>Uploading suit \"<nh>" + currentSuit + "<n>\"!");
      if ((suitDriveArray.indexOf(currentSuit) == -1) && (suitDriveArray.length < 9)) {
        suitDriveArray.push(currentSuit);
        manager.appendString(suitDrive.getStringList("Suits"), currentSuit);
        system.moduleMessage(module, entity, "<s>Successfully uploaded suit \"<sh>" + currentSuit + "<s>\" to " + suitDriveName(entity) + "<s>!");
        if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
          var list = system.getStringArray(suitDrive.getStringList("Suits"));
          system.updateList(entity, manager, 10, list);
        };
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.orb", 1.0, 1.0);
        };
      } else {
        system.moduleMessage(module, entity, "<e>Failed to uploaded suit \"<eh>" + currentSuit + "<e>\"! Already exists " + suitDriveName(entity) + "<e>!");
      };
    } else {
      system.moduleMessage(module, entity, "<e>Suit drive not plugged in!");
    };
  };
  /**
  * Removes suits by index
  * @param module - module passthrough
  * @param {JSEntity} entity - Required
  * @param {JSDataManager} manager - Required
  * @param {string} suitIndex - Index of suit to remove
  **/
  function removeSuit(module, entity, manager, suitIndex) {
    if (typeof suitIndex === "undefined") {
      system.moduleMessage(module, entity, "<e>Suit index cannot be empty!");
      return;
    };
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    var suitsRemoved = 0;
    var suitDatastore = nbt.getStringList("suitDatastore");
    if (suitIndex == "*") {
      manager.removeTag(nbt, "suitDatastore");
      system.moduleMessage(module, entity, "<s>Deleted the entire suit datastore!");
    } else {
      if ((suitIndex < suitDatastoreArray.length) && (suitIndex > -1)) {
        var currentSuit = suitDatastoreArray[suitIndex];
        system.moduleMessage(module, entity, "<n>Removeing suit \"<nh>" + currentSuit + "<n>\"!");
        if (suitDatastoreArray.indexOf(currentSuit) > -1) {
          manager.removeTag(suitDatastore, suitIndex);
          system.moduleMessage(module, entity, "<s>Successfully removed suit \"<sh>" + currentSuit + "<s>\"!");
          suitsRemoved = suitsRemoved + 1;
        } else {
          system.moduleMessage(module, entity, "<e>Failed to remove suit \"<eh>" + currentSuit + "<e>\"!");
        };
      };
    };
  };
  /**
  * Removes suits by index
  * @param module - module passthrough
  * @param {JSEntity} entity - Required
  * @param {JSDataManager} manager - Required
  * @param {string} suitIndex - Index of suit to remove
  **/
  function suitRemove(module, entity, manager, suitEntry) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    var suitIndex = suitDatastoreArray.indexOf(suitEntry);
    var suitDatastore = nbt.getStringList("suitDatastore");
    if ((suitIndex > -1) && (suitIndex < suitDatastoreArray.length)) {
      manager.removeTag(suitDatastore, suitIndex);
      system.moduleMessage(module, entity, "<s>Successfully removed suit \"<sh>" + suitEntry + "<s>\"!");
    } else {
      system.moduleMessage(module, entity, "<e>Failed to remove suit \"<eh>" + suitEntry + "<e>\"!");
    };
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function listSuits(module, entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    system.moduleMessage(module, entity, "<nh>" + ((suitDatastoreArray.length == 1) ? suitDatastoreArray.length + "<n> suit:" : suitDatastoreArray.length + "<n> suits:"));
    suitDatastoreArray.forEach(entry => {
      system.moduleMessage(module, entity, "<nh>" + suitDatastoreArray.indexOf(entry) + "<n>> <nh>" + entry);
    });
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function suitsList(entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("suitDatastore")) {
      var newSuitsList = manager.newTagList();
      manager.setTagList(nbt, "suitDatastore", newSuitsList);
    };
    var suitDatastoreArray = system.getStringArray(nbt.getStringList("suitDatastore"));
    return suitDatastoreArray;
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function suitsDriveList(entity, manager) {
    var nbt = system.mainNBT(entity);
    var suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    var suitDriveArray = system.getStringArray(suitDrive.getStringList("Suits"));
    return suitDriveArray;
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function uploadQueueList(entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("uploadBuffer")) {
      var newList = manager.newTagList();
      manager.setTagList(nbt, "uploadBuffer", newList);
    };
    var suitUploadBufferArray = system.getStringArray(nbt.getStringList("uploadBuffer"));
    return suitUploadBufferArray;
  };
  /**
  * Lists suits stored internally
  * @param entity - Required
  * @param manager - Required
  **/
  function downloadQueueList(entity, manager) {
    var nbt = system.mainNBT(entity);
    if (!nbt.hasKey("downloadBuffer")) {
      var newList = manager.newTagList();
      manager.setTagList(nbt, "downloadBuffer", newList);
    };
    var suitDownloadBufferArray = system.getStringArray(nbt.getStringList("downloadBuffer"));
    return suitDownloadBufferArray;
  };
  return {
    name: "suitDatastore",
    moduleMessageName: "Suits",
    type: 11,
    command: "suits",
    cyberMainButton: {
      buttonID: "main_suits",
      borderingButtons: {
        top: "main_blades_shields",
        bottom: "main_comms"
      },
      properties: {
        confirmAction: (entity, manager) => {
          system.setButton(entity, manager, "suits_edit");
          system.setMenu(entity, manager, "suits");
        },
        backAction: (entity, manager) => {
          manager.setData(entity, "skyhighheroes:dyn/cybernetic_interface", false);
        }
      }
    },
    cyberMenus: {
      "suits": {
        parent: "main",
        prevButton: "main_suits",
        buttons: {
          "suits_edit": {
            borderingButtons: {
              bottom: "suits_upload",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_select_0");
                system.setSubmenu(entity, manager, "suits_edit");
                var list = suitsList(entity, manager);
                manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                system.updateList(entity, manager, 10, list);
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_suits");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "suits_upload": {
            borderingButtons: {
              top: "suits_edit",
              bottom: "suits_download",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (isSuitDriveInserted(entity)) {
                  system.setSubmenu(entity, manager, "suits_upload");
                  system.setButton(entity, manager, "suits_base_select_0");
                  var uploads = uploadQueueList(entity, manager);
                  manager.setData(entity, "skyhighheroes:dyn/list2_total", uploads.length);
                  manager.setData(entity, "skyhighheroes:dyn/scroll2_value", 0);
                  manager.setData(entity, "skyhighheroes:dyn/scroll2_total", Math.max(uploads.length - 10, 0));
                  system.updateList2(entity, manager, 10, uploads);
                  var list = suitsList(entity, manager);
                  manager.setData(entity, "skyhighheroes:dyn/list_total", list.length);
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                  manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(list.length - 10, 0));
                  system.updateList(entity, manager, 10, list);
                } else {
                  system.moduleMessage(this, entity, "<e>Suit drive not plugged in!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_suits");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "suits_download": {
            borderingButtons: {
              top: "suits_upload",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (isSuitDriveInserted(entity)) {
                  system.setSubmenu(entity, manager, "suits_download");
                  system.setButton(entity, manager, "suits_base_select_0");
                  var downloads = downloadQueueList(entity, manager);
                  manager.setData(entity, "skyhighheroes:dyn/list2_total", downloads.length);
                  manager.setData(entity, "skyhighheroes:dyn/scroll2_value", 0);
                  manager.setData(entity, "skyhighheroes:dyn/scroll2_total", Math.max(downloads.length - 10, 0));
                  system.updateList2(entity, manager, 10, downloads);
                  var driveList = suitsDriveList(entity, manager);
                  manager.setData(entity, "skyhighheroes:dyn/list_total", driveList.length);
                  manager.setData(entity, "skyhighheroes:dyn/scroll_value", 0);
                  manager.setData(entity, "skyhighheroes:dyn/scroll_total", Math.max(driveList.length - 10, 0));
                  system.updateList(entity, manager, 10, driveList);
                } else {
                  system.moduleMessage(this, entity, "<e>Suit drive not plugged in!");
                };
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "main_suits");
                system.setMenu(entity, manager, "main");
              },
            }
          },
          "suits_run_queue": {
            borderingButtons: {
              top: "suits_base_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                if (isSuitDriveInserted(entity)) {
                  if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                    startSuitsDownload(this, entity, manager);
                  };
                  if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                    startSuitsUpload(this, entity, manager);
                  };
                } else {
                  system.moduleMessage(this, entity, "<e>Suit drive not plugged in!");
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
            }
          },
          "suits_delete": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                var suitEntry = entity.getData("skyhighheroes:dyn/list_entry");
                suitRemove(this, entity, manager, suitEntry);
                var list = suitsList(entity, manager);
                system.updateList(entity, manager, 10, list);
                system.setButton(entity, manager, entity.getData("skyhighheroes:dyn/prev_selected_button"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, entity.getData("skyhighheroes:dyn/prev_selected_button"));
              },
            }
          },
          "suits_select_0": {
            borderingButtons: {
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                system.scrollUp(entity, manager, list);
                system.updateList(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  system.setButton(entity, manager, "suits_select_1");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "suits_select_1": {
            borderingButtons: {
              top: "suits_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, entity.getData("skyhighheroes:dyn/prev_selected_button"));
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  system.setButton(entity, manager, "suits_select_2");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "suits_select_2": {
            borderingButtons: {
              top: "suits_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  system.setButton(entity, manager, "suits_select_3");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "suits_select_3": {
            borderingButtons: {
              top: "suits_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  system.setButton(entity, manager, "suits_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "suits_select_4": {
            borderingButtons: {
              top: "suits_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  system.setButton(entity, manager, "suits_select_5");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "suits_select_5": {
            borderingButtons: {
              top: "suits_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  system.setButton(entity, manager, "suits_select_6");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "suits_select_6": {
            borderingButtons: {
              top: "suits_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_7") != "") {
                  system.setButton(entity, manager, "suits_select_7");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              }
            }
          },
          "suits_select_7": {
            borderingButtons: {
              top: "suits_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_8") != "") {
                  system.setButton(entity, manager, "suits_select_8");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
              }
            }
          },
          "suits_select_8": {
            borderingButtons: {
              top: "suits_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                if (entity.getData("skyhighheroes:dyn/scroll_entry_9") != "") {
                  system.setButton(entity, manager, "suits_select_9");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
              }
            }
          },
          "suits_select_9": {
            borderingButtons: {
              top: "suits_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_delete");
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
              },
              backAction: (entity, manager) => {
                system.setButton(entity, manager, "suits_edit");
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = suitsList(entity, manager);
                system.scrollDown(entity, manager, 10, list);
                system.updateList(entity, manager, 10, list);
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
              }
            }
          },
          "suits_base_select_0": {
            borderingButtons: {
              right: "suits_queue_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                system.scrollUp(entity, manager, list);
                system.updateList(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_1") != "") {
                  system.setButton(entity, manager, "suits_base_select_1");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_0"));
              }
            }
          },
          "suits_base_select_1": {
            borderingButtons: {
              top: "suits_base_select_0",
              right: "suits_queue_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_2") != "") {
                  system.setButton(entity, manager, "suits_base_select_2");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_1"));
              }
            }
          },
          "suits_base_select_2": {
            borderingButtons: {
              top: "suits_base_select_1",
              right: "suits_queue_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_3") != "") {
                  system.setButton(entity, manager, "suits_base_select_3");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_2"));
              }
            }
          },
          "suits_base_select_3": {
            borderingButtons: {
              top: "suits_base_select_2",
              right: "suits_queue_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_4") != "") {
                  system.setButton(entity, manager, "suits_base_select_4");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_3"));
              }
            }
          },
          "suits_base_select_4": {
            borderingButtons: {
              top: "suits_base_select_3",
              right: "suits_queue_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_5") != "") {
                  system.setButton(entity, manager, "suits_base_select_5");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_4"));
              }
            }
          },
          "suits_base_select_5": {
            borderingButtons: {
              top: "suits_base_select_4",
              right: "suits_queue_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_6") != "") {
                  system.setButton(entity, manager, "suits_base_select_6");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_5"));
              }
            }
          },
          "suits_base_select_6": {
            borderingButtons: {
              top: "suits_base_select_5",
              right: "suits_queue_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_7") != "") {
                  system.setButton(entity, manager, "suits_base_select_7");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_6"));
              }
            }
          },
          "suits_base_select_7": {
            borderingButtons: {
              top: "suits_base_select_6",
              right: "suits_queue_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_8") != "") {
                  system.setButton(entity, manager, "suits_base_select_8");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_7"));
              }
            }
          },
          "suits_base_select_8": {
            borderingButtons: {
              top: "suits_base_select_7",
              right: "suits_queue_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll_entry_9") != "") {
                  system.setButton(entity, manager, "suits_base_select_9");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_8"));
              }
            }
          },
          "suits_base_select_9": {
            borderingButtons: {
              top: "suits_base_select_8",
              right: "suits_queue_select_9",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  addSuitToDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  addSuitToUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = suitsDriveList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = suitsList(entity, manager);
                };
                system.scrollDown(entity, manager, 10, list);
                system.updateList(entity, manager, 10, list);
                if (list.indexOf(entity.getData("skyhighheroes:dyn/scroll_entry_9")) == (list.length - 1)) {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list_entry", entity.getData("skyhighheroes:dyn/scroll_entry_9"));
              }
            }
          },
          "suits_queue_select_0": {
            borderingButtons: {
              left: "suits_base_select_0",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_0"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              upAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                system.scrollUp2(entity, manager, list.length, list);
                system.updateList2(entity, manager, 10, list);
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_1") != "") {
                  system.setButton(entity, manager, "suits_queue_select_1");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 0);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_0"));
              }
            }
          },
          "suits_queue_select_1": {
            borderingButtons: {
              top: "suits_queue_select_0",
              left: "suits_base_select_1",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_1"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_2") != "") {
                  system.setButton(entity, manager, "suits_queue_select_2");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 1);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_1"));
              }
            }
          },
          "suits_queue_select_2": {
            borderingButtons: {
              top: "suits_queue_select_1",
              left: "suits_base_select_2",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_2"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_3") != "") {
                  system.setButton(entity, manager, "suits_queue_select_3");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 2);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_2"));
              }
            }
          },
          "suits_queue_select_3": {
            borderingButtons: {
              top: "suits_queue_select_2",
              left: "suits_base_select_3",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_3"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_4") != "") {
                  system.setButton(entity, manager, "suits_queue_select_4");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 3);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_3"));
              }
            }
          },
          "suits_queue_select_4": {
            borderingButtons: {
              top: "suits_queue_select_3",
              left: "suits_base_select_4",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_4"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_5") != "") {
                  system.setButton(entity, manager, "suits_queue_select_5");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 4);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_4"));
              }
            }
          },
          "suits_queue_select_5": {
            borderingButtons: {
              top: "suits_queue_select_4",
              left: "suits_base_select_5",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_5"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_6") != "") {
                  system.setButton(entity, manager, "suits_queue_select_6");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 5);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_5"));
              }
            }
          },
          "suits_queue_select_6": {
            borderingButtons: {
              top: "suits_queue_select_5",
              left: "suits_base_select_6",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_6"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                manager.setData(entity, "skyhighheroes:dyn/list2_total", list.length);
                var value = entity.getData("skyhighheroes:dyn/scroll2_value");
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_7") != "") {
                  system.setButton(entity, manager, "suits_queue_select_7");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 6);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_6"));
              }
            }
          },
          "suits_queue_select_7": {
            borderingButtons: {
              top: "suits_queue_select_6",
              left: "suits_base_select_7",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_7"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_8") != "") {
                  system.setButton(entity, manager, "suits_queue_select_8");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 7);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_7"));
              }
            }
          },
          "suits_queue_select_8": {
            borderingButtons: {
              top: "suits_queue_select_7",
              left: "suits_base_select_8",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_8"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/scroll2_entry_9") != "") {
                  system.setButton(entity, manager, "suits_queue_select_9");
                } else {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 8);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_8"));
              }
            }
          },
          "suits_queue_select_9": {
            borderingButtons: {
              top: "suits_queue_select_8",
              left: "suits_base_select_9",
            },
            properties: {
              confirmAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_9"));
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  removeSuitFromDownloadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = downloadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  removeSuitFromUploadQueue(this, entity, manager, entity.getData("skyhighheroes:dyn/list2_entry"));
                  var list = uploadQueueList(entity, manager);
                  system.updateList2(entity, manager, 10, list);
                };
              },
              backAction: (entity, manager) => {
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  system.setButton(entity, manager, "suits_download");
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  system.setButton(entity, manager, "suits_upload");
                };
                system.setSubmenu(entity, manager, "");
              },
              downAction: (entity, manager) => {
                var list = [];
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
                  list = downloadQueueList(entity, manager);
                };
                if (entity.getData("skyhighheroes:dyn/current_submenu") == "suits_upload") {
                  list = uploadQueueList(entity, manager);
                };
                system.scrollDown2(entity, manager, 10, list);
                system.updateList2(entity, manager, 10, list);
                if (list.indexOf(entity.getData("skyhighheroes:dyn/scroll2_entry_9")) == (list.length-1)) {
                  system.setButton(entity, manager, "suits_run_queue");
                };
              },
              selectAction: (entity, manager) => {
                manager.setData(entity, "skyhighheroes:dyn/list2_value", 9);
                manager.setData(entity, "skyhighheroes:dyn/list2_entry", entity.getData("skyhighheroes:dyn/scroll2_entry_9"));
              }
            }
          },
        }
      }
    },
    helpMessage: "<n>!suits <nh>-<n> Suit Datastore",
    commandHandler: function (entity, manager, argList) {
      if (argList.length > 1 && argList.length < 4) {
        switch(argList[1]) {
          case "listDrive":
            listDriveSuits(this, entity, manager);
            break;
          case "download":
            downloadSuits(this, entity, manager, argList[2]);
            break;
          case "upload":
            uploadSuits(this, entity, manager, argList[2]);
            break;
          case "rem":
            removeSuit(this, entity, manager, argList[2]);
            break;
          case "list":
            listSuits(this, entity, manager);
            break;
          case "help":
            system.moduleMessage(this, entity, "<n>Suits Datastore commands:");
            system.moduleMessage(this, entity, "<n>!suits rem <index> <nh>-<n> Deletes suit by index");
            system.moduleMessage(this, entity, "<n>!suits list <nh>-<n> Lists stored suits");
            system.moduleMessage(this, entity, "<n>!suits listDrive <nh>-<n> Lists suits on plugged in data drive");
            system.moduleMessage(this, entity, "<n>!suits download <suits> <nh>-<n> Downloads suits (comma seperated indexes) from inserted data drive");
            system.moduleMessage(this, entity, "<n>!suits upload <suits> <nh>-<n> Uploads suits (comma seperated indexes) to inserted data drive");
            system.moduleMessage(this, entity, "<n>!suits help <nh>-<n> Shows this list");
            break;
          default:
            system.moduleMessage(this, entity, "<e>Unknown <eh>suitDatastore<e> command! Try <eh>!suits help<e> for a list of commands!");
            break;
        };
      } else {
        system.moduleMessage(this, entity, "<e>Unknown <eh>suitDatastore<e> command! Try <eh>!suits help<e> for a list of commands!");
      };
    },
    tickHandler: function (entity, manager) {
      var nbt = system.mainNBT(entity);
      if (!system.hasEnoughEnergy(entity, manager, "downloading")) {
        manager.setData(entity, "skyhighheroes:dyn/downloading", false);
      };
      if (!system.hasEnoughEnergy(entity, manager, "uploading")) {
        manager.setData(entity, "skyhighheroes:dyn/uploading", false);
      };
      if (entity.getData("skyhighheroes:dyn/downloading")) {
        system.useEnergy(entity, manager, "downloading");
      };
      if (entity.getData("skyhighheroes:dyn/uploading")) {
        system.useEnergy(entity, manager, "uploading");
      };
      if (entity.getData("skyhighheroes:dyn/download_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/downloading", false);
        system.moduleMessage(this, entity, "<s>Finished downloading suits!");
        manager.setTagList(nbt, "downloadBuffer", manager.newTagList());
        if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
          system.updateList2(entity, manager, 10, []);
          var list = system.getStringArray(nbt.getStringList("suitDatastore"));
          system.updateList(entity, manager, 10, list);
        };
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/download_duration", 0);
        if (PackLoader.getSide() == "CLIENT") {
          entity.playSound("minecraft:random.levelup", 1.0, 1.0);
        };
      };
      var suitDownloadBuffer = manager.newTagList();
      if (nbt.getStringList("downloadBuffer") != null) {
        suitDownloadBuffer = nbt.getStringList("downloadBuffer");
      };
      var downloadDuration = entity.getData("skyhighheroes:dyn/download_duration")+10;
      if (entity.getData("skyhighheroes:dyn/downloading")) {
        var step = (1/downloadDuration)
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/download_timer", entity.getData("skyhighheroes:dyn/download_timer")+step);
      };
      if (!entity.getData("skyhighheroes:dyn/downloading") && entity.getData("skyhighheroes:dyn/download_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/download_timer", 0);
      };
      if ((entity.getData("skyhighheroes:dyn/download_timer") < 1) && (entity.getData("skyhighheroes:dyn/download_timer") > 0) && entity.getData("skyhighheroes:dyn/downloading")) {
        var suitDownloadDuration = (downloadDuration/suitDownloadBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/download_timer")*downloadDuration);
        if (currentTime % suitDownloadDuration == 0) {
          var currentDownload = ((currentTime/suitDownloadDuration)-1);
          downloadSuit(this, entity, manager, currentDownload);
        };
      };
      if (entity.getData("skyhighheroes:dyn/upload_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/uploading", false);
        system.moduleMessage(this, entity, "<s>Finished uploading suits!");
        manager.setTagList(nbt, "uploadBuffer", manager.newTagList());
        if (entity.getData("skyhighheroes:dyn/current_menu") == "suits" && entity.getData("skyhighheroes:dyn/current_submenu") == "suits_download") {
          var suitDrive = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
          var list = system.getStringArray(suitDrive.getStringList("Suits"));
          system.updateList(entity, manager, 10, list);
        };
        entity.playSound("minecraft:random.levelup", 1.0, 1.0);
      };
      var suitUploadBuffer = manager.newTagList();
      if (nbt.getStringList("uploadBuffer") != null) {
        suitUploadBuffer = nbt.getStringList("uploadBuffer");
      };
      var uploadDuration = entity.getData("skyhighheroes:dyn/upload_duration")+10;
      if (entity.getData("skyhighheroes:dyn/uploading")) {
        var step = (1/uploadDuration)
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/upload_timer", entity.getData("skyhighheroes:dyn/upload_timer")+step);
      };
      if (!entity.getData("skyhighheroes:dyn/uploading") && entity.getData("skyhighheroes:dyn/upload_timer") >= 1) {
        manager.setDataWithNotify(entity, "skyhighheroes:dyn/upload_timer", 0);
      };
      if (PackLoader.getSide() == "SERVER" && (entity.getData("skyhighheroes:dyn/upload_timer") < 1) && (entity.getData("skyhighheroes:dyn/upload_timer") > 0) && entity.getData("skyhighheroes:dyn/uploading")) {
        var suitUploadDuration = (uploadDuration/suitUploadBuffer.tagCount()).toFixed(0);
        var currentTime = Math.ceil(entity.getData("skyhighheroes:dyn/upload_timer")*uploadDuration);
        if (currentTime % suitUploadDuration == 0) {
          var currentUpload = ((currentTime/suitUploadDuration)-1);
          uploadSuit(this, entity, manager, currentUpload);
        };
      };
    },
    whenDisabled: function (entity, manager) {
      manager.setData(entity, "skyhighheroes:dyn/downloading", false);
      manager.setData(entity, "skyhighheroes:dyn/uploading", false);
    },
    onChargingStart: function (entity, manager) {
      manager.setData(entity, "skyhighheroes:dyn/downloading", false);
      manager.setData(entity, "skyhighheroes:dyn/uploading", false);
    }
  };
};