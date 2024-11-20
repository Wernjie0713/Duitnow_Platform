<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['contact_us_id', 'user_id', 'comment'];

    public function contactUs()
    {
        return $this->belongsTo(ContactUs::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
