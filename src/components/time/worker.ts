export {};

onmessage = function (e: MessageEvent) {
  if (e.data === "start") {
    (globalThis as any).intervalId = setInterval(() => {
      postMessage(new Date());
    }, 1000);
  }

  console.log("data");
  if (e.data === "stop") {
    clearInterval((globalThis as any).intervalId);
  }
};