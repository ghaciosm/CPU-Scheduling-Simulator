
import { fcfs } from "./algorithms/fcfs.js";
import { sjf } from "./algorithms/sjf.js";
import { srtf } from "./algorithms/srtf.js";
import { rr } from "./algorithms/rr.js";

// ========================================
// DATA
// ========================================

let processes = [];
let editingIndex = null;

const workloadA = [
    { id: "P1", arrival: 0, burst: 8 },
    { id: "P2", arrival: 1, burst: 4 },
    { id: "P3", arrival: 2, burst: 2 },
    { id: "P4", arrival: 4, burst: 1 }
];

const workloadB = [
    { id: "P1", arrival: 2, burst: 3 },
    { id: "P2", arrival: 2, burst: 1 },
    { id: "P3", arrival: 8, burst: 2 },
    { id: "P4", arrival: 9, burst: 1 }
];

// ========================================
// HTML ELEMENTS
// ========================================

const processIdInput = document.getElementById("processId");
const arrivalInput = document.getElementById("arrivalTime");
const burstInput = document.getElementById("burstTime");

const addProcessBtn = document.getElementById("addProcessBtn");
const processTableBody = document.getElementById("processTableBody");

const algorithmSelect = document.getElementById("algorithm");
const quantumInput = document.getElementById("quantum");
const quantumGroup = document.getElementById("quantumGroup");
const algorithmInfo = document.getElementById("algorithmInfo");

const ganttChart = document.getElementById("ganttChart");
const resultsTableBody = document.getElementById("resultsTableBody");
const averageMetrics = document.getElementById("averageMetrics");
const errorMessage = document.getElementById("errorMessage");

// ========================================
// ALGORITHM DESCRIPTIONS
// ========================================

