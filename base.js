/* base.js - tinywasm javascript loader
 * Author: spacehen (Dylan Muller)
 */
// Use UintXArray for read/write to memory.
// Use array view to set VM memory.

function initRoutines(exports) {
    let env = exports.env;

    // Pass by reference.
    // Argument always contains index to VM memory.
    env._foo = function (num) {

        const array = new Int32Array(env.memory.buffer, num, 2);

        const foo = array[0].toString(10);
        const bar = array[1].toString(10);

        console.log("Hello World, from Javascript!");
        console.log(`foo = ${foo}`);
        console.log(`bar = ${bar}`);

        // Allocate 2 * Int32 cells.
        const addr = env.malloc(4 * 2);
        // Setup array view.
        let data = new Int32Array(env.memory.buffer, addr, 2);

        console.log("object.foo = 1");
        console.log("object.bar = 2");
        // Write memory to VM.
        data.set([1, 2], 0);

        // Return mem ptr
        return addr;

    }

    // Simple (SP) increment.
    env.malloc = function (bytes) {
        let sp = env.STACKTOP;
        env.STACKTOP += bytes;
        return sp;
    }
    // Stack operations.
    env.stackSave = function () {
        return env.STACKTOP;
    }
    env.stackRestore = function (stackTop) {
        env.STACKTOP = stackTop;
    }
    // General print routine.
    env._print = function (ptr, size) {
        let array = new Uint8Array(env.memory.buffer, ptr, size);
        let string = '';

        for (let i = 0; i < size; i++) {
            string += String.fromCharCode(array[i]);
        }
        console.log(string);
    }

}

(async () => {

    let imports = {};
    imports.env = {};

    // Reserve bytes for malloc
    imports.env.RES_B = 1024;
    // Set max stack size
    imports.env.STACK_MAX = imports.env.RES_B;
    // 64KiB VM
    imports.env.memory = new WebAssembly.Memory({ initial: 1 });
    imports.env.table = new WebAssembly.Table({ initial: 1, element: 'anyfunc' });
    // Initialize stack pointer.
    imports.env.__stack_pointer = new WebAssembly.Global({value: 'i32', mutable: true},
                                                         imports.env.STACK_MAX);

    // Start growing stack from 0x00000000
    imports.env.STACKTOP = 0;
    imports.env.DYNAMICTOP_PTR = 0;

    // Set memory base.
    imports.env.__memory_base = imports.env.RES_B;
    // Set table base.
    imports.env.__table_base = 0;

    // Initialize javascript routines
    // callable from C.
    initRoutines(imports);

    // Fetch image.
    let response = await fetch('base.wasm');
    let buffer = await response.arrayBuffer();

    // Compile bytecode.
    let module = await WebAssembly.compile(buffer);

    // Instantiate VM.
    let vm = new WebAssembly.Instance(module, imports);


    // Initialize main function.
    vm.exports.main();

})();
