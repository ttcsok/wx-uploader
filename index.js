function e(e, t, a) {
  return t in e ? Object.defineProperty(e, t, {
    value: a,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = a, e;
}

var t = [],
  a = 0,
  r = [];

var app = getApp();

Component({
  properties: {
    imgMax: {
      type: Number,
      value: 0
    },
    token: String,
    key: {
      type: String,
      value: "wx-upload"
    }
  },
  data: {
    imgGroup: [],
    progressList: []
  },
  methods: {
    addImg: function() {
      var s = this,
        i = this.data.imgGroup;
      wx.chooseImage({
        count: this.data.imgMax - i.length,
        success: function(n) {
          s.triggerEvent("on-chooseImage"), (i = i.concat(n.tempFilePaths)).length > s.data.imgMax && i.splice(s.data.imgMax),
            s.setData({
              imgGroup: i
            });
          var o = n.tempFilePaths.length;
          a = i.length;
          for (var g = 0; g < n.tempFilePaths.length; g++) ! function(i) {
            var g = n.tempFilePaths[i].split(".")[n.tempFilePaths[i].split(".").length - 1],
              l = new Date().getTime(),
              p = Math.round(1e6 * Math.random());
			  
			  var tfp = n.tempFilePaths[i];
			  
            r[i + a - o] = wx.getImageInfo({  
				    //获得原始图片大小
        src: tfp,
        success(res) {
 
          var originWidth, originHeight;
          originHeight = res.height;
          originWidth = res.width;
          console.log(originWidth);
		 
          //压缩比例
          // 最大尺寸限制
          var maxWidth = 640,
            maxHeight = 1200;
          // 目标尺寸
          var targetWidth = originWidth,
            targetHeight = originHeight;
          //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 要求宽度*(原生图片比例)=新图片尺寸
              targetWidth = maxWidth;
              targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
          }
          s.setData({
            cWidth: targetWidth,
            cHeight: targetHeight
          });

          //尝试压缩文件，创建 canvas
          var ctx = wx.createCanvasContext('canvas',s);
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(tfp, 0, 0, targetWidth, targetHeight);
          ctx.draw(false, setTimeout(function () { 
            wx.canvasToTempFilePath({
              canvasId: 'canvas',
              fileType:'jpg',
              destWidth:targetWidth,
              destHeight:targetHeight,
              quality:0.9,
              success: (rr) => { 
			var   tempFilePath = rr.tempFilePath ;
			  console.log(rr.tempFilePath);
         
              wx.uploadFile({
              url: app.util.url('entry/wxapp/index', {
                'm': 'imeshop',
                'controller': 'goods.doPageUpload'
              }),
              filePath: tempFilePath,
              name: "upfile",
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData: {
                token: s.data.token,
                key: s.data.key + "-" + l + "-" + p + "." + g
              },
              success: function(r) {
                t[i + a - o] = JSON.parse(r.data).image_o, s.setData(e({}, "progressList[" + (i + a - o) + "]", 100)),
                  s.triggerEvent("on-changeImage", {
                    value: t,
                    len: a
                  });
              }
            })
              },
              fail: (err) => {
                console.error(err)
              }
            }, s)
          }, 500));
          //保存图片 
        }
      						   
	
										 
				}) 
			;
          }(g);
        }
      });
    },
    remove: function(e) {
      var s = e.currentTarget.dataset.idx,
        i = this.data.imgGroup,
        n = this.data.progressList;
      n[s] < 100 && r[s].abort(), i.splice(s, 1), r.splice(s, 1), n.splice(s, 1), t.splice(s, 1),
        a = i.length, this.setData({
          imgGroup: i,
          progressList: n
        }), this.triggerEvent("on-changeImage", {
          value: t,
          len: a
        });
    },
    bigImg: function(e) {
      var t = e.currentTarget.dataset.src,
        a = e.currentTarget.dataset.list;
      wx.previewImage({
        current: t,
        urls: a
      });
    }
  },
  detached: function() {
    console.log("detached"), t = [], a = 0, r = [];
  }
});
