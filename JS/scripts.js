// scripts.js
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aqui você pode adicionar uma verificação de usuário/senha (exemplo simples)
    if (username === 'admin' && password === 'senha123') {
        localStorage.setItem('loggedIn', 'true'); // Armazena que o usuário está logado
        window.location.href = 'index.html'; // Redireciona para a página de lançamentos
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha incorretos.';
    }
});

// Função para carregar JSON
async function carregarJSON(caminho) {
    try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar ${caminho}: ${resposta.statusText}`);
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        alert(error);
        return null;
    }
}

// Função para baixar arquivos JSON
function baixarArquivo(nomeArquivo, conteudo) {
    const blob = new Blob([JSON.stringify(conteudo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
}

// Função para verificar se o usuário está logado
document.addEventListener('DOMContentLoaded', function() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const caminho = window.location.pathname.split("/").pop();

    if (caminho !== 'login.html' && caminho !== 'index.html') {
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }

        if (caminho === 'admin.html' && !usuario.isAdmin) {
            alert('Acesso negado. Área administrativa apenas para administradores.');
            window.location.href = 'index.html';
            return;
        }
    }

    // Exibir opções administrativas se o usuário for admin
    if (caminho === 'index.html' && usuario && usuario.isAdmin) {
        const adminOpcao = document.getElementById('admin-opcao');
        if (adminOpcao) {
            adminOpcao.style.display = 'block';
        }
    }
});

// Função de Logout
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Função para registrar empréstimo
async function registrarEmprestimo(event) {
    event.preventDefault();

    const ferramentaId = parseInt(document.getElementById('ferramenta').value);
    if (isNaN(ferramentaId)) {
        alert('Por favor, selecione uma ferramenta válida.');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const lancamentos = await carregarJSON('dados/lancamentos.json');
    const ferramentas = await carregarJSON('dados/ferramentas.json');

    if (!lancamentos || !ferramentas) {
        alert('Erro ao carregar dados. Verifique os arquivos JSON.');
        return;
    }

    const ferramenta = ferramentas.ferramentas.find(f => f.id === ferramentaId);
    if (!ferramenta || ferramenta.quantidadeDisponivel <= 0) {
        alert('Ferramenta indisponível para empréstimo.');
        return;
    }

    const novoId = lancamentos.lancamentos.length > 0 ? lancamentos.lancamentos[lancamentos.lancamentos.length - 1].id + 1 : 1;
    const dataEmprestimo = new Date().toISOString();

    lancamentos.lancamentos.push({
        "id": novoId,
        "ferramentaId": ferramentaId,
        "usuarioId": usuario.id,
        "dataEmprestimo": dataEmprestimo,
        "dataDevolucao": null
    });

    // Atualizar quantidade disponível
    ferramenta.quantidadeDisponivel -= 1;

    // Baixar os arquivos atualizados
    baixarArquivo('dados/lancamentos.json', lancamentos);
    baixarArquivo('dados/ferramentas.json', ferramentas);

    alert('Empréstimo registrado com sucesso!\nPor favor, faça upload dos arquivos atualizados para o repositório.');
    window.location.href = 'index.html';
}

// Função para registrar devolução
async function registrarDevolucao(event) {
    event.preventDefault();

    const lancamentoId = parseInt(document.getElementById('lancamento').value);
    if (isNaN(lancamentoId)) {
        alert('Por favor, selecione um lançamento válido.');
        return;
    }

    const lancamentos = await carregarJSON('dados/lancamentos.json');
    const ferramentas = await carregarJSON('dados/ferramentas.json');

    if (!lancamentos || !ferramentas) {
        alert('Erro ao carregar dados. Verifique os arquivos JSON.');
        return;
    }

    const lancamento = lancamentos.lancamentos.find(l => l.id === lancamentoId && l.dataDevolucao === null);
    if (!lancamento) {
        alert('Lançamento não encontrado ou já devolvido.');
        return;
    }

    lancamento.dataDevolucao = new Date().toISOString();

    const ferramenta = ferramentas.ferramentas.find(f => f.id === lancamento.ferramentaId);
    if (ferramenta) {
        ferramenta.quantidadeDisponivel += 1;
    }

    // Baixar os arquivos atualizados
    baixarArquivo('dados/lancamentos.json', lancamentos);
    baixarArquivo('dados/ferramentas.json', ferramentas);

    alert('Devolução registrada com sucesso!\nPor favor, faça upload dos arquivos atualizados para o repositório.');
    window.location.href = 'index.html';
}

// Função para cadastrar novo usuário
async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-usuario').value.trim();
    const senha = document.getElementById('senha-usuario').value.trim();
    const isAdmin = document.getElementById('admin-usuario').checked;

    if (!nome || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const usuarios = await carregarJSON('dados/usuarios.json');

    if (!usuarios) {
        alert('Erro ao carregar dados. Verifique os arquivos JSON.');
        return;
    }

    const novoId = usuarios.usuarios.length > 0 ? usuarios.usuarios[usuarios.usuarios.length - 1].id + 1 : 1;
    usuarios.usuarios.push({
        "id": novoId,
        "nome": nome,
        "senha": senha,
        "isAdmin": isAdmin
    });

    // Baixar o arquivo atualizado
    baixarArquivo('dados/usuarios.json', usuarios);

    alert('Usuário cadastrado com sucesso!\nPor favor, faça upload do arquivo atualizado para o repositório.');
    document.getElementById('cadastro-usuario-form').reset();
}

// Função para cadastrar nova ferramenta
async function cadastrarFerramenta(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-ferramenta').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade-ferramenta').value.trim());

    if (!nome || isNaN(quantidade) || quantidade < 1) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const ferramentas = await carregarJSON('dados/ferramentas.json');

    if (!ferramentas) {
        alert('Erro ao carregar dados. Verifique os arquivos JSON.');
        return;
    }

    const novoId = ferramentas.ferramentas.length > 0 ? ferramentas.ferramentas[ferramentas.ferramentas.length - 1].id + 1 : 1;
    ferramentas.ferramentas.push({
        "id": novoId,
        "nome": nome,
        "quantidadeDisponivel": quantidade
    });

    // Baixar o arquivo atualizado
    baixarArquivo('dados/ferramentas.json', ferramentas);

    alert('Ferramenta cadastrada com sucesso!\nPor favor, faça upload do arquivo atualizado para o repositório.');
    document.getElementById('cadastro-ferramenta-form').reset();
}

// Função para gerar relatório
async function gerarRelatorio() {
    const lancamentos = await carregarJSON('dados/lancamentos.json');
    const ferramentas = await carregarJSON('dados/ferramentas.json');
    const usuarios = await carregarJSON('dados/usuarios.json');

    if (!lancamentos || !ferramentas || !usuarios) {
        alert('Erro ao carregar dados. Verifique os arquivos JSON.');
        return;
    }

    const agora = new Date();
    const limite = new Date(agora.getTime() - 24 * 60 * 60 * 1000); // 24 horas atrás

    const relatorio = lancamentos.lancamentos.filter(l => {
        return l.dataDevolucao === null && new Date(l.dataEmprestimo) <= limite;
    });

    if (relatorio.length === 0) {
        document.getElementById('relatorio').innerHTML = '<p>Nenhuma ferramenta está há mais de 24 horas sem devolução.</p>';
        return;
    }

    let tabela = '<table><thead><tr><th>ID Lançamento</th><th>Ferramenta</th><th>Usuário</th><th>Data Empréstimo</th><th>Horas Empréstimo</th></tr></thead><tbody>';

    relatorio.forEach(l => {
        const ferramenta = ferramentas.ferramentas.find(f => f.id === l.ferramentaId);
        const usuario = usuarios.usuarios.find(u => u.id === l.usuarioId);
        const dataEmprestimo = new Date(l.dataEmprestimo);
        const horasEmpréstimo = Math.floor((agora - dataEmprestimo) / (1000 * 60 * 60));

        tabela += `<tr>
            <td>${l.id}</td>
            <td>${ferramenta ? ferramenta.nome : 'Desconhecida'}</td>
            <td>${usuario ? usuario.nome : 'Desconhecido'}</td>
            <td>${dataEmprestimo.toLocaleString()}</td>
            <td>${horasEmpréstimo}h</td>
        </tr>`;
    });

    tabela += '</tbody></table>';
    document.getElementById('relatorio').innerHTML = tabela;
}
