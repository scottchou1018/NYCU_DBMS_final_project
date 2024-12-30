import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
    const [userId, setUserId] = useState<null | number>(null)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
            const response = await axios.get('http://localhost:3000/auth/status',{
                headers: {
                'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            console.log(response)
            setUserId(response.data.userId);
            } catch (error) {
            console.error('There was an error fetching the user status!', error);
            }
        };

        fetchUserStatus();
        }, [userId]);

    function logoutHandler(){
        const logout = async () => {
            try {
                const response = await axios.delete('http://localhost:3000/auth/logout',{
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                console.log(response)
                setUserId(null)
                navigate("/")
            } catch (error) {
            console.error('There was an error while logout!', error);
            }
        };
        logout()
    }
    
    return (
        <nav className="navbar">
            <h2 className="navbrand">Codeforces Team Helper</h2>
            <div className="nav">
                { userId && <Link className="navitem" to="/analysis">Analysis</Link> }
                { userId && <Link className="navitem" to="/manage">Manage</Link> }
                { !userId && <Link className="navuser" to="/login">login</Link>}
                { !userId && <Link className="navuser" to="/register">register</Link>}
                {userId && <button className="navuser" onClick={logoutHandler}>logout</button>}
            </div>
        </nav>
    );
}
 
export default Navbar;