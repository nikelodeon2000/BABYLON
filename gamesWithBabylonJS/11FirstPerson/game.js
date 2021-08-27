
    var canvas = document.getElementById("renderCanvas");
    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

    var createScene = function () {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates a light, aimiFng 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        //Add physics engine to program and set gravitation
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());

        // enable collisions for scene
        scene.collisionsEnabled = true;

        var ground = createGround(scene);

        var northLimit = setLimit(scene, 100, 25, 3, 0, 0, 50,);
        var southLimit = setLimit(scene, 100, 25, 3, 0, 0, -50);
        var eastLimit = setLimit(scene, 100, 25, 3, -50, 1.571, 0);
        var westLimit = setLimit(scene, 100, 25, 3, 50, 1.571, 0);

        var camera = createFirstPerson(0,2,0,0.25,scene);

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