export default function DebugTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-black mb-4">Debug Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, Next.js routing is working!</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Current time: {new Date().toISOString()}</p>
          <a href="/" className="block text-blue-600 hover:underline">
            Try Home Page
          </a>
        </div>
      </div>
    </div>
  )
}
