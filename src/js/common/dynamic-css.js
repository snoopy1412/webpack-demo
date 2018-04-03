const ua = navigator.userAgent
if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)) {
  require.ensure([], function(require) {
    // 添加移動端樣式文件
    require("@sass/mobile.scss");

    // 模型寬度
    const WIDTH = 750; 

    const $head = document.querySelector('head');
    // 簡單的移動端方案
    const PHONE_SCALE = parseInt(window.screen.width) / WIDTH
    if (/Android (\d+\.\d+)/.test(ua)) {
      var version = parseFloat(RegExp.$1)
      // andriod 2.3
      if (version > 2.3) {
        console.log($head.innerHTML)
        $head.innerHTML += `<meta name="viewport" content="width=${WIDTH}, minimum-scale=${PHONE_SCALE}, maximum-scale=${PHONE_SCALE}">`
      // andriod 2.3以上
      } else {
        $head.innerHTML += `<meta name="viewport" content="width=${WIDTH}">`
      }
    // 其他系统
    } else {      
      $head.innerHTML += `<meta name="viewport" content="width=${WIDTH}, user-scalable=no">`
    }
  });
} else {
  require.ensure([], function(require) {
    require("@sass/web.scss");
  });
}