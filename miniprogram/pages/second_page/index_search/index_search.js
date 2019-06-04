const db = wx.cloud.database();
var searchValue;

Page({

  /**页面的初始数据*/
  data: {
    selectShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['作者', '名称', '朝代'], //下拉列表的数据
    searchContent: '', //搜索获取的内容
    index: 0, //选择的下拉列表下标
    contentSelectShow: true,
    recommendation: [
      ['《静夜思》', '唐朝', '李白'],
      ['《浣溪沙》', '北宋', '苏轼'],
      ['《滕王阁序》', '唐朝', '王勃']
    ], //动态文字
  },

  /**生命周期函数--监听页面加载*/
  onLoad: function() {

  },

  /**控制下拉列表显示或隐藏*/
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },

  /**点击下拉列表*/
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
  },

  /**单击搜索按钮*/
  gotoresult: function(e) {
    var that = this;
    var select;
    select = that.data.index; //获取搜索方式，1：作者；2：名称；3：朝代
    console.log("选择搜索的类型是：" + select);
    that.setData({
      contentSelectShow: false
    })
    switch (select) {
      case 0:
        console.log(searchValue);
        db.collection('poetry').where({
          //模糊查询
          //这个查询就是查询poetry表中 字段为writer中 like你传的值的所有数据
          //后面的$options:'1' 代表这个like的条件不区分大小写
          writer: {
            $regex: '.*' + searchValue,
            $options: 'i'
          }
        }).get({
          success: res => {
            that.setData({
              searchContent: res.data,
            })
            // console.log(res.data);
            // console.log(that.data);
          }
        });
        break;
      case 1:
        db.collection('poetry').where({
          title: {
            $regex: '.*' + searchValue,
            $options: 'i'
          }
        }).get({
          success: res => {
            that.setData({
              searchContent: res.data,
            })
            // console.log(res);
          }
        });
        break;
      case 2:
        db.collection('poetry').where({
          dynasty: {
            $regex: '.*' + searchValue,
            $options: 'i'
          }
        }).get({
          success: res => {
            that.setData({
              searchContent: res.data,
            })
            // console.log(res);
          }
        });
        break;
      default:
        console.log("选择错误。");
        break;
    }
  },

  /**实时获取input中value */
  formSearch: function(e) {
    searchValue = e.detail.value;
  },

  /**跳转事件函数_推荐跳转*/
  jumpPage1: function() {
    wx.navigateTo({
      url: '',
    })
    console.log('点击了第一个推荐内容')
  },
  jumpPage2: function() {
    wx.navigateTo({
      url: '',
    })
    console.log('点击了第二个推荐内容')
  },
  jumpPage3: function() {
    wx.navigateTo({
      url: '',
    })
    console.log('点击了第二个推荐内容')
  },

  /**跳转事件函数_诗词详情页跳转 */
  pageToContent: function(e) {
    console.log(e);
    var that = this;
    var index;
    index = e.currentTarget.dataset.index;
    var poetryId;
    poetryId = that.data.searchContent[index]._id;
    console.log(poetryId);
     wx.navigateTo({
       url: '../../content/content?poetry_id=' + poetryId,
     })
    console.log('点击搜索内容');
  }

})