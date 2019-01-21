//This file is automatically rebuilt by the Speed3DGis build process.
class shadowmap_vertex{static theWord() {
    return "#ifdef USE_SHADOWMAP\n\
\n\
	#if NUM_DIR_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\
\n\
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	#if NUM_SPOT_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\
\n\
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * worldPosition;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	#if NUM_POINT_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\
\n\
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * worldPosition;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	/*\n\
	#if NUM_RECT_AREA_LIGHTS > 0\n\
\n\
		// TODO (abelnation): update vAreaShadowCoord with area light info\n\
\n\
	#endif\n\
	*/\n\
\n\
#endif\n\
";
}} export {shadowmap_vertex};