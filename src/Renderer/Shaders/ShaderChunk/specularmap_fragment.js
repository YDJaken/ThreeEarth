//This file is automatically rebuilt by the Speed3DGis build process.
class specularmap_fragment{static theWord() {
    return "float specularStrength;\n\
\n\
#ifdef USE_SPECULARMAP\n\
\n\
	vec4 texelSpecular = texture2D( specularMap, vUv );\n\
	specularStrength = texelSpecular.r;\n\
\n\
#else\n\
\n\
	specularStrength = 1.0;\n\
\n\
#endif";
}} export {specularmap_fragment};