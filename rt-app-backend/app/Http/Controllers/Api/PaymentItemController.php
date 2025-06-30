<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentItem;

class PaymentItemController extends Controller
{
    public function index()
    {
        return PaymentItem::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:payment_items,name',
            'amount' => 'required|integer|min:0',
        ]);

        $item = PaymentItem::create($data);
        return response()->json($item, 201);
    }

    public function show(PaymentItem $paymentItem)
    {
        return $paymentItem;
    }

    public function update(Request $request, PaymentItem $paymentItem)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|unique:payment_items,name,' . $paymentItem->id,
            'amount' => 'sometimes|integer|min:0',
        ]);

        $paymentItem->update($data);
        return $paymentItem;
    }

    public function destroy(PaymentItem $paymentItem)
    {
        $paymentItem->delete();
        return response()->noContent();
    }
}
