export const getUserData = () => {
    const user = localStorage.getItem('user');
    console.log(user)
    return user ? JSON.parse(user) : null;
  };