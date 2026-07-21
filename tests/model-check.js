const assert = require("node:assert/strict");
const model = require("../model.js");

function close(actual, expected) {
  assert.equal(model.round1(actual), expected);
}

const force4 = model.forceReadings({
  wheelRadius: 4,
  axleRadius: 2,
  loadForce: 60,
  turns: 1
});

const force8 = model.forceReadings({
  wheelRadius: 8,
  axleRadius: 2,
  loadForce: 60,
  turns: 1
});

const force12 = model.forceReadings({
  wheelRadius: 12,
  axleRadius: 2,
  loadForce: 60,
  turns: 1
});

assert.equal(force4.forceRatio, 2);
assert.equal(force8.forceRatio, 4);
assert.equal(force12.forceRatio, 6);
close(force4.requiredEffort, 30);
close(force8.requiredEffort, 15);
close(force12.requiredEffort, 10);
close(force4.wheelDistance, 25.1);
close(force8.wheelDistance, 50.3);
close(force12.wheelDistance, 75.4);
close(force4.axleDistance, 12.6);
close(force8.axleDistance, 12.6);
close(force12.axleDistance, 12.6);

const speed12 = model.speedReadings({
  wheelRadius: 12,
  axleRadius: 2,
  inputRate: 1,
  seconds: 1
});

assert.equal(speed12.wheelRotations, 1);
assert.equal(speed12.axleRotations, 1);
close(speed12.axleSpeed, 12.6);
close(speed12.wheelSpeed, 75.4);

const challenge8 = model.challengeReadings({ wheelRadius: 8, axleRadius: 2, loadForce: 60, maxEffort: 12 });
const challenge10 = model.challengeReadings({ wheelRadius: 10, axleRadius: 2, loadForce: 60, maxEffort: 12 });

assert.equal(challenge8.meetsLimit, false);
assert.equal(challenge10.meetsLimit, true);
close(challenge10.requiredEffort, 12);
close(challenge10.wheelDistance, 62.8);
close(challenge10.axleDistance, 12.6);

console.log("model checks passed");
