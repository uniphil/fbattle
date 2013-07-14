/* integrate to solve motion as a function of acceleration over discrete
 * timesteps
 */


var newton = function(position, velocity, frame_step, accelerator) {
    // accelerator is a callback taking position and velocity
    var acceleration = accelerator(position, velocity);
    return {
        position: Vec.sum(position, Vec.scale(velocity, frame_step)),
        velocity: Vec.sum(velocity, Vec.scale(acceleration, frame_step))
    };
};


var rk4 = function(Vec) {
    var sum = Vec.sum,
        scale = Vec.scale;

    var plus_delta = function(vector, next_order, time_delta) {
        return sum(vector, scale(next_order, time_delta));
    };

    var rk_mix = function(v1, v2, v3, v4) {
        var mix = sum(v1, scale(v2, 2), scale(v3, 2), v4);
        return scale(mix, 1 / 6.0);
    };

    return function(position, velocity, frame_step, accelerator) {
        // runge-kutta, aka the bad-ass one

        var acceleration = accelerator(position, velocity),

            pos2 = plus_delta(position, velocity, frame_step / 2.0),
            vel2 = plus_delta(velocity, acceleration, frame_step / 2.0); 
        var accel2 = accelerator(pos2, vel2),

            pos3 = plus_delta(position, vel2, frame_step / 2.0),
            vel3 = plus_delta(velocity, accel2, frame_step / 2.0);
        var accel3 = accelerator(pos3, vel3),

            pos4 = plus_delta(position, vel3, frame_step),
            vel4 = plus_delta(velocity, accel3, frame_step);
        var accel4 = accelerator(pos4, vel4);

        var rk_vel = rk_mix(velocity, vel2, vel3, vel4),
            rk_accel = rk_mix(acceleration, accel2, accel3, accel4);

        return {
            position: plus_delta(position, rk_vel, frame_step),
            velocity: plus_delta(velocity, rk_accel, frame_step)
        };
    };
}(Vec);


var accelegrator = rk4;  // just use rk4. just do it.
