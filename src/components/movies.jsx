import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Movies extends Component {
  onPageLoadSelectedGenre = { _id: "", name: "All Genres" };

  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    selectedGenre: this.onPageLoadSelectedGenre,
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [this.state.selectedGenre, ...data];
    const { data: movies } = await getMovies();

    this.setState({ movies, genres });
  }

  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, searchQuery: "" });
  };

  handleSort = (sortColumn) => {
    console.log(sortColumn);
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: this.onPageLoadSelectedGenre,
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies,
    } = this.state;

    let filteredMovies = allMovies;
    if (searchQuery)
      filteredMovies = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filteredMovies = allMovies.filter(
        (m) => m.genre._id === selectedGenre._id
      );

    const sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filteredMovies.length, data: movies };
  };

  render() {
    const { movies, searchQuery } = this.state;
    const { totalCount, data } = this.getPagedData();
    const {
      currentPage,
      pageSize,
      genres: allGenres,
      selectedGenre,
      sortColumn,
    } = this.state;
    const { user } = this.props;

    //if (movies.count === 0) return <p>There are no movies in the database.</p>;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={allGenres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <p>Showing {totalCount} movies in the database.</p>
          <MoviesTable
            movies={data}
            sortColumn={sortColumn}
            onSort={this.handleSort}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
          />
          <Pagination
            itemsCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
