import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../hooks/auth";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { profileProps } from "@/lib/user.type";
import { LoaderIcon } from "lucide-react";

interface AuthContextType {
  user: profileProps | null; // User can be null if not logged in
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<profileProps>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      console.log(getToken());

      if (!getToken()) return null; // No token means not logged in
      console.log("result");
      const { data } = await api.get("/users/profile");
      const result = queryClient.getQueryData(["currentUser"]) || data;
      navigate("/");

      return result as profileProps;
    },
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
  });

  // Redirect if user is NOT logged in & NOT loading
  useEffect(() => {
    console.log(isLoading, user);

    if (isLoading) {
      navigate("/login");
    }
  }, [user, isLoading]); // Only runs when user state changes
  if (isLoading)
    return (
      <div className="flex justify-center items-center w-screen h-[100vh]">
        <LoaderIcon className="animate-spin" />
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
