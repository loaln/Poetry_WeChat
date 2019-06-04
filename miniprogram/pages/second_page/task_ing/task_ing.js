var pageSelf = undefined;
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const app = getApp();
const db = wx.cloud.database();
var arr=[];
var viewText;
var idarr=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: app.globalData.Mon,
    day: app.globalData.Day,
    year: app.globalData.Year,
    month2: app.globalData.M_seven,
    day2: app.globalData.D_seven,
    year2: app.globalData.Y_seven,
    src1: 'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/reciting.png?sign=77919945f2ab1b8ad1986ead599a9c33&t=1558872253',
    src2: 'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/tianing.png?sign=70a67f3000dcd0b11a405cf2c09ee381&t=1558880748',
    src:'',
    taskType:'',
    sound:false,
    choose: false,
    animationData: {},
    reciteResult: '',
    poeContent:'',
    content:'',
    title:'',
    recite_Type:0,//0表示未参加背诵，1表示已参加
    tian_Type:0,//0表示未参加填空，1表示已参加
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('userTask').where({
      _openid: app.data.openId,
    }).get({
      success: res => {
        this.setData({
          recite_Type: res.data[0].reciteTask,
          tian_Type: res.data[0].tianTask,
        })
      }
    })
    this.setData({
      taskType:options.taskType,
      })
    if (this.data.taskType==1){
      this.setData({
        src:'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/reciting.png?sign=77919945f2ab1b8ad1986ead599a9c33&t=1558872253',
      })
      //获取poetry中的id
      // db.collection('poetry').get({
      //   success: res => {
      //     for(var i=0;i<4;i++){
      //       idarr[i] = res.data[i]._id
      //     }
      //     console.log('res',res)
      //     console.log('idarr',idarr)
      //      }
      // })
      // var randId ;
      // randId = idarr[Math.floor(Math.random()*idarr.length)];
      // console.log('randId', randId)
      db.collection('poetry').where({
        _id: '011884df-493f-413c-aac5-d214e691f73b'
      }).get({
        success: res => {
          this.setData({
            title: res.data[0].title,
            content: res.data[0].title + '/' + res.data[0].writer + '/' + res.data[0].dynasty + '\n' + res.data[0].poetryContent.split('&hc').join('\n')
          });
          console.log(res)
        }
      })
    }
    if (this.data.taskType == 2) {
        this.setData({
          src: 'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/tianing.png?sign=70a67f3000dcd0b11a405cf2c09ee381&t=1558880748',
          
        })
        db.collection('tiankongDay1').get({
          success: res => {
            this.setData({
              poeContent: res.data
            });
            console.log(res)
          }
        })
    };
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      bot_text: '已加入' //给上个页面的 recite_Type赋1，表示已参加
    })
  },

  //touch start
  handleTouchStart: function (e) {
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
  handleTouchEnd: function (e) {
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

  handleLongPress: function (e) {
    //console.log("endTime - startTime = " + (this.endTime - this.startTime));
    console.log("长按");

  },
  backClick: function () {
    this.setData({
      reciteResult: ''
    });
    console.log('撤回')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    manager.onRecognize = (res) => {
    }

    manager.onStop = (res) => {
      // var that = this;
      wx.showToast({
        title:'识别完成',
      })
      var pre_result = this.data.reciteResult
      this.setData({
        reciteResult: pre_result + res.result,
      })
      console.log('manager.onStop')
      console.log('res' + res)//语音识别信息打印
      console.log('res.result' + res.result)//语音识别信息打印 
      console.log('app.globalData.result' + app.globalData.result)//语音识别信息打印 
      console.log('reciteResult' + this.data.reciteResult)//语音识别信息打印 
    }
    manager.onError = (res) => {

      console.log('manager.onError')
      console.log(res)//报错信息打印
      wx.showToast({
        title: res.msg,
      })
      // UTIL.log("error msg", res.msg)

    }
    
  },

  tipClick: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        choose: false
      })
    }, 200)
  },

  strInput0: function (e) {
    arr[0] = e.detail.value;  
    },
  strInput1: function (e) {
    arr[1] = e.detail.value; 
    },
  strInput2: function (e) {
    arr[2] = e.detail.value;  
    },
  strInput3: function (e) {
    arr[3] = e.detail.value;
    },
  strInput4: function (e) {
    arr[4] = e.detail.value;
  },
  strInput5: function (e) {
    arr[5] = e.detail.value;
  },
  strInput6: function (e) {
    arr[6] = e.detail.value;
  },
  strInput7: function (e) {
    arr[7] = e.detail.value;
  },
  strInput8: function (e) {
    arr[8] = e.detail.value;
  },
  strInput9: function (e) {
    arr[9] = e.detail.value;
  },

  dakaClick: function () {
    var that=this;
    if (this.data.taskType==2 ){
      wx.navigateTo({
        url: '../task_ed/task_ed?arr=' + JSON.stringify(arr) + '&taskType=' + this.data.taskType
      })
    }
    if (this.data.taskType ==1 ) {
      wx.navigateTo({
        url: '../task_ed/task_ed?reciteText=' + this.data.reciteResult + '&taskType=' + this.data.taskType
      })
    }
 
  },
  

})