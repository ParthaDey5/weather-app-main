import { useEffect, useState } from "react";
import Logo from "./assets/images/logo.svg?react";
import Dropdown from "./assets/images/icon-dropdown.svg?react";
import IconError from "./assets/images/icon-error.svg?react";
import Checkmark from "./assets/images/icon-checkmark.svg?react";
import Retry from "./assets/images/icon-retry.svg?react";
import Units from "./assets/images/icon-units.svg?react";
import Search from "./assets/images/icon-search.svg?react";
import Loading from "./assets/images/icon-loading.svg?react";
import "./App.css";
import HourlyForecast from "./components/HourlyForecast";
import HeroSection from "./components/HeroSection";

function App() {
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [startIndex, setStartIndex] = useState(null);
  const [currentPrecipitationUnit, setCurrentPrecipitationUnit] = useState("");
  const [currentWindSpeedUnit, setCurrentWindSpeedUnit] = useState("");
  const [millimeters, setMillimeters] = useState(true);
  const [celsious, setCelsious] = useState(true);
  const [kmh, setKmh] = useState(true);
  const [dropdown1, setdropdown1] = useState(false);
  const [dropdown2, setdropdown2] = useState(false);
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [precipitation, setPrecipitation] = useState("");
  const [apitime, setApitime] = useState("");
  const [apparentTemperature, setApparentTemperature] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [City, setcity] = useState("");
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  

  const weatherCodeDaily = apiData?.daily.weather_code;
  const weatherCodeCurrent = apiData?.current.weather_code;
  const weatherCodeHourly = apiData?.hourly.weather_code;
  const date = new Date(apitime);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedHours = apiData?.hourly.time.map((t) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
  );

  const currentHour = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });

  useEffect(() => {
    if (startIndex === null && formattedHours && currentHour) {
      setStartIndex(formattedHours.indexOf(currentHour));
    }
  }, [formattedHours, currentHour]);

  const date2 = new Date(apiData?.hourly.time[startIndex]);
  const hourlyTimes = apiData?.hourly.time.slice(startIndex);
  const uniqueDates = apiData
    ? [...new Set(apiData.hourly.time.map((ts) => ts.split("T")[0]))]
    : [];

  const currentDay = date2?.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // ───────────────────────────────────────────────
  // DESIGN NOTE: Loading + Duplicate Search Handling
  // I deliberately manage `loading` with a timeout.
  // Why:
  //   • Separate geocoding (phase 1) from forecast fetch (phase 2).
  //   • Ensure even duplicate searches (e.g. "delh" vs "delhi")
  //     trigger a visible state change and re-fetch.
  //   • Timeout guarantees spinner resets, avoiding stuck state.
  // Trade‑off:
  //   • Adds a small artificial delay, but keeps flow predictable.
  //   • Every search click = spinner on → guaranteed spinner off.
  // This is a conscious design choice, not a bug.
  // ───────────────────────────────────────────────

  useEffect(() => {
    if (cityName) {
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          setLatitude(data.results[0].latitude);
          setLongitude(data.results[0].longitude);
          setcity(data.results[0].name);
          setCountry(data.results[0].country);
          setSearchInProgress(true);
          setLoading(true);
          setSearchInProgress(false);
        })
        .catch((err) => {
          setTimeout(() => {
            setSearchInProgress(false);
          }, 3000);

          if (err.message === "Failed to fetch" && !searchInProgress) {
            setNetworkError(true);
          }
          if (
            err.message ===
              "Cannot read properties of undefined (reading '0')" &&
            !searchInProgress
          ) {
            setFetchError(true);
          }
        })
        .finally(() =>
          setTimeout(() => {
            setLoading(false);
          }, 3000)
        );
    }
  }, [cityName, City, fetchError, searchInProgress]);

  useEffect(() => {
    if (latitude && longitude) {
      setTimeout(() => {
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,weather_code&current=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&current=is_day${
            celsious ? "" : "&temperature_unit=fahrenheit"
          }${kmh ? "" : "&wind_speed_unit=mph"}${
            millimeters ? "" : "&precipitation_unit=inch"
          }&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setApitime(data.current.time);
            setApparentTemperature(
              Math.round(data.current.apparent_temperature)
            );
            setTemperature(Math.round(data.current.temperature_2m)),
              setWind(Math.round(data.current.wind_speed_10m)),
              setHumidity(Math.round(data.current.relative_humidity_2m));
            setPrecipitation(data.current.precipitation), setApiData(data);
            setCurrentWindSpeedUnit(data.current_units.wind_speed_10m);
            setCurrentPrecipitationUnit(data.current_units.precipitation);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 500);
    }
  }, [
    cityName,
    City,
    latitude,
    longitude,
    currentDay,
    celsious,
    kmh,
    millimeters,
    loading,
  ]);

  
    const fetchCities = async (q) => {
      if (q.length < 1) {
        setSuggestions([]);
        return;
      }
      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population&minPopulation=100000`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key": "e3e60a2ec5msh19c61c62e1a129ap1a1646jsn0ff8d34232ae",
        },
      };
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        setSuggestions(result.data);
        console.log(suggestions);
      } catch (error) {
        console.error(error);
      }
    };
    
  
  
  const formattedWeekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(apitime);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
  const formattedWeekdaysLong = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(apitime);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { weekday: "long" });
  });

  return (
    <div>
      {/* nav section */}
      <section className="w-full flex flex-col items-center justify-center">
        <nav className="desktop:mb-[5vw] mb-[10vw]">
          <Logo className="desktop:w-[13.5vw] w-[35vw] h-auto pointer" />
          <div className="flex flex-col items-end">
            <span
              className="bg-Neutral800 !flex !items-center justify-center desktop:gap-[0.6vw] gap-[1vw] extraSmall"
              onClick={() =>
                dropdown1 ? setdropdown1(false) : setdropdown1(true)
              }
            >
              <Units className="desktop:w-[1vw] w-[3.2vw] h-fit pointer !my-auto" />{" "}
              Units
              <Dropdown
                className={` transition-transform duration-300 ease-out desktop:w-[0.7vw] w-[2.6vw] h-fit pointer ${
                  dropdown1 ? "rotate-180" : ""
                }`}
              />
            </span>

            <div className="relative z-50">
              <section
                className={`desktop:rounded-[0.5vw] rounded-[2vw] bg-Neutral700 absolute right-0 desktop:w-[15vw] w-[55vw] origin-top transition-transform duration-500   ${
                  dropdown1 ? "scale-y-100 ease-out" : "scale-y-0 ease"
                }`}
              >
                <ul className="desktop:px-[1vw] px-[3vw] desktop:pt-[1vw] pt-[3vw]">
                  <li className="smallTxt whitespace-nowrap cursor-auto">
                    Switch to Imperial
                  </li>
                  <li className="hover:bg-Neutral600 text-Neutral200 smallTxt2 cursor-auto">
                    Temperature
                  </li>
                  <li
                    onClick={() => setCelsious(true)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    Celsius(°C){celsious && <Checkmark />}
                  </li>
                  <li
                    onClick={() => setCelsious(false)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    Fahrenheit(°F) {!celsious && <Checkmark />}
                  </li>
                  <li className="hover:bg-Neutral600 text-Neutral200 smallTxt2 cursor-auto">
                    Wind Speed
                  </li>
                  <li
                    onClick={() => setKmh(true)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    km/h {kmh && <Checkmark />}
                  </li>
                  <li
                    onClick={() => setKmh(false)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    mph{!kmh && <Checkmark />}
                  </li>
                  <li className="hover:bg-Neutral600 text-Neutral200 smallTxt2 cursor-auto">
                    Precipitation
                  </li>
                  <li
                    onClick={() => setMillimeters(!millimeters)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    Millimeters(mm){millimeters && <Checkmark />}
                  </li>
                  <li
                    onClick={() => setMillimeters(!millimeters)}
                    className="flex justify-between hover:bg-Neutral600 smallTxt"
                  >
                    Inches(in){!millimeters && <Checkmark />}
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </nav>
      </section>

      {networkError && (
        <div className="desktop:gap-[1.5vw] gap-[3vw] flex flex-col items-center">
          <IconError className="text-Neutral200 desktop:w-[3vw] w-[7vw] brightness-800" />
          <p className="mediumBig">Something went wrong</p>
          <p className="bigTxt text-center text-Neutral200 desktop:w-[40vw]">
            We couldn't connect to the server (API error). Please try again in a
            few moments.
          </p>{" "}
          <button
            className="w-fit desktop:px-[2vw] px-[5vw] desktop:gap-[0.5vw] gap-[2vw] flex items-center smallTxt desktop:rounded-[0.4vw] rounded-[2vw]"
            onClick={() => {
              setCity(""), setNetworkError("");
            }}
          >
            <Retry className="desktop:w-[1vw] w-[4vw]" />
            Retry
          </button>
        </div>
      )}

      {!networkError && (
        <div>
          {/* header section */}
          <h1>How's the sky looking today?</h1>

          {/* search section */}
          <div>
            <section className="mx-auto desktop:my-[3vw] desktop:w-fit w-full relative flex desktop:flex-row flex-col items-center justify-center desktop:gap-[1vw]">
              <span className="absolute desktop:left-[3vw] left-[5vw] top-1/2 desktop:-translate-y-1/2 -translate-y-[5vw]">
                <Search className="!text-Neutral300 desktop:w-[1.19vw] w-[5vw] h-fit" />
              </span>
              <span className="w-full">
                <input
                  className="smallTxt "
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    fetchCities(e.target.value);
                    setCity(e.target.value),
                      setLoading(false),
                      setSearchInProgress(false);
                  }}
                  placeholder="Search for a place..."
                  required
                />{" "}
                <ul
              className={`absolute left-0 ${suggestions?.length > 0 ? "block" : "hidden"}
       desktop:w-[32vw] w-[90%] desktop:!rounded-[0.8vw] !rounded-[3vw] 
      bg-Neutral600 border border-Neutral300 
      list-none desktop:mt-[1vw] mt-[3vw] desktop:p-[0.5vw] p-[3vw] z-50
    `}
            >
              {suggestions?.map((CITY) => (
                <li
                  key={CITY.id}
                  className="smallTxt
          px-3 py-2 cursor-pointer 
          hover:bg-Neutral300 transition
        "
                  onClick={() => {
                    setQuery(`${CITY.city}, ${CITY.country}`);
                    console.log(query);
                    setCityName(CITY.city.trim());
                    setCity("");
                    setSearchInProgress(true);
                    setSuggestions([]);
                    // 👉 trigger weather fetch here with city.latitude & city.longitude
                  }}
                >
                  {CITY.city}, {CITY.country}
                </li>
              ))}
            </ul>

              </span>
              <button
                className="smallTxt"
                type="button"
                onClick={() => {
                  setFetchError("");
                  setSearchInProgress(true);
                  setCity("");
                  setCityName(city.trim());
                }}
              >
                Search
              </button>
            </section>

            <section className={` ${searchInProgress ? "block" : "hidden"}`}>
              <div
                className={`bg-Neutral600 absolute desktop:translate-x-[21.5vw] desktop:-translate-y-[2vw] desktop:w-[32vw] w-full desktop:h-[3.8vw] h-[13vw] desktop:rounded-[0.8vw] rounded-[3vw]`}
              >
                <div className="desktop:px-[1vw] px-[5vw] w-full h-full flex items-center desktop:gap-[1vw] gap-[3vw]">
                  <Loading className="desktop:w-[1.3vw] w-[5vw] my-auto animate-spin" />
                  <p className="smallTxt2">Search in progress</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      {fetchError && (
        <h1 className="w-full h-screen mx-auto bigTxt font-bold desktop:mt-0 mt-[10vw]">
          No search result found!
        </h1>
      )}

      {!fetchError && !networkError && (
        <>
          {/* hero section */}
          <section className="flex flex-col desktop:h-auto h-[425vw]">
            <div className="flex flex-col justify-between">
              <section className="w-full flex justify-between">
                <HeroSection
                  {...{
                    apiData,
                    dropdown2,

                    loading,
                    formattedHours,
                    startIndex,
                    weatherCodeHourly,
                    Loading,
                    apparentTemperature,
                    humidity,
                    wind,
                    precipitation,
                    HourlyForecast,
                    City,
                    country,
                    formattedDate,
                    weatherCodeCurrent,
                    temperature,
                    currentWindSpeedUnit,
                    currentPrecipitationUnit,
                    formattedWeekdays,
                    weatherCodeDaily,
                  }}
                />
                {/* hourly forecast */}
                <div className="desktop:block hidden">
                  <HourlyForecast
                    {...{
                      apiData,
                      dropdown2,
                      uniqueDates,
                      loading,
                      formattedHours,
                      startIndex,
                      setStartIndex,
                      weatherCodeHourly,
                      formattedWeekdaysLong,
                      formattedWeekdays,
                      setdropdown2,
                      currentDay,
                    }}
                  />
                </div>
              </section>
              {/* hourly forecast */}

              <div className="desktop:hidden block translate-y-[190vw]">
                <HourlyForecast
                  {...{
                    apiData,
                    dropdown2,
                    uniqueDates,
                    loading,
                    formattedHours,
                    startIndex,
                    setStartIndex,
                    weatherCodeHourly,
                    formattedWeekdaysLong,
                    formattedWeekdays,
                    setdropdown2,
                    currentDay,
                  }}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
