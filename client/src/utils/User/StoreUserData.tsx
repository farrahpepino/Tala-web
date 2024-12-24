export const storeUserData = (token, user) => {
  if(token !== null){
    localStorage.setItem('token', token);
  }
    localStorage.setItem('user', JSON.stringify(user));
  };