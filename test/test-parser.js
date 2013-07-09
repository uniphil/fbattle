module("Parser");

var token_checker = function(num, check_ind, expected_name) {
    return function(raw, note) {
        var tokens = Expression.tokenize_flat(raw);
        equal(tokens.length, num);
        var token_name = tokens[check_ind].name;
        deepEqual(token_name, expected_name, note);
    };
};

test("Tokenize literals and names", function() {
    var check = token_checker(1, 0, "literal");
    check("0", "zero");
    check("1", "integer");
    check("10", "two-digit integer");
    check(".1", "decimal prefix");
    check("0.1", "decimal < 1");
    check("1.1", "decimal > 1");
});

test("Tokenize Names", function() {
    var check = token_checker(1, 0, "name");
    check("a", "lowercase letter");
    check("A", "uppercase letter");
    check("ab", "multi-letter name");
    check("a'", "single quote postfix");
    check("a|", "pipe postfix");
    check("a^", "hat postfix");
});

test("Tokenize Operators", function() {
    token_checker(2, 0, "minus")("-1", "minus literal");
    token_checker(2, 0, "minus")("-a", "minus name");
    token_checker(4, 0, "minus")("-(1)", "minus subexpr");
    token_checker(4, 0, "minus")("-[1]", "minus abs");
    token_checker(3, 1, "power")("1^1", "power");
    token_checker(3, 1, "multiply")("1*1", "multiply");
    token_checker(3, 1, "divide")("1/1", "divide");
    token_checker(3, 1, "plus")("1+1", "plus");
    token_checker(3, 1, "minus")("1-1", "subtract");
    token_checker(3, 1, "less")("1<1", "less than");
    token_checker(3, 1, "greater")("1>1", "greater than");
});

test("Tokenize Parentheses", function() {
    token_checker(3, 0, "o_paren")("(1)", "opening paren");
    token_checker(3, 2, "c_paren")("(1)", "closing paren");
    token_checker(3, 0, "o_square")("[1]", "opening absolute brackets");
    token_checker(3, 2, "c_square")("[1]", "closing absolute brackets");
});
