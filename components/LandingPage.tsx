"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plane, Compass, Globe2, Loader2 } from "lucide-react";
import Link from "next/link";
import { PricingTable, useUser } from "@clerk/nextjs";
import TiltCard from "./farmer-components/TiltCard";
import CountUpStat from "./farmer-components/CountAnimation";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    // simulate async action (API/auth/redirect)
    setTimeout(() => setLoading(false), 2000);
  };
  return (
    <div className="container mx-auto max-h-svh max-w-full pt-48 bg-gradient-to-t from-indigo-500/90 via-indigo-400 to-transparent text-foreground ">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-[187px] px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          Plan Your Perfect Trip with AI ✈️
        </motion.h1>
        <p className="text-lg max-w-2xl mb-8">
          Smart itineraries, budget-friendly suggestions, and unforgettable
          experiences—all in one travel planner.
        </p>
        <Link href={isSignedIn ? "/trips" : "/sign-in"}>
          <Button
            onClick={handleClick}
            className="button-hover bg-indigo-600 text-white hover:bg-indigo-600 px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>{isSignedIn ? "Start Planning Now" : "Login to Continue"}</>
            )}
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Travel Planner?
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <MapPin className="h-10 w-10 text-indigo-600" />,
              title: "Smart Itineraries",
              desc: "Generate personalized itineraries tailored to your interests.",
            },
            {
              icon: <Compass className="h-10 w-10 text-indigo-600" />,
              title: "Budget Planning",
              desc: "Get expense estimates and stay within your budget.",
            },
            {
              icon: <Plane className="h-10 w-10 text-indigo-600" />,
              title: "Multi-City Trips",
              desc: "Plan complex itineraries across multiple destinations.",
            },
            {
              icon: <Globe2 className="h-10 w-10 text-indigo-600" />,
              title: "Local Experiences",
              desc: "Discover hidden gems and authentic experiences.",
            },
          ].map((feature, idx) => (
            <TiltCard key={idx}>
              <Card className="p-8 shadow-md rounded-2xl">
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  {feature.icon}
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-gray-500">{feature.desc}</p>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-indigo-50 text-center">
        <h2 className="text-3xl font-bold mb-12 text-black">
          Trusted by Travelers Worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 10000, label: "Trips Planned", suffix: "+", decimals: 0 },
            { value: 4.9, label: "Average Rating", suffix: "/5", decimals: 1 },
            { value: 50, label: "Countries Covered", suffix: "+", decimals: 0 },
            {
              value: 100000,
              label: "Happy Travelers",
              suffix: "+",
              decimals: 0,
            },
          ].map((item, idx) => (
            <CountUpStat
              key={idx}
              value={item.value}
              label={item.label}
              suffix={item.suffix}
              decimals={item.decimals}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-12">
          Traveler Stories
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sophia",
              feedback:
                "This planner saved me hours of research and made my Europe trip seamless!",
            },
            {
              name: "Raj",
              feedback:
                "The AI suggestions helped me explore hidden gems in Bali I would’ve missed.",
            },
            {
              name: "Emma",
              feedback:
                "Budget planning was spot on—I saved money while enjoying more!",
            },
          ].map((testimonial, idx) => (
            <TiltCard key={idx}>
              <Card className="p-6 rounded-2xl shadow-md">
                <CardContent>
                  <p className="italic mb-4">“{testimonial.feedback}”</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {/* <PricingPlans /> */}
      <section className="py-20 px-6 bg-indigo-50 text-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>

        <div className="max-w-4xl mx-auto">
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: "#4f46e5",
                colorBackground: "#ffffff",
                borderRadius: "1rem",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                // Pricing Table
                pricingTableContainer:
                  "shadow-lg border border-gray-200 rounded-2xl",
                pricingPlan:
                  "hover:scale-[1.02] transition-transform duration-200",
                buttonPrimary:
                  "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg px-6 py-2",
                badge:
                  "bg-indigo-100 text-indigo-600 rounded-md px-2 py-1 text-sm",

                // Checkout Modal (Centered)
                checkoutModal:
                  "fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]", // <--- overlay + high z-index
                checkoutModalContent:
                  "bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative",

                checkoutModalHeader:
                  "text-xl font-bold text-gray-900 mb-4 flex justify-between items-center",
                checkoutModalCloseButton:
                  "text-gray-500 hover:text-gray-700 transition-colors",
                checkoutModalBody: "space-y-4 text-gray-700",
                checkoutModalFooter: "mt-6 flex justify-end",
                checkoutButton:
                  "bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold",
                checkoutPlanTitle: "text-lg font-semibold text-indigo-600",
                checkoutPlanPrice: "text-2xl font-bold text-gray-900",
                checkoutPlanInterval: "text-sm text-gray-500",
              },
            }}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              q: "✔ How does the AI travel planner work?",
              a: "Simply input your destination and preferences, and our AI generates a personalized itinerary.",
            },
            {
              q: "✔ Can I use it offline?",
              a: "Yes, with our Pro Plan you can download itineraries for offline use.",
            },
            {
              q: "✔ Is there a free version?",
              a: "Yes, the Free Plan includes basic itinerary and budget suggestions.",
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-lg ml-10">{faq.q}</h3>
              <p className="text-gray-400 ml-16">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-indigo-500">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Plan Your Next Adventure?
        </h2>
        <Link href={isSignedIn ? "/trips" : "/sign-in"}>
          <Button
            onClick={handleClick}
            className="button-hover bg-indigo-600 text-white hover:bg-indigo-600 px-6 py-2 rounded-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>{isSignedIn ? "Start Planning Now" : "Login to Continue"}</>
            )}
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-900 text-gray-300 text-center">
        <p>© {new Date().getFullYear()} Travel Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}
