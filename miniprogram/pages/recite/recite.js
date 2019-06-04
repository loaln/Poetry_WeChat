 var pageSelf = undefined;
 var plugin = requirePlugin("WechatSI")
 let manager = plugin.getRecordRecognitionManager()
 const app = getApp();
 const db=wx.cloud.database();
var poetryId;

 Page({

   data: {
     sound: false,
     choose: false,
     animationData: {},
     reciteResult: '',
     time:'',
     poetryTitle:'',
     poetryContent:''
   },

   /* 生命周期函数--监听页面加载 */
   onLoad: function(options) {
     console.log(options);
     wx.authorize({
       scope: 'record'
     })
     this.setData({
       time: options.poetry_time
     })
     db.collection('poetry').doc(options.poetry_id).get({
       success: res => {
         this.setData({
           poetryContent: res.data.poetryContent.split('&hc').join('\n'),
           poetryTitle: res.data.title,
         })
       }
     })
   },



   backClick: function() {
     this.setData({
       reciteResult: ''
     });
     console.log('撤回')
   },
   tipClick: function(e) {
     // 用that取代this，防止不必要的情况发生
     var that = this;
     // 创建一个动画实例
     var animation = wx.createAnimation({
       // 动画持续时间
       duration: 500,
       // 定义动画效果，当前是匀速
       timingFunction: 'linear'
     })
     // 将该变量赋值给当前动画
     that.animation = animation
     // 先在y轴偏移，然后用step()完成一个动画
     animation.translateY(800).step()
     // 用setData改变当前动画
     that.setData({
       // 通过export()方法导出数据
       animationData: animation.export(),
       // 改变view里面的Wx：if
       choose: true
     })
     // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
     setTimeout(function() {
       animation.translateY(0).step()
       that.setData({
         animationData: animation.export()
       })
     }, 200)
   },

   hideModal: function(e) {
     var that = this;
     var animation = wx.createAnimation({
       duration: 1000,
       timingFunction: 'linear'
     })
     that.animation = animation
     animation.translateY(800).step()
     that.setData({
       animationData: animation.export()

     })
     setTimeout(function() {
       animation.translateY(0).step()
       that.setData({
         animationData: animation.export(),
         choose: false
       })
     }, 200)
   },

   finishClick: function() {
     wx.showToast({
       title: '完成背诵',
     })
     this.setData({

     });
   },
   //touch start
   handleTouchStart: function(e) {
     this.startTime = e.timeStamp;
     //console.log(" startTime = " + e.timeStamp);  
     this.setData({
       sound: true,
     });
     var _this = this
     // UTIL.stopTTS();
     manager.start({
       duration: 30000,
       lang: "zh_CN"
     })
   },

   //touch end
   handleTouchEnd: function(e) {
     this.endTime = e.timeStamp;
     //console.log(" endTime = " + e.timeStamp);  
     this.setData({
       sound: false,
     });
     manager.stop();
     wx.showToast({
       title: '正在识别……',
       icon: 'loading',
       duration: 2000
     })
   },

   handleLongPress: function(e) {
     //console.log("endTime - startTime = " + (this.endTime - this.startTime));
     console.log("长按");
   },

   /* 生命周期函数--监听页面显示 */
   onShow: function() {
     manager.onRecognize = (res) => {}
     manager.onStop = (res) => {
       // var that = this;
       app.globalData.result = res.result
              wx.showToast({
                       title: res.result,
                              })
                                     var pre_result = this.data.reciteResult
                                     
       wx.showToast({
         title: res.result,
       })
       var pre_result = this.data.reciteResult
       this.setData({
         reciteResult: pre_result + res.result,
       })
       console.log('manager.onStop')
       console.log('res' + res) //语音识别信息打印
       console.log('res.result' + res.result) //语音识别信息打印 
       console.log('app.globalData.result' + app.globalData.result) //语音识别信息打印 
       console.log('reciteResult' + this.data.reciteResult) //语音识别信息打印 
       // UTIL.log("record file path", res.tempFilePath)
       // UTIL.log("result", res.result)
       //res.result is the asr result, change the follow step to your source
       //NLI.process(res.result, pageSelf);
     }
     manager.onError = (res) => {
       console.log('manager.onError')
       console.log(res) //报错信息打印
       wx.showToast({
         title: res.msg,
       })
     }
   },

 });