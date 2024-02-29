let mod = new WebAssembly.Module(os.file.readRelativeToScript("string_section.wasm", "binary"));
let ins = new WebAssembly.Instance(mod);
