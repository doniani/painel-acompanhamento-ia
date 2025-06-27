
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

export const createTestUser = async () => {
  try {
    console.log('Criando usuário de teste...');
    
    // Dados do usuário de teste
    const testEmail = 'admin@teste.com';
    const testPassword = '123456';
    const testName = 'Administrador Teste';

    // Verificar se já existe usando RPC
    const { data: existingUser, error: checkError } = await supabase.rpc('get_user_by_email', { 
      user_email: testEmail 
    });

    console.log('Verificação de usuário existente:', { existingUser, checkError });

    if (existingUser && existingUser.length > 0) {
      console.log('Usuário de teste já existe:', testEmail);
      return;
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

    // Criar usuário usando RPC
    const { data, error } = await supabase.rpc('create_user', {
      user_email: testEmail,
      user_name: testName,
      user_password_hash: hashedPassword
    });

    console.log('Resultado da criação do usuário de teste:', { data, error });

    if (error) {
      console.error('Erro ao criar usuário de teste:', error);
      return;
    }

    console.log('Usuário de teste criado com sucesso!');
    console.log('Email:', testEmail);
    console.log('Senha:', testPassword);
    console.log('ID:', data[0]?.id);

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  }
};
