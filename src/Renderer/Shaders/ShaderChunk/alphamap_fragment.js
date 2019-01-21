//This file is automatically rebuilt by the Speed3DGis build process.
class alphamap_fragment{static theWord() {
    return "#ifdef USE_ALPHAMAP\n\
\n\
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\
\n\
#endif\n\
";
}} export {alphamap_fragment};