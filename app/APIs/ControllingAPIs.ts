const emergencyStop = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/printer/emergency-stop",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Emergency stop executed successfully!");
      console.log("Emergency stop response:", result);
    } else {
      alert(`Emergency stop failed: ${result.message}`);
    }
  } catch (error) {
    console.error("Emergency stop error:", error);
    alert("Failed to execute emergency stop");
  }
};

export { emergencyStop };
