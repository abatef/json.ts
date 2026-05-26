import { Scanner, TokenStream } from './scanner.ts';

function RunMain() {
  const scanner: Scanner = new Scanner(`{"name": "Alex", "age": 22}`);
  scanner.scan();
  const stream: TokenStream = scanner.getTokenStream();

  console.log(stream.getAllTokens());
}

RunMain();
