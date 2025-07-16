/* Função para gerar o menu de navegação */
function gerarMenu() {

    /* Declaração de variáveis */
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let isAdmin = false;
    let isLoggedIn = false;
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        isAdmin = usuarioCorrente.admin === true || usuarioCorrente.admin === "true";
        isLoggedIn = true;
    }

    /* Gera o HTML do menu de navegação */
    let menuHTML = `
        <div class="header-controls d-flex align-items-center">
            <div class="login-logout-wrapper">
                <button id="loginLogoutBtn" class="btn-login-logout" aria-label="${isLoggedIn ? 'Logout' : 'Login'}">
                    <i class="fa-solid ${isLoggedIn ? 'fa-sign-out-alt' : 'fa-sign-in-alt'} me-1"></i>
                    ${isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>
        
        <input type="checkbox" id="menuToggle" class="d-none">
        <label for="menuToggle" class="menu-icone" aria-label="Menu">
            <i class="fa-solid fa-chart-bar"></i>
            <i class="fa-solid fa-times"></i>
        </label>
        
        <ul class="navegacao d-flex flex-wrap justify-content-center gap-3 p-0 m-0 list-unstyled">
            <li><a href="../modulos/secundarios.html?categoria=entradas" class="nav-link">Entradas</a></li>
            <li><a href="../modulos/secundarios.html?categoria=pratos_principais" class="nav-link">Pratos Principais</a></li>
            <li><a href="../modulos/secundarios.html?categoria=sobremesas" class="nav-link">Sobremesas</a></li>
            <li><a href="../modulos/secundarios.html?categoria=favoritos" class="nav-link">Favoritos</a></li>
    `;

    /* Adiciona o link de cadastro de receitas se o usuário for administrador */
    if (isAdmin) {
        menuHTML += `<li><a href="../modulos/creceita.html" class="nav-link">Cadastrar</a></li>`;
    }
    menuHTML += `</ul>`;

    $('#menu').html(menuHTML);

    /* Anexa o evento de clique ao botão de logout */
    $('#loginLogoutBtn').on('click', function () {
        if (isLoggedIn) {
            sessionStorage.removeItem('usuarioCorrente');
            window.location.href = '../modulos/login.html';
        } else {
            window.location.href = '../modulos/login.html';
        }
    });

    /* Eventos para funcionalidade do menu toggle */
    $('.navegacao .nav-link').on('click', function () {
        if (window.innerWidth <= 767) {
            $('#menuToggle').prop('checked', false);
            $('body').css('overflow', '');
        }
    });

    $('#menuToggle').on('change', function () {
        if (this.checked) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', '');
        }
    });

    /* Fecha menu com tecla Escape */
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#menuToggle').is(':checked')) {
            $('#menuToggle').prop('checked', false);
            $('body').css('overflow', '');
        }
    });

    /* Fecha menu ao redimensionar para desktop */
    $(window).on('resize', function () {
        if (window.innerWidth > 767 && $('#menuToggle').is(':checked')) {
            $('#menuToggle').prop('checked', false);
            $('body').css('overflow', '');
        }
    });
}

/* Implementação da pesquisa nos html's */
function pesquisar() {
    const $form = $('.pesquisa');
    const $input = $('#search-input');

    /* Direciona a pesquisa para a página secundária (secundarios.html) */
    $form.on('submit', function (e) {
        e.preventDefault();
        const termo = $input.val().trim();
        if (termo) {
            window.location.href = `../modulos/secundarios.html?termo=${encodeURIComponent(termo)}`;
        }
    });
}

