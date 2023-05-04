import { extend } from '@vue/shared'
// import * as CompilerDOM from '@vue/compiler-dom'

import {
  parse,
  parserOptions,
  getBaseTransformPreset,
  DOMNodeTransforms,
  DOMDirectiveTransforms,
  stringifyStatic
} from '@vue/compiler-dom'

import { transform, generate } from '@vue/compiler-core'

function creareOptions(options: any = {}) {
  const { expressionPlugins } = options || {}
  options.expressionPlugins = [...(expressionPlugins || []), 'typescript']
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(true)
  /**
   * parserOptions: 默认parse 选项
   * options： 用户传入选项
   */
  return extend({}, parserOptions, options, {
    nodeTransforms: [
      ...nodeTransforms,
      ...DOMNodeTransforms,
      ...(options.nodeTransforms || []) // user transforms
    ],
    directiveTransforms: extend(
      {},
      directiveTransforms,
      DOMDirectiveTransforms,
      options.directiveTransforms || {} // user transforms
    ),
    transformHoist: stringifyStatic
  })
}

function parseTemplate(content: string, options: any = {}) {
  const resovledOptions = creareOptions(options)
  return parse(content, resovledOptions)
}

function transformTemplate(ast: any, options: any = {}) {
  const resovledOptions = creareOptions(options)
  transform(ast, resovledOptions)
  return ast
}

function generateTemplate(ast: any, options: any = {}) {
  const resovledOptions = creareOptions(options)
  return generate(
    ast,
    extend({}, resovledOptions, {
      mode: 'module',
      prefixIdentifiers: true
    })
  )
}

export { transformTemplate, parseTemplate, generateTemplate }
