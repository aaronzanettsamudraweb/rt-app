<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::orderBy('date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|integer|min:0',
            'date' => 'required|date',
        ]);

        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        return $expense;
    }

    public function update(Request $request, Expense $expense)
    {
        $data = $request->validate([
            'description' => 'sometimes|required|string',
            'amount' => 'sometimes|required|integer|min:0',
            'date' => 'sometimes|required|date',
        ]);

        $expense->update($data);
        return $expense;
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->noContent();
    }
}
