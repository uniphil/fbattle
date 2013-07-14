module("Integrator");

var check_int = function(fn, i, expected) {
    var integrated = fn(i);
    deepEqual(integrated, expected);
};

var simple_1d = function(i) {
    return i([0], [0], 1, function() { return [1]; });
};

test("newton", function() {
    check_int(simple_1d, newton, {
        position: [0],
        velocity: [1]
    });
});

test("rk4", function() {
    check_int(simple_1d, rk4, {
        position: [0.5],
        velocity: [1]
    });
});
