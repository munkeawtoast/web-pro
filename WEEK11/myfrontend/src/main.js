import router from './router'
import App from './App.vue'
import Vue from 'vue'

import 'bulma/css/bulma.css'
// other code ...

new Vue({
  router, // add router here
  render: (h) => h(App),
}).$mount('#app')
