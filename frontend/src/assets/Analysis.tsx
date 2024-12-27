import { useState, useEffect } from 'react';
import axios from 'axios';
import Scoreboard from './Scoreboard';





function Analysis() {
  const [userId, setUser] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [contestId, setContestId] = useState<number | null>(null);
  const [groupList, setGroupList] = useState<any[] | null>(null);
  const [contestList, setContestList] = useState<number[] | null>(null);
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

  useEffect(() => {

    if(userId === null)
      return;
    const fetchGroupList = async () => {
      try{
        const response = await axios.get('http://localhost:3000/group',{
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        })
        setGroupList(response.data);
        console.log(response);
      } catch (error) {
        console.error("There was an error fetching groups data!", error);
      }
    }
    fetchGroupList()
  }, [userId])

  useEffect(() => {

    if(groupId === null)
      return;
    const fetchContestList = async () => {
      try{
        const response = await axios.get('http://localhost:3000/group/contest/' + groupId,{
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        })
        setContestList(response.data['contests']);
        console.log(response);
      } catch (error) {
        console.error("There was an error fetching contests data!", error);
      }
    }
    fetchContestList()
  }, [groupId])
  

  return (
    <div>
      <h1>Analysis Page</h1>
      <p>Welcome { userId ? userId : 'Guest' } to the Analysis page!</p>
      { groupList && 
      <select className="select" onChange={(e) => {setGroupId(Number(e.target.value))}}>
        {
          groupList.map((group) => (
            <option value={group.groupId}>{group.groupName}</option>
          ))
        }
      </select>
      }

      { contestList && 
      <select className="select" onChange={(e) => {setContestId(Number(e.target.value))}}>
        {
          contestList.map((contest) => (
            <option value={contest.contestId}>{contest.contestName}</option>
          ))
        }
      </select>
      }

      {
        groupId && contestId &&
        <Scoreboard
          groupId={groupId}
          contestId={contestId}
        />
      }
    </div>
  );
}

export default Analysis;