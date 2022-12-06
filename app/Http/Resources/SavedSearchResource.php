<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SavedSearchResource extends MyResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->processResource([
            'id' => (int)$this->getAttribute('id'),
            'exists' => (bool)$this->exists,
            'mercadolibre_site_id' => (string) $this->getAttribute('mercadolibre_site_id'),
            'mercadolibre_catalog_id' => (string) $this->getAttribute('mercadolibre_catalog_id'),
            'keywords' => (string) $this->getAttribute('keywords'),
            'title_must_contain' => (string) $this->getAttribute('title_must_contain'),
            'title_must_not_contain' => (string) $this->getAttribute('title_must_not_contain'),
            'system_group' => (string) $this->getAttribute('system_group'),
            'automatic_searching_enabled' => (bool) $this->getAttribute('automatic_searching_enabled'),
            'alerts_enabled' => (bool) $this->getAttribute('alerts_enabled'),
            'last_searched_at' => $this->getAttribute('last_searched_at'),
        ]);
    }
}
