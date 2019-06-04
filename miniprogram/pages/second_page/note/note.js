var app = getApp(); //获取app.js
var util = require('../../../utils/utils.js');
var time = util.formatTime(new Date());
const db = wx.cloud.database();
var poetry_id;
var poetry_title;
var note_id;

Page({

  data: {
    edit: '', //查看或编辑笔记变量
    noteContentEdited: '', //显示笔记内容
    noteContentEditing: '', //显示编辑笔记内容
    noteTime: ''
  },

  onLoad: function(options) {
    console.log(options);
    wx.cloud.init();
    poetry_id = options.poetry_id; //传递上级页面诗的_id
    poetry_title = options.poetry_title; //传递上级页面诗的题目
    this.checkUserNote(); //调用函数，检查笔记内容加载
    this.setData({
      edit: app.data.noteEdit //传递进来的数值，判断是查看/打开笔记
    })
  },

  /**判断是否有加入笔记，并为笔记主体赋值 */
  checkUserNote: function() {
    var that = this;
    console.log("用户_openid：" + app.data.openId);
    db.collection('userNote').where({
      _openid: app.data.openId,
      poetryId: poetry_id
    }).get({
      success: res => {
        console.log(res);
        if (res.data != '') {
          note_id = res.data[0]._id;
          that.setData({
            noteContentEdited: res.data[0].content,
            noteContentEditing: res.data[0].content,
            noteTime: res.data[0].noteTime
          })
        } else {
          that.setData({
              noteContentEdited: "您还没有创建笔记。",
              noteContentEditing: "",
              noteTime: time
            }),
            db.collection('userNote').add({
              data: {
                poetryId: poetry_id,
                poetryTitle: poetry_title,
                content: "",
                noteTime: time
              },
              success:res=>{
                console.log('笔记记录id号',res._id);
                note_id = res._id;
              }
            })
        }
      }
    })
  },

  /**显示笔记主体 */
  editClick: function() {
    this.setData({
      edit: true
    });
  },

  /**点击按钮更新云端记录 */
  publishClick: function(e) {
    var that = this;
    that.setData({
      edit: false,
      noteTime: time
    });
    db.collection('userNote').doc(note_id).update({
      data: {
        content: that.data.noteContentEdited,
        noteTime: time
      },
      success: res => {
        console.log("dads");
      }
    })
  },

  /**实时更新数据，但还没上传云端 */
  formName: function(e) {
    this.setData({
      noteContentEdited: e.detail.value,
      noteContentEditing: e.detail.value
    })
  },

})