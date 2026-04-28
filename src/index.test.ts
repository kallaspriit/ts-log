import { describe, it, expect, vi } from "vitest";
import { dummyLogger, Logger } from "./index";

class Calculator {
  constructor(private readonly log: Logger = dummyLogger) {}

  sum(a: number, b: number) {
    const result = a + b;
    this.log.trace(`trace summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.debug(`debug summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.info(`info summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.warn(`warn summing ${a} + ${b} = ${result}`, a, b, result);
    this.log.error(`error summing ${a} + ${b} = ${result}`, a, b, result);
    return result;
  }
}

describe("ts-log", () => {
  it("should export the Logger interface and dummyLogger", () => {
    expect(dummyLogger).toBeDefined();
    expect(typeof dummyLogger.trace).toBe("function");
    expect(typeof dummyLogger.debug).toBe("function");
    expect(typeof dummyLogger.info).toBe("function");
    expect(typeof dummyLogger.warn).toBe("function");
    expect(typeof dummyLogger.error).toBe("function");
  });

  it("dummyLogger methods should accept arguments and return undefined", () => {
    expect(dummyLogger.trace("msg", 1, 2)).toBeUndefined();
    expect(dummyLogger.debug("msg", 1, 2)).toBeUndefined();
    expect(dummyLogger.info("msg", 1, 2)).toBeUndefined();
    expect(dummyLogger.warn("msg", 1, 2)).toBeUndefined();
    expect(dummyLogger.error("msg", 1, 2)).toBeUndefined();
  });

  it("should work with dummyLogger as default", () => {
    const calculator = new Calculator();
    expect(calculator.sum(1, 2)).toBe(3);
  });

  it("should work with console as logger", () => {
    const traceSpy = vi.spyOn(console, "trace").mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const calculator = new Calculator(console);
    expect(calculator.sum(1, 2)).toBe(3);

    expect(traceSpy).toHaveBeenCalledWith("trace summing 1 + 2 = 3", 1, 2, 3);
    expect(debugSpy).toHaveBeenCalledWith("debug summing 1 + 2 = 3", 1, 2, 3);
    expect(infoSpy).toHaveBeenCalledWith("info summing 1 + 2 = 3", 1, 2, 3);
    expect(warnSpy).toHaveBeenCalledWith("warn summing 1 + 2 = 3", 1, 2, 3);
    expect(errorSpy).toHaveBeenCalledWith("error summing 1 + 2 = 3", 1, 2, 3);

    traceSpy.mockRestore();
    debugSpy.mockRestore();
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should work with a custom logger and call all methods", () => {
    const customLogger: Logger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const calculator = new Calculator(customLogger);
    calculator.sum(1, 2);

    expect(customLogger.trace).toHaveBeenCalledWith("trace summing 1 + 2 = 3", 1, 2, 3);
    expect(customLogger.debug).toHaveBeenCalledWith("debug summing 1 + 2 = 3", 1, 2, 3);
    expect(customLogger.info).toHaveBeenCalledWith("info summing 1 + 2 = 3", 1, 2, 3);
    expect(customLogger.warn).toHaveBeenCalledWith("warn summing 1 + 2 = 3", 1, 2, 3);
    expect(customLogger.error).toHaveBeenCalledWith("error summing 1 + 2 = 3", 1, 2, 3);
  });

  it("console should satisfy the Logger interface", () => {
    // compile-time structural type check — if console doesn't satisfy Logger, tsc will fail
    const logger: Logger = console;
    const spy = vi.spyOn(logger, "info").mockImplementation(() => {});
    logger.info("type-check");
    expect(spy).toHaveBeenCalledWith("type-check");
    spy.mockRestore();
  });
});
