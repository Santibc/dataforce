<?php

namespace Src\Application\Admin\User\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Exceptions\NoTypeDetectedException;
use Maatwebsite\Excel\Facades\Excel;
use Src\Application\Admin\User\Data\ImportUserData;
use Src\Application\Admin\User\Data\SyncUserData;
use Src\Application\Admin\User\Model\ExcelModel;

class ImportUserController
{
    public function sync(SyncUserData $request): void
    {
        Excel::import(new ImportUserData, $request->file);
    }

    //    public function import(Request $request)
    //    {
    //        if ($request->hasFile('file')) {
    //            $file = $request->file('file');
    //            $originalName = $file->getClientOriginalName();
    //            $extension = $file->getClientOriginalExtension();
    //
    //            try {
    //                $excel = Excel::import(new ExcelModel(), request()->file('file'));
    //            } catch (NoTypeDetectedException $e) {
    //                dd($e->getMessage());
    //            } catch (\Exception $e) {
    //                dd($e->getMessage());
    //            }
    //            return response()->json([
    //                'message' => 'Archivo procesado correctamente',
    //                'path' => $originalName,
    //                'extension' => $extension
    //            ]);
    //        } else {
    //            return response()->json(['error' => 'No se proporcionó ningún archivo'], 400);
    //        }
    //    }
}
