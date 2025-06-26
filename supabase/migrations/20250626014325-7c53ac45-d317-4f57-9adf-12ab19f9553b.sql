
-- Drop existing policies first
DROP POLICY IF EXISTS "Enable all for authenticated users" ON conversas;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON mensagens;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON atendimentos;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON atividades_recentes;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON users;

-- Ajustar foreign key na tabela atendimentos para referenciar conversas
ALTER TABLE atendimentos DROP CONSTRAINT IF EXISTS atendimentos_conversa_id_fkey;
ALTER TABLE atendimentos ADD CONSTRAINT atendimentos_conversa_id_fkey 
    FOREIGN KEY (conversa_id) REFERENCES conversas(id) ON DELETE SET NULL;

-- Adicionar dados de exemplo nas mensagens para as conversas existentes
INSERT INTO mensagens (conversa_id, texto, is_ai, timestamp) 
SELECT 
    c.id,
    CASE 
        WHEN c.cliente_nome = 'João Silva' THEN 'Olá! Gostaria de saber mais sobre seus produtos.'
        WHEN c.cliente_nome = 'Maria Santos' THEN 'Gostaria de saber mais sobre os preços...'
        WHEN c.cliente_nome = 'Pedro Costa' THEN 'Não ficou claro, podem explicar melhor?'
        WHEN c.cliente_nome = 'Ana Oliveira' THEN 'Perfeito! Vou finalizar a compra então.'
    END,
    false,
    NOW() - INTERVAL '30 minutes'
FROM conversas c
WHERE NOT EXISTS (SELECT 1 FROM mensagens m WHERE m.conversa_id = c.id);

-- Adicionar respostas da IA
INSERT INTO mensagens (conversa_id, texto, is_ai, timestamp)
SELECT 
    c.id,
    'Olá! Claro, temos uma linha completa de produtos para atender suas necessidades. Como posso ajudá-lo?',
    true,
    NOW() - INTERVAL '25 minutes'
FROM conversas c
WHERE c.cliente_nome IN ('João Silva', 'Maria Santos', 'Ana Oliveira');

-- Atualizar tabela atendimentos para sincronizar com conversas
UPDATE atendimentos SET conversa_id = (
    SELECT c.id FROM conversas c 
    WHERE c.cliente_nome = atendimentos.nome 
    AND c.cliente_telefone = atendimentos.telefone
    LIMIT 1
);

-- Atualizar contagem de mensagens nos atendimentos
UPDATE atendimentos SET mensagens_count = (
    SELECT COUNT(*) FROM mensagens m 
    WHERE m.conversa_id = atendimentos.conversa_id
) WHERE conversa_id IS NOT NULL;

-- Adicionar atividades recentes baseadas nas conversas
INSERT INTO atividades_recentes (tipo, titulo, descricao, status, avatar)
SELECT 
    CASE 
        WHEN status = 'aprovada' THEN 'approval'
        WHEN status = 'reprovada' THEN 'rejection'
        ELSE 'message'
    END,
    'Conversa com ' || cliente_nome,
    CASE 
        WHEN status = 'aprovada' THEN 'Conversa aprovada com sucesso'
        WHEN status = 'reprovada' THEN 'Conversa foi reprovada'
        ELSE 'Nova mensagem recebida'
    END,
    CASE 
        WHEN status = 'aprovada' THEN 'approved'
        WHEN status = 'reprovada' THEN 'rejected'
        ELSE 'pending'
    END,
    SUBSTRING(cliente_nome FROM 1 FOR 1) || SUBSTRING(SPLIT_PART(cliente_nome, ' ', 2) FROM 1 FOR 1)
FROM conversas
WHERE NOT EXISTS (
    SELECT 1 FROM atividades_recentes ar 
    WHERE ar.titulo = 'Conversa com ' || conversas.cliente_nome
);

-- Criar políticas básicas para todas as tabelas (permissivas para desenvolvimento)
CREATE POLICY "Enable all for authenticated users" ON conversas FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON mensagens FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON atendimentos FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON atividades_recentes FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated users" ON users FOR ALL TO authenticated USING (true);
