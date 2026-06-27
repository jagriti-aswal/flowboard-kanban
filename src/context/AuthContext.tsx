import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (
    token: string,
    user: User
  ) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] = useState<User | null>(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser || storedUser === "undefined") {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
});

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const loginUser = (token: string, user: User) => {
  if (!token || !user) return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  setToken(token);
  setUser(user);
};

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);