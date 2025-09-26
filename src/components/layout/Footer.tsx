export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">FG</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Face Gallery</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              An intelligent face clustering and management system that automatically 
              detects, groups, and organizes faces in your image collection using 
              advanced machine learning algorithms.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Automatic Face Detection</li>
              <li>Smart Face Clustering</li>
              <li>Manual Face Management</li>
              <li>Person Renaming</li>
              <li>Image Search</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-blue-600 transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/persons" className="hover:text-blue-600 transition-colors">
                  Persons
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-blue-600 transition-colors">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Face Gallery. Built with React, TypeScript, and Flask.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">
                Powered by face_recognition library
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}