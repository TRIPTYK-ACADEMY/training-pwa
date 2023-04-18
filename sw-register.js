const publicVapidKey =
  "BFGNelRiLJgHLvUB7tMHYtAh0RPLifoYD55KOWBtCA2h0Tu8l4AKYIaGylPjdM3KfJxjPx2X84UFjV3jL5BMLGc";
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const register = await navigator.serviceWorker.register("serviceworker.js");

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicVapidKey,
    });

    await fetch("http://localhost:8000/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
registerServiceWorker();
