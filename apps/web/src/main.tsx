import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Student from '@/pages/Student'
import Parent from '@/pages/Parent'
import Teacher from '@/pages/Teacher'
import Admin from '@/pages/Admin'
import MainLayout from '@/components/MainLayout'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/student/:id" element={<Student />} />
          <Route path="/parent" element={<Parent />} />
        </Route>
        {/* You could add other routes outside the main layout here, e.g., <Route path="/login" ... /> */}
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)