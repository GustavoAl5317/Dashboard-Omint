async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  // Função para calcular as somas e criar o gráfico
  async function createChart() {
    // URL para consulta
    const url = 'http://localhost/query';
    
    // Buscando os dados
    const data = await fetchData(url);
    
    // Variáveis para armazenar as somas
    let totalAtendidas = 0;
    let totalTocadas = 0;
    let totalEspera = 0;
  
    // Iterando sobre os dados para calcular as somas
    data.forEach(obj => {
      totalAtendidas += obj.handled;
      totalTocadas += obj.ringtime;
      totalEspera += obj.holdtime;
    });
  
    // Criando o gráfico
    const ctx = document.getElementById('myChartMonth');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Atendidas', 'Tocadas (seg)', 'Espera (seg)'],
        datasets: [
          {
            label: 'Total',
            data: [totalAtendidas, totalTocadas, totalEspera],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Comparação entre Atendidas, Tocadas e Espera (Totais)'
          }
        }
      }
    });
  }
  
  // Chamando a função para criar o gráfico
  createChart();
  