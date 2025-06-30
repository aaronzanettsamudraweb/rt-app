<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class User extends Model
{
    protected $fillable = [
        'name', 'ktp_photo', 'status', 'phone', 'marital_status'
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function activeHouseResident()
    {
        return $this->hasOne(HouseResident::class)->latestOfMany();
    }

    public function activeHouse()
    {
        return $this->hasOneThrough(
            House::class,
            HouseResident::class,
            'user_id',      // FK HouseResident ke User
            'id',           // FK House ke House
            'id',           // PK User
            'house_id'      // FK HouseResident ke House
        )->whereNull('end_date') // hanya yang belum selesai
        ->latestOfMany();       // ambil yang terbaru (kalau ada lebih dari 1)
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
