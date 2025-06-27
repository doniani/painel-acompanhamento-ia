
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

export const createTestUser = async () => {
  try {
    console.log('Criando usuário de teste...');
    
    // Dados do usuário de teste
    const testEmail = 'admin@teste.com';
    const testPassword = '123456';
    const testName = 'Administrador Teste';

    // Verificar se já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', testEmail)
      .single();

    console.log('Verificação de usuário existente:', { existingUser, checkError });

    if (existingUser) {
      console.log('Usuário de teste já existe:', testEmail);
      return;
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);

    // Criar usuário
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        name: testName,
        password_hash: hashedPassword,
        ativo: true
      })
      .select()
      .single();

    console.log('Resultado da criação do usuário de teste:', { data, error });

    if (error) {
      console.error('Erro ao criar usuário de teste:', error);
      return;
    }

    console.log('Usuário de teste criado com sucesso!');
    console.log('Email:', testEmail);
    console.log('Senha:', testPassword);
    console.log('ID:', data?.id);

  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  }
};
