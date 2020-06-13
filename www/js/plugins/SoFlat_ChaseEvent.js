AStar = function(start, goal) {
    Heuristic = function(s, g) {
        return Math.sqrt(Math.pow(g.x - s.x, 2) + Math.pow(g.y - s.y, 2))
    }
    
    buildGoingTo = function(route, s, g) {
        var goingTo = {}
        var nowNode = g
        while (nowNode.x !== s.x || nowNode.y !== s.y) {
            goingTo[JSON.stringify(route[JSON.stringify(nowNode)])] = nowNode
            nowNode = route[JSON.stringify(nowNode)]
        }
        return goingTo
    }
    
    var closedSet = []      // 已經搜尋過的
    var openSet = [start]   // 即將被搜尋的
    var route = {}          // 途經路徑

    // 這三個是地圖的形狀
    var gScore = Array($dataMap.width + 1).fill(0).map(x => Array($dataMap.height + 1).fill(Infinity))
    var hScore = Array($dataMap.width + 1).fill(0).map(x => Array($dataMap.height + 1).fill(0))
    var fScore = Array($dataMap.width + 1).fill(0).map(x => Array($dataMap.height + 1).fill(Infinity))

    gScore[start.x][start.y] = 0
    hScore[start.x][start.y] = Heuristic(start, goal)
    fScore[start.x][start.y] = hScore[start.x][start.y]

    while (openSet.length !== 0) {
        // 找到openSet中fScore最小的
        let nodeFScore = openSet.map(node => {return fScore[node.x][node.y]})
        let searchNode = openSet[nodeFScore.indexOf(Math.min(...nodeFScore))]

        // 完結灑花
        if (searchNode.x === goal.x && searchNode.y === goal.y) {
            return buildGoingTo(route, start, goal)
        }

        openSet.splice(openSet.indexOf(searchNode), 1) // 從將搜尋中移除
        closedSet.push(searchNode)                  // 加入已搜尋

        // 把searchNode的鄰近8點都加入將搜尋
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                let neighborNode = {'x': searchNode.x + x, 'y': searchNode.y + y}

                if (neighborNode.x < 1 || neighborNode.x > $dataMap.width)
                    continue
                if (neighborNode.y < 1 || neighborNode.y > $dataMap.height)
                    continue
                if (!$gameMap.isAllDirectionPassable(neighborNode.x, neighborNode.y))
                    continue
                if ($gameMap.isAnyEventHere(neighborNode.x, neighborNode.y))
                    continue

                var gScoreTmp = gScore[searchNode.x][searchNode.y] + 1
                if (gScoreTmp < gScore[neighborNode.x][neighborNode.y]) {
                    // 這條比我曾經走過的那條好!!
                    route[JSON.stringify(neighborNode)] = searchNode
                    gScore[neighborNode.x][neighborNode.y] = gScoreTmp
                    fScore[neighborNode.x][neighborNode.y] = gScoreTmp + Heuristic(neighborNode, goal)
                    if (!closedSet.some(node => {return node.x === neighborNode.x && node.y === neighborNode.y}))
                        openSet.push(neighborNode)
                }
            }
        }
    }
    return false
}

moveDirection = function(start, goal) {
    var dirMap = {
        "2": {'x':  0, 'y':  1},
        "4": {'x': -1, 'y':  0},
        "6": {'x':  1, 'y':  0},
        "8": {'x':  0, 'y': -1},
        "[4, 2]": {'x': -1, 'y':  1},
        "[6, 2]": {'x':  1, 'y':  1},
        "[4, 8]": {'x': -1, 'y': -1},
        "[6, 8]": {'x':  1, 'y': -1},
    }

    for (var idx in Object.keys(dirMap)) {
        var dir = Object.keys(dirMap)[idx]
        if (start.x + dirMap[dir].x === goal.x &&
            start.y + dirMap[dir].y === goal.y)
            return JSON.parse(dir)
    }
    return false
}

ifCanSeePlayer = function(chaser) {
    // 先判斷與玩家之間是否有任何遮擋物
    var deltaX = $gamePlayer.x - chaser._XY.x
    var deltaY = $gamePlayer.y - chaser._XY.y

    if ((deltaX * deltaX + deltaY * deltaY) > 36)
        return false
    return true
}


//-----------------------------------------------------------------------------
// Soflat_ChaseEvent
//
// 所有設施的父類。

function Soflat_ChaseEvent() {
	this.initialize.apply(this, arguments);
}

Soflat_ChaseEvent.prototype.constructor = Soflat_ChaseEvent;

Soflat_ChaseEvent.prototype.initialize = function(event) {
    this._event = event
    this._XY = {'x': event.x, 'y': event.y}
    this._playerXY = {'x': -1, 'y': -1}
    this._goingTo = {}
    this._activate = false
}

