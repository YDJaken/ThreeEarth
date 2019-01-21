//This file is automatically rebuilt by the Speed3DGis build process.
class normal_fragment_begin{static theWord() {
    return "#ifdef FLAT_SHADED\n\
\n\
	// Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\n\
\n\
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n\
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n\
	vec3 normal = normalize( cross( fdx, fdy ) );\n\
\n\
#else\n\
\n\
	vec3 normal = normalize( vNormal );\n\
\n\
	#ifdef DOUBLE_SIDED\n\
\n\
		normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {normal_fragment_begin};