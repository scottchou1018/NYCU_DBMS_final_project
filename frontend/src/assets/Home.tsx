import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
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
        navigate('/analysis');
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

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Username:', registerUsername);
    console.log('Password:', registerPassword);
    try{
      const res = await axios.post(`${url}/user`, {
        username: registerUsername,
        password: registerPassword,
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
        }
      );
      if (res.status === 201) {
        setAlertMessage('Register successful');
      } else {
        setAlertMessage('Register failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response){
        if (error.response.status === 409) {
          setAlertMessage('User already exist');
        }
        else {
          setAlertMessage('Register failed');
        }
      }
    }
  }

  return (
    <div>
      <h1>Home Page</h1>
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
      <hr />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      {!(alertMessage === '') && <hr />}
      <h2 >{alertMessage}</h2>
    </div>
  );
}

export default Home;