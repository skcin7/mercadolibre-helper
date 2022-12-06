<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

//    /**
//     * Show the application dashboard.
//     *
//     * @return \Illuminate\Contracts\Support\Renderable
//     */
//    public function index()
//    {
//        return view('home');
//    }

    /**
     * Show the Account Home page.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function index(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('home', [
            //
        ], ['title_suffix' => 'Home']);
    }



}
