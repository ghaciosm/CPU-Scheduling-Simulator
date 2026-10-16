
export function sjf(processes) {
    const remaining = processes.map((p, index) => ({
        ...p,
        index
    }));

    let currentTime = 0;
    const gantt = [];
    const results = [];

    while (remaining.length > 0) {
        // CPU'ya gelmiş process'leri bul
        const ready = remaining.filter(
            p => p.arrival <= currentTime
        );

        // Henüz hazır process yoksa CPU idle
        if (ready.length === 0) {
            const nextArrival = Math.min(
                ...remaining.map(p => p.arrival)
            );

            gantt.push({
                id: "IDLE",
                start: currentTime,
                end: nextArrival
            });

            currentTime = nextArrival;
            continue;
        }

        // En kısa CPU burst'e sahip process'i seç
        ready.sort((a, b) =>
            a.burst - b.burst ||
            a.arrival - b.arrival ||
            a.index - b.index
        );

        const p = ready[0];

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

        // Tamamlanan process'i listeden çıkar
        const position = remaining.findIndex(
            process => process.index === p.index
        );

        remaining.splice(position, 1);
    }

    return { gantt, results };
}
