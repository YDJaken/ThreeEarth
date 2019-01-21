//This file is automatically rebuilt by the Speed3DGis build process.
class normal_fragment_maps{static theWord() {
    return "#ifdef USE_NORMALMAP\n\
\n\
	#ifdef OBJECTSPACE_NORMALMAP\n\
\n\
		normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals\n\
\n\
		#ifdef FLIP_SIDED\n\
\n\
			normal = - normal;\n\
\n\
		#endif\n\
\n\
		#ifdef DOUBLE_SIDED\n\
\n\
			normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n\
\n\
		#endif\n\
\n\
		normal = normalize( normalMatrix * normal );\n\
\n\
	#else // tangent-space normal map\n\
\n\
		normal = perturbNormal2Arb( -vViewPosition, normal );\n\
\n\
	#endif\n\
\n\
#elif defined( USE_BUMPMAP )\n\
\n\
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\
\n\
#endif\n\
";
}} export {normal_fragment_maps};