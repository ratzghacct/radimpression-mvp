export default function SimpleTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Test Page</h1>
        <p className="text-gray-600">If you can see this, routing is working!</p>
        <div className="mt-4">
          <a href="/" className="text-blue-600 hover:underline">
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  )
}
