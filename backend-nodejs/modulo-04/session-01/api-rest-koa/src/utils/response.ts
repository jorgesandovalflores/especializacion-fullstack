export const successResponse = (data: any, message = 'Success') => ({
	status: 'success',
	message,
	data
})