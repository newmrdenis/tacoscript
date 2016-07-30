// TODO: document acronym ACST = abstract/concrete syntax tree =
// ast with cst elements

import {render} from 'tacoscript-cst-utils';
// TODO: move a base file out of comal into comal-support
import {File} from 'comal';
import {WalkContext} from 'comal-traverse';
import type {NodePath} from 'comal-traverse';
import type {Node} from 'horchata/lib/parser/node';
import find from 'lodash/find';

export function generate(acst, opts) {
  opts = opts || {};

  const sourceElementsKey = opts.sourceElements = opts.sourceElements || 'sourceElements';
  if (!opts.tacoscriptSourceElements) opts.tacoscriptSourceElements = 'tacoscriptSourceElements';
  opts.sourceElementsSource = opts.tacoscriptSourceElements;

  const visitor = new Visitor(opts);
  visitor.start(acst, opts);

  return {
    code: render(acst, sourceElementsKey),
    ast: acst
  };
}

function lastNonEof(t) {
  let offset = 1;
  for (let l = t.length, offset = 1; offset <= l; offset++) {
    const element = t[t.length - offset];
    if (element.element !== 'EOF') return element;
  }
}

export class Visitor {
  constructor(opts) {
    this.opts = opts;
    this.tKey = opts.tacoscriptSourceElements;
    this.key = opts.sourceElements;
  }

  start(acst, opts) {
    if (this.file) throw new Error('not reentrant');
    const file = this.file = new File({filename: acst.filename || ''});

    const context = new WalkContext(this);
    let out;
    if (Array.isArray(acst)) {
      const pseudoRoot = {type: '<root>', cst: acst};
      out = context.visitMultiple(pseudoRoot, pseudoRoot, 'cst');
    } else {
      out = context.visitSingle({type: '<root>', cst: acst}, 'cst');
    }

    this.file = null;
    return out;
  }

  visit(path) {
    const node = path.node;
    if (node) {
      if (!this[node.type]) {
        throw new Error('Cannot print node of type "' + node.type + '"')
      }
      this[node.type](path, node);
      const t = node[this.key];
      const lastElement = t[t.length - 1];
      if (lastElement && lastElement.element) this._lastElement = lastElement;

      const sourceLastElement = lastNonEof(node[this.tKey]);
      if (sourceLastElement && sourceLastElement.element) {
        this._sourceLastElement = sourceLastElement;
      }
    }
  }

  lastElement(t) {
    const lastElement = t[t.length - 1];
    return lastElement && lastElement.element ? lastElement : this._lastElement;
  }

  /**
   * usage:
    this.print(path, 'program', {
      before: (first) => {
        console.log('before', first)
      },
      between: (left, right) => {
        console.log(left, right)
      },
      after: (last) => {
        console.log('last', last);
      }
    })
   */

  print(path, prop, visitors, key=this.tKey: string) {
    let context = new WalkContext(this, path, visitors);
    context.visit(path.node, prop);
  }
}

import * as baseGenerators from "./types/base";
// import * as classesGenerators from "./types/classes";
import * as expressionsGenerators from "./types/expressions";
import * as literalsGenerators from "./types/literals";
import * as methodsGenerators from "./types/methods";
// import * as modulesGenerators from "./types/modules";
import * as statementsGenerators from "./types/statements";
// import * as templateLiteralsGenerators from "./types/template-literals";
for (const generator of [
      baseGenerators,
      // classesGenerators,
      expressionsGenerators,
      literalsGenerators,
      methodsGenerators,
      // modulesGenerators,
      statementsGenerators,
      // templateLiteralsGenerators,
    ]) {
  Object.assign(Visitor.prototype, generator);
}
