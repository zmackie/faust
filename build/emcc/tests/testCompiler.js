var options = "-I libraries/";
var errCode = "foo";
var effectCode = "process = _,_;";

//----------------------------------------------------------------------------
// Misc. functions
//----------------------------------------------------------------------------
function misc(faust, log, code) {
    let exp = faust.expandDSP("test", code, options);
    let msg = exp.error ? exp.error : exp.dsp + " sha " + exp.shakey;
    log("  expandDSP             " + msg);

    let aux = faust.generateAuxFiles("test", code, options + " -lang wast/wasm");
    msg = aux.success ? "done" : aux.error;
    log("  generateAuxFiles      " + msg);
}

//----------------------------------------------------------------------------
// create dsp factory and instance 
//----------------------------------------------------------------------------
async function createDsp(faust, log, code) {
    log("createDSPFactory: ");
    let factory = await faust.createDSPFactory("test", code, options, false);
    log("factory JSON: " + factory.json);
    log("factory poly: " + factory.poly);

    log("createDSPInstance: ");
    let instance = await faust.createDSPInstance(factory);
    log("  getNumInputs : " + instance.api.getNumInputs());
    log("  getNumOutputs: " + instance.api.getNumOutputs());
    log("  JSON: " + instance.json);
}

async function createPolyDsp(faust, log, voice_code, effect_code) {
    log("createDSPFactory for voice: ");
    let voice_factory = await faust.createDSPFactory("voice", voice_code, options, true);
    log("voice factory JSON: " + voice_factory.json);
    log("voice factory poly: " + voice_factory.poly);

    log("createDSPFactory for effect: ");
    let effect_factory = await faust.createDSPFactory("effect", effect_code, options, true);
    log("effect factory JSON: " + effect_factory.json);
    log("effect factory poly: " + effect_factory.poly);

    const mixer_file = await fetch("mixer32.wasm");
    const mixer_buffer = await mixer_file.arrayBuffer();
    const mixer_module = await WebAssembly.compile(mixer_buffer);

    log("createPolyDSPInstance: ");
    let poly_instance = await faust.createPolyDSPInstance(voice_factory, mixer_module, 8, effect_factory);
    log("  voice_api getNumInputs : " + poly_instance.voice_api.getNumInputs());
    log("  voice_api getNumOutputs: " + poly_instance.voice_api.getNumOutputs());
    log("  JSON: " + poly_instance.voice_json);
    log("  effect_api getNumInputs : " + poly_instance.effect_api.getNumInputs());
    log("  effect_api getNumOutputs: " + poly_instance.effect_api.getNumOutputs());
    log("  JSON: " + poly_instance.effect_json);
}

var TestSVG1svg;
var TestSVG2svg;
//----------------------------------------------------------------------------
// Test svg diagrams
//----------------------------------------------------------------------------
function svgdiagrams(faust, log, code) {
    filter = "import(\"stdfaust.lib\");\nprocess = dm.oscrs_demo;";

    let svg1 = new Faust.SVGDiagrams(faust, "TestSVG1", code, options)
    if (!svg1.success()) {
        log(svg1.error());
    }
    else {
        log("success");
        let div1 = document.getElementById("svg1");
        div1.innerHTML = svg1.getSVG();
        TestSVG1svg = (path) => { div1.innerHTML = svg1.getSVG(path); }
    }

    let svg2 = new Faust.SVGDiagrams(faust, "TestSVG2", filter, options)
    if (!svg2.success()) {
        log(svg2.error());
    }
    else {
        log("success");
        let div2 = document.getElementById("svg2");
        div2.innerHTML = svg2.getSVG();
        TestSVG2svg = (path) => { div2.innerHTML = svg2.getSVG(path); }
    }
}

