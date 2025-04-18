import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HeroesView from '@/views/HeroesView.vue'
import BeansView from '@/views/BeansView.vue'
import SkillsView from '@/views/SkillsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ]
})

export default router