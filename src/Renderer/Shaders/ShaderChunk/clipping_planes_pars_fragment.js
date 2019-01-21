//This file is automatically rebuilt by the Speed3DGis build process.
class clipping_planes_pars_fragment{static theWord() {
    return "#if NUM_CLIPPING_PLANES > 0\n\
\n\
	#if ! defined( PHYSICAL ) && ! defined( PHONG )\n\
		varying vec3 vViewPosition;\n\
	#endif\n\
\n\
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n\
\n\
#endif\n\
";
}} export {clipping_planes_pars_fragment};