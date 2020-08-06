import Vue from 'vue'
import LogSdk from 'mainto-fed-log'

const logSdk = new LogSdk({
	project: 'show-pic-management',
	autoTrack: true
})
Vue.use(logSdk)
