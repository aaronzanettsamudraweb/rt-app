<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\PaymentItem;
use App\Models\User;
use App\Models\HouseResident;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['user', 'paymentItem'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_item_id' => 'required|exists:payment_items,id',
            'period' => 'required|date_format:Y-m-d', // gunakan tanggal 1 setiap bulan, contoh: 2025-06-01
            'status' => 'in:lunas,belum'
        ]);

        $payment = Payment::create([
            'user_id' => $data['user_id'],
            'payment_item_id' => $data['payment_item_id'],
            'period' => $data['period'],
            'status' => $data['status'] ?? 'lunas',
        ]);

        return response()->json($payment->load(['user', 'paymentItem']), 201);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['user', 'paymentItem']);
    }

    public function update(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'payment_item_id' => 'sometimes|exists:payment_items,id',
            'period' => 'sometimes|date_format:Y-m-d',
            'status' => 'in:lunas,belum'
        ]);

        $payment->update($data);

        return $payment->load(['user', 'paymentItem']);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->noContent();
    }

    public function summary(Request $request)
    {
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);
        $period = sprintf('%04d-%02d-01', $year, $month);

        $paymentItems = PaymentItem::all()->keyBy('id');

        // Penghuni aktif (bisa dari relasi houseResidents)
        $users = \App\Models\User::with(['houseResidents.house'])->get()->filter(function ($user) {
            return $user->houseResidents->last(); // ambil yang aktif
        });

        $result = $users->map(function ($user) use ($paymentItems, $period) {
            $payments = \App\Models\Payment::where('user_id', $user->id)
                ->where('period', $period)
                ->get()
                ->keyBy('payment_item_id');

            $paymentStatus = [];

            foreach ($paymentItems as $itemId => $item) {
                $payment = $payments->get($itemId);
                $status = $payment ? $payment->status : 'belum';

                $paymentStatus[] = [
                    'payment_item_id' => $itemId,
                    'status' => $status,
                    'payment_item' => $item,
                ];
            }

            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'house' => optional($user->houseResidents->last()->house)->only('house_number'),
                ],
                'payments' => $paymentStatus,
            ];
        });

        return response()->json($result);
    }
}
