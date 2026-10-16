
# CPU Scheduling Simulator

CSE513 Assignment 1

A browser-based CPU scheduling simulator developed
using HTML, CSS, and JavaScript.

## Features

- Add, edit, and delete processes
- Load predefined Workloads A and B
- Select a CPU scheduling algorithm
- Configure the Round Robin time quantum
- Visualize execution using a Gantt chart
- Display CPU idle intervals
- Calculate individual process metrics
- Display average performance metrics
- Clear all processes or reset simulation results
- Validate user inputs

## Supported Algorithms

1. First-Come, First-Served (FCFS)
2. Shortest Job First (SJF) - Non-preemptive
3. Shortest Remaining Time First (SRTF) - Preemptive
4. Round Robin (RR)

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules)

No backend, database, or external JavaScript
libraries are required.

## Project Structure

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

## How to Run Locally

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension.
4. Open index.html using "Open with Live Server".
5. The simulator will open in your web browser.

Alternatively, run a local HTTP server:

    python -m http.server 8000

Then open:

    http://localhost:8000

A local HTTP server is recommended because
the project uses JavaScript ES Modules.

## How to Use

1. Enter a process ID, arrival time, and CPU burst.
2. Click "Add Process".
3. Add more processes as needed.
4. Select a scheduling algorithm.
5. If Round Robin is selected, enter a time quantum.
6. Click "Run Simulation".
7. Inspect the Gantt chart, process results,
   and average metrics.

## Performance Metrics

Turnaround Time = Completion Time - Arrival Time

Waiting Time = Turnaround Time - CPU Burst

Response Time = First Start Time - Arrival Time

## Input Rules

- Process IDs must be unique.
- Arrival times must be nonnegative integers.
- CPU bursts must be positive integers.
- Round Robin quantum must be a positive integer.

## Testing

The simulator was tested using:

- Workload A
- Workload B
- CPU idle interval test
- Simultaneous arrival and tie-breaking test
- SRTF preemption test
- Round Robin quantum comparison
- Round Robin queue-ordering debugging test

## Limitations

- Only one CPU is simulated.
- Each process has one CPU burst.
- I/O operations are not modeled.
- Context switching has zero time cost.
- CPU burst values are known in advance.
- This is an educational simulator, not an
  implementation of Ubuntu's actual scheduler.
- Process data is stored in browser memory
  and is not saved between page reloads.

## Deployment

The project can be hosted as a static website
using GitHub Pages.

No server-side configuration is necessary.
