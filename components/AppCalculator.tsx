"use client";

import { useState } from "react";

const apply = (a: number, op: string, b: number) => {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
};

const fmt = (n: number): string => {
  if (Number.isNaN(n)) return "Error";
  if (!Number.isFinite(n)) return "∞";
  const r = Math.round(n * 1e10) / 1e10;
  return String(r);
};

/** Functional calculator — immediate execution like the macOS one. */
export default function AppCalculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const press = (key: string) => {
    if (/\d/.test(key)) {
      if (overwrite) {
        setDisplay(key);
        setOverwrite(false);
      } else {
        setDisplay((d) => (d === "0" ? key : d.length >= 12 ? d : d + key));
      }
      return;
    }
    if (key === ".") {
      if (overwrite) {
        setDisplay("0.");
        setOverwrite(false);
      } else if (!display.includes(".")) {
        setDisplay((d) => d + ".");
      }
      return;
    }
    if (key === "C") {
      setDisplay("0");
      setAcc(null);
      setOp(null);
      setOverwrite(true);
      return;
    }
    if (key === "⌫") {
      if (overwrite) return;
      setDisplay((d) => (d.length <= 1 || (d.length === 2 && d.startsWith("-")) ? "0" : d.slice(0, -1)));
      return;
    }
    if (key === "±") {
      setDisplay((d) => (d === "0" || d === "Error" ? d : d.startsWith("-") ? d.slice(1) : "-" + d));
      return;
    }
    if (key === "%") {
      setDisplay((d) => fmt(parseFloat(d) / 100));
      return;
    }
    // operators + =
    const cur = parseFloat(display);
    if (key === "=") {
      if (op !== null && acc !== null) {
        setDisplay(fmt(apply(acc, op, cur)));
        setAcc(null);
        setOp(null);
      }
      setOverwrite(true);
      return;
    }
    if (op !== null && acc !== null && !overwrite) {
      const r = apply(acc, op, cur);
      setDisplay(fmt(r));
      setAcc(r);
    } else {
      setAcc(cur);
    }
    setOp(key);
    setOverwrite(true);
  };

  const Btn = ({ k, cls = "", label }: { k: string; cls?: string; label?: string }) => (
    <button className={`calc-btn ${cls}`} onClick={() => press(k)} aria-label={label ?? k}>
      {k}
    </button>
  );

  return (
    <div className="app-calc">
      <div className="calc-display" title={display}>
        {display}
      </div>
      <div className="calc-grid">
        <Btn k="C" cls="fn" label="Clear" />
        <Btn k="±" cls="fn" label="Negate" />
        <Btn k="%" cls="fn" label="Percent" />
        <Btn k="/" cls="op" label="Divide" />
        <Btn k="7" />
        <Btn k="8" />
        <Btn k="9" />
        <Btn k="*" cls="op" label="Multiply" />
        <Btn k="4" />
        <Btn k="5" />
        <Btn k="6" />
        <Btn k="-" cls="op" label="Subtract" />
        <Btn k="1" />
        <Btn k="2" />
        <Btn k="3" />
        <Btn k="+" cls="op" label="Add" />
        <Btn k="0" cls="zero" />
        <Btn k="." />
        <Btn k="⌫" cls="fn" label="Backspace" />
        <Btn k="=" cls="eq" label="Equals" />
      </div>
    </div>
  );
}