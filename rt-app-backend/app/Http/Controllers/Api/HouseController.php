<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index()
    {
        return House::with(['residents.user'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'house_number' => 'required|string|unique:houses,house_number',
            'is_occupied' => 'boolean'
        ]);

        $house = House::create($data);
        return response()->json($house, 201);
    }

    public function show(House $house)
    {
        $house->load(['residents.user']);
        return $house;
    }

    public function update(Request $request, House $house)
    {
        $data = $request->validate([
            'house_number' => 'sometimes|string|unique:houses,house_number,' . $house->id,
            'is_occupied' => 'boolean'
        ]);

        $house->update($data);
        return $house;
    }

    public function destroy(House $house)
    {
        $house->delete();
        return response()->noContent();
    }
}
