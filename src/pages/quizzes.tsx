import React, { useState, useEffect } from "react";
import LeafletMap from "../components/LeafletMap/LeafletMap";
import L from "leaflet";
import { Link } from "react-router-dom";

interface Quiz {
    quizId: string;
    username?: string;
    questions: Question[]; 
    userId: string;
}

interface Question {
    location: {
        longitude: number;
        latitude: number;
    };
    question: string;
    answer: string;
}

const Quizzes: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [userPosition, setUserPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchQuizzes() {
            const response = await fetch (
                `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz`, {}
            );
            const data = await response.json();

            setQuizzes(data.quizzes);
        }

        fetchQuizzes();
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }, (error) => {
            console.error("Error getting user location:", error);
        });
    }, []);

    const filteredQuizzes = quizzes.filter(quiz => quiz.username);
    const sortedQuizzes = userPosition ? [...filteredQuizzes].sort((a, b) => {
        const userLatLng = L.latLng(userPosition.latitude, userPosition.longitude);
        const locationA = a.questions[0]?.location ? L.latLng(a.questions[0].location.latitude, a.questions[0].location.longitude) : L.latLng(0, 0);
        const locationB = b.questions[0]?.location ? L.latLng(b.questions[0].location.latitude, b.questions[0].location.longitude) : L.latLng(0, 0);

        const distanceA = userLatLng.distanceTo(locationA);
        const distanceB = userLatLng.distanceTo(locationB);

        return distanceA - distanceB;
        
    }) : quizzes;

    const quizzesPerPage = 12;
    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = sortedQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);


    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className="wrapper">
            <Link to="/"><h1>QUIZTOPIA</h1></Link>
            <main className="quizzes">
                {currentQuizzes
                    
                    .map((quiz) => (
                        <article key={`${quiz.username}-${quiz.quizId}`} className="quiz-card">
                            {quiz.questions.length && (
                                    <LeafletMap 
                                        questions={quiz.questions.map(q => ({
                                            location: q.location,
                                            question: q.question,
                                            answer: q.answer
                                    }))}
                                        zoomControl={false}
                                        dragging={false}
                                        touchZoom={false}
                                        scrollWheelZoom={false}
                                        doubleClickZoom={false}
                                        boxZoom={false}
                                        keyboard={false}
                                    />
                                )}
                            <div className="content">
                                <h4>{quiz.quizId}</h4>
                                <p>{quiz.questions.length} questions by {quiz.username}</p>
                                <Link to={`/${quiz.username}-${quiz.quizId}`} state={{ quiz }} ><button>PLAY</button></Link>
                            </div>
                        </article>
                ))}
            </main>
            <div className="pagination">
                {currentPage > 1 && (
                    <button className="previous-page" onClick={handlePreviousPage}>Previous Page</button>
                )}
                {indexOfLastQuiz < sortedQuizzes.length && (
                    <button className="next-page" onClick={handleNextPage}>Next Page</button>
                )}
            </div>
        </div>
    )
}

export default Quizzes;