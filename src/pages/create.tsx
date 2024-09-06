import React, { useState } from 'react';
import LeafletMap from '../components/LeafletMap/LeafletMap';
import { Link, useNavigate } from 'react-router-dom';

interface Location {
  latitude: number;
  longitude: number;
}

interface Question {
  location: Location;
  question: string;
  answer: string;
}

const Create: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [quizName, setQuizName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMapClick = (location: Location) => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { location, question: newQuestion, answer: newAnswer }]);
      setNewQuestion(''); 
      setNewAnswer(''); 
    } else {
      alert('Please enter a question.');
    }
  };

  const handleSave = async () => {
    setErrorMessage(null); 

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('User token is missing. Please log in.');
      return;
    }

    if (!quizName.trim()) {
      alert('Please enter a quiz name.');
      return;
    }

    try {
      const quizResponse = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: quizName }),
      });

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json();
        console.error('Error response from quiz creation:', errorData);
        setErrorMessage(`Error creating quiz: ${errorData.message}`);
        return;
      }

      for (const q of questions) {
        const questionResponse = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: quizName,
            question: q.question,
            answer: q.answer,
            location: {
              longitude: q.location.longitude.toString(),
              latitude: q.location.latitude.toString(),
            },
          }),
        });

        if (!questionResponse.ok) {
          const errorData = await questionResponse.json();
          setErrorMessage(`Error adding question: ${errorData.message}`);
          return;
        }
      }

      alert('Quiz and questions saved successfully!');
      setQuizName('');
      setQuestions([]);
      navigate('/')
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="wrapper">
      <Link to="/"><h1>QUIZTOPIA</h1></Link>
      <main className='create-page'>
        <h2>QUIZ NAME</h2>
        <input 
          id="quiz-name"
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder='Enter quiz name'
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <h2>QUESTION</h2>
        <input
          id="question"
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter question here"
        />
        <input
          id="answer"
          type="text"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Enter answer here"
        />
        <LeafletMap
          questions={questions}
          onMapClick={handleMapClick}
        />
        <button onClick={handleSave}>SAVE QUIZ</button>
      </main>
    </div>
  );
};

export default Create;