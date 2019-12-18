const UserFrom = class{
    constructor(vue){
        this.vue=vue
    }
    //获取用户设备
    getUserFrom(id){
        //查看设备
        let userFrom=navigator.userAgent;
        if(userFrom.match(/MicroMessenger/i)== "micromessenger"){ //微信
          // console.log("weixin")
        }else if(userFrom.indexOf("iPhone")>-1){ //IOS
          location.href ="com.zhudd.appname://?type=3&housType=2&houseId="+id;
          // console.log("iPhone")
        }else if(userFrom.indexOf("Android")>-1 || userFrom.indexOf("Linux")>-1){ //安卓
          // console.log("Android")
          window.location.href = "android://main//?type=3&housType=2&houseId="+id; /***打开app的协议，有安卓同事提供***/  
        }
    }
    // 前往房源列表
    toHouseList(bool){
      let userFrom=navigator.userAgent;
      //bool是判断用户是否安装app
      if(userFrom.indexOf("iPhone")>-1){ //IOS
        // console.log("iPhone")
        if(bool){
          location.href ="com.zhudd.appname://?type=2"
        }else{
          window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.zhudduser.mf&g_f=undefined"
        }
      }else if(userFrom.indexOf("Android")>-1 || userFrom.indexOf("Linux")>-1){ //安卓
        // console.log("Android")
        if(bool){
          window.location.href = "android://main//?type=2"
        }else{
          window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.zhudduser.mf&g_f=undefined"
        }
      }
    }
    toAppOrLoad(bool,id){
        //bool 是否安装 判断id是否存在 存在就跳详情 不存在跳优惠券
        let userFrom=navigator.userAgent;
        if(userFrom.indexOf("iPhone")>-1){ //IOS
            // console.log("iPhone")
            bool
            ?id?location.href ="com.zhudd.appname://?type=3&housType=2&houseId="+id:location.href ="com.zhudd.appname://?type=2"
            :window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.zhudduser.mf&g_f=undefined"
        }else if(userFrom.indexOf("Android")>-1 || userFrom.indexOf("Linux")>-1){ //安卓
            // console.log("Android")
            bool
            ?id?window.location.href = "android://main//?type=3&housType=2&houseId="+id:window.location.href = "android://main//?type=2"
            :window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.zhudduser.mf&g_f=undefined"
        }
    }
}
export default UserFrom