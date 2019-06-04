const app = getApp();
const db = wx.cloud.database();
var answer = [];
var str=[];
var check=[];
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
    taskType:2,
    poeContent:'',
    userAnswer: '',
    ansCheck:'',
    rightNumber:'',
    reciteText:'',
    reciteDaka:'',
    tianDaka: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taskType: options.taskType,
    })
    if (this.data.taskType==1) {
      this.setData({
        src: 'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/reciting.png?sign=77919945f2ab1b8ad1986ead599a9c33&t=1558872253',
        reciteText:options.reciteText,
      })
      console.log(options.reciteText.length)
      if (options.reciteText.length>=25){
        this.setData({
          reciteDaka:true,
        })
        app.globalData.reciteDaka=1;
      }else{
        this.setData({
          reciteDaka: false,
        })
      }

    };
    if (this.data.taskType == 2) {
      this.setData({
        src: 'https://706f-poetry-d7007d-1259167935.tcb.qcloud.la/task/tianing.png?sign=70a67f3000dcd0b11a405cf2c09ee381&t=1558880748',

      })
    

    db.collection('tiankongDay1').get({
      success: res => {
        this.setData({
          poeContent: res.data,
        });
      }
    })
    str = JSON.parse(options.arr); 
    db.collection('Answer').where({
      _id:'c494ede0-2b3b-4428-835d-ed238dccb5a7',
    }).get({
      success: res => {
        var count = 0;
        console.log(res)
        for (var i = 0; i <= 9; i++) {
          if (str[i] != null) {
            if (str[i] ==res.data[0].answer[i]) {
              check[i] = 'true';
              count++;
              console.log('count：' + count)
            } else {
              check[i] = 'false';
            }

          } else { check[i] = 'false'; }
        }
        this.setData({
          userAnswer:str,
          ansCheck: check,
          rightNumber:count,
        })
        if (count>=5){
          app.globalData.tianDaka = 1;
          this.setData({
           tianDaka: true,
           
          })
        }else{
          this.setData({
            tianDaka: false,
          })
        }
      }
      })
    }
    // var recite_daka = [];
    // var tian_daka = [];
    // db.collection('userTask').where({
    //   _openid: app.data.openId,
    // }).get({
    //   success: res => {
    //     var id = res.data[0]._id
    //     console.log('0' + res)
    //     var recite_daka = res.data[0].reciteDaka;
    //     var tian_daka = res.data[0].tianDaka;
    //     console.log('1'+res.data[0].reciteDaka)
    //     console.log('2' + res.data[0].tianDaka)
    //     console.log('3' + recite_daka)
    //     console.log('4' + tian_daka)
    //     recite_daka.push('1324');
    //     tian_daka.push('876');
    //     console.log('5' + recite_daka)
    //     console.log('6' + tian_daka)
    //     db.collection('userTask').doc(id).update({
    //       data: {
    //         reciteDaka: recite_daka,
    //         tianDaka: tian_daka,
    //       },
    //       success: res => {
    //         console.log("打卡创建");
    //       }
    //     })
    //   }
    // })
 
   },
jumpTask: function (e) {
  wx.switchTab({
    url: '../../task/task',
  })
},
  
})