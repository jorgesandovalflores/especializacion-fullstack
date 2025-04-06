import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)
  const setUser = (u: any) => user.value = u
  return { user, setUser }
})