import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import StrackOut from '@/views/StrackOut.vue';
import BingoBook from '@/views/BingoBook.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/strack-out',
      name: 'strackOut',
      component: StrackOut,
    },
    {
      path: '/',
      name: 'bingoBook',
      component: BingoBook,
    }
  ],
});
