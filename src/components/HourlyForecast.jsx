import React, { useState, useEffect } from "react";

import Dropdown from "../assets/images/icon-dropdown.svg?react";
import Sunny from "../assets/images/icon-sunny.webp";
import PartlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import Storm from "../assets/images/icon-storm.webp";
import Overcast from "../assets/images/icon-overcast.webp";
import Rain from "../assets/images/icon-rain.webp";
import Drizzle from "../assets/images/icon-drizzle.webp";
import Fog from "../assets/images/icon-fog.webp";
import Snow from "../assets/images/icon-snow.webp";
import { motion, AnimatePresence } from "framer-motion";

function HourlyForecast({
  apiData,
  dropdown2,
  loading,
  formattedHours,
  startIndex,
  weatherCodeHourly,
  formattedWeekdaysLong,
  setdropdown2,
  setStartIndex,
  uniqueDates,
}) {
  const [Weekday, setWeekday] = useState("");

  const currentDay = uniqueDates.length
    ? new Date(uniqueDates[0]).toLocaleDateString("en-US", { weekday: "long" })
    : "-";

  return (
    <div className="bg-Neutral700 desktop:w-[28vw] h-full desktop:rounded-[0.7vw] rounded-[3vw] flex flex-col items-center desktop:gap-[1vw] gap-[3vw] desktop:pt-0 pt-[3vw]">
      <div className="flex items-center justify-between desktop:w-[80%] w-full desktop:h-[4vw]">
        <p className="smallTxt font-medium desktop:tracking-[0.02vw] whitespace-nowrap">
          Hourly forecast
        </p>
        <div>
          <span
            className={`cursor-pointer bg-Neutral600 desktop:rounded-[0.4vw] rounded-[1.5vw] desktop:px-[1vw] px-[3vw] desktop:h-[2.4vw] h-[7vw] flex items-center justify-center desktop:gap-[0.5vw] gap-[2vw]`}
            onClick={() =>
              dropdown2 ? setdropdown2(false) : setdropdown2(true)
            }
          >
            <p className="desktop:tracking-[0.03vw] tracking-[0.15vw] extraSmall font-medium">
              {formattedHours && !Weekday
                ? formattedHours && currentDay
                : Weekday
                ? Weekday
                : "-"}
            </p>{" "}
            <Dropdown className={`transition-transform duration-400 ease desktop:w-[0.7vw] w-[2.6vw] h-fit ${dropdown2? "rotate-180":""}`} />
          </span>
          
            <div className={`relative z-10  origin-top transition-transform duration-400 ${
              dropdown2 ? "scale-y-100 ease-out" : "scale-y-0 ease"
            }`}>
              <span className="desktop:w-[12vw] w-[40vw] absolute right-0 desktop:px-[0.5vw] px-[1vw] desktop:rounded-[0.5vw] rounded-[2vw]">
                <ul className="extraSmall">
                  {apiData && !loading ? (
                    uniqueDates.map((dateStr) => {
                      const d = new Date(dateStr);
                      const weekday = d.toLocaleDateString("en-US", {
                        weekday: "long",
                      });
                      return (
                        <li
                          className="desktop:rounded-[0.5vw] rounded-[1.8vw] desktop:px-[0.5vw] px-[1.2vw]"
                          key={dateStr}
                          onClick={() => {
                            setdropdown2(false);
                            setWeekday(weekday);

                            const dayStartIdx = apiData.hourly.time.findIndex(
                              (t) => t.startsWith(dateStr)
                            );
                            if (dayStartIdx !== -1) {
                              // How far into the day we currently are
                              const hourOffset = startIndex % 24; // works if data is hourly
                              setStartIndex(dayStartIdx + hourOffset);
                            }
                          }}
                        >
                          {weekday}
                        </li>
                      );
                    })
                  ) : (
                    <>
                      {formattedWeekdaysLong?.map((weekday, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setdropdown2(false);
                          }}
                        >
                          {weekday}
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </span>
            </div>
          
        </div>
      </div>
      {apiData && !loading
        ? formattedHours.slice(startIndex, startIndex + 8).map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between desktop:px-[1vw] px-[3vw] desktop:rounded-[0.5vw] rounded-[3vw] desktop:w-[80%] w-[85%] desktop:h-[4vw] h-[12vw] bg-Neutral600 "
            >
              <span className="flex items-center desktop:gap-[0.5vw] gap-[2vw]">
                <img
                  className="desktop:w-[3vw] w-[10vw] h-fit"
                  src={
                    [0, 1].includes(weatherCodeHourly[startIndex + i])
                      ? Sunny
                      : [2].includes(weatherCodeHourly[startIndex + i])
                      ? PartlyCloudy
                      : [3].includes(weatherCodeHourly[startIndex + i])
                      ? Overcast
                      : [45, 48].includes(weatherCodeHourly[startIndex + i])
                      ? Fog
                      : [51, 53, 55].includes(weatherCodeHourly[startIndex + i])
                      ? Drizzle
                      : [61, 63, 65, 66, 67, 80, 81, 82].includes(
                          weatherCodeHourly[startIndex + i]
                        )
                      ? Rain
                      : [71, 73, 75, 77, 85, 86].includes(
                          weatherCodeHourly[startIndex + i]
                        )
                      ? Snow
                      : [95, 96, 99].includes(weatherCodeHourly[startIndex + i])
                      ? Storm
                      : ""
                  }
                  alt="icon"
                />

                <p className="smallTxt">{h}</p>
              </span>{" "}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${apiData.hourly.temperature_2m[startIndex + i]}°`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="extraSmall text-Neutral0 z-0"
                >
                  {Math.round(apiData.hourly.temperature_2m[startIndex + i])}°
                </motion.div>
              </AnimatePresence>
            </div>
          ))
        : Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between desktop:px-[1vw] px-[3vw] desktop:rounded-[0.5vw] rounded-[3vw] desktop:w-[80%] w-[85%] desktop:h-[4vw] h-[12vw] bg-Neutral600"
            ></div>
          ))}
    </div>
  );
}

export default HourlyForecast;
