//This file is automatically rebuilt by the Speed3DGis build process.
class shadowmap_pars_fragment{static theWord() {
    return "#ifdef USE_SHADOWMAP\n\
\n\
	#if NUM_DIR_LIGHTS > 0\n\
\n\
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n\
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\
\n\
	#endif\n\
\n\
	#if NUM_SPOT_LIGHTS > 0\n\
\n\
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n\
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\
\n\
	#endif\n\
\n\
	#if NUM_POINT_LIGHTS > 0\n\
\n\
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n\
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\
\n\
	#endif\n\
\n\
	/*\n\
	#if NUM_RECT_AREA_LIGHTS > 0\n\
\n\
		// TODO (abelnation): create uniforms for area light shadows\n\
\n\
	#endif\n\
	*/\n\
\n\
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\
\n\
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\
\n\
	}\n\
\n\
	float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\
\n\
		const vec2 offset = vec2( 0.0, 1.0 );\n\
\n\
		vec2 texelSize = vec2( 1.0 ) / size;\n\
		vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\
\n\
		float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n\
		float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n\
		float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n\
		float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\
\n\
		vec2 f = fract( uv * size + 0.5 );\n\
\n\
		float a = mix( lb, lt, f.y );\n\
		float b = mix( rb, rt, f.y );\n\
		float c = mix( a, b, f.x );\n\
\n\
		return c;\n\
\n\
	}\n\
\n\
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\
\n\
		float shadow = 1.0;\n\
\n\
		shadowCoord.xyz /= shadowCoord.w;\n\
		shadowCoord.z += shadowBias;\n\
\n\
		// if ( something && something ) breaks ATI OpenGL shader compiler\n\
		// if ( all( something, something ) ) using this instead\n\
\n\
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n\
		bool inFrustum = all( inFrustumVec );\n\
\n\
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\
\n\
		bool frustumTest = all( frustumTestVec );\n\
\n\
		if ( frustumTest ) {\n\
\n\
		#if defined( SHADOWMAP_TYPE_PCF )\n\
\n\
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\
\n\
			float dx0 = - texelSize.x * shadowRadius;\n\
			float dy0 = - texelSize.y * shadowRadius;\n\
			float dx1 = + texelSize.x * shadowRadius;\n\
			float dy1 = + texelSize.y * shadowRadius;\n\
\n\
			shadow = (\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\
			) * ( 1.0 / 9.0 );\n\
\n\
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\
\n\
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\
\n\
			float dx0 = - texelSize.x * shadowRadius;\n\
			float dy0 = - texelSize.y * shadowRadius;\n\
			float dx1 = + texelSize.x * shadowRadius;\n\
			float dy1 = + texelSize.y * shadowRadius;\n\
\n\
			shadow = (\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\
				texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\
			) * ( 1.0 / 9.0 );\n\
\n\
		#else // no percentage-closer filtering:\n\
\n\
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\
\n\
		#endif\n\
\n\
		}\n\
\n\
		return shadow;\n\
\n\
	}\n\
\n\
	// cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D\n\
	// vector suitable for 2D texture mapping. This code uses the following layout for the\n\
	// 2D texture:\n\
	//\n\
	// xzXZ\n\
	//  y Y\n\
	//\n\
	// Y - Positive y direction\n\
	// y - Negative y direction\n\
	// X - Positive x direction\n\
	// x - Negative x direction\n\
	// Z - Positive z direction\n\
	// z - Negative z direction\n\
	//\n\
	// Source and test bed:\n\
	// https://gist.github.com/tschw/da10c43c467ce8afd0c4\n\
\n\
	vec2 cubeToUV( vec3 v, float texelSizeY ) {\n\
\n\
		// Number of texels to avoid at the edge of each square\n\
\n\
		vec3 absV = abs( v );\n\
\n\
		// Intersect unit cube\n\
\n\
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\
		absV *= scaleToCube;\n\
\n\
		// Apply scale to avoid seams\n\
\n\
		// two texels less per square (one texel will do for NEAREST)\n\
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\
\n\
		// Unwrap\n\
\n\
		// space: -1 ... 1 range for each square\n\
		//\n\
		// #X##		dim    := ( 4 , 2 )\n\
		//  # #		center := ( 1 , 1 )\n\
\n\
		vec2 planar = v.xy;\n\
\n\
		float almostATexel = 1.5 * texelSizeY;\n\
		float almostOne = 1.0 - almostATexel;\n\
\n\
		if ( absV.z >= almostOne ) {\n\
\n\
			if ( v.z > 0.0 )\n\
				planar.x = 4.0 - v.x;\n\
\n\
		} else if ( absV.x >= almostOne ) {\n\
\n\
			float signX = sign( v.x );\n\
			planar.x = v.z * signX + 2.0 * signX;\n\
\n\
		} else if ( absV.y >= almostOne ) {\n\
\n\
			float signY = sign( v.y );\n\
			planar.x = v.x + 2.0 * signY + 2.0;\n\
			planar.y = v.z * signY - 2.0;\n\
\n\
		}\n\
\n\
		// Transform to UV space\n\
\n\
		// scale := 0.5 / dim\n\
		// translate := ( center + 0.5 ) / dim\n\
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\
\n\
	}\n\
\n\
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n\
\n\
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\
\n\
		// for point lights, the uniform @vShadowCoord is re-purposed to hold\n\
		// the vector from the light to the world-space position of the fragment.\n\
		vec3 lightToPosition = shadowCoord.xyz;\n\
\n\
		// dp = normalized distance from light to fragment position\n\
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?\n\
		dp += shadowBias;\n\
\n\
		// bd3D = base direction 3D\n\
		vec3 bd3D = normalize( lightToPosition );\n\
\n\
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\
\n\
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\
\n\
			return (\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\
			) * ( 1.0 / 9.0 );\n\
\n\
		#else // no percentage-closer filtering\n\
\n\
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\
\n\
		#endif\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {shadowmap_pars_fragment};