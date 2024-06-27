import React, { useEffect, useState, useCallback } from 'react'
import './Main.css'
import { AiFillHome, AiOutlineSearch, AiOutlineSend } from 'react-icons/ai'
import { getDayName } from './Helper/Helper'
import api from 'axios'
import Loader from './Helper/Loader'
import TodayDisplay from './TodayDisplay'
import WeekDisplay from './WeekDisplay'

const Main = () => {
  const date = new Date(Date.now());
  const dateString = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const [time, setTime] = useState(date);
  const dayOfWeek = getDayName(dateString);
  setInterval(() => setTime(new Date(Date.now())), 1000);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState('');
  const [weekData, setWeekData] = useState('');
  const [unit, setUnit] = useState('metric');
  const [isToday, setIsToday] = useState(true);
  const [error, setError] = useState('');

  const getWeather = useCallback(() => {
    setLoader(true);
    if (debouncedSearch === '') {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser');
        return;
      }
      navigator.geolocation.getCurrentPosition(pos => {
        api.get(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(data => {
          setError('');
          setData(data.data);
        }).catch(error => {
          setError(error.response.data.message);
        })

        api.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(res => {
          setError('');
          setWeekData(res.data);
        }).catch(error => {
          setError(error.response.data.message);
        }).finally(() => {
          setLoader(false);
        })
      })
    } else {
      api.get(`https://api.openweathermap.org/data/2.5/weather?q=${debouncedSearch}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(data => {
        setError('');
        setData(data.data);
      }).catch(error => {
        setError(error.response.data.message);
      })

      api.get(`https://api.openweathermap.org/data/2.5/forecast?q=${debouncedSearch}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(res => {
        setError('');
        setWeekData(res.data);
      }).catch(error => {
        setError(error.response.data.message);
      }).finally(() => {
        setLoader(false);
      })
    }
  }, [debouncedSearch, unit]);

  useEffect(() => {
    getWeather();
  }, [unit, isToday, getWeather]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    loader ? <Loader /> :
      data === '' ? '' :
        <div className="main">
          <div className="left">
            <div className="search">
              <AiOutlineSearch />
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder='Search for places...' />
              {
                search.length > 0 ?
                  <div className="icon" onClick={() => getWeather()}>
                    <AiOutlineSend />
                  </div> :
                  <div className="icon" onClick={() => getWeather()}>
                    <AiFillHome />
                  </div>
              }
            </div>
            {
              error.length > 0 ? '' :
                <>
                  <div className="temp">
                    <h3>{data.main.temp}&deg;{unit === 'metric' ? 'C' : 'F'}</h3>
                    <h5>{dayOfWeek},<span> {time.getHours() >= 0 && time.getHours() <= 9 ? `0${time.getHours()}` : time.getHours()}:{time.getMinutes() >= 0 && time.getMinutes() <= 9 ? `0${time.getMinutes()}` : time.getMinutes()}</span></h5>
                  </div>
                  <div className="content">
                    {
                      data.weather.map((e, i) => (
                        <div key={i} className="box">
                          <img src={`http://openweathermap.org/img/w/${e.icon}.png`} alt="" />
                          <h3>{e.description}</h3>
                        </div>
                      ))
                    }
                  </div>
                  <div className="city">
                    <h3>{data.name}</h3>
                  </div>
                </>
            }
          </div>
          <div className="right">
            <div className="header">
              <div className="box">
                <button onClick={() => setIsToday(true)} className={isToday ? 'active' : ''}>Today</button>
                <button onClick={() => setIsToday(false)} className={!isToday ? 'active' : ''}>Week</button>
              </div>
              <div className="box">
                <button onClick={() => setUnit('metric')} className={unit === 'metric' ? 'active' : ''}>&deg;C</button>
                <button onClick={() => setUnit('imperial')} className={unit === 'imperial' ? 'active' : ''}>&deg;F</button>
              </div>
            </div>
            <div className="wrapper">
              {
                error.length > 0 ?
                  <div className="error">
                    <h2>Error</h2>
                    <h3>{error}</h3>
                  </div>
                  :
                  isToday ?
                    <TodayDisplay date={time} unit={unit} data={data} /> :
                    <WeekDisplay data={weekData} unit={unit} tdate={time} tdata={data} />
              }
            </div>
          </div>
        </div>
  )
}

export default Main
