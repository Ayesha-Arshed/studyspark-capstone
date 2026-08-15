async function getHealthData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      label: "Status",
      value: "operational",
      status: "healthy" as const,
    },
    {
      label: "Database",
      value: "connected",
      status: "healthy" as const,
    },
    {
      label: "API Server",
      value: "responding",
      status: "healthy" as const,
    },
    {
      label: "Response Time",
      value: "42ms",
      status: "healthy" as const,
    },
    {
      label: "Active Users",
      value: "1,284",
      status: "info" as const,
    },
    {
      label: "Uptime",
      value: "99.98%",
      status: "info" as const,
    },
  ];
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div className="flex flex-col py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          System Health
        </h1>
        <p className="text-lg text-muted">
          Live status of all StudySpark services.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  item.status === "healthy"
                    ? "bg-green-500"
                    : "bg-primary"
                }`}
              />
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <span className="text-muted">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-muted text-center">
        Last checked: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
