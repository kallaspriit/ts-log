# TypeScript Abstract Logger

[![Travis](https://img.shields.io/travis/kallaspriit/ts-log.svg)](https://travis-ci.org/kallaspriit/ts-log)
[![Coverage](https://img.shields.io/coveralls/kallaspriit/ts-log.svg)](https://coveralls.io/github/kallaspriit/ts-log)
[![Downloads](https://img.shields.io/npm/dm/ts-log.svg)](http://npm-stat.com/charts.html?package=ts-log)
[![Version](https://img.shields.io/npm/v/ts-log.svg)](http://npm.im/ts-log)
[![License](https://img.shields.io/npm/l/ts-log.svg)](http://opensource.org/licenses/MIT)

**Abstract logger TypeScript interface along with a dummy logger that does nothing.**

Useful for libraries wanting to provide a pluggable logger that does nothing by default.

- Matches the build-in console that can be directly plugged in.
- Also matches [bunyan](https://github.com/trentm/node-bunyan).
- Provides usage and custom logger example.
- Written in TypeScript, no need for extra typings.

## Installation

This package is distributed via npm

```cmd
npm install ts-log
```

## Example

```typescript
import * as fs from "fs";
import { dummyLogger, ILogger } from "../src";

// example custom logger that logs to a file
class FileLogger implements ILogger {
  private readonly fd: number;

  public constructor(filename: string) {
    this.fd = fs.openSync(filename, "a");
  }

  public trace(message?: any, ...optionalParams: any[]): void {
    this.append("TRACE", `${message} ${JSON.stringify(optionalParams)}`);
  }
  public debug(message?: any, ...optionalParams: any[]): void {
    this.append("DEBUG", `${message} ${JSON.stringify(optionalParams)}`);
  }
  public info(message?: any, ...optionalParams: any[]): void {
    this.append("INFO ", `${message} ${JSON.stringify(optionalParams)}`);
  }
  public warn(message?: any, ...optionalParams: any[]): void {
    this.append("WARN ", `${message} ${JSON.stringify(optionalParams)}`);
  }
  public error(message?: any, ...optionalParams: any[]): void {
    this.append("ERROR", `${message} ${JSON.stringify(optionalParams)}`);
  }

  private append(type: string, message: string) {
    fs.writeSync(this.fd, `${new Date().toISOString()} ${type} ${message}\n`);
  }
}

// example class that uses the logger
class Calculator {
  // accept the logger in the constructor, defaulting to dummy logger
  public constructor(private readonly log: ILogger = dummyLogger) {}

  public sum(a: number, b: number) {
    const result = a + b;

    // call the logger
    this.log.info(`summing ${a} + ${b} = ${result}`, a, b, result);

    return result;
  }
}

// don't define the logger, defaults to dummy logger that does not do anything
const calculator1 = new Calculator();

// use the build-in console as the logger
const calculator2 = new Calculator(console);

// use the custom file logger
const calculator3 = new Calculator(new FileLogger("log.txt"));

// run the calculator
calculator1.sum(2, 3);
calculator2.sum(-4, 1);
calculator3.sum(6, 3);
```

## Commands

- `yarn start` to start the example application.
- `yarn build` to build the production version.
- `yarn test` to run tests.
- `yarn coverage` to gather code coverage.
- `yarn lint` to lint the codebase.
- `yarn prettier` to run prettier.
- `yarn audit` to run all pre-commit checks (prettier, build, lint, test)