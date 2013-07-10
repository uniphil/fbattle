

var Expression = (function(Expression) {
    var State = function(name, type) {
        this.name = name;
        this.type = type;
        this.links = [];
        this.link = function(condition, next_state) {
            this.links.push({condition: condition,
                            next_state: next_state});
            return next_state;  // so we can chain link declarations
        };
        this.get_next = function(character) {
            for (var index = 0; index < this.links.length; index++) {
                if (this.links[index].condition.test(character)) {
                    return this.links[index].next_state;
                }
            }
            if (this.name === null) {
                throw 'invalid state machine exit';
            }
            return null;  // signal state machine exit
        };
        return this;
    };

    Expression.lex_machine = function() {
        var s = {
            enter: new State(null),  // invalid exit
            white: new State('whitespace', 'whitespace'),
            num: new State('literal', 'value'),
            dot: new State(null),  // invalid exit
            ndot: new State('literal', 'value'),
            dec: new State('literal', 'value'),
            name: new State('name', 'value'),
            name_suf: new State('name', 'value'),
            o_paren: new State('o_paren', 'bracket'),
            o_square: new State('o_square', 'bracket'),
            c_paren: new State('c_paren', 'bracket'),
            c_square: new State('c_square', 'bracket'),
            power: new State('power', 'operator'),
            multiply: new State('multiply', 'operator'),
            divide: new State('divide', 'operator'),
            plus: new State('plus', 'operator'),
            minus: new State('minus', 'operator'),
            less: new State('less', 'operator'),
            greater: new State('greater', 'operator')
        };
        s.enter.link(/\s/, s.white).link(/\s/, s.white);  // w h i t e s p a c e
        s.enter.link(/\d/, s.num).link(/\d/, s.num).link(/\./, s.ndot).link(/\d/, s.dec).link(/\d/, s.dec);  // 123.45
        s.enter.link(/\./, s.dot).link(/\d/, s.dec);  // .67; dec already loops on itself ^^
        s.enter.link(/[a-zA-Z]/, s.name).link(/[a-zA-Z]/, s.name).link(/['\|\^]/, s.name_suf);  // rad|
        s.enter.link(/\(/, s.o_paren);  // (
        s.enter.link(/\[/, s.o_square);  // [
        s.enter.link(/\)/, s.c_paren);  // )
        s.enter.link(/\]/, s.c_square);  // ]
        s.enter.link(/\^/, s.power);  // powers
        s.enter.link(/\*/, s.multiply);  // multiply
        s.enter.link(/\//, s.divide);  // divides
        s.enter.link(/\+/, s.plus);  // pluss
        s.enter.link(/\-/, s.minus);  // minus
        s.enter.link(/</, s.less);  // lesss
        s.enter.link(/>/, s.greater);  // greaters
        return s.enter;
    }();

    Expression.tokenize_flat = function(expression) {
        var index,
            token_start,
            tokens = [],
            state,
            next_state;
        for (index = 0; index < expression.length;) {
            try {
                token_start = index;
                state = Expression.lex_machine.get_next(expression.slice(index, index + 1));
                do {
                    index++;
                    next_state = state.get_next(expression.slice(index, index + 1));
                    state = next_state ? next_state : state;
                } while (next_state !== null);
            } catch(e) {
                if (e !== 'invalid state machine exit') {
                    throw e;  // some other error
                }
                state = {name: 'invalid', type: 'invalid'};
                index = expression.length;  // mark it all invalid to the end
                next_state = null;
            }
            tokens.push({
                name: state.name,
                type: state.type,
                rep: expression.slice(token_start, index),
                indices: [token_start, index]
            });
        }
        return tokens;
    };

    Expression.value_clean_disabiguation = function(tokens) {
        var index,
            previous,
            token,
            value;
        for (index = 0; index < tokens.length; index++) {
            token = tokens[index];
            if (token.name === 'literal') {
                value = parseFloat(token.rep);
                token.fn = (function(value) {
                    return function() { return value; };
                })(value);
            } else if (token.name === 'name') {
                token.fn = (function(name) {
                    return function(ctx) { return ctx[name]; };
                })(token.rep);
            } else if (token.type === 'whitespace') {
                tokens.splice(index, 1);  // pop it!
                index--;  // removed from list, update counter accordingly
            } else if (token.type === 'operator') {
                if (/plus|minus/.test(token.name)) {
                    previous = tokens[index - 1];
                    if (index === 0 ||
                        /binary_operator/.test(previous.type) ||
                        /^o_/.test(previous.name)) {
                        token.type = 'unary_operator';
                    } else {
                        token.type = 'binary_operator';
                    }
                } else {
                    token.type = 'binary_operator';
                }
            }
        }
        return tokens;
    };

    Expression.lex = function(raw) {
        var flat_tokens = Expression.tokenize_flat(raw);
        var full_tokens = Expression.value_clean_disabiguation(flat_tokens);
        return full_tokens;
    };

    return Expression;

})(Expression = Expression || {});
