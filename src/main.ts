import { createApp } from "vue";
import View from "./View.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faBars, faGripLines, faSignInAlt, faSignOutAlt, faUser, faEdit, faSortUp, faSortDown, faList, faStickyNote, faFolder, faArchive, faThumbtack, faTrash, faTrashRestore, faChevronLeft, faSave, faPlus, faPlusSquare, faSquare, faCheckSquare, faTimes, faBookmark, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faPreBookmark, faFolder as faPreFolder, faCheckSquare as faHollowCheckSquare, faSquare as faHollowSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faBars, faGripLines, faSignInAlt, faSignOutAlt, faEdit, faSortUp, faSortDown, faList, faStickyNote, faFolder, faPreFolder, faArchive, faThumbtack, faTrash, faTrashRestore, faChevronLeft, faSave, faPlus, faPlusSquare, faSquare, faHollowSquare, faCheckSquare, faHollowCheckSquare, faTimes, faBookmark, faPreBookmark, faEyeSlash, faEye );

//App.component('fa-icon', FontAwesomeIcon);

//App.config.productionTip = false;

createApp(View)
  .use(store)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .mount("#app");
