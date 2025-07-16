/* Função CRUD para cadastro de receitas (creceita.html) */
function inicializarCadastro() {

    /* Declaração de variáveis */
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../modulos/login.html';
        return;
    }
    const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    if (!usuarioCorrente.admin) {
        alert('Acesso negado. Apenas administradores podem cadastrar receitas.');
        window.location.href = '../index.html';
        return;
    }

    /* Verifica se o formulário existe */
    const form = document.getElementById('cadastro');
    if (!form) return;

    /* Configurações iniciais do formulário */
    form.setAttribute('novalidate', 'novalidate');
    const cancelarBtn = document.getElementById('cancelar');
    const limparBtn = document.getElementById('limpar');
    const tableBody = document.getElementById('tabela-receitas-body');
    const inputs = form.querySelectorAll('input, textarea, select');
    const imagemInput = document.getElementById('imagem');
    const complementaresInput = document.getElementById('complementares');
    const previewPrincipal = document.getElementById('preview-principal');
    const previewContainer = document.getElementById('preview-container');
    const adicionarMaisBtn = document.querySelector('.adicionar-mais');
    complementaresInput.setAttribute('name', 'complementares');
    const API_URL = 'http://localhost:3000/receitas';

    /* Funções auxiliares */
    const sanitizeInput = (value) => {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    /* Função para requisições ao JSONServer */
    const apiRequest = async (url, method, data = null) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : null
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            if (method === 'DELETE') {
                return true;
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert(`Erro ao comunicar com o servidor: ${error.message}`);
            return null;
        }
    };

    /* Campos e regras de validação */
    const campos = [
        {
            id: 'categoria',
            key: 'categoria',
            label: 'Categoria',
            regras: [
                { condicao: v => v, mensagem: 'O campo "Categoria" é obrigatório.' }
            ]
        },
        {
            id: 'nome',
            key: 'titulo',
            label: 'Nome',
            regras: [
                { condicao: v => v.length >= 3, mensagem: 'Deve ter pelo menos 3 caracteres.' }
            ]
        },
        {
            id: 'descricao',
            key: 'descricao',
            label: 'Descrição',
            regras: [
                { condicao: v => v.length >= 10, mensagem: 'Deve ter pelo menos 10 caracteres.' }
            ]
        },
        {
            id: 'ingredientes',
            key: 'ingredientes',
            label: 'Ingredientes',
            regras: [
                { condicao: v => v.length > 0, mensagem: 'Pelo menos um ingrediente é necessário.' }
            ]
        },
        {
            id: 'preparo',
            key: 'preparo',
            label: 'Modo de Preparo',
            regras: [
                { condicao: v => v.length > 0, mensagem: 'Pelo menos um passo de preparo é necessário.' }
            ]
        },
        {
            id: 'imagem',
            key: 'imagem_principal',
            label: 'Imagem Principal',
            regras: [
                { condicao: (v, isEdit) => isEdit || v, mensagem: 'A imagem principal é obrigatória.' }
            ]
        }
    ];

    /* Inicializa o formulário */
    const coletarDados = async () => {
        const categoriaSelect = document.getElementById('categoria').value;
        const categoriaMap = {
            'opcao1': 'entradas',
            'opcao2': 'pratos_principais',
            'opcao3': 'sobremesas'
        };
        const ingredientesRaw = document.getElementById('ingredientes').value.trim();
        const preparoRaw = document.getElementById('preparo').value.trim();
        const ingredientes = ingredientesRaw
            .split(';')
            .map(item => sanitizeInput(item.trim()))
            .filter(item => item);
        const preparo = preparoRaw
            .split(';')
            .map(item => sanitizeInput(item.trim()))
            .filter(item => item);
        let imagemPrincipal = '';
        if (imagemInput.files[0]) {
            imagemPrincipal = await fileToBase64(imagemInput.files[0]);
        } else if (form.dataset.existingImagem) {
            imagemPrincipal = form.dataset.existingImagem;
        }
        let existingImagensComplementares = [];
        if (form.dataset.existingComplementares) {
            existingImagensComplementares = JSON.parse(form.dataset.existingComplementares);
            existingImagensComplementares = existingImagensComplementares.filter(img => !form.dataset.removedComplementares?.includes(img.id.toString()));
        }
        const newImagensComplementares = await Promise.all(
            Array.from(complementaresInput.files).map(async (file, index) => ({
                id: (existingImagensComplementares.length || 0) + index + 1,
                src: await fileToBase64(file)
            }))
        );
        const imagensComplementares = [...existingImagensComplementares, ...newImagensComplementares];
        return {
            categoria: categoriaMap[categoriaSelect] || '',
            titulo: sanitizeInput(document.getElementById('nome').value.trim()),
            descricao: sanitizeInput(document.getElementById('descricao').value.trim()),
            ingredientes,
            preparo,
            imagem_principal: imagemPrincipal,
            imagens_complementares: imagensComplementares
        };
    };

    /* Funções de validação e manipulação de erros */
    const exibirErro = (campoId, mensagem) => {
        const input = document.getElementById(campoId);
        const erroDiv = document.getElementById(`erro-${campoId}`);
        if (input && erroDiv) {
            input.classList.add('invalid');
            erroDiv.textContent = mensagem;
            erroDiv.style.display = 'block';
            input.focus();
        }
    };

    /* Função para limpar erros de validação */
    const limparErros = () => {
        inputs.forEach(input => {
            input.classList.remove('invalid');
            const erroDiv = document.getElementById(`erro-${input.id}`);
            if (erroDiv) {
                erroDiv.style.display = 'none';
                erroDiv.textContent = '';
            }
        });
    };

    /* Função para validar campos */
    const validarCampo = (campoId, valor, regras, isEdit = false) => {
        for (const regra of regras) {
            if (!regra.condicao(valor, isEdit)) {
                exibirErro(campoId, regra.mensagem);
                return false;
            }
        }
        const erroDiv = document.getElementById(`erro-${campoId}`);
        if (erroDiv) {
            erroDiv.style.display = 'none';
        }
        return true;
    };

    /* Função para validar o cadastro completo */
    const validarCadastro = (dados, isEdit = false) => {
        let isValid = true;
        campos.forEach(campo => {
            let valor = dados[campo.key];
            if (campo.id === 'imagem') {
                valor = imagemInput.files[0] ? imagemInput.files[0].name : (isEdit && form.dataset.existingImagem ? form.dataset.existingImagem : '');
            }
            if (!validarCampo(campo.id, valor, campo.regras, isEdit)) {
                isValid = false;
            }
        });
        return isValid;
    };

    /* Funções de pré-visualização de imagens */
    const previewImagemPrincipal = () => {
        previewPrincipal.innerHTML = '';
        if (imagemInput.files[0]) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(imagemInput.files[0]);
            img.alt = 'Pré-visualização da imagem principal';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            previewPrincipal.appendChild(img);
        } else if (form.dataset.existingImagem) {
            const img = document.createElement('img');
            img.src = form.dataset.existingImagem;
            img.alt = 'Imagem principal atual';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            previewPrincipal.appendChild(img);
        }
    };

    /* Função para pré-visualizar imagens complementares */
    const previewImagensComplementares = () => {
        previewContainer.innerHTML = '';
        let existingImagens = [];
        if (form.dataset.existingComplementares) {
            existingImagens = JSON.parse(form.dataset.existingComplementares);
            const removedIds = form.dataset.removedComplementares ? form.dataset.removedComplementares.split(',').map(id => parseInt(id)) : [];
            existingImagens = existingImagens.filter(img => !removedIds.includes(img.id));
        }
        existingImagens.forEach(img => {
            const container = document.createElement('div');
            container.className = 'preview-complementar-container';
            container.dataset.id = img.id;
            container.innerHTML = `
            <img src="${img.src}" alt="Imagem complementar atual" style="max-width: 100px; margin: 5px;">
        `;
            previewContainer.appendChild(container);
        });
        Array.from(complementaresInput.files).forEach((file, index) => {
            const container = document.createElement('div');
            container.className = 'preview-complementar-container';
            container.dataset.tempId = index;
            container.innerHTML = `
            <img src="${URL.createObjectURL(file)}" alt="Pré-visualização de imagem complementar" style="max-width: 100px; margin: 5px;">
        `;
            previewContainer.appendChild(container);
        });
    };

    /* Carrega as receitas existentes na tabela */
    const carregarReceitas = async () => {
        const data = await apiRequest(API_URL, 'GET');
        const receitas = Array.isArray(data) ? data : [];
        tableBody.innerHTML = receitas.map((receita, index) => `
            <tr data-id="${receita.id}">
                <td><img src="${receita.imagem_principal || 'https://via.placeholder.com/60x60?text=Sem+Imagem'}" alt="Imagem de ${receita.titulo}" title="${receita.titulo}"></td>
                <td title="${receita.titulo}">${receita.titulo}</td>
                <td title="${receita.descricao}">${receita.descricao}</td>
                <td title="${receita.ingredientes.join('; ')}">${receita.ingredientes.join('; ')}</td>
                <td title="${receita.preparo.join('; ')}">${receita.preparo.join('; ')}</td>
                <td>
                    <button class="acao-btn editar" data-id="${receita.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="acao-btn excluir" data-id="${receita.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            </tr>
        `).join('');
        document.querySelectorAll('.acao-btn.editar').forEach(btn => {
            btn.addEventListener('click', () => editarReceita(btn.dataset.id));
        });
        document.querySelectorAll('.acao-btn.excluir').forEach(btn => {
            btn.addEventListener('click', () => excluirReceita(btn.dataset.id));
        });
    };

    /* Função para salvar ou editar uma receita */
    const salvarReceita = async (event) => {
        event.preventDefault();
        const dados = await coletarDados();
        const isEdit = form.dataset.editId !== undefined;
        if (!validarCadastro(dados, isEdit)) {
            alert('Por favor, corrija os erros no formulário.');
            return;
        }
        let sucesso;
        if (isEdit) {
            const id = form.dataset.editId;
            const url = `${API_URL}/${id}`;
            sucesso = await apiRequest(url, 'PATCH', dados);
        } else {
            sucesso = await apiRequest(API_URL, 'POST', dados);
        }
        if (sucesso) {
            alert(isEdit ? 'Receita atualizada com sucesso!' : 'Receita registrada com sucesso!');
            form.reset();
            previewPrincipal.innerHTML = '';
            previewContainer.innerHTML = '';
            delete form.dataset.editId;
            delete form.dataset.existingImagem;
            delete form.dataset.existingComplementares;
            delete form.dataset.removedComplementares;
            await carregarReceitas();
        }
    };

    /* Função para editar uma receita */
    const editarReceita = async (id) => {
        const data = await apiRequest(API_URL, 'GET');
        const receitas = Array.isArray(data) ? data : [];
        const receita = receitas.find(r => r.id.toString() === id.toString());
        if (receita) {
            const categoriaMap = {
                'entradas': 'opcao1',
                'principais': 'opcao2',
                'sobremesas': 'opcao3'
            };
            document.getElementById('categoria').value = categoriaMap[receita.categoria] || '';
            document.getElementById('nome').value = receita.titulo || '';
            document.getElementById('descricao').value = receita.descricao || '';
            document.getElementById('ingredientes').value = receita.ingredientes ? receita.ingredientes.join('; ') : '';
            document.getElementById('preparo').value = receita.preparo ? receita.preparo.join('; ') : '';
            imagemInput.value = '';
            complementaresInput.value = '';
            previewPrincipal.innerHTML = receita.imagem_principal ? `<img src="${receita.imagem_principal}" alt="Imagem principal atual" style="max-width: 100%; max-height: 200px;">` : '';
            form.dataset.existingImagem = receita.imagem_principal || '';
            form.dataset.existingComplementares = receita.imagens_complementares ? JSON.stringify(receita.imagens_complementares) : '[]';
            delete form.dataset.removedComplementares;
            previewImagensComplementares();
            form.dataset.editId = id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /* Função para excluir uma receita */
    const excluirReceita = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta receita?')) {
            return;
        }
        const url = `${API_URL}/${id}`;
        const sucesso = await apiRequest(url, 'DELETE');
        if (sucesso) {
            alert('Receita excluída com sucesso!');
            await carregarReceitas();
        }
    };

    /* Configuração dos eventos */
    form.addEventListener('submit', salvarReceita);
    cancelarBtn.addEventListener('click', () => {
        if (confirm('Deseja realmente cancelar? Todas as alterações não salvas serão perdidas!')) {
            limparErros();
            form.reset();
            previewPrincipal.innerHTML = '';
            previewContainer.innerHTML = '';
            delete form.dataset.editId;
            delete form.dataset.existingImagem;
            delete form.dataset.existingComplementares;
            delete form.dataset.removedComplementares;
            window.location.href = '../index.html';
        }
    });

    /* Limpar campos do formulário */
    limparBtn.addEventListener('click', () => {
        if (confirm('Deseja limpar todos os campos do cadastro?')) {
            form.reset();
            limparErros();
            previewPrincipal.innerHTML = '';
            previewContainer.innerHTML = '';
            delete form.dataset.editId;
            delete form.dataset.existingImagem;
            delete form.dataset.existingComplementares;
            delete form.dataset.removedComplementares;
            alert('Cadastro limpo com sucesso!');
        }
    });

    /* Eventos de pré-visualização de imagens */
    imagemInput.addEventListener('change', previewImagemPrincipal);
    complementaresInput.addEventListener('change', previewImagensComplementares);
    adicionarMaisBtn.addEventListener('click', () => {
        complementaresInput.click();
    });

    /* Eventos de validação ao digitar */
    inputs.forEach(input => {
        input.addEventListener('input', async () => {
            const campo = campos.find(c => c.id === input.id);
            if (campo) {
                let valor;
                if (campo.id === 'ingredientes' || campo.id === 'preparo') {
                    const raw = input.value.trim();
                    valor = raw.split(';').map(item => sanitizeInput(item.trim())).filter(item => item);
                } else if (campo.id === 'imagem') {
                    valor = imagemInput.files[0] ? imagemInput.files[0].name : (form.dataset.existingImagem || '');
                } else {
                    valor = input.value.trim();
                }
                validarCampo(input.id, valor, campo.regras, form.dataset.editId !== undefined);
            }
        });
    });
    carregarReceitas();
}