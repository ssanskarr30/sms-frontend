export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }
  