import React, { useEffect, useState } from 'react';
import axios from 'axios';
import countryCodes from './Country.js'
import YourComponent from './Typed.jsx';
import Loader from './Loader.jsx';

const Weather = () => {
    const [city, setCity] = useState("allahabad");
    const [countryName, setCountryName] = useState();
    const [cityData, setCityData] = useState(null);
    const [date, setDate] = useState("");
    const [loader, setLoader] = useState(false); 
    const [msg, setMsg] = useState({
        error:"",
        err_msg:""
    }); 

    const apiKey = process.env.REACT_APP_API_KEY;

    const weatherDataGet = (city) => {
        setLoader(true); 
        setTimeout(() => {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
                .then(res => {
                    setCityData(res.data);
                    const dateString = new Date(res.data.dt * 1000);
                    const formattedDateString = dateString.toDateString();
                    setDate(formattedDateString);
                    setMsg({error:"",err_msg:""})
                    const countryCode = res.data.sys.country;
                    if (countryCodes.hasOwnProperty(countryCode)) {
                        const countryName = countryCodes[countryCode];
                        setCountryName(countryName);
                    } else {
                        console.log("Country code not found");
                    }
                    // setCity("")
                })
                .catch(err => {
                    setCityData(null)
                    setMsg({error:"alert alert-danger mt-4",err_msg:"Please enter correct city or any address!"})
                    console.log(err);
                })
                .finally(() => {
                    setLoader(false); 
                });
        }, 1000);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                        .then((res) => {
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(res.data, "text/xml");
                            var stateDistrictElement = xmlDoc.querySelector('state_district');
                            var stateDistrict = stateDistrictElement.textContent;
                            if (stateDistrict.split(" ")[0] === "Prayagraj") {
                                setCity("allahabad");
                            } else {
                                setCity(stateDistrict.split(" ")[0]);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, []);

    const searchCity = (city) => {
        if (city === "prayagraj" || city === "Prayagraj") {
            setCity("allahabad");
        } else {
            setCity(city.toLowerCase()); // Ensure consistent casing
        }
    }


    useEffect(() => {
        if (city && city.trim() !== "") {
            weatherDataGet(city);
        }else{
            setMsg({error:"alert alert-warning mt-4",err_msg:"Please enter any city!"})
            setCityData(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]); 
    
    return (
        <div>
            <h3 className='alert alert-secondary mt-3 custom-head'><YourComponent/></h3>
            <div className='container '>
                <div className='row justify-content-center'>
                    <div className='col-sm-8 col-12 col-md-8 col-sm-12 mt-5  p-5  rounded-3 custom'>
                        <div className="">
                        <div className="input-group">
                            <input  type="text" className="form-control shadow-none" style={{background:"#e7e0f7"}} id="city" aria-describedby="cityHelp" name="city" placeholder="Enter the city" onBlur={(e)=>searchCity(e.target.value)} required/>
                            <button className="btn btn-secondary" type="button" onClick={()=>searchCity(city)}>Search</button>
                        </div>
                    </div>
                        <div className='mt-0'>
                            {loader ? <Loader /> : null}
                            {cityData ? (
                                <>
                                    <span>
                                    {cityData.weather[0].icon && (
                                    <img 
                                    src={`http://openweathermap.org/img/wn/${cityData.weather[0].icon}.png`} 
                                    alt="Weather Icon" 
                                    className="img-fluid pic" />
                                    )}
                                    </span>
                                    <h3 className='mt-0'>City: {cityData.name}, {countryName}</h3>
                                    <div className='row mt-0'>
                                        <div className='col-sm-6 col-md-6 col-12'>
                                            <h5 className='mt-1'>Max temp: {cityData.main.temp_max}°C</h5>
                                            <h5 className='mt-1'>Min temp: {cityData.main.temp_min}°C</h5>
                                            <h5 className='mt-1'>Wind speed: {cityData.wind.speed} Km/h</h5>
                                            <h5 className='mt-1'>Humidity: {cityData.main.humidity}%</h5>
                                        </div>
                                        <div className='col-sm-6 col-md-6 col-12'>
                                            <h5 className='mt-1'>Mostly: {cityData.weather[0].main}</h5>
                                            <h5 className='mt-1'>Date: {date}</h5>
                                            <h5 className='mt-1'>Sun-rise: {new Date(cityData.sys.sunrise * 1000).toLocaleTimeString()} am</h5>
                                            <h5 className='mt-1'>Sun-set: {new Date(cityData.sys.sunset * 1000).toLocaleTimeString()} pm</h5>
                                        </div>
                                    </div>
                                </>
                            ):<div className={msg.error}>{msg.err_msg}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