const algorithmDescriptions = {
    FCFS: {
        name: "First Come, First Served (FCFS)",
        description:
            "Non-preemptive scheduling. Processes execute " +
            "in order of arrival. Once started, a process " +
            "runs until completion."
    },

    SJF: {
        name: "Shortest Job First (SJF)",
        description:
            "Non-preemptive scheduling. The CPU selects " +
            "the ready process with the shortest CPU burst."
    },

    SRTF: {
        name: "Shortest Remaining Time First (SRTF)",
        description:
            "Preemptive scheduling. A running process is " +
            "interrupted only when another ready process " +
            "has a strictly shorter remaining time."
    },

    RR: {
        name: "Round Robin (RR)",
        description:
            "Preemptive scheduling using a FIFO ready queue. " +
            "Each process receives up to one time quantum " +
            "before moving to the back of the queue."
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showError(message) {
    errorMessage.textContent = message;
}

function clearResults() {
    ganttChart.innerHTML =
        '<p class="empty-state">Run a simulation to view the timeline.</p>';

    resultsTableBody.innerHTML = "";

    averageMetrics.innerHTML =
        '<p class="empty-state">No simulation results yet.</p>';
}

function clearInputs() {
    processIdInput.value = "";
    arrivalInput.value = "";
    burstInput.value = "";

    editingIndex = null;
    addProcessBtn.textContent = "Add Process";
}

// ========================================
// ALGORITHM UI
// ========================================

function updateAlgorithmUI() {
    const algorithm = algorithmSelect.value;
    const info = algorithmDescriptions[algorithm];

    quantumGroup.hidden = algorithm !== "RR";

    algorithmInfo.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = info.name;

    const description = document.createElement("p");
    description.textContent = info.description;

    algorithmInfo.append(title, description);

    clearResults();
}

algorithmSelect.addEventListener("change", updateAlgorithmUI);
quantumInput.addEventListener("input", clearResults);

// ========================================
// PROCESS TABLE
// ========================================

function renderProcesses() {
    processTableBody.innerHTML = "";

    processes.forEach((p, index) => {
        const row = document.createElement("tr");

        [p.id, p.arrival, p.burst].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            processIdInput.value = p.id;
            arrivalInput.value = p.arrival;
            burstInput.value = p.burst;

            editingIndex = index;
            addProcessBtn.textContent = "Save Process";
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            processes.splice(index, 1);

            clearInputs();
            renderProcesses();
            clearResults();
            showError("");
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        processTableBody.appendChild(row);
    });
}

// ========================================
// ADD OR EDIT PROCESS
// ========================================

addProcessBtn.addEventListener("click", () => {
    showError("");

    const id = processIdInput.value.trim();
    const arrivalText = arrivalInput.value.trim();
    const burstText = burstInput.value.trim();

    const arrival = Number(arrivalText);
    const burst = Number(burstText);

    if (!id) {
        return showError("Process ID cannot be empty.");
    }

    if (
        arrivalText === "" ||
        !Number.isSafeInteger(arrival) ||
        arrival < 0
    ) {
        return showError(
            "Arrival time must be a nonnegative integer."
        );
    }

    if (
        burstText === "" ||
        !Number.isSafeInteger(burst) ||
        burst <= 0
    ) {
        return showError(
            "CPU burst must be a positive integer."
        );
    }

    const duplicate = processes.some((p, index) =>
        p.id === id && index !== editingIndex
    );

    if (duplicate) {
        return showError("Process IDs must be unique.");
    }

    const process = { id, arrival, burst };

    if (editingIndex === null) {
        processes.push(process);
    } else {
        processes[editingIndex] = process;
    }

    clearInputs();
    renderProcesses();
    clearResults();
});

// ========================================
// LOAD WORKLOADS
// ========================================

function loadWorkload(workload) {
    processes = workload.map(p => ({ ...p }));

    clearInputs();
    renderProcesses();
    clearResults();
    showError("");
}

document.getElementById("loadWorkloadA")
    .addEventListener("click", () => loadWorkload(workloadA));

document.getElementById("loadWorkloadB")
    .addEventListener("click", () => loadWorkload(workloadB));

// ========================================
// GANTT CHART
// ========================================

function renderGantt(gantt) {
    ganttChart.innerHTML = "";

    if (gantt.length === 0) {
        return;
    }

    const processColors = [
        "#7564df",
        "#30bcb8",
        "#f59e72",
        "#5c84d6",
        "#d57eae",
        "#78ad72"
    ];

    const totalTime = gantt[gantt.length - 1].end;

    const timeline = document.createElement("div");
    timeline.className = "gantt-timeline";

    timeline.style.width =
        `max(100%, ${Math.max(totalTime, 1) * 60}px)`;

    const bars = document.createElement("div");
    bars.className = "gantt-bars";

    const axis = document.createElement("div");
    axis.className = "gantt-axis";

    gantt.forEach(segment => {
        const duration = segment.end - segment.start;

        const block = document.createElement("div");
        block.className = "gantt-block";
        block.style.flex = `${duration} 0 0`;

        const processDiv = document.createElement("div");
        processDiv.className = "gantt-process";
        processDiv.textContent = segment.id;

        const processIndex = processes.findIndex(
            p => p.id === segment.id
        );

        if (segment.id === "IDLE") {
            processDiv.style.backgroundColor = "#8d93a8";
        } else {
            processDiv.style.backgroundColor =
                processColors[processIndex % processColors.length];
        }

        block.appendChild(processDiv);
        bars.appendChild(block);
    });

    const times = [
        gantt[0].start,
        ...gantt.map(segment => segment.end)
    ];

    [...new Set(times)].forEach(time => {
        const tick = document.createElement("span");
        tick.className = "gantt-tick";
        tick.textContent = time;

        tick.style.left = `${(time / totalTime) * 100}%`;

        if (time === 0) {
            tick.classList.add("first");
        }

        if (time === totalTime) {
            tick.classList.add("last");
        }

        axis.appendChild(tick);
    });

    timeline.append(bars, axis);
    ganttChart.appendChild(timeline);
}

// ========================================
// PROCESS RESULTS
// ========================================

function renderResults(results) {
    resultsTableBody.innerHTML = "";

    const orderedResults = [...results].sort(
        (a, b) =>
            processes.findIndex(p => p.id === a.id) -
            processes.findIndex(p => p.id === b.id)
    );

    orderedResults.forEach(p => {
        const row = document.createElement("tr");

        const values = [
            p.id,
            p.arrival,
            p.burst,
            p.start,
            p.completion,
            p.turnaround,
            p.waiting,
            p.response
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        resultsTableBody.appendChild(row);
    });
}

// ========================================
// AVERAGE METRICS
// ========================================

function renderAverages(results) {
    const count = results.length;

    const average = key =>
        results.reduce(
            (sum, p) => sum + p[key], 0
        ) / count;

    const metrics = [
        {
            label: "Average Turnaround Time",
            value: average("turnaround"),
            color: "metric-purple"
        },
        {
            label: "Average Waiting Time",
            value: average("waiting"),
            color: "metric-teal"
        },
        {
            label: "Average Response Time",
            value: average("response"),
            color: "metric-coral"
        }
    ];

    averageMetrics.innerHTML = "";

    metrics.forEach(metric => {
        const card = document.createElement("div");
        card.className = `metric-card ${metric.color}`;

        const label = document.createElement("span");
        label.className = "metric-label";
        label.textContent = metric.label;

        const value = document.createElement("span");
        value.className = "metric-value";
        value.textContent = metric.value.toFixed(2);

        const unit = document.createElement("span");
        unit.className = "metric-unit";
        unit.textContent = "Time units";

        card.append(label, value, unit);
        averageMetrics.appendChild(card);
    });
}

// ========================================
// RUN SIMULATION
// ========================================

document.getElementById("runBtn")
    .addEventListener("click", () => {
        showError("");
        clearResults();

        if (processes.length === 0) {
            return showError(
                "Please add at least one process."
            );
        }

        const algorithm = algorithmSelect.value;
        const quantumText = quantumInput.value.trim();
        const quantum = Number(quantumText);

        if (
            algorithm === "RR" &&
            (
                quantumText === "" ||
                !Number.isSafeInteger(quantum) ||
                quantum <= 0
            )
        ) {
            return showError(
                "Time quantum must be a positive integer."
            );
        }

        let output;

        if (algorithm === "FCFS") {
            output = fcfs(processes);
        } else if (algorithm === "SJF") {
            output = sjf(processes);
        } else if (algorithm === "SRTF") {
            output = srtf(processes);
        } else if (algorithm === "RR") {
            output = rr(processes, quantum);
        } else {
            return showError("Unknown algorithm.");
        }

        renderGantt(output.gantt);
        renderResults(output.results);
        renderAverages(output.results);
    });

// ========================================
// CLEAR ALL
// ========================================

document.getElementById("clearAllBtn")
    .addEventListener("click", () => {
        processes = [];

        clearInputs();
        clearResults();
        renderProcesses();
        showError("");
    });

// ========================================
// RESET SIMULATION
// ========================================

document.getElementById("resetBtn")
    .addEventListener("click", () => {
        clearResults();
        showError("");
    });

// ========================================
// INITIALIZE PAGE
// ========================================

updateAlgorithmUI();
renderProcesses();
