import { parseExpression } from '../parser';

export const DIRECTIVE_REGEX = /^@([a-z]+)(?::((?:[a-z]+-)*[a-z]+))?(\.[a-z]+)*$/i;
/** @type {Object<string, Directive>} */
export const DIRECTIVES = {};

/**
 * @typedef {Object<string, boolean>} DirectiveOptions
 * @typedef {Object} DirectiveCallbackPayload
 * @property {Element} element
 * @property {DirectiveOptions} options
 * @property {string} [param]
 * @property {string} [rawValue]
 * @property {import("../parser/index").ParsedExpression} [data]
 */

export class Directive {
  /**
   * @param {string} name
   * @param {(this: import("..").default, payload: DirectiveCallbackPayload) => void} callback
   * @param {{ paramRequired?: boolean, allowStatements?: boolean }} [options]
   */
  constructor(name, callback, {
    paramRequired = false, allowStatements = false
  } = {}) {
    this.name = name;
    this.fn = callback;
    this.paramRequired = paramRequired;
    this.allowStatements = allowStatements;
  }

  /**
   * @param {import("..").default} instance
   * @param {Element} el
   * @param {string} param
   * @param {string} value
   * @param {DirectiveOptions} options
   */
  execute(instance, el, param, value, options) {
    const parsed = value ? parseExpression(value) : undefined;
    if (this.paramRequired && !param) {
      throw new Error(`a parameter is required for @${this.name}`);
    }
    if (this.allowStatements && parsed && parsed.type === 'statement') {
      throw new Error(`assigning to values is not allowed for @${this.name}`);
    }
    this.fn.call(instance, {
      element: el,
      param,
      options,
      rawValue: value,
      data: parsed
    });
  }
}

/** @param {Directive} directive */
export function register(directive) {
  const { name } = directive;

  if (name in DIRECTIVES) throw new Error(`already registered ${name}`);
  if (!/^[a-z]+$/i.test(name)) throw new Error(`${name} is not a valid directive name`);

  DIRECTIVES[name] = directive;
}
