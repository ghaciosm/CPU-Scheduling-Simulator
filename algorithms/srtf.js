
export function srtf(processes) {
    const jobs = processes.map((p, index) => ({
        ...p,
        index,
        remaining: p.burst,
        start: null
    }));

    let currentTime = 0;
    let running = null;

    const gantt = [];
    const results = [];

    while (jobs.some(p => p.remaining > 0)) {

        // Gelmiş ve tamamlanmamış process'ler
        const ready = jobs.filter(p =>
            p.arrival <= currentTime && p.remaining > 0
        );

        // CPU'da çalışabilecek process yoksa
        if (ready.length === 0) {
            const nextArrival = Math.min(
                ...jobs
                    .filter(p => p.remaining > 0)
                    .map(p => p.arrival)
            );

            gantt.push({
                id: "IDLE",
                start: currentTime,
                end: nextArrival
            });

            currentTime = nextArrival;
            running = null;
            continue;
        }

        // Kalan süresi en kısa process
        ready.sort((a, b) =>
            a.remaining - b.remaining ||
            a.arrival - b.arrival ||
            a.index - b.index
        );

        const shortest = ready[0];

        // Eşitlikte çalışan process'i durdurma
        if (
            running === null ||
            !ready.includes(running) ||
            shortest.remaining < running.remaining
        ) {
            running = shortest;
        }

        // Process ilk kez CPU alıyorsa
        if (running.start === null) {
            running.start = currentTime;
        }

        // Gantt Chart'ta yeni bir aralık başlat
        const last = gantt[gantt.length - 1];

        if (
            last &&
            last.id === running.id &&
            last.end === currentTime
        ) {
            last.end = currentTime + 1;
        } else {
            gantt.push({
                id: running.id,
                start: currentTime,
                end: currentTime + 1
            });
        }

        // Process'i bir zaman birimi çalıştır
        running.remaining--;
        currentTime++;

        // Process tamamlandıysa
        if (running.remaining === 0) {
            const completion = currentTime;
            const turnaround = completion - running.arrival;
            const waiting = turnaround - running.burst;
            const response = running.start - running.arrival;

            results.push({
                id: running.id,
                arrival: running.arrival,
                burst: running.burst,
                start: running.start,
                completion,
                turnaround,
                waiting,
                response
            });

            running = null;
        }
    }

    return { gantt, results };
}
