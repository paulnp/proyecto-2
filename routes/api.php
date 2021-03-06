<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/{id}/avatars', 'userAvatarController@index');
Route::get('/{id}/avatars/{avatarId}','userAvatarController@show');
Route::post('/{id}/avatars', 'userAvatarController@store');
Route::put('/{id}/avatars/{avatarId}', 'userAvatarController@update');
Route::get('/user' ,'userAvatarController@getUserID');
Route::get('/recursos','userAvatarController@getResources');

