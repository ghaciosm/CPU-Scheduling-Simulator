
import { fcfs } from './algorithms/fcfs.js';
import { sjf } from './algorithms/sjf.js';
import { srtf } from './algorithms/srtf.js';
import { rr } from './algorithms/rr.js';

// Run with: node verify.js
// Five invariants are checked independently for every scheduling result.

const workloads = {
  'Workload A': [['P1', 0, 8], ['P2', 1, 4], ['P3', 2, 2], ['P4', 4, 1]],
  'Workload B': [['P1', 2, 3], ['P2', 2, 1], ['P3', 8, 2], ['P4', 9, 1]],
  'CPU idle': [['P1', 3, 2], ['P2', 7, 3], ['P3', 12, 2]],
  'Simultaneous arrivals': [['P1', 0, 4], ['P2', 0, 2], ['P3', 0, 2], ['P4', 1, 1]],
  'SRTF preemption': [['P1', 0, 10], ['P2', 2, 3], ['P3', 4, 1]],
  'SJF arrival tie': [['P1', 3, 2], ['P2', 2, 2], ['P3', 0, 5]],
  'RR boundary': [['P1', 0, 4], ['P2', 2, 1]],
  'RR counterexample': [['P1', 0, 4], ['P2', 0, 4]],
};

const toProcesses = rows =>
  rows.map(([id, arrival, burst]) => ({ id, arrival, burst }));

const algorithms = {
  FCFS: fcfs,
  SJF: sjf,
  SRTF: srtf,
  'RR q=2': ps => rr(ps, 2),
};

const checks = [
  'Burst',
  'Arrival',
  'Single CPU',
  'Nonnegative WT/RT',
  'No idle while ready',
];

function verify(processes, output) {
  const { gantt, results } = output;

  const byId = new Map(processes.map(p => [p.id, p]));
  const executed = new Map(processes.map(p => [p.id, 0]));
  const resultById = new Map(results.map(r => [r.id, r]));

  const failures = new Set();

  const check = (condition, property) => {
    if (!condition) failures.add(property);
  };

  check(
    results.length === processes.length &&
    resultById.size === processes.length,
    'Burst'
  );

  let previousEnd = 0;

  for (const segment of gantt) {
    const { id, start, end } = segment;

    check(
      Number.isFinite(start) &&
      Number.isFinite(end) &&
      end > start &&
      start === previousEnd,
      'Single CPU'
    );

    if (id === 'IDLE') {
      // No ready process should exist during an idle interval.
      for (const p of processes) {
        const pending = (executed.get(p.id) ?? 0) < p.burst;

        check(
          !(pending && p.arrival < end),
          'No idle while ready'
        );
      }
    } else {
      const p = byId.get(id);

      check(
        Boolean(p) && start >= p.arrival,
        'Arrival'
      );

      if (p) {
        executed.set(
          id,
          executed.get(id) + end - start
        );
      }
    }

    previousEnd = end;
  }

  for (const p of processes) {
    const r = resultById.get(p.id);

    check(
      executed.get(p.id) === p.burst,
      'Burst'
    );

    if (!r) {
      failures.add('Burst');
      continue;
    }

    check(r.start >= p.arrival, 'Arrival');

    check(
      r.waiting >= 0 && r.response >= 0,
      'Nonnegative WT/RT'
    );

    check(
      r.completion - p.arrival === r.turnaround &&
      r.turnaround - p.burst === r.waiting &&
      r.start - p.arrival === r.response,
      'Nonnegative WT/RT'
    );
  }

  return failures;
}

const rows = [];
let failed = false;

for (const [workloadName, input] of Object.entries(workloads)) {
  for (const [name, algorithm] of Object.entries(algorithms)) {
    const processes = toProcesses(input);
    const output = algorithm(processes);

    const failures = verify(processes, output);

    rows.push({
      Workload: workloadName,
      Algorithm: name,
      ...Object.fromEntries(
        checks.map(k => [
          k,
          failures.has(k) ? 'FAIL' : 'PASS'
        ])
      ),
    });

    if (failures.size) failed = true;

    // Additional check: SJF tie-breaking rule.
    if (workloadName === 'SJF arrival tie' && name === 'SJF') {
      if (output.gantt.map(g => g.id).join(',') !== 'P3,P2,P1') {
        console.error('FAIL: SJF arrival-time tie breaking');
        failed = true;
      }
    }

    // Additional check: RR quantum boundary.
    if (workloadName === 'RR boundary' && name === 'RR q=2') {
      const actual = output.gantt
        .map(g => `${g.id}:${g.start}-${g.end}`)
        .join(',');

      const expected = 'P1:0-2,P2:2-3,P1:3-5';

      if (actual !== expected) {
        console.error('FAIL: RR quantum-boundary queue order');
        failed = true;
      }
    }
  }
}

// Test the Round Robin counterexample with q = 1 and q = 4.
for (const quantum of [1, 4]) {
  const processes = toProcesses(workloads['RR counterexample']);
  const failures = verify(processes, rr(processes, quantum));

  rows.push({
    Workload: 'RR counterexample',
    Algorithm: `RR q=${quantum}`,
    ...Object.fromEntries(
      checks.map(k => [
        k,
        failures.has(k) ? 'FAIL' : 'PASS'
      ])
    ),
  });

  if (failures.size) failed = true;
}

console.table(rows);

console.log(
  `\n${rows.length} runs × ${checks.length} properties = ` +
  `${rows.length * checks.length} property checks.`
);

console.log(
  failed ? 'FAILED — review results.' : 'ALL CHECKS PASSED.'
);

if (failed) process.exitCode = 1;
