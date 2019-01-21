import { Interpolant } from "../Interpolant.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */


/*function DiscreteInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

	Interpolant.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

}

DiscreteInterpolant.prototype = Object.assign( Object.create( Interpolant.prototype ), {

	constructor: DiscreteInterpolant,

	interpolate_: function ( i1 /!*, t0, t, t1 *!/ ) {

		return this.copySampleValue_( i1 - 1 );

	}

} );*/


class DiscreteInterpolant extends Interpolant{
	constructor(parameterPositions, sampleValues, sampleSize, resultBuffer){
		super(parameterPositions, sampleValues, sampleSize, resultBuffer);
	}

    interpolate_(i1){
    return this.copySampleValue_( i1 - 1 );}
}

export { DiscreteInterpolant };
