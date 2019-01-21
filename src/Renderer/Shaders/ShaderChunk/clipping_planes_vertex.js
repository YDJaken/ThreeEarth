//This file is automatically rebuilt by the Speed3DGis build process.
class clipping_planes_vertex{static theWord() {
    return "#if NUM_CLIPPING_PLANES > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n\
	vViewPosition = - mvPosition.xyz;\n\
#endif\n\
\n\
";
}} export {clipping_planes_vertex};