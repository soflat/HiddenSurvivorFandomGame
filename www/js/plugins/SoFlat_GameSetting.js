SceneManager._screenWidth       = 480;
SceneManager._screenHeight      = 768;
SceneManager._boxWidth          = 480;
SceneManager._boxHeight         = 768;
Window_Base._faceWidth  = 92;
Window_Base._faceHeight = 120;


Window_Base.prototype.standardFontSize = function() {
    return 20;
};

Window_Base.prototype.standardFontFace = function() {
    if ($gameSystem.isChinese()) {
        return 'Microsoft JhengHei UI, SimHei, Heiti TC, sans-serif';
    } else if ($gameSystem.isKorean()) {
        return 'Dotum, AppleGothic, sans-serif';
    } else {
        return 'GameFont';
    }
};

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    // this.drawActorLevel(actor, x, y + lineHeight * 1);
    // this.drawActorIcons(actor, x, y + lineHeight * 2);
    // this.drawActorClass(actor, x2, y);
    // this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    // this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};


Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    // this.addFormationCommand();
    this.addOriginalCommands();
    // this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand('倉庫', 'item', enabled);
    }
    // if (this.needsCommand('skill')) {
        // this.addCommand(TextManager.skill, 'skill', enabled);
    // }
    // if (this.needsCommand('equip')) {
        // this.addCommand(TextManager.equip, 'equip', enabled);
    // }
    // if (this.needsCommand('status')) {
        // this.addCommand(TextManager.status, 'status', enabled);
    // }
};


Window_MenuStatus.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = Window_Base._faceHeight + 1;
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
}

Window_MenuStatus.prototype.drawItemImage = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
    this.changePaintOpacity(true);
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x + 110;
    // var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var y = rect.y + 45;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};


Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    // this.addCommand(TextManager.weapon,  'weapon');
    // this.addCommand(TextManager.armor,   'armor');
    this.addCommand(TextManager.keyItem, 'keyItem');
};


Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    // this.createGoldWindow();
    this.createStatusWindow();
};


Game_Party.prototype.consumeItem = function(item) {
    if (DataManager.isItem(item) && item.consumable) {
        this.loseItem(item, 1);
    }
    try {
        var itemNote = JSON.parse(item.note)
        if (itemNote.hasOwnProperty("effect")) {
            if (itemNote.effect.hasOwnProperty("Full"))
                $gameVariables.setValue(
                    21, 
                    Math.min($gameVariables.value(21) + itemNote.effect.Full, 500))
            if (itemNote.effect.hasOwnProperty("Moist"))
                $gameVariables.setValue(
                    22, 
                    Math.min($gameVariables.value(22) + itemNote.effect.Moist, 500))
            if (itemNote.effect.hasOwnProperty("Satisfy"))
                $gameVariables.setValue(
                    23, 
                    Math.min($gameVariables.value(23) + itemNote.effect.Satisfy, 500))
        }
    } catch(e) {
    }
}

Game_Party.prototype.maxItems = function(item) {
    return 2000;
};


Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
};