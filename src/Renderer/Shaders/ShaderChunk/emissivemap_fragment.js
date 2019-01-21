//This file is automatically rebuilt by the Speed3DGis build process.
class emissivemap_fragment{static theWord() {
    return "#ifdef USE_EMISSIVEMAP\n\
\n\
	vec4 emissiveColor = texture2D( emissiveMap, vUv );\n\
\n\
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\
\n\
	totalEmissiveRadiance *= emissiveColor.rgb;\n\
\n\
#endif\n\
";
}} export {emissivemap_fragment};