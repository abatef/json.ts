import { Scanner, TokenStream } from './scanner.ts';
import { Parser } from './parser.ts';

function runTest(json: string, location: Function) {
  try {
    const scanner: Scanner = new Scanner(json);
    scanner.scan();
    const stream: TokenStream = scanner.getTokenStream();
    const parser = new Parser(stream);
    const value = parser.parseValue();
    return value;
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err.message + ` at ${location.name}`);
    } else {
      console.error(err);
    }
  }
}

function testValidJson() {
  const json = `{"name": "Max", "age": 22, "married": true, "wife": "Vivian", "childern": ["Luke", "Emma", "Ellie"]}`;
  runTest(json, testValidJson);
}

function testUnterminatedObject() {
  const json = `{"name": "Max", "age": 22, "married": true, "wife": "Vivian", "childern": ["Luke", "Emma", "Ellie"]`;
  runTest(json, testUnterminatedObject);
}

function testUntermiatedArray() {
  const json = `{"name": "Max", "age": 22, "married": true, "wife": "Vivian", "childern": ["Luke", "Emma", "Ellie"}`;
  runTest(json, testUntermiatedArray);
}

function testMissingValue() {
  const json = `{"name", "age": 22, "married": true, "wife": "Vivian", "childern": ["Luke", "Emma", "Ellie"]}`;
  runTest(json, testMissingValue);
}

function runAllTests() {
  testValidJson();
  testMissingValue();
  testUntermiatedArray();
  testUnterminatedObject();
}

runAllTests();
