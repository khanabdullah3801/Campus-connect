import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold text-green-800 tracking-tight">
          Campus Connect
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
          The exclusive online platform for students and alumni of the Ghulam Ishaq Khan Institute (GIKI).
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Create an Account
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-green-700 border-2 border-green-200 font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-lg"
          >
            Log In
          </Link>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-green-800 mb-2">Social Feed</h3>
            <p className="text-gray-600">Share updates, achievements, and stay connected with your peers across campus.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-green-800 mb-2">Marketplace</h3>
            <p className="text-gray-600">Buy and sell books, electronics, and items directly with other GIKI students.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-green-800 mb-2">Events & Chat</h3>
            <p className="text-gray-600">Discover society events and chat directly with students and faculty groups.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
