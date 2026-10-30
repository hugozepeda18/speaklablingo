// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { useLessonStore, XP_POR_EJERCICIO } from "./lessonStore.ts";

const ex = (id, correct_answer) => ({ id, correct_answer });

test("wrong answers requeue, lesson ends only when all are correct", () => {
  const s = useLessonStore;
  s.getState().iniciarLeccion([ex("a", "suis allé"), ex("b", "B")]);
  assert.equal(s.getState().ejercicioActual.id, "a");

  assert.equal(s.getState().responder("suis alle"), false); // accents count
  assert.deepEqual(s.getState().ejerciciosPendientes.map((e) => e.id), ["b", "a"]);
  assert.equal(s.getState().xpAcumulada, 0);

  assert.equal(s.getState().responder("  b "), true);
  assert.equal(s.getState().responder("Suis  Allé"), true);
  assert.equal(s.getState().ejerciciosPendientes.length, 0);
  assert.equal(s.getState().ejercicioActual, null);
  assert.equal(s.getState().xpAcumulada, 2 * XP_POR_EJERCICIO);
  assert.equal(s.getState().responder("x"), false); // no-op on empty queue
});
