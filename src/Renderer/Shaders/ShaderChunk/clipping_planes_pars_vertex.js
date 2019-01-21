//This file is automatically rebuilt by the Speed3DGis build process.
class clipping_planes_pars_vertex{static theWord() {
    return "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\
	varying vec3 vViewPosition;\n\
#endif\n\
";
}} export {clipping_planes_pars_vertex};