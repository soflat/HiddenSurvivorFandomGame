
//-----------------------------------------------------------------------------
// SoFlat_Build
//
// 所有設施的父類。

function SoFlat_Build() {
	this.initialize.apply(this, arguments);
}

SoFlat_Build.prototype.constructor = SoFlat_Build;

SoFlat_Build.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
	this._mapId = mapId                 // 在哪張地圖上
    this._eventId = eventId             // 在那張地圖上的eventId是?
	this._x = x                         // 在地圖上的X位置
    this._y = y                         // 在地圖上的Y位置
    
    this._kind = this._kind? this._kind: "BASE"     // 哪種類型的設施
    this.setMotherInfo(2, 2)                        // 從哪張地圖的哪個事件clone過來
    
    // 該在地圖上卻不在: 放進地圖，順便如果eventId變動了就更新一下
    if (!this.isOnMap())
        this._eventId = this.addToMap()

    this._countDown = countDown         // 距離產出物品還有多久?
    this._itemId = itemId               // 正在產出哪個物品?
    
    this._buildId = this.pushToArray()  // 在$soflatBuilds的Id
}

SoFlat_Build.prototype.setMotherInfo = function(mapId, eventId) {
    this._motherMapId = this._motherMapId? this._motherMapId: mapId
    this._motherEventId = this._motherEventId? this._motherEventId: eventId
}

SoFlat_Build.prototype.mapId = function() {
    return this._mapId
}

SoFlat_Build.prototype.eventId = function() {
    return this._eventId
}

SoFlat_Build.prototype.x = function() {
    return this._x
}

SoFlat_Build.prototype.y = function() {
    return this._y
}

SoFlat_Build.prototype.countDown = function() {
    return this._countDown
}

SoFlat_Build.prototype.buildId = function() {
    return this._buildId
}

SoFlat_Build.prototype.itemId = function() {
    return this._itemId
}

// 將此設施推進$soflatBuilds裡
SoFlat_Build.prototype.pushToArray = function() {
    $soflatBuilds.push(this)
    return $soflatBuilds.length - 1
}

// 將此設施放在Map上
SoFlat_Build.prototype.addToMap = function() {
    // load mother event's info
    var path = require('path')
    var fs = require('fs')
    var dataPath = path.join(path.dirname(process.mainModule.filename), 'data/')
    var mapInfo = fs.readFileSync(
        path.join(dataPath, 'Map' + ("000" + this._motherMapId).slice(-3) + '.json'))
    mapInfo = JSON.parse(mapInfo.toString())
    var motherEvent = mapInfo.events[this._motherEventId]
    
    // load target map
    var mapInfo = fs.readFileSync(
        path.join(dataPath, 'Map' + ("000" + this._mapId).slice(-3) + '.json'))
    mapInfo = JSON.parse(mapInfo.toString())
    
    // 取得這個設施在地圖上的eventId
    let eventId = mapInfo.events.length
    
    // modify id, x, y
    var childEvent = motherEvent
    childEvent.id = eventId
    childEvent.x = this._x
    childEvent.y = this._y

    // write to target map
    mapInfo.events.push(childEvent)
    fs.writeFileSync(
        path.join(dataPath, 'Map' + ("000" + this._mapId).slice(-3) + '.json'),
        JSON.stringify(mapInfo))

    return eventId
}

// 地圖上有沒有這個設施?
SoFlat_Build.prototype.isOnMap = function() {
    if (this._eventId == null)
        return false
    
    // load target map
    var path = require('path')
    var fs = require('fs')
    var dataPath = path.join(path.dirname(process.mainModule.filename), 'data/')
    var mapInfo = fs.readFileSync(
        path.join(dataPath, 'Map' + ("000" + this._mapId).slice(-3) + '.json'))
    mapInfo = JSON.parse(mapInfo.toString())
    
    // if this map has this eventId: is on map
    if (mapInfo.events.length > this._eventId)
        return true
    return false
}

