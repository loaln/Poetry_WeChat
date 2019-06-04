// miniprogram/pages/mine/mine.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp(); //获取app.js
const db = wx.cloud.database();

Page({
  data: {
    tabs: ["笔记", "背诵", "收藏", "副本"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    note: [],
    recite: [],
    favor: []
  },

  /* 页面加载 */
  onLoad: function() {
    this.onLoadData();
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    this.onLoadData();
    //当逻辑执行完后关闭刷新    
    wx.stopPullDownRefresh()
  },

  /* 加载页面数据 */
  onLoadData:function(){
    var that=this;
    // 加载--我的笔记
    db.collection('userNote').where({
      _openid: app.data.openId
    }).get({
      success(res) {
        that.setData({
          note: res.data
        })
      }
    })
    // 加载--我的背诵
    db.collection('userRecite').where({
      _openid: app.data.openId
    }).get({
      success(res) {
        that.setData({
          recite: res.data
        })
        
      }
    })
    // 加载--我的收藏
    db.collection('userFavor').where({
      _openid: app.data.openId
    }).get({
      success(res) {
        that.setData({
          favor: res.data
        })
      }
    })
  },

  /* 加载云端数据，暂时没用到 */
  dateLoad: function() {
    // 引用云数据加载页面信息
    // const db = wx.cloud.database();
    db.collection('userFavor').get({
      success(res) {
        that.setData({
          note: res.data
        })
      }
    })
    console.log("加载中")
  },

  /* 导航切换 */
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /* 点击跳转至详情页 */
  pageToContent:function(e){
    console.log(e);
    var poetryId = e.currentTarget.dataset.poetryid; //获取组件id，该id是集合_id传递进去的
    wx.navigateTo({
      url: '../content/content?poetry_id=' + poetryId,
    })
  },

  /* 点击背诵跳转只背诵页面 */
  pageToRecite:function(e){
    console.log(e);
    var poetryId = e.currentTarget.dataset.poetryid; //获取组件id，该id是集合_id传递进去的
    var time = e.currentTarget.dataset.poetrytime;
    wx.navigateTo({
      url: '../recite/recite?poetry_id=' + poetryId + '&poetry_time=' + time,
    })
  },

  /* 删除笔记 */
  deleteNote: function(e) {
    var cb = this.data.note;
    var index = e.currentTarget.dataset.bindex; //获取组件的下标
    var id = e.currentTarget.dataset.id; //获取组件id，该id是集合_id传递进去的
    // 用数组做动态删除
    cb.splice(index, 1); //删除后更新数组
    this.setData({
      note: cb
    });
    // 删除云端记录
    const db = wx.cloud.database();
    db.collection('userNote').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  /* 删除背诵 */
  deleteRecite: function(e) {
    var cb = this.data.recite;
    var index = e.currentTarget.dataset.bindex; //获取组件的下标
    var id = e.currentTarget.dataset.id; //获取组件id，该id是集合_id传递进去的
    // 用数组做动态删除
    cb.splice(index, 1); //删除后更新数组
    this.setData({
      recite: cb
    });
    // 删除云端记录
    const db = wx.cloud.database();
    db.collection('userRecite').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  /* 删除收藏 */
  deleteFavor: function(e) {
    var cb = this.data.favor;
    var index = e.currentTarget.dataset.bindex; //获取组件的下标
    var id = e.currentTarget.dataset.id; //获取组件id，该id是集合_id传递进去的
    // 用数组做动态删除
    cb.splice(index, 1); //删除后更新数组
    this.setData({
      favor: cb
    });
    // 删除云端记录
    const db = wx.cloud.database();
    db.collection('userFavor').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

});