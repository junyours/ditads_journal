<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use App\Models\BookPublication;
use App\Models\DeliveryAddress;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('book/customer/dashboard');
    }

    public function bookSale(Request $request)
    {
        $payments = PaymentMethod::get();

        $addresses = DeliveryAddress::where('customer_id', $request->user()->id)->get();

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
            'books' => $books,
            'payments' => $payments,
            'addresses' => $addresses
        ]);
    }

    public function addDeliveryAddress(Request $request)
    {
        $request->validate([
            'complete_address' => ['required'],
            'contact_number' => ['required']
        ]);

        DeliveryAddress::create([
            'customer_id' => $request->user()->id,
            'complete_address' => $request->complete_address,
            'contact_number' => $request->contact_number
        ]);
    }

    public function bookPurchase()
    {
        return Inertia::render('book/customer/purchase-book');
    }

    public function hardBookOrder()
    {
        return Inertia::render('book/customer/book-order');
    }
}
