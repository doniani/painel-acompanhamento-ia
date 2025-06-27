
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  cpf_cnpj?: string;
  theme: 'light' | 'dark';
  language: 'pt_BR' | 'en_US';
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Verificar se o usuário ainda está ativo no banco
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userData.id)
          .eq('ativo', true)
          .single();

        if (!error && data) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            avatar: data.avatar,
            cpf_cnpj: data.cpf_cnpj,
            theme: 'light',
            language: 'pt_BR',
            ativo: data.ativo
          });
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Buscar usuário por email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !userData) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar se o usuário está ativo
      if (!userData.ativo) {
        throw new Error('Usuário inativo. Entre em contato com o administrador.');
      }

      // Verificar senha
      if (!userData.password_hash) {
        throw new Error('Credenciais inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password_hash);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      const authenticatedUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        cpf_cnpj: userData.cpf_cnpj,
        theme: 'light',
        language: 'pt_BR',
        ativo: userData.ativo
      };

      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('Este email já está cadastrado');
      }

      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar novo usuário
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: email.toLowerCase(),
          name: name,
          password_hash: hashedPassword,
          ativo: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar usuário:', error);
        throw new Error('Erro ao criar conta. Tente novamente.');
      }

      const authenticatedUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        cpf_cnpj: newUser.cpf_cnpj,
        theme: 'light',
        language: 'pt_BR',
        ativo: newUser.ativo
      };

      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo, ${name}!`,
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // Verificar se o usuário existe
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, ativo')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !userData) {
        throw new Error('Usuário ou senha inválidos');
      }

      if (!userData.ativo) {
        throw new Error('Usuário ou senha inválidos');
      }

      // Gerar token de reset
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

      // Salvar token no banco
      const { error: updateError } = await supabase
        .from('users')
        .update({
          reset_token: resetToken,
          reset_token_expires: expiresAt.toISOString()
        })
        .eq('id', userData.id);

      if (updateError) {
        throw new Error('Erro ao processar solicitação');
      }

      // Simular envio de email (aqui você implementaria o envio real)
      console.log(`Token de reset para ${email}: ${resetToken}`);
      
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error('Erro ao solicitar reset de senha:', error);
      throw new Error(error.message || 'Erro ao processar solicitação');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Verificar se o token é válido e não expirou
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('reset_token', token)
        .gt('reset_token_expires', new Date().toISOString())
        .single();

      if (userError || !userData) {
        throw new Error('Token inválido ou expirado');
      }

      // Hash da nova senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha e limpar token
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: hashedPassword,
          reset_token: null,
          reset_token_expires: null
        })
        .eq('id', userData.id);

      if (updateError) {
        throw new Error('Erro ao redefinir senha');
      }

      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      throw new Error(error.message || 'Erro ao redefinir senha');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          avatar: data.avatar,
          cpf_cnpj: data.cpf_cnpj
        })
        .eq('id', user.id);

      if (error) {
        throw new Error('Erro ao atualizar perfil');
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      forgotPassword,
      resetPassword,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
