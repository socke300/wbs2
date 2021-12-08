import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import moment from 'moment';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


Vue.filter('formatDate', function(value: Date) {
  if (value) {
    return moment(String(value)).format('MM.DD.YYYY hh:mm')
  }
});
