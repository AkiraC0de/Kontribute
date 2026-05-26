import { Link } from "react-router";
import PrimaryButton from "../../ui/PrimaryButton";
import { ChevronRight } from "lucide-react";

const LandingHero = () => {
  return (
    <section className="relative flex flex-col items-center gap-6 text-center py-15">
      <p className="rounded-4xl bg-white text-sm border px-6 py-1.5">
        Project Management
      </p>
      <h1 className="text-7xl font-bold text-primary font-sans max-w-220">
        Prove Your Progress Without the Paperwork.
      </h1>
      <h2 className="text-lg max-w-200 font-medium">
        Spend less time writing status reports and more time building. Members
        log daily tasks in seconds, giving professors a direct window into
        individual contributions.
      </h2>
      <Link to={"/auth/register"}>
        <PrimaryButton className="mt-5 flex items-center gap-1">
          Get Started
          <ChevronRight />
        </PrimaryButton>
      </Link>
      
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>
    </section>
  );
};
export default LandingHero;
