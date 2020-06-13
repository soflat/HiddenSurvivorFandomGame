
//-----------------------------------------------------------------------------
// SoFlatItemManager
//
// 管理所有原料與物品的static class
function SoFlatItemManager() {
    throw new Error('This is a static class')
}

SoFlatItemManager.itemPicMapping = {
    1: "HS_food_small",
    2: "HS_food_big",
    3: "HS_water_clean",
    4: "HS_vegetable",
    5: "HS_fruit",
    6: "HS_acorn",
    7: "HS_metal",
    8: "HS_wood",
    9: "HS_gear",
    10: "HS_plastic",
    11: "HS_electron",
    12: "HS_leather",
    13: "HS_cloth",
    14: "HS_pigment",
    15: "HS_boiling_water",
    16: "HS_vegetable_juice",
    17: "HS_fruit_tea",
    18: "HS_coffee",
    20: "HS_vegetable_fruit_juice",
    21: "HS_BBQ",
    22: "HS_russian_soup",
    23: "HS_grilled_vegetable",
    24: "HS_steak",
    25: "HS_vegetable_soup",
    26: "HS_hot_vegetable",
    41: "HS_wrench",
    61: "HS_pic"
}

SoFlatItemManager.gainItem = function(itemId, itemAmount) {
    if (itemAmount === 0)
        return
    let pictureName = SoFlatItemManager.itemPicMapping[itemId]
    let _x = ($gamePlayer._realX - $gameMap._displayX + 0.5) * 48
    let _y = ($gamePlayer._realY - $gameMap._displayY - 1) * 48
    $gameScreen.showPicture(
        pictureId = 7,
        name = pictureName,
        origin = 1,
        x = _x, y = _y,
        scaleX = 100, scaleY = 100,
        opacity = 255, blendMode = 0)
    $gameScreen.movePicture(
        pictureId = 7,
        origin = 1, 
        x = _x, y = _y - 20, 
        scaleX = 100, scaleY = 100,
        opacity = 0, blendMode = 0, duration = 15)
    setTimeout(function() {
        $gameScreen.erasePicture(7)
    }.bind(this), delay = parseInt((15/60) * 1000))
    $gameParty.gainItem($dataItems[itemId], itemAmount)
}


//-----------------------------------------------------------------------------
// SoFlatRebornEventManager
//
// 管理所有重生事件的static class

var $soflatRebornEvents = []

function SoFlatRebornEventManager() {
    throw new Error('This is a static class')
}

// 進入地圖時手動呼叫w 把地圖上所有重生事件加入$soflatRebornEvents
SoFlatRebornEventManager.setupRebornEvents = function() {
    for (var i = 0; i < $dataMap.events.length; i++) {
        if ($dataMap.events[i] && $dataMap.events[i].note) {
            try {
                var metaData = JSON.parse($dataMap.events[i].note)
                $soflatRebornEvents.push(
                    new Soflat_RebornEvent(
                        mapId=$gameMap.mapId(), 
                        eventId=i, 
                        rebornTime=metaData['rebornTime'],
                        itemId=metaData['itemId'],
                        itemAmount=metaData['itemAmount']))
            } catch(e) {
                // not a reborn event
            }
        }
    }
}

SoFlatRebornEventManager.loadRebornEvents = function(savefileId) {
    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var loadData = fs.readFileSync(
        path.join(savePath, 'RebornEventsInfos' + ("000" + savefileId).slice(-3) + '.json'))
    var RebornEventsInfos = JSON.parse(loadData.toString())
    
    for (var idx = 0; idx < RebornEventsInfos.length; idx++) {
        if (RebornEventsInfos[idx]) {
            $soflatRebornEvents[idx] = new Soflat_RebornEvent(
                RebornEventsInfos[idx].mapId,
                RebornEventsInfos[idx].eventId,
                RebornEventsInfos[idx].rebornTime,
                RebornEventsInfos[idx].itemId,
                RebornEventsInfos[idx].itemAmount,
                RebornEventsInfos[idx].lifeCycle,
                RebornEventsInfos[idx].deadTime,
            )
        }
    }
    return true
}

SoFlatRebornEventManager.saveRebornEvents = function(savefileId) {
    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var filePath = path.join(savePath, 'RebornEventsInfos' + ("000" + savefileId).slice(-3) + '.json')
    if (fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            JSON.stringify([]))
    }

    for (var idx = 0; idx < $soflatRebornEvents.length; idx++) {
        if ($soflatRebornEvents[idx]) {
            var tmp = $soflatRebornEvents[idx]
            tmp.writeToFile(savefileId)
        }
    }
    return true
}

