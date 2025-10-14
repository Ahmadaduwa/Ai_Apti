import { NavLink } from 'react-router-dom'

export default function SideNav() {
  return (
    <aside className="hidden lg:block w-60 sticky top-20 self-start" aria-label="Sidebar">
      <nav className="space-y-1 text-sm">
        <NavLink to="/" className={({isActive})=>`block px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Dashboard</NavLink>
        <NavLink to="/teacher" className={({isActive})=>`block px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Teacher</NavLink>
        <NavLink to="/admin" className={({isActive})=>`block px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Admin</NavLink>
        <NavLink to="/parent" className={({isActive})=>`block px-3 py-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-primary-light text-ink'}`}>Parent</NavLink>
      </nav>
    </aside>
  )
}


