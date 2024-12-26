import { useState, useEffect } from 'react';
import axios from 'axios';



function Analysis() {
  const [userId, setUser] = useState<number | null>(null);

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
        setUser(response.data.userId);
      } catch (error) {
        console.error('There was an error fetching the user status!', error);
      }
    };

    fetchUserStatus();
  }, []);
    return (
      <div>
        <h1>Analysis Page</h1>
        <p>Welcome { userId ? userId : 'Guest' } to the Analysis page!</p>
      </div>
    );
}
export default Analysis;