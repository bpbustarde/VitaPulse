const pageMeta = {
  dashboard: ["Dashboard", "Overview · Sep 6, 2026"],
  activity: ["Activity", "7-day activity summary"],
  sleep: ["Sleep", "Last night & weekly trends"],
  nutrition: ["Nutrition", "Today's intake & goals"],
  devices: ["Devices", "3 paired · 2 online"],
};

const workouts = [
  { name: "Outdoor Run", code: "RUN", date: "Today · 7:15am", duration: "32 min", calories: "340 kcal", distance: "5.2 km", pace: "6:09 /km", heart: "142 bpm", score: 88 },
  { name: "Road Cycling", code: "BIKE", date: "Yesterday · 6:00pm", duration: "45 min", calories: "520 kcal", distance: "18.4 km", pace: "24.5 km/h", heart: "158 bpm", score: 92 },
  { name: "Yoga Flow", code: "YOGA", date: "Monday · 8:00am", duration: "60 min", calories: "210 kcal", distance: "—", pace: "—", heart: "98 bpm", score: 76 },
  { name: "Open Water Swim", code: "SWIM", date: "Sunday · 11:30am", duration: "40 min", calories: "460 kcal", distance: "1.8 km", pace: "2:13 /100m", heart: "148 bpm", score: 85 },
];

const devices = [
  { name: "VitaBand Pro 4", code: "VB", type: "Smartwatch", online: true, battery: 78, firmware: "v4.2.1", sync: "2 min ago", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=720&q=88", sensors: ["Heart Rate", "Blood Oxygen", "ECG", "Skin Temperature", "GPS", "Gyroscope"] },
  { name: "VitaScale X", code: "VS", type: "Smart scale", online: true, battery: 91, firmware: "v2.1.0", sync: "Today · 6:42am", image: "https://images.unsplash.com/photo-1646829873498-e874cfa27933?auto=format&fit=crop&w=720&q=88", sensors: ["Weight", "BMI", "Body Fat", "Muscle Mass", "Bone Density", "Hydration"] },
  { name: "SleepPod 2", code: "SP", type: "Sleep tracker", online: false, battery: 45, firmware: "v1.8.3", sync: "Yesterday", image: "https://images.unsplash.com/photo-1552858725-2758b5fb1286?auto=format&fit=crop&w=720&q=88", sensors: ["Sleep Stages", "Snore Detection", "Room Temperature", "Ambient Light", "Heart Rate", "Movement"] },
];

const meals = [
  { name: "Overnight Oats", meta: "7:30am · Breakfast", calories: 420 },
  { name: "Grilled Salmon Bowl", meta: "12:45pm · Lunch", calories: 610 },
  { name: "Protein Shake", meta: "3:15pm · Snack", calories: 210 },
  { name: "Chicken & Quinoa", meta: "7:00pm · Dinner", calories: 580 },
];

let charts = {};
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: "index" },
  plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0d1422", borderColor: "rgba(255,255,255,.1)", borderWidth: 1, titleColor: "#94a3b8", bodyColor: "#f1f5f9", padding: 10 } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: "#64748b", font: { size: 10 } } },
    y: { grid: { color: "rgba(255,255,255,.045)" }, border: { display: false }, ticks: { color: "#64748b", font: { size: 10 } } },
  },
};

function goToPage(id) {
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === id));
  document.querySelectorAll("[data-page-target]").forEach((button) => {
    const active = button.dataset.pageTarget === id;
    button.classList.toggle("active", active);
    button.toggleAttribute("aria-current", active);
  });
  document.querySelector("#page-title").textContent = pageMeta[id][0];
  document.querySelector("#page-eyebrow").textContent = pageMeta[id][1];
  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(() => Object.values(charts).forEach((chart) => chart.resize()));
}

function lineDataset(label, data, color) {
  return { label, data, borderColor: color, backgroundColor: `${color}22`, fill: true, tension: 0.42, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 };
}

