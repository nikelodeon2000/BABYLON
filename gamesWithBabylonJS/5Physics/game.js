
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

        //Add physics engine to program and set gravitation
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());

        //Creating new material out of texture ready for use for sphere
        var sphereMaterial = new BABYLON.StandardMaterial("sphere", scene); // creates material
        var sphereTexture = new BABYLON.Texture("textures/lava.jpg", scene); // creates texure
        sphereMaterial.diffuseTexture = sphereTexture; //link texture to material
        sphereMaterial.alpha = 0.8; // change opacity of sphere

        //Creating new material out of texture ready for use for ground
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        var groundTexture = new BABYLON.Texture("textures/blackPebbels.jpg", scene);
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.diffuseTexture.uScale = 3.0; //make texture smaller on object in x axis
        groundMaterial.diffuseTexture.vScale = 3.0; //make texture smaller on object in y acis

        // Our built-in 'sphere' shape.
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 64}, scene);

        // Add material/texture to sphere
        sphere.material = sphereMaterial;


        // Move the sphere upward 1/2 its height
        sphere.position.y = 10;

        // add physical attributes to sphere
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1}, scene);

        //var sphere = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
        //box.position.y = 1;

        // Our built-in 'ground' shape.
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 12, height: 12}, scene);

        //Add material/texture to ground
        ground.material = groundMaterial;

        //Add physical atiributes to ground
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);

        //move the ball
        window.addEventListener("keydown", function(event){
            var key = event.keyCode;
            var diff = 0.1;
            var impulse = BABYLON.Vector3.Zero();
            //var leftB = -5, backB = -5;
            //var rightB = 5, frontB = 5;
            //var floor = 1;

            if(key == 37) {
                impulse.x = -diff;
                /* if(sphere.position.x > leftB) {impulse.x = -diff;}
                else {sphere.position.x = rightB;}; */
            };
            if(key == 38) {
                impulse.z = diff;
                /* if(sphere.position.z < frontB) {sphere.position.z += diff;}
                else {sphere.position.z = backB;}; */
            };
            if(key == 39) {
                impulse.x = diff;
                /* if(sphere.position.x < rightB) {sphere.position.x += diff;}
                else {sphere.position.x = leftB;}; */
            };
            if(key == 40) {
                impulse.z = -diff;
                /* if(sphere.position.z > backB) {sphere.position.z -= diff;}
                else {sphere.position.z = frontB;}; */
            };
            /* if(key == 8) {
                if(sphere.position.y > floor) {sphere.position.y -= diff}
            }
            if(key == 13) {sphere.position.y += diff}; */
            sphere.applyImpulse(impulse, sphere.getAbsolutePosition())
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