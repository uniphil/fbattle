var Expression = (function(Expression) {

    var bin_wrap = function(f) {
        // wrap the binary functions
        return function(lo, ro) {
            return function(cx) {
                var l = lo.fn(cx),
                    r = ro.fn(cx);
                return f.call(null, l, r);
            }
        }
    }

    var op_funcs = {
        order: [
            [/[oc]_(paren|square)/, 'bracket'],
            [/power/, 'binary_operator'],
            [/plus|minus/, 'unary_operator'],
            [/multiply|divide/, 'binary_operator'],
            [/plus|minus/, 'binary_operator'],
            [/less|greater/, 'binary_operator']
        ],
        un: {
            plus: function(o) { return function(c) { return +o.fn(c); }; },
            minus: function(o) { return function(c) { return -o.fn(c); }; },
        },
        bin: {
            power: bin_wrap(function(l, r) { return Math.pow(l, r); }),
            multiply: bin_wrap(function(l, r) { return l * r; }),
            divide: bin_wrap(function(l, r) { return l / r; }),
            plus: bin_wrap(function(l, r) { return l + r; }),
            minus: bin_wrap(function(l, r) { return l - r; }),
            less: bin_wrap(function(l, r) { return l < r; }),
            greater: bin_wrap(function(l, r) { return l > r; }),
        }
    };

    Expression.pull_tree = function(tokens, start, level) {
        start = start? start : 0,
        level = level? level : 0;
        var index = start,
            end = tokens.length,
            op_index = 0,
            op,
            token,
            open,
            close;

        for (op_index = 0; op_index < op_funcs.order.length; op_index++) {
            op = op_funcs.order[op_index];
            for (index = start; index < end; index++) {
                token = tokens[index];
                if (op[0].test(token.name) && token.type === op[1]) {
                    if (token.type === 'bracket') {
                        if (/^o_/.test(token.name)) {  // open
                            Expression.pull_tree(tokens, index + 1, level + 1);
                            end = tokens.length;  // update on return
                        } else if (/^c_/.test(token.name)) {  // close
                            end = index;
                        }
                    } else if (token.type === 'binary_operator') {
                        var lhs = tokens.splice(index - 1, 1)[0];
                        index--;  // we lost a token
                        end--;   // once for left
                        var rhs = tokens.splice(index + 1, 1)[0];
                        end--;  // aaaaand once for right
                        token.fn = op_funcs.bin[token.name](lhs, rhs);
                    } else if (token.type === 'unary_operator') {
                        var rhs = tokens.splice(index + 1, 1)[0];
                        end--; // we lost a token
                        token.fn = op_funcs.un[token.name](rhs);
                    }
                }
            }
        }
        if (level > 0) {
            // collapse the parens
            open = tokens[start - 1];
            token = tokens.splice(start--, 1)[0];
            close = tokens.splice(start + 1, 1)[0];
            if (open === undefined ||
                token === undefined ||
                close === undefined) {
                throw "Parse error. Check the brakets?";
            }
            if (! /^c_/.test(close.name)) {
                throw "Syntax Error at " + end + " -- expected close bracket.";
            }
            if (open.name === "o_paren" && close.name === "c_paren") {
                open.fn = (function(token) {
                    return function(c) { return token.fn(c); };
                })(token);
            } else if (open.name === "o_square" && close.name === "c_square") {
                open.fn = (function(token) {
                    return function(c) { return Math.abs(token.fn(c)); };
                })(token);
            } else {
                throw "Syntax error at " + end + " -- mismatched brackets.";
            }
            return open;
        } else {
            if (tokens.length !== 1) {
                throw "Parse error -- check operators and brackets.";
            }
            return tokens;
        }
    }

    Expression.compile = function(expression) {
        var tokens = Expression.lex(expression);
        var compiled_tree = Expression.pull_tree(tokens);
        return compiled_tree[0].fn;
    };

    return Expression;
})(Expression = Expression || {});
