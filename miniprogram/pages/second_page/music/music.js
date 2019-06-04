const db = wx.cloud.database();
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
 
  onReady(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    poster: '',
    name:' ',
    author: '' ,
    src: '',
    title:'',
    lyric:'',
    lyricing:'',
    src:'',
    musicType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      musicType: options.musicType
    })
    if (this.data.musicType == 1) {
    db.collection('music').where({
      _id: '89cb705e-e468-4e2a-8789-ed21e5dae69f'
      
    }).get({
      success: res => {
        this.setData({
          title: res.data[0].title,
          name: res.data[0].name,
          author: res.data[0].author,
          poster: res.data[0].poster,
          src:res.data[0].src,
          lyric: res.data[0].lyric.split('&hc').join('\n')
        });
        console.log(res)
        }
    })
      console.log('app.globalData.musicType');
     
    };
    if (this.data.musicType ==2) {
      db.collection('music').where({
        _id: '48ab4592-da6f-411a-a4db-c18da88ea9d2'

      }).get({
        success: res => {
          this.setData({
            title: res.data[0].title,
            name: res.data[0].name,
            author: res.data[0].author,
            poster: res.data[0].poster,
            src: res.data[0].src,
            lyric: res.data[0].lyric.split('&hc').join('\n')
          });
          console.log(res)
        }
      })

    };
    if (this.data.musicType ==0) {
      db.collection('music').where({
        _id: '44aeb693-4678-4d76-91e0-fa005387ed66'

      }).get({
        success: res => {
          this.setData({
            title: res.data[0].title,
            name: res.data[0].name,
            author: res.data[0].author,
            poster: res.data[0].poster,
            src: res.data[0].src,
            lyric: res.data[0].lyric.split('&hc').join('\n')
          });
          console.log(res)
        }
      })
    };
  },
  
})