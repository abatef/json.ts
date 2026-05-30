import { Scanner, TokenStream } from './scanner.ts';
import { Parser } from './parser.ts';

function RunMain() {
  const json = `{"name": "Max", "age": 22, "married": true, "childern": ["Luke", "Emma", "Ellie"]}`;
  const scanner: Scanner = new Scanner(json);
  scanner.scan();
  const stream: TokenStream = scanner.getTokenStream();
  const parser = new Parser(stream);
  const value = parser.parseValue();
  console.dir(value, { depth: null });
}

RunMain();
