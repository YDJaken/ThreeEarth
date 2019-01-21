//This file is automatically rebuilt by the Speed3DGis build process.
class bsdfs{static theWord() {
    return "float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n\
\n\
	if( decayExponent > 0.0 ) {\n\
\n\
#if defined ( PHYSICALLY_CORRECT_LIGHTS )\n\
\n\
		// based upon Frostbite 3 Moving to Physically-based Rendering\n\
		// page 32, equation 26: E[window1]\n\
		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\n\
		// this is intended to be used on spot and point lights who are represented as luminous intensity\n\
		// but who must be converted to luminous irradiance for surface lighting calculation\n\
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\
		float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\
		return distanceFalloff * maxDistanceCutoffFactor;\n\
\n\
#else\n\
\n\
		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\
\n\
#endif\n\
\n\
	}\n\
\n\
	return 1.0;\n\
\n\
}\n\
\n\
vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n\
\n\
	return RECIPROCAL_PI * diffuseColor;\n\
\n\
} // validated\n\
\n\
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n\
\n\
	// Original approximation by Christophe Schlick '94\n\
	// float fresnel = pow( 1.0 - dotLH, 5.0 );\n\
\n\
	// Optimized variant (presented by Epic at SIGGRAPH '13)\n\
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf\n\
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n\
\n\
	return ( 1.0 - specularColor ) * fresnel + specularColor;\n\
\n\
} // validated\n\
\n\
// Microfacet Models for Refraction through Rough Surfaces - equation (34)\n\
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n\
// alpha is \"roughness squared\" in Disney’s reparameterization\n\
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n\
\n\
	// geometry term (normalized) = G(l)⋅G(v) / 4(n⋅l)(n⋅v)\n\
	// also see #12151\n\
\n\
	float a2 = pow2( alpha );\n\
\n\
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\
\n\
	return 1.0 / ( gl * gv );\n\
\n\
} // validated\n\
\n\
// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2\n\
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\n\
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\
\n\
	float a2 = pow2( alpha );\n\
\n\
	// dotNL and dotNV are explicitly swapped. This is not a mistake.\n\
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\
\n\
	return 0.5 / max( gv + gl, EPSILON );\n\
\n\
}\n\
\n\
// Microfacet Models for Refraction through Rough Surfaces - equation (33)\n\
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n\
// alpha is \"roughness squared\" in Disney’s reparameterization\n\
float D_GGX( const in float alpha, const in float dotNH ) {\n\
\n\
	float a2 = pow2( alpha );\n\
\n\
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\n\
\n\
	return RECIPROCAL_PI * a2 / pow2( denom );\n\
\n\
}\n\
\n\
// GGX Distribution, Schlick Fresnel, GGX-Smith Visibility\n\
vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\
\n\
	float alpha = pow2( roughness ); // UE4's roughness\n\
\n\
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\
\n\
	float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n\
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\
	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n\
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\
\n\
	vec3 F = F_Schlick( specularColor, dotLH );\n\
\n\
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\
\n\
	float D = D_GGX( alpha, dotNH );\n\
\n\
	return F * ( G * D );\n\
\n\
} // validated\n\
\n\
// Rect Area Light\n\
\n\
// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines\n\
// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt\n\
// code: https://github.com/selfshadow/ltc_code/\n\
\n\
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n\
\n\
	const float LUT_SIZE  = 64.0;\n\
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\
	const float LUT_BIAS  = 0.5 / LUT_SIZE;\n\
\n\
	float dotNV = saturate( dot( N, V ) );\n\
\n\
	// texture parameterized by sqrt( GGX alpha ) and sqrt( 1 - cos( theta ) )\n\
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n\
\n\
	uv = uv * LUT_SCALE + LUT_BIAS;\n\
\n\
	return uv;\n\
\n\
}\n\
\n\
float LTC_ClippedSphereFormFactor( const in vec3 f ) {\n\
\n\
	// Real-Time Area Lighting: a Journey from Research to Production (p.102)\n\
	// An approximation of the form factor of a horizon-clipped rectangle.\n\
\n\
	float l = length( f );\n\
\n\
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n\
\n\
}\n\
\n\
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n\
\n\
	float x = dot( v1, v2 );\n\
\n\
	float y = abs( x );\n\
\n\
	// rational polynomial approximation to theta / sin( theta ) / 2PI\n\
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n\
	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n\
	float v = a / b;\n\
\n\
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n\
\n\
	return cross( v1, v2 ) * theta_sintheta;\n\
\n\
}\n\
\n\
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n\
\n\
	// bail if point is on back side of plane of light\n\
	// assumes ccw winding order of light vertices\n\
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n\
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n\
	vec3 lightNormal = cross( v1, v2 );\n\
\n\
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n\
\n\
	// construct orthonormal basis around N\n\
	vec3 T1, T2;\n\
	T1 = normalize( V - N * dot( V, N ) );\n\
	T2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system\n\
\n\
	// compute transform\n\
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n\
\n\
	// transform rect\n\
	vec3 coords[ 4 ];\n\
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n\
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n\
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n\
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n\
\n\
	// project rect onto sphere\n\
	coords[ 0 ] = normalize( coords[ 0 ] );\n\
	coords[ 1 ] = normalize( coords[ 1 ] );\n\
	coords[ 2 ] = normalize( coords[ 2 ] );\n\
	coords[ 3 ] = normalize( coords[ 3 ] );\n\
\n\
	// calculate vector form factor\n\
	vec3 vectorFormFactor = vec3( 0.0 );\n\
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n\
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n\
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n\
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n\
\n\
	// adjust for horizon clipping\n\
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n\
\n\
/*\n\
	// alternate method of adjusting for horizon clipping (see referece)\n\
	// refactoring required\n\
	float len = length( vectorFormFactor );\n\
	float z = vectorFormFactor.z / len;\n\
\n\
	const float LUT_SIZE  = 64.0;\n\
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\
	const float LUT_BIAS  = 0.5 / LUT_SIZE;\n\
\n\
	// tabulated horizon-clipped sphere, apparently...\n\
	vec2 uv = vec2( z * 0.5 + 0.5, len );\n\
	uv = uv * LUT_SCALE + LUT_BIAS;\n\
\n\
	float scale = texture2D( ltc_2, uv ).w;\n\
\n\
	float result = len * scale;\n\
*/\n\
\n\
	return vec3( result );\n\
\n\
}\n\
\n\
// End Rect Area Light\n\
\n\
// ref: https://www.unrealengine.com/blog/physically-based-shading-on-mobile - environmentBRDF for GGX on mobile\n\
vec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n\
\n\
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\
\n\
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\
\n\
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\
\n\
	vec4 r = roughness * c0 + c1;\n\
\n\
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\
\n\
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n\
\n\
	return specularColor * AB.x + AB.y;\n\
\n\
} // validated\n\
\n\
\n\
float G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {\n\
\n\
	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\n\
	return 0.25;\n\
\n\
}\n\
\n\
float D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\
\n\
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n\
\n\
}\n\
\n\
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n\
\n\
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n\
\n\
	//float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n\
	//float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\
	float dotNH = saturate( dot( geometry.normal, halfDir ) );\n\
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n\
\n\
	vec3 F = F_Schlick( specularColor, dotLH );\n\
\n\
	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\
\n\
	float D = D_BlinnPhong( shininess, dotNH );\n\
\n\
	return F * ( G * D );\n\
\n\
} // validated\n\
\n\
// source: http://simonstechblog.blogspot.ca/2011/12/microfacet-brdf.html\n\
float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n\
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n\
}\n\
\n\
float BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n\
	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n\
}\n\
";
}} export {bsdfs};