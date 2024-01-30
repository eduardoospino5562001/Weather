import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
const APIkey = '52b3a505c891ff65551fd5fe19412cc5';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [textInput, settextInput] = useState('');
  const [finder, setfinder] = useState();
  const [hasError, sethasError] = useState(false);

  const success = position => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    setCoords(obj);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
     
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}`;
      
      axios.get(url)
        .then(res => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
          };
          setTemp(obj);
          sethasError(false);
          setWeather(res.data);
        })
        .catch(err => {
          sethasError(true);
          console.log(err);
        })
        .finally(()=>{
          setisLoading(false); 
        })
    }
  }, [coords]);

  useEffect(() => {
    if (textInput) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}`;
      axios.get(url)
      .then(res => {  
        const obj = {
          celsius: (res.data.main.temp - 273.15).toFixed(2),
          fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
        };
        setTemp(obj);
        sethasError(false);
        setfinder(res.data)
      })
      
      .catch(err=>{
        sethasError(true);
        console.log(err);
      });
    }
  }, [textInput]);
  
  console.log(finder);

  return (
    <div className='app'>
      {
        isLoading ?
          <h2>Loading...</h2>
        :
        textInput ?
          <WeatherCard 
            weather={finder}
            temp={temp}
            settextInput={settextInput}
            hasError={hasError}
          />
        :
        <WeatherCard 
          weather={weather}
          temp={temp}
          settextInput={settextInput}
          hasError={hasError}
          />
      }
    </div>
  )
}

export default App;
