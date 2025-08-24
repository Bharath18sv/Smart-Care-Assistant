let userRole: string | null = null;

export const setUserRole = (role: string | null) => {
  userRole = role;
};

export const getUserRole = () => {
  return userRole;
};
