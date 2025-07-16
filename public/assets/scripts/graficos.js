/* Função para mapear categorias */
function mapearCategoria(categoria) {
  const mapeamento = {
    entradas: "Entradas",
    pratos_principais: "Pratos Principais",
    sobremesas: "Sobremesas",
  };
  return mapeamento[categoria] || categoria;
}

/* Função para gerar o gráfico */
function createPieChart(receitas) {
  if (!receitas || receitas.length === 0) {
    console.warn("Nenhum dado disponível para criar o gráfico.");
    return;
  }

  /* Declaração das variáveis */
  const categoriasNomes = Array.from(new Set(receitas.map((item) => item.categoria)));
  const categorias = categoriasNomes.map((categoria) => mapearCategoria(categoria));
  const valoresPorCategoria = categoriasNomes.map((categoria) => {
    return receitas.filter((item) => item.categoria === categoria).length;
  });

  /* Criação do gráfico de pizza */
  const ctx = document.getElementById("divPieChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: categorias,
      datasets: [
        {
          data: valoresPorCategoria,
          backgroundColor: ["rgb(255, 0, 55)", "rgb(0, 153, 255)", "rgb(255, 183, 0)"],
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

/* Carregar o gráfico ao iniciar a página */
window.addEventListener('load', () => {

  /* Requisição das receitas ao JSONServer */
  fetch("http://localhost:3000/receitas")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar db.json: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      let receitas;
      if (Array.isArray(data)) {
        receitas = data;
      } else if (data && data.receitas && Array.isArray(data.receitas)) {
        receitas = data.receitas;
      } else {
        throw new Error('Estrutura de dados inválida: "receitas" não encontrada');
      }

      if (receitas.length === 0) {
        console.warn("Nenhum dado de receitas encontrado.");
      }

      createPieChart(receitas);
    })
    .catch((error) => {
      alert("Não foi possível carregar os dados para o gráfico: " + error.message);
    });
});