//-----------------------------------------------------------------------------
// SoFlat_CharacterDialog
// 
// static class
// 根據角色編號回傳該角色在特定場合的對話

function SoFlat_CharacterDialog() {
	throw new Error('This is a static class');
}

SoFlat_CharacterDialog.getWrench = function(charId) {
    $gameMessage.setBackground(2)
    $gameMessage.setPositionType(1)
    switch(charId) {
        case 1:
            $gameMessage.add('好像有什麼東西……')
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