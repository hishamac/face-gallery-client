import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand & Description */}
          <div className="space-y-5">
              <img
                src="https://storage.festie.app/files.festie.app/60063219-c875-46e0-844f-184dcd56ff9c/1758803571399-990f33c3f11d0ceb-ei-1758803295199-removebg-preview-1.png"
                alt="Fansat Arts"
                className="h-12 w-auto rounded-lg mr-3"
              />
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Fansat Arts - DHIU ARTS FEST. Join us for an unforgettable
              experience.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.465 1.066C8.638 1.012 9.012 1 12 1c2.988 0 3.362.013 4.534.066 1.172.053 1.972.24 2.672.511.731.285 1.347.666 1.962 1.281.615.615.996 1.231 1.281 1.962.271.7.458 1.5.512 2.672C22.988 8.639 23 9.013 23 12c0 2.988-.013 3.362-.066 4.535-.054 1.17-.241 1.97-.512 2.67-.285.732-.666 1.349-1.281 1.963-.615.615-1.231.997-1.962 1.282-.7.271-1.5.458-2.672.512C15.362 22.988 14.988 23 12 23s-3.362-.013-4.535-.066c-1.17-.054-1.97-.241-2.67-.512a5.402 5.402 0 0 1-1.963-1.282 5.402 5.402 0 0 1-1.282-1.962c-.271-.7-.458-1.5-.512-2.672C1.012 15.362 1 14.988 1 12s.013-3.362.066-4.534c.054-1.172.241-1.972.512-2.672.285-.731.666-1.347 1.282-1.962C3.475 2.247 4.091 1.866 4.822 1.58c.7-.271 1.5-.458 2.672-.512L7.465 1.066ZM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 1 0 2.881 1.44 1.44 0 0 1 0-2.881Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://fansat.festie.app/results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Results
                </a>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <a
                  href="https://fansat.festie.app/downloads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Downloads
                </a>
              </li>
              <li>
                <a
                  href="https://fansat.festie.app/schedules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Schedules
                </a>
              </li>
              <li>
                <a
                  href="https://fansat.festie.app/wall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Wall
                </a>
              </li>
            </ul>
          </div>

          {/* Made with */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Made with</h3>
            <div className="mb-4">
              <img
                src="https://fansat.festie.app/logo.svg"
                alt="FESTIE"
                className="h-8"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Manage registrations, scheduling, scoring, and results — all in
              one platform. No paperwork, no chaos. Just smooth fests, every
              time.
            </p>
            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-colors">
              Create Your Own Fest
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 Festie.app All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/contact"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
