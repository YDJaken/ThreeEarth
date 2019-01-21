//This file is automatically rebuilt by the Speed3DGis build process.
class clipping_planes_fragment{static theWord() {
    return "#if NUM_CLIPPING_PLANES > 0\n\
\n\
	vec4 plane;\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\
\n\
		plane = clippingPlanes[ i ];\n\
		if ( dot( vViewPosition, plane.xyz ) > plane.w ) discard;\n\
\n\
	}\n\
\n\
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\
\n\
		bool clipped = true;\n\
\n\
		#pragma unroll_loop\n\
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\
\n\
			plane = clippingPlanes[ i ];\n\
			clipped = ( dot( vViewPosition, plane.xyz ) > plane.w ) && clipped;\n\
\n\
		}\n\
\n\
		if ( clipped ) discard;\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {clipping_planes_fragment};