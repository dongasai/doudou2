import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HeroesView from '@/views/HeroesView.vue'
import BeansView from '@/views/BeansView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ChaptersView from '@/views/StagesView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView
    },
    {
      path: '/beans',
      name: 'beans',
      component: BeansView
    },

    {
      path: '/skills',
      name: 'skills',
      component: SkillsView
    },
    {
      path: '/chapters',
      name: 'chapters',
      component: ChaptersView
    },

  ]
})

export default router