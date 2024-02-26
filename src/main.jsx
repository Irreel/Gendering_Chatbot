import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'
import Login, { loginAction } from './pages/login.jsx'
import ProtectedRoutes from './context/ProtectedRoutes.jsx'
import Game from './pages/game.jsx'
import Post from './pages/post-test.jsx'
import End from './pages/end.jsx'

import './index.css'

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <Login />,
    action: loginAction,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      { path: '/game', element: <Game /> },
      { path: '/post-test', element: <Post /> },
      { path: '/end', element: <End /> },
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      {/* <Game /> */}
    </UserProvider>
  </React.StrictMode>,
)
