
## Instruções de Uso

### 1. Acessar o Sistema

Abra o arquivo `login.html` no seu navegador.

### 2. Fazer Login

Utilize as credenciais cadastradas no arquivo `dados/usuarios.json`. Exemplo:

- **Administrador:**
  - **Usuário:** `admin`
  - **Senha:** `admin123`

- **Usuário Comum:**
  - **Usuário:** `João Silva`
  - **Senha:** `senha123`

### 3. Registrar Empréstimo

1. Após o login, clique em **"Registrar Empréstimo"**.
2. Selecione a ferramenta disponível.
3. Clique em **"Registrar Empréstimo"**.
4. **Atenção:** Após registrar, faça o upload dos arquivos JSON atualizados (`lancamentos.json` e `ferramentas.json`) para a pasta `dados/` no repositório GitHub.

### 4. Registrar Devolução

1. Na página principal, clique em **"Registrar Devolução"** (se a página `devolucao.html` estiver implementada).
2. Selecione o lançamento correspondente.
3. Clique em **"Registrar Devolução"**.
4. **Atenção:** Faça o upload dos arquivos JSON atualizados (`lancamentos.json` e `ferramentas.json`) para a pasta `dados/` no repositório GitHub.

### 5. Administração

1. Faça login com uma conta de administrador.
2. Clique em **"Administração"**.
3. **Cadastrar Novo Usuário:**
   - Preencha o formulário e clique em **"Cadastrar Usuário"**.
   - Faça o upload do arquivo `usuarios.json` atualizado para o GitHub.
4. **Cadastrar Nova Ferramenta:**
   - Preencha o formulário e clique em **"Cadastrar Ferramenta"**.
   - Faça o upload do arquivo `ferramentas.json` atualizado para o GitHub.

### 6. Gerar Relatórios

1. Na página principal, clique em **"Ver Relatórios"**.
2. Clique em **"Gerar Relatório de Ferramentas Não Devolvidas em 24 Horas"**.
3. O relatório será exibido na página.

## Sincronização de Dados

Como o sistema utiliza arquivos JSON estáticos, é necessário sincronizar os dados manualmente:

1. **Após uma operação (empréstimo, devolução, administração):**
   - Baixe os arquivos JSON atualizados que foram automaticamente baixados pelo navegador.
   - Faça o upload desses arquivos para a pasta `dados/` no repositório GitHub.

2. **Antes de realizar qualquer operação:**
   - Baixe os arquivos JSON mais recentes do repositório GitHub para garantir que está trabalhando com os dados atualizados.

## Limitações

- **Processo Manual:** Requer que os usuários baixem e façam upload manualmente dos arquivos JSON para sincronizar os dados.
- **Segurança:** As senhas estão armazenadas em texto simples nos arquivos JSON.
- **Conflitos de Dados:** Múltiplos usuários realizando operações simultaneamente podem causar conflitos nos dados.

## Melhorias Futuras

- **Automatização da Sincronização:** Implementar mecanismos para facilitar a sincronização dos arquivos JSON.
- **Melhorias na Segurança:** Utilizar métodos de hashing para senhas e outras medidas de segurança.
- **Interface Mais Intuitiva:** Melhorar o design e a usabilidade da interface utilizando frameworks CSS como **Bootstrap**.

## Contato

Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

