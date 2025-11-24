import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../utils/supabase-client';
import type { Session } from '@supabase/supabase-js';

interface AuthContextValue {
    session: Session | null;
    signInUser: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; data?: any; error?: string }>;
    signOutUser: () => Promise<{ success: boolean; error?: string }>;
    signUpNewUser: (
        email: string,
        password: string,
        firstName: string
    ) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        async function getInitialSession() {
            const { data, error } = await supabase.auth.getSession();
            if (!error) setSession(data.session);
            else console.error('Error getting session:', error.message);
        }

        getInitialSession();
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const signInUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password,
            });
            if (error) return { success: false, error: error.message };
            return { success: true, data };
        } catch {
            return {
                success: false,
                error: 'Unexpected error during sign-in.',
            };
        }
    };

    const signOutUser = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch {
            return {
                success: false,
                error: 'Unexpected error during sign-out.',
            };
        }
    };

    const signUpNewUser = async (
        email: string,
        password: string,
        firstName: string
    ) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.toLowerCase(),
                password,
                options: { data: { first_name: firstName ?? '' } },
            });
            if (error) return { success: false, error: error.message };
            return { success: true, data };
        } catch {
            return {
                success: false,
                error: 'Unexpected error during sign-up.',
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{ session, signInUser, signOutUser, signUpNewUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthContextProvider');
    return context;
};
