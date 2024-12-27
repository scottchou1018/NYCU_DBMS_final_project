
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

function Analysis() {
  let problems_index: string[] = test_scoreboard.problems
  return (
    <div>
      <h1>Analysis Page</h1>
      <p>Welcome to the Analysis page!</p>
      <h2>{test_scoreboard.contestName}</h2>
      <div className="scoreboard">
        <table>
          <caption>
            ScoreBoard
          </caption>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team Name</th>
              {
                problems_index.map((problem_index) => (
                  <th className="scoreboard-row">{problem_index}</th>
                ))
              }
              <th>Penalty</th>
              <th>AC Count</th>
            </tr>
            {
              test_scoreboard.rank.map((teamResult, index) => {
                return analysisTeamResult(problems_index, teamResult, index + 1)
              })
            }
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Analysis;