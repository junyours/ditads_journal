<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use App\Models\BookPublication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('book/customer/dashboard');
    }

    public function bookSale()
    {
        $books = BookPublication::select(
            'id',
            'title',
            'soft_isbn',
            'hard_isbn',
            'cover_page',
            'author',
            'overview',
            'published_at',
            'doi',
            'overview_pdf_file',
            'hard_price',
            'soft_price'
        )->get();

        return Inertia::render('book/customer/sale-book', [
            'books' => $books
        ]);
    }

    public function bookPurchase()
    {
        return Inertia::render('book/customer/purchase-book');
    }
}
