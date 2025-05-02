'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Map, Calendar, CreditCard, Users, HeartHandshake } from 'lucide-react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Compass,
    title: "Discover Hidden Gems",
    description: "Explore off-the-beaten-path destinations curated by local experts.",
    color: "bg-blue-ice",
    delay: 0.1
  },
  {
    icon: Map,
    title: "Personalized Itineraries",
    description: "Custom travel plans tailored to your preferences and interests.",
    color: "bg-teal-light",
    delay: 0.2
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Easily adjust your travel dates with our flexible booking system.",
    color: "bg-blue-powder",
    delay: 0.3
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Worry-free transactions with our encrypted payment gateway.",
    color: "bg-beige",
    delay: 0.4
  },
  {
    icon: Users,
    title: "Group Discounts",
    description: "Special rates for family trips and group adventures.",
    color: "bg-blue-ice",
    delay: 0.5
  },
  {
    icon: HeartHandshake,
    title: "Local Partnerships",
    description: "Support local communities through our ethical tourism initiatives.",
    color: "bg-teal-light",
    delay: 0.6
  }
];

export default function ParallaxFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const featureElements = featuresRef.current;
    
    if (!section || featureElements.length === 0) return;

    // Create parallax effect for the section background
    gsap.fromTo(
      section,
      { backgroundPosition: '50% 0%' },
      {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    // Animate each feature card
    featureElements.forEach((feature, index) => {
      gsap.fromTo(
        feature,
        { 
          y: 100,
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          },
          delay: features[index].delay
        }
      );
    });

    // Parallax effect for feature cards
    featureElements.forEach((feature) => {
      gsap.to(feature, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: feature,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });

    // Mouse movement parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!section) return;
      
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;
      
      featureElements.forEach((feature, index) => {
        const depth = 0.5 + (index % 3) * 0.2; // Different depths for different cards
        gsap.to(feature, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 1,
          ease: 'power1.out'
        });
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative bg-cover bg-fixed"
      style={{ 
        backgroundImage: 'url(https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-52379.jpg?w=1380&t=st=1743507255~exp=1743507855~hmac=c5c8e8e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5)'
      }}
    >
      <div className="absolute inset-0 bg-navy-DEFAULT/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore Our Features</h2>
          <p className="text-xl text-blue-ice max-w-3xl mx-auto">
            Discover why travelers choose TracoIt for their adventures around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => {
                if (el) {
                  featuresRef.current[index] = el;
                }
              }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className={`p-4 rounded-full mb-6 inline-block ${feature.color}`}>
                <feature.icon className="h-8 w-8 text-navy-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-ice/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
