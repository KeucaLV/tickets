import eventImage from "../images/eventImage.jpg";
import TodayEvents from "./todayEvents";

function MainPage() {
    return (
        <>
            <div className="flex w-full max-h-[250px] flex-wrap overflow-hidden content-center items-center">
                <img className="mb-48 -z-1" src={eventImage}/>
                <div className="flex absolute flex-500 p-2 rounded-md bg-black bg-opacity-50 ml-10 -mt-10 w-[600px] content-center items-center max-sm:w-[250px] max-sm:mb-[80px] ">
                    <h1 className="text-4xl text-white font-extrabold max-sm:text-2xl">Buy tickets to awesome shows and games!</h1>
                </div>
            </div>
            <TodayEvents />
        </>
    );
}

export default MainPage;
