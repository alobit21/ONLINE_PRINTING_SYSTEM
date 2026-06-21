import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '../ui/LegacyButton';
import { Input } from '../ui/LegacyInput';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { AdminSidebar } from './sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function AdminNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/admin/profile');
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };
  return (
    <header className="h-16 bg-canvas border-b border-fog flex items-center justify-between px-6 transition-colors duration-300">
      {/* Left side - Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5 text-gray-300" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-canvas border-fog">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation menu for admin panel
            </SheetDescription>
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users, shops, orders..."
            className="pl-10 bg-cloud border-fog text-ink placeholder:text-steel focus:border-hp-primary"
          />
        </div>
      </div>

      {/* Right side - Notifications & User */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-canvas border-fog shadow-lg">
            <DropdownMenuLabel className="text-ink">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-fog" />
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <div className="flex items-start gap-3 p-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New shop registration</p>
                    <p className="text-xs text-gray-400">Print Shop Dar pending verification</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <div className="flex items-start gap-3 p-2">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">High order volume</p>
                    <p className="text-xs text-gray-400">50+ orders in last hour</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <div className="flex items-start gap-3 p-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System update completed</p>
                    <p className="text-xs text-gray-400">Version 2.1.0 deployed</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{user?.email?.split('@')[0] || 'Admin'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-canvas border-fog shadow-lg">
            <DropdownMenuLabel className="text-ink">Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-fog" />
            <DropdownMenuItem 
              className="text-ink hover:bg-cloud cursor-pointer"
              onClick={handleProfile}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-ink hover:bg-cloud cursor-pointer"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-fog" />
            <DropdownMenuItem 
              className="text-error hover:bg-cloud hover:text-error cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
