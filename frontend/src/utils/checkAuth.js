function checkAuth() {
  return (localStorage.getItem("access-token")) ? true : false;
}

export default checkAuth;