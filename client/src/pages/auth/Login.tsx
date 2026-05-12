import React from 'react'

export default function Login() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-500 via-red-500 to-red-700 p-10 text-white">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Create Your <br /> Account
            </h1>

            <p className="mt-5 text-white/80 text-lg">
              Join us and start managing everything in one place.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-sm text-white/80">
                “Simple, clean and modern dashboard experience.”
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20"></div>
              <div>
                <h4 className="font-semibold">Madgear Studio</h4>
                <p className="text-sm text-white/70">Trusted by creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Sign Up</h2>

              <p className="text-zinc-400 mt-2">
                Create your account to continue
              </p>
            </div>

            <form className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 accent-orange-500" />

                <p className="text-sm text-zinc-400">
                  I agree to the Terms & Conditions
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="border-t border-zinc-800"></div>

                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-3 text-sm text-zinc-500">
                  OR
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full h-12 rounded-xl border border-zinc-800 hover:border-zinc-700 text-white flex items-center justify-center gap-3 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Login */}
              <p className="text-center text-zinc-400 text-sm">
                Already have an account?{" "}
                <a href="#" className="text-orange-500 hover:text-orange-400">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
