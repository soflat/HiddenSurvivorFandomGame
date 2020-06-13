//=============================================================================
// TMVplugin - 環形選單
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.4b
// 最終更新日: 2016/04/13
//=============================================================================

/*:
 * @plugindesc 添加可在地圖場景中使用的環狀命令。
 *
 * @author tomoaky(翻譯 : ReIris)
 *
 * @param useEscape
 * @text 使用選單鍵
 * @desc 使用 Esc 鍵處理選單
 * 預設 : 0 ( 1 為默認選單不起作用)
 * @default 0
 *
 * @param useCaption
 * @text 命令標題
 * @desc 在環狀命令中將命令名稱顯示
 * 預設 : 1 ( 0 為不顯示)
 * @default 1
 *
 * @param saveLastIndex
 * @text 記憶命令
 * @desc 記住最後選擇的命令
 * 預設 : 0 ( 1 為記住最後選擇命令 )
 * @default 0
 *
 * @param openResetIndex
 * @text 打開重置
 * @desc 每次使用環狀命令時初始化光標位置
 * 預設 : 0 ( 1 每次使用時都會初始化)
 * @default 0
 *
 * @param openGoldWindow
 * @text 打開金錢窗口
 * @desc 使用環狀命令時是否顯示金錢窗口
 * 預設 : 1 ( 0 不顯示 )
 * @default 1
 *
 * @param goldWindowX
 * @text 金錢窗口 X 座標
 * @desc 金錢窗口 X 座標
 * 預設 : 576
 * @default 576
 *
 * @param goldWindowY
 * @text 金錢窗口 Y 座標
 * @desc 金錢窗口 Y 座標
 * 預設 : 0
 * @default 0
 *
 * @param seOpenCommand
 * @text 開啟命令音效
 * @desc 環狀命令打開的聲音效果
 * 預設 : {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 *
 * @param seCloseCommand
 * @text 關閉命令音效
 * @desc 環狀命令關閉的聲音效果
 * 預設 : {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 *
 * @param commandIconItem
 * @text 道具圖標命令
 * @desc 道具圖標的編號
 * 預設 : 176
 * @default 176
 *
 * @param commandIconSkill
 * @text 技能圖標命令
 * @desc 技能圖標的編號
 * 預設 : 76
 * @default 76
 *
 * @param commandIconEquip
 * @text 裝備圖標命令
 * @desc 裝備圖標的編號
 * 預設 : 135
 * @default 135
 *
 * @param commandIconStatus
 * @text 狀態圖標命令
 * @desc 狀態圖標的編號
 * 預設 : 84
 * @default 84
 *
 * @param commandIconFormation
 * @text 隊伍圖標命令
 * @desc 隊伍圖標的編號
 * 預設 : 75
 * @default 75
 *
 * @param commandIconOptions
 * @text 設置圖標命令
 * @desc 設置圖標的編號
 * 預設 : 83
 * @default 83
 *
 * @param commandIconSave
 * @text 保存圖標命令
 * @desc 保存圖標的編號
 * 預設 : 225
 * @default 225
 *
 * @param commandIconGameEnd
 * @text 遊戲結束圖標命令
 * @desc 遊戲結束圖標的編號
 * 預設 : 82
 * @default 82
 *
 * @param commandIconGoldLevelUp
 * @text 金錢升級圖標
 * @desc 金錢升級圖標的編號
 * 預設 : 236 ( 僅在安裝 TMGoldLevelUp.js 時有效 )
 * @default 236
 *
 * @param rotateDuration
 * @text 圖標移動時間
 * @desc 圖標移動時間
 * 預設 : 4（幀數）
 * @default 4
 *
 * @param iconDistX
 * @text 圖標 X 範圍
 * @desc 圖標空間（水平方向）
 * 預設 : 16
 * @default 16
 *
 * @param iconDistY
 * @text 圖標 Y 範圍
 * @desc 圖標空間（垂直方向）
 * 預設 : 12
 * @default 12
 *
 * @param iconSelectScale
 * @text 圖標選擇縮放大小
 * @desc 選択中アイコンの拡大率補正
 * 預設 : 1.5
 * @default 1.5
 *
 * @param captionWidth
 * @text 標題寬度
 * @desc 標題寬度
 * 預設 : 200
 * @default 200
 *
 * @param captionHeight
 * @text 標題高度
 * @desc 標題高度
 * 預設 : 48
 * @default 48
 *
 * @param captionShiftX
 * @text 標題 X 座標補正
 * @desc 標題 X 座標補正
 * 預設 : 0
 * @default 0
 *
 * @param captionShiftY
 * @text 標題 Y 座標補正
 * @desc 標題 Y 座標補正
 * 預設 : -96
 * @default -96
 *
 * @help
 * 在地圖畫面中按 Ctrl 或 Alt 鍵時，會顯示一個環狀命令。
 * 使用 ← → 旋轉，然後使用 Z / Enter / Space 移動到每個選單畫面。
 *
 * 如果「使用選單鍵」設置為 1，則禁用 Ctrl（Alt） 操作，並且可以通過
 * Esc / X / Insert / Num 0 /右鍵單擊等打開和關閉環狀命令，如默認選單中。
 * 在這種情況下，不需要按住鍵。
 *
 * 使用滑鼠操作時，單擊玩家的左側或右側可以在每個方向上旋轉環，
 * 然後在玩家附近單擊將移動到與前面的命令圖標對應的場景。
 * 點擊坐標判斷僅在水平方向上，並且響應畫面上的任何點擊。
 *
 * 注意：使用環狀命令時，事件將會繼續移動。
 * 只有在進入選單畫面(EX : 道具畫面、技能畫面)時才會暫停。
 *
 * 沒有插件命令。
 *
 * 與 TMGoldLevelUp.js 一起使用時（使用金錢升級），
 * TMGoldLevelUp.js 的版本必須為 Ver1.11 或更高版本。
 *
 *　作者：tomoaky
 *   網站：https://hikimoki.sakura.ne.jp/
 *   推特：https://twitter.com/tomoaky
 * 
 */

