import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, Workflow, Database, MessageSquare, Sparkles, 
  ArrowRight, Bot, FileText, Users, Zap, Shield, 
  BarChart3, Globe, Code2, Layers, Cpu 
} from "lucide-react";
import { motion } from "framer-motion";

// Animation preset for fade-in-up effect
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  gradient,
  index
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  gradient?: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 overflow-hidden"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient || 'bg-gradient-to-br from-primary/5 to-accent/5'}`} />
    <div className="relative z-10">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Index = () => {
  const features = [
    { icon: Bot, title: "Intelligent AI Agents", description: "Create sophisticated AI agents with custom personas, knowledge domains, and behavioral patterns tailored to your needs.", gradient: "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" },
    { icon: Workflow, title: "Multi-Agent Orchestration", description: "Design complex workflows where multiple AI agents collaborate, share context, and solve problems together.", gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10" },
    { icon: Database, title: "Knowledge Architecture", description: "Build structured knowledge bases with intelligent chunking, embeddings, and semantic search capabilities.", gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10" },
    { icon: MessageSquare, title: "Natural Conversations", description: "Engage in context-aware dialogues with agents that understand nuance, maintain memory, and learn from interactions.", gradient: "bg-gradient-to-br from-orange-500/10 to-amber-500/10" },
    { icon: Shield, title: "Enterprise Security", description: "Bank-grade encryption, role-based access control, and comprehensive audit trails for enterprise compliance.", gradient: "bg-gradient-to-br from-rose-500/10 to-pink-500/10" },
    { icon: BarChart3, title: "Real-time Analytics", description: "Monitor agent performance, conversation insights, and knowledge utilization with beautiful dashboards.", gradient: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10" }
  ];

  const capabilities = [
    { icon: FileText, label: "RAG-Powered" },
    { icon: Cpu, label: "Edge Computing" },
    { icon: Globe, label: "Multi-Language" },
    { icon: Code2, label: "API-First" },
    { icon: Layers, label: "Scalable" },
    { icon: Users, label: "Team Ready" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          
          {/* Floating Orbs animated with Framer Motion */}
          <motion.div 
            animate={{ 
              x: [0, 40, 0], 
              y: [0, -40, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" as const }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              x: [0, -50, 0], 
              y: [0, 50, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" as const }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" 
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-10"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Next-Generation AI Platform</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight"
            >
              Build AI Agents
              <span className="block text-gradient-primary mt-2">That Think Together</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Create, orchestrate, and deploy intelligent AI agents powered by your knowledge. 
              Design workflows where agents collaborate to solve the impossible.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to="/auth">
                <Button size="lg" className="gap-3 px-10 py-7 text-lg rounded-2xl bg-primary hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20">
                  <Zap className="h-5 w-5" />
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="gap-3 px-10 py-7 text-lg rounded-2xl border-2 hover:bg-card/80 transition-all duration-300">
                  <Brain className="h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-visual mt-20 relative mx-auto max-w-6xl rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-2 shadow-2xl"
          >
              <div className="rounded-2xl bg-gradient-to-br from-card to-card/50 p-10 min-h-[350px] flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-3 gap-12 relative z-10">
                  {[ 
                    {I: Bot, t: "AI Agents", c: "violet"}, 
                    {I: Workflow, t: "Workflows", c: "cyan"}, 
                    {I: Database, t: "Knowledge", c: "emerald"} 
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <div className={`h-20 w-20 rounded-3xl bg-${item.c}-500/20 flex items-center justify-center border border-${item.c}-500/20 shadow-lg`}>
                        <item.I className={`h-10 w-10 text-${item.c}-400`} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item.t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[ 
              {v: "10K+", l: "Active Agents"}, {v: "1M+", l: "Conversations"}, 
              {v: "99.9%", l: "Uptime"}, {v: "<100ms", l: "Response Time"} 
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{stat.v}</div>
                <div className="text-muted-foreground">{stat.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Everything You Need to Build
              <span className="text-gradient-primary block mt-2">Intelligent AI Systems</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AI Agent Platform</span>
          </div>
          <p className="text-muted-foreground">Architected by <span className="text-primary font-semibold">Elhamy M. Sobhy</span></p>
          <p className="text-sm text-muted-foreground mt-4">© 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
