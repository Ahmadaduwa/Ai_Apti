import { NavLink } from 'react-router-dom'

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-slate-200" role="banner">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-ink">School MIS</div>
        <nav className="hidden md:flex gap-1 text-sm" aria-label="Primary">
          <NavLink aria-label="Dashboard" to="/" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Dashboard</NavLink>
          <NavLink aria-label="Teacher" to="/teacher" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Teacher</NavLink>
          <NavLink aria-label="Admin" to="/admin" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Admin</NavLink>
          <NavLink aria-label="Parent" to="/parent" className={({isActive}) => `px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Parent</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <select aria-label="Theme" className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-sm" onChange={(e)=>{
            const root = document.documentElement
            root.classList.remove('theme-green','theme-gray')
            if (e.target.value === 'green') root.classList.add('theme-green')
            if (e.target.value === 'gray') root.classList.add('theme-gray')
          }}>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="gray">Gray</option>
          </select>
          <button className="md:hidden px-3 py-2 rounded-xl hover:bg-primary-light" aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  )
}


