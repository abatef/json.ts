type TokenType =
  | 'Left Bracket'
  | 'Right Bracket'
  | 'Left Brace'
  | 'Right Brace'
  | 'Colon'
  | 'Comma'
  | 'Number'
  | 'String'
  | 'False'
  | 'True'
  | 'Null';

interface Token {
  type: TokenType;
  value: string | undefined;
}

class TokenStream {
  private tokens: Token[];
  private current: number;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  public getCurrent(): Token | undefined {
    if (this.current < this.tokens.length) {
      return this.tokens[this.current];
    }
    return undefined;
  }
}

class Scanner {
  private data: string;
  private current: number;
  private tokens: Token[];

  constructor(data: string) {
    this.current = 0;
    this.data = data;
    this.tokens = [];
  }

  public getTokenStream(): TokenStream {
    return new TokenStream(this.tokens);
  }

  private currentChar() {
    return this.data[this.current];
  }

  private makeToken(type: TokenType, value: string | undefined = undefined): void {
    const token = { type: type, value: value };
    this.tokens.push(token);
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isChar(char: string): boolean {
    return char >= 'a' && char <= 'z';
  }

  public scan() {
    while (this.current < this.data.length) {
      this.skipSpaces();
      const char = this.currentChar();
      switch (char) {
        case '[':
          this.makeToken('Left Bracket');
          break;
        case ']':
          this.makeToken('Right Bracket');
          break;
        case '{':
          this.makeToken('Left Brace');
          break;
        case '}':
          this.makeToken('Right Brace');
          break;
        case ':':
          this.makeToken('Colon');
          break;
        case ',':
          this.makeToken('Comma');
          break;
        default:
          break;
      }

      if (char === '"' || char === "'") {
        this.scanString();
      } else if (this.isDigit(char)) {
        this.scanNumber();
      } else if (this.isChar(char)) {
        this.scanLiteral();
      }
    }
  }

  private scanNumber(): void {
    let number: string = '';
    while (this.isDigit(this.currentChar())) {
      number += this.currentChar();
      this.current++;
    }
    this.makeToken('Number', number);
  }

  private scanString(): void {
    const quote = this.currentChar();
    this.current++;
    let string: string = '';
    while (this.currentChar() !== quote) {
      string += this.currentChar();
      this.current++;
    }
    this.current++;
    this.makeToken('String', string);
  }

  private scanLiteral(): void {
    if (this.currentChar() === 't' /* true */) {
      const trueString = this.data.substring(this.current, this.current + 4);
      if (trueString === 'true') {
        this.makeToken('True');
        this.current += 4;
      }
    } else if (this.currentChar() === 'f' /* false */) {
      const falseString = this.data.substring(this.current, this.current + 5);
      if (falseString === 'false') {
        this.makeToken('False');
        this.current += 5;
      }
    } else if (this.currentChar() === 'n' /* null */) {
      const nullString = this.data.substring(this.current, this.current + 4);
      if (nullString === 'null') {
        this.makeToken('Null');
        this.current += 4;
      }
    } else {
      this.reportError('not valid literal value', this.currentChar());
    }
  }

  private skipSpaces(): void {
    while (this.currentChar() === ' ') {
      this.current++;
    }
  }

  private reportError(msg: string, where: string, dump: boolean = false): void {
    console.error(`Error: ${msg}, at ${where}`);
    if (dump) this.dump();
  }

  private dump(): void {
    console.error(this);
  }
}
