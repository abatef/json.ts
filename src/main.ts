import { Scanner, TokenStream } from './scanner.ts';
import { Parser } from './parser.ts';
import { PrettyPrintVisitor } from './prettyPrint.ts';

function runTest(json: string) {
  const scanner: Scanner = new Scanner(json);
  scanner.scan();
  const stream: TokenStream = scanner.getTokenStream();
  const parser = new Parser(stream);
  const value = parser.parseValue();
  return value;
}

function testPrettyJson() {
  const spec = `{
        "Image": {
            "Width":  800,
            "Height": 600,
            "Title":  "View from 15th Floor",
            "Thumbnail": {
                "Url":    "http://www.example.com/image/481989943",
                "Height": 125,
                "Width":  100
            },
            "Animated" : false,
            "IDs": [116, 943, 234, 38793]
          }
      }`;
  const value = runTest(spec);
  const visitor = new PrettyPrintVisitor();
  value?.accept(visitor);
  console.log(visitor.json);
}

function testNonPrettyJson() {
  const json = `{"name": "Max", "age": 22, "married": true, "wife": "Vivian", "childern": ["Luke", "Emma", "Ellie"]}`;
  const value = runTest(json);
  const visitor = new PrettyPrintVisitor();
  value?.accept(visitor);
  console.log(visitor.json);
}

function testOnlyArrayJson() {
  const array = `[
        {
           "precision": "zip",
           "Latitude":  .7668,
           "Longitude": 2,
           "Address":   "",
           "City":      "SAN FRANCISCO",
           "State":     "CA",
           "Zip":       "94107",
           "Country":   "US"
        },
        {
           "precision": "zip",
           "Latitude":  37.371991,
           "Longitude": -122.026020,
           "Address":   "",
           "City":      "SUNNYVALE",
           "State":     "CA",
           "Zip":       "94085",
           "Country":   "US"
        }
      ]
`;

  const value = runTest(array);
  const visitor = new PrettyPrintVisitor(2);
  value?.accept(visitor);
  console.log(visitor.json);
}

function runAllTests() {
  testPrettyJson();
  testNonPrettyJson();
  testOnlyArrayJson();
}

runAllTests();
