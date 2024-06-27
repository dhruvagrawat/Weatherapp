import React from 'react'
import './Main.css'
import { getDayName } from './Helper/Helper'

const TodayDisplay = ({date,data,unit,highlight=false}) => {
  const dateString = `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
  return (
    (data!==undefined)?
    <div className="today">
      <h5>{getDayName(dateString)}, <span>{dateString}</span></h5>
      <div className="cards">
        <div className="card">
          <h4>Wind Status</h4>
          <h2>{data.wind.speed}{(unit==='metric')?'m/s':'Mph'}</h2>
        </div>
        <div className="card">
          <h4>Pressure</h4>
          <h2>{data.main.pressure} Pa</h2>
        </div>
        <div className="card">
          <h4>Longitude & Latitude</h4>
          <h2>( {data.coord.lon} , {data.coord.lat} )</h2>
        </div>
        <div className="card">
          <h4>Humidity</h4>
          <h2>{data.main.humidity}%</h2>
        </div>
        {
          (!highlight)?
          <>
            <div className="card">
              <h4>Visibility</h4>
              <h2>{data.visibility/1000}Km</h2>
            </div>
            <div className="card">
              <h4>Feels Like</h4>
              <h2>{data.main.feels_like}&deg;{(unit==='metric')?'C':'F'}</h2>
            </div>
            {
              (data.main.sea_level)?
              <div className="card">
                <h4>Sea Level</h4>
                <h2>{data.main.sea_level} Pa</h2>
              </div>:''
            }
            {
              (data.main.grnd_level)?
              <div className="card">
                <h4>Ground Level</h4>
                <h2>{data.main.grnd_level} Pa</h2>
              </div>:''
            }
          </>:''
        }
      </div>
    </div>:''
  )
}

export default TodayDisplay