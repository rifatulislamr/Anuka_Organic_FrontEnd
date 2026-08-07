'use client'

import React from 'react'
import { Home, User, ShoppingBag, ShoppingCart } from 'lucide-react'

type PageKey = 'profile' | 'orders' | 'carts'

type SidebarProps = {
  activePage: PageKey
  setActivePage: (page: PageKey) => void
  onHome: () => void
}

const menuItems: { key: PageKey; label: string; icon: React.ReactNode }[] = [
  { key: 'profile', label: 'Profile', icon: <User size={18} /> },
  { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { key: 'carts', label: 'Cart', icon: <ShoppingCart size={18} /> },
]

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onHome }) => {
  return (
    <aside className="w-64 h-full bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-950/40 shadow-md">
        <h2 className="text-lg font-semibold tracking-wide">User Dashboard</h2>
        <button
          onClick={onHome}
          className="flex items-center gap-1 bg-white text-slate-800 font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-all text-xs"
        >
          <Home size={12} />
          Home
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
              activePage === item.key
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Anuka Organic
        </p>
      </div>
    </aside>
  )
}

export default Sidebar











// 'use client'

// import React from 'react'
// import { Home, User, ShoppingBag, ShoppingCart } from 'lucide-react'

// type SidebarProps = {
//   activePage: 'profile' | 'orders' | 'carts'
//   setActivePage: React.Dispatch<React.SetStateAction<'profile' | 'orders' | 'carts'>>
//   onHome: () => void
// }

// const menuItems: { key: 'profile' | 'orders' | 'carts'; label: string; icon: React.ReactNode }[] = [
//   { key: 'profile', label: 'Profile', icon: <User size={18} /> },
//   { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
//   { key: 'carts', label: 'Cart', icon: <ShoppingCart size={18} /> },
// ]

// const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onHome }) => {
//   return (
//     <aside className="w-64 h-full bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-xl">
//       {/* Header Section */}
//       <div className="flex items-center justify-between px-5 py-4 bg-slate-950/40 shadow-md">
//         <h2 className="text-lg font-semibold tracking-wide">User Dashboard</h2>
//         <button
//           onClick={onHome}
//           className="flex items-center gap-1 bg-white text-slate-800 font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-all text-xs"
//         >
//           <Home size={12} />
//           Home
//         </button>
//       </div>

//       {/* Menu Items */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
//         {menuItems.map((item) => (
//           <button
//             key={item.key}
//             onClick={() => setActivePage(item.key)}
//             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
//               activePage === item.key
//                 ? 'bg-emerald-500 text-white shadow-md'
//                 : 'text-slate-300 hover:bg-white/10 hover:text-white'
//             }`}
//           >
//             <span>{item.icon}</span>
//             <span>{item.label}</span>
//           </button>
//         ))}
//       </nav>

//       {/* Footer Section */}
//       <div className="p-4 border-t border-white/10 text-center">
//         <p className="text-[11px] text-slate-400">
//           © {new Date().getFullYear()} Anuka Organic
//         </p>
//       </div>
//     </aside>
//   )
// }

// export default Sidebar
