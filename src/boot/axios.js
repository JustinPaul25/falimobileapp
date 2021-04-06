import Vue from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://18.139.108.244:81";

const sanaInstance = axios.create({
    withCredentials: true,
    baseURL: 'https://voice-api.sanalabs.com/api/v1'
})

Vue.prototype.$axios = axios
Vue.prototype.$sana = sanaInstance
