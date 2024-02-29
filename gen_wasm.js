function genStrings() {
  let strings = [];

  for (let i = 0; i < 1000; i++) {
    strings.push('' + i);
  }

  let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let a of letters) {
    for (let b of letters) {
      for (let c of letters) {
        strings.push(a + " " + b + " " + c);
      }
    }
  }
  strings.length = 100000;
  return strings;
}

let strings = genStrings();

// Print strings for copying into scripts
print(`${strings.length} strings. Needs to be copied into bench_array.js and bench_import_global.js`);
print(JSON.stringify(strings));

{
  // Import globals
  let text = `(module
    ${strings.map((x, i) => `(global (import "str" "${i}") externref)`).join("\n")}
  )`;
  let binary = wasmTextToBinary(text);
  os.file.writeTypedArrayToFile("import_global.wasm", binary);
}

{
  // Data segment
  let text = `(module
    (type $arrayMutI16 (array (mut i16)))

    (func $fromCharCodeArray
      (import "wasm:js-string" "fromCharCodeArray")
      (param (ref null $arrayMutI16) i32 i32)
      (result (ref extern))
    )

    ${strings.map((x, i) => `(global \$${i} (mut externref) ref.null extern)`).join("\n")}

    (func (export "init")
      ${strings.map((x, i) => `(global.set \$${i} (call $fromCharCodeArray (array.new_data \$arrayMutI16 \$d${i} i32.const 0 i32.const ${x.length}) i32.const 0 i32.const ${x.length}))`).join("\n")}
    )

    ${strings.map((x, i) => `(data \$d${i} \"${Array(...x).map((c) => c + "\\00").join("")}\")`).join("\n")}
  )`;
  let binary = wasmTextToBinary(text);
  os.file.writeTypedArrayToFile("data_segment.wasm", binary);
}

{
  // Import array
  let binary = wasmTextToBinary(`(module
    (type $strings (array externref))
    (global (import "" "strings") (ref $strings))
  )`);
  os.file.writeTypedArrayToFile("array.wasm", binary);
}