function renderCharts() {
  if (!window.Chart) return;
  Chart.defaults.font.family = "Inter";
  charts.dashboard = new Chart(document.querySelector("#dashboardChart"), {
    type: "line",
    data: { labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"], datasets: [lineDataset("Heart rate", [58, 72, 85, 91, 78, 88, 102, 74, 62], "#f43f5e")] },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 50, max: 115 } } },
  });
  charts.activity = new Chart(document.querySelector("#activityChart"), {
    type: "bar",
    data: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [{ label: "Burned", data: [420, 680, 310, 820, 550, 940, 280], backgroundColor: "#f43f5e", borderRadius: 5 }, { label: "Consumed", data: [2100, 1980, 2250, 2050, 1890, 2300, 2150], backgroundColor: "rgba(124,111,247,.35)", borderRadius: 5 }] },
    options: chartDefaults,
  });
  charts.sleep = new Chart(document.querySelector("#sleepChart"), {
    type: "bar",
    data: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], datasets: [
      { label: "Deep", data: [1.2,1.5,.9,1.8,1.1,1.9,1.3], backgroundColor: "#00e5c9" },
      { label: "REM", data: [1.8,2.1,1.4,2.4,1.6,2.6,1.7], backgroundColor: "#f43f5e" },
      { label: "Light", data: [3.4,3,3.8,2.8,3.5,3.2,3.7], backgroundColor: "#7c6ff7" },
      { label: "Awake", data: [.4,.3,.6,.2,.5,.3,.4], backgroundColor: "#334155" },
    ] },
    options: { ...chartDefaults, scales: { x: { ...chartDefaults.scales.x, stacked: true }, y: { ...chartDefaults.scales.y, stacked: true } } },
  });
  charts.hrv = new Chart(document.querySelector("#hrvChart"), { type: "line", data: { labels: ["11pm","1am","2am","3am","4am","5am","6am"], datasets: [lineDataset("HRV", [42,58,71,65,54,48,52], "#7c6ff7")] }, options: chartDefaults });
  charts.nutrition = new Chart(document.querySelector("#nutritionChart"), { type: "line", data: { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets: [lineDataset("Calories", [2100,1980,2250,2050,1890,2300,2140], "#f59e0b")] }, options: chartDefaults });
}

function switchDashboardChart(type, button) {
  const presets = {
    heart: { label: "Heart rate", labels: ["6am","8am","10am","12pm","2pm","4pm","6pm","8pm","10pm"], values: [58,72,85,91,78,88,102,74,62], color: "#f43f5e" },
    steps: { label: "Steps", labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], values: [8200,11400,7600,13200,9800,15100,6400], color: "#7c6ff7" },
    sleep: { label: "Sleep hours", labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], values: [6.8,7.4,6.7,7.9,7.1,8.2,7.4], color: "#00e5c9" },
  };
  const preset = presets[type];
  charts.dashboard.data.labels = preset.labels;
  charts.dashboard.data.datasets = [lineDataset(preset.label, preset.values, preset.color)];
  charts.dashboard.options.scales.y.min = undefined;
  charts.dashboard.options.scales.y.max = undefined;
  charts.dashboard.update();
  document.querySelectorAll("[data-dashboard-chart]").forEach((item) => item.classList.toggle("active", item === button));
}

