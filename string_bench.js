function average(x) {
  let sum = 0;
  for (let e of x) {
    sum += e;
  }
  return sum / x.length;
}

function variance(numbers) {
    // Calculate the mean
    const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

    // Calculate the squared differences from the mean
    const squaredDifferences = numbers.map(num => (num - mean) ** 2);

    // Calculate the variance
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / numbers.length;

    return variance;
}

function runTest(test) {
  let file = os.file.readRelativeToScript(test);
  let glob = newGlobal();
  gc();
  let start = performance.now();
  evaluate(file, {global: glob});
  let end = performance.now();
  return end - start;
}
let import_global = "bench_import_global.js";
let data_segment = "bench_data_segment.js";
let array = "bench_array.js";
let string_section = "bench_string_section.js";
let empty = "bench_empty.js";

const RUNS = 200;

{
  let times = [];
  for (let i = 0; i < RUNS; i++) {
    times.push(runTest(import_global));
  }
  print(`import_global = ${average(times)} (v = ${variance(times)})`);
}

{
  let times = [];
  for (let i = 0; i < RUNS; i++) {
    times.push(runTest(data_segment));
  }
  print(`data_segment = ${average(times)} (v = ${variance(times)})`);
}

{
  let times = [];
  for (let i = 0; i < RUNS; i++) {
    times.push(runTest(array));
  }
  print(`array = ${average(times)} (v = ${variance(times)})`);
}

{
  let times = [];
  for (let i = 0; i < RUNS; i++) {
    times.push(runTest(string_section));
  }
  print(`string_section = ${average(times)} (v = ${variance(times)})`);
}

{
  let times = [];
  for (let i = 0; i < RUNS; i++) {
    times.push(runTest(empty));
  }
  print(`empty = ${average(times)} (v = ${variance(times)})`);
}
