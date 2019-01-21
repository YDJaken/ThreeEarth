//This file is automatically rebuilt by the Speed3DGis build process.
class packing{static theWord() {
    return "vec3 packNormalToRGB( const in vec3 normal ) {\n\
	return normalize( normal ) * 0.5 + 0.5;\n\
}\n\
\n\
vec3 unpackRGBToNormal( const in vec3 rgb ) {\n\
	return 2.0 * rgb.xyz - 1.0;\n\
}\n\
\n\
const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\n\
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\
\n\
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\n\
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\
\n\
const float ShiftRight8 = 1. / 256.;\n\
\n\
vec4 packDepthToRGBA( const in float v ) {\n\
	vec4 r = vec4( fract( v * PackFactors ), v );\n\
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n\
	return r * PackUpscale;\n\
}\n\
\n\
float unpackRGBAToDepth( const in vec4 v ) {\n\
	return dot( v, UnpackFactors );\n\
}\n\
\n\
// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions\n\
\n\
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n\
	return ( viewZ + near ) / ( near - far );\n\
}\n\
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n\
	return linearClipZ * ( near - far ) - near;\n\
}\n\
\n\
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n\
	return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n\
}\n\
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n\
	return ( near * far ) / ( ( far - near ) * invClipZ - far );\n\
}\n\
";
}} export {packing};