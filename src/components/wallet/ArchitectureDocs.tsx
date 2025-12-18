import { Server, Smartphone, Database, ArrowRight, Shield, Zap } from "lucide-react";

export function ArchitectureDocs() {
  const integrationSteps = [
    {
      icon: Smartphone,
      title: "Telegram MiniApp",
      description: "User interface built with React, connects via TON Connect SDK",
    },
    {
      icon: Server,
      title: "Backend Indexer",
      description: "Node.js service monitors blockchain events, stores tx history",
    },
    {
      icon: Database,
      title: "MiniWallet Contract",
      description: "On-chain state: balances, stats. Off-chain: full tx history",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Security First",
      points: [
        "Owner-only operations with address validation",
        "Input validation on all message handlers",
        "Safe state updates with atomic operations",
      ],
    },
    {
      icon: Zap,
      title: "Scalability",
      points: [
        "Multi-user support via contract factory pattern",
        "Seller payment integration for e-commerce",
        "Telegram MiniApp checkout flow ready",
      ],
    },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Integration Architecture
      </h3>

      {/* Flow Diagram */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 bg-secondary/30 rounded-xl">
        {integrationSteps.map((step, index) => (
          <div key={step.title} className="flex items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 mb-2">
                <step.icon className="w-6 h-6 text-ton-blue" />
              </div>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground max-w-[140px]">
                {step.description}
              </p>
            </div>
            {index < integrationSteps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-4 bg-secondary/20 rounded-xl border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <feature.icon className="w-4 h-4 text-accent" />
              <span className="font-medium text-foreground">{feature.title}</span>
            </div>
            <ul className="space-y-2">
              {feature.points.map((point) => (
                <li
                  key={point}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-ton-blue mt-2 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Compilation Steps */}
      <div className="mt-6 p-4 bg-background/50 rounded-xl border border-border">
        <p className="text-sm font-medium text-foreground mb-2">
          Compile with Tact:
        </p>
        <code className="text-xs font-mono text-muted-foreground">
          npx @tact-lang/compiler MiniWallet.tact
        </code>
      </div>
    </div>
  );
}
