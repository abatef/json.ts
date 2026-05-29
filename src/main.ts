import { Scanner, TokenStream } from './scanner.ts';
import { Parser } from './parser.ts';

function RunMain() {
  const json = `{ "name": 12 }`;
  const scanner: Scanner = new Scanner(json);
  scanner.scan();
  const stream: TokenStream = scanner.getTokenStream();
  const parser = new Parser(stream);
  const value = parser.parseValue();
  console.log(value);
}

RunMain();
