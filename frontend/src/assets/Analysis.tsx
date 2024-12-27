import { useState, useEffect } from 'react';
import axios from 'axios';

const test_scoreboard = {
  "contestName": "ICPC Taichung",
  "problems": ["A", "B", "C", "D"],
  "rank":[
      {
          "teamId": 1,
          "teamName": "NYCU_CartesianTree",
          "ACcount": 4,
          "penalty": 100,
          "problemStatus":
          {
              "A":
              {
                  "status": "Accepted",
                  "penalty": 2,
                  "triesCount": 0
              },
              "B":
              {
                  "status": "Accepted",
                  "penalty": 10,
                  "triesCount": 0
              },
              "C":
              {
                  "status": "Accepted",
                  "penalty": 23,
                  "triesCount": 0
              },
              "D":
              {
                  "status": "Accepted",
                  "penalty": 65,
                  "triesCount": 0
              }
          }
      },
      {
          "teamId": 2,
          "teamName": "NYCU_MYGO",
          "ACcount": 1,
          "penalty": 5,
          "problemStatus":
          {
              "A":
              {
                  "status": "Accepted",
                  "penalty": 5,
                  "triesCount": 0
              },
              "B":
              {
                  "status": "Wrong_Answer",
                  "penalty": 0,
                  "triesCount": 2
              },
              "C":
              {
                  "status": "Runtime_Error",
                  "penalty": 0,
                  "triesCount": 1
              },
              "D":
              {
                  "status": "Not_tried",
                  "penalty": 0,
                  "triesCount": 0
              }
          }
      }
  ]
}

function analysisTeamResult(problems_index: string[], teamResult: any, rank: number){
  let problem_results = []
  for(let problem_idx of problems_index){
    problem_results.push(teamResult["problemStatus"][problem_idx])
  }
  return (
    <tr>
      <td>{rank}</td>
      <td>{teamResult.teamName}</td>
      {
        problem_results.map((result) => (
          <td className={result.status}> {result.status === "Accepted" ? 1 : 0} </td>
        ))
      }
      <td>{teamResult.penalty}</td>
      <td>{teamResult.ACcount}</td>
    </tr>
  )

}

function Scoreboard({groupId, contestId}){
  useEffect(() => {

  }, [groupId, contestId])
  return (
  <div className="scoreboard">
    <p>{groupId}:{contestId}</p>
    <h2>{test_scoreboard.contestName}</h2>
    <table>
      <caption>
        ScoreBoard
      </caption>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team Name</th>
          {
            test_scoreboard.problems.map((problem_index) => (
              <th className="scoreboard-row">{problem_index}</th>
            ))
          }
          <th>Penalty</th>
          <th>AC Count</th>
        </tr>
        {
          test_scoreboard.rank.map((teamResult, index) => {
            return analysisTeamResult(test_scoreboard.problems, teamResult, index + 1)
          })
        }
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
  )
}


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