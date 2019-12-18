<template>
  <div class="page">
    <div class="pageHead">
      <img  @click="imgReturn()" src="../assets/image/headBac.png" />
      <div class="red">
        <img src="../assets/image/red.png">
        <div @click="toggleBlock=true">
          <img src="../assets/image/click.png" >
        </div>
      </div>
    </div>
    <div class="pageCont">
      <div class="houseTitle" v-if="houseList.length!=0">
        <div><span class="span" v-for='(item,index) in houseList' :key='"title"+index' @click="tabCheck(index)" :style="{'color':checkType==index?'#f22a32':'#666'}">{{item.title}}<span v-show="checkType==index"></span></span></div>
      </div>
      <div class="houseList" v-if="houseList.length!=0">
        <swiper :options="swiperOption"  ref="swiper">
          <!-- 添加的图片 -->
          <swiper-slide  class="swiperSlide" v-for='(item,index) in houseList' :key='"img"+index'>
            <div>
              <img @click="houseDetail(item.id)" class="swiper-slide" :src="item.house_img" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div @click="seeMore();" class="seeMore">
        <img src="../assets/image/more.png">
      </div>
      <div class="xinren">
        <img src="../assets/image/realHouse.png" >
        <img src="../assets/image/anquan.png" >
        <img src="../assets/image/realName.png" >
      </div>
      <div class="foot">
        <img src="../assets/image/zhudd.png">
      </div>
    </div>
    <div class="redBlock" v-if='toggleBlock'>
      <section></section>
      <div class="div"  @click="imgReturn()">
          <div><input type="number" v-model="userPhone" maxlength="11" placeholder="请输入手机号"></div>
          <div><input type="number" v-model="userCode" placeholder="请输入验证码"><span @click="times==0 && userPhone.length==11?toTencentCap():null" :class="{'whitebac':userPhone.length==11}">{{times==0?'获取验证码':times+'s后获取'}}</span></div>
          <div @click="lijilingqu"><img  @click="imgReturn()" src="../assets/image/liji.png" ></div>
          <div @click="toggleBlock=false">
            <img src="../assets/image/close.png" />
          </div>
      </div>
    </div>
    <!-- 模态框 -->
    <div v-if="modal_toggle" class="modal" @touchmove.prevent >
      <div @click="modal_toggle=false" class="bac"></div>
      <div class="cont">
        <div>提示</div>
        <div>您是否已经安装住多多APP？</div>
        <div>
          <span @click="toZhuDd(true)">是</span>
          <span @click="toZhuDd(false)">否</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import userFrom from '../assets/js/userFrom'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data(){
    // 保存this
    const self=this
    return{
      toggleBlock:false,
      times:0,
      userPhone:'',
      userCode:'',
      modal_toggle:false,
      houseId:null,
      houseList:[],
      checkType:0,
      swiperOption:{
        slidesPerView: 'auto', //显示几张
        loop: true,//是否循环
        centeredSlides:true,//是否居中
        on:{
          // swiper切换事件
          slideChange:function(e){
            //保存切换下标到全局
            self.checkType=this.realIndex
          },
          tap:function(e){
            console.log(e)
          }
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  watch:{
    // 每次关闭验证码模态框 清除用户已经填写的
    "toggleBlock":function(n,o){
      if(!n){
        this.userPhone=''
        this.userCode=''
      }
    },
    // 每次关闭是否安装模态框 清除房源ID
    "modal_toggle":function(n,o){
      if(!n) this.houseId=null
    },
    "checkType":function(n,o){
      let houseList=document.getElementsByClassName('houseList')[0]
      houseList.scrollLeft=0
    }
  },
  created(){
    //实例化 userFrom
    this.userFrom=new userFrom(this);
  },
  mounted(){
    this.getHouseList();
  },
  methods:{
    // 获取房源列表
    getHouseList(){
      this.$axios.get('/v3/Active/getKnowAbout').then((res)=>{
        if(res.data.sta==200){
          this.houseList=res.data.result
        }
      })
    },
    //图片防点击
    imgReturn(){
      return false
    },
    // 打开腾讯验证码
    toTencentCap(){
      if(this.userPhone.length!=11){
        this.$message({
          message: '请输入手机号码',
          type: 'warning',
          duration:1000
        });
      }else{
        let captcha1 = new TencentCaptcha('2012059542',(res)=>{
          //定时器
          let timer;
          if(res.ret==0){ 
            //发送成功后以后只显示重新发送
            this.$axios.post('/v3/user/sendValidateCode',qs.stringify({
                source:'h5',
                phone:this.userPhone,
                ticket:res.ticket,
                randstr:res.randstr
              })).then((res)=>{
              if(res.data.sta==200){
                this.$message({
                  message: '验证码发送成功',
                  center: true,
                  type: 'success'
                });
                this.times=60;
                //定时器
                timer=setInterval(()=>{
                  this.times--;
                  if(this.times==0){
                    clearInterval(timer)
                  }
                },1000)
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        });
        captcha1.show(); // 显示验证码
      }
    },
    // 点击立即领取按钮
    lijilingqu(){
      if(!this.userPhone || this.userPhone.length!=11){
        this.$message({
          message: '请输入正确的手机号',
          type: 'warning',
          duration:1000
        });
      }else if(!this.userCode){
        this.$message({
          message: '请输入验证码',
          type: 'warning',
          duration:1000
        });
      }else{
        this.$axios.post('/v3/couponRegister',qs.stringify({
          source:'h5',
          phone:this.userPhone,
          code:this.userCode,
          userId:''
        })).then((res)=>{
          if(res.data.sta==200){
            this.$message({
              message: '领取成功，请前往住多多APP查看',
              center: true,
              type: 'success',
              duration:1000
            });
            this.toggleBlock=false;
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }
    },
    //点击切换类型 
    tabCheck(index){
      this.checkType=index
      // 点击title栏跳转到对应下标的图片
      this.$refs.swiper.swiper.slideTo(index)
    },
    // 点击房源详情
    houseDetail(id){
      this.houseId=id;
      this.modal_toggle=true;
    },
    // 点击查看更多
    seeMore(){
      this.modal_toggle=true
    },
    // 用户点击是否跳转
    toZhuDd(bool){
      // 关闭是否安装模态框
      this.modal_toggle=false
      //bool 是否安装
      if(this.houseId){
        this.userFrom.toAppOrLoad(bool,this.houseId)
      }else{
        this.userFrom.toHouseList(bool);
      }
    },
  }
}
</script>
<style lang="less" scoped>
.page{
  height: 100%;
  width: 100%;
  .pageHead{
    height: 690px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .red{
      width: 695px;
      height: 114px;
      position: absolute;
      left: 50%;
      bottom:34px;
      transform: translateX(-50%);
      img{
        width: 100%;
        height: 100%;
      }
      div{
        width: 150px;
        height: 46px;
        position: absolute;
        top: 24%;
        right: 42px;
      }
    }
  }
  .pageCont{
    background: url('../assets/image/bigbac.png') no-repeat 100% 100%; 
    .houseTitle{
      height: 80px;
      background: #fff;
      padding: 0 60px;  
      div{
        display: flex;
        justify-content: space-between;
        line-height: 80px;
        font-size: 26px;
        color: #666;
        font-weight: 600;
        .span{
          position: relative;
          span{
            position: absolute;
            left: 50%;
            bottom:7px;
            transform: translateX(-50%);
            display: block;
            margin: 0 auto;
            width: 40px;
            height: 6px;
            border-radius: 6px;
            background: #f22a32;
          }
        }
      }
    }
    .houseList{
      height: 800px;
      padding:30px 0;
      // 轮播垂直居中
      .swiper-wrapper{
        display: flex;
        align-items: center;
      }
      // 轮播图片样式
      .swiperSlide{
        width: 600px;
        height: 700px;
        margin:50px 15px 0;
        transition: 0.1s;
        div{
          width: 100%;
          height: 100%;
          img{
            border-radius: 20px;
          }
        }
      }
      // 轮播居中图片样式
      .swiper-slide-active{
        height: 800px!important;
        margin: 0 15px 0!important;
      }
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .seeMore{
      width: 480px;
      height: 88px;
      margin: 0 auto 60px;
      img{
        width: 100%;
        height: 100%;
      }
    }   
    .xinren{
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 60px;
      margin-bottom: 70px;
      img{
        width: 150px;
        height: 120px;
        display: block;
      }
    }
    .foot{
      padding-bottom: 76px;
      img{
        display: block;
        width: 288px;
        height: 41px;
        margin: 0 auto;
      }
    }
  }
  .redBlock{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    .div{
      height: 822px;
      width: 585px;
      background-image: url('../assets/image/redbac.png');
      background-size:100% 100%;
      position:relative;
      div:nth-of-type(1){
        margin: 512px 84px 20px 60px;
        height: 66px;
        input{
          width: 100%;
          height: 100%;
          border-radius: 66px;
          border: none;
          outline: none;
          box-sizing: border-box;
          padding: 0 30px;
          background: rgba(255, 255, 255, 0.5);
          color: #333;
          font-size: 26px;
        }
        input::-webkit-input-placeholder{
          color: #fff;
          font-size: 26px;
        }
      }
      div:nth-of-type(2){
        margin: 0 84px 30px 60px;
        height: 66px;
        display: flex;
        input{
          width: 60%;
          height: 100%;
          border-radius: 66px 0 0 66px;
          border: none;
          outline: none;
          box-sizing: border-box;
          padding: 0 30px;
          background: rgba(255, 255, 255, 0.5);
          color: #333;
          font-size: 26px;
        }
        span{
          display: block;
          width: 40%;
          line-height: 66px;
          font-size: 26px;
          color: #333;
          background: rgba(255, 255, 255, 0.5);
          border-radius:0 60px 60px 0;
          padding-left: 16px;
          box-sizing: border-box;
        }
        input::-webkit-input-placeholder{
          color: #fff;
          font-size: 26px;
        }
      }
      div:nth-of-type(3){
        margin: 0 126px 0 102px;
        height: 86px;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      div:nth-of-type(4){
        width: 60px;
        height: 60px;
        position: absolute;
        bottom: -110px;
        left: 250px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    section{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }
  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 20; 
    .bac{
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
    .cont{
      width: 70%;
      padding-top:36px;
      box-sizing: border-box;
      line-height: 1;
      position: absolute;
      top:30%;
      left:50%;
      transform: translateX(-50%);
      height: 300px;
      background: #fff;    
      border-radius: 30px;
      display: flex;
      flex-direction: column;
      div:nth-of-type(1){
        color: #666;
        font-weight: 600;
        font-size: 32px;
        text-align: center;
      }   
      div:nth-of-type(2){
        flex: 1;
        color: #333;
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      } 
      div:nth-of-type(3){
        border-top: 1px solid #eee;
        span{
          display: inline-block;
          box-sizing: border-box;
          width:50%;
          height: 80px;
          line-height:80px;
          text-align: center;
          font-size: 26px;
        }
        span:nth-of-type(1){
          border-right: 0.5px solid #eee;
        }
        span:nth-of-type(2){
          border-left: 0.5px solid #eee;
        }
      }
    }
  }
  .whitebac{
    background: rgba(255, 255, 255, 0.8)!important;
  }
}
</style>