//index.js
//获取应用实例
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    inputShowed: false,
    recommendPoetry:'',   //推荐诗词显示
    imgUrls: [
      'cloud://poetry-d7007d.706f-poetry-d7007d/index/banner1.png',
      'cloud://poetry-d7007d.706f-poetry-d7007d/index/banner2.png',
      'cloud://poetry-d7007d.706f-poetry-d7007d/index/banner3.png'
    ],
  },
  onLoad:function(){
    this.getOpenid();
    this.getPoetryData();
  },

/**获取用户openid*/
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log('云函数获取到的openid: ', res.result.openid);
        // console.log(app.data.openId);
        app.data.openId = res.result.openid;
      }
    })
  },
/**搜索跳转函数 */
  jumpPageSearch: function () {
    wx.navigateTo({
      url: '../second_page/index_search/index_search',
    })
  },
/**诗词详情也跳转函数 */
  pageToContent: function (e) {
    var index;
    var poetry;
    index = e.currentTarget.dataset.index;
    poetry = this.data.recommendPoetry[index]._id;
    // console.log(poetry);
    wx.navigateTo({
      url: '../content/content?poetry_id=' + poetry
    })
  },
/**诗词推荐显示 */
  getPoetryData:function(){
    var that=this;
    db.collection('poetry').get({
      success:res=>{
        that.setData({
          recommendPoetry:res.data,
        })
        console.log(res);
      },
      err:res=>{
        console.log("加载数据库失败。")
      }
    })
  },
  listClick: function (e) {
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
    animation.translateX(-180).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      choose: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateX(0).step()
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
    animation.translateX(-180).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateX(-100).step()
      that.setData({
        animationData: animation.export(),
        choose: false
      })
    }, 200)
  },
  jumpPage_music: function (e) {
    var musicType = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../second_page/music/music?musicType=' + musicType
    })
  },
  butClick: function (e) {
    var type = e.currentTarget.id;
    console.log(typeof (type));
    console.log(type);
    wx.navigateTo({
      url: '../second_page/list/list?type='+type
    })
  },
})
