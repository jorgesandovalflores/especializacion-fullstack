<template>
	<el-dialog v-model="localVisible" :title="formTitle" width="500px" @close="handleClose">
	  <el-form @submit.prevent="submitForm" label-width="100px">
		<el-form-item label="Nombre" :error="errors.name">
		  <el-input v-model="name" />
		</el-form-item>
  
		<el-form-item label="Email" :error="errors.email">
		  <el-input v-model="email" />
		</el-form-item>
  
		<el-form-item label="Contraseña" :error="errors.password">
		  <el-input v-model="password" type="password" show-password />
		</el-form-item>
  
		<el-form-item label="Rol" :error="errors.role">
		  <el-select v-model="role" placeholder="Selecciona un rol">
			<el-option label="Admin" value="admin" />
			<el-option label="User" value="user" />
		  </el-select>
		</el-form-item>
  
		<el-form-item>
		  <el-button type="primary" :loading="loading" @click="submitForm">
			{{ user ? 'Actualizar' : 'Crear' }}
		  </el-button>
		</el-form-item>
	  </el-form>
	</el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useUserStore } from '../stores/useUserStore';
  import type { ModelUser } from '../common/models/ModelUser';
  
  // Define props
  const props = defineProps<{
	modelValue: boolean;
	user?: ModelUser | null;
  }>();
  
  // Define emits
  const emit = defineEmits(['update:modelValue', 'saved']);
  
  // Local copy of visible
  const localVisible = ref(props.modelValue);
  
  // Watch changes in the parent
  watch(() => props.modelValue, (val) => {
	localVisible.value = val;
  });
  
  // Watch changes locally and sync to parent
  watch(localVisible, (val) => {
	emit('update:modelValue', val);
  });
  
  const userStore = useUserStore();
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const role = ref('');
  const loading = ref(false);
  const errors = ref<Record<string, string>>({});
  
  const formTitle = computed(() => (props.user ? 'Editar Usuario' : 'Nuevo Usuario'));
  
  watch(() => props.user, (u) => {
	if (u) {
	  name.value = u.name;
	  email.value = u.email;
	  password.value = u.password;
	  role.value = u.role;
	} else {
	  name.value = '';
	  email.value = '';
	  password.value = '';
	  role.value = '';
	}
  }, { immediate: true });
  
  function validateForm() {
	errors.value = {};
	if (!name.value) errors.value.name = 'Nombre obligatorio';
	if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) errors.value.email = 'Email válido obligatorio';
	if (!password.value || password.value.length < 6) errors.value.password = 'Mínimo 6 caracteres';
	if (!role.value) errors.value.role = 'Rol obligatorio';
	return Object.keys(errors.value).length === 0;
  }
  
  async function submitForm() {
	if (!validateForm()) return;
  
	loading.value = true;
	try {
	  const userData = {
		name: name.value,
		email: email.value,
		password: password.value,
		role: role.value,
	  };
  
	  if (props.user) {
		await userStore.update(props.user.id, userData);
	  } else {
		await userStore.create(userData);
	  }
	  emit('saved');
	  localVisible.value = false;
	} finally {
	  loading.value = false;
	}
  }
  
  function handleClose() {
	localVisible.value = false;
  }
  </script>
  