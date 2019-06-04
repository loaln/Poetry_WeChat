const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return year + '年' + month + '月' + day + '日'
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// module.exports = {
//   formatTime: formatTime
// }
/*
*........................................................................................
*/
var plugin = requirePlugin("WechatSI")

var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((res) => {
  // 播放音频失败的回调
})

function playTTS(text) {
  //need to add WXAPP plug-in unit: WechatSI
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: text,
    success: function (res) {
      log("succ tts", res.filename)
      innerAudioContext.src = res.filename;
      innerAudioContext.play()
    },
    fail: function (res) {
      log("fail tts", res)
    }
  })
}

function stopTTS() {
  innerAudioContext.stop();
}

module.exports = {
  formatTime: formatTime,
  playTTS: playTTS,
  stopTTS: stopTTS,
}

