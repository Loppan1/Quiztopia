import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Home = () => {
    const isAuthenticated = useAuth();

    return (
        <div className="wrapper home-wrapper">
            <main className="home">
                <h1>QUIZTOPIA</h1>
                <Link to={"/quizzes"} ><button className="home-button play-button">PLAY</button></Link>
                {isAuthenticated ? (
                    <>
                        <Link to={"/create"} ><button className="home-button create-button">CREATE</button></Link>
                        <Link to={"/logout"}><button className="home-button logout-button">LOGOUT</button></Link>
                    </>
                ) : (
                    <>
                        <Link to={"/login"} ><button className="home-button login-button">LOGIN</button></Link>
                        <Link to={"/signup"} ><div className="home-signup"><h3>SIGN UP</h3></div></Link>
                    </>
                )}
            </main>
        </div>
    )
}

export default Home;