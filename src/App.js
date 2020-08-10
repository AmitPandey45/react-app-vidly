import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Movies from "./components/movies";
import NavBar from "./components/common/navBar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegistrationForm from "./components/registrationForm";
import "./App.css";

function App() {
  return (
    <main className="container">
      <NavBar />
      <Switch>
        <Route path="/registration" component={RegistrationForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/movies/:id" component={MovieForm} />
        <Route path="/movies" component={Movies} />
        {/* <Route path="/movies/new" component={MovieForm} /> */}
        <Route path="/customers" component={Customers} />
        <Route path="/rentals" component={Rentals} />
        <Route path="/not-found" component={NotFound} />
        <Redirect from="/" exact to="/movies" />
        <Redirect to="not-found" />
      </Switch>
    </main>
  );
}

export default App;
