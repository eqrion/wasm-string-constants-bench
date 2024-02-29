function average(x) {
  let sum = 0;
  for (let e of x) {
    sum += e;
  }
  return sum / x.length;
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

{
  let times = [];
  for (let i = 0; i < 20; i++) {
    times.push(runTest(array));
  }
  print(`array = ${average(times)}`);
}

{
  let times = [];
  for (let i = 0; i < 20; i++) {
    times.push(runTest(import_global));
  }
  print(`import_global = ${average(times)}`);
}

{
  let times = [];
  for (let i = 0; i < 20; i++) {
    times.push(runTest(data_segment));
  }
  print(`data_segment = ${average(times)}`);
}
