import React, { useState, useCallback } from "react"
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'

function App() {

  const [icon, setIcon] = useState("")
  const [response, setResponse] = useState(null)

  // we pass fetchApi function as an argument to debounce function
  const debounce = (func) => {
    let timer;
    return (...args) => {
       // after 1000ms func is executed, if input is changed before 1000ms, then again timer is set back to 0 Second.
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args)
      }, 1000);

    };
  };

  const fetchApi = async (e) => {
    const { value } = e.target;
    let resp = null;
    resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=8749322928173dcab9e5d15a35aea5cc`).catch(() => setResponse(null));
    setResponse(resp);
    if (resp != null) {
      var iconcode = resp.data.weather[0].icon;
      setIcon("http://openweathermap.org/img/w/" + iconcode + ".png")
    }
  }

  //on every render debounce returns a new function, to avoid this, we use useCallback.
  //useCallback provides the memoized callback.
  const optimisedVersion = useCallback(debounce(fetchApi), []);

  return (
    <div>

      <h1 className="heading"> WEATHER APP</h1>

      <div className="container d-flex justify-content-center">
        <div className="weather">

          <input className="col-xs-4 input" onChange={optimisedVersion} />

          {!response ? (<h2 style={{ textAlign: "center", marginTop: "10px" }}>Enter city name</h2>) :
            (<div className="card"> <span className="icon"><img className="img-fluid" src={icon} alt="img" /></span>
              <div className="title">
                <h1>{response.data.name}</h1>
              </div>
              <div className="temp">{response.data.main.temp}<sup>&deg;</sup>C</div>
              <div className="row">
                <div className="col-4">
                  <div className="header">General</div>
                  <div className="value">{response.data.weather[0].main}</div>
                </div>
                <div className="col-4">
                  <div className="header">Min Temp</div>
                  <div className="value">{response.data.main.temp_min}</div>
                </div>
                <div className="col-4">
                  <div className="header">Max Temp</div>
                  <div className="value">{response.data.main.temp_max}</div>
                </div>
              </div>
            </div>)}

        </div>
      </div>
    </div>

  );
}

export default App;
