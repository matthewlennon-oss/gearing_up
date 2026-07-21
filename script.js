(function bootWheelAxleLab() {
  const model = window.WheelAxleModel;
  const center = { x: 330, y: 236 };
  const scale = 16;
  const state = {
    mode: "force",
    effort: "wheel",
    wheelRadius: 8,
    axleRadius: 2,
    loadForce: 60,
    turns: 1,
    inputRate: 1,
    seconds: 1,
    angle: 0,
    previousWheelRadius: 0,
    trials: [],
    isRunning: false,
    animationFrame: 0
  };

  const copy = {
    force: {
      eyebrow: "Force Lab",
      title: "How does wheel size change the effort needed?",
      question: "Change only the wheel radius. Watch the force and distance readings.",
      fair: "Fair-test check: keep axle radius, load and run length the same."
    },
    speed: {
      eyebrow: "Speed Lab",
      title: "How does wheel size change rim speed?",
      question: "Change only the wheel radius. Compare rotation count with rim speed.",
      fair: "Fair-test check: keep axle radius, input rate and run time the same."
    },
    challenge: {
      eyebrow: "Design Challenge",
      title: "Find the smallest doorknob that works.",
      question: "The load is 60 N, the axle is 2 cm and the maximum effort is 12 N.",
      fair: "Challenge constants are set. Change the wheel radius and use evidence."
    }
  };

  const ui = {
    modeButtons: Array.from(document.querySelectorAll("[data-mode]")),
    panels: Array.from(document.querySelectorAll("[data-panel]")),
    effortRadios: Array.from(document.querySelectorAll("input[name='effort']")),
    wheelRadius: document.getElementById("wheelRadius"),
    axleRadius: document.getElementById("axleRadius"),
    loadForce: document.getElementById("loadForce"),
    turns: document.getElementById("turns"),
    inputRate: document.getElementById("inputRate"),
    seconds: document.getElementById("seconds"),
    lockAxle: document.getElementById("lockAxle"),
    lockLoad: document.getElementById("lockLoad"),
    lockSpeedAxle: document.getElementById("lockSpeedAxle"),
    lockRateTime: document.getElementById("lockRateTime"),
    showLabels: document.getElementById("showLabels"),
    showCalculations: document.getElementById("showCalculations"),
    reducedMotion: document.getElementById("reducedMotion"),
    modeEyebrow: document.getElementById("modeEyebrow"),
    stageTitle: document.getElementById("stage-title"),
    investigationQuestion: document.getElementById("investigationQuestion"),
    calculationPanel: document.getElementById("calculationPanel"),
    challengeFeedback: document.getElementById("challengeFeedback"),
    fairTestFeedback: document.getElementById("fairTestFeedback"),
    labelLayer: document.getElementById("labelLayer"),
    rotatingGroup: document.getElementById("rotatingGroup"),
    fanBlades: document.getElementById("fanBlades"),
    loadGroup: document.getElementById("loadGroup"),
    wheelCircle: document.getElementById("wheelCircle"),
    axleCircle: document.getElementById("axleCircle"),
    ghostWheel: document.getElementById("ghostWheel"),
    wheelTrail: document.getElementById("wheelTrail"),
    axleTrail: document.getElementById("axleTrail"),
    wheelMarker: document.getElementById("wheelMarker"),
    axleMarker: document.getElementById("axleMarker"),
    spokeA: document.getElementById("spokeA"),
    spokeB: document.getElementById("spokeB"),
    effortArrow: document.getElementById("effortArrow"),
    loadArrow: document.getElementById("loadArrow"),
    ropeLine: document.getElementById("ropeLine"),
    hangingLine: document.getElementById("hangingLine"),
    loadBlock: document.getElementById("loadBlock"),
    loadBlockText: document.getElementById("loadBlockText"),
    fanBlade0: document.getElementById("fanBlade0"),
    fanBlade1: document.getElementById("fanBlade1"),
    fanBlade2: document.getElementById("fanBlade2"),
    fanBlade3: document.getElementById("fanBlade3"),
    wheelLabel: document.getElementById("wheelLabel"),
    axleLabel: document.getElementById("axleLabel"),
    effortLabel: document.getElementById("effortLabel"),
    loadLabel: document.getElementById("loadLabel"),
    rotationLabel: document.getElementById("rotationLabel"),
    runButton: document.getElementById("runButton"),
    pauseButton: document.getElementById("pauseButton"),
    stepButton: document.getElementById("stepButton"),
    resetButton: document.getElementById("resetButton"),
    addTrialButton: document.getElementById("addTrialButton"),
    downloadCsvButton: document.getElementById("downloadCsvButton"),
    clearTrialsButton: document.getElementById("clearTrialsButton"),
    trialBody: document.getElementById("trialBody")
  };

  const readouts = {
    effort: document.getElementById("effortReadout"),
    ratio: document.getElementById("ratioReadout"),
    effortForce: document.getElementById("effortForceReadout"),
    load: document.getElementById("loadReadout"),
    wheelRotations: document.getElementById("wheelRotationReadout"),
    axleRotations: document.getElementById("axleRotationReadout"),
    wheelDistance: document.getElementById("wheelDistanceReadout"),
    axleDistance: document.getElementById("axleDistanceReadout"),
    wheelSpeed: document.getElementById("wheelSpeedReadout"),
    axleSpeed: document.getElementById("axleSpeedReadout")
  };

  const outputs = {
    wheelRadius: document.getElementById("wheelRadiusValue"),
    axleRadius: document.getElementById("axleRadiusValue"),
    loadForce: document.getElementById("loadForceValue"),
    turns: document.getElementById("turnsValue"),
    inputRate: document.getElementById("inputRateValue"),
    seconds: document.getElementById("secondsValue")
  };

  function numberFrom(input) {
    return Number(input.value);
  }

  function syncStateFromControls() {
    state.wheelRadius = numberFrom(ui.wheelRadius);
    state.axleRadius = numberFrom(ui.axleRadius);
    state.loadForce = numberFrom(ui.loadForce);
    state.turns = numberFrom(ui.turns);
    state.inputRate = numberFrom(ui.inputRate);
    state.seconds = numberFrom(ui.seconds);

    if (state.mode === "challenge") {
      state.effort = "wheel";
      state.axleRadius = 2;
      state.loadForce = 60;
      state.turns = 1;
      ui.axleRadius.value = "2";
      ui.loadForce.value = "60";
      ui.turns.value = "1";
    }
  }

  function setMode(mode) {
    state.mode = mode;
    state.effort = mode === "speed" ? "axle" : "wheel";

    ui.modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === mode);
      button.setAttribute("aria-selected", String(button.dataset.mode === mode));
    });

    ui.effortRadios.forEach((radio) => {
      radio.checked = radio.value === state.effort;
    });

    ui.modeEyebrow.textContent = copy[mode].eyebrow;
    ui.stageTitle.textContent = copy[mode].title;
    ui.investigationQuestion.textContent = copy[mode].question;
    ui.fairTestFeedback.textContent = copy[mode].fair;
    updatePanelVisibility();
    syncStateFromControls();
    updateControlLocks();
    render();
  }

  function updatePanelVisibility() {
    ui.panels.forEach((panel) => {
      const modes = panel.dataset.panel.split(" ");
      panel.hidden = !modes.includes(state.mode);
    });

    document.querySelectorAll("[data-speed-stat]").forEach((stat) => {
      stat.hidden = state.mode !== "speed";
    });
  }

  function updateControlLocks() {
    const challenge = state.mode === "challenge";
    ui.axleRadius.disabled = challenge ||
      (state.mode === "speed" ? ui.lockSpeedAxle.checked : ui.lockAxle.checked);
    ui.loadForce.disabled = challenge || (state.mode !== "speed" && ui.lockLoad.checked);
    ui.turns.disabled = challenge || (state.mode !== "speed" && ui.lockLoad.checked);
    ui.inputRate.disabled = state.mode === "speed" && ui.lockRateTime.checked;
    ui.seconds.disabled = state.mode === "speed" && ui.lockRateTime.checked;
  }

  function currentReadings() {
    if (state.mode === "speed") {
      return model.speedReadings(state);
    }

    if (state.mode === "challenge") {
      return model.challengeReadings({
        wheelRadius: state.wheelRadius,
        axleRadius: 2,
        loadForce: 60,
        maxEffort: 12
      });
    }

    return model.forceReadings(state);
  }

  function renderOutputs() {
    outputs.wheelRadius.textContent = `${state.wheelRadius} cm`;
    outputs.axleRadius.textContent = `${state.axleRadius} cm`;
    outputs.loadForce.textContent = `${state.loadForce} N`;
    outputs.turns.textContent = `${state.turns} ${state.turns === 1 ? "turn" : "turns"}`;
    outputs.inputRate.textContent = `${state.inputRate} rps`;
    outputs.seconds.textContent = `${state.seconds} s`;
  }

  function renderReadouts() {
    const data = currentReadings();
    const forceMode = state.mode !== "speed";
    const ratio = forceMode ? data.forceRatio : model.forceRatio(state.wheelRadius, state.axleRadius);
    const rotations = state.mode === "speed" ? data.wheelRotations : state.turns;

    readouts.effort.textContent = state.effort === "wheel" ? "Wheel" : "Axle";
    readouts.ratio.textContent = `${model.round1(ratio)}x`;
    readouts.effortForce.textContent = forceMode ? model.format(data.requiredEffort, "N") : "motor";
    readouts.load.textContent = state.mode === "speed" ? "n/a" : `${state.loadForce} N`;
    readouts.wheelRotations.textContent = model.format(rotations, "", 1);
    readouts.axleRotations.textContent = model.format(rotations, "", 1);
    readouts.wheelDistance.textContent = model.format(data.wheelDistance || 0, "cm");
    readouts.axleDistance.textContent = model.format(data.axleDistance || 0, "cm");
    readouts.wheelSpeed.textContent = state.mode === "speed" ? model.format(data.wheelSpeed, "cm/s") : "n/a";
    readouts.axleSpeed.textContent = state.mode === "speed" ? model.format(data.axleSpeed, "cm/s") : "n/a";

    if (state.mode === "challenge") {
      const message = data.meetsLimit
        ? `Meets constraint: ${model.format(data.requiredEffort, "N")} is at or below 12 N.`
        : `Does not meet constraint yet: ${model.format(data.requiredEffort, "N")} is above 12 N.`;
      ui.challengeFeedback.textContent = message;
      ui.challengeFeedback.classList.toggle("warning", !data.meetsLimit);
      ui.challengeFeedback.hidden = false;
    } else {
      ui.challengeFeedback.hidden = true;
    }
  }

  function setCircle(circle, radiusPx) {
    circle.setAttribute("cx", center.x);
    circle.setAttribute("cy", center.y);
    circle.setAttribute("r", radiusPx);
  }

  function setLine(line, x1, y1, x2, y2) {
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
  }

  function pointOnCircle(radiusPx, radians) {
    return {
      x: center.x + Math.cos(radians) * radiusPx,
      y: center.y + Math.sin(radians) * radiusPx
    };
  }

  function tangentArrow(radiusPx, radians, clockwise, length) {
    const point = pointOnCircle(radiusPx, radians);
    const direction = clockwise ? radians + Math.PI / 2 : radians - Math.PI / 2;
    const dx = Math.cos(direction) * length;
    const dy = Math.sin(direction) * length;
    return `M ${point.x - dx / 2} ${point.y - dy / 2} L ${point.x + dx / 2} ${point.y + dy / 2}`;
  }

  function bladePath(radiusPx) {
    return [
      `M ${center.x} ${center.y}`,
      `C ${center.x + radiusPx * 0.2} ${center.y - radiusPx * 0.2},`,
      `${center.x + radiusPx * 0.72} ${center.y - radiusPx * 0.16},`,
      `${center.x + radiusPx} ${center.y}`,
      `C ${center.x + radiusPx * 0.72} ${center.y + radiusPx * 0.2},`,
      `${center.x + radiusPx * 0.2} ${center.y + radiusPx * 0.14},`,
      `${center.x} ${center.y} Z`
    ].join(" ");
  }

  function renderMachine() {
    const wheelPx = state.wheelRadius * scale;
    const axlePx = state.axleRadius * scale;
    const angleDeg = state.angle * 180 / Math.PI;
    const loadOffset = state.mode === "speed" ? 0 : Math.min(54, Math.abs(Math.sin(state.angle)) * 38);

    setCircle(ui.wheelCircle, wheelPx);
    setCircle(ui.axleCircle, axlePx);
    setCircle(ui.wheelTrail, wheelPx);
    setCircle(ui.axleTrail, axlePx);
    setCircle(ui.ghostWheel, state.previousWheelRadius ? state.previousWheelRadius * scale : 0);

    setLine(ui.spokeA, center.x - wheelPx, center.y, center.x + wheelPx, center.y);
    setLine(ui.spokeB, center.x, center.y - wheelPx, center.x, center.y + wheelPx);

    ui.wheelMarker.setAttribute("cx", center.x + wheelPx);
    ui.wheelMarker.setAttribute("cy", center.y);
    ui.axleMarker.setAttribute("cx", center.x + axlePx);
    ui.axleMarker.setAttribute("cy", center.y);
    ui.rotatingGroup.setAttribute("transform", `rotate(${angleDeg} ${center.x} ${center.y})`);

    const blade = bladePath(wheelPx * 0.92);
    [ui.fanBlade0, ui.fanBlade1, ui.fanBlade2, ui.fanBlade3].forEach((path, index) => {
      path.setAttribute("d", blade);
      path.setAttribute("transform", `rotate(${index * 90} ${center.x} ${center.y})`);
    });

    ui.fanBlades.hidden = state.mode !== "speed";
    ui.loadGroup.hidden = state.mode === "speed";

    const effortRadius = state.effort === "wheel" ? wheelPx : axlePx;
    const loadRadius = state.effort === "wheel" ? axlePx : wheelPx;
    ui.effortArrow.setAttribute("d", tangentArrow(effortRadius + 18, -2.35, true, 82));
    ui.loadArrow.setAttribute("d", tangentArrow(loadRadius + 22, 0.68, false, 74));

    const ropeStart = pointOnCircle(axlePx, 0);
    setLine(ui.ropeLine, ropeStart.x, ropeStart.y, 583, center.y);
    setLine(ui.hangingLine, 583, center.y, 583, 304 - loadOffset);
    ui.loadBlock.setAttribute("y", 304 - loadOffset);
    ui.loadBlockText.setAttribute("y", 342 - loadOffset);
    ui.loadBlockText.textContent = `${state.loadForce} N`;

    ui.labelLayer.classList.toggle("is-hidden", !ui.showLabels.checked);
    ui.wheelLabel.setAttribute("x", center.x + wheelPx + 20);
    ui.wheelLabel.setAttribute("y", center.y - wheelPx * 0.55);
    ui.axleLabel.setAttribute("x", center.x + axlePx + 18);
    ui.axleLabel.setAttribute("y", center.y - axlePx * 0.5);
    ui.effortLabel.textContent = state.effort === "wheel" ? "effort on wheel" : "effort on axle";
    ui.loadLabel.textContent = state.mode === "speed" ? "rim moves farther" : "load";
  }

  function renderCalculations() {
    ui.calculationPanel.hidden = !ui.showCalculations.checked;
  }

  function render() {
    syncStateFromControls();
    renderOutputs();
    renderReadouts();
    renderMachine();
    renderCalculations();
  }

  function runAnimation() {
    cancelAnimationFrame(state.animationFrame);

    if (ui.reducedMotion.checked) {
      state.angle += Math.PI / 2;
      render();
      return;
    }

    state.isRunning = true;
    const start = performance.now();
    const startAngle = state.angle;
    const rotations = state.mode === "speed" ? state.inputRate * state.seconds : state.turns;
    const targetAngle = startAngle + rotations * model.TWO_PI;
    const duration = Math.max(900, Math.min(3800, rotations * 1150));

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      state.angle = startAngle + (targetAngle - startAngle) * eased;
      renderMachine();

      if (progress < 1 && state.isRunning) {
        state.animationFrame = requestAnimationFrame(tick);
      } else {
        state.isRunning = false;
        state.angle = targetAngle;
        render();
      }
    }

    state.animationFrame = requestAnimationFrame(tick);
  }

  function pauseAnimation() {
    state.isRunning = false;
    cancelAnimationFrame(state.animationFrame);
  }

  function resetView() {
    pauseAnimation();
    state.angle = 0;
    render();
  }

  function currentTrial() {
    const data = currentReadings();

    if (state.mode === "speed") {
      return {
        lab: "Speed",
        wheel: `${state.wheelRadius} cm`,
        axle: `${state.axleRadius} cm`,
        ratio: `${model.round1(model.forceRatio(state.wheelRadius, state.axleRadius))}x`,
        effort: `${state.inputRate} rps`,
        wheelMeasure: `${model.format(data.wheelSpeed, "cm/s")}`,
        axleMeasure: `${model.format(data.axleSpeed, "cm/s")}`,
        rotations: model.format(data.wheelRotations, "", 1)
      };
    }

    return {
      lab: state.mode === "challenge" ? "Challenge" : "Force",
      wheel: `${state.wheelRadius} cm`,
      axle: `${state.axleRadius} cm`,
      ratio: `${model.round1(data.forceRatio)}x`,
      effort: `${model.format(data.requiredEffort, "N")}`,
      wheelMeasure: `${model.format(data.wheelDistance || model.circumference(state.wheelRadius), "cm")}`,
      axleMeasure: `${model.format(data.axleDistance || model.circumference(state.axleRadius), "cm")}`,
      rotations: `${state.turns}`
    };
  }

  function addTrial() {
    const trial = currentTrial();
    state.trials.push(trial);
    state.previousWheelRadius = state.wheelRadius;
    renderTrials();
    renderMachine();
  }

  function renderTrials() {
    if (!state.trials.length) {
      ui.trialBody.innerHTML = '<tr class="empty-row"><td colspan="9">Add a trial after each run.</td></tr>';
      return;
    }

    ui.trialBody.innerHTML = state.trials.map((trial, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${trial.lab}</td>
        <td>${trial.wheel}</td>
        <td>${trial.axle}</td>
        <td>${trial.ratio}</td>
        <td>${trial.effort}</td>
        <td>${trial.wheelMeasure}</td>
        <td>${trial.axleMeasure}</td>
        <td>${trial.rotations}</td>
      </tr>
    `).join("");
  }

  function downloadCsv() {
    if (!state.trials.length) {
      return;
    }

    const headings = ["trial", "lab", "wheel", "axle", "ratio", "effort_or_rate", "wheel_path_or_speed", "axle_path_or_speed", "rotations"];
    const rows = state.trials.map((trial, index) => [
      index + 1,
      trial.lab,
      trial.wheel,
      trial.axle,
      trial.ratio,
      trial.effort,
      trial.wheelMeasure,
      trial.axleMeasure,
      trial.rotations
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wheel-axle-trials.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function clearTrials() {
    state.trials = [];
    state.previousWheelRadius = 0;
    renderTrials();
    renderMachine();
  }

  function bindEvents() {
    ui.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    ui.effortRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) {
          return;
        }
        setMode(radio.value === "wheel" ? "force" : "speed");
      });
    });

    [
      ui.wheelRadius,
      ui.axleRadius,
      ui.loadForce,
      ui.turns,
      ui.inputRate,
      ui.seconds,
      ui.showLabels,
      ui.showCalculations,
      ui.reducedMotion
    ].forEach((control) => {
      control.addEventListener("input", render);
      control.addEventListener("change", render);
    });

    [ui.lockAxle, ui.lockLoad, ui.lockSpeedAxle, ui.lockRateTime].forEach((control) => {
      control.addEventListener("change", () => {
        updateControlLocks();
        render();
      });
    });

    ui.runButton.addEventListener("click", runAnimation);
    ui.pauseButton.addEventListener("click", pauseAnimation);
    ui.stepButton.addEventListener("click", () => {
      pauseAnimation();
      state.angle += Math.PI / 2;
      render();
    });
    ui.resetButton.addEventListener("click", resetView);
    ui.addTrialButton.addEventListener("click", addTrial);
    ui.downloadCsvButton.addEventListener("click", downloadCsv);
    ui.clearTrialsButton.addEventListener("click", clearTrials);
  }

  bindEvents();
  setMode("force");
})();
