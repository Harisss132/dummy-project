import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const fetcher = (url) => api.get(url).then((res) => res.data);

function Dashboard() {
    const [page, setPage] = useState(1);
    // State untuk form movie
    const [movieForm, setMovieForm] = useState({
        title: '',
        director: '',
        year: '',
        genre: '',
        rating: ''
    });
    // State untuk edit mode
    const [editId, setEditId] = useState(null);
    const [formError, setFormError] = useState('');
    // State untuk modal
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    //Menggunakan SWR untuk fetch data dengan pagination
    const { data, error, isLoading } = useSWR(`/movies?page=${page}&limit=5`, fetcher);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Handler untuk input form
    const handleFormChange = (e) => {
        setMovieForm({
            ...movieForm,
            [e.target.name]: e.target.value
        });
    };

    // Handler buka modal add
    const handleShowAdd = () => {
        setEditId(null);
        setMovieForm({ title: '', director: '', year: '', genre: '', rating: '' });
        setFormError('');
        setShowForm(true);
    };

    // Handler buka modal edit
    const handleEditClick = (movie) => {
        setEditId(movie.id);
        setMovieForm({
            title: movie.title,
            director: movie.director,
            year: movie.year,
            genre: movie.genre,
            rating: movie.rating
        });
        setFormError('');
        setShowForm(true);
    };

    // Handler submit form (add/edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!movieForm.title || !movieForm.director || !movieForm.year || !movieForm.genre || !movieForm.rating) {
            setFormError('All fields are required');
            return;
        }
        try {
            if (editId) {
                await api.put(`/movies/${editId}`, movieForm);
            } else {
                await api.post('/movies', movieForm);
            }
            setEditId(null);
            setMovieForm({ title: '', director: '', year: '', genre: '', rating: '' });
            setShowForm(false);
            mutate(`/movies?page=${page}&limit=5`);
        } catch (error) {
            setFormError('Failed to save movie');
        }
    };

    // Handler batal
    const handleCancel = () => {
        setEditId(null);
        setMovieForm({ title: '', director: '', year: '', genre: '', rating: '' });
        setFormError('');
        setShowForm(false);
    };

    const deleteMovie = async (id) => {
        if (window.confirm("Are you sure you want to delete this movie?")) {
            try {
                await api.delete(`/movies/${id}`);
                //Meninta SWR untuk refetch data setelah di hapus
                mutate(`/movies?page=${page}&limit=5`);
            } catch (error) {
                console.error("Failed to delete movie", error);
            }
        }
    };

    if(isLoading) return <div className="text-center mt-10">Loading...</div>;
    if(error) return <div className="text-center mt-10 text-red-500">Failed to load data. Please try again.</div>

    const { data: movies, pagination } = data;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Movie Dashboard</h1>
                <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                    Logout
                </button>
            </div>

            {/* Tombol Add Movie */}
            <div className="mb-4">
                <button onClick={handleShowAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Movie</button>
            </div>

            {/* Floating Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Movie' : 'Add Movie'}</h2>
                        {formError && <div className="mb-2 text-red-500">{formError}</div>}
                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-3">
                            <input name="title" value={movieForm.title} onChange={handleFormChange} placeholder="Title" className="border p-2 rounded" />
                            <input name="director" value={movieForm.director} onChange={handleFormChange} placeholder="Director" className="border p-2 rounded" />
                            <input name="year" value={movieForm.year} onChange={handleFormChange} placeholder="Year" className="border p-2 rounded" type="number" />
                            <input name="genre" value={movieForm.genre} onChange={handleFormChange} placeholder="Genre" className="border p-2 rounded" />
                            <input name="rating" value={movieForm.rating} onChange={handleFormChange} placeholder="Rating" className="border p-2 rounded" type="number" min="0" max="10" step="0.1" />
                            <div className="flex space-x-2 mt-2">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editId ? 'Update' : 'Add'}</button>
                                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                            </div>
                        </form>
                        <button onClick={handleCancel} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Title</th>
                            <th className="px-4 py-2 border">Director</th>
                            <th className="px-4 py-2 border">Year</th>
                            <th className="px-4 py-2 border">Genre</th>
                            <th className="px-4 py-2 border">Rating</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies && movies.map((movie) => (
                            <tr key={movie.id} className="text-center">
                                <td className="px-4 py-2 border">{movie.title}</td>
                                <td className="px-4 py-2 border">{movie.director}</td>
                                <td className="px-4 py-2 border">{movie.year}</td>
                                <td className="px-4 py-2 border">{movie.genre}</td>
                                <td className="px-4 py-2 border">{movie.rating}</td>
                                <td className="px-2 py-2 border space-x-2">
                                    <button onClick={() => handleEditClick(movie)} className="px-2 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                                    <button onClick={() => deleteMovie(movie.id)} className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls*/}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
                Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
                Next
                </button>
            </div>
        </div>
    );
}

export default Dashboard;