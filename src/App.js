import { useState } from "react";
import "./App.css";
import survey from "./survey";
import { Button, Modal } from "react-bootstrap";

function App() {
  const [start, setStart] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [userAnswer, setUserAnswer] = useState([]);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const isAttended = localStorage.getItem("surveyData");

  if (isAttended) {
    setTimeout(() => {
      localStorage.removeItem("surveyData");
    }, 5000);
    setShow(false);
  }

  const handleSumbit = (event) => {
    console.log(userAnswer);
    localStorage.setItem("surveyData", JSON.stringify(userAnswer));
  };

  const submitAnswer = (question, answer, type) => {
    let answerArr = userAnswer;
    answerArr[question] = {
      type,
      answer: type === "radio" ? answer + 1 : answer,
    };
    setUserAnswer(answerArr);
  };

  return (
    <>
      {!isAttended ? (
        <div className="container mt-5">
          <div className="container-sm">
            {!start && !isAttended ? (
              <div>
                <p>
                  Welcome! <br />
                  Please Click start to continue.{" "}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setStart(true);
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                >
                  start
                </button>
              </div>
            ) : null}
            {start ? (
              <div>
                {survey.map((question, q_index) => (
                  <div
                    className={
                      currentQuestion === q_index
                        ? "row question-row"
                        : "d-none"
                    }
                    key={q_index}
                  >
                    <div className="col-12">
                      <p className="question">
                        Q{question.id}: {question.question_text}
                      </p>

                      {question.options ? (
                        question.options.map((option, o_index) => (
                          <div className="form-check mt-3" key={o_index}>
                            <input
                              className="form-check-input"
                              type="radio"
                              value={option}
                              name={("question no:", q_index)}
                              onChange={() =>
                                submitAnswer(q_index, o_index, "radio")
                              }
                            />
                            <label className="form-check-label">
                              {option.text}
                            </label>
                          </div>
                        ))
                      ) : (
                        <div>
                          <input
                            type="text"
                            name={("question no:", q_index)}
                            // value={q-}
                            onChange={(e) =>
                              submitAnswer(q_index, e.target.value, "text")
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {currentQuestion > 0 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    previous
                  </button>
                ) : null}

                {currentQuestion >= 0 && currentQuestion < survey.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setCurrentQuestion(currentQuestion + 1);
                    }}
                  >
                    Next
                  </button>
                ) : null}

                {currentQuestion >= survey.length - 1 ? (
                  <button className="btn btn-danger" onClick={handleShow}>
                    Finish
                  </button>
                ) : null}

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>Confirm your submission</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <button
                      className="btn btn-danger"
                      onClick={(event) => handleSumbit(event)}
                    >
                      Submit
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p>Thank you for submitting your survey</p>
      )}
    </>
  );
}

export default App;
