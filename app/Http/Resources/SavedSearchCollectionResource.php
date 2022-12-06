<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SavedSearchCollectionResource extends MyResourceCollection
{
    /**
     * Transform the resource collection into an array.
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
