// global start var
var start = true;
var killed = false;

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

function createPlayer(scene, x, y, z, size, txt){
    //create spritemanager
    var spriteManager = new BABYLON.SpriteManager("manager", "textures/"+txt, 2, 512, scene);
    
    // create player
    var player = new BABYLON.Sprite("player", spriteManager);
    player.size = size;

    /* //make sprite pickable
    spriteManager.isPickable = true;
    player.isPickable = true; */

    //positon player
    player.position = new BABYLON.Vector3(x, 0, z);
    player.angle = y;

    player["killed"] = false; //TRY

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
    var dirX = 1;
    var dirZ = 1;
    for(i=0; i<PlayerMAX; i++){
        if(player[i].killed == false){//TRY //IF ONLY ONE IS KILLED KILLLED IS SET TO TRUE
            dirX = Math.round(Math.random());
            dirZ = Math.round(Math.random());
    
            if(dirX == 0){dirX = -1};
            if(dirZ == 0){dirZ = -1};

            slowMove(player[i], 20, dirX, dirZ);
        }
        
    }
    
}

function slowMove(player, time, dirX, dirZ){
    var leftB = -7, backB = -12;
    var rightB = 7, frontB = 12;

    var timer = setInterval(function(){
        if(player.killed == true){  //TRY //IF ONE GETS KILLED THIS FORCES ALL OTHER TO BREAK AS WELL
            clearInterval(timer);
            return;
        }
        if(player.position.x < leftB || player.position.x > rightB){dirX = -dirX;}
        if(player.position.z < backB || player.position.z > frontB){dirZ = -dirZ;}
        player.position.x += (dirX/10);
        player.position.z += (dirZ/10);
        player.angle = Math.atan2(dirZ, dirX) - Math.PI/2;
    }, time);
}

function hitPlayer (player, scene){
    window.addEventListener("click", function(event){
        var pickResult = scene.pick(event.clientX, event.clientY);
        
        for(i=0; i<PlayerMAX; i++){
            if(pickField(pickResult.pickedPoint, player[i].position, 2) == true){
                player[i].cellIndex = 1;
                player[i].killed = true; //TRY //CHANGES IT FOR ALL SPIDERS
            }
        }
    });
}

function pickField(point, pos, diff){
    if((point.x > pos.x - diff) && (point.x < pos.x + diff) && (point.z > pos.z - diff) && (point.z < pos.z + diff)){
        return true;
    }
    else{return false;}
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


//Create an array and check only stop the one that died
//add an attribute to the player thats called killed and check that