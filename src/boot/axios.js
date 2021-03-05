import Vue from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://18.139.108.244:81";

Vue.prototype.$axios = axios
