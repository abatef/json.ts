import { JsonValue, JsonLiteral, JsonArray, JsonMember, JsonObject } from './parser.ts';

export class PrettyPrintVisitor {
  private jsonString: string = '';
  private ident: number = 0;
  public visitValue(value: JsonValue) {
    value.accept(this);
  }
  public visitLiteral(literal: JsonLiteral) {
    this.jsonString += literal.toString();
  }
  public visitMember(member: JsonMember) {
    this.jsonString += ' '.repeat(this.ident);
    this.jsonString += member.key?.toString() + ': ';
    member.value?.accept(this);
  }
  public visitObject(object: JsonObject) {
    this.ident += 2;
    this.jsonString += '{\n';
    for (let i = 0; i < object.members.length; i++) {
      object.members[i].accept(this);
      if (i !== object.members.length - 1) {
        this.jsonString += ',\n';
      } else {
        this.jsonString += '\n';
      }
    }
    this.ident -= 2;
    this.jsonString += ' '.repeat(this.ident) + '}';
  }
  public visitArray(array: JsonArray) {
    this.jsonString += '[\n';
    this.ident += 2;
    for (let i = 0; i < array.elements.length; i++) {
      this.jsonString += ' '.repeat(this.ident);
      array.elements[i].accept(this);
      if (i !== array.elements.length - 1) {
        this.jsonString += ',\n';
      } else {
        this.jsonString += '\n';
      }
    }
    this.ident -= 2;
    this.jsonString += ' '.repeat(this.ident) + ']';
  }

  public toString(): string {
    return this.jsonString;
  }

  public get json() {
    return this.jsonString;
  }
}
