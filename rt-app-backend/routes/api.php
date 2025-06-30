<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\HouseResidentController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentItemController;
use App\Http\Controllers\Api\ExpenseController;

Route::apiResource('users', UserController::class);
Route::apiResource('houses', HouseController::class);
Route::apiResource('house-residents', HouseResidentController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('payment-items', PaymentItemController::class);
Route::apiResource('expenses', ExpenseController::class);

Route::get('/payment-summary', [PaymentController::class, 'summary']);