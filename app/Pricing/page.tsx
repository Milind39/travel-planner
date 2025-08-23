import React from "react";

import { PricingTable } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";

const Pricing = () => {
  return (
    <section className="py-[55px] container m-16 max-w-screen">
      <h1 className="text-4xl font-bold text-foreground text-center mb-12 border rounded-lg p-2">
        Choose Your Plan
      </h1>

      <div className="max-w-4xl mx-auto rounded-xl pt-1">
        <Card className="border-0">
          <CardContent className=" p-4 bg-gradient-to-b from-indigo-300 via-indigo-200 to-transparent border-0">
            <PricingTable
              checkoutProps={{
                appearance: {
                  elements: {
                    drawerRoot: {
                      zIndex: 200,
                    },
                    buttonPrimary: {
                      backgroundColor: "#4f46e5", // Indigo-600
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "12px",
                      padding: "12px 20px",
                      transition: "all 0.2s ease-in-out",
                    },
                    buttonPrimary__hover: {
                      backgroundColor: "#4338ca", // Indigo-700
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