function renderWorkout(index = 0) {
  const workout = workouts[index];
  document.querySelector("#workoutList").innerHTML = workouts.map((item, i) => `<button class="select-item ${i === index ? "active" : ""}" type="button" data-workout="${i}"><span class="select-icon">${item.code}</span><span class="select-copy"><strong>${item.name}</strong><small>${item.date}</small></span><small>${item.duration}</small></button>`).join("");
  document.querySelector("#workoutDetail").innerHTML = `<div class="detail-header"><div><p class="eyebrow">Session detail</p><h2>${workout.name}</h2><p>${workout.date}</p></div><div class="score">${workout.score}<small>Effort score</small></div></div><div class="detail-stats"><div><span>Duration</span><strong>${workout.duration}</strong></div><div><span>Calories</span><strong>${workout.calories}</strong></div><div><span>Distance</span><strong>${workout.distance}</strong></div><div><span>Average pace</span><strong>${workout.pace}</strong></div><div><span>Average HR</span><strong>${workout.heart}</strong></div><div><span>Effort zone</span><strong>Cardio</strong></div></div><div class="insight"><span>Recovery tip</span><p>Hydrate well and consider a ten-minute cool-down stretch. Your HRV suggests full recovery by tomorrow morning.</p></div>`;
}

function renderDevice(index = 0) {
  const device = devices[index];
  document.querySelector("#deviceList").innerHTML = devices.map((item, i) => `<button class="select-item ${i === index ? "active" : ""}" type="button" data-device="${i}"><span class="select-icon">${item.code}</span><span class="select-copy"><strong>${item.name}</strong><small>${item.type}</small></span><small class="${item.online ? "teal" : ""}">${item.online ? "Online" : "Offline"}</small></button>`).join("");
  document.querySelector("#deviceDetail").innerHTML = `<div class="detail-header"><div><p class="eyebrow">${device.type}</p><h2>${device.name}</h2></div><span class="status-pill"><i></i>${device.online ? "Online" : "Offline"}</span></div><div class="device-visual"><img src="${device.image}" alt="${device.name}" /><div class="detail-stats"><div><span>Battery</span><strong>${device.battery}%</strong></div><div><span>Firmware</span><strong>${device.firmware}</strong></div><div><span>Last sync</span><strong>${device.sync}</strong></div></div></div><div class="battery-row"><span>Battery level</span><div class="progress"><i style="width:${device.battery}%"></i></div><b>${device.battery}%</b></div>`;
  document.querySelector("#sensorGrid").innerHTML = device.sensors.map((sensor) => `<span>${sensor}</span>`).join("");
}

function renderMeals() {
  document.querySelector("#mealList").innerHTML = meals.map((meal) => `<div class="meal-item"><div><strong>${meal.name}</strong><small>${meal.meta}</small></div><b>${meal.calories} kcal</b></div>`).join("");
  document.querySelector("#mealCount").textContent = meals.length;
}

document.addEventListener("DOMContentLoaded", () => {
  renderWorkout();
  renderDevice();
  renderMeals();
  renderCharts();
  const initialPage = location.hash.slice(1);
  if (pageMeta[initialPage]) goToPage(initialPage);

  document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page-target]");
    if (pageButton) goToPage(pageButton.dataset.pageTarget);
    const chartButton = event.target.closest("[data-dashboard-chart]");
    if (chartButton) switchDashboardChart(chartButton.dataset.dashboardChart, chartButton);
    const workoutButton = event.target.closest("[data-workout]");
    if (workoutButton) renderWorkout(Number(workoutButton.dataset.workout));
    const deviceButton = event.target.closest("[data-device]");
    if (deviceButton) renderDevice(Number(deviceButton.dataset.device));
  });

  const modal = document.querySelector("#mealModal");
  document.querySelector("#openMealModal").addEventListener("click", () => modal.showModal());
  document.querySelector("#mealForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    meals.push({ name: data.get("name"), meta: `Just now · ${data.get("type")}`, calories: Number(data.get("calories")) });
    renderMeals();
    event.currentTarget.reset();
    modal.close();
  });
  document.querySelector("#addWater").addEventListener("click", (event) => {
    event.currentTarget.textContent = "250 ml added";
    setTimeout(() => { event.currentTarget.textContent = "Add 250 ml"; }, 1600);
  });
  document.querySelector("#syncDevice").addEventListener("click", (event) => {
    event.currentTarget.textContent = "Synced";
    setTimeout(() => { event.currentTarget.textContent = "Sync now"; }, 1600);
  });
});
