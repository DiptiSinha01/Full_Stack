import './App.css'
import { lazy, Suspense } from 'react'

// Lazy import
const Dashboard = lazy(() => import('./Component/dashboard.jsx'))

function App() {
  return (
    <Suspense
  fallback={
    <div className="loading-screen">
      <h2>Loading...</h2>
    </div>
  }
>
      <Dashboard />
    </Suspense>
  )
}

export default App