/* Botão de favorito */
function btnFavorito(button, receitaId) {
    const $botao = $(button);
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');

    /* Verifica se o usuário está logado */
    if (!usuarioCorrenteJSON) {
        return;
    }

    const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    const userId = usuarioCorrente.id;

    /* Verifica se o ID do usuário é válido */
    if (!userId) {
        window.location.href = '/modulos/login.html';
        return;
    }

    $botao.toggleClass('favoritado');

    /* Busca os dados do usuário no JSONServer */
    fetch(`http://localhost:3000/usuarios/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error('Usuário não encontrado');
            return response.json();
        })
        .then(user => {
            let favoritos = user.favoritos || [];

            if ($botao.hasClass('favoritado')) {
                $botao.html('💖');
                $botao.attr('aria-label', $botao.attr('aria-label').replace('Adicionar', 'Remover'));
                if (!favoritos.includes(receitaId.toString())) {
                    favoritos.push(receitaId.toString());
                }
            } else {
                $botao.html('❤️');
                $botao.attr('aria-label', $botao.attr('aria-label').replace('Remover', 'Adicionar'));
                favoritos = favoritos.filter(id => id !== receitaId.toString());
            }

            /* Atualiza os favoritos no JSONServer */
            fetch(`http://localhost:3000/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user, favoritos })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao atualizar favoritos');
                    if (window.location.pathname.includes('secundarios.html') &&
                        new URLSearchParams(window.location.search).get('categoria') === 'favoritos') {
                        carregarCategoria();
                    }
                })
        })
}

/* Gerar rodapé para os html's */
function gerarRodapé() {
    $('#rodape').html(`
        <footer class="text-white m-1 mt-1">
            <div class="container">
                <div class="row">
                    <div class="sobre col-md-8 my-auto mb-md-0">
                        <h4 class="fw-bold mb-2">Sobre:</h4>
                        <p class="mb-0">Este projeto foi desenvolvido por Rafael Xavier Oliveira como parte do curso de Ciência da Computação para a disciplina de Desenvolvimento de Interfaces Web. 
                            O Diretório de Receitas tem como objetivo facilitar o acesso a uma coleção variada de receitas culinárias, reunindo pratos com cultura em um único lugar. 
                            Utilizando HTML, CSS, JavaScript e recursos de acessibilidade, o projeto é baseado em uma API Rest e JSONServer, trazendo melhorias e mais funcionalidades.</p>
                    </div>
                    <div class="col-md-4">
                        <div class="autoria mb-3">
                            <h4 class="fw-bold mb-2">Autoria:</h4>
                            <div class="d-flex align-items-center">
                                <img src="../assets/img/banner-perfil.jpeg" alt="Foto de perfil" class="imagem-perfil me-2">
                                <div>
                                    <p class="mb-1"><strong>Aluno:</strong> Rafael Xavier Oliveira</p>
                                    <p class="mb-1"><strong>Curso:</strong> Ciência da Computação</p>
                                    <p class="mb-1"><strong>Turma:</strong> Manhã - Campus Lourdes</p>
                                </div>
                            </div>
                        </div>
                        <div class="infos">
                            <div class="d-flex align-items-center">
                                <h4 class="fw-bold my-1 me-2">Redes Sociais:</h4>
                                <p class="d-flex gap-3 mb-0">
                                    <a href="https://www.instagram.com/faelxg/" class="icone" aria-label="Instagram">
                                        <i class="fa-brands fa-instagram"></i>
                                    </a>
                                    <a href="https://wa.me/5537998219315" class="icone" aria-label="WhatsApp">
                                        <i class="fa-brands fa-whatsapp"></i>
                                    </a>
                                    <a href="https://github.com/rafaelxo" class="icone" aria-label="GitHub">
                                        <i class="fa-brands fa-github"></i>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `);
}

/* Inicialização dos elementos gerais */
$(document).ready(function () {
    gerarMenu();
    pesquisar();
    if (document.getElementById('receitas')) carregarIndex();
    if (document.getElementById('conteudo-slide')) carregarSlide();
    if (window.location.pathname.includes('secundarios.html')) carregarCategoria();
    if (window.location.pathname.includes('detalhes.html')) carregarDetalhes();
    if (window.location.pathname.includes('creceita.html')) inicializarCadastro();
    gerarRodapé();
});