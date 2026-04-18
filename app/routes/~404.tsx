import { Link } from 'manicjs';
import RocketBlast from '@/components/ui/RocketBlast';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center p-8 text-white overflow-hidden relative">
      <div className="fixed inset-0 z-0 opacity-40 text-dark pointer-events-none select-none">
        <RocketBlast />
      </div>

      <div className="text-center space-y-4 z-20 text-dark">
        <h2 className="text-3xl font-medium">Wait what?</h2>
        <p className="text-dark/60 text-lg max-w-md mx-auto">
          My site only has one page.
          <br />
          How did you even end up here?
        </p>
      </div>

      <Link
        to="/"
        className="px-8 mt-6 cursor-pointer py-4 bg-dark text-light rounded-full font-medium hover:scale-105 transition-transform active:scale-95"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
