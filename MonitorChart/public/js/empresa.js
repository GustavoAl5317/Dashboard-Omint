function formatarTempo(tempoSegundos) {
    let horas = Math.floor(tempoSegundos / 3600);
    let minutos = Math.floor((tempoSegundos % 3600) / 60);
    let segundos = Math.floor(tempoSegundos % 60);

    // Adicionando zeros à esquerda para manter o formato de dois dígitos
    const formatoTempo = [
        horas.toString().padStart(2, '0'),
        minutos.toString().padStart(2, '0'),
        segundos.toString().padStart(2, '0')
    ].join(':');

    return formatoTempo;
}

function atualizarValor() {
    // Fazer a requisição para a sua rota
    fetch('http://10.175.15.27/query')
    .then(response => response.json())
    .then(data => {
        // Verificar se a resposta contém dados válidos
        if (data && data.length > 0) {
            // Procurar o objeto com o csqname "Empresa" na matriz
            const empresa = data.find(objeto => objeto.csqname === "Empresa");

            // Verificar se o objeto "Empresa" foi encontrado
            if (empresa) {
                // Atualizar o valor na div com o valor "offered" do objeto "Empresa"
                const offeredValue = empresa.offered;
                document.getElementById('classNameId').innerText = offeredValue;

                // Calcular o nível de serviço (SL) em percentagem
                const serviceLevel = empresa.servicelevel;
                const slPercentage = (serviceLevel / offeredValue) * 100;

                // Exibir o nível de serviço em percentagem na outra div
                document.getElementById('classNameId-level').innerText = slPercentage.toFixed(0) + "%"; // Remover dois zeros após o ponto decimal
                
                // Atualizar o maior tempo de fila, se disponível
                const maxQueueTime = empresa.max_queuetime;
                if (maxQueueTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoFila = formatarTempo(maxQueueTime);
                    document.getElementById('classNameId-timeFila').innerText = formatoTempoFila;
                } else {
                    console.error('Propriedade "max_queuetime" não encontrada ou indefinida no objeto "Empresa".');
                }

                // TME - tempo médio de espera

                const totalTME = empresa.queuetime;
                const totalHandled2 = empresa.handled;
                const averageServiceTimeTme = (totalTME / totalHandled2);
                if (averageServiceTimeTme !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoTalkTime = formatarTempo(averageServiceTimeTme);
                    document.getElementById('classNameId-TME').innerText = formatoTempoTalkTime;
                } else {
                    console.error('Propriedade "Holdtime" não encontrada ou indefinida no objeto "Empresa".');
                }

                // total chamadas abandonadas acima de 5 segundos
                const totalAbandHigher5 = empresa.aband5; // Corrigido o nome da variável
                document.getElementById('classNameId-totalAband-higher5').innerText = totalAbandHigher5;

                // total chamadas atendidas
                const totalHandled = empresa.handled;
                document.getElementById('classNameId-handled').innerText = totalHandled;


                // maior tempo de abandono
                const maxAbandonTime = empresa.max_time_aband; // Corrigido o nome da variável
                if (maxAbandonTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoAbandono = formatarTempo(maxAbandonTime);
                    document.getElementById('classNameId-timeAband').innerText = formatoTempoAbandono;
                } else {
                    console.error('Propriedade "max_time_aband" não encontrada ou indefinida no objeto "Empresa".');
                }

                // tempo de conversa
                const totalTalkTime = empresa.talktime;
                const averageServiceTime = (totalTalkTime / totalHandled);
                if (averageServiceTime !== undefined) {
                    // Converter o tempo total em segundos para um formato legível
                    const formatoTempoTalkTime = formatarTempo(averageServiceTime);
                    document.getElementById('classNameId-talktime').innerText = formatoTempoTalkTime;
                } else {
                    console.error('Propriedade "talktime" não encontrada ou indefinida no objeto "Empresa".');
                }
               
            } else {
                console.error('Objeto "Empresa" não encontrado na matriz.');
            }
        } else {
            console.error('Resposta inválida ou vazia.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar valor:', error);
    });
}

setInterval(atualizarValor, 1000); // Atualiza a cada 5 segundos
