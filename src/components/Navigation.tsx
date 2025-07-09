import { Link, useLocation } from 'react-router-dom'
import { Trophy, Plus, BarChart3, Users, Home } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/new-game', icon: Plus, label: 'New Game' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/players', icon: Users, label: 'Players' },
    { to: '/teams', icon: Users, label: 'Teams' }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Multi-Sport Scoreboard
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2",
                    location.pathname === item.to && "bg-blue-600 text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}