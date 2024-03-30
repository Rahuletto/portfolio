---
title: "Typescript's takeover"
description: "Elevating Your Code from JavaScript Jumble to Typed Tranquility"
pubDate: "Mar 30 2024"
heroImage: "/blogs/typescript.webp"
tags: ["develop", "web", "typescript", "node", "typings"]
---

Programming language for web development have had one king for a very long time: JavaScript. But developers now have a new favorite tool in their toolbox thanks to the emergence of TypeScript.

> TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Better Code quality

TypeScript introduces static typing, allowing developers to define types for variables, function parameters, and return values. This helps catch errors during development rather than at runtime, leading to cleaner and more robust code.

Just like any other compiled languages like `C`, `C++` and so on.

Typescript is also a compiled language which compiles into Javascript but stricter and better.

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

greet(123);
// Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

Yes, its way stricter. It does not do any implicit type conversion here.

Where

```ts
function greet(name: string): string
                     ------   ------
                       [1]      [2]
```

The equivalent of C++ code would be this

```cpp
string greet(string name)
------       -----
 [2]          [1]
```

- `[1]` is the argument type
- `[2]` is the return type

In Javascript, there is no typing magics.

<blockquote type="tip">

Javascript is weak and dynamic - types are coerced into other forms during expressions - for instance “3” + 2 will be “32” in JS, and 3 + “2” will be 5; in JS even [] and {} have numeric values and can be used without explicit conversion within an expression

</blockquote>

That's where Typescript comes in to save you.

## Code Readability and Maintainability

By explicitly specifying types, TypeScript code tends to be more self-documenting and easier to understand, leading to improved code maintainability, especially in large codebases.

For instance

```js
function add(n1, n2) {
  return n1 + n2;
}
```

From this function, can we guess what type it requires and what type it returns?? Its merely impossible to do it in Javascript. But lets take Typescript now

```ts
function add(n1: number, n2: number): number {
  return n1 + n2;
}
```

With this, you can easily say that it requires 2 numbers and returns a number.

## Tooling and IDE Support

TypeScript and modern IDEs love each other. They offer features such as IntelliSense, code navigation, and automatic refactoring, enhancing developer productivity.

For example, it gives error even before runtime.

```ts
const a = 1;

if (a === 0) {
  console.log("a is 0");
}
// This comparison appears to be unintentional because the types '1' and '0' have no overlap.
```

Because Typescript knows that with this logic, `a` can never be 0 so it gives an error/warning

## Customizability

Other languages are strict and their behaviour cannot be customized. But Typescript is not such language. You can configure its behaviour to be strict or be easy on you if needed.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "allowJs": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "strict": true
  }
}
```

Learn more about its configuration here: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

## Support for Modern JavaScript Features

TypeScript supports all modern JavaScript features, including ES6+ syntax, modules, and asynchronous programming constructs like Promises and async/await. This allows developers to leverage the latest language features while enjoying the benefits of static typing.

## Future-Proofing and Scalability

By embracing TypeScript, developers future-proof their codebases and ensure scalability as projects grow in complexity. The static typing provided by TypeScript enables better code organization, refactoring, and maintenance, leading to more sustainable and scalable applications.

TypeScript makes codebases more resilient to changes, making it easier to refactor, extend, and maintain them over time. Developers can define clear interfaces, enforce coding standards, and modularize code, enabling teams to collaborate more effectively and maintain larger codebases with confidence.

```ts
// TypeScript code organization and scalability
interface Product {
  id: number;
  name: string;
  price: number;
}

function calculateTotal(products: Product[]): number {
  return products.reduce((total, product) => total + product.price, 0);
}
```

With this, developers can easily understand that Product object only contains those three properties and the argument of the function requires an Array of Product.

---

## Conclusion

All things considered, there are many advantages to switching from JavaScript to TypeScript. These advantages include better code readability and maintainability, enhanced tooling support, stronger error detection, support for modern JavaScript features, a thriving community, and future-proofing for scalability. Considering these benefits, switching to TypeScript can improve web application quality and development experience dramatically.

But the person who wants to learn Typescript should have a stronger knowledge base on Javascript as without Javascript, Typescript is nothing.

References:

- https://typescriptlang.org
- [Quora Post](https://www.quora.com/Why-does-JavaScript-get-such-a-bad-rap-for-not-being-strongly-typed-but-languages-like-Python-and-R-dont#:~:text=Javascript%20is%20weak%20and%20dynamic,explicit%20conversion%20within%20an%20expression.)
