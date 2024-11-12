import React, { useEffect, useReducer } from "react";
import Header from './Header'
import Mains from "./Mains";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progess from "./Progess";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30
const initialState ={
  questions: [],
  // 'loading', 'error','ready', 'active','finished'
  status: 'loading',
  index:0,
  answer: null,
  points:0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action){

  switch(action.type){
    case "dataReceived":
      return {
        ...state, questions: action.payload,status:"ready"
      }
    case "dataFailed":
      return{
        ...state, status: "error"
      }
    case "start":
      return{
        ...state, status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      }
    case "newAnswer":
      const question = state.questions.at(state.index);
      return{
        ...state, answer:action.payload,
        points: action.payload === question.correctOption ? state.points + question.points: state.points
      }


    case "nextQuestion":
      return{
        ...state, index: state.index + 1,answer:null
      }

    case "finish":
      return{
        ...state, status: "finished",
        highScore: state.points > state.highScore ? state.points : state.highScore
      }
    case "restart":
      return{
        ...state,initialState,status:"ready", 
      }
    case "tick":
      return{
        ...state,secondsRemaining: state.secondsRemaining -1,
        status: state.secondsRemaining === 0? "finished":state.status
      }
      default:
        throw new Error("Action unKnown Error")
     
  }


}

function App(){
  const [{questions,status,index,answer,points,highScore,secondsRemaining},dispatch] = useReducer(reducer,initialState)
  const numQuestions= questions.length;
  const maxPossiblePoints = questions.reduce((prev,curr)=>prev + curr.points,0)

  useEffect(function(){
    fetch(`http://localhost:8000/questions`)
    .then((res)=>res.json())
    .then((data)=>dispatch({type:"dataReceived",payload: data})).catch((err)=>dispatch({type:"dataFailed"}))
  },[])
  // 
  // console.log(numQuestions)
  return(
    <div className="app">

    <Header />
    <Mains>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && <StartScreen numQuestions={numQuestions} 
      dispatch={dispatch}/>}
      {status === "active" && 
      <>
      <Progess index={index} numQuestions={numQuestions}
      points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
      <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
      <Footer>
        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
      <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index}/>
      </Footer>
      </>
      }

      {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints}highScore={highScore} dispatch={dispatch}/>}
     
    </Mains>
    </div>
   
  )
}

export default App;