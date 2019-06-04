const app = getApp();
const db = wx.cloud.database();

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
    bot_text:'加入副本',
    src:'',
    but_type: true,
    id:'',//加入副本按钮的id，1：点击的是背诵副本的按钮，2表示点击的是填空副本的按钮
    idType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskType = options.taskType;
    if(taskType==1){
      this.setData({
        src: 'http://pr37lb7al.bkt.clouddn.com/task_recite.png',
         but_type: true,
         id:1,
      })
    };
    if (taskType == 2) {
      this.setData({
        src: 'http://pr37lb7al.bkt.clouddn.com/task_kong.png',
        but_type: true,
        id:2,
      })
    };
    if (taskType == 3) {
      this.setData({
        day: '01',
        month:'05',
        src: 'http://pr37lb7al.bkt.clouddn.com/task_moxie.png',
        but_type: false,
      })
    };
  },
  jumpPage_tasking: function (e) {
 
    //获取button的id
    this.setData({
      idType :e.currentTarget.id,//1：点击加入背诵 2：点击加入填空
    })
    console.log('id='+this.data.idType);
    wx.navigateTo({
      url: '../task_ing/task_ing?taskType=' + this.data.idType
    })
    if (this.data.idType == 1) {  
      db.collection('userTask').where({
        _openid: app.data.openId,
      }).get({
        success: res => { 
        var  id=res.data[0]._id
          console.log("id1234",id);
      db.collection('userTask').doc(id).update({
        data: {
          reciteTask:1,
        },
        success: res => {
          console.log("创建成功");
        }
       })
     }
      }) 

      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        recite_Type: 1 //给上个页面的 recite_Type赋1，表示已参加
      })
      this.setData({
        bot_text: '已加入',
      })
     // wx.navigateBack({ delta: 1 })
    };
    if (this.data.idType == 2) {
      db.collection('userTask').where({
        _openid: app.data.openId,
      }).get({
        success: res => {
          var id = res.data[0]._id
          db.collection('userTask').doc(id).update({
            data: {
              tianTask: 1,
            },
            success: res => {
              console.log("创建成功");
            }
          })
        }
      }) 

      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        tian_Type: 1 //给上个页面的 tian_Type赋1表示已参加
      })
    };

    },

})