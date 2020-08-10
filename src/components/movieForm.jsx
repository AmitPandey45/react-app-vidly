import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenres } from "../services/fakeGenreService";
import { getMovie, saveMovie } from "./../services/fakeMovieService";

class MovieForm extends Form {
  state = {
    data: {
      _id: "",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    errors: {},
    genres: [],
  };

  componentDidMount() {
    const genres = getGenres();
    const { match } = this.props;
    let data = { ...this.state.data };

    if (match.params.id !== "new") {
      const movie = getMovie(match.params.id);
      movie.genreId = movie.genre._id;
      delete movie.genre;
      data = { ...movie };
    } else {
      data.genreId = genres[0]._id;
    }
    console.log(this.state.data);
    this.setState({ data, genres });
  }

  handleGenreChange = (e) => {
    const { value } = e.target;
    const data = { ...this.state.data };
    data.genreId = value;
    console.log(this.state.data);
    this.setState({ data });
  };

  schema = {
    _id: Joi.string().allow(null, ""),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().allow(null, ""),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required()
      .label("Number in Stock")
      .options({
        language: {
          string: {
            min: "must be larger than or equal to 0",
          },
          string: {
            max: "must be less than or equal to 100",
          },
          any: { required: "must be a number" },
        },
      }),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate")
      .options({
        language: {
          string: {
            min: "must be larger than or equal to 0",
          },
          string: {
            min: "must be must be less than or equal to 10",
          },
          any: {
            required: "must be a number",
          },
        },
      }),
  };

  doSubmit = () => {
    console.log("Movie Form");
    const data = { ...this.state.data };
    console.log(data);
    data.numberInStock = Number(data.numberInStock);
    data.dailyRentalRate = Number(data.dailyRentalRate);
    saveMovie(data);
    this.props.history.push("/movies");
  };

  render() {
    const { genres, data } = this.state;
    return (
      <div>
        <h1>Movie</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select
              className="form-control"
              id="genre"
              name="genre"
              onChange={this.handleGenreChange}
              value={data.genreId}
            >
              {genres.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          {this.renderInput("numberInStock", "Number in Stock")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
