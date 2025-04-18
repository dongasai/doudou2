import { createRouter, createWebHistory } from 'vue-router'
import BeansView from '@/views/BeansView.vue'
import HeroesView from '@/views/HeroesView.vue'
import SkillsView from '@/views/SkillsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/beans',
      name: 'beans',
      component: BeansView
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView
    },
    {
      path: '/skills',
      name: 'skills', 
      component: SkillsView
    },
    {
      path: '/',
      redirect: '/beans'
    }
  ]
})

export default router