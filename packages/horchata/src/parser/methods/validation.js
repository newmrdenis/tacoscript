
// To be overridden by plugins
// equivalent to "toReferencedList" in babylon, used by flow plugin
export function checkReferencedList(expressions) { return expressions; }

// equivalent to "checkLVal" in babylon & acorn
// will be used by a validator plugin
export function checkAssignable(node, assignableContext = {}) {}

export function checkExpressionOperatorLeft(node) {
  let left = node.left;

  if (node.operator === "**" && left.type === "UnaryExpression" && left.extra && !left.extra.parenthesizedArgument) {
    this.raise(left.argument.start, "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.");
  }
}