// 將設施資訊寫入紀錄檔
SoFlat_Build.prototype.writeToFile = function(savefileId) {
    var buildInfo = {
        "mapId": this._mapId,
        "eventId": this._eventId,
        "x": this._x,
        "y": this._y,
        "kind": this._kind,
        "countDown": this._countDown,
        "itemId": this._itemId
    }
    
    // load builds infos from BuildsInfos<savefileId>.json (if any)
    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var filePath = path.join(savePath, 'BuildsInfos' + ("000" + savefileId).slice(-3) + '.json')
    var buildsInfos = []
    if (fs.existsSync(filePath)) {
        var loadData = fs.readFileSync(filePath)
        var buildsInfos = JSON.parse(loadData.toString())
    }

    // write this new build's info back to BuildsInfos.json
    buildsInfos.push(buildInfo)
    fs.writeFileSync(filePath,
                     JSON.stringify(buildsInfos))
}

SoFlat_Build.prototype.start = function() {
    throw new Error("Not Implement Error")
}

SoFlat_Build.prototype.upgrade = function(newBuildKind) {
    $isBuildingKind = newBuildKind
    SoFlatBuildManager.removeBuild(this)
    SoFlatBuildManager.createBuild(this._x, this._y)
}

SoFlat_Build.prototype.updateStatus = function() {
    // countDown > 0: 有在倒數
    if (this._countDown > 0) {
        this._countDown--
        if (this._countDown <= 0) {
            // 把設施圖片換成製作完成
            $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], true)
            $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], false)
        }
    }
}


//-----------------------------------------------------------------------------
// SoFlat_BuildManufacture
//
// 所有製造類設施（瓦斯爐、飲水機等）的父類。

function SoFlat_BuildManufacture() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildManufacture.prototype = Object.create(SoFlat_Build.prototype)
SoFlat_BuildManufacture.prototype.constructor = SoFlat_BuildManufacture;

SoFlat_BuildManufacture.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    SoFlat_Build.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildManufacture.prototype.makeItem = function(itemId, countDown) {
    let item = $dataItems[itemId]
    let itemNote = JSON.parse($dataItems[itemId].note)
    let itemRecipe = itemNote.recipe
    
    // 檢視食譜內原料: 玩家有這個原料嗎? 數量夠嗎? 沒有的話return -1
    for (var recipeItemId in itemRecipe) {
        let recipeItemNum = itemRecipe[recipeItemId]
        recipeItemId = parseInt(recipeItemId)
        
        let recipeItem = $dataItems[recipeItemId]
        if (!$gameParty.hasItem(recipeItem) || ($gameParty.numItems(recipeItem) < recipeItemNum)) {
            SoFlat_CharacterDialog.noEnoughResource($gameParty._actors[0])
            return -1
        }
    }

    // 檢視食譜內原料: 確定有這些原料，扣減玩家原料
    for (var recipeItemId in itemRecipe) {
        let recipeItemNum = itemRecipe[recipeItemId]
        recipeItemId = parseInt(recipeItemId)
        let recipeItem = $dataItems[recipeItemId]
        $gameParty.loseItem(recipeItem, recipeItemNum)
    }
    
    // 把設施圖片換成製作物品中
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], true)
    
    // 保存製作物品的Id，並開始倒數
    this._itemId = itemId
    this._countDown = countDown
}

SoFlat_BuildManufacture.prototype.upgrade = function(newBuildKind) {
    SoFlat_Build.prototype.upgrade.call(this, newBuildKind)
}

SoFlat_BuildManufacture.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 1)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}


//-----------------------------------------------------------------------------
// SoFlat_BuildProduce
//
// 所有生產類設施（菜圃、捕獸夾等）的父類。

function SoFlat_BuildProduce() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildProduce.prototype = Object.create(SoFlat_Build.prototype)
SoFlat_BuildProduce.prototype.constructor = SoFlat_BuildProduce;

SoFlat_BuildProduce.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    SoFlat_Build.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
    this._maxCountDown = countDown   // 記住生長時間
    this._countDown = 0              // 還沒要開始長XD
}

SoFlat_BuildProduce.prototype.maxCountDown = function() {
    return this._maxCountDown
}

SoFlat_BuildProduce.prototype.upgrade = function(newBuildKind) {
    SoFlat_Build.prototype.upgrade.call(this, newBuildKind)
}

