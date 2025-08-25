"use client";

import { useTransition } from "react";

import { Button } from "../ui/button";
import { addLocation } from "@/lib/actions/add-location";
import { Loader2 } from "lucide-react";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransation] = useTransition();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-foreground">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-indigo-300 backdrop-blur p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            {" "}
            Add New Location
          </h1>

          <form
            className="space-y-6"
            action={(formData: FormData) => {
              startTransation(() => {
                addLocation(formData, tripId);
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-2"> Address</label>
              <input
                name="address"
                type="text"
                required
                className="w-full border border-indigo-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full button-hover bg-indigo-500 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-2 w-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Location"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
