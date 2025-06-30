<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['user_id', 'payment_item_id', 'period', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentItem()
    {
        return $this->belongsTo(PaymentItem::class);
    }
}
