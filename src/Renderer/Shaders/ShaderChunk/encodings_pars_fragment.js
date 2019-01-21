//This file is automatically rebuilt by the Speed3DGis build process.
class encodings_pars_fragment{static theWord() {
    return "// For a discussion of what this is, please read this: http://lousodrome.net/blog/light/2013/05/26/gamma-correct-and-hdr-rendering-in-a-32-bits-buffer/\n\
\n\
vec4 LinearToLinear( in vec4 value ) {\n\
	return value;\n\
}\n\
\n\
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {\n\
	return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );\n\
}\n\
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {\n\
	return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );\n\
}\n\
\n\
vec4 sRGBToLinear( in vec4 value ) {\n\
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );\n\
}\n\
vec4 LinearTosRGB( in vec4 value ) {\n\
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );\n\
}\n\
\n\
vec4 RGBEToLinear( in vec4 value ) {\n\
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );\n\
}\n\
vec4 LinearToRGBE( in vec4 value ) {\n\
	float maxComponent = max( max( value.r, value.g ), value.b );\n\
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );\n\
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );\n\
//  return vec4( value.brg, ( 3.0 + 128.0 ) / 256.0 );\n\
}\n\
\n\
// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html\n\
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {\n\
	return vec4( value.xyz * value.w * maxRange, 1.0 );\n\
}\n\
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {\n\
	float maxRGB = max( value.x, max( value.g, value.b ) );\n\
	float M      = clamp( maxRGB / maxRange, 0.0, 1.0 );\n\
	M            = ceil( M * 255.0 ) / 255.0;\n\
	return vec4( value.rgb / ( M * maxRange ), M );\n\
}\n\
\n\
// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html\n\
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {\n\
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );\n\
}\n\
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {\n\
	float maxRGB = max( value.x, max( value.g, value.b ) );\n\
	float D      = max( maxRange / maxRGB, 1.0 );\n\
	D            = min( floor( D ) / 255.0, 1.0 );\n\
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );\n\
}\n\
\n\
// LogLuv reference: http://graphicrants.blogspot.ca/2009/04/rgbm-color-encoding.html\n\
\n\
// M matrix, for encoding\n\
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );\n\
vec4 LinearToLogLuv( in vec4 value )  {\n\
	vec3 Xp_Y_XYZp = value.rgb * cLogLuvM;\n\
	Xp_Y_XYZp = max(Xp_Y_XYZp, vec3(1e-6, 1e-6, 1e-6));\n\
	vec4 vResult;\n\
	vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;\n\
	float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;\n\
	vResult.w = fract(Le);\n\
	vResult.z = (Le - (floor(vResult.w*255.0))/255.0)/255.0;\n\
	return vResult;\n\
}\n\
\n\
// Inverse M matrix, for decoding\n\
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );\n\
vec4 LogLuvToLinear( in vec4 value ) {\n\
	float Le = value.z * 255.0 + value.w;\n\
	vec3 Xp_Y_XYZp;\n\
	Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n\
	Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;\n\
	Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;\n\
	vec3 vRGB = Xp_Y_XYZp.rgb * cLogLuvInverseM;\n\
	return vec4( max(vRGB, 0.0), 1.0 );\n\
}\n\
";
}} export {encodings_pars_fragment};