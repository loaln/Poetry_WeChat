// miniprogram/pages/mine/mine.js

var sliderWidth = 96;                                   // 需要设置slider的宽度，用于计算中间位置
var app = getApp();                                     //获取app.js
const db = wx.cloud.database();                         //获取云开发数据库
var util = require('../../utils/utils.js');
var time = util.formatTime(new Date());                 //创建时间对象
const innerAudioContext = wx.createInnerAudioContext(); //创建音频对象
 
Page({
  data: {
    tabs: ["正文", "译文", "赏析", "作者"],
    activeIndex: 0,
    rec:'',          //判断是否添加到背诵
    col:'',          //判断是否添加到收藏
    voi:false,
    poetry:'',
    poetryContent:'',   //数据库数据换行符转换
    poetryNotes:'',
    poetryTranslate:'',
    poetryWriter:'',
    poetryAppreciation:'',
    state:false,        //分辨查看/添加笔记
    id:''               //记录创建收藏记录的_id，为删除记录准备的变量
  },

/**生命周期函数--监听页面加载*/
  onLoad: function (option) {
    var that = this;
    // 引用云数据加载页面信息
    db.collection('poetry').doc(option.poetry_id).get({
      success:res=> {
        that.setData({
          poetry: res.data,
          poetryContent: res.data.poetryContent.split('&hc').join('\n'),
          poetryNotes: res.data.poetryNotes.split('&hc').join('\n'),
          poetryTranslate: res.data.poetryTranslate.split('&hc').join('\n'),
          poetryWriter: res.data.poetryWriter.split('&hc').join('\n'),
          poetryAppreciation: res.data.poetryAppreciation.split('&hc').join('\n'),
        })
        innerAudioContext.autoplay = false;
        innerAudioContext.src = this.data.poetry.videoSrc;
        this.checkRecAndCol();
      }
    })
  },
  
/**生命周期函数--监听页面卸载*/
  onUnload: function () {
    innerAudioContext.stop(); //跳出页面停止音频播放
  },

/**检查是否添加背诵和收藏 */
  checkRecAndCol:function(){
    var that=this;
    db.collection('userFavor').where({
      _openid: app.data.openId,
      poetryId: that.data.poetry._id
    }).get({
      success: res =>{
        if(res.data!=''){
          that.setData({
            col: true
          })
          console.log("已收藏")
        }else{
          that.setData({
            col: false
          })
          console.log("未收藏")
        }
      }
    }),
    db.collection('userRecite').where({
      _openid: app.data.openId,
      poetryId: that.data.poetry._id
    }).get({
      success: res =>{
        if (res.data != '') {
          that.setData({
            rec: true
          })
          console.log("已添加背诵")
        } else {
          that.setData({
            rec: false
          })
          console.log("未添加背诵")
        }
      }
    })
  },

/**导航条切换 */
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

/**背诵按钮 */
  recClick:function(){
    var rec1;
    var poetry1;
    var id1;
    rec1=this.data.rec;
    poetry1 = this.data.poetry;
    id1 = this.data.id;
    this.setData({
      rec:!rec1
    });
    //添加和移出背诵
    if (rec1 == false) {
      db.collection('userRecite').add({
        data: {
          title: poetry1.title,
          time: time,
          poetryId: this.data.poetry._id,
          dynasty: poetry1.dynasty,
          writer: poetry1.writer,
        },
        success: res => {
          id1 = res._id;
          this.setData({
            id: id1
          })
          console.log(res);
        }
      })
    } else {
      console.log(id1);
      db.collection('userRecite').doc(id1).remove({
        success: res => {
          wx.showToast({
            title: '移出背诵',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '移出失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    }
  },

/**收藏按钮 */
  colClick: function () {
    var col1;
    var poetry1;
    var id1;
    col1 = this.data.col;
    poetry1 = this.data.poetry;
    id1 = this.data.id;
    this.setData({
      col:!col1
    });
    //添加和移出收藏
    if (col1 == false) {
      db.collection('userFavor').add({
        data:{
          title: poetry1.title,
          dynasty: poetry1.dynasty,
          writer: poetry1.writer,
          poetryId: this.data.poetry._id,
          time: time,
        },
        success:res=>{
          id1=res._id;
          this.setData({
            id:id1
          })
          console.log(res);
        }
      })
    } else {
      console.log(id1);
      db.collection('userFavor').doc(id1).remove({
        success: res => {
          wx.showToast({
            title: '移出收藏',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '移出失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    }
  },

/**播放音频按钮 */ 
  voiceClick: function (e) {
    var voi1;
    voi1 = this.data.voi;
    this.setData({
      voi: !voi1
    });
    if(voi1!=true){
      innerAudioContext.play();
    } else if (voi1 == true){
      innerAudioContext.stop();
    }
  },

/**跳转至笔记详情页 */
  pageToNoteDetail:function(e){
    var that=this;
    var pid,ptitle;
    app.data.noteEdit = e.currentTarget.dataset.state;
    pid = that.data.poetry._id;  //获取该页诗的id，待传递到userNote集合
    ptitle = that.data.poetry.title;
    wx.navigateTo({
      url: '../second_page/note/note?poetry_id=' + pid + "&poetry_title=" + ptitle})
  }
})