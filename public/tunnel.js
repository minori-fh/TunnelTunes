let scene, camera, renderer, cube, cubicle;
let songName, artist, ID, imageUrl; 
let amountX = 50; 
let amountY = 50;
let numPoints = amountX * amountY; 
let separation = 100; 
let count = 0; 
let particles; 
let counter = 0.21

function init(){
    // Create scene
    scene = new THREE.Scene();
    // Create perspective camera (FOV, degress, aspect, near plane, far plane)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 10000);
    camera.position.z = 1000;  
    
    // Create points positioning and scale
    let positions = new Float32Array(numPoints * 3); //3 for x y z positioning
    let scales = new Float32Array(numPoints);

    let i = 0; 
    let j = 0; 

    for (let ix = 0; ix < amountX; ix++){
        for (let iy = 0; iy < amountY; iy++){
            positions[i] = (ix * separation) - ((amountX * separation)/2) //position x
            positions[i+1] = 0 //position y
            positions[i+2] = (iy * separation) - ((amountY * separation)/2) //position z

            scales[j] = 5; 

            i += 3;
            j ++;
        }
    }

    // Create geometry
    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3));
    geometry.addAttribute('scale', new THREE.BufferAttribute( scales, 1));

    // Create material
    let material = new THREE.ShaderMaterial( {
        uniforms: {
            color: { value: new THREE.Color( "#ffc0cb" ) },
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent
    } );

    // Create points with geometry and material
    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    // Create cube
    let cubeGeometry = new THREE.IcosahedronGeometry( 60, 0 );
    var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.z = Math.floor(Math.random() * 190) - 4000; //-4000 to 190
    cube.position.y = Math.floor(Math.random() * 1100) + 150; //150 to 1100
    cube.position.x = Math.floor(Math.random() * 5000) - 5000; //-5000 to 5000 
    // scene.add( cube );

    // Create a new cube every 2 seconds
    // setInterval(createCubes, 4000)

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight); //size of renderer
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild(renderer.domElement);
}

function createCubes(){
    console.log('hi')
    let moveSpeed = 4; 

    let cubicleGeo = new THREE.IcosahedronGeometry( 60, 0 );
    var cubicleMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cubicle = new THREE.Mesh( cubicleGeo, cubicleMaterial );
    cubicle.position.z = 190 //-4000 to 190
    cubicle.position.y = Math.floor(Math.random() * 1100) + 150; //150 to 1100
    cubicle.position.x = Math.floor(Math.random() * 10000) - 5000; //-5000 to 5000 
    scene.add( cubicle );

    direction = cubicle.getWorldDirection();

    animateCubes();
}

function animateCubes(){
    requestAnimationFrame( animateCubes );
    cubicle.position.z -= 40; 
}


function animate() {
    requestAnimationFrame( animate );
    camera.position.set(0, 200, 200)
    // Call wave function
    waves(counter);

    // Render scene and camera
    renderer.render( scene, camera )
}

function waves(number){
    let positions = particles.geometry.attributes.position.array;
    let scales = particles.geometry.attributes.scale.array;
    
    console.log("this is the new counter" + counter)
    let i = 0;
    let j = 0;

    for ( let ix = 0; ix < amountX; ix ++ ) {
        for ( let iy = 0; iy < amountY; iy ++ ) {
            // change y positioning
            positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 )) +
                            ( Math.sin( ( iy + count ) * 0.5 ) * 50);
            scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 5 +
                            ( Math.sin( ( iy + count ) * 0.5 ) + 1 )* 8;
            i += 3;
            j ++;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    renderer.render( scene, camera );
    count += number;
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); //size of renderer
}

window.addEventListener('resize', onWindowResize, false)

init();
animate(counter);

// SPOTIFY QUERY STARTS HERE //
let search = document.getElementById('search')

// event listener for when user clicks on search
search.addEventListener("click", function(){
    let ID = "";
    let songElement = document.getElementById('songName');
    let imageElement = document.getElementById('songImage');
    let searchTerms = document.querySelector('input').value
    let previewElement = document.getElementById('preview')
    let audioControl = document.querySelector('audio')
    let errMsg = document.getElementById('errorMsg')
    
    //clear html DOM 
    songElement.innerHTML = "";
    errMsg.innerHTML = "";
    document.getElementById('tempo').innerHTML = "";

    $.get("/" + searchTerms, function(data){

        songName = data.tracks.items[0].name;
        artist = data.tracks.items[0].album.artists[0].name;
        imageUrl =  data.tracks.items[0].album.images[0].url;
        ID = data.tracks.items[0].uri.slice(14)
        previewUrl = data.tracks.items[0].preview_url


        songElement.appendChild(document.createTextNode(songName + " by " + artist));
        imageElement.setAttribute('src', imageUrl);
        previewElement.setAttribute('src', previewUrl)

        // Load and play song after grabbing previewURL
        audioControl.load();
        audioControl.play();

        // EDGE CASE: spotify does not have a preview URL 
        if (previewUrl === null){
            errMsg.appendChild(document.createTextNode("Spotify does not have a preview for this song"))
        }

        getAudioAnalysis(ID);
    })
})

function getAudioAnalysis(ID){
    let tempoElement = document.getElementById('tempo');

    $.get("/audioAnalysis/" + ID, function(data){
        let tempo = data.track.tempo //tempo in BPM 
        let tempPS = tempo / 60 //tempo in BPS (beats per second)
        let finalCount = tempPS * 0.21

        counter = finalCount
        tempoElement.appendChild(document.createTextNode("Tempo: " + tempo + " BPM"));
        // let temporaryCount = 0.21

        // animate(finalCount)
    })
}