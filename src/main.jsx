import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom' // Added import statement for BrowserRouter
import { UserProvider } from './context/UserContext.jsx'
import { GameBehaviorProvider } from './context/GameBehaviorContext.jsx'
import Login, { loginAction } from './pages/login.jsx'
import ProtectedRoutes from './context/ProtectedRoutes.jsx'
import Game from './pages/game.jsx'
import Post, {postTestAction} from './pages/post-test.jsx'
import End from './pages/end.jsx'

import './index.css'

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <ProtectedRoutes />,
  //   children: [
      { 
        path: '/', 
        element: <Login />,
        action: loginAction,
      },
      { 
        path: '/game', 
        element: <Game />,
      },
      { 
        path: '/post-test', 
        element: <Post />,
        action: postTestAction, 
      },
      { path: '/end', element: <End /> },
  //   ],
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <GameBehaviorProvider>
        <RouterProvider router={router} />
      </GameBehaviorProvider>
    </UserProvider>
  </React.StrictMode>,
);
