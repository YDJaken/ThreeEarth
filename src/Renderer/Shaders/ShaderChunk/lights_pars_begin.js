//This file is automatically rebuilt by the Speed3DGis build process.
class lights_pars_begin{static theWord() {
    return "uniform vec3 ambientLightColor;\n\
\n\
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\
\n\
	vec3 irradiance = ambientLightColor;\n\
\n\
	#ifndef PHYSICALLY_CORRECT_LIGHTS\n\
\n\
		irradiance *= PI;\n\
\n\
	#endif\n\
\n\
	return irradiance;\n\
\n\
}\n\
\n\
#if NUM_DIR_LIGHTS > 0\n\
\n\
	struct DirectionalLight {\n\
		vec3 direction;\n\
		vec3 color;\n\
\n\
		int shadow;\n\
		float shadowBias;\n\
		float shadowRadius;\n\
		vec2 shadowMapSize;\n\
	};\n\
\n\
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\
\n\
	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\
\n\
		directLight.color = directionalLight.color;\n\
		directLight.direction = directionalLight.direction;\n\
		directLight.visible = true;\n\
\n\
	}\n\
\n\
#endif\n\
\n\
\n\
#if NUM_POINT_LIGHTS > 0\n\
\n\
	struct PointLight {\n\
		vec3 position;\n\
		vec3 color;\n\
		float distance;\n\
		float decay;\n\
\n\
		int shadow;\n\
		float shadowBias;\n\
		float shadowRadius;\n\
		vec2 shadowMapSize;\n\
		float shadowCameraNear;\n\
		float shadowCameraFar;\n\
	};\n\
\n\
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n\
\n\
	// directLight is an out parameter as having it as a return value caused compiler errors on some devices\n\
	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\
\n\
		vec3 lVector = pointLight.position - geometry.position;\n\
		directLight.direction = normalize( lVector );\n\
\n\
		float lightDistance = length( lVector );\n\
\n\
		directLight.color = pointLight.color;\n\
		directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n\
		directLight.visible = ( directLight.color != vec3( 0.0 ) );\n\
\n\
	}\n\
\n\
#endif\n\
\n\
\n\
#if NUM_SPOT_LIGHTS > 0\n\
\n\
	struct SpotLight {\n\
		vec3 position;\n\
		vec3 direction;\n\
		vec3 color;\n\
		float distance;\n\
		float decay;\n\
		float coneCos;\n\
		float penumbraCos;\n\
\n\
		int shadow;\n\
		float shadowBias;\n\
		float shadowRadius;\n\
		vec2 shadowMapSize;\n\
	};\n\
\n\
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n\
\n\
	// directLight is an out parameter as having it as a return value caused compiler errors on some devices\n\
	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n\
\n\
		vec3 lVector = spotLight.position - geometry.position;\n\
		directLight.direction = normalize( lVector );\n\
\n\
		float lightDistance = length( lVector );\n\
		float angleCos = dot( directLight.direction, spotLight.direction );\n\
\n\
		if ( angleCos > spotLight.coneCos ) {\n\
\n\
			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\
\n\
			directLight.color = spotLight.color;\n\
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n\
			directLight.visible = true;\n\
\n\
		} else {\n\
\n\
			directLight.color = vec3( 0.0 );\n\
			directLight.visible = false;\n\
\n\
		}\n\
	}\n\
\n\
#endif\n\
\n\
\n\
#if NUM_RECT_AREA_LIGHTS > 0\n\
\n\
	struct RectAreaLight {\n\
		vec3 color;\n\
		vec3 position;\n\
		vec3 halfWidth;\n\
		vec3 halfHeight;\n\
	};\n\
\n\
	// Pre-computed values of LinearTransformedCosine approximation of BRDF\n\
	// BRDF approximation Texture is 64x64\n\
	uniform sampler2D ltc_1; // RGBA Float\n\
	uniform sampler2D ltc_2; // RGBA Float\n\
\n\
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n\
\n\
#endif\n\
\n\
\n\
#if NUM_HEMI_LIGHTS > 0\n\
\n\
	struct HemisphereLight {\n\
		vec3 direction;\n\
		vec3 skyColor;\n\
		vec3 groundColor;\n\
	};\n\
\n\
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n\
\n\
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n\
\n\
		float dotNL = dot( geometry.normal, hemiLight.direction );\n\
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\
\n\
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\
\n\
		#ifndef PHYSICALLY_CORRECT_LIGHTS\n\
\n\
			irradiance *= PI;\n\
\n\
		#endif\n\
\n\
		return irradiance;\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {lights_pars_begin};