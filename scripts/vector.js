/* Vector Math */

var Vec = (function() {
    function Vec() {};

    var z_extend = function(vector, length) {
        /* Extend a vector to size length, zero-filling new components */
        var extended = vector,
            comp;
        for (comp = vector.length; comp < length; comp++) {
            extended[comp] = 0;
        }
        return extended;
    };

    var copy = function(vector) {
        /* copy the contents of a vector to a new one */
        var new_vector = [],
            v_ind;
        for (v_ind = 0; v_ind < vector.length; v_ind++) {
            new_vector[v_ind] = vector[v_ind];
        }
        return new_vector;
    }

    Vec.sum = function() {
        /* component-wise addition of any number of vectors.
           vec.sum([0, 1], [1, 1]) === [1, 2];
           The sum is extended to the longest given vector. */
        var summed = [],
            vector_num,
            vector,
            comp;
        for (vector_num = 0; vector_num < arguments.length; vector_num++) {
            vector = arguments[vector_num];
            if (vector.length > summed.length) {
                summed = z_extend(summed, vector.length);
            }
            for (comp = 0; comp < vector.length; comp++) {
                summed[comp] += vector[comp];
            }
        }
        return summed;
    };

    Vec.diff = function(a, b) {
        /* component-wise difference of vectors.
           vec.diff([1, 2], [1, 1]) === [0, 1];
           to subtract n vectors, do vec.diff(v1, sum(v2, v3 .. vn));
           The returned vector will be the same length as vector a. */
        var diffed = copy(a),
            comp;
        for (comp = 0; comp < a.length && comp < b.length; comp++) {
            diffed[comp] -= b[comp];
        }
        return diffed;
    };

    Vec.scale = function(vector, scale) {
        /* scale a vector. blah blah.
           vec.scale([1], 10) === [10]; */
        var scaled = copy(vector),
            comp;
        for (comp = 0; comp < vector.length; comp++) {
            scaled[comp] *= scale;
        }
        return scaled;
    };

    Vec.mag = function(vector) {
        /* Return the scalar length of a vector */
        var magnitude,
            components_squared = 0,
            comp;
        for (comp = 0; comp < vector.length; comp++) {
            components_squared += Math.pow(vector[comp], 2);
        }
        magnitude = Math.sqrt(components_squared);
        return magnitude;
    };

    Vec.unit = function(vector) {
        /* return a unit vector in the direction of vector */
        var unit_vector,
            magnitude;
        magnitude = Vec.mag(vector);
        unit_vector = Vec.scale(vector, 1.0 / magnitude);
        return unit_vector;
    };

    Vec.dot = function(a, b) {
        /* The dot product of two vectors
           vec.dot([1, 1], [0, 1]) === 1;
           If the vectors are not the same size, the shorter one will be zero-
           extended to match the longer one. */
        var dotted = 0,
            comp;
        for (comp = 0; comp < Math.min(a.length, b.length); comp++) {
            dotted += a[comp] * b[comp];
        }
        return dotted;
    };

    Vec.cross = function(a, b) {
        /* The cross product of two three-dimensional vectors.
           Vectors with fewer components will be zero-extended to three.
           Vectors with more than three components will cause an error. */
        var crossed = [];
        if (a.length > 3 || b.length > 3) {
            throw 'This cross product can only compute vectors of three' +
                  ' dimensions (or fewer).';
        }
        a = z_extend(a, 3);
        b = z_extend(b, 3);
        crossed[0] = a[1] * b[2] - a[2] * b[1];
        crossed[1] = a[2] * b[0] - a[0] * b[2];
        crossed[2] = a[0] * b[1] - a[1] * b[0];
        return crossed;
    };

    return Vec;
})();
