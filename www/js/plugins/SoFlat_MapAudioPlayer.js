//-----------------------------------------------------------------------------
// SoFlat_MapAudioPlayer
// 
// static class
// 播放該地圖指定的BGM

function SoFlat_MapAudioPlayer() {
	throw new Error('This is a static class');
}

SoFlat_MapAudioPlayer.playBgm = function(volume, fadeInCount) {
    try {
        var bgmName = JSON.parse($dataMap.note).BGM
    } catch (e) {
        // no bgm name assigned
        return
    }
	let bgm = {
		name: bgmName,
		pan: 0,
		pitch: 100,
		volume: volume
	}
    AudioManager.playBgm(bgm)
    AudioManager.fadeInBgm(fadeInCount)
}

SoFlat_MapAudioPlayer.stopBgm = function(fadeOutCount) {
    AudioManager.fadeOutBgm(fadeOutCount);
}