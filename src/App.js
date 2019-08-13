
import React from 'react';
import './App.css';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://api.openweathermap.org/data/2.5/weather?q=',
      city: 'dublin',
      input: '',
      api: '&units=metric&appid=bad16c77876c4fffcf2c6736381a980d',
      error: '',
      isLoaded: false,
      geolocationEnabled: false,
      temp: 0,
      location: '',
      weather_description: '',
      day: '',
      main: '',
      cod: '',
    };

    this.logValue = this.logValue.bind(this);
    this.enterValue = this.enterValue.bind(this);
  }  

  returnData() {
    const { url, city, api } = this.state;
    fetch(url + city + api)
    .then(res => res.json())
    .then(result => {
      if (result.cod === '404') {
        document.querySelector('.error').innerHTML = 'Please enter valid city name';
      } else {
        console.log(result);
        this.setState({
        isLoaded: true,
        temp: Math.floor(result.main.temp),
        location: result.name,
        weather_description: result.weather[0].description,
        main: result.weather[0].main,
      });
      document.querySelector('.error').innerHTML = ' ';
      document.querySelector('.input').focus();
      document.querySelector('.input').value = '';
      }
      }, (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  enterValue = e => {
    if (e.which === 13 ) {
      this.returnData();
    }
  }

  logValue = e => {
    if (e.target.value.length < 83) {
      this.setState({
        city: e.target.value,
      }, () => { 
        console.log(this.state.city);
      });
    }
  };
 
  componentWillMount() {
    const days_list = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
    const today = new Date();
    this.setState({
      day: days_list[today.getDay()],
    })
  }
  
  componentDidMount() {
    this.returnData();
  }
 
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {this.state.error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="mt-5">
          <Weather 
            temp={this.state.temp}
            location={this.state.location}
            weather_description={this.state.weather_description}
            day={this.state.day}
            main={this.state.main}
          />
           <input onChange={this.logValue} onKeyPress={this.enterValue} type="text" className="form-control input" placeholder="City name" required/>
           <h2 className="error text-center text-white">{this.state.error}</h2>
        </div>
      );
    }
  }

}

const Weather = props => {
  let urls = {
    cloud: require("./images/Cloud.svg"),
    cloudy: require("./images/Cloudy.svg"),
    foog: require("./images/Fog.svg"),
    rainy: require("./images/Rain.svg"),
    snowy: require("./images/Snow.svg"),
    storm: require("./images/Storm.svg"),
    sun: require("./images/Sun.svg"),
    wind: require("./images/Wind.svg"),
  }

  let currentWeather = null;

  if (props.main === 'Clear') {
    currentWeather = urls.sun
  } else if (props.main === 'Snow' ) {
    currentWeather = urls.snowy
  } else if (props.main === 'Clouds' ) {
    currentWeather = urls.cloud
  } else if (props.main === 'Rain' ) {
    currentWeather = urls.rainy
  } else if (props.main === 'Thunderstorm' ) {
    currentWeather = urls.storm
  } else {
    currentWeather = urls.foog
  }

  return (
    <div className="weather text-center mt-4">
      <h1 className="city">{props.location}</h1>
      <h1 className="day">{props.day}</h1>
      <div className="inline">
        <img className="weather-picture" src={currentWeather} alt="Weather icon" />
        <h1 className="weather-description">{props.weather_description}</h1>
      </div>
      <p className="temp">{props.temp}<sup className="celsius">°</sup></p>
    </div>
  );
}

export default App;
