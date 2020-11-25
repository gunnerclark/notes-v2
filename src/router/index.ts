import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import App from '../App.vue';
import Login from '../login-register/Login.vue';
import Register from '../login-register/Register.vue';
import store from '../store/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'App',
    component: App,
    meta: {
      title: 'Notes Demo'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login Demo'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'Register Demo'
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: (): string => {
      if (store.getters.getLoggedIn) {
        return '/';
      } else {
        return '/login';
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = store.getters.getLoggedIn;
  if (to.path === "/" && loggedIn) {
    console.log('login')
    if (to.path === "/") {
      next();
    } else {
      next({
        path: '/'
      });
    }
  } else if (to.path === "/" && loggedIn === false) {
    next({
      path: '/login'
    });
  } else if (to.path === "/login" && loggedIn === true) {
    next({
      path: '/'
    });
  } else if (to.path === "/register" && loggedIn === true) {
    next({
      path: '/'
    });
  } else {
    next();
  }
  /*
  if (loggedIn) {
    next();
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next({
        path: '/login'
      });
    }
  }
  */
})

export default router;
