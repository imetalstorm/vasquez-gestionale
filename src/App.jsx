import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import HomePage from './pages/HomePage'
import ActivityPage from './pages/ActivityPage'
import AdminPage from './pages/AdminPage'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/activity/:id"
          element={<ActivityPage />}
        />
        
        <Route
  path="/admin"
  element={<AdminPage />}
/>
      </Routes>

    </BrowserRouter>

  )
}

export default App