var Imported = Imported || {};
Imported.TMRingCommand = true;

(function() {

  var parameters = PluginManager.parameters('TMRingCommand');
  var useEscape      = parameters['useEscape'] === '1' ? true : false;
  var useCaption     = parameters['useCaption'] === '1' ? true : false;
  var saveLastIndex  = parameters['saveLastIndex'] === '1' ? true : false;
  var openResetIndex = parameters['openResetIndex'] === '1' ? true : false;
  var openGoldWindow = parameters['openGoldWindow'] === '1' ? true : false;
  var goldWindowX = Number(parameters['goldWindowX']);
  var goldWindowY = Number(parameters['goldWindowY']);
  var seOpenCommand = (new Function("return " + parameters['seOpenCommand']))();
  var seCloseCommand = (new Function("return " + parameters['seCloseCommand']))();
  var commandIcon = {};
  commandIcon['item']      = Number(parameters['commandIconItem']);
  commandIcon['skill']     = Number(parameters['commandIconSkill']);
  commandIcon['equip']     = Number(parameters['commandIconEquip']);
  commandIcon['status']    = Number(parameters['commandIconStatus']);
  commandIcon['formation'] = Number(parameters['commandIconFormation']);
  commandIcon['options']   = Number(parameters['commandIconOptions']);
  commandIcon['save']      = Number(parameters['commandIconSave']);
  commandIcon['gameEnd']   = Number(parameters['commandIconGameEnd']);
  commandIcon['goldLevelUp'] = Number(parameters['commandIconGoldLevelUp']);
  var rotateDuration       = Number(parameters['rotateDuration']);
  var iconDistX            = Number(parameters['iconDistX']);
  var iconDistY            = Number(parameters['iconDistY']);
  var iconSelectScale      = Number(parameters['iconSelectScale']);
  var captionWidth         = Number(parameters['captionWidth']);
  var captionHeight        = Number(parameters['captionHeight']);
  var captionShiftX        = Number(parameters['captionShiftX']);
  var captionShiftY        = Number(parameters['captionShiftY']);
  
  //-----------------------------------------------------------------------------
  // Game_Temp
  //
  
  Game_Temp.prototype.isRingCommandVisible = function() {
    if (this._ringCommandVisible === undefined) {
      this._ringCommandVisible = false;
    }
    return this._ringCommandVisible;
  };
  
  Game_Temp.prototype.setRingCommandVisible = function(flag) {
    this._ringCommandVisible = flag;
  };
  
  Game_Temp.prototype.ringCommandLastIndex = function() {
    if (this._ringCommandLastIndex === undefined) {
      this._ringCommandLastIndex = 0;
    }
    return this._ringCommandLastIndex;
  };
  
  Game_Temp.prototype.setRingCommandLastIndex = function(index) {
    this._ringCommandLastIndex = index;
  };
  
  Game_Temp.prototype.calledByRingCommand = function() {
    if (this._calledByRingCommand === undefined) {
      this._calledByRingCommand = false;
    }
    return this._calledByRingCommand;
  };
  
  Game_Temp.prototype.setCalledByRingCommand = function(flag) {
    this._calledByRingCommand = flag;
  };
  
  //-----------------------------------------------------------------------------
  // Game_Player
  //
  
  var _Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if ($gameTemp.isRingCommandVisible()) {
      return false;
    }
    return _Game_Player_canMove.call(this);
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_TMRingCommandIcon
  //
  
  function Sprite_TMRingCommandIcon() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TMRingCommandIcon.prototype = Object.create(Sprite.prototype);
  Sprite_TMRingCommandIcon.prototype.constructor = Sprite_TMRingCommandIcon;

  Sprite_TMRingCommandIcon.prototype.initialize = function(name) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._commandName = name;
    this.bitmap = ImageManager.loadSystem('IconSet');
    var bx = commandIcon[name] % 16 * Window_Base._iconWidth;
    var by = Math.floor(commandIcon[name] / 16) * Window_Base._iconHeight;
    this.setFrame(bx, by, Window_Base._iconWidth, Window_Base._iconHeight);
    this._targetPosAngle = 0;
    this._posAngle = 0;
  };
  
  Sprite_TMRingCommandIcon.prototype.setIndex = function(index) {
    this._targetPosAngle = Math.PI * 2 / this.parent._commandSprites.length * index;
    var r = this._targetPosAngle - this._posAngle;
    r -= Math.floor(r / (Math.PI * 2)) * (Math.PI * 2);
    if (r > Math.PI) {
      r -= Math.PI * 2;
    }
    this._rotationCount = rotateDuration;
    this._va = r / this._rotationCount;
  };

  Sprite_TMRingCommandIcon.prototype.name = function() {
    return this._commandName;
  };
  
  Sprite_TMRingCommandIcon.prototype.isEnabled = function() {
    switch (this._commandName) {
    case 'save':
      return this.isSaveEnabled();
    case 'options':
      return this.isOptionsEnabled();
    case 'gameEnd':
      return this.isGameEndEnabled();
    default:
      return this.areMainCommandsEnabled();
    }
  };
  
  Sprite_TMRingCommandIcon.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
  };

  Sprite_TMRingCommandIcon.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
  };

  Sprite_TMRingCommandIcon.prototype.isOptionsEnabled = function() {
    return true;
  };

  Sprite_TMRingCommandIcon.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
  };

  Sprite_TMRingCommandIcon.prototype.isGameEndEnabled = function() {
    return true;
  };

  Sprite_TMRingCommandIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._rotationCount > 0) {
      this._posAngle += this._va;
      this._rotationCount--;
      if (this._rotationCount === 0) {
        this._posAngle = this._targetPosAngle;
      }
    }
    var r = this._posAngle + Math.PI / 2;
    this.x = Math.cos(r) * this.parent._commandRadius * iconDistX;
    this.y = Math.sin(r) * this.parent._commandRadius * iconDistY - 24;
    var scale = (this.y + 56) / 256 + 0.75;
    if (this.parent.currentCommandName() === this.name()) {
      scale *= iconSelectScale;
    }
    this.scale.set(scale, scale);
    this.opacity = this.isEnabled() ? 255 : 160
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_TMRingCommandCaption
  //
  
  function Sprite_TMRingCommandCaption() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TMRingCommandCaption.prototype = Object.create(Sprite.prototype);
  Sprite_TMRingCommandCaption.prototype.constructor = Sprite_TMRingCommandCaption;

  Sprite_TMRingCommandCaption.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.x = captionShiftX;
    this.y = captionShiftY;
    this._commandName = '';
    this.bitmap = new Bitmap(captionWidth, captionHeight);
  };
  
  Sprite_TMRingCommandCaption.prototype.update = function() {
    if (this._commandName !== this.parent.currentCommandName()) {
      this._commandName = this.parent.currentCommandName();
      this.refresh();
    }
  };
  
  Sprite_TMRingCommandCaption.prototype.refresh = function() {
    this.bitmap.clear();
    this.bitmap.paintOpacity = 160;
    this.bitmap.fillRect(0, 0, 240, 48, '#000000');
    this.bitmap.paintOpacity = 255;
    this.bitmap.drawText(TextManager[this._commandName], 0, 0,
                         captionWidth, captionHeight, 'center');
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_TMRingCommand
  //
  
  function Sprite_TMRingCommand() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TMRingCommand.prototype = Object.create(Sprite.prototype);
  Sprite_TMRingCommand.prototype.constructor = Sprite_TMRingCommand;

  Sprite_TMRingCommand.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._commandIndex = saveLastIndex ? $gameTemp.ringCommandLastIndex() : 0;
    this._commandRadius = 0;
    this.makeCommandList();
    this.makeCaption();
    this.refresh();
  };

  Sprite_TMRingCommand.prototype.makeCommandList = function() {
    this._commandSprites = []
    this.addMainCommands();
    this.addFormationCommand();
    this.addOptionsCommand();
    this.addOriginalCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
  };
  
  Sprite_TMRingCommand.prototype.currentCommandName = function() {
    return this._commandSprites[this._commandIndex].name();
  };

  Sprite_TMRingCommand.prototype.addMainCommands = function() {
    if (this.needsCommand('item')) {
      var sprite = new Sprite_TMRingCommandIcon('item');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('skill')) {
      var sprite = new Sprite_TMRingCommandIcon('skill');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('equip')) {
      var sprite = new Sprite_TMRingCommandIcon('equip');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('status')) {
      var sprite = new Sprite_TMRingCommandIcon('status');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };
  
  Sprite_TMRingCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand('formation')) {
      var sprite = new Sprite_TMRingCommandIcon('formation');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };

  Sprite_TMRingCommand.prototype.addOriginalCommand = function() {
    if (Imported.TMGoldLevelUp && TextManager.goldLevelUp) {
      var sprite = new Sprite_TMRingCommandIcon('goldLevelUp');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };
  
  Sprite_TMRingCommand.prototype.addOptionsCommand = function() {
    var sprite = new Sprite_TMRingCommandIcon('options');
    this._commandSprites.push(sprite);
    this.addChild(sprite);
  };

  Sprite_TMRingCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand('save')) {
      var sprite = new Sprite_TMRingCommandIcon('save');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };

  Sprite_TMRingCommand.prototype.addGameEndCommand = function() {
    var sprite = new Sprite_TMRingCommandIcon('gameEnd');
    this._commandSprites.push(sprite);
    this.addChild(sprite);
  };

  Sprite_TMRingCommand.prototype.needsCommand = function(name) {
    var flags = $dataSystem.menuCommands;
    if (flags) {
      switch (name) {
      case 'item':
        return flags[0];
      case 'skill':
        return flags[1];
      case 'equip':
        return flags[2];
      case 'status':
        return flags[3];
      case 'formation':
        return flags[4];
      case 'save':
        return flags[5];
      }
    }
    return true;
  };
  
  Sprite_TMRingCommand.prototype.makeCaption = function() {
    if (useCaption) {
      this._captionSprite = new Sprite_TMRingCommandCaption();
      this.addChild(this._captionSprite);
    }
  };

  Sprite_TMRingCommand.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisible();
    if ($gameTemp.isRingCommandVisible()) {
      if (this._commandRadius < 4) {
        if (this._commandRadius === 0) {
          if (openResetIndex) {
            this._commandIndex = saveLastIndex ? $gameTemp.ringCommandLastIndex() : 0;
            this.refresh();
          }
          AudioManager.playSe(seOpenCommand);
        }
        if (openGoldWindow && this.parent.parent) {
          var goldWindow = this.parent.parent._messageWindow._goldWindow;
          goldWindow.x = goldWindowX;
          goldWindow.y = goldWindowY;
          goldWindow.open();
        }
        this._commandRadius++;
      }
      this.updateInput();
      this.x = $gamePlayer.screenX();
      this.y = $gamePlayer.screenY();
    } else {
      if (this._commandRadius > 0) {
        if (this._commandRadius === 4) {
          if (openGoldWindow) {
            this.parent.parent._messageWindow._goldWindow.close();
          }
          AudioManager.playSe(seCloseCommand);
        }
        this._commandRadius--;
      }
    }
  };
  
  Sprite_TMRingCommand.prototype.updateVisible = function() {
    if (SceneManager._scene.isBusy() || $gameMap.isEventRunning() ||
        !$gameSystem.isMenuEnabled()) {
      $gameTemp.setRingCommandVisible(false);
    } else if (useEscape) {
    } else {
      $gameTemp.setRingCommandVisible(Input.isPressed('control'));
    }
    
    this.visible = this._commandRadius > 0;
  };
  
  Sprite_TMRingCommand.prototype.updateInput = function() {
    if (Input.isRepeated('left') || (TouchInput.isRepeated() &&
        TouchInput.x < $gamePlayer.screenX() - 24)) {
      this._commandIndex--
      if (this._commandIndex < 0) {
        this._commandIndex = this._commandSprites.length - 1;
      }
      this.refresh();
      SoundManager.playCursor();
    }
    if (Input.isRepeated('right') || (TouchInput.isRepeated() &&
        TouchInput.x > $gamePlayer.screenX() + 24)) {
      this._commandIndex++;
      if (this._commandIndex >= this._commandSprites.length) {
        this._commandIndex = 0;
      }
      this.refresh();
      SoundManager.playCursor();
    }
    if (Input.isTriggered('ok') || (TouchInput.isTriggered() &&
        TouchInput.x >= $gamePlayer.screenX() - 24 &&
        TouchInput.x <= $gamePlayer.screenX() + 24)) {
      var sprite = this._commandSprites[this._commandIndex];
      if (sprite.isEnabled()) {
        switch (sprite.name()) {
        case 'item':
          $gameTemp.setCalledByRingCommand(true);
          SceneManager.push(Scene_Item);
          break;
        case 'skill':
          $gameTemp.setCalledByRingCommand(true);
          SceneManager.push(Scene_Skill);
          break;
        case 'equip':
          SceneManager.push(Scene_Equip);
          break;
        case 'status':
          $gameTemp.setCalledByRingCommand(true);
          SceneManager.push(Scene_Status);
          break;
        case 'formation':
          SceneManager.push(Scene_RCFormation);
          break;
        case 'options':
          SceneManager.push(Scene_Options);
          break;
        case 'save':
          SceneManager.push(Scene_Save);
          break;
        case 'gameEnd':
          SceneManager.push(Scene_GameEnd);
          break;
        case 'goldLevelUp':
          SceneManager.push(TMParam.Scene_GoldLevelUp);
          break;
        }
        this._commandRadius = 0;
        if (openGoldWindow) {
          this.parent.parent._messageWindow._goldWindow.hide();
        }
        $gameTemp.setRingCommandLastIndex(this._commandIndex);
        $gameTemp.setRingCommandVisible(false);
        SoundManager.playOk();
      } else {
        SoundManager.playBuzzer();
      }
    }
    if (useEscape && this._commandRadius === 4 &&
        (Input.isTriggered('menu') || TouchInput.isCancelled())) {
      $gameTemp.setRingCommandVisible(false);
    }
  };

  Sprite_TMRingCommand.prototype.refresh = function() {
    for (var i = 0; i < this._commandSprites.length; i++) {
      var sprite = this._commandSprites[i];
      var index = (this._commandIndex - i) % this._commandSprites.length;
      sprite.setIndex(index);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //
  
  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createRingCommand();
  };

  Spriteset_Map.prototype.createRingCommand = function() {
    this._ringCommand = new Sprite_TMRingCommand();
    this.addChild(this._ringCommand);
  };
  
  //-----------------------------------------------------------------------------
  // Window_MenuActor
  //
  
  var _Window_MenuActor_refresh = Window_MenuActor.prototype.refresh;
  Window_MenuActor.prototype.refresh = function() {
    if (!$gameTemp.calledByRingCommand()) {
      _Window_MenuActor_refresh.call(this);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_SkillStatus
  //
  
  var _Window_SkillStatus_refresh = Window_SkillStatus.prototype.refresh;
  Window_SkillStatus.prototype.refresh = function() {
    if (!$gameTemp.calledByRingCommand()) {
      _Window_SkillStatus_refresh.call(this);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_Status
  //
  
  var _Window_Status_refresh = Window_Status.prototype.refresh;
  Window_Status.prototype.refresh = function() {
    if (!$gameTemp.calledByRingCommand()) {
      _Window_Status_refresh.call(this);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_Message
  //
  
  var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
  Window_Message.prototype.updatePlacement = function() {
    _Window_Message_updatePlacement.call(this);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
  };

  //-----------------------------------------------------------------------------
  // Scene_Item
  //
  
  var _Scene_Item_start = Scene_Item.prototype.start;
  Scene_Item.prototype.start = function() {
    _Scene_Item_start.call(this);
    if ($gameTemp.calledByRingCommand()) {
      $gameTemp.setCalledByRingCommand(false);
      this._actorWindow.refresh();
    }
  }
  
  //-----------------------------------------------------------------------------
  // Scene_Skill
  //
  
  var _Scene_Skill_start = Scene_Skill.prototype.start;
  Scene_Skill.prototype.start = function() {
    _Scene_Skill_start.call(this);
    if ($gameTemp.calledByRingCommand()) {
      $gameTemp.setCalledByRingCommand(false);
      this._actorWindow.refresh();
      this._statusWindow.refresh();
    }
  }
  
  //-----------------------------------------------------------------------------
  // Scene_Status
  //
  
  var _Scene_Status_start = Scene_Status.prototype.start;
  Scene_Status.prototype.start = function() {
    _Scene_Status_start.call(this);
    if ($gameTemp.calledByRingCommand()) {
      $gameTemp.setCalledByRingCommand(false);
      this._statusWindow.refresh();
    }
  }
  
  //-----------------------------------------------------------------------------
  // Scene_Map
  //
  
  var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
  Scene_Map.prototype.callMenu = function() {
    if (useEscape) {
      $gameTemp.setRingCommandVisible(true);
      this.menuCalling = false;
    } else {
      _Scene_Map_callMenu.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_RCFormation
  //

  function Scene_RCFormation() {
    this.initialize.apply(this, arguments);
  }

  Scene_RCFormation.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_RCFormation.prototype.constructor = Scene_RCFormation;

  Scene_RCFormation.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_RCFormation.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createStatusWindow();
  };

  Scene_RCFormation.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
  };

  Scene_RCFormation.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_MenuStatus(0, 0);
    this._statusWindow.x = (Graphics.boxWidth - this._statusWindow.width) / 2;
    this.addWindow(this._statusWindow);
  };

  Scene_RCFormation.prototype.onFormationOk = function() {
    var index = this._statusWindow.index();
    var actor = $gameParty.members()[index];
    var pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
      $gameParty.swapOrder(index, pendingIndex);
      this._statusWindow.setPendingIndex(-1);
      this._statusWindow.redrawItem(index);
    } else {
      this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
  };

  Scene_RCFormation.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
      this._statusWindow.setPendingIndex(-1);
      this._statusWindow.activate();
    } else {
      this.popScene();
    }
  };

})();