// 需特定動作觸發生產
SoFlat_BuildProduce.prototype.startProduce = function() {
    // 開始倒數
    this._countDown = this._maxCountDown
    
    // 把設施圖片換成製作物品中
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], true)
}

SoFlat_BuildProduce.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 1)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}


//-----------------------------------------------------------------------------
// SoFlat_BuildCollect
//
// 所有收集類設施（集水桶等）的父類。

function SoFlat_BuildCollect() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildCollect.prototype = Object.create(SoFlat_Build.prototype)
SoFlat_BuildCollect.prototype.constructor = SoFlat_BuildCollect;

SoFlat_BuildCollect.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1, maxAccumulate = 0) {
    SoFlat_Build.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
    this._maxAccumulate = maxAccumulate // 最大能收集多少物品
    this._maxCountDown = countDown      // 記住生長時間
    this._accumulateItemCount = 0       // 目前收集了多少物品
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], true)
}

SoFlat_BuildCollect.prototype.maxCountDown = function() {
    return this._maxCountDown
}

SoFlat_BuildCollect.prototype.maxAccumulate = function() {
    return this._maxAccumulate
}

SoFlat_BuildCollect.prototype.upgrade = function(newBuildKind) {
    SoFlat_Build.prototype.upgrade.call(this, newBuildKind)
}

SoFlat_BuildCollect.prototype.updateStatus = function() {
    // countDown > 0: 有在倒數
    if (this._countDown > 0) {
        this._countDown--
        if (this._countDown <= 0) {
            this._accumulateItemCount += 1

            if (this._accumulateItemCount < this._maxAccumulate) {
                // 還沒滿: 繼續收集
                this._countDown = this._maxCountDown
            } else {
                // 滿了: 停止收集
                $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], true)
                $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], false)
            }
        }
    }
}

SoFlat_BuildCollect.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, this._accumulateItemCount)
    
    // 取出前水是滿的: 重新開始儲水
    if (this._accumulateItemCount >= this._maxAccumulate) {
        $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
        $gameSelfSwitches.setValue([this._mapId, this._eventId, 'A'], true)
        this._countDown = this._maxCountDown
    }
    this._accumulateItemCount = 0
}


//-----------------------------------------------------------------------------
// SoFlat_BuildFood1
//
// 一級食物設施 = 瓦斯爐。

function SoFlat_BuildFood1() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildFood1.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildFood1.prototype.constructor = SoFlat_BuildFood1;

SoFlat_BuildFood1.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "FOOD_1"
    this.setMotherInfo(2, 3)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildFood1.prototype.upgrade = function() {
    SoFlat_BuildManufacture.prototype.upgrade.call(this, 'FOOD_2')
}

SoFlat_BuildFood1.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildFood2
//
// 二級食物設施 = 玻璃檯面爐。

function SoFlat_BuildFood2() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildFood2.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildFood2.prototype.constructor = SoFlat_BuildFood2;

SoFlat_BuildFood2.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "FOOD_2"
    this.setMotherInfo(2, 4)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildFood2.prototype.upgrade = function() {
    SoFlat_BuildManufacture.prototype.upgrade.call(this, 'FOOD_3')
}

SoFlat_BuildFood2.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildFood3
//
// 三級食物設施 = 電陶爐

function SoFlat_BuildFood3() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildFood3.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildFood3.prototype.constructor = SoFlat_BuildFood3;

SoFlat_BuildFood3.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "FOOD_3"
    this.setMotherInfo(2, 5)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildFood3.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBeverage1
//
// 一級飲料設施 = 飲料桶

function SoFlat_BuildBeverage1() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBeverage1.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildBeverage1.prototype.constructor = SoFlat_BuildBeverage1;

SoFlat_BuildBeverage1.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "BEVERAGE_1"
    this.setMotherInfo(2, 6)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildBeverage1.prototype.upgrade = function() {
    SoFlat_BuildManufacture.prototype.upgrade.call(this, 'BEVERAGE_2')
}

SoFlat_BuildBeverage1.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBeverage2
//
// 二級飲料設施 = 玻璃飲料桶

