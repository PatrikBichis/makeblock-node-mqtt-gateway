import '../three/TransformControls.js'
/**
 * transform-controls
 */
AFRAME.registerComponent('transform-controls', {
    schema: {
        activated: {type: 'boolean', default: false},
    },

    init: function () {
        this.name = 'transform-controls';
        this.object = this.el.object3D;
        this.scene = this.el.sceneEl.object3D;

        // when user click this object
        this._click = AFRAME.utils.bind(this._click, this);
        this.el.addEventListener('click', this._click);

        // when user drag controls of object
        this.controls = new THREE.TransformControls( this.el.sceneEl.camera, this.el.sceneEl.renderer.domElement );
        this._change = AFRAME.utils.bind(this._change, this);
        this.controls.addEventListener('change', this._change);
    },

    update: function (oldData) {
        // tracking 'activated'
        if( oldData.activated !== this.data.activated){
            if( this.data.activated === true ){
                // console.log('start activation')
                let others = this.el.sceneEl.querySelectorAll('['+this.name+']');
                for( let other of others ){
                    if(other !== this.el){
                        other.setAttribute(this.name, { activated : false });
                    }
                }
                this.controls.attach( this.object );
                this.scene.add( this.controls );
            }else{ // deactivate
                this.controls.detach();
                this.scene.remove( this.controls );
            }
        }
    },

    remove: function () {
        this.controls.removeEventListener('change', this._change);
        this.el.removeEventListener('click', this._click);
    },

    _change : function(){
        let id = this.el.getAttribute('id');
        // sceneG.get(this.data.type+'s').get( id ).get('position').put( this.object.position );

    },

    _click : function(){
      // console.log('click');
      if( this.data.activated === false){
          this.el.setAttribute('transform-controls', {activated: true});
          // console.log('transform-controls activated');
      }
    },
});