//----------------------------------------------------------------------------
// Main entry point
//----------------------------------------------------------------------------
async function run(engine, log, code, context) {

    let faust = new Faust.Compiler(engine);
    log("libfaust version: " + faust.version());

    const effect_str = 'process = *(hslider("Left", 0.5, 0, 1, 0.01)), *(hslider("Right", 0.5, 0, 1, 0.01));'

    /*
    log("\n-----------------\nMisc tests" + faust.version());
    misc(faust, log, code);
    log("\n-----------------\nMisc tests with error code");
    misc(faust, log, errCode);

    log("\n-----------------\nCreating DSP instance:");
    await createDsp(faust, log, code);

    // log("\n-----------------\nCreating Poly DSP instance:");
    // await createPolyDsp(faust, log, code, effectCode);

    log("\n-----------------\nCreating DSP instance with error code:");
    await createDsp(faust, log, errCode).catch(e => { log(e); });

    log("\n-----------------\nTest SVG diagrams: ");
    svgdiagrams(engine, log, code);
    */

    // Test nodes

    // Created with libfaust.js

    /*
    let factory = await faust.createDSPFactory("test", code, options, false);
    console.log(factory);
    console.log(context);
    let fwan = new Faust.AudioNodeFactory();
    */
    /*
    // Testing SP mode
    let node = await fwan.createMonoNode(context, "test", factory, true, 512);
    console.log(node);
    console.log(node.getParams());
    console.log(node.getJSON());
    node.setParamValue("/test/freq", 300);
    node.connect(context.destination);
    */

    /*
    // Testing Worklet mode
    let node1 = await fwan.createMonoNode(context, "mydsp1", factory, false);
    console.log(node1);
    console.log(node1.getParams());
    console.log(node1.getJSON());
    node1.setParamValue("/test/freq", 700);
    node1.connect(context.destination);
    */

    /*
    let node2 = await fwan.createMonoNode(context, "mydsp2", factory, false);
    console.log(node2);
    console.log(node2.getParams());
    console.log(node2.getJSON());
    node2.setParamValue("/test/freq", 200);
    node2.connect(context.destination);
    */

    /*
    // Polyphonic factory
    let factory = await faust.createDSPFactory("test", code, options, true);
    console.log(factory);
    console.log(context);
     */

    let fwan = new Faust.AudioNodeFactory();
    const mixer_file = await fetch("mixer32.wasm");
    const mixer_buffer = await mixer_file.arrayBuffer();
    const mixer_module = await WebAssembly.compile(mixer_buffer);


    /*
    // Testing polyphonic SP mode
    let node3 = await fwan.createPolyNode(context, "mydsp2", factory, mixer_module, 8, true, 512);
    console.log(node3);
    console.log(node3.getParams());
    console.log(node3.getJSON());
    //node3.setParamValue("/test/freq", 600);
    node3.connect(context.destination);
    node3.keyOn(0, 60, 50);
    //node3.keyOn(0, 64, 50);
    node3.keyOn(0, 67, 50);
    //node3.keyOn(0, 71, 50);
    //node3.keyOn(0, 76, 50);
    */


    /*
    // Testing polyphonic Worklet mode
    let node3 = await fwan.createPolyNode(context, "mydsp2", factory, mixer_module, 8, false);
    console.log(node3);
    console.log(node3.getParams());
    console.log(node3.getJSON());
    //node3.setParamValue("/test/freq", 600);
    node3.connect(context.destination);
    node3.keyOn(0, 60, 50);
    node3.keyOn(0, 64, 50);
    node3.keyOn(0, 67, 50);
    node3.keyOn(0, 71, 50);
    node3.keyOn(0, 76, 50);
    */

    /*
    // Testing polyphonic Worklet mode
    let node4 = await fwan.createPolyNode(context, "mydsp3", factory, mixer_module, 16, false);
    console.log(node4);
    console.log(node4.getParams());
    console.log(node4.getJSON());
    //node4.setParamValue("/test/freq", 600);
    node4.connect(context.destination);
    node4.keyOn(0, 70, 50);
    node4.keyOn(0, 74, 50);
    node4.keyOn(0, 77, 50);
    node4.keyOn(0, 81, 50);
    //node3.keyOn(0, 76, 50);
    */

    // Testing polyphonic SP mode
    console.log(faust);
    let node5 = await fwan.compilePolyNode(context, "mydsp2", faust, code, options, 8, true, 512);
    console.log(node5);
    console.log(node5.getParams());
    console.log(node5.getJSON());
    //node5.setParamValue("/test/freq", 600);
    node5.connect(context.destination);
    node5.keyOn(0, 60, 50);
    //node5.keyOn(0, 64, 50);
    node5.keyOn(0, 67, 50);
    //node5.keyOn(0, 71, 50);
    //node5.keyOn(0, 76, 50);


    /*
    // Testing polyphonic Worklet mode
    console.log(faust);
    let node6 = await fwan.compilePolyNode(context, "mydsp2", faust, code, options, 8, false);
    console.log(node6);
    console.log(node6.getParams());
    console.log(node6.getJSON());
    //node6.setParamValue("/test/freq", 600);
    node6.connect(context.destination);
    node6.keyOn(0, 60, 50);
    //node6.keyOn(0, 64, 50);
    node6.keyOn(0, 67, 50);
    node6.keyOn(0, 71, 50);
    //node6.keyOn(0, 76, 50);
    */

    /*
    // Created from a wasm file
    const dspFile = await fetch("noise.wasm");
    const jsonFile = await fetch("noise.js");
    const json = await jsonFile.text();
    const dspBuffer = await dspFile.arrayBuffer();
    const dspModule = await WebAssembly.compile(dspBuffer);
    const factory = new Faust.Factory(dspModule, json, false);

    //const factory = faust.loadDSPFactory("noise.wasm", "noise.js");

    let fwan = new Faust.AudioNodeFactory();
    let node = await fwan.createMonoNode(context, "test", factory, true, 512);
    console.log(node);
    console.log(node.getParams());
    console.log(node.getJSON());
    node.setParamValue("/Noise/Volume", 0.1);
    node.connect(context.destination);
    */

    log("\nEnd of API tests");
}

if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
    module.exports = run;
}