import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sunny from "../assets/images/icon-sunny.webp";
import PartlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import Storm from "../assets/images/icon-storm.webp";
import Overcast from "../assets/images/icon-overcast.webp";
import Rain from "../assets/images/icon-rain.webp";
import Drizzle from "../assets/images/icon-drizzle.webp";
import Fog from "../assets/images/icon-fog.webp";
import Snow from "../assets/images/icon-snow.webp";

function HeroSection({
  apiData,
  loading,
  Loading,
  apparentTemperature,
  humidity,
  wind,
  precipitation,
  City,
  country,
  formattedDate,
  weatherCodeCurrent,
  temperature,
  currentWindSpeedUnit,
  currentPrecipitationUnit,
  formattedWeekdays,
  weatherCodeDaily,
}) {
  return (
    <section className="desktop:mt-0 mt-[5vw] desktop:w-[53vw] w-full desktop:h-[47vw] h-[100vw] flex desktop:flex-row flex-col justify-between desktop:rounded-[0.7vw] rounded-[3vw]">
      <div className="desktop:w-[53vw] w-full h-full flex flex-col justify-between">
        {apiData && !loading ? (
          <div className="desktop:my-0  my-[7vw] flex flex-col justify-center desktop:w-[53vw]  w-full desktop:h-[19vw] h-[105vw]  desktop:bg-[url('/assets/bg-today-large.svg')] bg-[url('/assets/bg-today-small.svg')] bg-no-repeat  bg-cover bg-center desktop:rounded-[0.7vw] rounded-[3vw]">
            <div className="flex desktop:flex-row flex-col items-center desktop:justify-between justify-center w-full desktop:h-auto h-[75vw]">
              <section className="h-fit desktop:pl-[1.5vw] flex flex-col justify-center desktop:items-start items-center">
                <h2>
                  {apiData ? (
                    <>
                      {City}, {country}
                    </>
                  ) : (
                    ""
                  )}
                </h2>
                <h3 className="smallTxt2 text-Neutral200 desktop:mt-[0.3vw] mt-[1.3vw] desktop:tracking-[0.03vw]">
                  {apiData ? <>{formattedDate}</> : ""}
                </h3>
              </section>

              <section className="!h-fit !flex items-center  extraBig desktop:pr-[1.5vw] pr-0">
                <img
                  className="desktop:w-[6.6vw] w-[20vw] h-fit"
                  src={
                    [0, 1].includes(weatherCodeCurrent)
                      ? Sunny
                      : [2].includes(weatherCodeCurrent)
                      ? PartlyCloudy
                      : [3].includes(weatherCodeCurrent)
                      ? Overcast
                      : [45, 48].includes(weatherCodeCurrent)
                      ? Fog
                      : [51, 53, 55].includes(weatherCodeCurrent)
                      ? Drizzle
                      : [61, 63, 65, 66, 67, 80, 81, 82].includes(
                          weatherCodeCurrent
                        )
                      ? Rain
                      : [71, 73, 75, 77, 85, 86].includes(weatherCodeCurrent)
                      ? Snow
                      : [95, 96, 99].includes(weatherCodeCurrent)
                      ? Storm
                      : ""
                  }
                  alt="img"
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={temperature} // triggers animation when temperature changes
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className=" text-right desktop:w-[12.5vw] w-[35vw]"
                  >
                    {temperature ? <>{temperature}°</> : ""}
                  </motion.span>
                </AnimatePresence>
              </section>
            </div>
          </div>
        ) : (
          <div className="desktop:rounded-[0.7vw] rounded-[3vw] flex flex-col items-center justify-center desktop:w-[53vw] w-full desktop:h-[19vw] h-fit desktop:my-0 my-[7vw] bg-Neutral700">
            <div className="desktop:h-auto h-[75vw] flex items-center justify-center">
              <span
                className={`${
                  loading ? "visible" : "hidden"
                } flex flex-col items-center justify-center`}
              >
                
   
   
                <div className="desktop:mb-[0.5vw] mb-[1vw] flex desktop:gap-[1vw] gap-[1.5vw]">
  <span className="desktop:w-[1vw] w-[3vw] desktop:h-[1vw] h-[3vw] rounded-full bg-Neutral0 dark:bg-blue-300 animate-[bounce_0.6s_infinite_alternate]"></span>
  <span className="desktop:w-[1vw] w-[3vw] desktop:h-[1vw] h-[3vw] rounded-full bg-Neutral200 dark:bg-blue-400 animate-[bounce_0.6s_infinite_alternate] [animation-delay:0.2s]"></span>
  <span className="desktop:w-[1vw] w-[3vw] desktop:h-[1vw] h-[3vw] rounded-full bg-Neutral300 dark:bg-blue-500 animate-[bounce_0.6s_infinite_alternate] [animation-delay:0.4s]"></span>
</div>

                Loading...
              </span>
            </div>
          </div>
        )}

        <div className="w-full desktop:h-[8.1vw] h-[100vw] grid desktop:grid-cols-4 grid-cols-2 gap-[1.5vw] desktop:mb-0 mb-[7vw]">
          <div className="bg-Blue700 desktop:pl-[1vw] desktop:py-[1.5vw] desktop:rounded-[0.7vw] rounded-[3vw] h-fit flex">
            <div className="w-full desktop:h-fit h-[30vw]  flex flex-col justify-center desktop:gap-[1vw] gap-[4vw] desktop:p-0 px-[4vw]">
              <p className="smallTxt text-Neutral200">Feels Like</p>
              <p className="bigTxt">
                {apparentTemperature && !loading ? (
                  <>{apparentTemperature}°</>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>
          <div className="bg-Blue700 h-fit desktop:pl-[1vw] desktop:py-[1.5vw] desktop:rounded-[0.7vw] rounded-[3vw] flex ">
            <div className="desktop:h-fit h-[30vw]  flex flex-col justify-center desktop:gap-[1vw] gap-[4vw] desktop:p-0 px-[4vw]">
              <p className="smallTxt text-Neutral200">Humidity</p>
              <p className="bigTxt">
                {humidity && !loading ? <>{humidity}%</> : "-"}
              </p>
            </div>
          </div>
          <div className="bg-Blue700 h-fit desktop:pl-[1vw] desktop:py-[1.5vw] desktop:rounded-[0.7vw] rounded-[3vw] flex ">
            <div className="desktop:h-fit h-[30vw]  flex flex-col justify-center desktop:gap-[1vw] gap-[4vw] desktop:p-0 px-[4vw]">
              <p className="smallTxt text-Neutral200">Wind</p>
              <div className="bigTxt">
                {!loading && wind ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${wind}-${currentWindSpeedUnit}`} // triggers animation on any change
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {wind} {currentWindSpeedUnit}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
          <div className="bg-Blue700 h-fit desktop:pl-[1vw] desktop:py-[1.5vw] desktop:rounded-[0.7vw] rounded-[3vw] flex ">
            <div className="desktop:h-fit h-[30vw]  flex flex-col justify-center desktop:gap-[1vw] gap-[4vw] desktop:p-0 px-[4vw]">
              <p className="smallTxt text-Neutral200">Precipitation</p>

              <span className="bigTxt">
                {!loading && precipitation ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${precipitation}-${currentPrecipitationUnit}`} // triggers animation on any change
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {precipitation} {currentPrecipitationUnit}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  "-"
                )}
              </span>
            </div>
          </div>
        </div>
        {/* daily forecast */}
        <div className="w-full desktop:h-[13vw] h-[100vw] flex flex-col desktop:gap-[1vw] gap-[3vw]">
          <h3 className="smallTxt font-medium desktop:tracking-[0.05vw]">
            Daily forecast
          </h3>
          <section className="bg-Neutral700 w-full h-[220vw] grid desktop:grid-cols-7 grid-cols-3 desktop:gap-[1.1vw] gap-[3vw] desktop:rounded-[0.7vw] rounded-[3vw]">
            {apiData && !loading
              ? formattedWeekdays.map((weekday, i) => (
                  <div
                    key={i}
                    className="bg-Neutral600 desktop:rounded-[0.7vw] rounded-[3vw] w-full h-full  flex flex-col justify-between items-center desktop:px-[0.4vw] px-[2vw] desktop:py-[0.8vw] py-[3vw]"
                  >
                    <div className="w-full text-center smallTxt2">
                      {weekday}
                    </div>
                    <div>
                      <img
                        src={
                          [0, 1].includes(weatherCodeDaily[i])
                            ? Sunny
                            : [2].includes(weatherCodeDaily[i])
                            ? PartlyCloudy
                            : [3].includes(weatherCodeDaily[i])
                            ? Overcast
                            : [45, 48].includes(weatherCodeDaily[i])
                            ? Fog
                            : [51, 53, 55].includes(weatherCodeDaily[i])
                            ? Drizzle
                            : [61, 63, 65, 66, 67, 80, 81, 82].includes(
                                weatherCodeDaily[i]
                              )
                            ? Rain
                            : [71, 73, 75, 77, 85, 86].includes(
                                weatherCodeDaily[i]
                              )
                            ? Snow
                            : [95, 96, 99].includes(weatherCodeDaily[i])
                            ? Storm
                            : ""
                        }
                        alt="icon"
                        className=" desktop:w-[4vw] w-[20vw] h-fit"
                      />
                    </div>

                    <div className="desktop:px-[0.6vw] w-full flex justify-between">
                      <p className="ultraSmall">
                        {Math.round(apiData.daily.temperature_2m_max[i])}°
                      </p>

                      <p className="text-Neutral200 ultraSmall">
                        {Math.round(apiData.daily.temperature_2m_min[i])}°
                      </p>
                    </div>
                  </div>
                ))
              : Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-Neutral600 desktop:rounded-[0.7vw] rounded-[3vw] w-full desktop:h-full h-[35vw] flex flex-col justify-between items-center desktop:px-[0.4vw] px-[2vw] desktop:py-[0.8vw] py-[3vw]"
                  ></div>
                ))}
          </section>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
