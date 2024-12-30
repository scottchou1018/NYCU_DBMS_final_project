import "./Login.css"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const url = "http://localhost:3000";
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    try{
      const res = await axios.post(`${url}/auth/login`, {
        username: username,
        password: password,
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
        }
      );
      if (res.status === 201) {
        navigate('/');
        window.location.reload();
      } else {
        setAlertMessage('Login failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        if (error.response.status === 400) {
          setAlertMessage('User not exist');
        }
        else if (error.response.status === 401) {
          setAlertMessage('Password incorrect');
        }
      }
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <h2 >{alertMessage}</h2>
    </div>
  );
}
export default Login;