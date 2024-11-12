import React from 'react'

export default function FinishScreen({points, maxPossiblePoints,highScore,dispatch}) {
  const percentage = (points/maxPossiblePoints)*100;
  // 
  let emoji ;
  if(percentage === 100) emoji ="💪";
  if(percentage >= 80) emoji ="🎉";
  if(percentage >= 60) emoji ="👍";
  if(percentage >= 50) emoji ="😊";
  if(percentage === 0) emoji ="🥹😭";
  
  return (
    <>
    <p className='result'>
      <span>{emoji}</span>  You Scored <strong>{points}</strong> out of {maxPossiblePoints}  ({Math.ceil(percentage)}%)
      
    </p>
    <p className='highscore'>(HighScore: {highScore} Points)</p>

    <button className="btn btn-ui" onClick={()=>dispatch({type: "restart"})}>
            Restart Quiz
        </button>
    </>
  )
}
