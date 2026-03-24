import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, Workflow, Database, MessageSquare, Sparkles, 
  ArrowRight, Bot, FileText, Users, Zap, Shield, 
  BarChart3, Globe, Code2, Layers, Cpu 
} from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero3DScene from "@/components/hero/Hero3DScene";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  gradient
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  gradient?: string;
}) => (
  <div
    className="feature-card group relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 overflow-hidden"
  >
  <div className="feature-card group relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 overflow-hidden">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient || 'bg-gradient-to-br from-primary/5 to-accent/5'}`} />
    <div className="relative z-10">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="stat-card text-center">
    <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{value}</div>
    <div className="text-muted-foreground">{label}</div>
  </div>
);
const formatCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K+`;
  return `${n}`;
};

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Keep Framer motion hooks for the parallax to maintain your existing structure
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const orbsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [liveStats, setLiveStats] = useState({ agents: '0', conversations: '0' });

  useEffect(() => {
    const fetchStats = async () => {
      const [agentsRes, messagesRes] = await Promise.all([
        supabase.from('ai_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('id', { count: 'exact', head: true }),
      ]);
      setLiveStats({
        agents: formatCount(agentsRes.count ?? 0),
        conversations: formatCount(messagesRes.count ?? 0),
      });
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Hero section entrance
      tl.fromTo(".hero-badge", 
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 }
      )
      .fromTo(".hero-title", 
        { opacity: 0, y: 60, clipPath: "inset(100% 0% 0% 0%)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.15 },
        "-=0.4"
      )
      .fromTo(".hero-description", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".hero-buttons", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(".hero-visual", 
        { opacity: 0, y: 80, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 },
        "-=0.6"
      );

      // Floating orbs animation
      gsap.to(".orb-1", {
        x: 60,
        y: -50,
        scale: 1.15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".orb-2", {
        x: -70,
        y: 60,
        scale: 1.2,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".orb-3", {
        x: 40,
        y: 40,
        scale: 1.1,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(".stat-item",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" }
          );
        },
        once: true
      });

      // Features section animation
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.fromTo(".features-header",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8 }
          );
          gsap.fromTo(".feature-card",
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }
          );
        },
        once: true
      });

      // Parallax effect on scroll
      gsap.to(".orb-1", {
        yPercent: -30,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".orb-2", {
        yPercent: -20,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });

      // Hero visual parallax
      gsap.to(".hero-visual", {
        yPercent: 10,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2
        }
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Feature Cards Staggered Reveal
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });

      // Stats Counting Effect (Visual Reveal)
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 90%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      // Subtle Parallax for the Visual
      gsap.to(".hero-visual", {
        scrollTrigger: {
          trigger: ".hero-visual",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: -50
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Bot, title: "Intelligent AI Agents", description: "Create sophisticated AI agents with custom personas, knowledge domains, and behavioral patterns tailored to your needs.", gradient: "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" },
    { icon: Workflow, title: "Multi-Agent Orchestration", description: "Design complex workflows where multiple AI agents collaborate, share context, and solve problems together.", gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10" },
    { icon: Database, title: "Knowledge Architecture", description: "Build structured knowledge bases with intelligent chunking, embeddings, and semantic search capabilities.", gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10" },
    { icon: MessageSquare, title: "Natural Conversations", description: "Engage in context-aware dialogues with agents that understand nuance, maintain memory, and learn from interactions.", gradient: "bg-gradient-to-br from-orange-500/10 to-amber-500/10" },
    { icon: Shield, title: "Enterprise Security", description: "Bank-grade encryption, role-based access control, and comprehensive audit trails for enterprise compliance.", gradient: "bg-gradient-to-br from-rose-500/10 to-pink-500/10" },
    { icon: BarChart3, title: "Real-time Analytics", description: "Monitor agent performance, conversation insights, and knowledge utilization with beautiful dashboards.", gradient: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10" }
  ];

  const stats = [
    { value: liveStats.agents, label: "Active Agents" },
    { value: liveStats.conversations, label: "Conversations" },
    { value: "99.9%", label: "Uptime" },
    { value: "<100ms", label: "Response Time" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center py-20">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-mesh" />
          <div className="absolute inset-0 aurora" />
          
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-content text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-10">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-primary" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
              </div>
              <span className="text-sm font-medium text-primary">Next-Generation AI Platform</span>
            </div>

    <div ref={mainRef} className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center py-20">
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>
        
        {/* Background Effects */}
        <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          
          {/* Animated Orbs - more subtle now with 3D scene */}
          <div className="orb-1 absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-violet-500/10 rounded-full blur-[180px]" />
          <div className="orb-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-accent/15 to-cyan-500/10 rounded-full blur-[150px]" />
          <div className="orb-3 absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-fuchsia-500/10 to-pink-500/5 rounded-full blur-[120px]" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div ref={heroRef} className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-10">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">Next-Generation AI Platform</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              <span className="hero-title block">Build AI Agents</span>
              <span className="hero-title block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent mt-2">
                That Think Together
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {/* Description */}
            <p className="hero-description text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Create, orchestrate, and deploy intelligent AI agents powered by your knowledge. 
              Design workflows where agents collaborate to solve the impossible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {/* Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="gap-3 px-10 py-7 text-lg rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 hover:scale-105 transition-all duration-300 shadow-2xl shadow-primary/25 border-0">
                  <Zap className="h-5 w-5" />
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="gap-3 px-10 py-7 text-lg rounded-2xl border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm">
                  <Brain className="h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {capabilities.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50 backdrop-blur-sm text-sm text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-6xl rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl p-2 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-br from-card to-card/50 p-10 min-h-[350px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-20" />
          </div>

          {/* Hero Visual */}
          <div className="hero-visual mt-20 relative mx-auto max-w-6xl">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/50 via-violet-500/50 to-fuchsia-500/50 blur-sm" />
            <div className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-2 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-br from-card via-card/90 to-background/80 p-10 min-h-[350px] flex items-center justify-center relative overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
                
                <div className="grid grid-cols-3 gap-12 relative z-10">
                  {[
                    { Icon: Bot, title: "AI Agents", color: "violet" },
                    { Icon: Workflow, title: "Workflows", color: "cyan" },
                    { Icon: Database, title: "Knowledge", color: "emerald" }
                  ].map((item, i) => (
                    <div key={i} className="visual-item flex flex-col items-center gap-4 cursor-pointer group">
                      <div className={`h-20 w-20 rounded-3xl bg-${item.color}-500/20 flex items-center justify-center border border-${item.color}-500/30 shadow-lg shadow-${item.color}-500/10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                        <item.Icon className={`h-10 w-10 text-${item.color}-400`} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.title}</span>
                    </div>
                  ))}
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                  <motion.line
                    x1="33%" y1="50%" x2="50%" y2="50%"
                    stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.line
                    x1="50%" y1="50%" x2="67%" y2="50%"
                    stroke="url(#gradient2)" strokeWidth="2" strokeDasharray="8 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(172, 66%, 50%)" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(172, 66%, 50%)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-20 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
      <section ref={statsRef} className="py-24 border-y border-border/30 bg-gradient-to-b from-card/30 to-background backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:120px_120px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item text-center group cursor-default">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">Capabilities</span>
          <div className="features-header text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Everything You Need to Build
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent mt-2">
                Intelligent AI Systems
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for creating, deploying, and managing AI agents at scale.
            </p>
          </div>

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 aurora opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-8"
            >
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/25">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Ready to Transform Your AI Workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers and teams building the next generation of intelligent applications.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-3 px-12 py-7 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
                Start Building Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
      {/* Capabilities Pills */}
      <section className="py-16 border-t border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: FileText, label: "RAG-Powered" },
              { icon: Cpu, label: "Edge Computing" },
              { icon: Globe, label: "Multi-Language" },
              { icon: Code2, label: "API-First" },
              { icon: Layers, label: "Infinitely Scalable" },
              { icon: Users, label: "Team Ready" }
            ].map((cap, i) => (
              <div 
                key={i} 
                className="capability-pill flex items-center gap-2 px-5 py-3 rounded-full bg-card/60 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-default"
              >
                <cap.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{cap.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">AI Agent Platform</span>
              </div>
              <p className="text-muted-foreground mb-2">
                Designed, Architected & Developed by
              </p>
              <p className="text-xl font-semibold text-gradient-primary">
                Elhamy M. Sobhy
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Documentation</Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2025 AI Agent Platform. All rights reserved.
      <footer className="py-16 border-t border-border/30 bg-gradient-to-t from-card/50 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">AI Agent Platform</span>
          </div>
          <p className="text-muted-foreground text-lg">
            Architected by <span className="text-primary font-semibold">Elhamy M. Sobhy</span>
          </p>
          <p className="text-sm text-muted-foreground/70 mt-4">© 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
