# CPU Scheduling Simulator

**CSE513 — Assignment 1**

A browser-based CPU scheduling simulator built with HTML, CSS, and JavaScript. It visualizes process execution and compares scheduling algorithms using a Gantt chart and performance metrics.

**Live website:** https://ghaciosm.github.io/CPU-Scheduling-Simulator/

## Features

- Add, edit, and delete processes (process ID, arrival time, CPU burst).
- Load predefined Workload A and Workload B.
- Choose among four CPU scheduling algorithms.
- Set a configurable time quantum for Round Robin.
- Visualize process execution and CPU idle intervals on a Gantt chart.
- View per-process start, completion, turnaround, waiting, and response times.
- Compare average turnaround, waiting, and response times.
- Clear the process list or reset simulation results.
- Validate process inputs and Round Robin quantum.

## Scheduling algorithms

| Algorithm | Policy |
| --- | --- |
| **FCFS** (First-Come, First-Served) | Non-preemptive; executes processes in arrival order. |
| **SJF** (Shortest Job First) | Non-preemptive; selects the shortest burst among ready processes. |
| **SRTF** (Shortest Remaining Time First) | Preemptive; selects the shortest remaining CPU time. |
| **RR** (Round Robin) | Preemptive; uses a FIFO ready queue and a configurable quantum. |

For equal arrival times or equal scheduling priorities, the specified tie-breaking rules are applied. In SRTF, a running process continues when remaining times are equal. For Round Robin, processes arriving exactly at a quantum boundary enter the ready queue before the unfinished running process is re-enqueued.

## Project structure

```text
CPU-Scheduling-Simulator/
├── index.html
├── style.css
├── script.js
├── README.md
└── algorithms/
    ├── fcfs.js
    ├── sjf.js
    ├── srtf.js
    └── rr.js
```

## Run locally

This project requires no backend or package installation. Because it uses JavaScript ES modules, open it through a local HTTP server rather than by double-clicking `index.html`.

### Option A: VS Code Live Server

1. Open the `CPU-Scheduling-Simulator` folder in Visual Studio Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and select **Open with Live Server**.
4. The simulator opens in your browser.

### Option B: Python HTTP server

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000/.

## How to use

1. Enter a unique process ID, an arrival time, and a CPU burst, then click **Add Process**. Repeat as needed, or select **Load Workload A/B**.
2. Select **FCFS**, **SJF**, **SRTF**, or **Round Robin**.
3. For Round Robin, choose a positive integer **Time Quantum**.
4. Click **Run Simulation**.
5. Review the Gantt chart, per-process results, and average metrics.
6. Use **Reset Simulation** to clear results without deleting processes, or **Clear All** to remove all processes.

## Input rules and simulation assumptions

- Process IDs must be unique and nonempty.
- Arrival times are nonnegative integers.
- CPU bursts are positive integers.
- Round Robin quantum must be a positive integer.
- A single CPU executes at most one process at a time.
- Each process has a single CPU burst; I/O is not modeled.
- Context-switch overhead is assumed to be zero.
- CPU burst lengths are known in advance.
- The CPU is idle only when no process is ready.

## Performance metrics

For each process:

```text
Turnaround Time = Completion Time - Arrival Time
Waiting Time    = Turnaround Time - CPU Burst
Response Time   = First Start Time - Arrival Time
```

Average metrics are calculated by summing the corresponding per-process metric and dividing by the number of processes.

## Test cases

The simulator was checked against hand-calculated schedules and metrics for:

- **Workload A:** P1 (0, 8), P2 (1, 4), P3 (2, 2), P4 (4, 1).
- **Workload B:** P1 (2, 3), P2 (2, 1), P3 (8, 2), P4 (9, 1).
- **CPU idle test:** P1 (3, 2), P2 (7, 3), P3 (12, 2), using FCFS.
- **Simultaneous arrivals and tie test:** P1 (0, 4), P2 (0, 2), P3 (0, 2), P4 (1, 1), using SJF.
- **SRTF preemption test:** P1 (0, 10), P2 (2, 3), P3 (4, 1).
- **Round Robin quantum comparison:** Workload A with quantum values 1, 2, and 4.
- **Round Robin queue-boundary test:** P1 (0, 4), P2 (2, 1), quantum 2; expected execution: P1 (0–2), P2 (2–3), P1 (3–5).
- **Round Robin counterexample:** P1 (0, 4), P2 (0, 4), tested with quantum values 1 and 4.
- **Additional SJF tie-breaking test:** P1 (3, 2), P2 (2, 2), P3 (0, 5), testing arrival-time priority over input order.

Each pair above is written as `(arrival time, CPU burst)`.

## Limitations

This is an educational single-CPU simulator, not a real operating-system scheduler. It does not model I/O, multiple CPUs, memory effects, or context-switch cost. Process data is kept in browser memory and is not preserved after the page is reloaded.

## Technologies and deployment

- HTML5
- CSS3
- JavaScript (ES modules)
- GitHub Pages (static website hosting)

No external JavaScript framework or database is required.

