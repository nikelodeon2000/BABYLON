function createFirstPerson(x, y, z, speed, scene){
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(x,y, z), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(1,0,0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    //change distance the camera moves when pressing arrows
    camera.speed = speed;

    //change the ellipsoid that surrounds the camera
    camera.ellipsois = new BABYLON.Vector3(0.2,1,0.2);

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

/* function createTerrain(scene){
    var terrain = BABYLON.MeshBuilder.CreateGroundFromHeightMap("terrain", , {width:250, height: 250}, scene);
} */

function createObstacle(scene, x, z, txt, type){
    //Creating obstacle material/texture
    var obstacleMaterial = new BABYLON.StandardMaterial("obstacle", scene); // creates material
    var obstacleTexture = new BABYLON.Texture("textures/"+txt, scene); // creates texure
    obstacleMaterial.diffuseTexture = obstacleTexture; //link texture to material

    // create different obstacle
    var size;
    if(type == 1){
        size = Math.random()*4+4;
        var obstacle = BABYLON.MeshBuilder.CreateSphere("obstacleS", {diameter: size, segments: 64}, scene);
    }
    if(type == 2){
        size = Math.random()*20;
        var obstacle = BABYLON.MeshBuilder.CreateBox("obstacleB", {height: size, width: size/3, depth: size/3}, scene);
    }
    if(type == 3){
        size = Math.random()*20
        var obstacle = BABYLON.MeshBuilder.CreateCylinder("obstacleC", {height: size, diameterTop: Math.random()*4, diameterBottom: Math.random()*4+4}, scene);
    }

    // Add material/texture to obstacle
    obstacle.material = obstacleMaterial;

    //position obstacle
    obstacle.position = new BABYLON.Vector3(x, size/2, z);

    // add physical attributes to sphere
    obstacle.physicsImpostor = new BABYLON.PhysicsImpostor(obstacle, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1}, scene);
    obstacle.checkCollisions = true;

    return obstacle;
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