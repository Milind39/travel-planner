"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PageHeaderProps {
  backLink?: string;
  backLabel?: string;
}

const DashBoardButton = ({
  backLink = "/trips",
  backLabel = "Dashboard",
}: PageHeaderProps) => {
  const [loading, setloading] = useState(false);
  const handleNavigate = () => {
    setloading(true);
  };
  return (
    <div className="flex flex-col justify-between gap-5 mb-8 pt-14 pl-20 fixed">
      <Link href={backLink}>
        <Button
          variant="secondary"
          className=" bg-indigo-500 hover:bg-indigo-400 text-white button-hover"
          onClick={handleNavigate}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Loading ...
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </>
          )}
        </Button>
      </Link>
    </div>
  );
};

export default DashBoardButton;
