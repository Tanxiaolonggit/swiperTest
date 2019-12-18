import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
Vue.prototype.$axios=axios
Vue.config.productionTip = false
// import captcha from 'vue-social-captcha' //腾讯验证码
// Vue.use(captcha)
import ElementUI from 'element-ui'; //element ui
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)
// axios.defaults.baseURL = 'http://test.zhudd.cn/'
// axios.defaults.baseURL = 'https://apis.zhudd.com/'
axios.defaults.baseURL = 'http://192.168.1.160/'
new Vue({
  render: h => h(App),
}).$mount('#app')
