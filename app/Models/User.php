<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use CanResetPassword;

    const DEFAULT_MERCADOLIBRE_API = '{"authorization": null}';

    const DEFAULT_NOTIFICATION_CHANNELS = '{"email": []}';

    /**
     * The model's default values for attributes.
     * @var array
     */
    protected $attributes = [
        'is_mastermind' => false,
        'is_admin' => false,
        'mercadolibre_api' => self::DEFAULT_MERCADOLIBRE_API,
        'notification_channels' => self::DEFAULT_NOTIFICATION_CHANNELS,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'mercadolibre_api',
        'notification_channels',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_mastermind' => 'boolean',
        'is_admin' => 'boolean',
        'mercadolibre_api' => 'json',
        'notification_channels' => 'json',
    ];

    /**
     * Determine if the user is a mastermind (global admin).
     * @return bool
     */
    public function isMastermind(): bool
    {
        return (bool)$this->getAttribute('is_mastermind');
    }

    /**
     * Determine if the user is an administrator.
     * @return bool
     */
    public function isAdmin(): bool
    {
        return (bool)$this->getAttribute('is_admin');
    }

    /**
     * The list of saved searches that the user has.
     * @return HasMany
     */
    public function savedSearches(): HasMany
    {
        return $this->hasMany('App\Models\SavedSearch');
    }


}
