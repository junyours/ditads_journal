<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use App\Models\BookCart;
use App\Models\BookPublication;
use App\Models\BookTransaction;
use App\Models\DeliveryAddress;
use App\Models\PaymentMethod;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function book()
    {
        $books = BookPublication::select(
            'id',
            'title',
            'cover_page',
            'cover_file_id',
            'author',
            'overview',
            'hard_price',
            'published_at'
        )
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('book/customer/book', [
            'books' => $books
        ]);
    }

    public function bookDetail($title, $author, $cover_file_id)
    {
        $book = BookPublication::select(
            'id',
            'title',
            'soft_isbn',
            'hard_isbn',
            'cover_page',
            'cover_file_id',
            'author',
            'overview',
            'hard_price',
            'published_at'
        )
            ->where('title', $title)
            ->where('author', $author)
            ->where('cover_file_id', $cover_file_id)
            ->first();

        if (!$book) {
            abort(404);
        }

        return Inertia::render('book/customer/book-detail', [
            'book' => $book
        ]);
    }

    public function profile()
    {
        return Inertia::render('book/customer/account/profile');
    }

    public function cart(Request $request)
    {
        $customer_id = $request->user()->id;

        $carts = BookCart::where('customer_id', $customer_id)
            ->with('book_publication')
            ->latest()
            ->get();

        return Inertia::render('book/customer/cart', [
            'carts' => $carts
        ]);
    }

    public function addCart(Request $request)
    {
        $customer_id = $request->user()->id;

        $existing = BookCart::where('customer_id', $customer_id)
            ->where('book_publication_id', $request->bookId)
            ->first();

        if ($existing) {
            $existing->increment('quantity');
        } else {
            BookCart::create([
                'customer_id' => $customer_id,
                'book_publication_id' => $request->bookId,
                'quantity' => 1
            ]);
        }
    }

    public function quantityIncrement(Request $request)
    {
        $cart = BookCart::findOrFail($request->cart_id);
        $cart->update([
            'quantity' => $cart->quantity + 1,
        ]);
    }

    public function quantityDecrement(Request $request)
    {
        $cart = BookCart::findOrFail($request->cart_id);

        if ($cart->quantity > 1) {
            $cart->update([
                'quantity' => $cart->quantity - 1,
            ]);
        }
    }

    public function removeCart($cart_id)
    {
        BookCart::findOrFail($cart_id)
            ->delete();
    }

    public function checkout(Request $request)
    {
        $customer_id = $request->user()->id;

        $items = BookCart::where('customer_id', $customer_id)
            ->with('book_publication')
            ->latest()
            ->get();

        $addresses = DeliveryAddress::where('customer_id', $customer_id)
            ->get();

        return Inertia::render('book/customer/checkout', [
            'items' => $items,
            'addresses' => $addresses
        ]);
    }

    public function addDeliveryAddress(Request $request)
    {
        $request->validate([
            'complete_address' => ['required'],
            'contact_number' => ['required'],
            'name' => ['required'],
            'postal_code' => ['required']
        ]);

        $customer_id = $request->user()->id;

        DeliveryAddress::create([
            'customer_id' => $customer_id,
            'complete_address' => $request->complete_address,
            'contact_number' => $request->contact_number,
            'name' => $request->name,
            'postal_code' => $request->postal_code
        ]);
    }

    public function updateDeliveryAddress(Request $request)
    {
        $address = DeliveryAddress::findOrFail($request->id);

        $request->validate([
            'complete_address' => ['required'],
            'contact_number' => ['required'],
            'name' => ['required'],
            'postal_code' => ['required']
        ]);

        $address->update([
            'complete_address' => $request->complete_address,
            'contact_number' => $request->contact_number,
            'name' => $request->name,
            'postal_code' => $request->postal_code
        ]);
    }

    public function deleteDeliveryAddress($address_id)
    {
        DeliveryAddress::findOrFail($address_id)
            ->delete();
    }

    public function validateCardInfo(Request $request)
    {
        $request->validate([
            'card_number' => ['required', 'digits_between:13,19'],
            'card_exp_month' => ['required', 'digits:2'],
            'card_exp_year' => ['required', 'digits:4'],
            'card_cvn' => ['required', 'digits_between:3,4'],
            'card_holder_first_name' => ['required'],
            'card_holder_last_name' => ['required'],
            'card_holder_email' => ['required', 'email'],
            'card_holder_phone_number' => ['required'],
        ], [
            'card_holder_first_name.required' => 'The first name field is required.',
            'card_holder_last_name.required' => 'The last name field is required.',
            'card_holder_email.required' => 'The email field is required.',
            'card_holder_phone_number.required' => 'The phone number field is required.'
        ]);
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

    public function buyBook($book_id)
    {
        BookPublication::findOrFail($book_id);

        return Inertia::render('book/customer/buy-book');
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
