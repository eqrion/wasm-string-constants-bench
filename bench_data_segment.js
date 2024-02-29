let mod = new WebAssembly.Module(os.file.readRelativeToScript("data_segment.wasm", "binary"), {builtins: ["js-string"]});
let {init} = new WebAssembly.Instance(mod, {}).exports;
init();
