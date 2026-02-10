<template>
	<div>
	  <el-button type="primary" @click="openCreateForm">Nuevo Usuario</el-button>
  
	  <el-table :data="userStore.users" v-loading="userStore.loading" style="width: 100%; margin-top: 20px;">
		<el-table-column prop="name" label="Nombre" />
		<el-table-column prop="email" label="Email" />
		<el-table-column prop="role" label="Rol" />
		<el-table-column label="Acciones">
		  <template #default="{ row }">
			<el-button size="small" type="primary" @click="openEditForm(row)">Editar</el-button>
			<el-button size="small" type="danger" @click="openDeletePopup(row.id)">Eliminar</el-button>
		  </template>
		</el-table-column>
	  </el-table>
  
	  <UserForm v-if="showForm" v-model="showForm" :user="selectedUser" @saved="refreshUsers" />
	  <UserDeletePopup v-if="showDelete" v-model:visible="showDelete" @confirm="deleteUser" />
	</div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../stores/useUserStore';
  import type { ModelUser } from '../common/models/ModelUser';
  import UserForm from './UserForm.vue';
  import UserDeletePopup from './UserDeletePopup.vue';
  
  const userStore = useUserStore();
  const showForm = ref(false);
  const showDelete = ref(false);
  const selectedUser = ref<ModelUser | null>(null);
  const idToDelete = ref<string>('');
  
  onMounted(() => {
	refreshUsers();
  });
  
  function refreshUsers() {
	userStore.fetchUsers();
  }
  
  function openCreateForm() {
	selectedUser.value = null;
	showForm.value = true;
  }
  
  function openEditForm(user: ModelUser) {
	selectedUser.value = user;
	showForm.value = true;
  }
  
  function openDeletePopup(id: string) {
	idToDelete.value = id;
	showDelete.value = true;
  }
  
  async function deleteUser() {
	if (idToDelete.value) {
	  await userStore.remove(idToDelete.value);
	  idToDelete.value = '';
	  showDelete.value = false;
	  refreshUsers();
	}
  }
  </script>
  