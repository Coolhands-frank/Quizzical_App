import React from "react"
import Trivia from "./Trivia"
import {nanoid} from "nanoid"
import he from "he"
import "./index.css"

function App() {
    const [quizEntities, setQuizEntities] = React.useState([])
    const [endGame, setEndGame] = React.useState(false)
    const [startQuiz, setStartQuiz] = React.useState(false)
    
    // pull questions from API and format to needed object array
    function getTriviaQuestions() {
        if(startQuiz) {
        fetch("https://opentdb.com/api.php?amount=5&difficulty=easy")
            .then(res => res.json())
            .then(data => {
                setQuizEntities(data.results.map(entity => {
                    let answers = entity.incorrect_answers.map(incAnswer => he.decode(incAnswer))
                    const randomIndex = Math.floor(Math.random()*4)
                    answers = 
                    [...answers.slice(0, randomIndex), 
                     he.decode(entity.correct_answer),
                    ...answers.slice(randomIndex, 3)]
                    
                    answers = answers.map(answer => {
                        return {
                            id: nanoid(),
                            answer: answer,
                            isSelected: false,
                            isCorrect: false,
                            isWrongChoice: false
                        }
                    })
                    return {
                        id: nanoid(),
                        question: he.decode(entity.question),
                        all_answers: answers,
                        correct_answer: he.decode(entity.correct_answer)
                    }
                }))
            })
        }
    }
    
    React.useEffect(() => {
        getTriviaQuestions()
    }, [startQuiz])
    
    function beginQuiz(){
        setStartQuiz(true)
        setEndGame(false)
    }
    
    //This function maps through the all_answers array of each question inside the quizEntity state and flips each answer's IsSelected value based on it's id 
    function selectAnswer(id, questionId){ 
        if(!endGame) {
            setQuizEntities(prevEntity => prevEntity.map(entity => { 
                if (entity.id === questionId){
                    const updateIsSelected = entity.all_answers.map(answer => {
                        if (answer.id === id) {
                            return {
                                ...answer, 
                                isSelected: !answer.isSelected
                                }
                        } else if(answer.isSelected) {
                            return {
                                ...answer, 
                                isSelected: false
                                }
                        } else {
                            return answer
                        }
                    })
                return {
                    ...entity, 
                    all_answers: updateIsSelected 
                    }
                } else {
                    return entity
                }         
            }))
        }
    }
   //this function, checks if the chosen answer is correct or not
   function checkAnswers() {
       if (!endGame) {
            // Create a new array of updated entities
            const updatedEntities = quizEntities.map(entity => {
                const updatedAnswers = entity.all_answers.map(answer => {
                    if (answer.isSelected) {
                        if (answer.answer === entity.correct_answer) {
                            return { ...answer, isCorrect: true, isWrongChoice: false }
                        } else {
                            return { ...answer, isCorrect: false, isWrongChoice: true }
                        }
                        } else {
                            return answer
                        }
                })

                return {
                    ...entity,
                    all_answers: updatedAnswers
                }
        })
        // Update the state with the new array of entities
        setQuizEntities(updatedEntities)
        } else {
        // Update startQuiz 
            setStartQuiz(false)
        }
        setEndGame(true)
    }
   
   // populate each all_answers array only when answer.isCorrect equals true
   const getRightAnswer = quizEntities.map(entity => {
        return entity.all_answers.filter(answer => answer.isCorrect === true)
   })
   
   // filter out populated Array
   const filterRightAnswer = getRightAnswer.filter((arr) => arr.length === 1)
   
    const triviaQuestions = quizEntities.map(entity => {
        return (
            <Trivia
                key={entity.id}
                question={entity.question}
                questionId = {entity.id}
                answer={entity.all_answers}
                handleAnswer={selectAnswer}
                correctAnswer={entity.correct_answer}
                endGame={endGame}
            />
        )
    })

    return (
        startQuiz ?
        <main>
            <div>
                {triviaQuestions}
            </div>
            <div className="result-newgame">
                {endGame && <p>You scored {filterRightAnswer.length}/5 correct answers</p>}
                <button 
                    className="button-answercheck" 
                    onClick={checkAnswers}
                >
                    {endGame ? "New Game" : "Check Answers"}
                </button> 
            </div>
        </main>
        :
        <div className="start-page-div">
            <h2 className="start-page-title">Quizzical</h2>
            <h5 className="start-page-subtitle">Test your general knowledge</h5>
            <button 
                className="button-startquiz"
                onClick={beginQuiz}
            >
                Start Quiz
            </button>
        </div>   
    )
}

export default App