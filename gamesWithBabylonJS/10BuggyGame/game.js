
    var canvas = document.getElementById("renderCanvas");
    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

    
    const PlayerMAX = 10;

    var createScene = function () {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        createCamera(scene);

        // This creates a light, aimiFng 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
        // Change light reflectivity
        //light.specular = new BABYLON.Vector3(0,0,0);

        var ground = createGround(scene);

        var player = new Array(PlayerMAX);

        for(i = 0; i < PlayerMAX; i++){
            if(i % 2 == 0){
                player[i] = createPlayer(scene, (Math.random() * 14 - 7), 0, (Math.random() * 24 - 12), 2, "badBuggy.png");
            }
            else{
                player[i] = createPlayer(scene, (Math.random() * 14 - 7), 0, (Math.random() * 24 - 12), 2, "buggy.png");
            }
        }

        movePlayerClick(player, scene);
        hitPlayer(player, scene);

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