import React from "react"

function Trivia(props) {
    
    const answers = props.answer.map(answer => {
        let color = ""
        if(props.endGame){            
            if(answer.answer === props.correctAnswer) {
                color = "#94D7A2"
            } else if(answer.isSelected && answer.isWrongChoice){
                color = "#F8BCBC"
            } else {
                color = "white"
            }    
        } else {           
            if(answer.isSelected) {
                color = "#D6DBF5"
            } else {
                color = "white"
            }
        }
      
      const styles = {
        backgroundColor: color 
        }  
        
      return (
          <div 
            key={answer.id}
            className="answer-component"
            style={styles}
            onClick={() => props.handleAnswer(answer.id, props.questionId)}
          >
            <h5 className="answer-text">{answer.answer}</h5>
          </div>
      )
  })
    
    return (
        <div className="trivia-container">
            <h3 className="question-text">{props.question}</h3>
            <section className="answers-container">
                {answers}
            </section>
            <hr className="hr"/>
        </div>
    )
}

export default Trivia