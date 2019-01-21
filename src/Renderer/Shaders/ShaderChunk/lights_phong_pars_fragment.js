//This file is automatically rebuilt by the Speed3DGis build process.
class lights_phong_pars_fragment{static theWord() {
    return "varying vec3 vViewPosition;\n\
\n\
#ifndef FLAT_SHADED\n\
\n\
	varying vec3 vNormal;\n\
\n\
#endif\n\
\n\
\n\
struct BlinnPhongMaterial {\n\
\n\
	vec3	diffuseColor;\n\
	vec3	specularColor;\n\
	float	specularShininess;\n\
	float	specularStrength;\n\
\n\
};\n\
\n\
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\
\n\
	#ifdef TOON\n\
\n\
		vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;\n\
\n\
	#else\n\
\n\
		float dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\
		vec3 irradiance = dotNL * directLight.color;\n\
\n\
	#endif\n\
\n\
	#ifndef PHYSICALLY_CORRECT_LIGHTS\n\
\n\
		irradiance *= PI; // punctual light\n\
\n\
	#endif\n\
\n\
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\
\n\
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;\n\
\n\
}\n\
\n\
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\
\n\
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );\n\
\n\
}\n\
\n\
#define RE_Direct				RE_Direct_BlinnPhong\n\
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong\n\
\n\
#define Material_LightProbeLOD( material )	(0)\n\
";
}} export {lights_phong_pars_fragment};