/* Carregar detalhes da receita (detalhes.html) */
function carregarDetalhes() {

    /* Declaração de variáveis */
    const $conteudo = $('#conteudo-receita');
    $conteudo.html('<p class="text-center"><i class="fas fa-spinner fa-spin"></i> Carregando receita...</p>');
    const id = new URLSearchParams(window.location.search).get('id');
    let favoritos = [];

    if (!id) {
        $conteudo.html(`
            <div class="alert alert-danger">
                Receita não encontrada. <a href="../index.html">Voltar à página inicial</a>.
            </div>
        `);
        return;
    }

    /* Verifica se o usuário está logado */
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
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
                carregarReceita();
            })
            .catch(error => {
                console.error('Erro ao buscar favoritos:', error);
                carregarReceita();
            });
    } else {
        carregarReceita();
    }

    /* Função para carregar a receita */
    function carregarReceita() {

        /* Requisição da receita ao JSONServer */
        fetch('http://localhost:3000/receitas')
            .then(res => {
                if (!res.ok) throw new Error('Erro ao acessar o servidor');
                return res.json();
            })
            .then(data => {
                const recipes = Array.isArray(data) ? data : [];
                const receita = recipes.find(r => r.id && r.id.toString() === id);
                if (!receita) {
                    $conteudo.html(`
                        <div class="alert alert-danger">
                            Receita não encontrada. <a href="../index.html">Voltar à página inicial</a>.
                        </div>
                    `);
                    return;
                }

                /* Verifica se a receita foi encontrada */
                const favoritado = favoritos.includes(receita.id.toString());
                const ingredientes = Array.isArray(receita.ingredientes) && receita.ingredientes.length
                    ? receita.ingredientes
                    : ['Sem ingredientes disponíveis'];
                const preparo = Array.isArray(receita.preparo) && receita.preparo.length
                    ? receita.preparo
                    : ['Sem instruções detalhadas disponíveis'];
                const titulo = receita.titulo || 'Sem título';
                const descricao = receita.descricao || 'Sem descrição disponível';
                const imagem = receita.imagem_principal || 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                const imagensComplementares = Array.isArray(receita.imagens_complementares) && receita.imagens_complementares.length
                    ? receita.imagens_complementares
                    : [];

                /* Adiciona o conteúdo da receita ao HTML */
                $conteudo.html(`
                    <div class="receita-detalhe-container">
                        <div class="card receita-detalhe-card">
                            <img src="${imagem}" class="card-img-top receita-detalhe-imagem" alt="Foto de ${titulo}" loading="lazy">
                            ${imagensComplementares.length > 0 ? `
                                <div class="imagens-complementares">
                                    ${imagensComplementares.map(img => `
                                        <img src="${img.src}" class="imagem-complementar" 
                                             data-id="${img.id}" 
                                             alt="Imagem complementar de ${titulo}" 
                                             loading="lazy">
                                    `).join('')}
                                </div>
                            ` : ''}
                            <div class="card-body receita-detalhe-corpo">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h2 class="card-title receita-detalhe-titulo">${titulo}</h2>
                                    <button class="favorito ${favoritado ? 'favoritado' : ''}" 
                                            data-id="${receita.id}"
                                            aria-label="${favoritado ? 'Remover' : 'Adicionar'} ${titulo} aos favoritos">
                                        ${favoritado ? '💖' : '❤️'}
                                    </button>
                                </div>
                                <p class="card-texto receita-detalhe-descricao">${descricao}</p>
                                <div class="receita-detalhe-secao">
                                    <h3 class="receita-detalhe-subtitulo"><i class="fas fa-list-ul me-2"></i>Ingredientes</h3>
                                    <ul class="receita-detalhe-ingredientes">
                                        ${ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="receita-detalhe-secao">
                                    <h3 class="receita-detalhe-subtitulo"><i class="fas fa-mortar-pestle me-2"></i>Modo de Preparo</h3>
                                    <ol class="receita-detalhe-preparo my-2">
                                        ${preparo.map(p => `<li>${p}</li>`).join('')}
                                    </ol>
                                </div>
                                <a href="../index.html"><button class="my-1" id="voltar"><i class="fa-solid fa-arrow-left"></i> Voltar</button></a>
                            </div>
                        </div>
                    </div>
                `);

                /* Botão para favoritar */
                $(document).on('click', '.favorito', function (e) {
                    e.stopPropagation();
                    const $btn = $(this);
                    const btnId = $btn.data('id').toString();
                    const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
                    const userId = usuarioCorrente.id;

                    /* Requisição para os favoritos do usuário */
                    fetch(`http://localhost:3000/usuarios/${userId}`)
                        .then(res => {
                            if (!res.ok) throw new Error('Erro ao buscar usuário');
                            return res.json();
                        })
                        .then(user => {
                            let novosFavoritos = user.favoritos || [];
                            if (novosFavoritos.includes(btnId)) {
                                novosFavoritos = novosFavoritos.filter(favId => favId !== btnId);
                                $btn.removeClass('favoritado');
                                $btn.html('❤️');
                                $btn.attr('aria-label', `Adicionar ${titulo} aos favoritos`);
                            } else {
                                novosFavoritos.push(btnId);
                                $btn.addClass('favoritado');
                                $btn.html('💖');
                                $btn.attr('aria-label', `Remover ${titulo} aos favoritos`);
                            }

                            /* Atualização dos favoritos do usuário */
                            return fetch(`http://localhost:3000/usuarios/${userId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...user, favoritos: novosFavoritos })
                            });
                        })
                        .then(res => {
                            if (!res.ok) throw new Error('Erro ao atualizar favoritos');
                        })
                        .catch(error => {
                            console.error('Erro ao gerenciar favoritos:', error);
                        });
                });

                /* Visualização de imagens complementares */
                $(document).on('click keypress', '.imagem-complementar', function (e) {
                    if (e.type === 'click' || (e.type === 'keypress' && e.key === 'Enter')) {
                        const $imagemComplementar = $(this);
                        const $imagemPrincipal = $('.receita-detalhe-imagem');
                        const srcComplementar = $imagemComplementar.attr('src');
                        const srcPrincipal = $imagemPrincipal.attr('src');
                        $imagemPrincipal.attr('src', srcComplementar);
                        $imagemComplementar.attr('src', srcPrincipal);
                        const altComplementar = $imagemComplementar.attr('alt');
                        const altPrincipal = $imagemPrincipal.attr('alt');
                        $imagemPrincipal.attr('alt', altComplementar);
                        $imagemComplementar.attr('alt', altPrincipal);
                    }
                });
            })

            /* Controle de erro */
            .catch(error => {
                $conteudo.html(`
                    <div class="alert alert-danger">
                        Receita não encontrada. <a href="../index.html">Voltar à página inicial</a>.
                    </div>
                `);
                console.error('Fetch error:', error);
            });
    }
}