import * as babel from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { ParsedComponent, ElementNode } from "../utils/types";

/**
 * Main function to parse a React component's code.
 * - Reads the code and turns it into an AST.
 * - Finds the component name, its imports, and its JSX elements.
 */
export function parseComponent(code: string): ParsedComponent {
  try {
    const ast = babel.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"], // Support JSX + TS syntax
    });

    const component = extractComponentInfo(ast); // get component name
    const dependencies = extractDependencies(ast); // get imports
    const elements = extractElements(ast); // get JSX elements

    return {
      name: component.name,
      code,
      ast,
      dependencies,
      elements,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown parsing error";
    throw new Error(`Failed to parse component: ${errorMessage}`);
  }
}

/**
 * Finds the component name by checking:
 * - normal function components
 * - arrow function components
 * - export default declarations
 */
function extractComponentInfo(ast: t.File): { name: string } {
  let componentName = "UnnamedComponent";

  traverse(ast, {
    // function MyComponent() { return <div/> }
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (
        path.node.id &&
        t.isIdentifier(path.node.id) &&
        isReactFunctionComponent(path)
      ) {
        componentName = path.node.id.name;
      }
    },
    // const MyComponent = () => <div/>
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      if (t.isIdentifier(path.node.id) && isReactArrowFunction(path)) {
        componentName = path.node.id.name;
      }
    },
    // export default MyComponent OR export default function MyComponent() {}
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      if (t.isIdentifier(path.node.declaration)) {
        componentName = path.node.declaration.name;
      } else if (
        t.isFunctionDeclaration(path.node.declaration) &&
        path.node.declaration.id &&
        t.isIdentifier(path.node.declaration.id)
      ) {
        componentName = path.node.declaration.id.name;
      }
    },
  });

  return { name: componentName };
}

/**
 * Collects all import sources, e.g. "react", "./Button"
 */
function extractDependencies(ast: t.File): string[] {
  const dependencies: string[] = [];

  traverse(ast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      if (t.isStringLiteral(path.node.source)) {
        dependencies.push(path.node.source.value);
      }
    },
  });

  return dependencies;
}

/**
 * Finds top-level JSX elements inside the component.
 * - Only grabs root elements, not nested children.
 */
function extractElements(ast: t.File): ElementNode[] {
  const elements: ElementNode[] = [];
  let idCounter = 0;
  const nextId = () => `element-${idCounter++}`;

  traverse(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const parent = path.parentPath;
      // Skip nested elements, we only want top-level JSX
      if (parent && t.isJSXElement(parent.node)) {
        return;
      }

      const root = parseJSXElementRecursive(path.node, nextId);
      elements.push(root);
    },
  });

  return elements;
}

/**
 * Recursively parse a JSX element into our ElementNode format.
 * - Reads the tag name (div, Button, etc.)
 * - Converts props into plain objects
 * - Collects text and child elements
 */
function parseJSXElementRecursive(
  node: t.JSXElement,
  nextId: () => string
): ElementNode {
  // Get tag name: div, MyComponent, or something like Foo.Bar
  let tagName = "div";
  if (t.isJSXIdentifier(node.openingElement.name)) {
    tagName = node.openingElement.name.name;
  } else if (t.isJSXMemberExpression(node.openingElement.name)) {
    tagName = generate(node.openingElement.name).code;
  }

  // Convert props into a simple object
  const props: Record<string, unknown> = {};
  node.openingElement.attributes?.forEach((attr) => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const name = attr.name.name;

      if (attr.value && t.isJSXExpressionContainer(attr.value)) {
        // Handle expressions like style={{...}}, count={10}, etc.
        const expr = attr.value.expression;
        if (name === "style" && t.isObjectExpression(expr)) {
          props[name] = objectExpressionToLiteral(expr);
        } else {
          props[name] = generate(expr).code;
        }
      } else if (attr.value && t.isStringLiteral(attr.value)) {
        // Normal string: title="Hello"
        props[name] = attr.value.value;
      } else if (attr.value == null) {
        // Boolean props: <Button disabled />
        props[name] = true;
      }
    }
  });

  // Collect children and text
  let textContent = "";
  const children: ElementNode[] = [];

  node.children.forEach((child) => {
    if (t.isJSXText(child)) {
      // Plain text inside JSX
      const trimmed = child.value.trim();
      if (trimmed) {
        textContent += (textContent ? " " : "") + trimmed;
      }
    } else if (t.isJSXExpressionContainer(child)) {
      // Handle expressions inside JSX: {variable}, {1+2}
      const expr = child.expression;
      if (t.isJSXElement(expr)) {
        children.push(parseJSXElementRecursive(expr, nextId));
      } else {
        const code = generate(expr).code;
        if (code && code !== "{}") {
          textContent += (textContent ? " " : "") + code;
        }
      }
    } else if (t.isJSXElement(child)) {
      // Nested JSX elements
      children.push(parseJSXElementRecursive(child, nextId));
    }
  });

  // Build our ElementNode object
  const elementNode: ElementNode = {
    id: nextId(),
    type: "jsx",
    tagName,
    props,
    children,
    textContent: textContent.trim(),
    position: { x: 0, y: 0, width: 0, height: 0 }, // placeholder layout info
  };

  return elementNode;
}

/**
 * Turns a Babel ObjectExpression (style={{...}}) into a plain object.
 */
function objectExpressionToLiteral(obj: t.ObjectExpression) {
  const out: Record<string, unknown> = {};
  obj.properties.forEach((p) => {
    if (!t.isObjectProperty(p)) return;

    let key = "";
    if (t.isIdentifier(p.key)) key = p.key.name;
    else if (t.isStringLiteral(p.key)) key = p.key.value;

    if (!key) return;

    const v = p.value;
    if (t.isStringLiteral(v)) out[key] = v.value;
    else if (t.isNumericLiteral(v)) out[key] = v.value;
    else if (t.isBooleanLiteral(v)) out[key] = v.value;
    else if (t.isNullLiteral(v)) out[key] = null;
    else if (t.isTemplateLiteral(v) && v.quasis.length === 1) {
      out[key] = v.quasis[0].value.cooked || "";
    } else {
      out[key] = generate(v).code; // fallback to code string
    }
  });
  return out;
}

/**
 * Checks if a normal function is a React component
 * by looking for a return statement with JSX.
 */
function isReactFunctionComponent(
  path: NodePath<t.FunctionDeclaration>
): boolean {
  let hasJSXReturn = false;
  path.traverse({
    ReturnStatement(returnPath: NodePath<t.ReturnStatement>) {
      if (
        returnPath.node.argument &&
        t.isJSXElement(returnPath.node.argument)
      ) {
        hasJSXReturn = true;
      }
    },
  });
  return hasJSXReturn;
}

/**
 * Checks if a variable is a React component defined
 * as an arrow function: const MyComponent = () => <div />
 */
function isReactArrowFunction(path: NodePath<t.VariableDeclarator>): boolean {
  if (
    t.isArrowFunctionExpression(path.node.init) ||
    t.isFunctionExpression(path.node.init)
  ) {
    let hasJSXReturn = false;

    path.traverse({
      ReturnStatement(returnPath: NodePath<t.ReturnStatement>) {
        if (
          returnPath.node.argument &&
          t.isJSXElement(returnPath.node.argument)
        ) {
          hasJSXReturn = true;
        }
      },
      ArrowFunctionExpression(arrowPath: NodePath<t.ArrowFunctionExpression>) {
        if (t.isJSXElement(arrowPath.node.body)) {
          hasJSXReturn = true;
        }
      },
    });

    return hasJSXReturn;
  }
  return false;
}
