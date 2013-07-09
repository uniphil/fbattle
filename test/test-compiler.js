module("Compiler")

var calc = function(raw, context, expected, note) {
    parser = Expression;
    compiled = parser.compile(raw);
    result = compiled(context);
    equal(result, expected, note);
};

test("Name and Literal Evaluation"), function() {
    calc("a", {a: 1}, 1, "set the name 'a' to 1");
    calc("1", {}, 1, "evaluate an integer");
}

test("Simple Operations", function() {
    calc("-1", {}, -1, "negate");
    calc("--1", {}, 1, "chained unary");
    calc("1^1", {}, 1, "power");
    calc("1*1", {}, 1, "multiplication");
    calc("1/1", {}, 1, "division");
    calc("1+1", {}, 2, "addition");
    calc("1-1", {}, 0, "subtraction");
    calc("1>2", {}, 0, "greater than");
    calc("1<2", {}, 1, "less than");
    calc("1+a", {a: 1}, 2, "add a literal and a name");
    calc("(1)", {}, 1, "parens");
    calc("[-1]", {}, 1, "absolute value");
});

test("Order of Operations", function() {
    calc("2^2^3", {}, 256, "exponents resolve right to left");
    calc("-1^2", {}, -1, "exponent lhs > minus");
    calc("1^-2", {}, 1, "unary rhs resolves before binary");
    calc("1*2^3", {}, 8, "exponent > multiplication");
    calc("1/2*3", {}, 1.5, "multiplication and division left to right");
    calc("1+2*3", {}, 7, "multiplication > addition");
    calc("1-3/2", {}, -0.5, "division > subtraction");
    calc("1>2+3", {}, 0, "addition > greater than");
    calc("2<1*3", {}, 1, "multiplication > less than");
    calc("(2^2)^3", {}, 64, "parens force order");
    calc("(1+2)*3", {}, 9, "parens force order");
});