//藉由mapId和eventId找到被觸發的設施，並回傳該設施物件
SoFlatRebornEventManager.findTriggerRebornEvent = function(mapId, eventId) {
    for (var idx in $soflatRebornEvents) {
        if ($soflatRebornEvents[idx] &&
            $soflatRebornEvents[idx].mapId() === mapId && 
            $soflatRebornEvents[idx].eventId() === eventId)
            return $soflatRebornEvents[idx]
    }
    return null
}

SoFlatRebornEventManager.updateRebornEventStatus = function() {
    for (var idx in $soflatRebornEvents) {
        if ($soflatRebornEvents[idx]) {
            $soflatRebornEvents[idx].updateStatus()
        }
    }
}


//-----------------------------------------------------------------------------
// SoFlatBuildManager
//
// 管理所有設施的static class。

var $soflatBuilds = []
var $isBuilding = false
var $isBuildingKind = 'BASE'

function SoFlatBuildManager() {
    throw new Error('This is a static class')
}

SoFlatBuildManager.kindMapping = function(kind) {
    let mapping = {
        'BASE': SoFlat_Build,
        'FOOD_1': SoFlat_BuildFood1,
        'FOOD_2': SoFlat_BuildFood2,
        'FOOD_3': SoFlat_BuildFood3,
        'BEVERAGE_1': SoFlat_BuildBeverage1,
        'BEVERAGE_2': SoFlat_BuildBeverage2,
        'BEVERAGE_3': SoFlat_BuildBeverage3,
        'FIELD_1': SoFlat_BuildField1,
        'FIELD_2': SoFlat_BuildField2,
        'FIELD_3': SoFlat_BuildField3,
        'BUCKET_1': SoFlat_BuildBucket1,
        'BUCKET_2': SoFlat_BuildBucket2,
        'BUCKET_3': SoFlat_BuildBucket3,
        'TRAP_1': SoFlat_BuildTrap1,
        'TRAP_2': SoFlat_BuildTrap2,
        'TRAP_3': SoFlat_BuildTrap3
    }
    return mapping[kind]
}

SoFlatBuildManager.recipeMapping = function(kind) {
    let mapping = {
        'BASE': {},
        'FOOD_1': {"7": 59, "11": 59},
        'FOOD_2': {"7": 236, "11": 236},
        'FOOD_3': {"7": 708, "11": 708},
        'BEVERAGE_1': {"9": 59, "10": 59},
        'BEVERAGE_2': {"9": 236, "10": 236},
        'BEVERAGE_3': {"9": 708, "10": 708},
        'FIELD_1': {"8": 59, "10": 59},
        'FIELD_2': {"8": 236, "10": 236},
        'FIELD_3': {"8": 708, "10": 708},
        'BUCKET_1': {"9": 59, "7": 30, "10": 30},
        'BUCKET_2': {"9": 236, "7": 118, "10": 118},
        'BUCKET_3': {"9": 708, "7": 354, "10": 354},
        'TRAP_1': {"7": 59, "12": 59},
        'TRAP_2': {"7": 236, "12": 236},
        'TRAP_3': {"7": 708, "12": 708}
    }
    return mapping[kind]
}

SoFlatBuildManager.loadBuilds = function(savefileId) {
    // load builds infos from BuildsInfos.json
    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var loadData = fs.readFileSync(
        path.join(savePath, 'BuildsInfos' + ("000" + savefileId).slice(-3) + '.json'))
    var buildsInfos = JSON.parse(loadData.toString())

    for (var idx in buildsInfos) {
        if (buildsInfos[idx]) {
            // new Object
            let obj = SoFlatBuildManager.kindMapping(buildsInfos[idx].kind)
            new obj(
                buildsInfos[idx].mapId,
                buildsInfos[idx].x,
                buildsInfos[idx].y,
                buildsInfos[idx].eventId,
                buildsInfos[idx].countDown,
                buildsInfos[idx].itemId
            )
        }
    }
    return true
}

SoFlatBuildManager.saveBuilds = function(savefileId) {
    // 覆蓋原檔!!
    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var filePath = path.join(savePath, 'BuildsInfos' + ("000" + savefileId).slice(-3) + '.json')
    fs.writeFileSync(
        filePath,
        JSON.stringify([]))

    for (var idx = 0; idx < $soflatBuilds.length; idx++) {
        if ($soflatBuilds[idx]) {
            var tmp = $soflatBuilds[idx]
            tmp.writeToFile(savefileId)
        }
    }
    return true
}

