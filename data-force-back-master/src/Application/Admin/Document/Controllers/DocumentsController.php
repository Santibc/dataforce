<?php

namespace Src\Application\Admin\Document\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Document\Data\UpdateDocumentData;
use Src\Application\Admin\Document\Resources\DocumentListResource;
use Src\Application\Admin\Document\Resources\DocumentResource;
use Src\Domain\Document\Models\Document;

class DocumentsController
{
    public function update(UpdateDocumentData $data, Document $document): JsonResponse
    {
        if ($document->company_id != auth()->user()->company_id) {
            return response()->json(status: JsonResponse::HTTP_NOT_FOUND);
        }

        $document->update([
            'name' => $data->name,
        ]);

        return response()->json(status: JsonResponse::HTTP_NO_CONTENT);
    }

    public function show(Document $document)
    {
        if ($document->company_id != auth()->user()->company_id) {
            return response()->json(status: JsonResponse::HTTP_NOT_FOUND);
        }

        return DocumentResource::from($document);
    }

    public function index()
    {
        $documents = Document::where('company_id', auth()->user()->company_id)->get();

        return DocumentListResource::collection($documents);
    }

    public function download(Document $document)
    {
        if ($document->company_id != auth()->user()->company_id) {
            return response()->json(status: JsonResponse::HTTP_NOT_FOUND);
        }

        return $document->getFile();
    }

    public function destroy(Document $document): void
    {
        DB::transaction(function () use ($document): void {
            $document->delete();
            // todo delete associated performances
        });
    }
}
