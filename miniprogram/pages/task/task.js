
const db = wx.cloud.database();
const app = getApp();
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
    butType: '',//button的id
         /**
   * butType=1-背诵副本状态：未参加
   * butType=2-填空副本状态：未参加
   * butType=3-默写副本状态
   * butType=4-背诵副本状态：参加
   *butType= 5-填空副本状态：参加
   */
    recite1: '马上参加',
    recite2: '已参加',
    tian1: '马上参加',
    tian2: '已参加',
    recite_Type:0,//0表示未参加背诵，1表示已参加
    tian_Type:0,//0表示未参加填空，1表示已参加
  },
   /**
   * 页面跳转
   */
  jumpPage_task: function (e) {
    //获取button的id
    var butType = e.currentTarget.id;
      /**
   * 1-背诵副本状态：未参加
   * 2-填空副本状态：未参加
   * 3-默写副本状态
   * 4-背诵副本状态：参加
   * 5-填空副本状态：参加
   */
    console.log(butType);
    //将id：12345赋值给全局变量taskType：表示副本状态
    //id为1,2,3时，跳转到task_pre页面（还没加入的页面）
    if (butType == 1 || butType== 2 || butType==3)
       wx.navigateTo({
         url: '../second_page/task_pre/task_pre?taskType=' + butType
       })
    //id为4,5时，跳转到task_ing页面（打卡的页面）
    if (butType==4){
        wx.navigateTo({
        url: '../second_page/task_ing/task_ing?taskType=' + 1
          })
      }
    if (butType ==5) {
         wx.navigateTo({
            url: '../second_page/task_ing/task_ing?taskType=' + 2
         })
    }
  },
  
    


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('userTask').where({
      _openid: app.data.openId,
    }).get({
      success: res => {
        if(res.data==''){
          db.collection('userTask').add({
            data: {
              reciteTask: '',
              tianTask: '',
              moxieTask: 2,
              reciteDaka:[],
              tianDaka: [],
            },
            success: res => {
              console.log("创建成功");
            }
          })
        }
        this.setData({
          recite_Type:res.data[0].reciteTask,
          tian_Type:res.data[0].tianTask,
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.reciteDaka == 1) {
      this.setData({
        recite2: '打卡完成'
      })
    } else {
      this.setData({
        recite2: '已参加'
      })
    }
    if (app.globalData.tianDaka == 1) {
      this.setData({
        tian2: '打卡完成'
      })
    } else {
      this.setData({
        tian2: '已参加'
      })
    }
  },


})


