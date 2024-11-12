function generarTablaInput() {
    const numProcesos = document.getElementById('numProcesos').value;
    const tablaInputDiv = document.getElementById('tablaInput');
    let tablaHTML = `<table>
                        <tr>
                            <th>Procesos</th>
                            <th>Tiempo de proceso</th>
                            <th>Prioridad</th>
                            <th>Tiempo de llegada</th>
                        </tr>`;

    for (let i = 1; i <= numProcesos; i++) {
        tablaHTML += `<tr>
                        <td>P${i}</td>
                        <td><input type="number" id="tiempoProceso${i}" min="1" required></td>
                        <td><input type="number" id="prioridad${i}" min="1" required></td>
                        <td><input type="number" id="tiempoLlegada${i}" min="0" required></td>
                      </tr>`;
    }
    tablaHTML += `</table><button onclick="calcularFCFS(${numProcesos})">Calcular FCFS</button>`;
    tablaInputDiv.innerHTML = tablaHTML;
}

function calcularFCFS(numProcesos) {
    const procesos = [];
    let sumaEspera = 0;
    let sumaRetorno = 0;

    for (let i = 1; i <= numProcesos; i++) {
        const tiempoProceso = parseInt(document.getElementById(`tiempoProceso${i}`).value);
        const prioridad = parseInt(document.getElementById(`prioridad${i}`).value);
        const tiempoLlegada = parseInt(document.getElementById(`tiempoLlegada${i}`).value);
        procesos.push({ id: `P${i}`, tiempoProceso, prioridad, tiempoLlegada });
    }

    // Ordenar los procesos por tiempo de llegada
    procesos.sort((a, b) => a.tiempoLlegada - b.tiempoLlegada);

    let tiempoActual = 0;
    let tablaResultadosHTML = `<table>
                                <tr>
                                    <th>Procesos</th>
                                    <th>Tiempo de proceso</th>
                                    <th>Prioridad</th>
                                    <th>Tiempo de llegada</th>
                                    <th>Tiempo de inicio</th>
                                    <th>Tiempo de fin</th>
                                    <th>Tiempo de espera</th>
                                    <th>Tiempo de retorno</th>
                                </tr>`;

    const ganttChartDiv = document.getElementById('ganttChart');
    ganttChartDiv.innerHTML = "<h2>Diagrama de Gantt</h2><div class='gantt-chart'>";

    let timelineHTML = "<div class='timeline'>";
    let ganttChartHTML = "<div class='processes'>";

    procesos.forEach(proceso => {
        const tiempoInicio = Math.max(tiempoActual, proceso.tiempoLlegada);
        const tiempoFin = tiempoInicio + proceso.tiempoProceso;
        const tiempoEspera = tiempoInicio - proceso.tiempoLlegada;
        const tiempoRetorno = tiempoFin - proceso.tiempoLlegada;

        // Acumulamos los tiempos de espera y retorno para el cálculo del promedio
        sumaEspera += tiempoEspera;
        sumaRetorno += tiempoRetorno;

        tablaResultadosHTML += `<tr>
                                    <td>${proceso.id}</td>
                                    <td>${proceso.tiempoProceso}</td>
                                    <td>${proceso.prioridad}</td>
                                    <td>${proceso.tiempoLlegada}</td>
                                    <td>${tiempoInicio}</td>
                                    <td>${tiempoFin}</td>
                                    <td>${tiempoEspera}</td>
                                    <td>${tiempoRetorno}</td>
                                </tr>`;

        // Añadir tiempos a la línea de tiempo y procesos al diagrama de Gantt
        timelineHTML += `<div class='time' style='flex: ${proceso.tiempoProceso};'>${tiempoInicio}</div>`;
        ganttChartHTML += `<div class='gantt-block ${proceso.id.toLowerCase()}' style='flex: ${proceso.tiempoProceso};'>${proceso.id}</div>`;

        tiempoActual = tiempoFin;
    });

    // Añadir el último tiempo al final
    timelineHTML += `<div class='time'>${tiempoActual}</div>`;

    ganttChartHTML += "</div>";
    timelineHTML += "</div>";

    tablaResultadosHTML += "</table>";
    document.getElementById('tablaResultados').innerHTML = tablaResultadosHTML;
    ganttChartDiv.innerHTML += timelineHTML + ganttChartHTML;

    // Cálculo de los tiempos promedios de espera y retorno
    const promedioEspera = (sumaEspera / numProcesos).toFixed(2);
    const promedioRetorno = (sumaRetorno / numProcesos).toFixed(2);

    // Mostrar los tiempos promedios en el HTML
    const promediosDiv = document.createElement('div');
    promediosDiv.className = 'promedios';
    promediosDiv.innerHTML = `
        <p>Tiempo promedio de espera: <strong>${promedioEspera}</strong></p>
        <p>Tiempo promedio de retorno: <strong>${promedioRetorno}</strong></p>
    `;
    document.getElementById('ganttChart').appendChild(promediosDiv);
}

function reiniciarPagina() {
    document.getElementById('numProcesos').value = '';
    document.getElementById('tablaInput').innerHTML = '';
    document.getElementById('tablaResultados').innerHTML = '';
    document.getElementById('ganttChart').innerHTML = '';
}
