import type { TokenStream } from './scanner';

type ValueType = 'Object' | 'Array' | 'Member' | 'Literal';
type LiteralType = 'String' | 'Boolean' | 'Number' | 'Null';

class JsonValue {
  protected type_: ValueType;
  public constructor(type: ValueType) {
    this.type_ = type;
  }

  public get type() {
    return this.type_;
  }
}

class JsonLiteral extends JsonValue {
  private value_: string | number | boolean | null | undefined;
  private literalType_: LiteralType;
  public constructor(value: string | number | boolean | null | undefined, type: LiteralType) {
    super('Literal');
    this.value_ = value;
    this.literalType_ = type;
  }

  public get value(): string | number | boolean | null | undefined {
    return this.value_;
  }

  public get literalType(): LiteralType {
    return this.literalType_;
  }
}

class JsonMember extends JsonValue {
  private key_: string | undefined;
  private val_: JsonValue | undefined;
  public constructor(key: string | undefined, val: JsonValue | undefined) {
    super('Member');
    this.key_ = key;
    this.val_ = val;
  }

  public get key(): string | undefined {
    return this.key_;
  }

  public get value(): JsonValue | undefined {
    return this.val_;
  }
}

class JsonObject extends JsonValue {
  private members_: JsonMember[];
  public constructor() {
    super('Object');
    this.members_ = [];
  }

  public addMember(member: JsonMember) {
    this.members_.push(member);
  }

  public get members() {
    return this.members_;
  }
}

class JsonArray extends JsonValue {
  private elements_: JsonValue[];
  public constructor() {
    super('Array');
    this.elements_ = [];
  }

  public addElement(element: JsonValue) {
    this.elements_.push(element);
  }

  public get elements() {
    return this.elements_;
  }

  public at(index: number): JsonValue | undefined {
    if (index >= 0 && index < this.elements_.length) {
      return this.elements_[index];
    }
    return undefined;
  }
}

class Parser {
  private ts: TokenStream;

  public constructor(ts: TokenStream) {
    this.ts = ts;
  }

  public parseValue(): JsonValue | undefined {
    if (this.ts.match('Left Bracket')) {
      this.parseArray();
    } else if (this.ts.match('Left Brace')) {
      return this.parseObject();
    } else if (this.ts.match('String')) {
      const key: string | undefined = this.ts.peek()?.value;
      this.ts.advance();
      if (this.ts.match('Colon')) {
        this.ts.advance();
        const value: JsonValue | undefined = this.parseValue();
        return new JsonMember(key, value);
      } else {
        return new JsonLiteral(key, 'String');
      }
    } else if (this.ts.match('True') || this.ts.match('False')) {
      const value: boolean = this.ts.peek()?.type ? true : false;
      this.ts.advance();
      return new JsonLiteral(value, 'Boolean');
    } else if (this.ts.match('Number')) {
      const value: string | undefined = this.ts.peek()?.value;
      this.ts.advance();
      if (value) {
        return new JsonLiteral(Number.parseInt(value), 'Number');
      }
    }
    return undefined;
  }

  private parseArray(): JsonArray {
    this.parseValue();
    if (this.ts.match('Comma')) {
      this.parseValue();
    } else if (this.ts.match('Right Bracket')) {
      // End Array
    }

    return new JsonArray();
  }
  private parseObject(): JsonObject {
    return new JsonObject();
  }
}

export { Parser, JsonArray, JsonObject, JsonMember, JsonValue, JsonLiteral };
