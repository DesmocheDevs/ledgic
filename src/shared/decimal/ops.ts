import { Decimal } from "decimal.js";

export function add(a: string, b: string): string {
  return new Decimal(a).add(new Decimal(b)).toString();
}

export function subtract(a: string, b: string): string {
  return new Decimal(a).sub(new Decimal(b)).toString();
}

export function multiply(a: string, b: string): string {
  return new Decimal(a).mul(new Decimal(b)).toString();
}

export function divide(a: string, b: string): string {
  return new Decimal(a).div(new Decimal(b)).toString();
}

export function isGreaterThan(a: string, b: string): boolean {
  return new Decimal(a).gt(new Decimal(b));
}

export function isLessThan(a: string, b: string): boolean {
  return new Decimal(a).lt(new Decimal(b));
}

export function roundToDecimals(value: string, decimals: number): string {
  return new Decimal(value).toFixed(decimals);
}
