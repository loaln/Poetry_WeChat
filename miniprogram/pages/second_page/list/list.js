const app=getApp();
const db = wx.cloud.database();
var title = ["先秦两汉", "魏晋南北", "隋代唐朝", "五代十国", "宋代金朝", "元代","明代","清朝","古体诗","近体诗","词","曲"]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListTitle:'',
    List:'',
    listType:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      listType:options.type,
      ListTitle: title[options.type-1],
    })
    db.collection('index_list').where({
        _id:'fdd04aa6-cede-4eba-a078-3a3011755578'
      }).get({
        success: res => {
          console.log(res)
          if (options.type==1){
          this.setData({
            List: res.data[0].xianqin,
          });
          }
          if (options.type == 2) {
            this.setData({
              List: res.data[0].weijin,
            });
          }
          if (options.type == 3) {
            this.setData({
              List: res.data[0].suitang,
            });
          }
          if (options.type == 4) {
            this.setData({
              List: res.data[0].wushi,
            });
          }
          if (options.type == 6) {
            this.setData({
              List: res.data[0].songjin,
            });
          }
          if (options.type == 7) {
            this.setData({
              List: res.data[0].yuan,
            });
          }
          if (options.type == 8) {
            this.setData({
              List: res.data[0].ming,
            });
          }
          if (options.type == 9) {
            this.setData({
              List: res.data[0].qing,
            });
          }
        }
        
      })

  },
  jumpPageSearch: function (e) {
    wx.navigateTo({
      url: '../index_search/index_search',
    })
  },
  
})