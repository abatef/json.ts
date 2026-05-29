import type { TokenStream } from './scanner';

type ValueType = 'Object' | 'Array' | 'Member' | 'Value';

class JsonValue {
  protected type_: ValueType;
  public constructor(type: ValueType) {
    this.type_ = type;
  }

  public get type() {
    return this.type_;
  }
}

class JsonMember extends JsonValue {
  private key_: string;
  private val_: JsonValue;
  public constructor(key: string, val: JsonValue) {
    super('Member');
    this.key_ = key;
    this.val_ = val;
  }

  public get key(): string {
    return this.key_;
  }

  public get value(): JsonValue {
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

  public parseValue() {
    if (this.ts.match('Left Bracket')) {
      this.parseArray();
    } else if (this.ts.match('Left Brace')) {
      this.parseObject();
    } else if (this.ts.match('String')) {
      // Parse String
    } else if (this.ts.match('True') || this.ts.match('False') || this.ts.match('Null')) {
      // Parse Literal
    } else if (this.ts.match('Number')) {
      // Parse Number
    }
  }

  private parseArray() {
    this.parseValue();
    if (this.ts.match('Comma')) {
      this.parseValue();
    } else if (this.ts.match('Right Bracket')) {
      // End Array
    }
  }
  private parseObject() {}
}
