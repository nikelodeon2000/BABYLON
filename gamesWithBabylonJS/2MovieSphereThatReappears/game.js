
    var canvas = document.getElementById("renderCanvas");

    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
    var createScene = function () {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -20), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'box' shape instead of sphere
        var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);

        // Move the box upward 1 its height
        box.position.y = 1;

        //var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
        //box.position.y = 1;

        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 12, height: 12}, scene);

        //move the ball and make it reappear if out of bound + movement up and down
        window.addEventListener("keydown", function(event){
            var key = event.keyCode;
            var diff = 0.1;
            var leftB = -5, backB = -5;
            var rightB = 5, frontB = 5;
            var floor = 1;

            console.log(box.position.x);

            if(key == 37) {
                if(box.position.x > leftB) {box.position.x -= diff;}
                else {box.position.x = rightB;};
            };
            if(key == 38) {
                if(box.position.z < frontB) {box.position.z += diff;}
                else {box.position.z = backB;};
            };
            if(key == 39) {
                if(box.position.x < rightB) {box.position.x += diff;}
                else {box.position.x = leftB;};
            };
            if(key == 40) {
                if(box.position.z > backB) {box.position.z -= diff;}
                else {box.position.z = frontB;};
            };
            if(key == 8) {
                if(box.position.y > floor) {box.position.y -= diff}
            }
            if(key == 13) {box.position.y += diff};
        });

        return scene;
    };
    window.initFunction = async function() {               
        var asyncEngineCreation = async function() {
            try {
                return createDefaultEngine();
            } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
            }
        }

        window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        window.scene = createScene();
    };
    initFunction().then(() => {
        sceneToRender = scene        
        engine.runRenderLoop(function () {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });


    //37 left, 38 up, 39 right, 40 down