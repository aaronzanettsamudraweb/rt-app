<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseResident extends Model
{
    protected $fillable = ['house_id', 'user_id', 'start_date', 'end_date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function house()
    {
        return $this->belongsTo(House::class);
    }
}
