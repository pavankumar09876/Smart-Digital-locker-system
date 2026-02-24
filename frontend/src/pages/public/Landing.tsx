import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  MapPin, 
  Clock, 
  Smartphone, 
  ChevronRight, 
  ArrowRight,
  Box,
  Zap,
  Users
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Storage",
      description: "Military-grade encryption and secure lockers protect your belongings",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Multiple Locations",
      description: "Conveniently located locker points across the city",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Easy Access",
      description: "Mobile app integration for seamless locker management",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Access your items anytime, anywhere",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Lockers", icon: <Box className="w-6 h-6" /> },
    { number: "50+", label: "Locations", icon: <MapPin className="w-6 h-6" /> },
    { number: "10K+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
        
        {/* Mouse Follower */}
        <div
          className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Navigation */}
        <nav className="relative z-50 flex justify-between items-center p-6 backdrop-blur-md bg-slate-900/50 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex-center">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">SmartLocker</span>
          </div>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors relative z-[9999] pointer-events-auto"
              style={{ position: 'relative', zIndex: 9999 }}
              onClick={() => {
                console.log('Login button clicked in Edge');
                navigate('/login');
              }}
            >
              Login
            </button>
            <Link 
              to="/signup"
              className="btn btn-primary"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Secure Storage
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Store your belongings safely with our smart locker system. 
                  Access anytime, anywhere with secure OTP-based retrieval.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="btn btn-primary text-lg px-8 py-4 group"
                  onClick={() => {
                    console.log('Hero Get Started Now clicked in Edge');
                    navigate('/signup');
                  }}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="btn btn-secondary text-lg px-8 py-4"
                  onClick={() => {
                    console.log('Hero Sign In clicked in Edge');
                    navigate('/login');
                  }}
                >
                  Sign In
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Locker */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-80 h-80">
                {/* Locker Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse" />
                
                {/* 3D Locker Animation */}
                <div className="relative w-full h-full transform-gpu animate-rotate-3d">
                  <div className="absolute inset-0 bg-slate-800 rounded-2xl border border-primary/30 shadow-2xl flex items-center justify-center">
                    <div className="space-y-4 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-primary">Smart Locker</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-rotate">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-gradient-to-r from-primary to-purple-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 90}deg) translateX(150px) translateY(-50%)`,
                        animation: `orbit 8s linear infinite`,
                        animationDelay: `${i * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Why Choose SmartLocker?
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Experience the future of secure storage with our innovative features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`glass-card p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/50 ${
                    activeFeature === index ? 'border-primary/50 bg-primary/10' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-slate-300">Simple steps to secure your belongings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Find Location", desc: "Browse nearby locker points", icon: <MapPin /> },
                { step: 2, title: "Store Item", desc: "Book a locker and drop off", icon: <Box /> },
                { step: 3, title: "Share OTP", desc: "Receiver collects securely", icon: <Zap /> }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-purple-500" />
                    )}
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of users who trust SmartLocker for their storage needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="btn btn-primary text-lg px-8 py-4 group"
                >
                  Create Account
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex-center">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">SmartLocker</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 SmartLocker. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
