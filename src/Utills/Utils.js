/**
 * @author mrdoob / http://mrdoob.com/
 * @modified DongYi 2018/07/18
 */

/*function arrayMin( array ) {

	if ( array.length === 0 ) return Infinity;

	var min = array[ 0 ];

	for ( var i = 1, l = array.length; i < l; ++ i ) {

		if ( array[ i ] < min ) min = array[ i ];

	}

	return min;

}

function arrayMax( array ) {

	if ( array.length === 0 ) return - Infinity;

	var max = array[ 0 ];

	for ( var i = 1, l = array.length; i < l; ++ i ) {

		if ( array[ i ] > max ) max = array[ i ];

	}

	return max;

}*/

class arrayMin {
    static arrayMin(array) {
        if (array.length === 0) return Infinity;
        let min = array[0];
        for (let i = 1, l = array.length; i < l; ++i) {
            if (array[i] < min) min = array[i];
        }
        return min;
    }
}

class arrayMax {
    static arrayMax(array) {
        if (array.length === 0) return -Infinity;
        let max = array[0];
        for (let i = 1, l = array.length; i < l; ++i) {
            if (array[i] > max) max = array[i];
        }
        return max;
    }
}

export {arrayMin, arrayMax};
