
import './components/transformControls.js'
import './components/videoBox.js'
import './components/cameraPosition.js'

let doBase = 'https://wxr.nyc3.digitaloceanspaces.com/';
let valveNameList = ['00_handle', '02_cover', '03_seal',
    '04_ball', '05_bolt', '05_holder','05_nut', 'base'];
let valveIdList = ['handle', 'cover', 'seal',
    'ball', 'bolt', 'holder','nut', 'base'];

function initAScene(){
    let sceneEL = document.querySelector('a-scene');
    // document.body.appendChild( sceneEL );

    let cameraEl = document.querySelector('a-camera');
    cameraEl.setAttribute('rotation-reader', '');

    let ValueX = document.createElement('a-text');
    ValueX.setAttribute('position', '-.66 -0.4 -0.5');
    ValueX.setAttribute('color', 'red');
    ValueX.setAttribute('value', 'X: 20°');
    ValueX.setAttribute('scale', '0.1 0.1 0');

    let ValueY = document.createElement('a-text');
    ValueY.setAttribute('position', '-.6n -0.4 -0.5');
    ValueY.setAttribute("color", "red");
    ValueY.setAttribute("value", "Y: 20°");
    ValueY.setAttribute('scale', '0.1 0.1 0');

    cameraEl.appendChild(ValueX);
    cameraEl.appendChild(ValueY);

    // <a-text position="-2 0.5 1" color="red" value="X: 20°"></a-text>
    // <a-text position="-1.3 0.5 1" color="red" value="Y: 20°"></a-text>
    // setCamera();
    //createAssets();
    //createValve();
    createVideoBox();

    // testBox();
}


function testBox(){
    //     <a-box color="red" position="0 2 -5" rotation="0 45 45" scale="2 2 2"></a-box>
    let sceneEl = document.querySelector('a-scene');
    let boxEl = document.createElement('a-box');
    boxEl.setAttribute('position', '0 0 0');
    boxEl.setAttribute('rotation', '0 45 45');
    boxEl.setAttribute('scale', '2 2 2');
    boxEl.setAttribute('color', 'red');

    sceneEl.appendChild(boxEl);

}
function setCamera(){
    let sceneEL = document.querySelector('a-scene');
    let entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id', 'camera');
    entityEl.setAttribute('position', '0 0 5');
    entityEl.setAttribute('rotation', '0 0 0');


    let cameraEl = document.querySelector('a-camera');
    entityEl.appendChild( cameraEl );
    sceneEL.appendChild( entityEl );

}

function createAssets() {
    let sceneEL = document.querySelector('a-scene');
    let assetsEl = document.createElement('a-aseets');
    for(let name of valveNameList){
        let id = 'valve-' + name
        if(name.startsWith('0')){
            id = 'valve-' + name.substring(3);
        }
        let doPath = 'ar3dp/resources/models/valve_3d/';
        let exs = ['obj', 'mtl']
        for( let ex of exs){
            let assetItemEl = document.createElement('a-asset-item');
            assetItemEl.setAttribute('id', id+'-'+ex);
            assetItemEl.setAttribute('src',doBase+doPath+name+'.'+ex);
            assetItemEl.setAttribute('crossorigin', 'anonymous');
            assetsEl.appendChild( assetItemEl );
        }
        let assetItemEl = document.createElement('a-mixin');
        assetItemEl.setAttribute('id',id);
        assetItemEl.setAttribute('obj-model', 'obj: #'+id+'-obj; mtl: #'+id+'-mtl')
        assetsEl.appendChild( assetItemEl );
        sceneEL.appendChild( assetsEl );
    }
}

function createValve(){
    let sceneEL = document.querySelector('a-scene');
    let valveEl = document.createElement('a-entity');
    valveEl.setAttribute('id', 'valve');
    valveEl.setAttribute('scale', '10 10 10')

    for( let subid of valveIdList ){
        let id = 'valve-'+ subid;
        let entityEl = document.createElement('a-entity');
        entityEl.setAttribute('mixin',id);
        entityEl.setAttribute('transform-controls',{activated: false});

        valveEl.appendChild( entityEl );
    }
    sceneEL.appendChild( valveEl );
}

function createVideoBox(){
    let sceneEl = document.querySelector('a-scene');
    let videoEl = document.createElement('a-entity');
    videoEl.setAttribute('videobox', {color:'tomato', depth:0.01, height:3, width:4.02});
    videoEl.setAttribute('position', "0 2 -5")
    sceneEl.appendChild(videoEl);
    console.log("Added a video box element to scene")
}



initAScene();

/**
 *
 *  <a-entity mixin="red cube"></a-entity>
<a-asset-item id="avatar-obj" src="https://wxr.nyc3.digitaloceanspaces.com/huh/avatar.obj" crossorigin=”anonymous”></a-asset-item>
<a-asset-item id="avatar-mtl" src="https://wxr.nyc3.digitaloceanspaces.com/huh/avatar.mtl" crossorigin=”anonymous”></a-asset-item>
<a-mixin id ="avatar" avatar obj-model="obj: #avatar-obj; mtl: #avatar-mtl" rotation="0 90 0" scale="0.7 0.7 0.7"></a-mixin>
 *
 * */

