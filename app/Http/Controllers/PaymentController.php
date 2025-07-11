<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GlennRaya\Xendivel\Xendivel;

class PaymentController extends Controller
{
    public function payCard(Request $request)
    {
        $response = Xendivel::payWithCard($request)
            ->getResponse();

        return $response;
    }

    public function payEwallet(Request $request)
    {
        $response = Xendivel::payWithEwallet($request)
            ->getResponse();

        return $response;
    }
}
