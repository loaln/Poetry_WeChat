// var timestamp = Date.parse(new Date());
// var date = new Date(timestamp);
// //获取年份  
// var Y = date.getFullYear();
// //获取月份  
// var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
// //获取当日日期 
// var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
console.log("当前时间戳为：" + timestamp);

//获取当前时间
var n = timestamp * 1000;
var date = new Date(n);
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
var tomorrow_timetamp = timestamp + 24 * 60 * 60*7;
//加一天的时间：
var n_to = tomorrow_timetamp * 1000;
var tomorrow_date = new Date(n_to);
//加一天后的年份
var Y2 = tomorrow_date.getFullYear();
//加一天后的月份
var M2= (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
//加一天后的日期
var D2= tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
//app.js
App({

  //定义全局变量 
  data: {
    noteEdit: false, //查看笔记true，编辑笔记false
    noteId:'',  //传递诗数据指定特定的笔记
    openId:''   //设置用户openid全局变量

  },

  onLaunch: function () {
    // 云开发初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
   
  },
  globalData: {
    result:'',
    Mon: M,
    Day: D,
    Year: Y,
    M_seven:M2,
    D_seven:D2,
    Y_seven:Y2,
    //以下三个变量用于传递数据
    tianDaka:0,//0表示填空未打卡，1表示已打卡
    reciteDaka: 0,//0表示背诵未打卡，1表示已打卡
  },
  
})