function SoFlat_BuildBeverage2() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBeverage2.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildBeverage2.prototype.constructor = SoFlat_BuildBeverage2;

SoFlat_BuildBeverage2.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "BEVERAGE_2"
    this.setMotherInfo(2, 7)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildBeverage2.prototype.upgrade = function() {
    SoFlat_BuildManufacture.prototype.upgrade.call(this, 'BEVERAGE_3')
}

SoFlat_BuildBeverage2.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBeverage3
//
// 三級飲料設施 = 多功能咖啡機

function SoFlat_BuildBeverage3() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBeverage3.prototype = Object.create(SoFlat_BuildManufacture.prototype)
SoFlat_BuildBeverage3.prototype.constructor = SoFlat_BuildBeverage3;

SoFlat_BuildBeverage3.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 0, itemId = -1) {
    this._kind = "BEVERAGE_3"
    this.setMotherInfo(2, 8)
    SoFlat_BuildManufacture.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildBeverage3.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildField1
//
// 一級菜圃設施：菜圃
// 3天給10個蔬菜 = 180秒給10個蔬菜

function SoFlat_BuildField1() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildField1.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildField1.prototype.constructor = SoFlat_BuildField1;

SoFlat_BuildField1.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 4) {
    this._kind = "FIELD_1"
    this.setMotherInfo(2, 9)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildField1.prototype.upgrade = function() {
    SoFlat_BuildProduce.prototype.upgrade.call(this, 'FIELD_2')
}

SoFlat_BuildField1.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildField1.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 10)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}

//-----------------------------------------------------------------------------
// SoFlat_BuildField2
//
// 二級菜圃設施：支架菜圃
// 3天給15個蔬菜 = 180秒給15個蔬菜

function SoFlat_BuildField2() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildField2.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildField2.prototype.constructor = SoFlat_BuildField2;

SoFlat_BuildField2.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 4) {
    this._kind = "FIELD_2"
    this.setMotherInfo(2, 10)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildField2.prototype.upgrade = function() {
    SoFlat_BuildProduce.prototype.upgrade.call(this, 'FIELD_3')
}

SoFlat_BuildField2.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildField2.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 15)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}

//-----------------------------------------------------------------------------
// SoFlat_BuildField3
//
// 三級菜圃設施：紅磚菜圃
// 3天給20個蔬菜 = 180秒給20個蔬菜

function SoFlat_BuildField3() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildField3.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildField3.prototype.constructor = SoFlat_BuildField3;

SoFlat_BuildField3.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 4) {
    this._kind = "FIELD_3"
    this.setMotherInfo(2, 11)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildField3.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildField3.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 20)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBucket1
//
// 一級集水桶設施：集水桶
// 3天給9個淨水 = 180秒給9個淨水 = 20秒給1個淨水

function SoFlat_BuildBucket1() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBucket1.prototype = Object.create(SoFlat_BuildCollect.prototype)
SoFlat_BuildBucket1.prototype.constructor = SoFlat_BuildBucket1;

SoFlat_BuildBucket1.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 20 * 60, itemId = 3) {
    this._kind = "BUCKET_1"
    this.setMotherInfo(2, 12)
    SoFlat_BuildCollect.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId, maxAccumulate=10)
}

SoFlat_BuildBucket1.prototype.upgrade = function() {
    SoFlat_BuildCollect.prototype.upgrade.call(this, 'BUCKET_2')
}

SoFlat_BuildBucket1.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBucket2
//
// 二級集水桶設施：集水塔
// 3天給13個淨水 = 180秒給13個淨水 = 13.8秒給1個淨水

function SoFlat_BuildBucket2() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBucket2.prototype = Object.create(SoFlat_BuildCollect.prototype)
SoFlat_BuildBucket2.prototype.constructor = SoFlat_BuildBucket2;

SoFlat_BuildBucket2.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 13.8 * 60, itemId = 3) {
    this._kind = "BUCKET_2"
    this.setMotherInfo(2, 13)
    SoFlat_BuildCollect.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId, maxAccumulate=13)
}

