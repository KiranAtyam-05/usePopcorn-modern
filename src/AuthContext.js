import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext();

const USERS_KEY = "registeredUsers";

function getRegisteredUsers() {
  const savedUsers = localStorage.getItem(USERS_KEY);
  return savedUsers ? JSON.parse(savedUsers) : [];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("user"))
  );

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = useCallback((email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    if (!normalizedEmail.includes("@")) {
      throw new Error("Invalid email format");
    }

    const registeredUsers = getRegisteredUsers();
    const matchedUser = registeredUsers.find(
      (user) => user.email === normalizedEmail
    );

    if (!matchedUser) {
      throw new Error("No account found. Please register first.");
    }
    if (matchedUser.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    const userData = {
      email: matchedUser.email,
      name: matchedUser.name,
      loginTime: new Date(),
    };
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const register = useCallback((email, password, confirmPassword, name) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!normalizedEmail || !password || !confirmPassword || !trimmedName) {
      throw new Error("All fields are required");
    }
    if (!normalizedEmail.includes("@")) {
      throw new Error("Invalid email format");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const registeredUsers = getRegisteredUsers();
    const userExists = registeredUsers.some(
      (user) => user.email === normalizedEmail
    );

    if (userExists) {
      throw new Error("This email is already registered. Please login.");
    }

    const nextUsers = [
      ...registeredUsers,
      {
        email: normalizedEmail,
        password,
        name: trimmedName,
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

    return {
      email: normalizedEmail,
      name: trimmedName,
      message: "Registration successful. Please login with your credentials.",
    };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