Soflat_ChaseEvent.prototype.start = function() {
    // 今天觸發過了->放過他吧
    if ($soflatChaseEventTriggerDate === $gameVariables.value(3)) {
        return
    }

    $soflatChaseEventTriggerDate = $gameVariables.value(3)

    // 轉頭看主角、自開關打開->顯示圖像
    this._event.turnTowardCharacter($gamePlayer)
	$gameSelfSwitches.setValue([this._event._mapId, this._event.eventId(), 'A'], true)

    // 主角轉頭過去看、倒退一步
    $gamePlayer.turnTowardCharacter(this._event)
    setTimeout(function() {
        $gamePlayer.setDirectionFix(true)
        $gamePlayer.moveAwayFromCharacter(this._event)
        $gamePlayer.setDirectionFix(false)
    }.bind(this), delay = 1000)

    // 等個兩秒->開始移動、BGM開啟
    setTimeout(function() {
        this._activate = true
        AudioManager.playBgm({
            name: 'HS_horor',
            pan: 0,
            pitch: 100,
            volume: 40
        })
    }.bind(this), delay = 2000)
}

Soflat_ChaseEvent.prototype.stop = function() {
    this._activate = false
    AudioManager.fadeOutBgm(5)
    this._event.setOpacity(200)
    setTimeout(function() {
        this._event.setOpacity(150)
    }.bind(this), delay = 250)
    setTimeout(function() {
        this._event.setOpacity(100)
    }.bind(this), delay = 500)
    setTimeout(function() {
        this._event.setOpacity(50)
    }.bind(this), delay = 750)
    setTimeout(function() {
        $gameSelfSwitches.setValue([this._event._mapId, this._event.eventId(), 'A'], false)
        this._event.setOpacity(255)
    }.bind(this), delay = 1000)
}

Soflat_ChaseEvent.prototype.catchUp = function() {
    this.stop()
    // $gameSelfSwitches.setValue([this._event._mapId, this._event.eventId(), 'B'], true)
    $gameTemp.reserveCommonEvent(19)
    setTimeout(function() {
       $gameTemp.reserveCommonEvent(20)
    }.bind(this), delay = 10000)
}

Soflat_ChaseEvent.prototype.update = function() {
    // 沒在activate
    if (!this._activate)
        return

    // 還在移動: 動完再說吧
    if (this._event.isMoving())
        return

    // 撞到玩家了
    if ((($gamePlayer.x - this._event.x) * ($gamePlayer.x - this._event.x) +
        ($gamePlayer.y - this._event.y) * ($gamePlayer.y - this._event.y)) <= 1) {
        this.catchUp()
    }

    // 我和上一次相比沒有移動
    // if (this._XY.x === this._event.x &&
        // this._XY.y === this._event.y) {
        // return
    // }

    this._XY = {'x': this._event.x, 'y': this._event.y}

    if (this._playerXY.x === $gamePlayer.x &&
        this._playerXY.y === $gamePlayer.y) {
        // 玩家位置沒變，路徑不變
    } else {
        // 玩家位置動了
        // 先看看能不能看見玩家
        if (ifCanSeePlayer(this)) {
            // 看得見: 更新玩家位置
            this._playerXY = {'x': $gamePlayer.x, 'y': $gamePlayer.y}
            this._goingTo = AStar(this._XY, this._playerXY)
        } else {
        //    認為玩家還在原地
        }
    }

    if (Object.keys(this._goingTo).length > 0) {
        // 預定路徑還沒跑完: 照著路徑跑
        var goingToXY = this._goingTo[JSON.stringify(this._XY)]
        var dir = moveDirection(this._XY, goingToXY)
        
        if (dir.constructor.name === "Number") {
            this._event.moveStraight(dir)
        } else {
            this._event.moveDiagonally(dir[0], dir[1])
        }

        delete this._goingTo[JSON.stringify(this._XY)]
    } else {
        // 跑完但沒追到玩家: 隨機亂走
        this._event.moveRandom()
    }
}

// 把該事件移動到主角附近
Soflat_ChaseEvent.prototype.moveNearPlayer = function() {
    // 嘗試3次看看能不能放在主角周圍，不行就算了
    for (var time = 0; time < 3; time++) {
        // 位移在3~5 || -3~-5之間
        var deltaX = 0
        var deltaY = 0
        if (Math.floor(Math.random()*2) === 0)
            deltaX = (Math.floor(Math.random()*3)+3) * (Math.floor(Math.random()*2) === 0? -1: 1)
        else
            deltaY = (Math.floor(Math.random()*3)+3) * (Math.floor(Math.random()*2) === 0? -1: 1)

        if ($gameMap.isAllDirectionPassable($gamePlayer.x + deltaX, $gamePlayer.y + deltaY) &&
            !$gameMap.isAnyEventHere($gamePlayer.x + deltaX, $gamePlayer.y + deltaY)) {
            this._event.setPosition($gamePlayer.x + deltaX, $gamePlayer.y + deltaY)
            return true
        }
    }
    return false
}
