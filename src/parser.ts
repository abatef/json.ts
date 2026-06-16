import type { TokenStream } from './scanner';
import { PrettyPrintVisitor } from './prettyPrint.ts';

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

  public toString(): string | undefined {
    return undefined;
  }

  public accept(visitor: PrettyPrintVisitor) {
    visitor.visitValue(this);
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

  public toString(): string | undefined {
    if (
      this.literalType_ === 'Number' ||
      this.literalType_ === 'Boolean' ||
      this.literalType_ === 'Null'
    ) {
      return this.value_?.toString();
    }
    return `"${this.value_?.toString()}"`;
  }

  public accept(visitor: PrettyPrintVisitor) {
    visitor.visitLiteral(this);
  }
}

class JsonMember extends JsonValue {
  private key_: JsonValue | undefined;
  private val_: JsonValue | undefined;
  public constructor(key: JsonValue | undefined, val: JsonValue | undefined) {
    super('Member');
    this.key_ = key;
    this.val_ = val;
  }

  public get key(): JsonValue | undefined {
    return this.key_;
  }

  public get value(): JsonValue | undefined {
    return this.val_;
  }

  public toString(): string | undefined {
    return this.key?.toString() + ': ' + this.value?.toString();
  }

  public accept(visitor: PrettyPrintVisitor) {
    visitor.visitMember(this);
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

  public toString(): string | undefined {
    let objStr = '{ ';
    for (const member of this.members_) {
      objStr += member.toString() + ', ';
    }
    objStr = objStr.slice(0, -2);
    objStr += ' }';
    return objStr;
  }

  public accept(visitor: PrettyPrintVisitor) {
    visitor.visitObject(this);
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

  public toString(): string | undefined {
    let arrStr = '[ ';
    for (const element of this.elements_) {
      arrStr += element.toString() + ', ';
    }
    arrStr = arrStr.slice(0, -2);
    arrStr += ' ]';
    return arrStr;
  }

  public accept(visitor: PrettyPrintVisitor) {
    visitor.visitArray(this);
  }
}

class Parser {
  private ts_: TokenStream;

  public constructor(ts: TokenStream) {
    this.ts_ = ts;
  }

  public parseValue(): JsonValue | undefined {
    if (this.ts_.match('Left Bracket')) {
      const array: JsonArray = new JsonArray();
      return this.parseArray(array);
    } else if (this.ts_.match('Left Brace')) {
      const object: JsonObject = new JsonObject();
      return this.parseObject(object);
    } else if (this.ts_.match('String')) {
      const key: string | undefined = this.ts_.peek()?.value;
      this.ts_.advance();
      return new JsonLiteral(key, 'String');
    } else if (this.ts_.match('True') || this.ts_.match('False')) {
      const value: boolean = this.ts_.peek()?.type === 'True' ? true : false;
      this.ts_.advance();
      return new JsonLiteral(value, 'Boolean');
    } else if (this.ts_.match('Number')) {
      const value: string | undefined = this.ts_.peek()?.value;
      this.ts_.advance();
      if (value) {
        return new JsonLiteral(Number.parseFloat(value), 'Number');
      }
    } else if (this.ts_.match('Null')) {
      this.ts_.advance();
      return new JsonLiteral(null, 'Null');
    }

    return undefined;
  }

  private parseArray(array: JsonArray): JsonArray {
    if (this.ts_.match('Left Bracket') || this.ts_.match('Comma')) {
      this.ts_.advance();
      const element: JsonValue | undefined = this.parseValue();
      if (element) {
        array.addElement(element);
      }

      if (this.ts_.match('Comma')) {
        array = this.parseArray(array);
      } else if (this.ts_.match('Right Bracket')) {
        this.ts_.advance();
        return array;
      } else {
        throw new SyntaxError("expected ']'");
      }
    }
    return array;
  }

  private parseMember(): JsonMember | undefined {
    if (this.ts_.match('String')) {
      const key: JsonValue | undefined = this.parseValue();
      if (key) {
        if (this.ts_.match('Colon')) {
          this.ts_.advance();
          const value: JsonValue | undefined = this.parseValue();
          if (value) {
            return new JsonMember(key, value);
          }
        } else if (this.ts_.match('Comma')) {
          return new JsonMember(key, undefined);
        }
      }
    }
  }

  private parseObject(object: JsonObject): JsonObject {
    if (this.ts_.match('Left Brace') || this.ts_.match('Comma')) {
      this.ts_.advance();
      let member: JsonMember | undefined = this.parseMember();
      if (member) {
        object.addMember(member);
      }
      while (this.ts_.match('Comma')) {
        this.ts_.advance();
        member = this.parseMember();
        if (member) {
          object.addMember(member);
        }
      }
      if (this.ts_.match('Right Brace')) {
        this.ts_.advance();
        return object;
      } else {
        throw new SyntaxError("exptected '}'");
      }
    }
    return object;
  }
}

export { Parser, JsonArray, JsonLiteral, JsonMember, JsonObject, JsonValue };
