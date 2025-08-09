export function sa(name: string, props: Record<string, any> = {}) {
  const body = {
    workspaceId: (window as any).__SA_WORKSPACE__ ?? "demo",
    name,
    ts: new Date().toISOString(),
    props,
  };
  navigator.sendBeacon?.("/api/events", new Blob([JSON.stringify(body)], { type: "application/json" }));
}