// 以防萬一，開啟一輪新遊戲時重置所有地圖
SoFlatBuildManager.clearBuilds = function() {
    var path = require('path')
    var fs = require('fs')
    var protectPath = path.join(path.dirname(process.mainModule.filename), 'data', 'protect/')
    var dataPath = path.join(path.dirname(process.mainModule.filename), 'data/')
    for (var mapId = 1; mapId < $dataMapInfos.length; mapId++) {
        var filePath = path.join(protectPath, 'Map' + ("000" + mapId).slice(-3) + '.json')
        if ($dataMapInfos[mapId] && fs.existsSync(filePath)) {
            var protectData = fs.readFileSync(filePath)
            protectData = JSON.parse(protectData.toString())
            fs.writeFileSync(
                path.join(dataPath, 'Map' + ("000" + mapId).slice(-3) + '.json'),
                JSON.stringify(protectData))
        }
    }
}

SoFlatBuildManager.startBuildPreview = function() {
    $isBuilding = true
    let build_x, build_y, image_x, image_y
    [build_x, build_y, image_x, image_y] = SoFlatBuildManager.getBuildPreviewXY()
    
    $gameScreen.showPicture(
        pictureId = 8,
        name = "設施位置預覽",
        origin = 1,
        x = image_x, y = image_y,
        scaleX = 100, scaleY = 100,
        opacity = 128, blendMode = 0)
}

SoFlatBuildManager.getBuildPreviewXY = function() {
    let build_x = $gamePlayer.x
    let build_y = $gamePlayer.y
    switch ($gamePlayer.direction()) {
        case 8:  // 上
            build_y = build_y - 1
            break
        case 2:  // 下
            build_y = build_y + 2
            break
        case 4:  // 左
            build_x = build_x - 2
            break
        case 6:  // 右
            build_x = build_x + 1
            break    
    }
    // 那個行走圖的位置會往左上飄移一點點，我也不知道為什麼
    let image_x = (build_x - $gameMap._displayX + 1 - 0.5) * 48
    let image_y = (build_y - $gameMap._displayY) * 48 - 5    // magic
    
    return [build_x, build_y, image_x, image_y]
}

SoFlatBuildManager.updateBuildPreviewImage = function() {
    // 正在選建造位置: 瘋狂刷新
    if ($isBuilding) {
        // 按了取消: 不建了
        if (Input.isTriggered('shift')) {
            $gameScreen.erasePicture(8)
            $isBuilding = false
            $gameSystem.enableMenu()
            return
        }

        // 更新預覽圖位置
        let build_x, build_y, image_x, image_y
        [build_x, build_y, image_x, image_y] = SoFlatBuildManager.getBuildPreviewXY()
        
        // 只有在該位置可放置設施時才顯示預覽圖
        if ($gameMap.isAllDirectionPassable(build_x, build_y) && $gameMap.isAllDirectionPassable(build_x + 1, build_y) && 
            !$gameMap.isAnyEventHere(build_x, build_y) && !$gameMap.isAnyEventHere(build_x + 1, build_y)) {
            $gameScreen.movePicture(
                pictureId = 8,
                origin = 1,
                x = image_x, y = image_y,
                scaleX = 100, scaleY = 100,
                opacity = 128, blendMode = 0, duration = 5)
            
            // 按下確定: 建造
            if (Input.isTriggered('ok')) {
                SoFlatBuildManager.createBuild(build_x, build_y)

                // 重新啟用選單訪問
                $gameSystem.enableMenu()

                return
            }
        // 該位置有其他事件或為不可行走地形: 隱藏預覽圖
        } else {
            $gameScreen.movePicture(
                pictureId = 8,
                origin = 1,
                x = image_x, y = image_y,
                scaleX = 100, scaleY = 100,
                opacity = 0, blendMode = 0, duration = 1)
        }
    }
}

