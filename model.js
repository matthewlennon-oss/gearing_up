(function attachWheelAxleModel(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.WheelAxleModel = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function createModel() {
  const TWO_PI = Math.PI * 2;

  function round1(value) {
    return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
  }

  function circumference(radiusCm) {
    return TWO_PI * Number(radiusCm);
  }

  function forceRatio(wheelRadiusCm, axleRadiusCm) {
    return Number(wheelRadiusCm) / Number(axleRadiusCm);
  }

  function requiredEffort(loadForceN, wheelRadiusCm, axleRadiusCm) {
    return Number(loadForceN) * Number(axleRadiusCm) / Number(wheelRadiusCm);
  }

  function forceReadings(settings) {
    const wheelRadius = Number(settings.wheelRadius);
    const axleRadius = Number(settings.axleRadius);
    const loadForce = Number(settings.loadForce);
    const turns = Number(settings.turns || 1);
    const ratio = forceRatio(wheelRadius, axleRadius);

    return {
      wheelRadius,
      axleRadius,
      loadForce,
      turns,
      forceRatio: ratio,
      requiredEffort: requiredEffort(loadForce, wheelRadius, axleRadius),
      wheelDistance: circumference(wheelRadius) * turns,
      axleDistance: circumference(axleRadius) * turns,
      wheelRotations: turns,
      axleRotations: turns
    };
  }

  function speedReadings(settings) {
    const wheelRadius = Number(settings.wheelRadius);
    const axleRadius = Number(settings.axleRadius);
    const inputRate = Number(settings.inputRate);
    const seconds = Number(settings.seconds || 1);
    const rotations = inputRate * seconds;

    return {
      wheelRadius,
      axleRadius,
      inputRate,
      seconds,
      wheelRotations: rotations,
      axleRotations: rotations,
      wheelDistance: circumference(wheelRadius) * rotations,
      axleDistance: circumference(axleRadius) * rotations,
      wheelSpeed: circumference(wheelRadius) * inputRate,
      axleSpeed: circumference(axleRadius) * inputRate
    };
  }

  function challengeReadings(settings) {
    const loadForce = Number(settings.loadForce || 60);
    const axleRadius = Number(settings.axleRadius || 2);
    const wheelRadius = Number(settings.wheelRadius);
    const maxEffort = Number(settings.maxEffort || 12);
    const force = forceReadings({
      wheelRadius,
      axleRadius,
      loadForce,
      turns: Number(settings.turns || 1)
    });

    return {
      ...force,
      maxEffort,
      meetsLimit: force.requiredEffort <= maxEffort
    };
  }

  function format(value, unit, digits) {
    const places = typeof digits === "number" ? digits : 1;
    const rounded = Number(value).toFixed(places).replace(/\.0$/, "");
    return unit ? `${rounded} ${unit}` : rounded;
  }

  return {
    TWO_PI,
    round1,
    circumference,
    forceRatio,
    requiredEffort,
    forceReadings,
    speedReadings,
    challengeReadings,
    format
  };
});
