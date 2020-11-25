import Vue from 'vue';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faBars);

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	components: { App },
	template: '<App/>',
});
