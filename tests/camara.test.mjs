import test from "node:test";
import assert from "node:assert/strict";
import { cameraLessons, boyleNormalized, inspiredOxygenHumidified, getCameraLesson, checkCameraAnswer, validateCameraContent, registerWithExistingCamera } from "../content/camara/index.mjs";

test("oito conteúdos completos, únicos e dentro da CÂMARA", () => {
  assert.equal(validateCameraContent(), true);
  assert.equal(cameraLessons.length, 8);
  assert.equal(new Set(cameraLessons.map(x => x.id)).size, 8);
  assert.ok(cameraLessons.every(x => x.section === "CAMARA" && x.paragraphs.length > 0));
});
test("Boyle: 1 ATA para 2,5 ATA equivale a V/V0 = 0,4", () => {
  assert.equal(boyleNormalized(2.5), 0.4);
  assert.throws(() => boyleNormalized(0), RangeError);
});
test("PIO₂ estimada nunca é anunciada como PaO₂", () => {
  assert.ok(Math.abs(inspiredOxygenHumidified(1, .21) - 149.73) < .01);
  assert.ok(Math.abs(inspiredOxygenHumidified(2.4, 1) - 1777) < .01);
  assert.throws(() => inspiredOxygenHumidified(2, 2), RangeError);
});
test("questões e cálculos devolvem justificativa clínica", () => {
  assert.equal(checkCameraAnswer("camara-01", 1).correct, true);
  assert.equal(checkCameraAnswer("camara-02", .4).correct, true);
  assert.equal(checkCameraAnswer("camara-02", .7).correct, false);
  assert.ok(checkCameraAnswer("camara-05", 0).explanation.length > 10);
});
test("registro usa apenas callback do app existente e impede duplicações", () => {
  const seen = [];
  const r = registerWithExistingCamera((id, payload) => seen.push({id, payload}), [getCameraLesson("camara-01"), "camara-02"]);
  assert.equal(r.registered, 6);
  assert.equal(r.skipped, 2);
  assert.equal(seen.length, 6);
  assert.throws(() => registerWithExistingCamera(null), TypeError);
});
