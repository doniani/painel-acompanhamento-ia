
-- Remover políticas existentes que exigem autenticação
DROP POLICY IF EXISTS "Enable all for authenticated users" ON atendimentos;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON conversas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON mensagens;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON atividades_recentes;

-- Criar políticas públicas temporárias (para desenvolvimento)
CREATE POLICY "Enable all for public" ON atendimentos FOR ALL TO public USING (true);
CREATE POLICY "Enable all for public" ON conversas FOR ALL TO public USING (true);
CREATE POLICY "Enable all for public" ON mensagens FOR ALL TO public USING (true);
CREATE POLICY "Enable all for public" ON atividades_recentes FOR ALL TO public USING (true);

-- Verificar se há dados na tabela atendimentos
-- (isso é só para verificação, não afeta as políticas)
SELECT COUNT(*) as total_atendimentos FROM atendimentos;
