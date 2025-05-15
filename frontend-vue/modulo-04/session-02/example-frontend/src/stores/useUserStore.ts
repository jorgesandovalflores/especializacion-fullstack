// src/stores/useUserStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserService } from '../services/UserService';
import type { ModelUser } from '../common/models/ModelUser';

export const useUserStore = defineStore('user', () => {
  const users = ref<ModelUser[]>([]);
  const loading = ref(false);

  async function fetchUsers() {
    loading.value = true;
    try {
      users.value = await UserService.findAll();
    } finally {
      loading.value = false;
    }
  }

  async function create(user: Omit<ModelUser, 'id'>) {
    await UserService.create(user);
  }

  async function update(id: string, user: Omit<ModelUser, 'id'>) {
    await UserService.update(id, user);
  }

  async function remove(id: string) {
    await UserService.remove(id);
  }

  return { users, loading, fetchUsers, create, update, remove };
});
