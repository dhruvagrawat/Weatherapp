import React, { useEffect, useCallback } from 'react'
import './Main.css'
import { getDayName } from './Helper/Helper'
import TodayDisplay from './TodayDisplay'

const WeekDisplay = ({ data, unit, tdate, tdata }) => {
  const onLoad = useCallback(() => {
    if (data.list === undefined) return;
    const arr = [];
    data.list.forEach((e, i) => {
      if (i === 0) arr.push(e);
      else {
        if (getDayName(e.dt_txt) !== getDayName(arr[arr.length - 1].dt_txt)) arr.push(e);
      }
    });
    data.list = arr;
  }, [data]);

  useEffect(() => {
    onLoad();
  }, [data, onLoad]);

  return (
    <div className="week">
      <div className="cards">
        {
          (data.list !== undefined && data.list.length < 10) ?
            data.list.map((e, i) => (
              <div key={i} className="card">
                <h3>{getDayName(e.dt_txt)}</h3>
                <img src={`http://openweathermap.org/img/w/${e.weather[0].icon}.png`} alt="" />
                <h4>{e.main.temp}&deg;{(unit === 'metric') ? 'C' : 'F'}</h4>
              </div>
            )) : ''
        }
      </div>
      <h3 className='highlight'>Today's Highlight</h3>
      <TodayDisplay unit={unit} data={tdata} date={tdate} highlight={true} />
    </div>
  )
}

export default WeekDisplay
