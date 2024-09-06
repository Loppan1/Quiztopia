import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx'
import Login from './pages/login.tsx';
import Create from './pages/create.tsx';
import Quizzes from './pages/quizzes.tsx';
import Signup from './pages/signup.tsx';

import './index.css'
import QuizPage from './pages/quiz-page.tsx';
import Logout from './components/Logout/Logout.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/create',
    element: <Create />
  },
  {
    path: '/quizzes',
    element: <Quizzes />
  },
  {
    path: '/:quizId',
    element: <QuizPage />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
