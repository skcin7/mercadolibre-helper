<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class MyResource extends JsonResource
{
    /**
     * Process the resource with hidden and whitelisted fields.
     *
     * @param array $data
     * @return array
     */
    protected function processResource(array $data)
    {

//        if(isset($this->deleted_at) && $this->deleted_at) {
//            $data['deleted_at'] = $this->deleted_at;
//        }

        // Attach created at/updated at datetime fields if they are present:
        if(isset($this->created_at) && $this->created_at) {
            $data['created_at'] = $this->getAttribute('created_at');
        }

        if(isset($this->updated_at) && $this->updated_at) {
            $data['updated_at'] = $this->getAttribute('updated_at');
        }

        // Return final data to be attached to the API resource:
        return $data;
    }

    public static function collection($resource)
    {
        if(get_class($resource) === "Illuminate\Pagination\LengthAwarePaginator") {
            return [
                "pagination" => [
                    'total' => $resource->total(),
                    'count' => $resource->count(),
                    'perPage' => $resource->perPage(),
                    'currentPage' => $resource->currentPage(),
                    'totalPages' => $resource->lastPage(),
                ],
                "records" => tap(new AnonymousResourceCollection($resource, static::class), function ($collection) {
                    if (property_exists(static::class, 'preserveKeys')) {
                        $collection->preserveKeys = (new static([]))->preserveKeys === true;
                    }
                })
            ];
        }

        return tap(new AnonymousResourceCollection($resource, static::class), function ($collection) {
            if (property_exists(static::class, 'preserveKeys')) {
                $collection->preserveKeys = (new static([]))->preserveKeys === true;
            }
        });
    }
}
