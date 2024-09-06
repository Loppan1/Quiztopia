import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setErrorMessage(null);

    try {
      const response = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="wrapper">
      <main className="login-page">
        <Link to="/"><h1>QUIZTOPIA</h1></Link>
        <input
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="vertical-alignment">
          <button onClick={handleSignup}>SIGN UP</button>
          <Link to={"/login"}>
            <h3>Login</h3>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Signup;