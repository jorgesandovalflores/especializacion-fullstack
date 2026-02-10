import type { UserSigninRequest } from '../common/dto/UserSigninRequest'
import type { UserSigninResponse } from '../common/dto/UserSigninResponse'
import type { ModelUser } from '../common/models/ModelUser'
import axiosInstance from './axiosInstance'

const endpoint = '/users'

export const UserService = {
	async findAll(): Promise<ModelUser[]> {
		const response = await axiosInstance.get<ModelUser[]>('/users');
		return response.data;
	},
	
	async create(user: Omit<ModelUser, 'id'>): Promise<void> {
		await axiosInstance.post('/users', user);
	},
	
	async update(id: string, user: Omit<ModelUser, 'id'>): Promise<void> {
		await axiosInstance.put(`/users/${id}`, user);
	},
	
	async remove(id: string): Promise<void> {
		await axiosInstance.delete(`/users/${id}`);
	},

	async signin(request: UserSigninRequest): Promise<UserSigninResponse> {
		const { data } = await axiosInstance.post(`${endpoint}/login`, request)
		return data
	}
}
