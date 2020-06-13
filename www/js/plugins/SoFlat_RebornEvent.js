function Soflat_RebornEvent() {
	this.initialize.apply(this, arguments);
}

Soflat_RebornEvent.prototype.constructor = Soflat_RebornEvent;

Soflat_RebornEvent.prototype.initialize = function(
        mapId, eventId, 
        rebornTime, 
        itemId, itemAmount, 
        lifeCycle="alive", deadTime=null) {
    this._mapId = mapId
    this._eventId = eventId

    // 重生時間相關
    this._rebornTime = rebornTime                      // 復活所需時間   
    this._deadTime = deadTime? deadTime: rebornTime    // 離上一次死去過了多久   
    this._lifeCycle = lifeCycle                        // 目前狀態: alive / dead
    
    // 採集獲得物品相關
    this._itemId = itemId          // 獲得哪種物資
    this._itemAmount = itemAmount  // 獲得數量
};

Soflat_RebornEvent.prototype.start = function() {
    if (this._deadTime >= this._rebornTime) {
        SoFlatItemManager.gainItem(this._itemId, this._itemAmount)
        this.dead()
    }
}

Soflat_RebornEvent.prototype.mapId = function() {
    return this._mapId
}

Soflat_RebornEvent.prototype.eventId = function() {
    return this._eventId
}

Soflat_RebornEvent.prototype.dead = function() {
	var selfSwitchKey = [this._mapId, this._eventId, 'A']
	$gameSelfSwitches.setValue(selfSwitchKey, true)
	this._deadTime = 0
	this._lifeCycle = "dead"
}

Soflat_RebornEvent.prototype.reborn = function() {
	var selfSwitchKey = [this._mapId, this._eventId, 'A']
	$gameSelfSwitches.setValue(selfSwitchKey, false)
	this._lifeCycle = "alive"
}

Soflat_RebornEvent.prototype.updateStatus = function() {
	this._deadTime = this._deadTime + 1
	if (this._lifeCycle === "dead")
		if (this._deadTime >= this._rebornTime)
			this.reborn()
}

Soflat_RebornEvent.prototype.writeToFile = function(savefileId) {
    var rebornEventInfo = {
        "mapId": this._mapId,
        "eventId": this._eventId,
        // "x": this._x,
        // "y": this._y,
        "rebornTime": this._rebornTime,
        "itemId": this._itemId,
        "itemAmount": this._itemAmount,
        "lifeCycle": this._lifeCycle,
        "deadTime": this._deadTime
    }

    var path = require('path')
    var fs = require('fs')
    var savePath = path.join(path.dirname(process.mainModule.filename), 'save/')
    var filePath = path.join(savePath, 'RebornEventsInfos' + ("000" + savefileId).slice(-3) + '.json')
    var rebornEventsInfos = []
    if (fs.existsSync(filePath)) {
        var loadData = fs.readFileSync(filePath)
        var rebornEventsInfos = JSON.parse(loadData.toString())
    }
    
    rebornEventsInfos.push(rebornEventInfo)
    fs.writeFileSync(filePath,
                     JSON.stringify(rebornEventsInfos))
}