SoFlat_BuildBucket2.prototype.upgrade = function() {
    SoFlat_BuildCollect.prototype.upgrade.call(this, 'BUCKET_3')
}

SoFlat_BuildBucket2.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildBucket3
//
// 二級集水桶設施：工業用濾水器
// 3天給18個淨水 = 180秒給18個淨水 = 10秒給1個淨水

function SoFlat_BuildBucket3() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildBucket3.prototype = Object.create(SoFlat_BuildCollect.prototype)
SoFlat_BuildBucket3.prototype.constructor = SoFlat_BuildBucket3;

SoFlat_BuildBucket3.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 10 * 60, itemId = 3) {
    this._kind = "BUCKET_3"
    this.setMotherInfo(2, 14)
    SoFlat_BuildCollect.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId, maxAccumulate=18)
}

SoFlat_BuildBucket3.prototype.start = function() {
    // TODO: 選單...
}


//-----------------------------------------------------------------------------
// SoFlat_BuildTrap1
//
// 一級陷阱設施：簡易陷阱
// 3天給9個食物（小） = 180秒給9個食物（小）

function SoFlat_BuildTrap1() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildTrap1.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildTrap1.prototype.constructor = SoFlat_BuildTrap1;

SoFlat_BuildTrap1.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 1) {
    this._kind = "TRAP_1"
    this.setMotherInfo(2, 15)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildTrap1.prototype.upgrade = function() {
    SoFlat_BuildProduce.prototype.upgrade.call(this, 'TRAP_2')
}

SoFlat_BuildTrap1.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildTrap1.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 9)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}

//-----------------------------------------------------------------------------
// SoFlat_BuildTrap2
//
// 二級陷阱設施：捕鼠夾
// 3天給13個食物（小） = 180秒給13個食物（小）

function SoFlat_BuildTrap2() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildTrap2.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildTrap2.prototype.constructor = SoFlat_BuildTrap2;

SoFlat_BuildTrap2.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 1) {
    this._kind = "TRAP_2"
    this.setMotherInfo(2, 16)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildTrap2.prototype.upgrade = function() {
    SoFlat_BuildProduce.prototype.upgrade.call(this, 'TRAP_3')
}

SoFlat_BuildTrap2.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildTrap2.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 13)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}

//-----------------------------------------------------------------------------
// SoFlat_BuildTrap3
//
// 三級陷阱設施：捕獸夾
// 3天給18個食物（小） = 180秒給18個食物（小）

function SoFlat_BuildTrap3() {
	this.initialize.apply(this, arguments);
}

SoFlat_BuildTrap3.prototype = Object.create(SoFlat_BuildProduce.prototype)
SoFlat_BuildTrap3.prototype.constructor = SoFlat_BuildTrap3;

SoFlat_BuildTrap3.prototype.initialize = function(mapId, x, y, eventId=null, countDown = 180 * 60, itemId = 1) {
    this._kind = "TRAP_3"
    this.setMotherInfo(2, 17)
    SoFlat_BuildProduce.prototype.initialize.call(this, mapId, x, y, eventId, countDown, itemId)
}

SoFlat_BuildTrap3.prototype.start = function() {
    // TODO: 選單...
}

SoFlat_BuildTrap3.prototype.giveItem = function() {
    SoFlatItemManager.gainItem(this._itemId, 18)
    $gameSelfSwitches.setValue([this._mapId, this._eventId, 'B'], false)
}


//-----------------------------------------------------------------------------
// Game_Map
//
// 怎麼哪都有你?

Game_Map.prototype.isAllDirectionPassable = function(x, y) {
    let ret = true
    let dir = [2, 4, 6, 8]
    for (idx in dir)
        ret = ret && this.checkPassage(x, y, (1 << (dir[idx] / 2 - 1)) & 0x0f)
    return ret
};

Game_Map.prototype.isAnyEventHere = function(x, y) {
    let ret = false
    for (idx in $gameMap.events())
        ret = ret || ($gameMap.events()[idx]['_x'] === x && $gameMap.events()[idx]['_y'] === y)
    return ret
};