"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { cn, isEmail } from "@/utils";
import { subscribeMail } from "@/lib/api/marketing";
import BeamWrapper from "@/ui/widget/beam-wrapper";

const SubscribeEmail = () => {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    // Check if email is provided
    if (!isEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    const loadingToast = toast.loading("Subscribing...");

    subscribeMail(email)
      .then((res) => {
        toast.dismiss(loadingToast);
        if (res) {
          toast.success("Subscribed successfully");
          setEmail(""); // Clear the email input
        } else {
          throw new Error("Failed to subscribe");
        }
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message);
      });
  };

  return (
    <BeamWrapper className="relative" roundClass="rounded-full">
      <div
        className={cn(
          "max-w-[361px] w-full h-[58px] p-[1px]",
          "rounded-full relative overflow-hidden",
          "flex items-center justify-center",
          "bg-gradient_cheap_primary backdrop-blur-[2px]"
        )}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div
            className={cn("w-full h-full rounded-full", "flex items-center")}
          >
            <input
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full p-[12px_2rem] text-black text-sm border-none outline-none flex-1 bg-transparent"
            />

            <button
              type="submit"
              onClick={subscribe}
              className="flex items-center justify-center bg-primary text-sm m-[7px] p-[12px_13px] rounded-3xl text-white text-center"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </BeamWrapper>
  );
};

export default SubscribeEmail;
