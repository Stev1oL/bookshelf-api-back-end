/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

// function untuk menambah data buku
const addBookHandler = (request, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    // jika tidak terdapat nama buku
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // jika nilai readPage lebih besar dari pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    // memasukkan buku ke dalam array
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // jika sukses memasukkan buku
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Something Wrong On Server',
    });
    response.code(500);
    return response;
  }
};

// function untuk menampilkan semua buku
const getAllBookHandler = (request, h) => {
  try {
    // membuat limit tampilan query buku menjadi 3
    const {limit = 3} = request.query;
    const limitBooks = books.slice(0, limit).map(({id, name, publisher}) => ({id, name, publisher}));

    const response = h.response({
      status: 'success',
      data: {
        books: limitBooks,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Something Wrong On Server',
    });
    response.code(500);
    return response;
  }
};

// function untuk menampilkan buku tertentu sesuai dengan ID
const getBookByIdHandler = (request, h) => {
  try {
    const {bookId} = request.params;

    const bookIndex = books.find((b) => b.id === bookId);

    // jika ID tidak ditemukan
    if (bookIndex !== undefined) {
      // menampilkan data buku secara detail sesuai ID tertentu
      const response = h.response({
        status: 'success',
        data: {
          book: bookIndex,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Something Wrong On Server',
    });
    response.code(500);
    return response;
  }
};

// function untuk mengubah data buku sesuai ID tertentu
const editBookByIdHandler = (request, h) => {
  try {
    const {bookId} = request.params;

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      // finished,
      reading,
      // insertedAt,
    //   updatedAt,
    } = request.payload;

    const updatedAt = new Date().toISOString();

    // mencari ID buku
    const bookIndex = books.findIndex((b) => b.id === bookId);

    // jika index buku tdak ditemukan
    if (bookIndex === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    // jika tidak terdapat nama buku
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // jika nilai readPage lebih besar dari pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    // memperbarui/mengubah data buku
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      // finished,
      reading,
      // insertedAt,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book: books[bookIndex],
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Something Wrong On Server',
    });
    response.code(500);
    return response;
  }
};

// function untuk menghapus buku sesuai ID tertentu
const deleteBookByIdHandler = (request, h) => {
  try {
    const {bookId} = request.params;

    const bookIndex = books.findIndex((b) => b.id === bookId);

    // jika ID buku tidak ditemukan
    if (bookIndex === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    // menghapus buku
    books.splice(bookIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Something Wrong On Server',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
