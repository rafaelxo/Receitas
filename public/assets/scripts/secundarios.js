/* Carregar receitas por categoria ou pesquisa (secundarios.html) */
function carregarCategoria() {

    /* Declaração de variáveis */
    const $receitas = $('#receitas-categoria');
    const $titulo = $('#categoria-titulo');
    $receitas.html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Carregando receitas...</p>');
    const categoria = new URLSearchParams(window.location.search).get('categoria');
    const termo = new URLSearchParams(window.location.search).get('termo');
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let favoritos = [];

    /* Verifica se o usuário está logado para buscar favoritos */
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        const userId = usuarioCorrente.id;
        fetch(`http://localhost:3000/usuarios/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('Erro ao buscar favoritos');
                return res.json();
            })
            .then(user => {
                favoritos = user.favoritos || [];
                processarReceitas();
            })
            .catch(error => {
                console.error('Erro ao buscar favoritos:', error);
                processarReceitas();
            });
    } else {
        processarReceitas();
    }

    /* Define as categorias disponíveis */
    const categorias = {
        'entradas': 'Entradas',
        'pratos_principais': 'Pratos Principais',
        'sobremesas': 'Sobremesas',
        'favoritos': 'Favoritos'
    };

    /* Função para processar as receitas após obter favoritos */
    function processarReceitas() {

        /* Requisição das receitas ao JSONServer */
        fetch('http://localhost:3000/receitas')
            .then(res => {
                if (!res.ok) throw new Error('Erro ao acessar o servidor');
                return res.json();
            })
            .then(data => {
                let recipes = Array.isArray(data) ? data : [];
                let receitasFiltradas = [];
                let titulo = '';

                if (termo) {
                    titulo = `Resultados da Pesquisa: "${termo}"`;
                    receitasFiltradas = recipes.filter(receita => {
                        const noTitulo = receita.titulo.toLowerCase().includes(termo.toLowerCase());
                        const nosIngredientes = receita.ingredientes.some(ing =>
                            ing.toLowerCase().includes(termo.toLowerCase())
                        );
                        return noTitulo || nosIngredientes;
                    });
                } else {
                    titulo = categorias[categoria] || 'Categoria não encontrada';
                    if (categoria === 'favoritos') {
                        receitasFiltradas = recipes.filter(r => favoritos.includes(r.id.toString()));
                    } else {
                        receitasFiltradas = recipes.filter(r => r.categoria === categoria);
                    }
                }

                /* Limpa o conteúdo atual */
                $titulo.text(titulo);
                $receitas.empty();

                /* Verifica se há receitas filtradas */
                if (receitasFiltradas.length > 0) {
                    receitasFiltradas.forEach(receita => {
                        const favoritado = favoritos.includes(receita.id.toString());
                        const titulo = receita.titulo || 'Sem título';
                        const descricao = receita.descricao || 'Sem descrição';
                        const imagem = receita.imagem_principal || 'https://via.placeholder.com/300x200?text=Sem+Imagem';

                        /* Adiciona as receitas ao html */
                        $receitas.append(`
                            <article class="receita mt-0 px-0">
                                <div class="card h-100" data-receita="${receita.id}">
                                    <img src="${imagem}" class="card-img-top" alt="Foto de ${titulo}" loading="lazy">
                                    <div class="card-body">
                                        <h3 class="card-titulo">${titulo}</h3>
                                        <p class="card-texto">${descricao}</p>
                                    </div>
                                    <button class="favorito ${favoritado ? 'favoritado' : ''}" 
                                            data-id="${receita.id}"
                                            aria-label="${favoritado ? 'Remover' : 'Adicionar'} ${titulo} aos favoritos">
                                        ${favoritado ? '💖' : '❤️'}
                                    </button>
                                </div>
                            </article>
                        `);
                    });

                    /* Direcionamento para detalhes da receita ao clicar no card */
                    $(document).on('click', '.card', function (e) {
                        if (!$(e.target).hasClass('favorito')) {
                            const id = $(this).data('receita');
                            window.location.href = `detalhes.html?id=${id}`;
                        }
                    });

                    /* Evento para o botão de favorito */
                    $(document).on('click', '.favorito', function (e) {
                        e.stopPropagation();
                        const id = $(this).data('id');
                        btnFavorito(this, id);
                    });

                    /* Evento para limpar favoritos */
                    $(document).on('click', '#limpar-favoritos', function () {
                        if (usuarioCorrenteJSON) {
                            const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
                            const userId = usuarioCorrente.id;
                            fetch(`http://localhost:3000/usuarios/${userId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...JSON.parse(usuarioCorrenteJSON), favoritos: [] })
                            })
                                .then(res => {
                                    if (!res.ok) throw new Error('Erro ao limpar favoritos');
                                    carregarCategoria();
                                })
                                .catch(error => {
                                    console.error('Erro ao limpar favoritos:', error);
                                    alert('Erro ao limpar favoritos. Tente novamente.');
                                });
                        }
                    });

                    /* Se não houver receitas filtradas, exibe mensagem */
                } else {
                    $receitas.html(`
                        <div class="col-12 d-flex justify-content-center align-items-center">
                            <p class="text-muted">
                                ${termo ? `Nenhuma receita encontrada para o termo "${termo}".` :
                            categoria === 'favoritos' ? 'Nenhuma receita favoritada.' :
                                'Nenhuma receita encontrada para esta categoria.'}
                            </p>
                        </div>
                    `);
                }

                /* Exibe ou oculta o botão de limpar favoritos */
                $('#limpar-favoritos').toggle(categoria === 'favoritos' && favoritos.length > 0);
            })

            /* Controle de erro */
            .catch(error => {
                $receitas.html(`
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <p class="text-muted">
                            ${termo ? `Nenhuma receita encontrada para o termo "${termo}".` :
                        categoria === 'favoritos' ? 'Nenhuma receita favoritada.' :
                            'Nenhuma receita encontrada para esta categoria.'}
                        </p>
                    </div>
                `);
                $titulo.text(termo ? `Resultados da Pesquisa: "${termo}"` : categorias[categoria] || 'Categoria não encontrada');
                $('#limpar-favoritos').toggle(categoria === 'favoritos' && favoritos.length > 0);
                console.error('Fetch error:', error);
            });
    }
}