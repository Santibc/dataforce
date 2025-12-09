<?php

namespace Src\Application\Admin\User\Model;

use Maatwebsite\Excel\Concerns\ToModel;
use Spatie\LaravelData\Data;

class ExcelModel implements ToModel
{
    public function model(array $row)
    {
        /**
         * @param  array  $row
         * @return YourModel|null
         */
        // Define how to create a model from the Excel row data
        return new YourModel(
            $row[0],
            $row[1],
        );
    }
}

class YourModel extends Data
{
    public function __construct(
        public string $column1,
        public string $column2,
    ) {}
}
