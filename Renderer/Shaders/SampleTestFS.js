//This file is automatically rebuilt by the Speed3DGis build process.
class SampleTestFS{static theWord() {
    return "uniform sampler2D uni[SAMPLE];\n\
void main() {\n\
    gl_FragColor += texture2D(uni[SAMPLE-1], vec2(0));\n\
}";
}} export {SampleTestFS};