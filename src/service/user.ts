export const searchUserByEmail = async (query: string) => {
  const res = await fetch(`/api/user/search?email=${query}`);
  return res.json();
};