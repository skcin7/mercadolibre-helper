<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MyResourceCollection extends ResourceCollection
{
    /**
     * Pagination data of the resource.
     *
     * @var array
     */
    protected $paginationData;

    /**
     * Create a new resource collection instance.
     *
     * @param  mixed  $resource
     * @return void
     */
    public function __construct($resource)
    {
        // If the resource collection uses pagination, manually set the collection and pagination data here.
        if(get_class($resource) === "Illuminate\Pagination\LengthAwarePaginator") {
            $this->paginationData = [
                'total' => $resource->total(),
                'count' => $resource->count(),
                'perPage' => $resource->perPage(),
                'currentPage' => $resource->currentPage(),
                'totalPages' => $resource->lastPage(),
            ];
            $resource = $resource->getCollection();
        }

        parent::__construct($resource);
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'records' => $this->collection,
            'pagination' => $this->when((bool) $this->paginationData, function() {
                return $this->paginationData;
            }),
        ];
    }

}
