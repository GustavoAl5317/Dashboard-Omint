async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para converter segundos em formato de horas, minutos e segundos
function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}min ${remainingSeconds}s`;
    } else if (minutes > 0) {
        return `${minutes}min ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

// Função para calcular as somas e criar o gráfico apenas para a empresa
async function createChart() {
    // URL para consulta
    const url = 'http://10.175.15.27/query';

    // Função para atualizar os dados e o gráfico
    async function updateChart() {
        const data = await fetchData(url);
        const empresaData = data.filter(obj => obj.csqname === 'Empresa');

        let totalTocadas = 0;
        let totalEspera = 0;

        empresaData.forEach(obj => {
            totalTocadas += obj.ringtime;
            totalEspera += obj.holdtime;
        });

        const ctx = document.getElementById('myChartMonth').getContext('2d');
        myChart.data.datasets[0].data = [totalTocadas, totalEspera];
        myChart.update();
    }

    // Atualizar o contador de chamadas atendidas
    async function updateCounter() {
        const data = await fetchData(url);
        const empresaData = data.filter(obj => obj.csqname === 'Empresa');

        let totalAtendidas = 0;
        empresaData.forEach(obj => {
            totalAtendidas += obj.handled;
        });

        document.getElementById('totalAtendidasCounter').innerText = `Total de Atendidas: ${formatSeconds(totalAtendidas)}`;
    }

    // Criando o gráfico inicial
    const data = await fetchData(url);
    const empresaData = data.filter(obj => obj.csqname === 'Empresa');
    let totalAtendidas = 0;
    let totalTocadas = 0;
    let totalEspera = 0;
    empresaData.forEach(obj => {
        totalAtendidas += obj.handled;
        totalTocadas += obj.ringtime;
        totalEspera += obj.holdtime;
    });

    document.getElementById('totalAtendidasCounter').innerText = `Total de Atendidas: ${formatSeconds(totalAtendidas)}`;

    const ctx = document.getElementById('myChartMonth').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tocadas', 'Espera'],
            datasets: [{
                label: 'Total',
                data: [totalTocadas, totalEspera],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatSeconds(value);
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação entre Tocadas e Espera (Totais) - Empresa'
                }
            }
        }
    });

    // Iniciar o polling para atualização automática
    setInterval(updateChart, 2000); // Atualiza a cada 60 segundos
    setInterval(updateCounter, 2000); // Atualiza a cada 60 segundos
}

// Chamando a função para criar o gráfico
createChart();
