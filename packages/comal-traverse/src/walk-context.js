
import BaseContext from "./base-context";
import NodePath from "./path";

/**
 * this class duplicates comal-traverse TraversalContext, but just
 * maintains path and not scope or any rewriting stuff, or opts, or state.
 */

export default class WalkContext extends BaseContext {
  constructor(parentPath, opts) {
    super({
      noScope: true, // airhorn
      ...opts
    }, parentPath);

    this.interns = opts.interns || {};

  }

  visitRoot(root) {
    if (Array.isArray(root)) {
      const pseudoRoot = {type: '<root>', root};
      return this.visitMultiple(pseudoRoot, pseudoRoot, 'root');
    }
    return this.visitSingle({type: '<root>', root}, 'root');
  }

  visitSingle(parent, key): boolean {
    return this.visitQueue([this.create(parent, parent, key)])
  }

  visitMultiple(container, parent, listKey) {
    if (container.length === 0) {
      if (this.interns.empty) this.interns.empty.call(this);
      return false;
    }

    return this.visitQueue(
      container.map((node, index) => this.create(
        parent,
        container,
        index,
        listKey
      ))
    )
  }

  visitQueue(paths: Array<NodePath>) {
    this.queue = paths;

    let visited = [];

    const interns = this.interns;

    if (interns.before) interns.before(paths[0]);

    let prevPath = null;

    for (const path of paths) {
      if (path.contexts.length === 0 || path.contexts[path.contexts.length - 1] !== this) {
        // The context might already have been pushed when this path was inserted and queued.
        // If we always re-pushed here, we could get duplicates and risk leaving contexts
        // on the stack after the traversal has completed, which could break things.
        path.pushContext(this);
      }

      if (interns) {
        if (interns.between && prevPath) interns.between(prevPath, path);
        if (interns.each) interns.each(path);
      }

      // TODO: see if this can be hashed to improve perf
      // ensure we don't visit the same node twice
      if (path.node === null) {
        const pathId = (path.listKey || '') + '.' + path.key;
        if (visited.indexOf(pathId) >= 0) continue;
        visited.push(pathId);
      } else {
        if (visited.indexOf(path.node) >= 0) continue;
        visited.push(path.node);
      }

      // here, instead of using path.visit, we directly invoke the visitPath
      // function, to be implemented by subclasses
      this.visitPath(path);
      prevPath = path;
    }

    if (interns.after) interns.after(prevPath);

    // clear queue
    for (const path of paths) {
      path.popContext();
    }
    this.queue = null;

    return paths;
  }
}

// indicate to NodePath that this isn't the normal traversal, so automatically
// inherit context from parent path
WalkContext.prototype._autoInherit = true;
