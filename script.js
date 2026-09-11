const API_BASE = "";

const rangerStatus = document.getElementById("ranger-status");
const rangerForm = document.getElementById("ranger-form");
const missionInput = document.getElementById("mission-input");
const rangerSubmit = document.getElementById("ranger-submit");
const rangerOutput = document.getElementById("ranger-output");

async function checkRangerStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/ranger/status`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ranger status check failed.");
    }

    rangerStatus.textContent = data.status || "ONLINE";
  } catch (error) {
    rangerStatus.textContent = "OFFLINE";
    rangerOutput.textContent = error.message;
  }
}

rangerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const objective = missionInput.value.trim();

  if (!objective) {
    rangerOutput.textContent = "Mission objective is required.";
    return;
  }

  rangerSubmit.disabled = true;
  rangerStatus.textContent = "EXECUTING";
  rangerOutput.textContent = "Ranger is processing mission...";

  try {
    const response = await fetch(`${API_BASE}/api/ranger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        objective
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ranger execution failed.");
    }

    rangerStatus.textContent = data.success ? "ONLINE" : "BLOCKED";
    rangerOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    rangerStatus.textContent = "ERROR";
    rangerOutput.textContent = error.message;
  } finally {
    rangerSubmit.disabled = false;
  }
});

checkRangerStatus();
