<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ParentInfoController;

Route::apiResource('roles', RoleController::class);
Route::apiResource('profiles', ProfileController::class);
Route::apiResource('parentinfo', ParentInfoController::class);

//Soft Deletes
Route::post('roles/{id}/restore', [RoleController::class, 'restore']);
Route::post('profiles/{id}/restore', [ProfileController::class, 'restore']);
Route::post('parentinfo/{id}/restore', [ParentInfoController::class, 'restore']);

/* Para ni sa  API it must have a controller before magset og API, Thanks*/

/* User Role Controller */
// Route::apiResource("", App\Http\Controllers\Controller::class);
// Route::post("", App\Http\Controllers\::class);
// Route::get("", App\Http\Controllers\::class);






//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
