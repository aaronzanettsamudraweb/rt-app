<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = ['house_number', 'is_occupied'];

    public function residents()
    {
        return $this->hasMany(HouseResident::class);
    }
}
