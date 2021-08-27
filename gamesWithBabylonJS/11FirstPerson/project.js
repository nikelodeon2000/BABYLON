function createFirstPerson(x, y, z, speed, scene){
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(x,y, z), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    //change distance the camera moves when pressing arrows
    camera.speed = speed;

    //change the ellipsoid that surrounds the camera
    camera.ellipsois = new BABYLON.Vector3(0.5,1,0.5);

    //apply gravity to camera
    camera.applyGravity = true;

    //cameras should check collisions
    camera.checkCollisions = true;



    // lock to player
    //camera.lockedTarget = sphere;

    return camera;
}

function createGround(scene) {
    //Creating new material out of texture ready for use for ground
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    var groundTexture = new BABYLON.Texture("textures/blackPebbels.jpg", scene);
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.diffuseTexture.uScale = 50.0; //make texture smaller on object in x axis
    groundMaterial.diffuseTexture.vScale = 50.0; //make texture smaller on object in y acis

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);

    //Add material/texture to ground
    ground.material = groundMaterial;
    
    //Add physical atiributes to ground
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);

    // ground should check collisions
    ground.checkCollisions = true;
    
    return ground;
}

function createPlayer(scene, x, y, z){
    //Creating new material out of texture ready for use for sphere
    var sphereMaterial = new BABYLON.StandardMaterial("sphere", scene); // creates material
    var sphereTexture = new BABYLON.Texture("textures/lava.jpg", scene); // creates texure
    sphereMaterial.diffuseTexture = sphereTexture; //link texture to material
    //sphereMaterial.alpha = 0.8; // change opacity of sphere

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 64}, scene);

    // Add material/texture to sphere
    sphere.material = sphereMaterial;


    // Move the sphere upward 1/2 its height
    sphere.position.y = y;
    sphere.position.x = x;
    sphere.position.z = z;


    // add physical attributes to sphere
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1, restitution: 2}, scene);

    return sphere;
}

function moveSphere(sphere){
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
}

function setLimit(scene, width, height, depth, x, yRotation, z){
    //wall texture
    var wallMaterial = new BABYLON.StandardMaterial("wall", scene);
    var wallTexture = new BABYLON.Texture("textures/bricks.png", scene);
    wallMaterial.diffuseTexture = wallTexture;
    wallMaterial.diffuseTexture.uScale = 20.0;
    wallMaterial.diffuseTexture.vScale = 5.0;

    //create wall
    var wall = BABYLON.MeshBuilder.CreateBox("wall", {width: width, height: height, depth: depth}, scene);
    wall.position.x = x;
    wall.position.z = z
    wall.rotation.y = yRotation;
    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);
    wall.material = wallMaterial;
    
    wall.checkCollisions = true;
    return wall;
}