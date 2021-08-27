function createCamera(scene){
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 30, 0), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3.Zero());

    // lock to player
    //camera.lockedTarget = sphere;

    return camera;
}

function createGround(scene) {
    //Creating new material out of texture ready for use for ground
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    var groundTexture = new BABYLON.Texture("textures/blackPebbels.jpg", scene);
    groundMaterial.diffuseTexture = groundTexture;
    groundMaterial.diffuseTexture.uScale = 3.0; //make texture smaller on object in x axis
    groundMaterial.diffuseTexture.vScale = 5.0; //make texture smaller on object in y acis

    //create ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 15, height: 25}, scene);
    //Add material/texture to ground
    ground.material = groundMaterial;
    
    return ground;
}

function createPlayer(scene, x, y, z, size){
    //create spritemanager
    var spriteManager = new BABYLON.SpriteManager("manager", "textures/buggy.png", 1, 412, scene);
    
    // create player
    var player = new BABYLON.Sprite("player", spriteManager);
    player.size = size;

    //positon player
    player.position = new BABYLON.Vector3(x, 0, z);
    player.angle = y;

    return player;
}

function movePlayer(player){
     //move the ball
     window.addEventListener("keydown", function(event){
        var key = event.keyCode;
        var diff = 0.1;
        var leftB = -7, backB = -12;
        var rightB = 7, frontB = 12;
        var floor = 1;

        if(key == 37) {
            player.angle = 1.571;
            if(player.position.x > leftB) {player.position.x -= diff;}
            else {player.position.x = rightB;};
        };
        if(key == 38){
            player.angle = 0;
            if(player.position.z < frontB) {player.position.z += diff;}
            else {player.position.z = backB;};
        };
        if(key == 39) {
            player.angle = 4.712;
            if(player.position.x < rightB) {player.position.x += diff;}
            else {player.position.x = leftB;};
        };
        if(key == 40) {
            player.angle = 3.142;
            if(player.position.z > backB) {player.position.z -= diff;}
            else {player.position.z = frontB;};
        };
        /* if(key == 8) {
            if(player.position.y > floor) {player.position.y -= diff}
        }
        if(key == 13) {player.position.y += diff}; */
    });
}

function movePlayerClick(player, scene) {
    window.addEventListener("click", function(event){
        var clickPos = scene.pick(event.clientX, event.clientY);
        if (clickPos.hit == true){
            var xDiff = clickPos.pickedPoint.x - player.position.x;
            var zDiff = clickPos.pickedPoint.z - player.position.z;
            var distance = Math.sqrt(xDiff*xDiff + zDiff*zDiff) * 10;
            var angle = Math.atan2(zDiff, xDiff);
            angle = angle - Math.PI/2;
            player.angle = angle;

            stepX = xDiff / distance;
            stepZ = zDiff / distance;

            slowMove(player, 10, stepX, stepZ, distance);
        }
        
    });
}

function slowMove(player, time, stepX, stepZ, distance){
    var timer = setInterval(function(){
        if(distance < 1){
            clearInterval(timer);
            return;
        }
        player.position.x += stepX;
        player.position.z += stepZ;
        distance--;
    }, time);
}

/* function setLimits(scene){
    // Back wall
    var wallB = BABYLON.MeshBuilder.CreatePlane("plane1", {width: 20, height: 100}, scene);
    wallB.position.z += 10;
    wallB.physicsImpostor = new BABYLON.PhysicsImpostor(wallB, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);
    wallB.isVisible = false;

    // Front wall
    var wallF = BABYLON.MeshBuilder.CreatePlane("plane2", {width: 20, height: 100}, scene);
    wallF.position.z -= 10;
    wallF.physicsImpostor = new BABYLON.PhysicsImpostor(wallF, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);
    wallF.isVisible = false;

    // Left wall
    var wallL = BABYLON.MeshBuilder.CreatePlane("plane4", {width: 20, height: 100}, scene);
    wallL.position.x -= 10;
    wallL.rotation.y = Math.PI/2;
    wallL.physicsImpostor = new BABYLON.PhysicsImpostor(wallL, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);
    wallL.isVisible = false;
    
    // Right wall
    var wallR = BABYLON.MeshBuilder.CreatePlane("plane4", {width:20, height: 100}, scene);
    wallR.position.x += 10;
    wallR.rotation.y = Math.PI/2;
    wallR.physicsImpostor = new BABYLON.PhysicsImpostor(wallR, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0}, scene);
    wallR.isVisible = false;

} */