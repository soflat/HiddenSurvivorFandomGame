//-----------------------------------------------------------------------------
// SoFlat_SystemDialog
// 
// static class
// 系統訊息對話

function SoFlat_SystemDialog() {
	throw new Error('This is a static class');
}


//-----------------------------------------------------------------------------
// SoFlat_CharacterDialog
// 
// static class
// 根據角色編號回傳該角色在特定場合的對話

function SoFlat_CharacterDialog() {
	throw new Error('This is a static class');
}

SoFlat_CharacterDialog.foundItem = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('這是……？')
            return
    }
}

SoFlat_CharacterDialog.fixWrench = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('稍微……能再使用一段時間了。')
            return
    }
}

SoFlat_CharacterDialog.noWrench = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('如果有稱手的工具，\n說不定能拆解後用來建造更有用的東西……')
            return
    }
}

SoFlat_CharacterDialog.brokeWrench = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('扳手損壞了。\n工作臺那裡，或許有工具能修復它……')
            return
    }
}

SoFlat_CharacterDialog.noEnoughResource = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('原料不太夠的樣子……')
            return
    }
}

SoFlat_CharacterDialog.checkWorkbench = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('老舊的工作臺。\n會是誰建造的呢……')
            return
    }
}