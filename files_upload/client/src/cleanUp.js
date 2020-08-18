export default class CleanUp {

    constructor() {
        this.arrayOfObj = []
        // this.scene = null;
        // this.renderer = null;
        // this.controls = null;
    }

    // addScene(scene){
    //     this.scene = scene;
    //     return scene;
    // }
    // addRender(render){
    //     this.render = render;
    //     return render;
    // }


    // addObj(obj) {
    //     this.arrayOfObj.push(obj);
    //     return obj;
    // }

    getArrayOfObj () {
        return this.arrayOfObj;
    }

    resetArrayOfObj (){
        this.arrayOfObj = [];
    }

    cleanAllObj(renderer,scene,controls){
        // scene.traverse( ( mesh )=> {

        //     if ( mesh instanceof THREE.Mesh ) {
        //         mesh.material.dispose();
        //         mesh.geometry.dispose();
        //         scene.remove(mesh);
        //     }
        
        // } );

        // scene.dispose();
        // scene = null;

        // renderer.renderLists.dispose();
        // renderer.dispose();
        // renderer = null;
        // controls = null;
    }
  }

