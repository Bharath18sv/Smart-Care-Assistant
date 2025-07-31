"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-15 py-6 bg-white shadow-md">
        <div className="text-2xl px-10 font-bold text-blue-600">
          {/* changed px to adjust alignment */}
          Smart Care Assistant
        </div>

        <nav className="space-x-6 ">
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact Us
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/signup"
            className="text-white hover:bg-blue-700 border-1 rounded-xl px-4 py-2 bg-blue-600"
          >
            Signup
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-start bg-gray-100">
        {/* Background image */}
        <Image
          src="/home.png" //image inside public folder
          alt="Healthcare background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />

        {/* Overlay content */}
        <div className="relative z-10 max-w-xl mx-35">
          {/* change padding-x to adjust the apperance of the text content */}
          <h1 className="text-5xl font-bold text-black drop-shadow-lg mb-4">
            Smart technology for real-time insights and personalized healthcare,
            reimagined
          </h1>
          <hr className="w-1/2 my-5 font-" />
          <p className="text-black drop-shadow-md mb-6">
            Empowering doctors and patients with real-time health insights. Join
            us to revolutionize smart care.
          </p>
          <Link href="/patient/signup">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">
              Get Started →
            </button>
          </Link>
        </div>

        {/* Optional: dark overlay */}
        {/* <div className="absolute inset-0 bg-black/5 z-0" /> */}
      </section>
    </div>
  );
}
