//This file is automatically rebuilt by the Speed3DGis build process.
class map_fragment{static theWord() {
    return "#ifdef USE_MAP\n\
\n\
	vec4 texelColor = texture2D( map, vUv );\n\
\n\
	texelColor = mapTexelToLinear( texelColor );\n\
	diffuseColor *= texelColor;\n\
\n\
#endif\n\
";
}} export {map_fragment};