"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AchievementPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Show popup on every page load
        setIsOpen(true);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl border border-gray-200 shadow-lg p-0 overflow-hidden">
                <div className="flex">
                    {/* Left Section - Badge/Image */}
                    <div className="hidden md:flex md:w-2/5 bg-gray-50 border-r border-gray-200 items-center justify-center p-8">
                        <div className="text-center">
                            <div className="mb-4">
                                <Image
                                    src="/f6s.png"
                                    alt="F6S Logo"
                                    width={120}
                                    height={120}
                                    className="mx-auto"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Top Ranking</p>
                            <p className="text-xs text-gray-500 mt-1">in India</p>
                        </div>
                    </div>

                    {/* Right Section - Content */}
                    <div className="w-full md:w-3/5 p-8 relative">
                        <DialogClose className="absolute top-4 right-4 h-6 w-6 text-gray-400 hover:text-gray-600" />

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recognition</p>
                                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                    Mentorle
                                </h2>
                                <p className="text-sm text-gray-700 mt-2">
                                    Recognized as one of India's 18 largest mentoring companies by F6S
                                </p>
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex gap-3 text-sm">
                                    <span className="text-gray-600">Company</span>
                                    <span className="font-medium text-gray-900">Mentorle</span>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium text-gray-900">Mentoring</span>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium text-gray-900">May 2026</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    F6S community recognizes verified companies and startups across industries. This recognition reflects our impact in the mentoring space.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    onClick={handleClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                                    onClick={() => {
                                        window.open(
                                            "https://www.f6s.com/companies/mentoring/india/co",
                                            "_blank",
                                            "noopener,noreferrer"
                                        );
                                        handleClose();
                                    }}
                                >
                                    View on F6S
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
