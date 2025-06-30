<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HouseResident;
use App\Models\House;
use Illuminate\Http\Request;

class HouseResidentController extends Controller
{
    public function index()
    {
        return HouseResident::with(['user', 'house'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $resident = HouseResident::create($data);

        // Update status rumah menjadi dihuni
        $house = House::find($data['house_id']);
        $house->is_occupied = true;
        $house->save();

        return response()->json($resident->load(['user', 'house']), 201);
    }

    public function show(HouseResident $houseResident)
    {
        return $houseResident->load(['user', 'house']);
    }

    public function update(Request $request, HouseResident $houseResident)
    {
        $data = $request->validate([
            'house_id' => 'sometimes|exists:houses,id',
            'user_id' => 'sometimes|exists:users,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $houseResident->update($data);

        // Update status rumah jika end_date diberikan
        if ($request->has('end_date')) {
            $house = House::find($houseResident->house_id);
            $isStillOccupied = HouseResident::where('house_id', $houseResident->house_id)
                ->whereNull('end_date')
                ->exists();
            $house->is_occupied = $isStillOccupied;
            $house->save();
        }

        return $houseResident->load(['user', 'house']);
    }

    public function destroy(HouseResident $houseResident)
    {
        $house_id = $houseResident->house_id;
        $houseResident->delete();

        // Periksa apakah masih ada penghuni aktif
        $isStillOccupied = HouseResident::where('house_id', $house_id)
            ->whereNull('end_date')
            ->exists();

        House::where('id', $house_id)->update([
            'is_occupied' => $isStillOccupied,
        ]);

        return response()->noContent();
    }
}
