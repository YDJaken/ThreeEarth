//This file is automatically rebuilt by the Speed3DGis build process.
class premultiplied_alpha_fragment{static theWord() {
    return "#ifdef PREMULTIPLIED_ALPHA\n\
\n\
	// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.\n\
	gl_FragColor.rgb *= gl_FragColor.a;\n\
\n\
#endif\n\
";
}} export {premultiplied_alpha_fragment};