//This file is automatically rebuilt by the Speed3DGis build process.
class common{static theWord() {
    return "#define PI 3.14159265359\n\
#define PI2 6.28318530718\n\
#define PI_HALF 1.5707963267949\n\
#define RECIPROCAL_PI 0.31830988618\n\
#define RECIPROCAL_PI2 0.15915494\n\
#define LOG2 1.442695\n\
#define EPSILON 1e-6\n\
\n\
#define saturate(a) clamp( a, 0.0, 1.0 )\n\
#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\
\n\
float pow2( const in float x ) { return x*x; }\n\
float pow3( const in float x ) { return x*x*x; }\n\
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }\n\
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\n\
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n\
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\n\
highp float rand( const in vec2 uv ) {\n\
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\
	return fract(sin(sn) * c);\n\
}\n\
\n\
struct IncidentLight {\n\
	vec3 color;\n\
	vec3 direction;\n\
	bool visible;\n\
};\n\
\n\
struct ReflectedLight {\n\
	vec3 directDiffuse;\n\
	vec3 directSpecular;\n\
	vec3 indirectDiffuse;\n\
	vec3 indirectSpecular;\n\
};\n\
\n\
struct GeometricContext {\n\
	vec3 position;\n\
	vec3 normal;\n\
	vec3 viewDir;\n\
};\n\
\n\
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\
\n\
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\
\n\
}\n\
\n\
// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\n\
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\
\n\
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\
\n\
}\n\
\n\
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\
\n\
	float distance = dot( planeNormal, point - pointOnPlane );\n\
\n\
	return - distance * planeNormal + point;\n\
\n\
}\n\
\n\
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\
\n\
	return sign( dot( point - pointOnPlane, planeNormal ) );\n\
\n\
}\n\
\n\
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\
\n\
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\
\n\
}\n\
\n\
mat3 transposeMat3( const in mat3 m ) {\n\
\n\
	mat3 tmp;\n\
\n\
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\
\n\
	return tmp;\n\
\n\
}\n\
\n\
// https://en.wikipedia.org/wiki/Relative_luminance\n\
float linearToRelativeLuminance( const in vec3 color ) {\n\
\n\
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\
\n\
	return dot( weights, color.rgb );\n\
\n\
}\n\
";
}} export {common};