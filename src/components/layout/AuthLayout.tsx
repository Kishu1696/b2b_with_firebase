import { Bot } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-background text-white lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-secondary shadow-glow">
              <Bot className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-extrabold">LiquidFlow AI</p>
              <p className="text-sm text-muted">Enterprise liquidation intelligence</p>
            </div>
          </div>
          <Outlet />
        </div>
      </section>
      <section className="hidden border-l border-border bg-surface/60 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="glass-panel rounded-lg p-8">
          <p className="text-sm font-semibold uppercase text-secondary">AI-powered market making</p>
          <h1 className="mt-5 max-w-xl text-5xl font-extrabold leading-tight tracking-normal">
            Convert excess inventory into revenue with controlled precision.
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["$84.2M GMV", "2.4x Faster Close", "91% Forecast Accuracy"].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-card/70 p-5 text-sm font-bold">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
