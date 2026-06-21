import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '../components/ui/LegacyButton';
import { Input } from '../components/ui/LegacyInput';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    if (user?.role === 'SHOP_OWNER') {
        navigate('/dashboard/shop/settings');
    } else {
        navigate('/dashboard/customer/profile');
    }
  };

  const isShopOwner = user?.role === 'SHOP_OWNER';
  const roleDisplay = isShopOwner ? 'Shop Owner' : 'Customer';

  return (
    <header className="h-16 bg-canvas border-b border-fog flex items-center justify-between px-6 transition-colors duration-300">
      {/* Left side - Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel" />
          <Input
            placeholder={isShopOwner ? "Search orders, products..." : "Search..."}
            className="pl-10 bg-cloud border-fog text-ink placeholder:text-steel focus:border-hp-primary"
          />
        </div>
      </div>

      {/* Right side - Notifications & User */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-steel hover:text-ink hover:bg-cloud">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-canvas border-fog shadow-lg">
            <DropdownMenuLabel className="text-ink">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-fog" />
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="text-ink hover:bg-cloud">
                <div className="flex items-start gap-3 p-2">
                  <div className="h-2 w-2 bg-hp-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Welcome to PrintSync!</p>
                    <p className="text-xs text-steel">Your dashboard is ready.</p>
                    <p className="text-xs text-graphite mt-1">Just now</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-cloud">
              <div className="h-8 w-8 bg-hp-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-steel hidden sm:block">{user?.email?.split('@')[0] || roleDisplay}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-canvas border-fog shadow-lg">
            <DropdownMenuLabel className="text-ink">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-fog" />
            <DropdownMenuItem 
              className="text-ink hover:bg-cloud cursor-pointer"
              onClick={handleProfile}
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-fog" />
            <DropdownMenuItem 
              className="text-error hover:bg-error/10 cursor-pointer"
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
