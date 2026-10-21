import { markPath } from "../brand/automaton";

/** Approved Automaton geometry; follows the surrounding light or dark palette. */
export function AutomatonMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="122 54 1000 1000" fill="currentColor" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}><path d={markPath} /></svg>;
}
