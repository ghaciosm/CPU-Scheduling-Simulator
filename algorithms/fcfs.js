export function fcfs(processes) {
    const sorted = processes
        .map((p, index) => ({...p, index }))
        .sort((a, b) => a.arrival - b.arrival || a.index - b.index);

    let currentTime = 0; 
    //{ id: "P1", start: 0, end: 8 },
    const gantt = []; 
    const results = [];

    for (const p of sorted)
    {
        //cpu idle time
        if (currentTime < p.arrival) {
            gantt.push({
                id: "IDLE",
                start: currentTime,
                end: p.arrival
            });
            currentTime = p.arrival;
        }

        const start = currentTime;
        const completion = start + p.burst;

        const turnaround = completion - p.arrival;
        const waiting = turnaround - p.burst;
        const response = start - p.arrival;

        gantt.push({
            id: p.id,
            start,
            end: completion
        });

        results.push({
            id: p.id,
            arrival: p.arrival,
            burst: p.burst,
            start,
            completion,
            turnaround,
            waiting,
            response
        });

        currentTime = completion;
    }

    return { gantt, results};

}