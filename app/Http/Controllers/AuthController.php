<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Profile;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    /**
     * Handle login request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $ret = [
            'success' => false,
            'message' => 'Username or password is in correct'
        ];

        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        try {
            $credentialsEmail = [
                'username' => $request->username,
                'password' => $request->password
            ];

            if (auth()->attempt($credentialsEmail)) {
                $user = auth()->user();
                $token = $user->createToken(date('Y') . 'ipt2')->accessToken;


                $profile = Profile::where('user_id', $user->id)->first();
                $role = Role::find($user->role_id);

                $user['profile'] = $profile;

                $ret = [
                    'success' => true,
                    'message' => 'Success',
                    'token' => $token,
                    'role' => $role?->role_name,
                    'user_id' => $user->id,  // user_id from Profile model
                    'profile_id' => $profile->id,  // profile_id from Profile model,
                    'data' => $user
                ];
            }
        } catch (\Throwable $th) {
            $ret['message'] = 'Username or password is in correct';
        }

        return response()->json($ret, 200);
    }


    /**
     * Handle logout request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // Check if the user is authenticated
        if ($request->user()) {
            // Revoke (delete) the current access token
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }


    /**
     * Get the authenticated user details.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        // Return authenticated user data
        return response()->json($request->user());
    }
}
