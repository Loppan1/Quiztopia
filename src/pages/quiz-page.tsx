import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LeafletMap from '../components/LeafletMap/LeafletMap';
import { useAuth } from '../hooks/useAuth';

interface Quiz {
    quizId: string;
    username: string;
    questions: Question[];
}

interface Question {
    location: {
        latitude: number;
        longitude: number;
    };
    question: string;
    answer: string;
}

const QuizPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const quiz = location.state?.quiz as Quiz;
    const isAuthenticated = useAuth();
    const loggedInUser = localStorage.getItem('username')
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const isCreator = isAuthenticated && loggedInUser === quiz.username

    const handleQuestionClick = (question: Question) => {
        setShowAnswer(false);
        setSelectedAnswer(question.answer);
    };

    const handleShowAnswer = () => {
        setShowAnswer((prevShowAnswer) => !prevShowAnswer)
    }

    async function handleDelete() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        try {
            const quizResponse = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${quiz.quizId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (quizResponse.ok) {
                navigate("/quizzes");
            } else {
                console.error("Failed to delete quiz");
            }
        } catch (error) {
            console.error("Error deleting quiz", error);
        }
    }

    if (!quiz) return <div className='wrapper'><h3>No quiz available</h3></div>;

    return (
        <div className='wrapper'>
            <section className='quiz-page'>
                <div className='corner-placement'><Link to="/quizzes"><h3>Back</h3></Link></div>
                <h1 className='quiz-name'>{quiz.quizId}</h1>
                <h3>A quiz by {quiz.username}</h3>
                <LeafletMap 
                    questions={quiz.questions.map(q => ({
                        location: q.location,
                        question: q.question,
                        answer: q.answer
                    }))} 
                    onQuestionClick={handleQuestionClick}
                    zoomControl={true} 
                    dragging={true}
                    touchZoom={true}
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    boxZoom={true}
                    keyboard={true}
                />
                {selectedAnswer && (
                    <div className="answer-container" onClick={handleShowAnswer}>
                        {showAnswer ? (
                            <>
                                <h2>Answer:</h2>
                                <p>{selectedAnswer}</p>
                            </>
                        ) : (
                            <h2>Show answer</h2>
                        )}
                    </div>
                )}
            { isAuthenticated && isCreator ? 
            <div className='delete-container'>
            <button onClick={handleDelete} className='delete-button'>Delete quiz</button> 
            </div>
            : ""}
            </section>
        </div>
    );
};

export default QuizPage;