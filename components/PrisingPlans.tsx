"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function PricingPlans() {
  const { user } = useUser();
  const [sub, setSub] = useState("free");

  useEffect(() => {
    if (user?.publicMetadata?.subscription) {
      setSub(user.publicMetadata.subscription as string);
    }
  }, [user]);

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url; // Stripe checkout
  };

  return (
    <section className="py-20 px-6 bg-indigo-50 text-black">
      <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free */}
        <Card className="p-6 rounded-2xl shadow-md bg-white">
          <h3 className="font-bold text-xl mb-2">Free Plan</h3>
          <p className="text-3xl font-bold text-indigo-600 mb-4">$0</p>
          <ul className="text-gray-600 mb-6">
            <li>✔ Basic Itinerary</li>
            <li>✔ Budget Suggestions</li>
            <li>✔ Popular Destinations</li>
          </ul>
          {sub === "free" ? (
            <Button
              variant={"secondary"}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed hover:bg-gray-400 mt-7"
            >
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={handleCheckout}
              variant={"secondary"}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 button-hover"
            >
              Get Started
            </Button>
          )}
        </Card>

        {/* Pro */}
        <Card className="p-6 rounded-2xl shadow-md bg-white">
          <h3 className="font-bold text-xl mb-2">Pro Plan</h3>
          <p className="text-3xl font-bold text-indigo-600 mb-4">$9.99/mo</p>
          <ul className="text-gray-600 mb-6">
            <li>✔ Multi-City Planning</li>
            <li>✔ Offline Access</li>
            <li>✔ Custom Experiences</li>
            <li>✔ Priority Support</li>
          </ul>
          {sub === "pro" ? (
            <Button
              variant={"default"}
              className="bg-green-500 text-white px-6 py-2 rounded-lg button-hover"
            >
              Manage Subscription
            </Button>
          ) : (
            <Button
              onClick={handleCheckout}
              className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 button-hover"
            >
              Upgrade to Pro
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
}
