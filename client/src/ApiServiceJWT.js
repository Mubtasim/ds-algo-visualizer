const BASE_URL = "http://localhost:3001";

const apiServiceJWT = {};

apiServiceJWT.register = async (user) => {
  try {
    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "same-origin",
    };
    return await fetch(`${BASE_URL}/register`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /register`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.login = async (user) => {
  try {
    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "same-origin",
    };
    return await fetch(`${BASE_URL}/login`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /login`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.profile = async () => {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return await fetch(`${BASE_URL}/me`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        console.log(`${err} while fetching /me`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.logout = async () => {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return await fetch(`${BASE_URL}/logout`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /logout`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.getalldsalgo = async () => {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return await fetch(`${BASE_URL}/getalldsalgo`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /getalldsalgo`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.markcomplete = async (dsId) => {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return await fetch(`${BASE_URL}/markcomplete/${dsId}`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /markcomplete`);
      });
  } catch (error) {
    console.log(error);
  }
};

apiServiceJWT.markincomplete = async (dsId) => {
  try {
    const options = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return await fetch(`${BASE_URL}/markincomplete/${dsId}`, options)
      .then((res) => (res.status <= 400 ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((err) => {
        console.log(`${err.message} while fetching /markincomplete`);
      });
  } catch (error) {
    console.log(error);
  }
};

export default apiServiceJWT;
