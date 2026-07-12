"use client";

import { CheckCircle2 } from "lucide-react";

const steps = [
  "Draft",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export default function TripLifecycle() {
  const current = 1;

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-6 font-semibold">Trip Lifecycle</h3>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                  index <= current
                    ? "bg-primary text-white"
                    : "bg-muted"
                }`}
              >
                <CheckCircle2 size={18} />
              </div>

              <span className="mt-2 text-sm">{step}</span>
            </div>

            {index !== steps.length - 1 && (
              <div className="mx-4 h-1 flex-1 bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}