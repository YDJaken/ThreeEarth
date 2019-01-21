//This file is automatically rebuilt by the Speed3DGis build process.
class dithering_fragment{static theWord() {
    return "#if defined( DITHERING )\n\
\n\
  gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n\
\n\
#endif\n\
";
}} export {dithering_fragment};