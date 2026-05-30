import { Scanner, TokenStream } from './scanner.ts';
import { Parser } from './parser.ts';

function RunMain() {
  const json = `[1, 2, 3, 4, "Hello", true, false, null]`;
  const scanner: Scanner = new Scanner(json);
  scanner.scan();
  const stream: TokenStream = scanner.getTokenStream();
  const parser = new Parser(stream);
  const value = parser.parseValue();
  console.log(value);
}

RunMain();
