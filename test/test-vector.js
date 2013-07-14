/* test vector math stuff */

module("vector");

test("sum", function() {
    deepEqual(Vec.sum([1]), [1], "sanity check");
    deepEqual(Vec.sum([]), [], "nothing");
    deepEqual(Vec.sum([1], [1]), [2], "one-dimensional addition");
    deepEqual(Vec.sum([1], [1], [1]), [3], "more vectors");
    deepEqual(Vec.sum([1, 1]), [1, 1], "2d sanity check");
    deepEqual(Vec.sum([1], []), [1], "zero-extending to longest dim");
    deepEqual(Vec.sum([1, 1], [1]), [2, 1], "zero-extending to longest dim");
    deepEqual(Vec.sum([1], [1, 1]), [2, 1], "zero-extending to longest dim");
    deepEqual(Vec.sum([1, 1], [1, 1]), [2, 2], "2d addition");
});

test("diff", function() {
    deepEqual(Vec.diff([], []), [], "hello?");
    deepEqual(Vec.diff([1], []), [1], "zero-extend nothing");
    deepEqual(Vec.diff([], [1]), [], "chop rhs");
    deepEqual(Vec.diff([1], [0]), [1], "subtract nothing");
    deepEqual(Vec.diff([1], [1]), [0], "subtract to nothing");
    deepEqual(Vec.diff([1, 1], [1]), [0, 1], "zero-extend rhs");
    deepEqual(Vec.diff([1], [1, 1]), [0], "chop rhs");
    (function() {
        var aliased_a = [1],
            aliased_b = [2];
        Vec.diff(aliased_a, aliased_b);
        deepEqual(aliased_a, [1], "side-effect");
        deepEqual(aliased_b, [2], "side-effect");
    })();
});

test("scale", function() {
    deepEqual(Vec.scale([], 0), [], "scale nothing");
    deepEqual(Vec.scale([], 1), [], "identity-scale nothing");
    deepEqual(Vec.scale([1], 0), [0], "scale away");
    deepEqual(Vec.scale([1], 1), [1], "scale identity");
    deepEqual(Vec.scale([1], 2), [2], "scale up");
    deepEqual(Vec.scale([1, 1], 2), [2, 2], "scale 2d");
    (function() {
        var some_vector = [1];
        Vec.scale(some_vector, 2);
        deepEqual(some_vector, [1], "no side-effect");
    })();
});

test("magnitude", function() {
    deepEqual(Vec.mag([]), 0, "magnitude of nothing");
    deepEqual(Vec.mag([0]), 0, "1d zero vector");
    deepEqual(Vec.mag([0, 0]), 0, "1d zero vector");
    deepEqual(Vec.mag([1]), 1, "1d unit vector");
    deepEqual(Vec.mag([1, 0]), 1, "2d unit vector along first component");
    deepEqual(Vec.mag([0, 1]), 1, "2d unit vector along first component");
    deepEqual(Vec.mag([3, 4]), 5, "nice triangle");
    deepEqual(Vec.mag([3, 4, 0]), 5, "3d");
    deepEqual(Vec.mag([1, 1, 1, 1]), 2, "4d");
});

test("unit", function() {
    var vecAlmostEqual = function(a, b, tol, msg) {
        // accommodate floating-point roudning error
        ok(a.length === b.length, msg);
        for (var c=0; c < a.length; c++) {
            ok(Math.abs(a[c] - b[c]) <= tol, msg);
        }
    };
    deepEqual(Vec.unit([]), [], "nobody home");
    deepEqual(Vec.unit([0]), [NaN], "1d zero vector??? (lol)");
    deepEqual(Vec.unit([0, 0]), [NaN, NaN], "2d zero vector??? (lawl)");
    deepEqual(Vec.unit([1]), [1], "pass-through");
    deepEqual(Vec.unit([2]), [1], "1d scale");
    vecAlmostEqual(Vec.unit([3, 4]), [0.6, 0.8], 0.001, "2d scale");
    deepEqual(Vec.unit([1, 1, 1, 1]), [0.5, 0.5, 0.5, 0.5], '4d scale');
});

test("dot", function() {
    deepEqual(Vec.dot([], []), 0, "from nothing");
    deepEqual(Vec.dot([0], []), 0, "zero-extend to zero vectors");
    deepEqual(Vec.dot([0, 0], []), 0, "zero-extend to zero vectors");
    deepEqual(Vec.dot([1], [0]), 0, "cross zero is zero");
    deepEqual(Vec.dot([1, 1], [0, 0]), 0, "cross zero is zero");
    deepEqual(Vec.dot([0], [1]), 0, "zero cross is zero");
    deepEqual(Vec.dot([1], [1]), 1, "1d identity");
    deepEqual(Vec.dot([2], [1]), 2, "lhs scaler");
    deepEqual(Vec.dot([1], [2]), 2, "rhs scaler");
    deepEqual(Vec.dot([1, 1], [1, 1]), 2, "scaler");
    deepEqual(Vec.dot([1, 1], [1, 0]), 1, "scaler");
    deepEqual(Vec.dot([0, 1], [1, 0]), 0, "perpendicular");
    deepEqual(Vec.dot([0, 1], [1, 1]), 1, "lalala");
    deepEqual(Vec.dot([1, 1, 1], [1, 1, 0]), 2, "3d");
});

test("cross", function() {
    deepEqual(Vec.cross([], []), [0, 0, 0], "from nothing");
    deepEqual(Vec.cross([0, 0, 0], []), [0, 0, 0], "zero-extend zero vectors");
    deepEqual(Vec.cross([0, 0, 0], [0, 0, 0]), [0, 0, 0], "zero vectors");
    deepEqual(Vec.cross([1, 1, 1], [0, 0, 0]), [0, 0, 0], "cross zero");
    deepEqual(Vec.cross([1, 1, 1], [1, -1, 1]), [2, 0, -2], "whee");
});
