import { useState, useCallback } from "react";

type Operator = "+" | "-" | "×" | "÷" | null;

function formatDisplay(value: string): string {
  const parts = value.split(".");
  const intPart = parts[0].replace(/\s/g, "").replace(/-/g, "");
  if (!intPart) return value;
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const sign = value.startsWith("-") ? "-" : "";
  return sign + formatted + (parts.length > 1 ? "." + parts[1] : "");
}

function rawNumber(display: string): string {
  return display.replace(/\s/g, "");
}

function compute(a: number, op: Operator, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : 0;
    default: return b;
  }
}

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (waitingForSecond) {
        setDisplay(digit);
        setWaitingForSecond(false);
      } else {
        const raw = rawNumber(display);
        if (raw === "0" && digit !== ".") {
          setDisplay(digit);
        } else if (digit === "." && raw.includes(".")) {
          return;
        } else {
          setDisplay(formatDisplay(raw + digit));
        }
      }
    },
    [display, waitingForSecond]
  );

  const handleDoubleZero = useCallback(() => {
    if (waitingForSecond) {
      setDisplay("0");
      setWaitingForSecond(false);
    } else {
      const raw = rawNumber(display);
      if (raw !== "0") {
        setDisplay(formatDisplay(raw + "00"));
      }
    }
  }, [display, waitingForSecond]);

  const handleOperator = useCallback(
    (nextOp: Operator) => {
      const current = parseFloat(rawNumber(display));
      if (firstOperand !== null && !waitingForSecond) {
        const result = compute(firstOperand, operator, current);
        const resultStr = Number.isInteger(result) ? String(result) : result.toFixed(2);
        setDisplay(formatDisplay(resultStr));
        setFirstOperand(result);
      } else {
        setFirstOperand(current);
      }
      setOperator(nextOp);
      setWaitingForSecond(true);
    },
    [display, firstOperand, operator, waitingForSecond]
  );

  const handleEquals = useCallback(() => {
    if (firstOperand === null || operator === null) return;
    const current = parseFloat(rawNumber(display));
    const result = compute(firstOperand, operator, current);
    const resultStr = Number.isInteger(result) ? String(result) : result.toFixed(2);
    setDisplay(formatDisplay(resultStr));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(true);
  }, [display, firstOperand, operator]);

  const handleToggleSign = useCallback(() => {
    const raw = rawNumber(display);
    if (raw === "0") return;
    if (raw.startsWith("-")) {
      setDisplay(formatDisplay(raw.substring(1)));
    } else {
      setDisplay(formatDisplay("-" + raw));
    }
  }, [display]);

  const handlePercent = useCallback(() => {
    const current = parseFloat(rawNumber(display));
    const result = current / 100;
    const resultStr = Number.isInteger(result)
      ? String(result)
      : result.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    setDisplay(formatDisplay(resultStr));
  }, [display]);

  const handlePress = useCallback(
    (label: string, type: string) => {
      switch (type) {
        case "digit":
          if (label === "00") handleDoubleZero();
          else handleDigit(label);
          break;
        case "op":
          handleOperator(label as Operator);
          break;
        case "equal":
          handleEquals();
          break;
        case "action":
          if (label === "C") handleClear();
          else if (label === "±") handleToggleSign();
          else if (label === "%") handlePercent();
          break;
      }
    },
    [handleDigit, handleDoubleZero, handleOperator, handleEquals, handleClear, handleToggleSign, handlePercent]
  );

  return {
    display,
    firstOperand,
    operator,
    handlePress,
  };
}
