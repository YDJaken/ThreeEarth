//This file is automatically rebuilt by the Speed3DGis build process.
class lights_lambert_vertex{static theWord() {
    return "vec3 diffuse = vec3( 1.0 );\n\
\n\
GeometricContext geometry;\n\
geometry.position = mvPosition.xyz;\n\
geometry.normal = normalize( transformedNormal );\n\
geometry.viewDir = normalize( -mvPosition.xyz );\n\
\n\
GeometricContext backGeometry;\n\
backGeometry.position = geometry.position;\n\
backGeometry.normal = -geometry.normal;\n\
backGeometry.viewDir = geometry.viewDir;\n\
\n\
vLightFront = vec3( 0.0 );\n\
\n\
#ifdef DOUBLE_SIDED\n\
	vLightBack = vec3( 0.0 );\n\
#endif\n\
\n\
IncidentLight directLight;\n\
float dotNL;\n\
vec3 directLightColor_Diffuse;\n\
\n\
#if NUM_POINT_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\
\n\
		getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );\n\
\n\
		dotNL = dot( geometry.normal, directLight.direction );\n\
		directLightColor_Diffuse = PI * directLight.color;\n\
\n\
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\
\n\
		#ifdef DOUBLE_SIDED\n\
\n\
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\
\n\
		#endif\n\
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
		getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );\n\
\n\
		dotNL = dot( geometry.normal, directLight.direction );\n\
		directLightColor_Diffuse = PI * directLight.color;\n\
\n\
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\
\n\
		#ifdef DOUBLE_SIDED\n\
\n\
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\
\n\
		#endif\n\
	}\n\
\n\
#endif\n\
\n\
/*\n\
#if NUM_RECT_AREA_LIGHTS > 0\n\
\n\
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\
\n\
		// TODO (abelnation): implement\n\
\n\
	}\n\
\n\
#endif\n\
*/\n\
\n\
#if NUM_DIR_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\
\n\
		getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );\n\
\n\
		dotNL = dot( geometry.normal, directLight.direction );\n\
		directLightColor_Diffuse = PI * directLight.color;\n\
\n\
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;\n\
\n\
		#ifdef DOUBLE_SIDED\n\
\n\
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;\n\
\n\
		#endif\n\
\n\
	}\n\
\n\
#endif\n\
\n\
#if NUM_HEMI_LIGHTS > 0\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\
\n\
		vLightFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );\n\
\n\
		#ifdef DOUBLE_SIDED\n\
\n\
			vLightBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );\n\
\n\
		#endif\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {lights_lambert_vertex};