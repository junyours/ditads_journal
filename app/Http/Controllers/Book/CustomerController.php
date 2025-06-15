<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use App\Models\BookPublication;
use App\Models\BookTransaction;
use App\Models\DeliveryAddress;
use App\Models\PaymentMethod;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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
        )->withExists([
                    'book_transaction as has_transaction' => function ($query) use ($request) {
                        $query->where('customer_id', $request->user()->id);
                    }
                ])
            ->get();

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

    public function payBook(Request $request)
    {
        $request->validate([
            'reference_number' => ['required'],
            'receipt' => ['required', 'mimes:jpeg,jpg,png', 'max:2048'],
        ]);

        $book = BookPublication::where('id', $request->book_publication_id)->first();

        if ($request->hasFile('receipt')) {
            $uploadedReceipt = Cloudinary::uploadApi()->upload(
                $request->file('receipt')->getRealPath(),
                [
                    'folder' => 'ditads/payment_methods/receipt',
                ]
            );

            $receipt = $uploadedReceipt['secure_url'];
        }

        if ($request->type === "hard_bound") {
            BookTransaction::create([
                'customer_id' => $request->user()->id,
                'book_publication_id' => $request->book_publication_id,
                'payment_method_id' => $request->payment_method_id,
                'amount' => floatval($book->hard_price) * $request->quantity,
                'type' => 'hard_bound',
                'reference_number' => $request->reference_number,
                'receipt_image' => $receipt,
                'delivery_address_id' => $request->delivery_address_id,
                'status' => 'pending',
                'quantity' => $request->quantity
            ]);
        } else if ($request->type === "soft_bound") {
            BookTransaction::create([
                'customer_id' => $request->user()->id,
                'book_publication_id' => $request->book_publication_id,
                'payment_method_id' => $request->payment_method_id,
                'amount' => $book->soft_price,
                'type' => 'soft_bound',
                'reference_number' => $request->reference_number,
                'receipt_image' => $receipt,
                'status' => 'pending',
            ]);
        }
    }

    public function bookPurchase()
    {
        return Inertia::render('book/customer/purchase-book');
    }

    public function hardBookOrder(Request $request)
    {
        $orders = BookTransaction::where('customer_id', $request->user()->id)
            ->where('type', 'hard_bound')
            ->with('book_publication')
            ->get();

        return Inertia::render('book/customer/book-orders/hard-bound', [
            'orders' => $orders
        ]);
    }

    public function softBookOrder(Request $request)
    {
        $orders = BookTransaction::where('customer_id', $request->user()->id)
            ->where('type', 'soft_bound')
            ->with('book_publication')
            ->get();

        return Inertia::render('book/customer/book-orders/soft-bound', [
            'orders' => $orders
        ]);
    }
}
