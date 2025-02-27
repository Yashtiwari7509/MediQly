import { Sidebar } from "./Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X, LogOut } from "lucide-react";
import { useEffect, useState, useMemo, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/utils/theme.provider";
import { useLogout } from "@/hooks/auth";
import { useAuth } from "@/auth/AuthProvider";
import exp from "constants";
import { Navigation } from "./Navigation";
import VoiceNavigation from '../VoiceNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentDoctor, currentUser, userType, isLoading } = useAuth();
  const logoutFun = useLogout();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]); // Ensure sidebar closes only on mobile when changing route

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logoutFun.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      },
    });
  };

  // Memoizing Sidebar to prevent unnecessary renders
  const memoizedSidebar = useMemo(() => <Sidebar />, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Overlay when Sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 h-full transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-4 top-4 z-50 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {memoizedSidebar}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-background">
          <div className="container flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {userType === "user"
                          ? currentUser?.firstName.charAt(0)
                          : currentDoctor?.firstName.charAt(0)}
                        {userType === "user"
                          ? currentUser?.lastName.charAt(0)
                          : currentDoctor?.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userType === "user"
                          ? currentUser?.firstName
                          : currentDoctor?.firstName}
                        {userType === "user"
                          ? currentUser?.lastName
                          : currentDoctor?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userType === "user"
                          ? currentUser?.email
                          : currentDoctor?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6 pb-20 md:pb-6">{children}</div>
      </main>
      <Navigation />
      <VoiceNavigation />
    </div>
  );
};

export default memo(MainLayout);
