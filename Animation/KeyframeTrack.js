import { StringKeyframeTrack } from './Tracks/StringKeyframeTrack.js';
import { BooleanKeyframeTrack } from './Tracks/BooleanKeyframeTrack.js';
import { QuaternionKeyframeTrack } from './Tracks/QuaternionKeyframeTrack.js';
import { ColorKeyframeTrack } from './Tracks/ColorKeyframeTrack.js';
import { VectorKeyframeTrack } from './Tracks/VectorKeyframeTrack.js';
import { NumberKeyframeTrack } from './Tracks/NumberKeyframeTrack.js';
import {
	InterpolateLinear,
	InterpolateSmooth,
	InterpolateDiscrete
} from '../src/Core/Constants.js';
import { CubicInterpolant } from '../src/Datum/Math/interpolants/CubicInterpolant.js';
import { LinearInterpolant } from '../src/Datum/Math/interpolants/LinearInterpolant.js';
import { DiscreteInterpolant } from '../src/Datum/Math/interpolants/DiscreteInterpolant.js';
import { AnimationUtils } from './AnimationUtils.js';

/**
 *
 * A timed sequence of keyframes for a specific property.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

function KeyframeTrack( name, times, values, interpolation ) {

	if ( name === undefined ) throw new Error( 'Speed3D.KeyframeTrack: track name is undefined' );
	if ( times === undefined || times.length === 0 ) throw new Error( 'Speed3D.KeyframeTrack: no keyframes in track named ' + name );

	this.name = name;

	this.times = AnimationUtils.convertArray( times, this.TimeBufferType );
	this.values = AnimationUtils.convertArray( values, this.ValueBufferType );

	this.setInterpolation( interpolation || this.DefaultInterpolation );

	this.validate();
	this.optimize();

}

// Static methods:

Object.assign( KeyframeTrack, {

	// Serialization (in static context, because of constructor invocation
	// and automatic invocation of .toJSON):

	parse: function ( json ) {

		if ( json.type === undefined ) {

			throw new Error( 'Speed3D.KeyframeTrack: track type undefined, can not parse' );

		}

		var trackType = KeyframeTrack._getTrackTypeForValueTypeName( json.type );

		if ( json.times === undefined ) {

			var times = [], values = [];

			AnimationUtils.flattenJSON( json.keys, times, values, 'value' );

			json.times = times;
			json.values = values;

		}

		// derived classes can define a static parse method
		if ( trackType.parse !== undefined ) {

			return trackType.parse( json );

		} else {

			// by default, we assume a constructor compatible with the base
			return new trackType( json.name, json.times, json.values, json.interpolation );

		}

	},

	toJSON: function ( track ) {

		var trackType = track.constructor;

		var json;

		// derived classes can define a static toJSON method
		if ( trackType.toJSON !== undefined ) {

			json = trackType.toJSON( track );

		} else {

			// by default, we assume the data can be serialized as-is
			json = {

				'name': track.name,
				'times': AnimationUtils.convertArray( track.times, Array ),
				'values': AnimationUtils.convertArray( track.values, Array )

			};

			var interpolation = track.getInterpolation();

			if ( interpolation !== track.DefaultInterpolation ) {

				json.interpolation = interpolation;

			}

		}

		json.type = track.ValueTypeName; // mandatory

		return json;

	},

	_getTrackTypeForValueTypeName: function ( typeName ) {

		switch ( typeName.toLowerCase() ) {

			case 'scalar':
			case 'double':
			case 'float':
			case 'number':
			case 'integer':

				return NumberKeyframeTrack;

			case 'vector':
			case 'vector2':
			case 'vector3':
			case 'vector4':

				return VectorKeyframeTrack;

			case 'color':

				return ColorKeyframeTrack;

			case 'quaternion':

				return QuaternionKeyframeTrack;

			case 'bool':
			case 'boolean':

				return BooleanKeyframeTrack;

			case 'string':

				return StringKeyframeTrack;

		}

		throw new Error( 'Speed3D.KeyframeTrack: Unsupported typeName: ' + typeName );

	}

} );

Object.assign( KeyframeTrack.prototype, {

	constructor: KeyframeTrack,

	TimeBufferType: Float32Array,

	ValueBufferType: Float32Array,

	DefaultInterpolation: InterpolateLinear,

	InterpolantFactoryMethodDiscrete: function ( result ) {

		return new DiscreteInterpolant( this.times, this.values, this.getValueSize(), result );

	},

	InterpolantFactoryMethodLinear: function ( result ) {

		return new LinearInterpolant( this.times, this.values, this.getValueSize(), result );

	},

	InterpolantFactoryMethodSmooth: function ( result ) {

		return new CubicInterpolant( this.times, this.values, this.getValueSize(), result );

	},

	setInterpolation: function ( interpolation ) {

		var factoryMethod;

		switch ( interpolation ) {

			case InterpolateDiscrete:

				factoryMethod = this.InterpolantFactoryMethodDiscrete;

				break;

			case InterpolateLinear:

				factoryMethod = this.InterpolantFactoryMethodLinear;

				break;

			case InterpolateSmooth:

				factoryMethod = this.InterpolantFactoryMethodSmooth;

				break;

		}

		if ( factoryMethod === undefined ) {

			var message = "unsupported interpolation for " +
				this.ValueTypeName + " keyframe track named " + this.name;

			if ( this.createInterpolant === undefined ) {

				// fall back to default, unless the default itself is messed up
				if ( interpolation !== this.DefaultInterpolation ) {

					this.setInterpolation( this.DefaultInterpolation );

				} else {

					throw new Error( message ); // fatal, in this case

				}

			}

			console.warn( 'Speed3D.KeyframeTrack:', message );
			return;

		}

		this.createInterpolant = factoryMethod;

	},

	getInterpolation: function () {

		switch ( this.createInterpolant ) {

			case this.InterpolantFactoryMethodDiscrete:

				return InterpolateDiscrete;

			case this.InterpolantFactoryMethodLinear:

				return InterpolateLinear;

			case this.InterpolantFactoryMethodSmooth:

				return InterpolateSmooth;

		}

	},

	getValueSize: function () {

		return this.values.length / this.times.length;

	},

	// move all keyframes either forwards or backwards in time
	shift: function ( timeOffset ) {

		if ( timeOffset !== 0.0 ) {

			var times = this.times;

			for ( var i = 0, n = times.length; i !== n; ++ i ) {

				times[ i ] += timeOffset;

			}

		}

		return this;

	},

	// scale all keyframe times by a factor (useful for frame <-> seconds conversions)
	scale: function ( timeScale ) {

		if ( timeScale !== 1.0 ) {

			var times = this.times;

			for ( var i = 0, n = times.length; i !== n; ++ i ) {

				times[ i ] *= timeScale;

			}

		}

		return this;

	},

	// removes keyframes before and after animation without changing any values within the range [startTime, endTime].
	// IMPORTANT: We do not shift around keys to the start of the track time, because for interpolated keys this will change their values
	trim: function ( startTime, endTime ) {

		var times = this.times,
			nKeys = times.length,
			from = 0,
			to = nKeys - 1;

		while ( from !== nKeys && times[ from ] < startTime ) {

			++ from;

		}

		while ( to !== - 1 && times[ to ] > endTime ) {

			-- to;

		}

		++ to; // inclusive -> exclusive bound

		if ( from !== 0 || to !== nKeys ) {

			// empty tracks are forbidden, so keep at least one keyframe
			if ( from >= to ) to = Math.max( to, 1 ), from = to - 1;

			var stride = this.getValueSize();
			this.times = AnimationUtils.arraySlice( times, from, to );
			this.values = AnimationUtils.arraySlice( this.values, from * stride, to * stride );

		}

		return this;

	},

	// ensure we do not get a GarbageInGarbageOut situation, make sure tracks are at least minimally viable
	validate: function () {

		var valid = true;

		var valueSize = this.getValueSize();
		if ( valueSize - Math.floor( valueSize ) !== 0 ) {

			console.error( 'Speed3D.KeyframeTrack: Invalid value size in track.', this );
			valid = false;

		}

		var times = this.times,
			values = this.values,

			nKeys = times.length;

		if ( nKeys === 0 ) {

			console.error( 'Speed3D.KeyframeTrack: Track is empty.', this );
			valid = false;

		}

		var prevTime = null;

		for ( var i = 0; i !== nKeys; i ++ ) {

			var currTime = times[ i ];

			if ( typeof currTime === 'number' && isNaN( currTime ) ) {

				console.error( 'Speed3D.KeyframeTrack: Time is not a valid number.', this, i, currTime );
				valid = false;
				break;

			}

			if ( prevTime !== null && prevTime > currTime ) {

				console.error( 'Speed3D.KeyframeTrack: Out of order keys.', this, i, currTime, prevTime );
				valid = false;
				break;

			}

			prevTime = currTime;

		}

		if ( values !== undefined ) {

			if ( AnimationUtils.isTypedArray( values ) ) {

				for ( var i = 0, n = values.length; i !== n; ++ i ) {

					var value = values[ i ];

					if ( isNaN( value ) ) {

						console.error( 'Speed3D.KeyframeTrack: Value is not a valid number.', this, i, value );
						valid = false;
						break;

					}

				}

			}

		}

		return valid;

	},

	// removes equivalent sequential keys as common in morph target sequences
	// (0,0,0,0,1,1,1,0,0,0,0,0,0,0) --> (0,0,1,1,0,0)
	optimize: function () {

		var times = this.times,
			values = this.values,
			stride = this.getValueSize(),

			smoothInterpolation = this.getInterpolation() === InterpolateSmooth,

			writeIndex = 1,
			lastIndex = times.length - 1;

		for ( var i = 1; i < lastIndex; ++ i ) {

			var keep = false;

			var time = times[ i ];
			var timeNext = times[ i + 1 ];

			// remove adjacent keyframes scheduled at the same time

			if ( time !== timeNext && ( i !== 1 || time !== time[ 0 ] ) ) {

				if ( ! smoothInterpolation ) {

					// remove unnecessary keyframes same as their neighbors

					var offset = i * stride,
						offsetP = offset - stride,
						offsetN = offset + stride;

					for ( var j = 0; j !== stride; ++ j ) {

						var value = values[ offset + j ];

						if ( value !== values[ offsetP + j ] ||
							value !== values[ offsetN + j ] ) {

							keep = true;
							break;

						}

					}

				} else {

					keep = true;

				}

			}

			// in-place compaction

			if ( keep ) {

				if ( i !== writeIndex ) {

					times[ writeIndex ] = times[ i ];

					var readOffset = i * stride,
						writeOffset = writeIndex * stride;

					for ( var j = 0; j !== stride; ++ j ) {

						values[ writeOffset + j ] = values[ readOffset + j ];

					}

				}

				++ writeIndex;

			}

		}

		// flush last keyframe (compaction looks ahead)

		if ( lastIndex > 0 ) {

			times[ writeIndex ] = times[ lastIndex ];

			for ( var readOffset = lastIndex * stride, writeOffset = writeIndex * stride, j = 0; j !== stride; ++ j ) {

				values[ writeOffset + j ] = values[ readOffset + j ];

			}

			++ writeIndex;

		}

		if ( writeIndex !== times.length ) {

			this.times = AnimationUtils.arraySlice( times, 0, writeIndex );
			this.values = AnimationUtils.arraySlice( values, 0, writeIndex * stride );

		}

		return this;

	}

} );

export { KeyframeTrack };
