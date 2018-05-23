import * as fs from "fs";
import { dummyLogger, Logger } from "../src";

// example custom logger that logs to a file
class FileLogger implements Logger {
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
  public constructor(private readonly log: Logger = dummyLogger) {}

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
