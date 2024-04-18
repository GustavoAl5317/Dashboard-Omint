function toggleColor() {
    const levelElement = document.getElementById('cardNivel');
    const TextElement = document.getElementById('card-textNivel')
    const TextNumbers = document.getElementById('classNameId-level')
    const percentage = parseFloat(levelElement.innerText.replace('%', ''));

    if (percentage < 99.5) {
        levelElement.style.border = '2px solid red';
        TextElement.style.color = ''
        TextElement.style.fontSize = '24px'
        TextNumbers.style.color = 'red'
    } else {
        levelElement.style.color = 'black'; // Ou outra cor padrão
    }
}





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
            let sumOffered = 0;
            let sumHandled = 0;
            let sumAband = 0;
            let sumQueuetime = 0;
            let averageServiceTimeTme = 0; // Declarar a variável fora do loop
            let sumPercentage = 0;
            let averagePercentage = 0;
            let sumMaxqueuetime = 0;
            let sumMaxTimeAband = 0;
            let sumTotalTalkTime = 0;
            let averageServiceTime = 0;

            // Iterar sobre todos os elementos em data
            data.forEach(empresa => {
                // Verificar se o objeto tem a propriedade "offered"
                if (empresa.offered !== undefined) {
                    // Somar o valor de "offered" ao total
                    sumOffered += empresa.offered;
                    sumHandled += empresa.handled;
                    sumAband += empresa.aband5;
                    sumQueuetime += empresa.queuetime;
                    sumPercentage += empresa.servicelevel;
                    sumMaxqueuetime += empresa.max_queuetime;
                    sumMaxTimeAband += empresa.max_time_aband;
                    sumTotalTalkTime += empresa.talktime;
                }
            });

            // Calcular o TME
            if (sumHandled !== 0) { // Verificar se houve chamadas atendidas
                averageServiceTimeTme = sumQueuetime / sumHandled;
            }

            // Nível de serviço

            if (sumPercentage !==0) {
                averagePercentage = sumPercentage / sumOffered * 100;
            }

            // TMA

            if (sumTotalTalkTime !==0){
                averageServiceTime = sumTotalTalkTime / sumHandled;
            }

            // Atualizar os elementos HTML com os valores calculados
            document.getElementById('classNameId').innerText = sumOffered;
            document.getElementById('classNameId-handled').innerText = sumHandled;
            document.getElementById('classNameId-totalAband-higher5').innerText = sumAband;
            document.getElementById('classNameId-TME').innerText = formatarTempo(averageServiceTimeTme);
            document.getElementById('classNameId-level').innerText = averagePercentage.toFixed(2) + "%";
            document.getElementById('classNameId-timeFila').innerText = formatarTempo(sumMaxqueuetime);
            document.getElementById('classNameId-timeAband').innerText = formatarTempo(sumMaxTimeAband);
            document.getElementById('classNameId-talktime').innerText = formatarTempo(averageServiceTime)
            toggleColor();

        } else {
            console.error('Resposta inválida ou vazia.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar valor:', error);
    });
}

setInterval(atualizarValor, 1000); // Atualiza a cada 5 segundos
