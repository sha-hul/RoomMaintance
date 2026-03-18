export const getUser = () => {
  const data = sessionStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const getEmpId = () => {
  const user = getUser();
  return user?.empId || null;
};

export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};