// 確定建造
SoFlatBuildManager.createBuild = function(build_x, build_y) {
    let obj = SoFlatBuildManager.kindMapping($isBuildingKind)

    // 建材夠嗎
    let itemRecipe = SoFlatBuildManager.recipeMapping($isBuildingKind)
    for (var recipeItemId in itemRecipe) {
        let recipeItemNum = itemRecipe[recipeItemId]
        recipeItemId = parseInt(recipeItemId)
        
        let recipeItem = $dataItems[recipeItemId]
        if (!$gameParty.hasItem(recipeItem) || ($gameParty.numItems(recipeItem) < recipeItemNum)) {
            SoFlat_CharacterDialog.noEnoughResource($gameParty._actors[0])
            $gameScreen.erasePicture(8)
            $isBuilding = false
            return -1
        }
    }

    // 檢視原料: 確定有這些原料，扣減玩家原料
    for (var recipeItemId in itemRecipe) {
        let recipeItemNum = itemRecipe[recipeItemId]
        recipeItemId = parseInt(recipeItemId)
        let recipeItem = $dataItems[recipeItemId]
        $gameParty.loseItem(recipeItem, recipeItemNum)
    }

    let tmp = new obj($gameMap.mapId(), build_x, build_y)

    // 眼睛業障重: 移動到其他map才能刷新地圖
    let now_mapId = $gameMap.mapId()
    let now_x = $gamePlayer.x
    let now_y = $gamePlayer.y
    let now_tone = $gameScreen.tone().clone()  // 氧化鈣
    $gameScreen.startTint([-255, -255, -255, 0], 60)
    setTimeout(function() {
        $gamePlayer.reserveTransfer(2, 1, 1, 0, 2)
    }.bind(this), delay = 1000)
    setTimeout(function() {
        AudioManager.playSe({'name': "Bell2", "pan": 0, 'pitch':100, 'volume': 100})
    }.bind(this), delay = 1500)
    setTimeout(function() {
        AudioManager.playSe({'name': "Bell2", "pan": 0, 'pitch':100, 'volume': 100})
    }.bind(this), delay = 2500)
    setTimeout(function() {
        $gamePlayer.reserveTransfer(now_mapId, now_x, now_y, 0, 2)
    }.bind(this), delay = 2500)
    setTimeout(function() {
        $gameScreen.startTint(now_tone, 60)
    }.bind(this), delay = 3500)
    
    $gameScreen.erasePicture(8)
    $isBuilding = false
}

// 刪除設施
SoFlatBuildManager.removeBuild = function(build) {
    // 刪除$soflatBuilds裡的build
    $soflatBuilds[build.buildId()] = null

    // 刪除地圖上的build
    var path = require('path')
    var fs = require('fs')
    var dataPath = path.join(path.dirname(process.mainModule.filename), 'data/')
    var mapInfo = fs.readFileSync(
        path.join(dataPath, 'Map' + ("000" + build.mapId()).slice(-3) + '.json'))
    mapInfo = JSON.parse(mapInfo.toString())
    for (var idx in mapInfo.events) {
        if (mapInfo.events[idx] &&
            mapInfo.events[idx].constructor.name === "Object" &&
            mapInfo.events[idx].hasOwnProperty('id')) {
            if (mapInfo.events[idx].id === build.eventId()) {
                mapInfo.events[idx] = null
                fs.writeFileSync(
                    path.join(dataPath, 'Map' + ("000" + build.mapId()).slice(-3) + '.json'),
                    JSON.stringify(mapInfo))
                break
            }
        }
    }
}

//藉由mapId和eventId找到被觸發的設施，並回傳該設施物件
SoFlatBuildManager.findTriggerBuild = function(mapId, eventId) {
    for (var idx in $soflatBuilds) {
        if ($soflatBuilds[idx] &&
            $soflatBuilds[idx].mapId() === mapId && 
            $soflatBuilds[idx].eventId() === eventId)
            return $soflatBuilds[idx]
    }
    return null
}

// 檢查每個設施是否在製作物品，有的話扣減倒數時間
SoFlatBuildManager.updateBuildStatus = function() {
    for (var idx in $soflatBuilds) {
        if ($soflatBuilds[idx]) {
            $soflatBuilds[idx].updateStatus()
        }
    }
}


//-----------------------------------------------------------------------------
// SoFlatBuildManager
//
// 管理所有設施的static class。

var $soflatChaseEvent = null    // 一次是不是只會有一個追逐事件啊
var $soflatChaseEventTriggerDate = -1    // 每天只能觸發一次

function SoFlatChaseEventManager() {
    throw new Error('This is a static class')
}

SoFlatChaseEventManager.updateChaseEvent = function() {
    if ($soflatChaseEvent) {
        // 4點: 該消失了
        if ($gameVariables.value(4) === 4) {
            $soflatChaseEvent.stop()
            $soflatChaseEvent = null
        } else {
            $soflatChaseEvent.update()
        }
    }
}


//-----------------------------------------------------------------------------
// DataManager
//
// 覆寫存讀檔，加入讀取/儲存設施資訊的功能

DataManager.saveGame = function(savefileId) {
    try {
        StorageManager.backup(savefileId);
        return SoFlatBuildManager.saveBuilds(savefileId) && 
            SoFlatRebornEventManager.saveRebornEvents(savefileId) &&
            this.saveGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
};

DataManager.loadGame = function(savefileId) {
    try {
        SoFlatBuildManager.clearBuilds();
        $soflatRebornEvents = []
        $soflatBuilds = []
        return SoFlatBuildManager.loadBuilds(savefileId) && 
            SoFlatRebornEventManager.loadRebornEvents(savefileId) &&
            this.loadGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        return false;
    }
};
