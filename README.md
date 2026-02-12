# 🍳 Diretório de Receitas

> **Sistema CRUD Completo para Gerenciamento de Receitas Culinárias com JSON Server e Interface Responsiva**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat&logo=bootstrap)](https://getbootstrap.com/)
[![jQuery](https://img.shields.io/badge/jQuery-3.7-0769AD?style=flat&logo=jquery)](https://jquery.com/)

[Sobre](#-sobre-o-projeto) • [Funcionalidades](#-funcionalidades) • [Tecnologias](#-stack-tecnológica) • [Instalação](#-instalação-e-execução) • [Estrutura](#-estrutura-do-projeto)

---

## 📖 Sobre o Projeto

O **Diretório de Receitas** é um projeto pessoal de estudos desenvolvido para praticar e consolidar conhecimentos em:

- 🗄️ **JSON Server**: API REST fake para desenvolvimento rápido e prototipagem
- 🎨 **Bootstrap 5**: Framework CSS moderno para interfaces responsivas
- 📊 **Chart.js**: Visualização de dados com gráficos interativos
- 💻 **JavaScript Vanilla + jQuery**: Manipulação DOM e requisições AJAX
- 🔧 **CRUD Completo**: Create, Read, Update e Delete de receitas

**Objetivo**: Criar um sistema completo de gestão de receitas culinárias com interface intuitiva, explorando conceitos de desenvolvimento web frontend e integração com APIs REST simuladas.

---

## ✨ Funcionalidades

### 📋 Gestão de Receitas
- ✅ **Listar** receitas por categoria (entradas, pratos principais, sobremesas)
- ✅ **Visualizar** detalhes completos das receitas com imagens
- ✅ **Cadastrar** novas receitas com múltiplas imagens
- ✅ **Editar** informações de receitas existentes
- ✅ **Deletar** receitas com confirmação
- ✅ Organização por categorias intuitivas

### 🎯 Recursos Avançados
- ✅ Sistema de múltiplas imagens por receita (principal + complementares)
- ✅ Imagens em Base64 para persistência no JSON Server
- ✅ Gráficos de estatísticas usando Chart.js
- ✅ Design responsivo compatível com mobile/tablet/desktop
- ✅ Interface moderna com Bootstrap 5 e Font Awesome
- ✅ Sistema de login simulado

### 💻 Interface Responsiva
- ✅ Layout adaptável para todos os dispositivos
- ✅ Media queries personalizadas
- ✅ Animações e transições suaves
- ✅ Cards de receitas com preview de imagens

---

## 🛠️ Stack Tecnológica

### Frontend
- **Markup**: HTML5 Semântico
- **Estilos**: CSS3 + Bootstrap 5.3.3
- **Scripts**: JavaScript ES6+ + jQuery 3.7.1
- **Ícones**: Font Awesome 6.0
- **Gráficos**: Chart.js

### Backend Simulado
- **API**: JSON Server 0.17.4
- **Banco de Dados**: db.json (arquivo local)
- **HTTP Server**: Node.js

### Ferramentas de Desenvolvimento
- **Package Manager**: npm
- **Bundler**: Não utilizado (vanilla JS)

---

## 📁 Estrutura do Projeto

```plaintext
Receitas/
├── 📂 db/                          # Banco de dados JSON Server
│   └── db.json                     # Arquivo de dados das receitas
├── 📂 public/                      # Frontend da aplicação
│   ├── index.html                  # 🏠 Página principal
│   ├── creceita.html              # ➕ Cadastro de receitas
│   ├── detalhes.html              # 🔍 Visualização detalhada
│   ├── login.html                 # 🔐 Página de login
│   ├── secundarios.html           # 📋 Listagem por categoria
│   └── 📂 assets/
│       ├── 📂 css/                # Estilos CSS
│       │   ├── estrutura.css      # Estilos gerais
│       │   ├── cadastro.css       # Estilos do formulário
│       │   ├── detalhes.css       # Estilos da página de detalhes
│       │   └── mediaqueries.css   # Responsividade
│       ├── 📂 img/                # Imagens estáticas
│       │   └── banner-logo.png    # Logo do projeto
│       └── 📂 scripts/            # JavaScript
│           ├── estrutura.js       # Funções globais
│           ├── index.js           # Lógica da home
│           ├── creceita.js        # Cadastro de receitas
│           ├── detalhes.js        # Visualização de receitas
│           ├── secundarios.js     # Listagem filtrada
│           ├── login.js           # Autenticação simulada
│           └── graficos.js        # Gráficos Chart.js
├── package.json                    # Dependências do projeto
├── package-lock.json              # Lock de dependências
├── .gitignore                     # Arquivos ignorados pelo Git
└── README.md                      # 📖 Documentação

```

---

## 🚀 Instalação e Execução

### Pré-requisitos

```bash
- Node.js 14+ e npm
- Navegador moderno (Chrome, Firefox, Edge, Safari)
```

### Instalação

1. **Clone o repositório** (se aplicável):

```bash
git clone https://github.com/seu-usuario/Receitas.git
cd Receitas
```

2. **Instale as dependências**:

```bash
npm install
```

### Execução

1. **Inicie o JSON Server**:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

2. **Acesse a aplicação**:

Abra no navegador: `http://localhost:3000/index.html`

**Endpoints da API disponíveis:**
- `GET http://localhost:3000/receitas` - Listar todas as receitas
- `GET http://localhost:3000/receitas/:id` - Obter receita específica
- `POST http://localhost:3000/receitas` - Criar nova receita
- `PUT http://localhost:3000/receitas/:id` - Atualizar receita
- `DELETE http://localhost:3000/receitas/:id` - Deletar receita

---

## 📋 Estrutura de Dados (JSON)

### Exemplo de Receita

```json
{
  "id": 1,
  "categoria": "entradas",
  "titulo": "Pão de Queijo",
  "descricao": "Tradicional pão de queijo brasileiro...",
  "ingredientes": [
    "500g de polvilho doce",
    "250ml de leite",
    "2 ovos"
  ],
  "preparo": [
    "Pré-aqueça o forno a 200°C",
    "Ferva o leite com o óleo e o sal",
    "Modele bolinhas"
  ],
  "imagem_principal": "data:image/jpeg;base64,...",
  "imagens_complementares": [
    {
      "id": 1,
      "src": "data:image/jpeg;base64,..."
    }
  ]
}
```

---

## 🎨 Funcionalidades em Destaque

### Sistema de Imagens
- Upload e conversão automática para Base64
- Suporte a múltiplas imagens por receita
- Preview de imagens antes do upload
- Galeria de imagens na página de detalhes

### Filtros e Categorias
- **Entradas**: Aperitivos e petiscos
- **Pratos Principais**: Almoço e jantar
- **Sobremesas**: Doces e tortas
- Navegação por categorias com contador de receitas

### Visualização de Dados
- Gráficos de distribuição de receitas por categoria
- Estatísticas visuais usando Chart.js
- Dashboard responsivo

---

## 🧪 Testando o Sistema

1. **Cadastre uma receita**:
   - Acesse "Cadastrar Receita"
   - Preencha: Categoria, Título, Descrição
   - Adicione ingredientes (pressione Enter após cada um)
   - Adicione passos de preparo
   - Faça upload de imagem principal (opcional)
   - Adicione imagens complementares
   - Clique em "Cadastrar"

2. **Explore as receitas**:
   - Navegue pela home para ver todas as receitas
   - Use os filtros de categoria na barra lateral
   - Clique em uma receita para ver detalhes completos

3. **Edite uma receita**:
   - Na página de detalhes, clique em "Editar"
   - Modifique os campos desejados
   - Salve as alterações

4. **Delete uma receita**:
   - Na página de detalhes, clique em "Deletar"
   - Confirme a exclusão

---

## 💡 Decisões Técnicas

### Por que JSON Server?
- ✅ Setup rápido e simples para desenvolvimento
- ✅ API REST completa sem backend real
- ✅ Ideal para prototipagem e estudos
- ✅ Persistência de dados em arquivo JSON

### Por que Bootstrap 5?
- ✅ Components prontos e responsivos
- ✅ Grid system flexível
- ✅ Reduz tempo de desenvolvimento
- ✅ Compatibilidade cross-browser

### Por que jQuery + Vanilla JS?
- ✅ jQuery simplifica manipulação DOM
- ✅ Vanilla JS para performance crítica
- ✅ Menos abstração, mais aprendizado
- ✅ Compatibilidade universal

### Por que Chart.js?
- ✅ Gráficos interativos e bonitos
- ✅ API simples e intuitiva
- ✅ Responsivo por padrão
- ✅ Múltiplos tipos de gráficos

---

## 📚 Aprendizados

Este projeto permitiu consolidar conhecimentos em:

- ✅ Manipulação de arrays e objetos JavaScript
- ✅ Requisições HTTP assíncronas (fetch/AJAX)
- ✅ Trabalho com FormData e arquivos
- ✅ Conversão de imagens para Base64
- ✅ LocalStorage para persistência de sessão
- ✅ Design responsivo com media queries
- ✅ Bootstrap Grid System e Components
- ✅ Chart.js para visualização de dados
- ✅ Organização de código em módulos
- ✅ Debugging no DevTools

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /"
**Solução**: Certifique-se de acessar `http://localhost:3000/index.html` e não apenas `http://localhost:3000`

### Erro: "Failed to fetch"
**Solução**: Verifique se o JSON Server está rodando (`npm start`)

### Imagens não aparecem
**Solução**: Verifique se as imagens foram convertidas corretamente para Base64 no upload

### Receitas não salvam
**Solução**: Confirme que o arquivo `db/db.json` tem permissões de escrita

---

## 🤝 Sobre o Desenvolvimento

**Projeto Individual de Estudos**

Desenvolvido por: Rafael
Objetivos: Prática de desenvolvimento web fullstack, CRUD completo, APIs REST
Status: Concluído (funcional para estudos)
Contexto: Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Web

---

## 📞 Contato

Este é um projeto **open-source para fins educacionais**. Sinta-se à vontade para:

- 🍴 **Fork** o projeto e adaptá-lo às suas necessidades
- 🐛 **Reportar bugs** (se encontrar)
- 💡 **Sugerir melhorias** ou novos recursos
- 📖 **Usar como referência** para seus próprios estudos

---

<div align="center">

**⭐ Se este projeto te ajudou nos estudos, considere dar uma estrela!**

Feito com 🧑‍🍳 e muita dedicação

</div>
