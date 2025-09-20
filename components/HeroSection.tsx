import SearchBox from "./heroParts/SearchBox";
import TicketFan from "./heroParts/TicketFan";
import { CursorTrail } from "./heroParts/CursorTrail";
import BGGradient from "./BGGradient";
import SearchDiv from "./heroParts/SearchDiv";
import { ChevronsDown } from "lucide-react";

const HeroSection = () => {

    return (
        <div className="relative flex h-screen flex-col items-center justify-center">
            {/* <SearchBox /> */}
            {/* <video  playsInline autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover"><source src="./walk.mp4" type="video/mp4" /></video> */}
            <SearchDiv />
            <BGGradient />

            {/* Scroll Down Indicator */}
            <div className="cursor-pointer absolute bottom-6 ">
                <ChevronsDown
                    className="w-10 h-10 text-white/70 animate-bounce"
                />
            </div>
        </div>
    );
};

export default HeroSection;
