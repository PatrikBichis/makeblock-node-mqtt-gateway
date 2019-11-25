console.log("Adding videobox component")

AFRAME.registerComponent('videobox', {
    schema: {
        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        depth: { type: 'number', default: 1 },
        color: { type: 'color', default: '#AAA' }
    },

    init: function () {
        var data = this.data;
        var el = this.el;

        this.loader = new THREE.TextureLoader();

        this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
        this.material = new THREE.MeshPhongMaterial({
            map: this.getImage()
        });
        this.material.needsUpdate = true;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        el.setObject3D('mesh', this.mesh);

        console.log("Is initing")
    },

    tick: function (time, timeDelta) {
        this.mesh.material.map.img = this.getImage();
        this.mesh.material.map.needsUpdate = true;
    },

    getImage: function() {
        return this.loader.load("/stream1");
    }
});