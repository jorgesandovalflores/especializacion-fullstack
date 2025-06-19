export const createUser = async (data) => {
  return userRepository.save(data);
};