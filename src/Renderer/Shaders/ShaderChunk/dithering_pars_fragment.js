//This file is automatically rebuilt by the Speed3DGis build process.
class dithering_pars_fragment{static theWord() {
    return "#if defined( DITHERING )\n\
\n\
	// based on https://www.shadertoy.com/view/MslGR8\n\
	vec3 dithering( vec3 color ) {\n\
		//Calculate grid position\n\
		float grid_position = rand( gl_FragCoord.xy );\n\
\n\
		//Shift the individual colors differently, thus making it even harder to see the dithering pattern\n\
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\
\n\
		//modify shift acording to grid position.\n\
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\
\n\
		//shift the color by dither_shift\n\
		return color + dither_shift_RGB;\n\
	}\n\
\n\
#endif\n\
";
}} export {dithering_pars_fragment};