
export function rr(processes, quantum) {
    const jobs = processes
        .map((p, index) => ({
            ...p,
            index,
            remaining: p.burst,
            start: null
        }))
        .sort((a, b) =>
            a.arrival - b.arrival || a.index - b.index
        );

    const readyQueue = [];
    const gantt = [];
    const results = [];

    let currentTime = 0;
    let nextIndex = 0;

    // O ana kadar gelen process'leri kuyruğa ekle
    function addArrivals() {
        while (
            nextIndex < jobs.length &&
            jobs[nextIndex].arrival <= currentTime
        ) {
            readyQueue.push(jobs[nextIndex]);
            nextIndex++;
        }
    }

    while (results.length < jobs.length) {
        addArrivals();

        // Kuyruk boşsa bir sonraki geliş zamanına ilerle
        if (readyQueue.length === 0) {
            const nextArrival = jobs[nextIndex].arrival;

            gantt.push({
                id: "IDLE",
                start: currentTime,
                end: nextArrival
            });

            currentTime = nextArrival;
            continue;
        }

        // FIFO: Kuyruğun başından process al
        const p = readyQueue.shift();

        if (p.start === null) {
            p.start = currentTime;
        }

        // En fazla quantum kadar çalıştır
        const duration = Math.min(quantum, p.remaining);

        const start = currentTime;
        currentTime += duration;
        p.remaining -= duration;

        gantt.push({
            id: p.id,
            start,
            end: currentTime
        });

        // Quantum bitişindeki arrivals önce eklenir
        addArrivals();

        if (p.remaining > 0) {
            // Process bitmediyse kuyruğun sonuna gönder
            readyQueue.push(p);
        } else {
            // Process tamamlandıysa metriklerini hesapla
            const completion = currentTime;
            const turnaround = completion - p.arrival;
            const waiting = turnaround - p.burst;
            const response = p.start - p.arrival;

            results.push({
                id: p.id,
                arrival: p.arrival,
                burst: p.burst,
                start: p.start,
                completion,
                turnaround,
                waiting,
                response
            });
        }
    }

    return { gantt, results };
}
