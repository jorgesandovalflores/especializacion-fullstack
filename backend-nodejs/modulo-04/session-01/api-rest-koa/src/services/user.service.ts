export const UserService = {
	async getAll() {
		return [{ id: 1, name: 'Alice' }]
	},
	async create(data: any) {
		return { id: Date.now(), ...data }
	}
}