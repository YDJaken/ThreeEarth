//This file is automatically rebuilt by the Speed3DGis build process.
class cube_uv_reflection_fragment{static theWord() {
    return "#ifdef ENVMAP_TYPE_CUBE_UV\n\
\n\
#define cubeUV_textureSize (1024.0)\n\
\n\
int getFaceFromDirection(vec3 direction) {\n\
	vec3 absDirection = abs(direction);\n\
	int face = -1;\n\
	if( absDirection.x > absDirection.z ) {\n\
		if(absDirection.x > absDirection.y )\n\
			face = direction.x > 0.0 ? 0 : 3;\n\
		else\n\
			face = direction.y > 0.0 ? 1 : 4;\n\
	}\n\
	else {\n\
		if(absDirection.z > absDirection.y )\n\
			face = direction.z > 0.0 ? 2 : 5;\n\
		else\n\
			face = direction.y > 0.0 ? 1 : 4;\n\
	}\n\
	return face;\n\
}\n\
#define cubeUV_maxLods1  (log2(cubeUV_textureSize*0.25) - 1.0)\n\
#define cubeUV_rangeClamp (exp2((6.0 - 1.0) * 2.0))\n\
\n\
vec2 MipLevelInfo( vec3 vec, float roughnessLevel, float roughness ) {\n\
	float scale = exp2(cubeUV_maxLods1 - roughnessLevel);\n\
	float dxRoughness = dFdx(roughness);\n\
	float dyRoughness = dFdy(roughness);\n\
	vec3 dx = dFdx( vec * scale * dxRoughness );\n\
	vec3 dy = dFdy( vec * scale * dyRoughness );\n\
	float d = max( dot( dx, dx ), dot( dy, dy ) );\n\
	// Clamp the value to the max mip level counts. hard coded to 6 mips\n\
	d = clamp(d, 1.0, cubeUV_rangeClamp);\n\
	float mipLevel = 0.5 * log2(d);\n\
	return vec2(floor(mipLevel), fract(mipLevel));\n\
}\n\
\n\
#define cubeUV_maxLods2 (log2(cubeUV_textureSize*0.25) - 2.0)\n\
#define cubeUV_rcpTextureSize (1.0 / cubeUV_textureSize)\n\
\n\
vec2 getCubeUV(vec3 direction, float roughnessLevel, float mipLevel) {\n\
	mipLevel = roughnessLevel > cubeUV_maxLods2 - 3.0 ? 0.0 : mipLevel;\n\
	float a = 16.0 * cubeUV_rcpTextureSize;\n\
\n\
	vec2 exp2_packed = exp2( vec2( roughnessLevel, mipLevel ) );\n\
	vec2 rcp_exp2_packed = vec2( 1.0 ) / exp2_packed;\n\
	// float powScale = exp2(roughnessLevel + mipLevel);\n\
	float powScale = exp2_packed.x * exp2_packed.y;\n\
	// float scale =  1.0 / exp2(roughnessLevel + 2.0 + mipLevel);\n\
	float scale = rcp_exp2_packed.x * rcp_exp2_packed.y * 0.25;\n\
	// float mipOffset = 0.75*(1.0 - 1.0/exp2(mipLevel))/exp2(roughnessLevel);\n\
	float mipOffset = 0.75*(1.0 - rcp_exp2_packed.y) * rcp_exp2_packed.x;\n\
\n\
	bool bRes = mipLevel == 0.0;\n\
	scale =  bRes && (scale < a) ? a : scale;\n\
\n\
	vec3 r;\n\
	vec2 offset;\n\
	int face = getFaceFromDirection(direction);\n\
\n\
	float rcpPowScale = 1.0 / powScale;\n\
\n\
	if( face == 0) {\n\
		r = vec3(direction.x, -direction.z, direction.y);\n\
		offset = vec2(0.0+mipOffset,0.75 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\
	}\n\
	else if( face == 1) {\n\
		r = vec3(direction.y, direction.x, direction.z);\n\
		offset = vec2(scale+mipOffset, 0.75 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\
	}\n\
	else if( face == 2) {\n\
		r = vec3(direction.z, direction.x, direction.y);\n\
		offset = vec2(2.0*scale+mipOffset, 0.75 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? a : offset.y;\n\
	}\n\
	else if( face == 3) {\n\
		r = vec3(direction.x, direction.z, direction.y);\n\
		offset = vec2(0.0+mipOffset,0.5 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\
	}\n\
	else if( face == 4) {\n\
		r = vec3(direction.y, direction.x, -direction.z);\n\
		offset = vec2(scale+mipOffset, 0.5 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\
	}\n\
	else {\n\
		r = vec3(direction.z, -direction.x, direction.y);\n\
		offset = vec2(2.0*scale+mipOffset, 0.5 * rcpPowScale);\n\
		offset.y = bRes && (offset.y < 2.0*a) ? 0.0 : offset.y;\n\
	}\n\
	r = normalize(r);\n\
	float texelOffset = 0.5 * cubeUV_rcpTextureSize;\n\
	vec2 s = ( r.yz / abs( r.x ) + vec2( 1.0 ) ) * 0.5;\n\
	vec2 base = offset + vec2( texelOffset );\n\
	return base + s * ( scale - 2.0 * texelOffset );\n\
}\n\
\n\
#define cubeUV_maxLods3 (log2(cubeUV_textureSize*0.25) - 3.0)\n\
\n\
vec4 textureCubeUV(vec3 reflectedDirection, float roughness ) {\n\
	float roughnessVal = roughness* cubeUV_maxLods3;\n\
	float r1 = floor(roughnessVal);\n\
	float r2 = r1 + 1.0;\n\
	float t = fract(roughnessVal);\n\
	vec2 mipInfo = MipLevelInfo(reflectedDirection, r1, roughness);\n\
	float s = mipInfo.y;\n\
	float level0 = mipInfo.x;\n\
	float level1 = level0 + 1.0;\n\
	level1 = level1 > 5.0 ? 5.0 : level1;\n\
\n\
	// round to nearest mipmap if we are not interpolating.\n\
	level0 += min( floor( s + 0.5 ), 5.0 );\n\
\n\
	// Tri linear interpolation.\n\
	vec2 uv_10 = getCubeUV(reflectedDirection, r1, level0);\n\
	vec4 color10 = envMapTexelToLinear(texture2D(envMap, uv_10));\n\
\n\
	vec2 uv_20 = getCubeUV(reflectedDirection, r2, level0);\n\
	vec4 color20 = envMapTexelToLinear(texture2D(envMap, uv_20));\n\
\n\
	vec4 result = mix(color10, color20, t);\n\
\n\
	return vec4(result.rgb, 1.0);\n\
}\n\
\n\
#endif\n\
";
}} export {cube_uv_reflection_fragment};