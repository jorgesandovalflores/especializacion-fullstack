<template>
	<el-dialog v-model="props.visible" title="Confirmar Eliminación" width="400px" @close="handleClose">
	  <span>¿Seguro que quieres eliminar este usuario?</span>
	  <template #footer>
		<el-button @click="handleClose">Cancelar</el-button>
		<el-button type="danger" @click="confirmDelete">Eliminar</el-button>
	  </template>
	</el-dialog>
</template>
  
<script lang="ts" setup>
  const props = defineProps<{
	visible: boolean;
  }>();
  const emit = defineEmits(['update:visible', 'confirm']);
  
  function confirmDelete() {
	emit('confirm');
  }
  
  function handleClose() {
	emit('update:visible', false);
  }
</script>  