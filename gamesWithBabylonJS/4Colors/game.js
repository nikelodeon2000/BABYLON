
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

        // This creates a light, aimiFng 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        //Creating new material out of color ready for use for sphere
        var sphereMaterial = new BABYLON.StandardMaterial("sphere", scene); // creates material
        sphereMaterial.diffuseColor = new BABYLON.Color3(1,0,0); //link color to material
        sphereMaterial.alpha = 0.7;

        //Creating new material out of color ready for use for ground
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0); //link ambient color to material

        // Our built-in 'sphere' shape.
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 64}, scene);

        // Add material/texture to sphere
        sphere.material = sphereMaterial;


        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;

        //var sphere = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
        //box.position.y = 1;

        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 12, height: 12}, scene);

        //Add material/texture to ground
        ground.material = groundMaterial;

        //move the ball
        window.addEventListener("keydown", function(event){
            var key = event.keyCode;
            var diff = 0.1;
            var leftB = -5, backB = -5;
            var rightB = 5, frontB = 5;
            var floor = 1;

            console.log(sphere.position.x);

            if(key == 37) {
                if(sphere.position.x > leftB) {sphere.position.x -= diff;}
                else {sphere.position.x = rightB;};
            };
            if(key == 38) {
                if(sphere.position.z < frontB) {sphere.position.z += diff;}
                else {sphere.position.z = backB;};
            };
            if(key == 39) {
                if(sphere.position.x < rightB) {sphere.position.x += diff;}
                else {sphere.position.x = leftB;};
            };
            if(key == 40) {
                if(sphere.position.z > backB) {sphere.position.z -= diff;}
                else {sphere.position.z = frontB;};
            };
            if(key == 8) {
                if(sphere.position.y > floor) {sphere.position.y -= diff}
            }
            if(key == 13) {sphere.position.y += diff};
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