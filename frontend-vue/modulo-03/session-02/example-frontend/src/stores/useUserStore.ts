import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ModelUser } from '../common/models/ModelUser'
import type { ModelError } from '../common/models/ModelError'
import { UserService } from '../services/UserService'

export const useUserStore = defineStore('user', () => {
	const users = ref<ModelUser[]>([])
	const isLoading = ref(false)
	const error = ref<ModelError | null>(null)

	async function fetchUsers() {
		isLoading.value = true
		error.value = null
		try {
			users.value = await UserService.list()
		} catch (err: any) {
			error.value = err as ModelError
		} finally {
			isLoading.value = false
		}
	}

	async function saveUser(user: Partial<ModelUser>) {
		error.value = null
		try {
			if (user.id) {
				const updated = await UserService.update(user as ModelUser)
				const index = users.value.findIndex(u => u.id === updated.id)
				if (index !== -1) users.value[index] = updated
			} else {
				const created = await UserService.create(user as Omit<ModelUser, 'id'>)
				users.value.push(created)
			}
		} catch (err: any) {
			error.value = err as ModelError
			throw err
		}
	}

	async function deleteUser(id: string) {
		error.value = null
		try {
			await UserService.remove(id)
			users.value = users.value.filter(u => u.id !== id)
		} catch (err: any) {
			error.value = err as ModelError
			throw err
		}
	}

	return {
		users,
		isLoading,
		error,
		fetchUsers,
		saveUser,
		deleteUser
	}
})
