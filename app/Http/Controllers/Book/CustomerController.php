<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
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
        return Inertia::render('book/customer/sale-book');
    }

    public function bookPurchase()
    {
        return Inertia::render('book/customer/purchase-book');
    }
}
