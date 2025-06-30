
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  cpf_cnpj?: string;
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('Usuário encontrado no localStorage:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Tentando fazer login com:', email);

      // Buscar usuário por email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Resultado da busca do usuário:', { userData, userError });

      if (userError) {
        console.error('Erro na consulta:', userError);
        throw new Error('Erro ao buscar usuário');
      }

      if (!userData) {
        throw new Error('Credenciais inválidas');
      }

      if (!userData.ativo) {
        throw new Error('Usuário inativo');
      }

      if (!userData.password_hash) {
        throw new Error('Senha não configurada');
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, userData.password_hash);
      if (!passwordMatch) {
        throw new Error('Credenciais inválidas');
      }

      // Criar objeto do usuário
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        cpf_cnpj: userData.cpf_cnpj,
        ativo: userData.ativo
      };

      console.log('Login realizado com sucesso:', user.name);
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('Tentando registrar usuário:', email);

      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Usuário já existe');
      }

      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar usuário
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          password_hash: hashedPassword,
          ativo: true
        })
        .select('*')
        .single();

      if (createError) {
        console.error('Erro ao criar usuário:', createError);
        throw new Error('Erro ao criar usuário');
      }

      // Criar objeto do usuário
      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        cpf_cnpj: newUser.cpf_cnpj,
        ativo: newUser.ativo
      };

      console.log('Usuário registrado com sucesso:', user.name);
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    try {
      setLoading(true);
      console.log('Atualizando perfil do usuário:', userData);

      // Atualizar dados no Supabase
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          cpf_cnpj: userData.cpf_cnpj,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw new Error('Erro ao atualizar perfil');
      }

      // Atualizar estado local
      const updatedUserData: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        cpf_cnpj: updatedUser.cpf_cnpj,
        ativo: updatedUser.ativo
      };

      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      console.log('Perfil atualizado com sucesso');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('Logout realizado');
  };

  const forgotPassword = async (email: string) => {
    try {
      console.log('Solicitando reset de senha para:', email);
      
      // Verificar se usuário existe
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (!userData) {
        // Por segurança, não revelar se o email existe ou não
        console.log('Email não encontrado, mas não revelando isso ao usuário');
      }

      // Simular envio de email (aqui você implementaria o envio real)
      console.log('Email de recuperação enviado (simulado)');
    } catch (error: any) {
      console.error('Erro ao solicitar reset de senha:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      console.log('Tentando redefinir senha com token');
      
      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Aqui você implementaria a lógica de verificação do token
      // Por enquanto, vamos simular sucesso
      console.log('Senha redefinida com sucesso (simulado)');
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
