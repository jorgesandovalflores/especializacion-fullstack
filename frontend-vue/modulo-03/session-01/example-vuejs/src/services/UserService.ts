import type { ModelUser } from '../common/models/ModelUser'
import axiosInstance from './axiosInstance'

const endpoint = '/Users'

export const UserService = {
	async list(): Promise<ModelUser[]> {
		const { data } = await axiosInstance.get(endpoint)
		return data
	},

	async create(user: Omit<ModelUser, 'id'>): Promise<ModelUser> {
		const { data } = await axiosInstance.post(endpoint, user)
		return data
	},

	async update(user: ModelUser): Promise<ModelUser> {
		const { data } = await axiosInstance.put(`${endpoint}/${user.id}`, user)
		return data
	},

	async remove(id: string): Promise<void> {
		await axiosInstance.delete(`${endpoint}/${id}`)
	}
}
