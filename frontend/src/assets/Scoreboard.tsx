import axios from "axios";
import { useEffect, useState } from "react";
import './Scoreboard.css';

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
            <td className={result.status === "OK" ? "accepted" : 
            (result.status === "UNATTEMPTED" ? "unattempted" : "wrong-answer")}>
                <p>{result.penalty}</p>
                <p>+{result.triesCount}</p>
            </td>
          ))
        }
        <td>{teamResult.penalty}</td>
        <td>{teamResult.ACcount}</td>
      </tr>
    )
  
  }
  

function Scoreboard({groupId, contestId}){
    const [scoreboard, setScoreboard] = useState<any | null>(null);
    useEffect(() => {
        if(groupId === null || contestId === null)
        return;
        const fetchScoreboard = async () => {
            try{
                const response = await axios.get('http://localhost:3000/scoreboard/?groupId=' + groupId + '&contestId=' + contestId,{
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                const problems = response.data.problems;
                response.data.problems = [];
                for(let problem of problems){
                    response.data.problems.push(problem)
                }
                setScoreboard(response.data);
                console.log(response);
            } catch (error) {
                console.error("There was an error fetching scoreboard data!", error);
            }
        }
        fetchScoreboard()

    }, [groupId, contestId])
    return (
    <div>
        {
        scoreboard === null ? <p>Loading...</p> :
        <div className="scoreboard">
                <h2>{scoreboard.contestName}</h2>
                <table>
                <caption>
                    ScoreBoard
                </caption>
                <thead>
                    <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    {
                        scoreboard.problems.map((problem_index) => (
                        <th className="scoreboard-row">{problem_index}</th>
                        ))
                    }
                    <th>Penalty</th>
                    <th>AC Count</th>
                    </tr>
                    {
                    scoreboard.ranks.map((teamResult, index: number) => {
                        return analysisTeamResult(scoreboard.problems, teamResult, index + 1)
                    })
                    }
                </thead>
                <tbody>

                </tbody>
                </table>
        </div>
        }
    </div>
    )
}
export default Scoreboard;
  