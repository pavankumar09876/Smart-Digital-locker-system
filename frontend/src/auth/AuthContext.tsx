import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../interfaces/types';
import { Role } from '../interfaces/types';
import api from '../api/axiosClient';

interface AuthContextType {
    user: User | null;
    role: Role | null;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/Auth/me');
            if (res.data) {
                // Ensure role is preserved if backend doesn't return it in /me
                // or update it if backend does. 
                // We trust the token for "source of truth" for ROLE usually, 
                // but let's merge.
                setUser(prev => ({ ...prev, ...res.data, role: prev?.role || res.data.role }));
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // Don't logout immediately on profile fetch fail? 
            // Or maybe do? If token is valid but /me fails 401, interceptor handles it.
        }
    };

    const decodeAndSetUser = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            // Backend token payload: { "sub": str(user.id), "role": user.role.value }
            const userRole = decoded.role as Role;
            const userId = decoded.sub;

            // Set initial state from token
            setUser({ id: userId, email: '', name: 'User', role: userRole });
            setRole(userRole);

            // Fetch full details
            fetchProfile();

        } catch (e) {
            console.error("Invalid token", e);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            decodeAndSetUser(token);
        }
        setIsLoading(false);
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        decodeAndSetUser(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            isLoading,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
