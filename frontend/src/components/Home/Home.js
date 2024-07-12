// Home.js
import React, { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";

const Home = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="container mt-5 text-light">
      {isLogin ? (
        <>
          <Login />
          <p className="mt-3">
            Don't have an account?{" "}
            <button
              className="btn btn-link bg-info text-light"
              onClick={toggleForm}
            >
              Register here
            </button>
          </p>
        </>
      ) : (
        <>
          <Register />
          <p className="mt-3">
            Already have an account?{" "}
            <button className="btn btn-link bg-info" onClick={toggleForm}>
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
