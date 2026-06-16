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
  line?: number;
  col?: number;
}

class TokenStream {
  private tokens_: Token[];
  private current_: number;
  constructor(tokens: Token[]) {
    this.tokens_ = tokens;
    this.current_ = 0;
  }

  public peek(offset: number = 0): Token | undefined {
    if (this.current_ + offset < this.tokens_.length) {
      return this.tokens_[this.current_ + offset];
    }
    return undefined;
  }

  public advance(offset: number = 1): Token | undefined {
    if (this.current_ + offset < this.tokens_.length) {
      this.current_ += offset;
      return this.peek();
    }
    return undefined;
  }

  public expect(type: TokenType): boolean {
    return this.peek()?.type === type;
  }

  public match(type: TokenType): boolean {
    if (this.peek()?.type === type) {
      return true;
    }
    return false;
  }

  public getAllTokens(): Token[] {
    return this.tokens_;
  }

  public current() {
    return this.tokens_[this.current_];
  }
}

class Scanner {
  private data_: string;
  private current_: number;
  private tokens_: Token[];

  constructor(data: string) {
    this.current_ = 0;
    this.data_ = data;
    this.tokens_ = [];
  }

  public getTokenStream(): TokenStream {
    return new TokenStream(this.tokens_);
  }

  private currentChar() {
    return this.data_[this.current_];
  }

  private makeToken(type: TokenType, value: string | undefined = undefined): void {
    const token = { type: type, value: value };
    this.tokens_.push(token);
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isChar(char: string): boolean {
    return char >= 'a' && char <= 'z';
  }

  public scan() {
    while (this.current_ < this.data_.length) {
      this.skipSpaces();
      const char = this.currentChar();
      switch (char) {
        case '[':
          this.makeToken('Left Bracket');
          this.current_++;
          break;
        case ']':
          this.makeToken('Right Bracket');
          this.current_++;
          break;
        case '{':
          this.makeToken('Left Brace');
          this.current_++;
          break;
        case '}':
          this.makeToken('Right Brace');
          this.current_++;
          break;
        case ':':
          this.makeToken('Colon');
          this.current_++;
          break;
        case ',':
          this.makeToken('Comma');
          this.current_++;
          break;
        default:
          break;
      }

      if (char === '"') {
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
      this.current_++;
    }
    this.makeToken('Number', number);
  }

  private scanString(): void {
    const quote = this.currentChar();
    this.current_++;
    let string: string = '';
    while (this.currentChar() !== quote) {
      string += this.currentChar();
      this.current_++;
    }
    this.current_++;
    this.makeToken('String', string);
  }

  private scanLiteral(): void {
    if (this.currentChar() === 't' /* true */) {
      const trueString = this.data_.substring(this.current_, this.current_ + 4);
      if (trueString === 'true') {
        this.makeToken('True');
        this.current_ += 4;
      }
    } else if (this.currentChar() === 'f' /* false */) {
      const falseString = this.data_.substring(this.current_, this.current_ + 5);
      if (falseString === 'false') {
        this.makeToken('False');
        this.current_ += 5;
      }
    } else if (this.currentChar() === 'n' /* null */) {
      const nullString = this.data_.substring(this.current_, this.current_ + 4);
      if (nullString === 'null') {
        this.makeToken('Null');
        this.current_ += 4;
      }
    } else {
      this.reportError('not valid literal value', this.currentChar());
    }
  }

  private skipSpaces(): void {
    while (
      this.currentChar() === ' ' ||
      this.currentChar() === '\n' ||
      this.currentChar() === '\t'
    ) {
      this.current_++;
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

export { TokenStream, Scanner };
