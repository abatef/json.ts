import { JsonValue, JsonLiteral, JsonArray, JsonMember, JsonObject } from './parser.ts';

export class PrettyPrintVisitor {
  private json_: string = '';
  private indent_: number = 0;
  private indentFactor_: number;

  public constructor(indentFactor: number = 2) {
    this.indentFactor_ = indentFactor;
  }

  private get indent(): number {
    return this.indent_ * this.indentFactor_;
  }

  public visitValue(value: JsonValue) {
    value.accept(this);
  }

  public visitLiteral(literal: JsonLiteral) {
    this.json_ += literal.toString();
  }

  public visitMember(member: JsonMember) {
    this.json_ += ' '.repeat(this.indent);
    this.json_ += member.key?.toString() + ': ';
    member.value?.accept(this);
  }

  public visitObject(object: JsonObject) {
    this.indent_ += 1;
    this.json_ += '{\n';
    for (let i = 0; i < object.members.length; i++) {
      object.members[i].accept(this);
      if (i !== object.members.length - 1) {
        this.json_ += ',\n';
      } else {
        this.json_ += '\n';
      }
    }
    this.indent_ -= 1;
    this.json_ += ' '.repeat(this.indent) + '}';
  }

  public visitArray(array: JsonArray) {
    this.json_ += '[\n';
    this.indent_ += 1;
    for (let i = 0; i < array.elements.length; i++) {
      this.json_ += ' '.repeat(this.indent);
      array.elements[i].accept(this);
      if (i !== array.elements.length - 1) {
        this.json_ += ',\n';
      } else {
        this.json_ += '\n';
      }
    }
    this.indent_ -= 1;
    this.json_ += ' '.repeat(this.indent) + ']';
  }

  public toString(): string {
    return this.json_;
  }

  public get json() {
    return this.json_;
  }
}
