<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\avatar;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class userAvatarController extends Controller
{
    public function __construct(){
        $this->middleware('auth:api');
    }

    public function index(){
        $Avatares = DB::table('avatars')->where('owner', auth('api')->user()->id)->get();
        $ret = array();
        for($i = 0; $i < $Avatares->count(); $i++){
            $ret[$i] = $Avatares[$i];
        }
        return response()->json($ret);
    }

    public function store(Request $request){
        
        $validatedData = $request->validate([
            'name' => ['required', 'unique:avatars'],
            'skin' => 'required',
            'hair' => 'required',
            'eyes' => 'required',
            'mouth' => 'required',
          ]);
       

          $avatar = avatar::create([
            'name' => $validatedData['name'],
            'skin' => $validatedData['skin'],
            'eyes' => $validatedData['eyes'],
            'hair' => $validatedData['hair'],
            'mouth' => $validatedData['mouth'],
            'owner' => auth('api')->user()->id
          ]);

        return response()->json($avatar->id);
       
      
        
    }

    public function show($id){
        $avatar = avatar::findOrFail($id);
        dd($id, $avatar);
        $owner = $avatar->owner;
        abort_if($owner != auth('api')->id(), 403,'se ha intentado acceder a un avatar que NO es del usuario logueado');
        return response()->json($avatar);
    }


    public function update(Request $request){
        $avatar = avatar::findOrFail($request->avatarId);
     
        $validatedData = $request->validate([
            'skin' => 'required',
            'hair' => 'required',
            'eyes' => 'required',
            'mouth' => 'required',
          ]);
        $avatar->skin=$validatedData['skin'];
        $avatar->eyes=$validatedData['eyes'];
        $avatar->hair=$validatedData['hair'];
        $avatar->mouth=$validatedData['mouth'];
        $avatar->save();
        return response()->json('avatar actualizado!');
    }

    public function getUserID(Request $request){
        
        $user = auth('api')->user();
        $ID = $user->id;
        return $ID; 
    }

    public function getResources(Request $request){
        $tipo = $request->tipo;
        $recursos = DB::table('attires')->where('type',$tipo)->get();
        $ret = array();
      
        for($i = 0; $i < $recursos->count(); $i++){
            $ret[$i] = $recursos[$i]->source;
        }
        return response()->json($ret);
    }

}
