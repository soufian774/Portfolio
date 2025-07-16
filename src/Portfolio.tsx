import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Mail, Linkedin, ArrowDown, Code, Database, Cloud, Cpu, Brain, Smartphone, Menu, X, Send, CheckCircle, AlertCircle, Download, Sun, Moon, ArrowUp } from 'lucide-react';

const Portfolio = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Loading animation
    const timer = setTimeout(() => setIsLoaded(true), 500);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const observeTargets = () => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => observer.observe(el));
    };

    // Delay to ensure DOM is ready
    setTimeout(observeTargets, 1000);
    
    let animationFrameId: number;
    let scrollTimeout: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    const handleScroll = () => {
      // Direct calculation without timeout for immediate response
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setScrollY(currentScrollY);
      
      // Multiple methods to calculate scroll progress - More robust
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;
      
      let progress = 0;
      if (scrollableHeight > 0 && currentScrollY > 0) {
        progress = Math.min(Math.max((currentScrollY / scrollableHeight) * 100, 0), 100);
      }
      
      // Debug logging - Remove in production if needed
      console.log('Scroll Debug:', {
        currentScrollY,
        documentHeight,
        windowHeight,
        scrollableHeight,
        progress
      });
      
      setScrollProgress(progress);
      
      // Update active section with debouncing
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = ['hero', 'skills', 'projects', 'contact'];
        const navHeight = 64; // Height of the navigation bar
        const offset = navHeight + 50; // Small additional offset
        
        // Find the section that's most visible in the viewport
        let currentSection = sections[0]; // Default to hero
        let maxVisibleArea = 0;
        
        sections.forEach(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate visible area of the section
            const visibleTop = Math.max(rect.top, offset);
            const visibleBottom = Math.min(rect.bottom, windowHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // If this section has more visible area, make it active
            if (visibleHeight > maxVisibleArea) {
              maxVisibleArea = visibleHeight;
              currentSection = section;
            }
            
            // Special case: if we're at the very top, always show hero
            if (currentScrollY < 100) {
              currentSection = 'hero';
            }
            
            // Special case: if we're near the bottom, show contact
            const documentHeight = Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            );
            if (currentScrollY + windowHeight > documentHeight - 100) {
              currentSection = 'contact';
            }
          }
        });
        
        setActiveSection(currentSection);
      }, 50); // Reduced debounce for more responsive updates
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: false });
    document.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('wheel', handleScroll, { passive: false });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(scrollTimeout);
      clearTimeout(timer);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Immediately update active section for instant feedback
      setActiveSection(sectionId);
      
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Monitor scroll progress during smooth scrolling
      const monitorScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        
        let progress = 0;
        if (scrollableHeight > 0 && currentScrollY > 0) {
          progress = Math.min(Math.max((currentScrollY / scrollableHeight) * 100, 0), 100);
        }
        
        setScrollY(currentScrollY);
        setScrollProgress(progress);
        
        // Continue monitoring until scroll stabilizes
        const targetRect = element.getBoundingClientRect();
        if (Math.abs(targetRect.top) > 10) { // Still scrolling
          requestAnimationFrame(monitorScroll);
        }
      };
      
      // Start monitoring immediately
      requestAnimationFrame(monitorScroll);
    }
    setIsMobileMenuOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    setTimeout(() => {
      setFormStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 2000);
  };

  const handleDownloadCV = () => {
    // Download PDF from public folder
    const pdfUrl = '/Curriculum_SoufianMarkouni.pdf';
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'Curriculum_SoufianMarkouni.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    console.log('Scroll to top clicked!'); // Debug log
    
    // Get current scroll position
    const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // If already at top, no need to scroll
    if (startPosition === 0) return;
    
    // First try native smooth scroll
    const tryNativeSmooth = () => {
      try {
        window.scrollTo({ 
          top: 0, 
          left: 0,
          behavior: 'smooth' 
        });
        
        // Check if native smooth scroll is working
        let checkCount = 0;
        const checkInterval = setInterval(() => {
          const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          checkCount++;
          
          // If we've reached the top or it's been working for a while, clear interval
          if (currentPosition === 0 || checkCount > 20) {
            clearInterval(checkInterval);
            if (currentPosition === 0) {
              console.log('Native smooth scroll completed successfully');
            }
            return;
          }
          
          // If scroll position hasn't changed after a very short time, use custom animation
          if (checkCount > 3 && currentPosition === startPosition) {
            clearInterval(checkInterval);
            console.log('Native smooth scroll failed, using custom animation');
            customSmoothScroll();
          }
        }, 16); // 16ms = ~60fps for smoother checking
        
      } catch (error) {
        console.log('Native smooth scroll not supported, using custom animation');
        customSmoothScroll();
      }
    };
    
    // Custom smooth scroll animation
    const customSmoothScroll = () => {
      const startTime = performance.now();
      const duration = 800; // 800ms animation
      
      const easeInOutQuad = (t: number) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentPosition = startPosition * (1 - easeInOutQuad(progress));
        
        // Set scroll position on multiple elements for maximum compatibility
        window.scrollTo(0, currentPosition);
        document.documentElement.scrollTop = currentPosition;
        document.body.scrollTop = currentPosition;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          console.log('Custom smooth scroll animation completed');
        }
      };
      
      requestAnimationFrame(animateScroll);
    };
    
    // Start with native smooth scroll
    tryNativeSmooth();
  };

  const skillCategories = [
    {
      title: "Frontend",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      skills: ["React", "TypeScript", "Vue.js", "Tailwind CSS", "Vite"]
    },
    {
      title: "Backend",
      icon: <Database className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      skills: ["Node.js", "Python", "Express.js", "PostgreSQL", "MongoDB"]
    },
    {
      title: "DevOps",
      icon: <Cloud className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      skills: ["Docker", "Azure", "Git", "Linux", "CI/CD"]
    },
    {
      title: "Embedded",
      icon: <Cpu className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      skills: ["ESP32", "C/C++", "Arduino", "MQTT", "Modbus"]
    },
    {
      title: "AI/ML",
      icon: <Brain className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-500",
      skills: ["Python", "TensorFlow", "Computer Vision", "Data Analysis"]
    },
    {
      title: "Mobile",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      skills: ["React Native", "PWA", "Responsive Design", "Cross-platform"]
    }
  ];

  const projects = [
    {
      id: 1,
      title: "AutoMud",
      category: "Enterprise PWA",
      description: "Sistema gestionale completo per aziende con dashboard real-time, gestione richieste avanzata e integrazione cloud. Supporta oltre 10k utenti con 99.9% uptime.",
      tech: ["React", "Express.js", "PostgreSQL", "Azure", "Docker"],
      highlights: ["10k+ Users", "99.9% Uptime", "Real-time Dashboard"],
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Industrial Saw Simulator",
      category: "IoT Simulation",
      description: "Simulatore avanzato di macchinari industriali con gemello digitale, telemetria real-time e integrazione SCADA per ottimizzazione produzione.",
      tech: ["Python", "MQTT", "InfluxDB", "Grafana", "Industrial Protocols"],
      highlights: ["Real-time Telemetry", "SCADA Integration", "Digital Twin"],
      gradient: "from-green-600 via-teal-600 to-blue-600"
    },
    {
      id: 3,
      title: "Traffic AI Optimization",
      category: "Smart City AI",
      description: "Sistema di ottimizzazione traffico urbano con ML avanzato. Riduce incidenti del 35% e tempi di attesa del 20% attraverso analisi predittiva.",
      tech: ["Python", "TensorFlow", "SUMO", "Docker", "Computer Vision"],
      highlights: ["35% ↓ Accidents", "20% ↓ Wait Time", "94% ML Accuracy"],
      gradient: "from-purple-600 via-pink-600 to-red-600"
    },
    {
      id: 4,
      title: "ESP32 MQTT Bridge",
      category: "Embedded IoT",
      description: "Gateway IoT industriale con protocolli Modbus, captive portal WiFi, OTA updates e resilienza offline. Certificato per ambienti critici.",
      tech: ["C/C++", "ESP-IDF", "Modbus RTU", "MQTT", "FreeRTOS"],
      highlights: ["Industrial Grade", "OTA Updates", "99.8% Reliability"],
      gradient: "from-orange-600 via-red-600 to-pink-600"
    }
  ];

  const themeClasses = {
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      cardBg: 'from-gray-900/50 to-gray-800/30',
      border: 'border-gray-700/50',
      inputBg: 'bg-gray-800/50',
      inputBorder: 'border-gray-700',
      navBg: 'bg-black/20',
      gradientText: 'from-white to-gray-300',
      secondaryText: 'text-gray-400'
    },
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      cardBg: 'from-white/90 to-gray-50/90',
      border: 'border-gray-200/50',
      inputBg: 'bg-white/50',
      inputBorder: 'border-gray-300',
      navBg: 'bg-white/20',
      gradientText: 'from-gray-900 to-gray-600',
      secondaryText: 'text-gray-600'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div className={`min-h-screen w-full ${currentTheme.bg} ${currentTheme.text} relative overflow-x-hidden transition-colors duration-500`}>
      
      {/* Loading Animation */}
      <div className={`fixed inset-0 z-[100] ${currentTheme.bg} flex items-center justify-center transition-all duration-1000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-light bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            SOUFIAN
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 sm:h-2 bg-gray-800 z-50 backdrop-blur-sm border-b border-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-200 ease-out shadow-lg shadow-purple-500/50"
          style={{ 
            width: `${scrollProgress}%`,
            minWidth: scrollProgress > 0 ? '4px' : '0px',
            background: scrollProgress > 0 
              ? 'linear-gradient(to right, #8b5cf6, #ec4899, #3b82f6)' 
              : 'transparent'
          }}
        />
      </div>

      {/* Scroll to Top Button - Simplified and Working */}
      <div
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center ${
          scrollY > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ 
          userSelect: 'none',
          touchAction: 'manipulation'
        }}
        role="button"
        tabIndex={0}
        aria-label="Scroll to top"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
          }
        }}
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </div>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black' 
            : 'bg-gradient-to-br from-purple-100/30 via-blue-100/20 to-white'
        }`} />
        
        <div 
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: mousePos.x - 400,
            top: mousePos.y - 400,
            width: 800,
            height: 800,
            background: theme === 'dark' 
              ? `radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 25%, rgba(59, 130, 246, 0.04) 50%, transparent 70%)`
              : `radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.04) 25%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={`absolute w-96 h-96 rounded-full blur-3xl will-change-transform transition-colors duration-500 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-500/8 to-pink-500/8' 
                : 'bg-gradient-to-r from-purple-500/4 to-pink-500/4'
            }`}
            style={{
              top: '10%',
              left: '10%',
              transform: `translate3d(${scrollY * 0.05}px, ${Math.sin(scrollY * 0.005) * 25}px, 0)`,
            }}
          />
          <div 
            className={`absolute w-80 h-80 rounded-full blur-3xl will-change-transform transition-colors duration-500 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-500/8 to-cyan-500/8' 
                : 'bg-gradient-to-r from-blue-500/4 to-cyan-500/4'
            }`}
            style={{
              top: '60%',
              right: '10%',
              transform: `translate3d(${-scrollY * 0.08}px, ${Math.cos(scrollY * 0.005) * 15}px, 0)`,
            }}
          />
          <div 
            className={`absolute w-72 h-72 rounded-full blur-3xl will-change-transform transition-colors duration-500 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-green-500/8 to-emerald-500/8' 
                : 'bg-gradient-to-r from-green-500/4 to-emerald-500/4'
            }`}
            style={{
              bottom: '20%',
              left: '20%',
              transform: `translate3d(${scrollY * 0.04}px, ${Math.sin(scrollY * 0.004) * 20}px, 0)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.navBg} backdrop-blur-xl border-b ${currentTheme.border} transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className={`text-xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                SOUFIAN
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {[
                  { name: 'Home', id: 'hero' },
                  { name: 'Skills', id: 'skills' },
                  { name: 'Progetti', id: 'projects' },
                  { name: 'Contatti', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all duration-300 relative ${
                      activeSection === item.id 
                        ? currentTheme.text 
                        : `${currentTheme.secondaryText} hover:${currentTheme.text}`
                    }`}
                  >
                    {item.name}
                    {activeSection === item.id && (
                      <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-purple-500 to-blue-500" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Desktop Social Links */}
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}
                  onClick={() => window.open('https://github.com/soufian774', '_blank')}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}>
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}>
                  <Mail className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden ${currentTheme.navBg} backdrop-blur-xl`}>
            <div className="px-4 py-6 space-y-4">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'Skills', id: 'skills' },
                { name: 'Projects', id: 'projects' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? `bg-gradient-to-r from-purple-500/20 to-blue-500/20 ${currentTheme.text} border border-purple-500/30` 
                      : `${currentTheme.secondaryText} hover:${currentTheme.text} hover:bg-white/5`
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className={`pt-4 border-t ${currentTheme.border}`}>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}
                    onClick={() => window.open('https://github.com/soufian774', '_blank')}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}>
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className={`${currentTheme.secondaryText} hover:${currentTheme.text}`}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16">
          <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-green-500/20 mb-6 sm:mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-green-400 font-medium">Available for new opportunities</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              <span className={`block bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                SOUFIAN
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mt-2 sm:mt-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Developer
              </span>
            </h1>

            {/* Description */}
            <p className={`text-base sm:text-lg md:text-xl ${currentTheme.secondaryText} mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0`}>
              Trasformo idee innovative in{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                soluzioni digitali straordinarie
              </span>
              <br className="hidden sm:block" />
              Specializzato in web development, sistemi embedded e AI
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-16 px-4 sm:px-0">
              <Button 
                onClick={() => scrollToSection('projects')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
              >
                Esplora i Progetti
                <ArrowDown className="w-5 h-5 ml-2 animate-bounce" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleDownloadCV}
                className="border-gray-600 hover:border-white hover:bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full transition-all duration-300 group w-full sm:w-auto"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Scarica CV
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
              {[
                { number: '4+', label: 'Anni Esperienza' },
                { number: '15+', label: 'Progetti Completati' },
                { number: '99%', label: 'Soddisfazione Cliente' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className={`text-xs sm:text-sm ${currentTheme.secondaryText} mt-1`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div 
              className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${visibleElements.has('skills-header') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              data-animate
              id="skills-header"
            >
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                Stack Tecnologico
              </h2>
              <p className={`text-base sm:text-lg lg:text-xl ${currentTheme.secondaryText} max-w-2xl mx-auto`}>
                Competenze trasversali per soluzioni complete e innovative
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {skillCategories.map((category, index) => (
                <Card 
                  key={index} 
                  className={`group bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border} hover:border-gray-600/50 transition-all duration-700 hover:scale-105 cursor-pointer backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 ${
                    visibleElements.has(`skill-${index}`) 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  data-animate
                  id={`skill-${index}`}
                >
                  <CardContent className="p-4 sm:p-6 relative overflow-hidden">
                    {/* Enhanced hover gradient overlay */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500 rounded-xl`} />
                    <div className={`absolute -inset-1 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-6 transition-opacity duration-700 rounded-xl`} />
                    <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-4 transition-opacity duration-500 delay-100 rounded-xl`} />
                    
                    <div className="relative z-10 bg-transparent">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${category.color} text-white group-hover:rotate-12 transition-transform duration-300`}>
                          {category.icon}
                        </div>
                        <h3 className={`text-lg sm:text-xl font-semibold ${currentTheme.text} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300`}>
                          {category.title}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {category.skills.map((skill, skillIndex) => (
                          <div 
                            key={skillIndex} 
                            className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300"
                            style={{ transitionDelay: `${skillIndex * 50}ms` }}
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} group-hover:scale-125 transition-transform duration-300`} />
                            <span className={`text-xs sm:text-sm transition-colors duration-300 ${
                              theme === 'dark' 
                                ? 'text-gray-300 group-hover:text-white' 
                                : 'text-gray-600 group-hover:text-gray-900'
                            }`}>
                              {skill}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div 
              className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${visibleElements.has('projects-header') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              data-animate
              id="projects-header"
            >
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                Progetti in Evidenza
              </h2>
              <p className={`text-base sm:text-lg lg:text-xl ${currentTheme.secondaryText} max-w-2xl mx-auto`}>
                Soluzioni innovative che fanno la differenza nel mondo reale
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className={`group bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border} hover:border-gray-600/50 transition-all duration-700 hover:scale-[1.03] cursor-pointer backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 ${
                    visibleElements.has(`project-${index}`) 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-30 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  data-animate
                  id={`project-${index}`}
                >
                  <CardContent className="p-0 relative overflow-hidden">
                    {/* Multi-layer animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-all duration-700`} />
                    <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-5 transition-all duration-700 delay-100`} />
                    <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-3 transition-all duration-700 delay-200`} />
                    
                    {/* Project Header with enhanced gradient */}
                    <div className={`h-3 bg-gradient-to-r ${project.gradient} group-hover:h-4 transition-all duration-300`} />
                    
                    <div className="p-4 sm:p-6 relative z-10">
                      {/* Category with micro-animation */}
                      <Badge 
                        variant="outline" 
                        className="mb-4 border-purple-500/50 text-purple-400 bg-purple-500/10 group-hover:border-purple-400 group-hover:bg-purple-500/20 group-hover:scale-105 transition-all duration-300"
                      >
                        {project.category}
                      </Badge>
                      
                      {/* Title with enhanced hover effect */}
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 group-hover:scale-105 transform-gpu">
                        {project.title}
                      </h3>
                      
                      {/* Description */}
                      <p className={`text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 transition-colors duration-300 ${
                        theme === 'dark' 
                          ? 'text-gray-300 group-hover:text-white' 
                          : 'text-gray-600 group-hover:text-gray-900'
                      }`}>
                        {project.description}
                      </p>
                      
                      {/* Highlights with staggered animation */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {project.highlights.map((highlight, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 group-hover:bg-green-500/20 group-hover:border-green-500/40 group-hover:scale-105 transition-all duration-300"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:animate-pulse" />
                            <span className="text-green-400 text-xs sm:text-xs font-medium group-hover:text-green-300 transition-colors duration-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Technologies with enhanced hover */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {project.tech.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex} 
                            variant="secondary" 
                            className={`transition-all duration-300 group-hover:scale-105 ${
                              theme === 'dark'
                                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 group-hover:bg-gray-700/70 group-hover:text-white'
                                : 'bg-gray-200/50 text-gray-600 hover:bg-gray-300/50 group-hover:bg-gray-300/70 group-hover:text-gray-900'
                            }`}
                            style={{ transitionDelay: `${techIndex * 50}ms` }}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Actions with enhanced animations */}
                      <div className="flex gap-2 sm:gap-3 group-hover:translate-y-0 translate-y-1 transition-transform duration-300">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`flex-1 ${currentTheme.border} hover:border-white hover:bg-white hover:text-black transition-all duration-300 group-hover:scale-105 transform-gpu`}
                          onClick={() => window.open('https://github.com/soufian774', '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Codice
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={`flex-1 transition-all duration-300 transform-gpu group-hover:scale-105 hover:bg-white/5 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-white'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div 
              className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${visibleElements.has('contact-content') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              data-animate
              id="contact-content"
            >
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                Iniziamo a Collaborare
              </h2>
              <p className={`text-base sm:text-lg lg:text-xl ${currentTheme.secondaryText} mb-8 sm:mb-12 leading-relaxed`}>
                Hai un progetto in mente? Trasformiamo le tue idee in{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                  realtà straordinarie
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Contact Form */}
              <div 
                className={`transition-all duration-1000 delay-200 ${visibleElements.has('contact-content') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <Card className={`bg-gradient-to-br ${currentTheme.cardBg} ${currentTheme.border} backdrop-blur-sm`}>
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <h3 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${currentTheme.text}`}>Invia un Messaggio</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-6">
                      <div>
                        <label className={`block text-sm font-medium ${currentTheme.secondaryText} mb-2`}>Nome</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          className={`w-full px-4 py-3 ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-lg ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                          placeholder="Il tuo nome"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${currentTheme.secondaryText} mb-2`}>Email</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          className={`w-full px-4 py-3 ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-lg ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                          placeholder="tua@email.com"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${currentTheme.secondaryText} mb-2`}>Messaggio</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          className={`w-full px-4 py-3 ${currentTheme.inputBg} border ${currentTheme.inputBorder} rounded-lg ${currentTheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none`}
                          placeholder="Raccontami del tuo progetto..."
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={formStatus === 'sending'}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {formStatus === 'sending' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Invio in corso...
                          </>
                        ) : formStatus === 'success' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Messaggio inviato!
                          </>
                        ) : formStatus === 'error' ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Errore nell'invio
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Invia Messaggio
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div 
                className={`transition-all duration-1000 delay-400 ${visibleElements.has('contact-content') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                <div className="space-y-8">
                  <div>
                    <h3 className={`text-2xl font-bold mb-6 ${currentTheme.text}`}>Informazioni di Contatto</h3>
                    <div className="space-y-4">
                      <div className={`flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border ${currentTheme.border} hover:border-gray-600/50 transition-all duration-300`}>
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm ${currentTheme.secondaryText}`}>Email</p>
                          <p className={`text-sm sm:text-base ${currentTheme.text} truncate`}>soufianmarkouni3@gmail.com</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border ${currentTheme.border} hover:border-gray-600/50 transition-all duration-300`}>
                        <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                          <div className="w-5 h-5 text-white flex items-center justify-center text-sm">📍</div>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm ${currentTheme.secondaryText}`}>Posizione</p>
                          <p className={`text-sm sm:text-base ${currentTheme.text}`}>Veneto, Italia</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${currentTheme.text}`}>Seguimi sui Social</h4>
                    <div className="flex gap-2 sm:gap-4">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 rounded-full p-4 group transition-all duration-300 hover:scale-110"
                        onClick={() => window.open('https://github.com/soufian774', '_blank')}
                      >
                        <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 rounded-full p-4 group transition-all duration-300 hover:scale-110"
                      >
                        <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-gray-700 hover:border-green-500 hover:bg-green-500/10 rounded-full p-4 group transition-all duration-300 hover:scale-110"
                      >
                        <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>

                  <div className={`p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20`}>
                    <h4 className={`text-base sm:text-lg font-semibold mb-2 ${currentTheme.text}`}>Tempi di Risposta</h4>
                    <p className={`${currentTheme.secondaryText} text-xs sm:text-sm`}>
                      Rispondo generalmente entro 24 ore. Per progetti urgenti, 
                      contattami direttamente via email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 sm:py-12 px-4 sm:px-8 border-t ${currentTheme.border} backdrop-blur-sm`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className={`${currentTheme.secondaryText} text-xs sm:text-sm text-center sm:text-left`}>
              © 2025 Made By Soufian
            </div>
            <div className={`${currentTheme.secondaryText} text-xs sm:text-sm text-center sm:text-left`}>
              Made with React • TypeScript • Tailwind • shadcn/ui
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;