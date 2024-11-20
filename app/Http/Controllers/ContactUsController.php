<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Silber\Bouncer\BouncerFacade;
use App\Models\Comment;

class ContactUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('ContactUs/Index', [
            'messages' => ContactUs::with(['user', 'comments.user'])->where('user_id', auth()->id())->latest()->get(),
            'adminMessages' => ContactUs::with(['user', 'comments.user'])->latest()->get(),
            'isAdmin' => BouncerFacade::is(auth()->user())->an('admin'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);
 
        $request->user()->contactus()->create($validated);
 
        return redirect(route('contactus.index'));
    }

    public function storeComment(Request $request, ContactUs $contactUs)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:500',
        ]);

        $contactUs->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactUs $contactUs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactUs $contactUs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactUs $contactUs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactUs $contactUs)
    {
        //
    }
}
