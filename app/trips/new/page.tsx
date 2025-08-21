"use client";

import React, { useState, startTransition, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import DashboardButton from "@/components/DashboardButton";

export default function NewTrip() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Loading screen while Clerk is fetching user
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user, block access
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <p>Please log in to create a trip.</p>
      </div>
    );
  }

  const createTrip = async (formData: FormData) => {
    try {
      setIsPending(true);

      const res = await fetch("/api/trips", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Failed to create trip");
      }

      toast.success("Trip created successfully! 🎉", { duration: 2000 });
      router.push("/trips?refresh=true");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setIsPending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    startTransition(() => {
      createTrip(formData);
    });
  };

  return (
    <>
      {/* Dashboard Button aligned left */}
      <DashboardButton />

      <div className="max-w-lg mx-auto mt-10 flex flex-col gap-6 pt-14">
        {/* Card centered */}
        <div className="w-full flex justify-center">
          <Card className="bg-indigo-600/40 w-full max-w-lg border-indigo-600 backdrop-blur-md">
            <CardHeader className="text-2xl pb-2">New Trip</CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Japan trip..."
                    className={cn(
                      "w-full border border-indigo-300 px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    )}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Trip description..."
                    className={cn(
                      "w-full border border-indigo-300 px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    )}
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className={cn(
                        "w-full border border-indigo-300 px-3 py-2",
                        "rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className={cn(
                        "w-full border border-indigo-300 px-3 py-2",
                        "rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-2 font-medium">Trip Image</label>

                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt="Trip Preview"
                      className="w-full mb-4 rounded-md max-h-48 object-cover"
                      width={300}
                      height={100}
                    />
                  )}

                  {isUploading && (
                    <div className="w-full h-48 bg-indigo-500 rounded-md animate-pulse mb-4" />
                  )}

                  <div className="flex flex-col items-start gap-2">
                    <UploadButton
                      endpoint="imageUploader"
                      className={cn(
                        "border-2 border-dashed border-indigo-700 rounded-lg px-6 py-4 w-full flex flex-col items-center justify-center gap-2 hover:border-indigo-800 transition-colors",
                        isUploading && "opacity-50 cursor-not-allowed"
                      )}
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res && res[0]?.ufsUrl) {
                          setImageUrl(res[0].ufsUrl);
                          toast.success("Image uploaded successfully!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        console.error("Upload error: ", error);
                        toast.error("Image upload failed.");
                      }}
                    />

                    {isUploading && (
                      <p className="text-xs text-indigo-500 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading image...
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending || isUploading}
                  variant="default"
                  className="button-hover w-full bg-indigo-500 text-white font-semibold px-6 py-2 hover:bg-indigo-500"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
